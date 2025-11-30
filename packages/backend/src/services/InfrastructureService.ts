import { InfrastructureMetric } from '../types/models';
import { query, queryMany, queryOne } from '../db/query';

export class InfrastructureService {
  /**
   * Record a new infrastructure metric
   */
  async recordMetric(metric: Omit<InfrastructureMetric, 'id'>): Promise<InfrastructureMetric> {
    const result = await queryOne<any>(
      `INSERT INTO infrastructure_metrics (
        timestamp, metric_type, power_source, power_status,
        internet_download_speed, internet_upload_speed, internet_latency, internet_status,
        temperature, humidity, occupancy
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        metric.timestamp,
        metric.metricType,
        metric.powerSource,
        metric.powerStatus,
        metric.internetSpeed?.download || null,
        metric.internetSpeed?.upload || null,
        metric.internetSpeed?.latency || null,
        metric.internetStatus,
        metric.temperature,
        metric.humidity,
        metric.occupancy,
      ]
    );

    return this.mapToMetric(result);
  }

  /**
   * Get latest metric by type
   */
  async getLatestMetric(metricType: InfrastructureMetric['metricType']): Promise<InfrastructureMetric | null> {
    const result = await queryOne<any>(
      `SELECT * FROM infrastructure_metrics 
       WHERE metric_type = $1 
       ORDER BY timestamp DESC 
       LIMIT 1`,
      [metricType]
    );

    return result ? this.mapToMetric(result) : null;
  }

  /**
   * Get metrics within a time range
   */
  async getMetricsInRange(
    metricType: InfrastructureMetric['metricType'],
    startTime: Date,
    endTime: Date
  ): Promise<InfrastructureMetric[]> {
    const results = await queryMany<any>(
      `SELECT * FROM infrastructure_metrics 
       WHERE metric_type = $1 
       AND timestamp >= $2 
       AND timestamp <= $3
       ORDER BY timestamp ASC`,
      [metricType, startTime, endTime]
    );

    return results.map(this.mapToMetric);
  }

  /**
   * Calculate power uptime percentage for a period
   */
  async calculatePowerUptime(startTime: Date, endTime: Date): Promise<number> {
    const result = await queryOne<any>(
      `SELECT 
        COUNT(*) FILTER (WHERE power_status = 'online') as online_count,
        COUNT(*) as total_count
       FROM infrastructure_metrics 
       WHERE metric_type = 'power'
       AND timestamp >= $1 
       AND timestamp <= $2`,
      [startTime, endTime]
    );

    if (!result || result.total_count === 0) {
      return 0;
    }

    return (parseFloat(result.online_count) / parseFloat(result.total_count)) * 100;
  }

  /**
   * Calculate internet uptime percentage for a period
   */
  async calculateInternetUptime(startTime: Date, endTime: Date): Promise<number> {
    const result = await queryOne<any>(
      `SELECT 
        COUNT(*) FILTER (WHERE internet_status = 'online') as online_count,
        COUNT(*) as total_count
       FROM infrastructure_metrics 
       WHERE metric_type = 'internet'
       AND timestamp >= $1 
       AND timestamp <= $2`,
      [startTime, endTime]
    );

    if (!result || result.total_count === 0) {
      return 0;
    }

    return (parseFloat(result.online_count) / parseFloat(result.total_count)) * 100;
  }

  /**
   * Detect power failover events
   */
  async detectPowerFailover(timeWindowSeconds: number = 10): Promise<Array<{
    failureTime: Date;
    recoveryTime: Date;
    failoverDuration: number;
  }>> {
    const results = await queryMany<any>(
      `WITH power_changes AS (
        SELECT 
          timestamp,
          power_status,
          power_source,
          LAG(power_status) OVER (ORDER BY timestamp) as prev_status,
          LAG(power_source) OVER (ORDER BY timestamp) as prev_source
        FROM infrastructure_metrics
        WHERE metric_type = 'power'
        AND timestamp >= NOW() - INTERVAL '1 day'
        ORDER BY timestamp
      )
      SELECT 
        timestamp as failure_time,
        LEAD(timestamp) OVER (ORDER BY timestamp) as recovery_time
      FROM power_changes
      WHERE prev_status = 'online' 
      AND power_status IN ('offline', 'switching')
      AND EXTRACT(EPOCH FROM (LEAD(timestamp) OVER (ORDER BY timestamp) - timestamp)) <= $1`,
      [timeWindowSeconds]
    );

    return results.map(r => ({
      failureTime: r.failure_time,
      recoveryTime: r.recovery_time,
      failoverDuration: r.recovery_time 
        ? (new Date(r.recovery_time).getTime() - new Date(r.failure_time).getTime()) / 1000
        : 0,
    }));
  }

  /**
   * Get current infrastructure status
   */
  async getCurrentStatus(): Promise<{
    power: InfrastructureMetric | null;
    internet: InfrastructureMetric | null;
    environmental: InfrastructureMetric | null;
  }> {
    const [power, internet, environmental] = await Promise.all([
      this.getLatestMetric('power'),
      this.getLatestMetric('internet'),
      this.getLatestMetric('environmental'),
    ]);

    return { power, internet, environmental };
  }

  /**
   * Check if internet speed meets minimum requirements
   */
  async checkInternetSpeedCompliance(minDownload: number = 50, minUpload: number = 25): Promise<{
    compliant: boolean;
    currentDownload: number | null;
    currentUpload: number | null;
  }> {
    const latest = await this.getLatestMetric('internet');

    if (!latest || !latest.internetSpeed) {
      return { compliant: false, currentDownload: null, currentUpload: null };
    }

    const compliant = 
      latest.internetSpeed.download >= minDownload &&
      latest.internetSpeed.upload >= minUpload;

    return {
      compliant,
      currentDownload: latest.internetSpeed.download,
      currentUpload: latest.internetSpeed.upload,
    };
  }

  /**
   * Map database row to InfrastructureMetric
   */
  private mapToMetric(row: any): InfrastructureMetric {
    return {
      id: row.id,
      timestamp: row.timestamp,
      metricType: row.metric_type,
      powerSource: row.power_source,
      powerStatus: row.power_status,
      internetSpeed: row.internet_download_speed ? {
        download: parseFloat(row.internet_download_speed),
        upload: parseFloat(row.internet_upload_speed),
        latency: parseFloat(row.internet_latency),
      } : null,
      internetStatus: row.internet_status,
      temperature: row.temperature ? parseFloat(row.temperature) : null,
      humidity: row.humidity ? parseFloat(row.humidity) : null,
      occupancy: row.occupancy,
    };
  }
}

export default new InfrastructureService();
