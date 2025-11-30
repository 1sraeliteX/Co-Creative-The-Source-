import { InfrastructureMetric } from '../types/models';

export interface Alert {
  id: string;
  type: 'power' | 'internet' | 'environmental';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export class AlertService {
  private alerts: Map<string, Alert> = new Map();
  private listeners: Array<(alert: Alert) => void> = [];

  /**
   * Check power metrics and generate alerts
   */
  checkPowerMetrics(metric: InfrastructureMetric): Alert[] {
    const alerts: Alert[] = [];

    if (metric.powerStatus === 'offline') {
      alerts.push(this.createAlert(
        'power-offline',
        'power',
        'critical',
        'Power system is offline. Running on backup power.'
      ));
    } else if (metric.powerStatus === 'switching') {
      alerts.push(this.createAlert(
        'power-switching',
        'power',
        'warning',
        'Power system is switching between sources.'
      ));
    } else {
      this.resolveAlert('power-offline');
      this.resolveAlert('power-switching');
    }

    return alerts;
  }

  /**
   * Check internet metrics and generate alerts
   */
  checkInternetMetrics(metric: InfrastructureMetric): Alert[] {
    const alerts: Alert[] = [];

    if (metric.internetStatus === 'offline') {
      alerts.push(this.createAlert(
        'internet-offline',
        'internet',
        'critical',
        'Internet connection is offline.'
      ));
    } else if (metric.internetStatus === 'degraded') {
      alerts.push(this.createAlert(
        'internet-degraded',
        'internet',
        'warning',
        'Internet connection is degraded.'
      ));
    } else {
      this.resolveAlert('internet-offline');
      this.resolveAlert('internet-degraded');
    }

    // Check speed requirements
    if (metric.internetSpeed) {
      if (metric.internetSpeed.download < 50) {
        alerts.push(this.createAlert(
          'internet-slow-download',
          'internet',
          'warning',
          `Download speed (${metric.internetSpeed.download} Mbps) below minimum requirement (50 Mbps).`
        ));
      } else {
        this.resolveAlert('internet-slow-download');
      }

      if (metric.internetSpeed.upload < 25) {
        alerts.push(this.createAlert(
          'internet-slow-upload',
          'internet',
          'warning',
          `Upload speed (${metric.internetSpeed.upload} Mbps) below minimum requirement (25 Mbps).`
        ));
      } else {
        this.resolveAlert('internet-slow-upload');
      }
    }

    return alerts;
  }

  /**
   * Check environmental metrics and generate alerts
   */
  checkEnvironmentalMetrics(metric: InfrastructureMetric): Alert[] {
    const alerts: Alert[] = [];

    if (metric.temperature !== null) {
      if (metric.temperature > 30) {
        alerts.push(this.createAlert(
          'temperature-high',
          'environmental',
          'warning',
          `Temperature is high (${metric.temperature}°C). Consider cooling.`
        ));
      } else if (metric.temperature < 15) {
        alerts.push(this.createAlert(
          'temperature-low',
          'environmental',
          'info',
          `Temperature is low (${metric.temperature}°C).`
        ));
      } else {
        this.resolveAlert('temperature-high');
        this.resolveAlert('temperature-low');
      }
    }

    if (metric.humidity !== null) {
      if (metric.humidity > 70) {
        alerts.push(this.createAlert(
          'humidity-high',
          'environmental',
          'warning',
          `Humidity is high (${metric.humidity}%). Risk of equipment damage.`
        ));
      } else {
        this.resolveAlert('humidity-high');
      }
    }

    return alerts;
  }

  /**
   * Create or update an alert
   */
  private createAlert(
    id: string,
    type: Alert['type'],
    severity: Alert['severity'],
    message: string
  ): Alert {
    const existing = this.alerts.get(id);
    
    if (existing && !existing.resolved) {
      return existing;
    }

    const alert: Alert = {
      id,
      type,
      severity,
      message,
      timestamp: new Date(),
      resolved: false,
    };

    this.alerts.set(id, alert);
    this.notifyListeners(alert);
    
    return alert;
  }

  /**
   * Resolve an alert
   */
  private resolveAlert(id: string): void {
    const alert = this.alerts.get(id);
    if (alert && !alert.resolved) {
      alert.resolved = true;
      this.notifyListeners(alert);
    }
  }

  /**
   * Get all active alerts
   */
  getActiveAlerts(): Alert[] {
    return Array.from(this.alerts.values()).filter(a => !a.resolved);
  }

  /**
   * Subscribe to alert notifications
   */
  subscribe(listener: (alert: Alert) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(alert: Alert): void {
    this.listeners.forEach(listener => {
      try {
        listener(alert);
      } catch (error) {
        console.error('Error notifying alert listener:', error);
      }
    });
  }
}

export default new AlertService();
