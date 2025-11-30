/**
 * IoT Sensor Simulator for testing infrastructure monitoring
 * This simulates power, internet, and environmental sensors
 */

import InfrastructureService from '../services/InfrastructureService';
import AlertService from '../services/AlertService';

export class IoTSimulator {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;

  /**
   * Start simulating sensor data
   */
  start(intervalMs: number = 10000) {
    if (this.isRunning) {
      console.log('IoT Simulator is already running');
      return;
    }

    this.isRunning = true;
    console.log('Starting IoT Simulator...');

    this.intervalId = setInterval(async () => {
      await this.simulateSensors();
    }, intervalMs);

    // Run immediately
    this.simulateSensors();
  }

  /**
   * Stop simulating sensor data
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.isRunning = false;
      console.log('IoT Simulator stopped');
    }
  }

  /**
   * Simulate all sensors
   */
  private async simulateSensors() {
    try {
      await Promise.all([
        this.simulatePowerSensor(),
        this.simulateInternetSensor(),
        this.simulateEnvironmentalSensor(),
      ]);
    } catch (error) {
      console.error('Error simulating sensors:', error);
    }
  }

  /**
   * Simulate power sensor
   */
  private async simulatePowerSensor() {
    // 99.5% chance of being online (to meet uptime requirement)
    const isOnline = Math.random() < 0.995;
    const powerSource = isOnline 
      ? (Math.random() < 0.95 ? 'grid' : 'generator')
      : 'battery';

    const metric = await InfrastructureService.recordMetric({
      timestamp: new Date(),
      metricType: 'power',
      powerSource,
      powerStatus: isOnline ? 'online' : 'offline',
      internetSpeed: null,
      internetStatus: 'online',
      temperature: null,
      humidity: null,
      occupancy: null,
    });

    const alerts = AlertService.checkPowerMetrics(metric);
    if (alerts.length > 0) {
      console.log('Power alerts:', alerts.map(a => a.message));
    }
  }

  /**
   * Simulate internet sensor
   */
  private async simulateInternetSensor() {
    // 99.5% chance of being online
    const isOnline = Math.random() < 0.995;
    
    // Simulate speeds (normally above requirements with some variation)
    const baseDownload = 50 + Math.random() * 50; // 50-100 Mbps
    const baseUpload = 25 + Math.random() * 25;   // 25-50 Mbps
    
    const download = isOnline ? baseDownload : 0;
    const upload = isOnline ? baseUpload : 0;
    const latency = isOnline ? 10 + Math.random() * 40 : 0; // 10-50ms

    const metric = await InfrastructureService.recordMetric({
      timestamp: new Date(),
      metricType: 'internet',
      powerSource: null,
      powerStatus: 'online',
      internetSpeed: {
        download,
        upload,
        latency,
      },
      internetStatus: isOnline ? 'online' : 'offline',
      temperature: null,
      humidity: null,
      occupancy: null,
    });

    const alerts = AlertService.checkInternetMetrics(metric);
    if (alerts.length > 0) {
      console.log('Internet alerts:', alerts.map(a => a.message));
    }
  }

  /**
   * Simulate environmental sensor
   */
  private async simulateEnvironmentalSensor() {
    // Simulate temperature (20-28°C normally)
    const temperature = 20 + Math.random() * 8;
    
    // Simulate humidity (40-60% normally)
    const humidity = 40 + Math.random() * 20;
    
    // Simulate occupancy (0-50 people)
    const occupancy = Math.floor(Math.random() * 50);

    const metric = await InfrastructureService.recordMetric({
      timestamp: new Date(),
      metricType: 'environmental',
      powerSource: null,
      powerStatus: 'online',
      internetSpeed: null,
      internetStatus: 'online',
      temperature,
      humidity,
      occupancy,
    });

    const alerts = AlertService.checkEnvironmentalMetrics(metric);
    if (alerts.length > 0) {
      console.log('Environmental alerts:', alerts.map(a => a.message));
    }
  }
}

export default new IoTSimulator();
