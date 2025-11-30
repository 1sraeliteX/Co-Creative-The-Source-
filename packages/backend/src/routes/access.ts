import { Router } from 'express';
import AccessControlService from '../services/AccessControlService';

const router = Router();

/**
 * POST /api/access/verify
 * Verify access attempt
 */
router.post('/verify', async (req, res) => {
  try {
    const { identifier, accessMethod, workspaceId } = req.body;

    if (!identifier || !accessMethod) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await AccessControlService.verifyAccess({
      identifier,
      accessMethod,
      workspaceId,
    });

    res.json(result);
  } catch (error) {
    console.error('Error verifying access:', error);
    res.status(500).json({ error: 'Failed to verify access' });
  }
});

/**
 * POST /api/access/exit
 * Log exit for an access log
 */
router.post('/exit', async (req, res) => {
  try {
    const { accessLogId } = req.body;

    if (!accessLogId) {
      return res.status(400).json({ error: 'Access log ID is required' });
    }

    const accessLog = await AccessControlService.logExit(accessLogId);

    if (!accessLog) {
      return res.status(404).json({ error: 'Access log not found' });
    }

    res.json({ accessLog });
  } catch (error) {
    console.error('Error logging exit:', error);
    res.status(500).json({ error: 'Failed to log exit' });
  }
});

/**
 * GET /api/access/history/member/:memberId
 * Get member's access history
 */
router.get('/history/member/:memberId', async (req, res) => {
  try {
    const { memberId } = req.params;
    const { limit } = req.query;

    const history = await AccessControlService.getMemberAccessHistory(
      memberId,
      limit ? parseInt(limit as string) : undefined
    );

    res.json({ history });
  } catch (error) {
    console.error('Error fetching member access history:', error);
    res.status(500).json({ error: 'Failed to fetch access history' });
  }
});

/**
 * GET /api/access/history/workspace/:workspaceId
 * Get workspace access history
 */
router.get('/history/workspace/:workspaceId', async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { limit } = req.query;

    const history = await AccessControlService.getWorkspaceAccessHistory(
      workspaceId,
      limit ? parseInt(limit as string) : undefined
    );

    res.json({ history });
  } catch (error) {
    console.error('Error fetching workspace access history:', error);
    res.status(500).json({ error: 'Failed to fetch access history' });
  }
});

/**
 * GET /api/access/occupants
 * Get current occupants in facility
 */
router.get('/occupants', async (req, res) => {
  try {
    const occupants = await AccessControlService.getCurrentOccupants();

    res.json({ occupants, count: occupants.length });
  } catch (error) {
    console.error('Error fetching current occupants:', error);
    res.status(500).json({ error: 'Failed to fetch current occupants' });
  }
});

/**
 * GET /api/access/statistics
 * Get access statistics for a time period
 */
router.get('/statistics', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }

    const statistics = await AccessControlService.getAccessStatistics(
      new Date(startDate as string),
      new Date(endDate as string)
    );

    res.json({ statistics });
  } catch (error) {
    console.error('Error fetching access statistics:', error);
    res.status(500).json({ error: 'Failed to fetch access statistics' });
  }
});

/**
 * POST /api/access/revoke
 * Revoke access for a member (emergency)
 */
router.post('/revoke', async (req, res) => {
  try {
    const { memberId, reason } = req.body;

    if (!memberId || !reason) {
      return res.status(400).json({ error: 'Member ID and reason are required' });
    }

    await AccessControlService.revokeAccess(memberId, reason);

    res.json({ message: 'Access revoked successfully' });
  } catch (error) {
    console.error('Error revoking access:', error);
    res.status(500).json({ error: 'Failed to revoke access' });
  }
});

export default router;
