-- Create access_logs table for tracking facility entry/exit
CREATE TABLE IF NOT EXISTS access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  access_method VARCHAR(20) NOT NULL CHECK (access_method IN ('id-card', 'biometric', 'mobile-app')),
  entry_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  exit_time TIMESTAMP,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  access_granted BOOLEAN NOT NULL,
  denial_reason VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for frequently queried fields
CREATE INDEX idx_access_logs_member_id ON access_logs(member_id);
CREATE INDEX idx_access_logs_entry_time ON access_logs(entry_time DESC);
CREATE INDEX idx_access_logs_workspace_id ON access_logs(workspace_id);
CREATE INDEX idx_access_logs_access_granted ON access_logs(access_granted);
