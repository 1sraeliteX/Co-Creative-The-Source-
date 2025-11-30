-- Create mentorship_sessions table
CREATE TABLE IF NOT EXISTS mentorship_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  mentee_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  topic VARCHAR(255) NOT NULL,
  scheduled_time TIMESTAMP NOT NULL,
  duration INTEGER NOT NULL CHECK (duration > 0),
  status VARCHAR(20) NOT NULL CHECK (status IN ('requested', 'confirmed', 'completed', 'cancelled')),
  notes TEXT DEFAULT '',
  feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
  feedback_comment TEXT,
  follow_up_actions TEXT[] DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT different_mentor_mentee CHECK (mentor_id != mentee_id)
);

-- Create indexes for frequently queried fields
CREATE INDEX idx_mentorship_sessions_mentor_id ON mentorship_sessions(mentor_id);
CREATE INDEX idx_mentorship_sessions_mentee_id ON mentorship_sessions(mentee_id);
CREATE INDEX idx_mentorship_sessions_scheduled_time ON mentorship_sessions(scheduled_time);
CREATE INDEX idx_mentorship_sessions_status ON mentorship_sessions(status);
