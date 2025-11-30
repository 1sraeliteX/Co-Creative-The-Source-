-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  booking_type VARCHAR(20) NOT NULL CHECK (booking_type IN ('hourly', 'daily', 'monthly')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('confirmed', 'checked-in', 'completed', 'cancelled', 'no-show')),
  total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
  payment_status VARCHAR(20) NOT NULL CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  payment_id UUID,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cancelled_at TIMESTAMP,
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Create indexes for frequently queried fields
CREATE INDEX idx_bookings_member_id ON bookings(member_id);
CREATE INDEX idx_bookings_workspace_id ON bookings(workspace_id);
CREATE INDEX idx_bookings_start_time ON bookings(start_time);
CREATE INDEX idx_bookings_end_time ON bookings(end_time);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX idx_bookings_time_range ON bookings(workspace_id, start_time, end_time);
