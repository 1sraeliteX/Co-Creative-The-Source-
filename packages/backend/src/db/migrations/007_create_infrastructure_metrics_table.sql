-- Create infrastructure_metrics table
CREATE TABLE IF NOT EXISTS infrastructure_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  metric_type VARCHAR(20) NOT NULL CHECK (metric_type IN ('power', 'internet', 'environmental')),
  power_source VARCHAR(20) CHECK (power_source IN ('grid', 'generator', 'battery')),
  power_status VARCHAR(20) CHECK (power_status IN ('online', 'offline', 'switching')),
  internet_download_speed DECIMAL(10, 2),
  internet_upload_speed DECIMAL(10, 2),
  internet_latency DECIMAL(10, 2),
  internet_status VARCHAR(20) CHECK (internet_status IN ('online', 'offline', 'degraded')),
  temperature DECIMAL(5, 2),
  humidity DECIMAL(5, 2),
  occupancy INTEGER CHECK (occupancy >= 0)
);

-- Create indexes for time-series queries
CREATE INDEX idx_infrastructure_metrics_timestamp ON infrastructure_metrics(timestamp DESC);
CREATE INDEX idx_infrastructure_metrics_metric_type ON infrastructure_metrics(metric_type);
CREATE INDEX idx_infrastructure_metrics_type_timestamp ON infrastructure_metrics(metric_type, timestamp DESC);

-- Create hypertable for TimescaleDB (if using TimescaleDB extension)
-- SELECT create_hypertable('infrastructure_metrics', 'timestamp', if_not_exists => TRUE);
