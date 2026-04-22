# MedSecure IoT Sensor Data Subsystem - Implementation Specification

## Overview
This document provides the complete technical specification for implementing the IoT sensor data subsystem in MedSecure. The system is designed as a modular extension that integrates seamlessly with the existing medicine verification platform.

## Architecture Overview

### System Components
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   IoT Devices   │───▶│  IoT Aggregator  │───▶│  MedSecure UI   │
│  (Sensors)      │    │   Microservice   │    │   Dashboard     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │                         │
                              ▼                         ▼
                     ┌──────────────────┐    ┌─────────────────┐
                     │   Blockchain     │    │   WebSocket     │
                     │   Logger         │    │   Real-time     │
                     └──────────────────┘    └─────────────────┘
```

## Database Schema

### Collections/Tables

#### 1. `iot_telemetry`
```sql
CREATE TABLE iot_telemetry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id VARCHAR(50) NOT NULL,
  device_id VARCHAR(50) NOT NULL,
  batch_id VARCHAR(50),
  timestamp TIMESTAMPTZ NOT NULL,
  temperature_c DECIMAL(5,2),
  humidity_pct DECIMAL(5,2),
  gps_lat DECIMAL(10,7),
  gps_lon DECIMAL(10,7),
  gps_speed_kmh DECIMAL(6,2),
  shock_g DECIMAL(6,3),
  light_lux INTEGER,
  battery_pct INTEGER,
  tamper BOOLEAN DEFAULT FALSE,
  firmware_version VARCHAR(20),
  rssi INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_device_timestamp (device_id, timestamp),
  INDEX idx_batch_id (batch_id),
  INDEX idx_timestamp (timestamp)
);
```

#### 2. `iot_alerts`
```sql
CREATE TABLE iot_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id VARCHAR(50) NOT NULL,
  batch_id VARCHAR(50),
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('critical', 'warning', 'info')),
  alert_type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  threshold_value DECIMAL(10,3),
  current_value DECIMAL(10,3),
  acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_by VARCHAR(100),
  acknowledged_at TIMESTAMPTZ,
  escalated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_device_acknowledged (device_id, acknowledged),
  INDEX idx_severity_created (severity, created_at)
);
```

#### 3. `iot_devices`
```sql
CREATE TABLE iot_devices (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  org_id VARCHAR(50) NOT NULL,
  batch_id VARCHAR(50),
  status VARCHAR(20) DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'warning', 'critical')),
  firmware_version VARCHAR(20),
  last_seen TIMESTAMPTZ,
  battery_pct INTEGER,
  location_description VARCHAR(200),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_org_status (org_id, status),
  INDEX idx_batch_id (batch_id)
);
```

#### 4. `iot_batch_mapping`
```sql
CREATE TABLE iot_batch_mapping (
  batch_id VARCHAR(50) NOT NULL,
  verification_id UUID NOT NULL,
  device_ids TEXT[], -- Array of device IDs
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  PRIMARY KEY (batch_id, verification_id),
  FOREIGN KEY (verification_id) REFERENCES verifications(id)
);
```

#### 5. `iot_blockchain_records`
```sql
CREATE TABLE iot_blockchain_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id VARCHAR(50) NOT NULL,
  transaction_hash VARCHAR(66) NOT NULL,
  block_number INTEGER,
  ipfs_cid VARCHAR(100),
  data_hash VARCHAR(66) NOT NULL,
  gas_used INTEGER,
  status VARCHAR(20) DEFAULT 'pending',
  verification_result VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  
  UNIQUE (transaction_hash),
  INDEX idx_batch_status (batch_id, status)
);
```

## API Specification

### IoT Aggregator Microservice Endpoints

#### Base URL: `/api/v1/iot`

#### 1. Telemetry Ingestion
```http
POST /telemetry
Content-Type: application/json
Authorization: Bearer <device_token>

{
  "orgId": "medsecure",
  "deviceId": "DEV-1024",
  "batchId": "VTD123-2024",
  "timestamp": "2025-01-15T10:15:30Z",
  "sensors": {
    "temperature_c": 6.2,
    "humidity_pct": 65.4,
    "gps": {
      "lat": 28.6139,
      "lon": 77.2090,
      "speed_kmh": 42.5
    },
    "shock_g": 0.02,
    "light_lux": 10,
    "battery_pct": 78,
    "tamper": false
  },
  "meta": {
    "firmware": "v1.2.0",
    "rssi": -72
  }
}
```

**Response:**
```json
{
  "success": true,
  "recordId": "uuid",
  "timestamp": "2025-01-15T10:15:30Z"
}
```

#### 2. Device Management
```http
GET /devices
GET /devices/{deviceId}
PUT /devices/{deviceId}
DELETE /devices/{deviceId}
```

#### 3. Telemetry Retrieval
```http
GET /telemetry/{deviceId}?from=2025-01-15T00:00:00Z&to=2025-01-15T23:59:59Z&aggregation=1min

Response:
{
  "success": true,
  "data": {
    "device": { /* device info */ },
    "telemetry": [
      {
        "timestamp": "2025-01-15T10:15:00Z",
        "temperature_c": 6.2,
        "humidity_pct": 65.4,
        "battery_pct": 78
      }
    ],
    "aggregation": "1min",
    "count": 1440
  }
}
```

#### 4. Alerts Management
```http
GET /alerts?status=unacknowledged&severity=critical
POST /alerts/{alertId}/acknowledge
POST /alerts/{alertId}/escalate
```

#### 5. Blockchain Integration
```http
POST /blockchain/log
{
  "batchId": "VTD123-2024",
  "telemetryHash": "0xabc123...",
  "ipfsCid": "QmXoypizjW3WknFi...",
  "deviceIds": ["DEV-1024", "DEV-1025"]
}
```

### WebSocket Events

#### Connection: `wss://api.medsecure.com/iot/ws`

#### Event Types:
1. **telemetry_update**
```json
{
  "type": "telemetry_update",
  "deviceId": "DEV-1024",
  "data": { /* latest telemetry */ },
  "timestamp": "2025-01-15T10:15:30Z"
}
```

2. **alert_triggered**
```json
{
  "type": "alert_triggered",
  "alert": {
    "id": "alert-001",
    "deviceId": "DEV-1024",
    "severity": "critical",
    "message": "Temperature exceeded threshold",
    "threshold": { "metric": "temperature_c", "value": 10, "condition": "above" }
  }
}
```

3. **device_status_change**
```json
{
  "type": "device_status_change",
  "deviceId": "DEV-1024",
  "oldStatus": "online",
  "newStatus": "warning",
  "reason": "battery_low"
}
```

## Alert Rules Engine

### Default Alert Rules
```javascript
const defaultAlertRules = [
  {
    metric: 'temperature_c',
    condition: 'above',
    threshold: 10,
    severity: 'critical',
    description: 'Temperature exceeded safe storage limit'
  },
  {
    metric: 'temperature_c',
    condition: 'below',
    threshold: 2,
    severity: 'critical',
    description: 'Temperature below minimum safe limit'
  },
  {
    metric: 'humidity_pct',
    condition: 'above',
    threshold: 80,
    severity: 'warning',
    description: 'High humidity detected'
  },
  {
    metric: 'battery_pct',
    condition: 'below',
    threshold: 20,
    severity: 'warning',
    description: 'Low battery level'
  },
  {
    metric: 'tamper',
    condition: 'equals',
    threshold: true,
    severity: 'critical',
    description: 'Tamper detection triggered'
  },
  {
    metric: 'shock_g',
    condition: 'above',
    threshold: 2.0,
    severity: 'warning',
    description: 'Excessive shock detected'
  }
];
```

## Blockchain Integration

### Smart Contract Events
```solidity
event TelemetryLogged(
    string indexed batchId,
    bytes32 dataHash,
    string ipfsCid,
    uint256 timestamp,
    address indexed logger
);

event AlertAcknowledged(
    string indexed alertId,
    string indexed batchId,
    bytes32 alertHash,
    address indexed acknowledger,
    uint256 timestamp
);
```

### Data Flow
1. **Telemetry Collection**: Raw sensor data stored in database
2. **Batch Processing**: Every 15 minutes, create telemetry batch
3. **Hash Generation**: SHA256 hash of telemetry batch
4. **IPFS Storage**: Store raw telemetry JSON on IPFS
5. **Blockchain Logging**: Store hash + IPFS CID on chain
6. **UI Update**: Display blockchain record with verification status

### Sample Blockchain Payload
```json
{
  "function": "logTelemetry",
  "parameters": {
    "batchId": "VTD123-2024",
    "dataHash": "0xabcdef1234567890...",
    "ipfsCid": "QmXoypizjW3WknFi...",
    "timestamp": 1705315530,
    "deviceCount": 2,
    "verificationResult": "safe"
  }
}
```

## Feature Flag Implementation

### Environment Configuration
```javascript
// Feature flags in environment/config
const featureFlags = {
  iot_monitoring: process.env.FEATURE_IOT_MONITORING === 'true',
  real_time_alerts: process.env.FEATURE_REAL_TIME_ALERTS === 'true',
  blockchain_logging: process.env.FEATURE_BLOCKCHAIN_LOGGING === 'true',
  route_playback: process.env.FEATURE_ROUTE_PLAYBACK === 'true'
};
```

### Frontend Implementation
```typescript
// React hook for feature flags
const useFeatureFlag = (flag: string) => {
  return featureFlags[flag] || false;
};

// Component usage
const Navigation = () => {
  const iotEnabled = useFeatureFlag('iot_monitoring');
  
  return (
    <nav>
      {/* ... existing nav items ... */}
      {iotEnabled && (
        <NavItem to="/iot" icon={Activity}>
          IoT Monitoring
        </NavItem>
      )}
    </nav>
  );
};
```

## Security Implementation

### Device Authentication
```javascript
// HMAC signature verification
const verifyDeviceSignature = (payload, signature, deviceSecret) => {
  const computedSignature = crypto
    .createHmac('sha256', deviceSecret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(computedSignature, 'hex')
  );
};
```

### API Request Example with HMAC
```http
POST /api/v1/iot/telemetry
X-Device-ID: DEV-1024
X-Timestamp: 1705315530
X-Signature: sha256=abc123...
Content-Type: application/json

{
  "orgId": "medsecure",
  "deviceId": "DEV-1024",
  // ... telemetry data
}
```

## Data Retention & Aggregation

### Retention Policy
```sql
-- Raw telemetry: 30 days
-- 1-minute aggregates: 1 year  
-- 1-hour aggregates: 5 years
-- Daily aggregates: permanent

-- Cleanup job (daily cron)
DELETE FROM iot_telemetry 
WHERE created_at < NOW() - INTERVAL '30 days';
```

### Aggregation Views
```sql
-- 1-minute aggregates
CREATE MATERIALIZED VIEW iot_telemetry_1min AS
SELECT 
  device_id,
  batch_id,
  DATE_TRUNC('minute', timestamp) as minute,
  AVG(temperature_c) as avg_temperature_c,
  MIN(temperature_c) as min_temperature_c,
  MAX(temperature_c) as max_temperature_c,
  AVG(humidity_pct) as avg_humidity_pct,
  AVG(battery_pct) as avg_battery_pct,
  COUNT(*) as sample_count
FROM iot_telemetry
GROUP BY device_id, batch_id, minute;
```

## Rate Limiting & Performance

### API Rate Limits
```javascript
// Device telemetry: 1 request per second per device
// Dashboard API: 60 requests per minute per user
// WebSocket: 100 messages per minute per connection

const rateLimiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 1, // 1 request per window
  keyGenerator: (req) => req.headers['x-device-id'],
  message: 'Telemetry rate limit exceeded'
});
```

### Performance Optimizations
1. **Database Indexing**: Optimize queries with proper indexes
2. **Connection Pooling**: Reuse database connections
3. **Caching**: Redis cache for frequently accessed data
4. **Batch Processing**: Group telemetry writes
5. **WebSocket Throttling**: Limit real-time update frequency

## Monitoring & Alerting

### System Health Metrics
- Telemetry ingestion rate
- Alert processing latency  
- WebSocket connection count
- Database query performance
- Blockchain transaction success rate

### Escalation Channels
```javascript
const escalationChannels = {
  email: {
    enabled: true,
    smtp: {
      host: 'smtp.gmail.com',
      port: 587,
      auth: { user: 'alerts@medsecure.com', pass: '***' }
    }
  },
  sms: {
    enabled: true,
    provider: 'twilio',
    apiKey: '***'
  },
  webhook: {
    enabled: true,
    url: 'https://hooks.slack.com/services/***'
  }
};
```

## Testing Strategy

### Unit Tests
- Component rendering with different prop combinations
- Alert rule evaluation logic
- Data transformation functions
- WebSocket message handling

### Integration Tests  
- API endpoint functionality
- Database operations
- WebSocket connectivity
- Blockchain integration

### E2E Tests
- Complete telemetry flow (device → API → UI)
- Alert lifecycle (trigger → acknowledge → escalate)
- Route playback functionality
- Feature flag toggling

## Deployment Checklist

### Prerequisites
- [ ] Database schema migrated
- [ ] IoT aggregator service deployed
- [ ] Feature flags configured
- [ ] Device authentication keys generated
- [ ] Blockchain contract deployed
- [ ] IPFS node configured

### Verification Steps
1. Device telemetry ingestion working
2. Real-time dashboard updates
3. Alert rules triggering correctly
4. Blockchain records being created
5. Feature flag toggling functional
6. Performance within acceptable limits

### Rollback Plan
1. Set `feature.iot_monitoring = false`
2. Stop IoT aggregator service
3. Revert database migrations if needed
4. Remove IoT navigation items

This implementation specification provides all the technical details needed to build and deploy the IoT sensor data subsystem for MedSecure while maintaining modularity and non-disruption of existing functionality.