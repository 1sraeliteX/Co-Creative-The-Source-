-- Create workshops table
CREATE TABLE IF NOT EXISTS workshops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(20) NOT NULL CHECK (category IN ('technical', 'business', 'creative', 'networking')),
  facilitator_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  facilitator_name VARCHAR(255) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  registered_count INTEGER NOT NULL DEFAULT 0 CHECK (registered_count >= 0),
  location VARCHAR(255) NOT NULL,
  required_tier VARCHAR(20) NOT NULL CHECK (required_tier IN ('basic', 'pro', 'enterprise', 'all')),
  materials TEXT[] DEFAULT '{}',
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_time_range CHECK (end_time > start_time),
  CONSTRAINT valid_registration_count CHECK (registered_count <= capacity)
);

-- Create indexes for frequently queried fields
CREATE INDEX idx_workshops_start_time ON workshops(start_time);
CREATE INDEX idx_workshops_status ON workshops(status);
CREATE INDEX idx_workshops_category ON workshops(category);
CREATE INDEX idx_workshops_facilitator_id ON workshops(facilitator_id);
CREATE INDEX idx_workshops_required_tier ON workshops(required_tier);
