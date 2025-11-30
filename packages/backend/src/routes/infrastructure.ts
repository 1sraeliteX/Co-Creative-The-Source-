import { Router } from 'express';
import InfrastructureService from '../services/InfrastructureService';
import AlertService from '../services/AlertService';

const router = Router();

/**
 * GET /api/infrastructure/status
 * Get current infrastructure status
 */
router.get('/status', async (req, res) => {
  try {
    const status = await InfrastructureService.getCurrentStatus();
    const alerts = AlertService.getActiveAlerts();

    res.json({
      status,
      alerts,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching infrastructure status:', error);
    res.status(500).json({ error: 'Failed to fetch infrastructure status' });
  }
});

/**
 * POST /api/infrastructure/metrics
 * Record a new infrastructure metric
 */
router.post('/metrics', async (req, res) => {
  try {
    const { metricType, powerSource, powerStatus, internetSpeed, internetStatus, temperature, humidity, occupancy } = req.body;

    const metric = await InfrastructureService.recordMetric({
      timestamp: new Date(),
      metricType,
      powerSource: powerSource || null,
      powerStatus: powerStatus || 'online',
      internetSpeed: internetSpeed || null,
      internetStatus: internetStatus || 'online',
      temperature: temperature || null,
      humidity: humidity || null,
      occupancy: occupancy || null,
    });

    // Check for alerts
    let alerts: any[] = [];
    if (metricType === 'power') {
      alerts = AlertService.checkPowerMetrics(metric);
    } else if (metricType === 'internet') {
      alerts = AlertService.checkInternetMetrics(metric);
    } else if (metricType === 'environmental') {
      alerts = AlertService.checkEnvironmentalMetrics(metric);
    }

    res.status(201).json({ metric, alerts });
  } catch (error) {
    console.error('Error recording metric:', error);
    res.status(500).json({ error: 'Failed to record metric' });
  }
});

/**
 * GET /api/infrastructure/metrics/:type
 * Get metrics by type within a time range
 */
router.get('/metrics/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { startTime, endTime } = req.query;

    if (!startTime || !endTime) {
      return res.status(400).json({ error: 'startTime and endTime are required' });
    }

    const metrics = await InfrastructureService.getMetricsInRange(
      type as any,
      new Date(startTime as string),
      new Date(endTime as string)
    );

    res.json({ metrics });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

/**
 * GET /api/infrastructure/uptime/power
 * Get power uptime percentage
 */
router.get('/uptime/power', async (req, res) => {
  try {
    const { startTime, endTime } = req.query;

    if (!startTime || !endTime) {
      return res.status(400).json({ error: 'startTime and endTime are required' });
    }

    const uptime = await InfrastructureService.calculatePowerUptime(
      new Date(startTime as string),
      new Date(endTime as string)
    );

    res.json({ 
      uptime: uptime.toFixed(2),
      meetsRequirement: uptime >= 99.5,
      requirement: 99.5,
    });
  } catch (error) {
    console.error('Error calculating power uptime:', error);
    res.status(500).json({ error: 'Failed to calculate power uptime' });
  }
});

/**
 * GET /api/infrastructure/uptime/internet
 * Get internet uptime percentage
 */
router.get('/uptime/internet', async (req, res) => {
  try {
    const { startTime, endTime } = req.query;

    if (!startTime || !endTime) {
      return res.status(400).json({ error: 'startTime and endTime are required' });
    }

    const uptime = await InfrastructureService.calculateInternetUptime(
      new Date(startTime as string),
      new Date(endTime as string)
    );

    res.json({ 
      uptime: uptime.toFixed(2),
      meetsRequirement: uptime >= 99.5,
      requirement: 99.5,
    });
  } catch (error) {
    console.error('Error calculating internet uptime:', error);
    res.status(500).json({ error: 'Failed to calculate internet uptime' });
  }
});

/**
 * GET /api/infrastructure/failover/power
 * Get power failover events
 */
router.get('/failover/power', async (req, res) => {
  try {
    const { timeWindowSeconds = 10 } = req.query;

    const failovers = await InfrastructureService.detectPowerFailover(
      parseInt(timeWindowSeconds as string)
    );

    res.json({ 
      failovers,
      count: failovers.length,
    });
  } catch (error) {
    console.error('Error detecting power failovers:', error);
    res.status(500).json({ error: 'Failed to detect power failovers' });
  }
});

/**
 * GET /api/infrastructure/compliance/internet-speed
 * Check internet speed compliance
 */
router.get('/compliance/internet-speed', async (req, res) => {
  try {
    const compliance = await InfrastructureService.checkInternetSpeedCompliance();

    res.json(compliance);
  } catch (error) {
    console.error('Error checking internet speed compliance:', error);
    res.status(500).json({ error: 'Failed to check internet speed compliance' });
  }
});

/**
 * GET /api/infrastructure/alerts
 * Get active alerts
 */
router.get('/alerts', (req, res) => {
  try {
    const alerts = AlertService.getActiveAlerts();
    res.json({ alerts });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

export default router;
