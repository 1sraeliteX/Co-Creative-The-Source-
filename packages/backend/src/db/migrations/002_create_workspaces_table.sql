-- Create workspaces table
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('desk', 'meeting-room', 'private-office', 'studio', 'collaborative-area')),
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  hourly_rate DECIMAL(10, 2) NOT NULL CHECK (hourly_rate >= 0),
  daily_rate DECIMAL(10, 2) NOT NULL CHECK (daily_rate >= 0),
  monthly_rate DECIMAL(10, 2) NOT NULL CHECK (monthly_rate >= 0),
  amenities TEXT[] DEFAULT '{}',
  equipment TEXT[] DEFAULT '{}',
  floor INTEGER NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  maintenance_status VARCHAR(20) NOT NULL DEFAULT 'operational' CHECK (maintenance_status IN ('operational', 'maintenance', 'out-of-service')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for frequently queried fields
CREATE INDEX idx_workspaces_type ON workspaces(type);
CREATE INDEX idx_workspaces_is_available ON workspaces(is_available);
CREATE INDEX idx_workspaces_maintenance_status ON workspaces(maintenance_status);
CREATE INDEX idx_workspaces_capacity ON workspaces(capacity);
