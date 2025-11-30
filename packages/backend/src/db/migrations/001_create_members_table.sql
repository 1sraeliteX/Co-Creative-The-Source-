-- Create members table
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  membership_tier VARCHAR(20) NOT NULL CHECK (membership_tier IN ('basic', 'pro', 'enterprise', 'trial')),
  membership_status VARCHAR(20) NOT NULL CHECK (membership_status IN ('active', 'suspended', 'expired')),
  join_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expiry_date TIMESTAMP,
  skills TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  bio TEXT DEFAULT '',
  portfolio TEXT DEFAULT '',
  access_card_id VARCHAR(100) UNIQUE NOT NULL,
  storage_unit_number VARCHAR(50),
  scholarship_status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for frequently queried fields
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_members_membership_status ON members(membership_status);
CREATE INDEX idx_members_membership_tier ON members(membership_tier);
CREATE INDEX idx_members_access_card_id ON members(access_card_id);
CREATE INDEX idx_members_skills ON members USING GIN(skills);
CREATE INDEX idx_members_interests ON members USING GIN(interests);
