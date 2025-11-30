import { Member } from '../types/models';
import MemberRepository from '../repositories/MemberRepository';
import { transaction } from '../db/query';
import bcrypt from 'bcrypt';

export interface MemberRegistration {
  email: string;
  name: string;
  phone: string;
  password: string;
  membershipTier: Member['membershipTier'];
  skills?: string[];
  interests?: string[];
  bio?: string;
  portfolio?: string;
}

export interface MembershipTierInfo {
  tier: Member['membershipTier'];
  name: string;
  monthlyPrice: number;
  features: string[];
}

export class MembershipService {
  private readonly MEMBERSHIP_TIERS: MembershipTierInfo[] = [
    {
      tier: 'trial',
      name: 'Trial',
      monthlyPrice: 0,
      features: ['4-hour workspace access', 'Basic amenities', 'Community access'],
    },
    {
      tier: 'basic',
      name: 'Basic',
      monthlyPrice: 50,
      features: [
        'Unlimited workspace access',
        'Workshop attendance',
        'Community platform access',
        'Basic support',
      ],
    },
    {
      tier: 'pro',
      name: 'Pro',
      monthlyPrice: 100,
      features: [
        'All Basic features',
        'Priority workspace booking',
        'Cloud computing credits',
        'API access',
        'Priority support',
        'Meeting room discounts',
      ],
    },
    {
      tier: 'enterprise',
      name: 'Enterprise',
      monthlyPrice: 200,
      features: [
        'All Pro features',
        'Dedicated workspace',
        'Custom integrations',
        'Team management',
        '24/7 support',
        'Private event hosting',
      ],
    },
  ];

  /**
   * Register a new member
   */
  async registerMember(data: MemberRegistration): Promise<Member> {
    return transaction(async () => {
      // Check if email already exists
      const existing = await MemberRepository.findByEmail(data.email);
      if (existing) {
        throw new Error('Email already registered');
      }

      // Generate unique access card ID
      const accessCardId = this.generateAccessCardId();

      // Calculate expiry date based on tier
      const expiryDate = this.calculateExpiryDate(data.membershipTier);

      // Create member
      const member = await MemberRepository.create({
        email: data.email,
        name: data.name,
        phone: data.phone,
        membershipTier: data.membershipTier,
        membershipStatus: 'active',
        joinDate: new Date(),
        expiryDate,
        skills: data.skills || [],
        interests: data.interests || [],
        bio: data.bio || '',
        portfolio: data.portfolio || '',
        accessCardId,
        storageUnitNumber: null,
        scholarshipStatus: false,
      });

      return member;
    });
  }

  /**
   * Update member profile
   */
  async updateProfile(
    memberId: string,
    updates: Partial<Pick<Member, 'name' | 'phone' | 'skills' | 'interests' | 'bio' | 'portfolio'>>
  ): Promise<Member> {
    const member = await MemberRepository.findById(memberId);
    if (!member) {
      throw new Error('Member not found');
    }

    const updatedMember = await MemberRepository.update(memberId, updates);
    if (!updatedMember) {
      throw new Error('Failed to update profile');
    }

    return updatedMember;
  }

  /**
   * Upgrade membership tier
   */
  async upgradeMembership(memberId: string, newTier: Member['membershipTier']): Promise<Member> {
    const member = await MemberRepository.findById(memberId);
    if (!member) {
      throw new Error('Member not found');
    }

    // Validate tier upgrade
    const currentTierIndex = this.MEMBERSHIP_TIERS.findIndex(t => t.tier === member.membershipTier);
    const newTierIndex = this.MEMBERSHIP_TIERS.findIndex(t => t.tier === newTier);

    if (newTierIndex <= currentTierIndex) {
      throw new Error('Can only upgrade to a higher tier');
    }

    // Update membership
    const updatedMember = await MemberRepository.update(memberId, {
      membershipTier: newTier,
      expiryDate: this.calculateExpiryDate(newTier),
    });

    if (!updatedMember) {
      throw new Error('Failed to upgrade membership');
    }

    return updatedMember;
  }

  /**
   * Renew membership
   */
  async renewMembership(memberId: string): Promise<Member> {
    const member = await MemberRepository.findById(memberId);
    if (!member) {
      throw new Error('Member not found');
    }

    const newExpiryDate = this.calculateExpiryDate(member.membershipTier, member.expiryDate);

    const updatedMember = await MemberRepository.update(memberId, {
      membershipStatus: 'active',
      expiryDate: newExpiryDate,
    });

    if (!updatedMember) {
      throw new Error('Failed to renew membership');
    }

    return updatedMember;
  }

  /**
   * Suspend membership
   */
  async suspendMembership(memberId: string, reason?: string): Promise<Member> {
    const member = await MemberRepository.findById(memberId);
    if (!member) {
      throw new Error('Member not found');
    }

    const updatedMember = await MemberRepository.update(memberId, {
      membershipStatus: 'suspended',
    });

    if (!updatedMember) {
      throw new Error('Failed to suspend membership');
    }

    console.log(`Membership suspended for ${member.email}. Reason: ${reason || 'Not specified'}`);

    return updatedMember;
  }

  /**
   * Apply scholarship to member
   */
  async applyScholarship(memberId: string): Promise<Member> {
    const member = await MemberRepository.findById(memberId);
    if (!member) {
      throw new Error('Member not found');
    }

    if (member.scholarshipStatus) {
      throw new Error('Member already has scholarship');
    }

    const updatedMember = await MemberRepository.update(memberId, {
      scholarshipStatus: true,
    });

    if (!updatedMember) {
      throw new Error('Failed to apply scholarship');
    }

    return updatedMember;
  }

  /**
   * Remove scholarship from member
   */
  async removeScholarship(memberId: string): Promise<Member> {
    const member = await MemberRepository.findById(memberId);
    if (!member) {
      throw new Error('Member not found');
    }

    const updatedMember = await MemberRepository.update(memberId, {
      scholarshipStatus: false,
    });

    if (!updatedMember) {
      throw new Error('Failed to remove scholarship');
    }

    return updatedMember;
  }

  /**
   * Assign storage unit to member
   */
  async assignStorageUnit(memberId: string, unitNumber: string): Promise<Member> {
    const member = await MemberRepository.findById(memberId);
    if (!member) {
      throw new Error('Member not found');
    }

    const updatedMember = await MemberRepository.update(memberId, {
      storageUnitNumber: unitNumber,
    });

    if (!updatedMember) {
      throw new Error('Failed to assign storage unit');
    }

    return updatedMember;
  }

  /**
   * Check and update expired memberships
   * This would typically run as a cron job
   */
  async checkExpiredMemberships(): Promise<void> {
    const allMembers = await MemberRepository.findAll();
    const now = new Date();

    for (const member of allMembers) {
      if (
        member.expiryDate &&
        member.expiryDate < now &&
        member.membershipStatus === 'active'
      ) {
        await MemberRepository.update(member.id, {
          membershipStatus: 'expired',
        });
        console.log(`Membership expired for ${member.email}`);
      }
    }
  }

  /**
   * Get member by ID
   */
  async getMember(memberId: string): Promise<Member | null> {
    return MemberRepository.findById(memberId);
  }

  /**
   * Get member by email
   */
  async getMemberByEmail(email: string): Promise<Member | null> {
    return MemberRepository.findByEmail(email);
  }

  /**
   * Get member by access card ID
   */
  async getMemberByAccessCard(accessCardId: string): Promise<Member | null> {
    return MemberRepository.findByAccessCardId(accessCardId);
  }

  /**
   * Search members by skills
   */
  async searchBySkills(skills: string[]): Promise<Member[]> {
    return MemberRepository.searchBySkills(skills);
  }

  /**
   * Search members by interests
   */
  async searchByInterests(interests: string[]): Promise<Member[]> {
    return MemberRepository.searchByInterests(interests);
  }

  /**
   * Get all members
   */
  async getAllMembers(): Promise<Member[]> {
    return MemberRepository.findAll();
  }

  /**
   * Get membership tier information
   */
  getMembershipTiers(): MembershipTierInfo[] {
    return this.MEMBERSHIP_TIERS;
  }

  /**
   * Get tier info by tier name
   */
  getTierInfo(tier: Member['membershipTier']): MembershipTierInfo | undefined {
    return this.MEMBERSHIP_TIERS.find(t => t.tier === tier);
  }

  /**
   * Calculate membership expiry date
   */
  private calculateExpiryDate(
    tier: Member['membershipTier'],
    currentExpiry?: Date | null
  ): Date | null {
    if (tier === 'trial') {
      // Trial expires in 7 days
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 7);
      return expiry;
    }

    // Paid memberships expire in 30 days from now or current expiry (whichever is later)
    const now = new Date();
    const baseDate = currentExpiry && currentExpiry > now ? currentExpiry : now;
    const expiry = new Date(baseDate);
    expiry.setDate(expiry.getDate() + 30);
    return expiry;
  }

  /**
   * Generate unique access card ID
   */
  private generateAccessCardId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `SH-${timestamp}-${random}`.toUpperCase();
  }
}

export default new MembershipService();
