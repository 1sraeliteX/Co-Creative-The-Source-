// Core data model interfaces for The Source HUB

export interface Member {
  id: string;
  email: string;
  name: string;
  phone: string;
  membershipTier: 'basic' | 'pro' | 'enterprise' | 'trial';
  membershipStatus: 'active' | 'suspended' | 'expired';
  joinDate: Date;
  expiryDate: Date | null;
  skills: string[];
  interests: string[];
  bio: string;
  portfolio: string;
  accessCardId: string;
  storageUnitNumber: string | null;
  scholarshipStatus: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  type: 'desk' | 'meeting-room' | 'private-office' | 'studio' | 'collaborative-area';
  capacity: number;
  hourlyRate: number;
  dailyRate: number;
  monthlyRate: number;
  amenities: string[];
  equipment: string[];
  floor: number;
  isAvailable: boolean;
  maintenanceStatus: 'operational' | 'maintenance' | 'out-of-service';
}

export interface Booking {
  id: string;
  memberId: string;
  workspaceId: string;
  startTime: Date;
  endTime: Date;
  bookingType: 'hourly' | 'daily' | 'monthly';
  status: 'confirmed' | 'checked-in' | 'completed' | 'cancelled' | 'no-show';
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentId: string | null;
  createdAt: Date;
  cancelledAt: Date | null;
}

export interface Workshop {
  id: string;
  title: string;
  description: string;
  category: 'technical' | 'business' | 'creative' | 'networking';
  facilitatorId: string;
  facilitatorName: string;
  startTime: Date;
  endTime: Date;
  capacity: number;
  registeredCount: number;
  location: string;
  requiredTier: 'basic' | 'pro' | 'enterprise' | 'all';
  materials: string[];
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

export interface InfrastructureMetric {
  id: string;
  timestamp: Date;
  metricType: 'power' | 'internet' | 'environmental';
  powerSource: 'grid' | 'generator' | 'battery' | null;
  powerStatus: 'online' | 'offline' | 'switching';
  internetSpeed: {
    download: number;
    upload: number;
    latency: number;
  } | null;
  internetStatus: 'online' | 'offline' | 'degraded';
  temperature: number | null;
  humidity: number | null;
  occupancy: number | null;
}

export interface MentorshipSession {
  id: string;
  mentorId: string;
  menteeId: string;
  topic: string;
  scheduledTime: Date;
  duration: number;
  status: 'requested' | 'confirmed' | 'completed' | 'cancelled';
  notes: string;
  feedback: {
    rating: number;
    comment: string;
  } | null;
  followUpActions: string[];
}

export interface Payment {
  id: string;
  memberId: string;
  amount: number;
  currency: string;
  paymentMethod: 'mobile-money' | 'card' | 'bank-transfer' | 'cash';
  paymentType: 'membership' | 'booking' | 'workshop' | 'equipment';
  referenceId: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId: string | null;
  createdAt: Date;
  completedAt: Date | null;
}

export interface AccessLog {
  id: string;
  memberId: string;
  accessMethod: 'id-card' | 'biometric' | 'mobile-app';
  entryTime: Date;
  exitTime: Date | null;
  workspaceId: string | null;
  accessGranted: boolean;
  denialReason: string | null;
  createdAt: Date;
}
