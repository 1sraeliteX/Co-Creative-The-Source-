import { Router } from 'express';
import MembershipService from '../services/MembershipService';

const router = Router();

/**
 * POST /api/members/register
 * Register a new member
 */
router.post('/register', async (req, res) => {
  try {
    const { email, name, phone, password, membershipTier, skills, interests, bio, portfolio } = req.body;

    if (!email || !name || !phone || !password || !membershipTier) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const member = await MembershipService.registerMember({
      email,
      name,
      phone,
      password,
      membershipTier,
      skills,
      interests,
      bio,
      portfolio,
    });

    // Don't return password in response
    const { ...memberData } = member;

    res.status(201).json({ member: memberData });
  } catch (error) {
    console.error('Error registering member:', error);
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Failed to register member',
    });
  }
});

/**
 * GET /api/members/:id
 * Get member by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const member = await MembershipService.getMember(id);

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json({ member });
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({ error: 'Failed to fetch member' });
  }
});

/**
 * GET /api/members
 * Get all members
 */
router.get('/', async (req, res) => {
  try {
    const { email, accessCardId } = req.query;

    if (email) {
      const member = await MembershipService.getMemberByEmail(email as string);
      return res.json({ member });
    }

    if (accessCardId) {
      const member = await MembershipService.getMemberByAccessCard(accessCardId as string);
      return res.json({ member });
    }

    const members = await MembershipService.getAllMembers();
    res.json({ members });
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

/**
 * PATCH /api/members/:id/profile
 * Update member profile
 */
router.patch('/:id/profile', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, skills, interests, bio, portfolio } = req.body;

    const member = await MembershipService.updateProfile(id, {
      name,
      phone,
      skills,
      interests,
      bio,
      portfolio,
    });

    res.json({ member });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Failed to update profile',
    });
  }
});

/**
 * POST /api/members/:id/upgrade
 * Upgrade membership tier
 */
router.post('/:id/upgrade', async (req, res) => {
  try {
    const { id } = req.params;
    const { newTier } = req.body;

    if (!newTier) {
      return res.status(400).json({ error: 'New tier is required' });
    }

    const member = await MembershipService.upgradeMembership(id, newTier);

    res.json({ member });
  } catch (error) {
    console.error('Error upgrading membership:', error);
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Failed to upgrade membership',
    });
  }
});

/**
 * POST /api/members/:id/renew
 * Renew membership
 */
router.post('/:id/renew', async (req, res) => {
  try {
    const { id } = req.params;
    const member = await MembershipService.renewMembership(id);

    res.json({ member });
  } catch (error) {
    console.error('Error renewing membership:', error);
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Failed to renew membership',
    });
  }
});

/**
 * POST /api/members/:id/suspend
 * Suspend membership
 */
router.post('/:id/suspend', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const member = await MembershipService.suspendMembership(id, reason);

    res.json({ member });
  } catch (error) {
    console.error('Error suspending membership:', error);
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Failed to suspend membership',
    });
  }
});

/**
 * POST /api/members/:id/scholarship
 * Apply scholarship to member
 */
router.post('/:id/scholarship', async (req, res) => {
  try {
    const { id } = req.params;
    const member = await MembershipService.applyScholarship(id);

    res.json({ member });
  } catch (error) {
    console.error('Error applying scholarship:', error);
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Failed to apply scholarship',
    });
  }
});

/**
 * DELETE /api/members/:id/scholarship
 * Remove scholarship from member
 */
router.delete('/:id/scholarship', async (req, res) => {
  try {
    const { id } = req.params;
    const member = await MembershipService.removeScholarship(id);

    res.json({ member });
  } catch (error) {
    console.error('Error removing scholarship:', error);
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Failed to remove scholarship',
    });
  }
});

/**
 * POST /api/members/:id/storage
 * Assign storage unit to member
 */
router.post('/:id/storage', async (req, res) => {
  try {
    const { id } = req.params;
    const { unitNumber } = req.body;

    if (!unitNumber) {
      return res.status(400).json({ error: 'Unit number is required' });
    }

    const member = await MembershipService.assignStorageUnit(id, unitNumber);

    res.json({ member });
  } catch (error) {
    console.error('Error assigning storage unit:', error);
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Failed to assign storage unit',
    });
  }
});

/**
 * GET /api/members/search/skills
 * Search members by skills
 */
router.get('/search/skills', async (req, res) => {
  try {
    const { skills } = req.query;

    if (!skills) {
      return res.status(400).json({ error: 'Skills parameter is required' });
    }

    const skillsArray = (skills as string).split(',').map(s => s.trim());
    const members = await MembershipService.searchBySkills(skillsArray);

    res.json({ members });
  } catch (error) {
    console.error('Error searching by skills:', error);
    res.status(500).json({ error: 'Failed to search by skills' });
  }
});

/**
 * GET /api/members/search/interests
 * Search members by interests
 */
router.get('/search/interests', async (req, res) => {
  try {
    const { interests } = req.query;

    if (!interests) {
      return res.status(400).json({ error: 'Interests parameter is required' });
    }

    const interestsArray = (interests as string).split(',').map(i => i.trim());
    const members = await MembershipService.searchByInterests(interestsArray);

    res.json({ members });
  } catch (error) {
    console.error('Error searching by interests:', error);
    res.status(500).json({ error: 'Failed to search by interests' });
  }
});

/**
 * GET /api/members/tiers
 * Get membership tier information
 */
router.get('/tiers', (req, res) => {
  try {
    const tiers = MembershipService.getMembershipTiers();
    res.json({ tiers });
  } catch (error) {
    console.error('Error fetching tiers:', error);
    res.status(500).json({ error: 'Failed to fetch tiers' });
  }
});

export default router;
