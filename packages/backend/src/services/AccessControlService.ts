import { AccessLog, Member, Booking } from '../types/models';
import { query, queryOne, queryMany, toCamelCase, toSnakeCase } from '../db/query';
import MemberRepository from '../repositories/MemberRepository';
import BookingRepository from '../repositories/BookingRepository';

export interface AccessAttempt {
  identifier: string; // access card ID, biometric ID, or member ID
  accessMethod: AccessLog['accessMethod'];
  workspaceId?: string;
}

export interface AccessResult {
  granted: boolean;
  member: Member | null;
  reason: string;
  accessLog: AccessLog;
}

export class AccessControlService {
  /**
   * Verify access attempt
   */
  async verifyAccess(attempt: AccessAttempt): Promise<AccessResult> {
    // Find member by identifier
    let member: Member | null = null;

    if (attempt.accessMethod === 'id-card') {
      member = await MemberRepository.findByAccessCardId(attempt.identifier);
    } else {
      // For biometric and mobile-app, identifier is member ID
      member = await MemberRepository.findById(attempt.identifier);
    }

    if (!member) {
      const accessLog = await this.logAccess({
        memberId: attempt.identifier,
        accessMethod: attempt.accessMethod,
        workspaceId: attempt.workspaceId || null,
        accessGranted: false,
        denialReason: 'Member not found',
      });

      return {
        granted: false,
        member: null,
        reason: 'Member not found',
        accessLog,
      };
    }

    // Check membership status
    if (member.membershipStatus !== 'active') {
      const accessLog = await this.logAccess({
        memberId: member.id,
        accessMethod: attempt.accessMethod,
        workspaceId: attempt.workspaceId || null,
        accessGranted: false,
        denialReason: `Membership status: ${member.membershipStatus}`,
      });

      return {
        granted: false,
        member,
        reason: `Membership is ${member.membershipStatus}`,
        accessLog,
      };
    }

    // Check membership expiry
    if (member.expiryDate && member.expiryDate < new Date()) {
      const accessLog = await this.logAccess({
        memberId: member.id,
        accessMethod: attempt.accessMethod,
        workspaceId: attempt.workspaceId || null,
        accessGranted: false,
        denialReason: 'Membership expired',
      });

      return {
        granted: false,
        member,
        reason: 'Membership has expired',
        accessLog,
      };
    }

    // If accessing a specific workspace (private office or meeting room), check booking
    if (attempt.workspaceId) {
      const hasBooking = await this.verifyWorkspaceBooking(member.id, attempt.workspaceId);

      if (!hasBooking) {
        const accessLog = await this.logAccess({
          memberId: member.id,
          accessMethod: attempt.accessMethod,
          workspaceId: attempt.workspaceId,
          accessGranted: false,
          denialReason: 'No active booking for this workspace',
        });

        return {
          granted: false,
          member,
          reason: 'No active booking for this workspace',
          accessLog,
        };
      }
    }

    // Access granted
    const accessLog = await this.logAccess({
      memberId: member.id,
      accessMethod: attempt.accessMethod,
      workspaceId: attempt.workspaceId || null,
      accessGranted: true,
      denialReason: null,
    });

    return {
      granted: true,
      member,
      reason: 'Access granted',
      accessLog,
    };
  }

  /**
   * Verify workspace booking for access control
   */
  private async verifyWorkspaceBooking(memberId: string, workspaceId: string): Promise<boolean> {
    const now = new Date();
    const bookings = await BookingRepository.findOverlapping(workspaceId, now, now);

    // Check if member has an active booking
    const memberBooking = bookings.find(
      b => b.memberId === memberId && (b.status === 'confirmed' || b.status === 'checked-in')
    );

    return !!memberBooking;
  }

  /**
   * Log access attempt
   */
  private async logAccess(data: {
    memberId: string;
    accessMethod: AccessLog['accessMethod'];
    workspaceId: string | null;
    accessGranted: boolean;
    denialReason: string | null;
  }): Promise<AccessLog> {
    const result = await queryOne<any>(
      `INSERT INTO access_logs (
        member_id, access_method, workspace_id, access_granted, denial_reason
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        data.memberId,
        data.accessMethod,
        data.workspaceId,
        data.accessGranted,
        data.denialReason,
      ]
    );

    return toCamelCase(result) as AccessLog;
  }

  /**
   * Log exit
   */
  async logExit(accessLogId: string): Promise<AccessLog | null> {
    const result = await queryOne<any>(
      `UPDATE access_logs 
       SET exit_time = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING *`,
      [accessLogId]
    );

    return result ? (toCamelCase(result) as AccessLog) : null;
  }

  /**
   * Get member's access history
   */
  async getMemberAccessHistory(memberId: string, limit: number = 50): Promise<AccessLog[]> {
    const results = await queryMany<any>(
      `SELECT * FROM access_logs 
       WHERE member_id = $1 
       ORDER BY entry_time DESC 
       LIMIT $2`,
      [memberId, limit]
    );

    return toCamelCase(results) as AccessLog[];
  }

  /**
   * Get workspace access history
   */
  async getWorkspaceAccessHistory(workspaceId: string, limit: number = 50): Promise<AccessLog[]> {
    const results = await queryMany<any>(
      `SELECT * FROM access_logs 
       WHERE workspace_id = $1 
       ORDER BY entry_time DESC 
       LIMIT $2`,
      [workspaceId, limit]
    );

    return toCamelCase(results) as AccessLog[];
  }

  /**
   * Get current occupants in facility
   */
  async getCurrentOccupants(): Promise<Array<{ member: Member; accessLog: AccessLog }>> {
    const results = await queryMany<any>(
      `SELECT al.*, m.* 
       FROM access_logs al
       JOIN members m ON al.member_id = m.id
       WHERE al.access_granted = true 
       AND al.exit_time IS NULL
       ORDER BY al.entry_time DESC`
    );

    return results.map(row => ({
      member: toCamelCase({
        id: row.id,
        email: row.email,
        name: row.name,
        phone: row.phone,
        membership_tier: row.membership_tier,
        membership_status: row.membership_status,
        join_date: row.join_date,
        expiry_date: row.expiry_date,
        skills: row.skills,
        interests: row.interests,
        bio: row.bio,
        portfolio: row.portfolio,
        access_card_id: row.access_card_id,
        storage_unit_number: row.storage_unit_number,
        scholarship_status: row.scholarship_status,
      }) as Member,
      accessLog: toCamelCase({
        id: row.id,
        member_id: row.member_id,
        access_method: row.access_method,
        entry_time: row.entry_time,
        exit_time: row.exit_time,
        workspace_id: row.workspace_id,
        access_granted: row.access_granted,
        denial_reason: row.denial_reason,
        created_at: row.created_at,
      }) as AccessLog,
    }));
  }

  /**
   * Get access statistics for a time period
   */
  async getAccessStatistics(startDate: Date, endDate: Date): Promise<{
    totalAttempts: number;
    successfulAccess: number;
    deniedAccess: number;
    uniqueMembers: number;
    byAccessMethod: Array<{ method: string; count: number }>;
  }> {
    const stats = await queryOne<any>(
      `SELECT 
        COUNT(*) as total_attempts,
        COUNT(*) FILTER (WHERE access_granted = true) as successful_access,
        COUNT(*) FILTER (WHERE access_granted = false) as denied_access,
        COUNT(DISTINCT member_id) as unique_members
       FROM access_logs
       WHERE entry_time >= $1 AND entry_time <= $2`,
      [startDate, endDate]
    );

    const byMethod = await queryMany<any>(
      `SELECT 
        access_method as method,
        COUNT(*) as count
       FROM access_logs
       WHERE entry_time >= $1 AND entry_time <= $2
       GROUP BY access_method`,
      [startDate, endDate]
    );

    return {
      totalAttempts: parseInt(stats.total_attempts),
      successfulAccess: parseInt(stats.successful_access),
      deniedAccess: parseInt(stats.denied_access),
      uniqueMembers: parseInt(stats.unique_members),
      byAccessMethod: byMethod.map(m => ({
        method: m.method,
        count: parseInt(m.count),
      })),
    };
  }

  /**
   * Revoke access for a member (emergency)
   */
  async revokeAccess(memberId: string, reason: string): Promise<void> {
    // Update member status to suspended
    await MemberRepository.update(memberId, {
      membershipStatus: 'suspended',
    });

    console.log(`Access revoked for member ${memberId}. Reason: ${reason}`);
  }
}

export default new AccessControlService();
