import { Router } from 'express';
import WorkspaceRepository from '../repositories/WorkspaceRepository';
import BookingService from '../services/BookingService';

const router = Router();

/**
 * GET /api/workspaces
 * Get all workspaces
 */
router.get('/', async (req, res) => {
  try {
    const { type, available } = req.query;

    let workspaces;
    if (type) {
      workspaces = await WorkspaceRepository.findByType(type as any);
    } else if (available === 'true') {
      workspaces = await WorkspaceRepository.findAvailable();
    } else {
      workspaces = await WorkspaceRepository.findAll();
    }

    res.json({ workspaces });
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    res.status(500).json({ error: 'Failed to fetch workspaces' });
  }
});

/**
 * GET /api/workspaces/:id
 * Get workspace by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const workspace = await WorkspaceRepository.findById(id);

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    res.json({ workspace });
  } catch (error) {
    console.error('Error fetching workspace:', error);
    res.status(500).json({ error: 'Failed to fetch workspace' });
  }
});

/**
 * GET /api/workspaces/:id/availability
 * Get workspace availability with current booking status
 */
router.get('/:id/availability', async (req, res) => {
  try {
    const { id } = req.params;
    const { startTime, endTime } = req.query;

    const workspace = await WorkspaceRepository.findById(id);
    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    // Get current active booking
    const activeBooking = await BookingService.getActiveBooking(id);

    // If time range provided, check availability for that period
    let futureAvailability = null;
    if (startTime && endTime) {
      futureAvailability = await BookingService.checkAvailability(
        id,
        new Date(startTime as string),
        new Date(endTime as string)
      );
    }

    res.json({
      workspace,
      currentlyBooked: activeBooking !== null,
      activeBooking,
      futureAvailability,
    });
  } catch (error) {
    console.error('Error checking workspace availability:', error);
    res.status(500).json({ error: 'Failed to check workspace availability' });
  }
});

/**
 * POST /api/workspaces
 * Create a new workspace
 */
router.post('/', async (req, res) => {
  try {
    const {
      name,
      type,
      capacity,
      hourlyRate,
      dailyRate,
      monthlyRate,
      amenities,
      equipment,
      floor,
      isAvailable,
      maintenanceStatus,
    } = req.body;

    if (!name || !type || !capacity || hourlyRate === undefined || dailyRate === undefined || monthlyRate === undefined || floor === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const workspace = await WorkspaceRepository.create({
      name,
      type,
      capacity,
      hourlyRate,
      dailyRate,
      monthlyRate,
      amenities: amenities || [],
      equipment: equipment || [],
      floor,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      maintenanceStatus: maintenanceStatus || 'operational',
    });

    res.status(201).json({ workspace });
  } catch (error) {
    console.error('Error creating workspace:', error);
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Failed to create workspace' 
    });
  }
});

/**
 * PATCH /api/workspaces/:id
 * Update a workspace
 */
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const workspace = await WorkspaceRepository.update(id, updates);

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    res.json({ workspace });
  } catch (error) {
    console.error('Error updating workspace:', error);
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Failed to update workspace' 
    });
  }
});

/**
 * DELETE /api/workspaces/:id
 * Delete a workspace
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await WorkspaceRepository.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    res.json({ message: 'Workspace deleted successfully' });
  } catch (error) {
    console.error('Error deleting workspace:', error);
    res.status(500).json({ error: 'Failed to delete workspace' });
  }
});

export default router;
