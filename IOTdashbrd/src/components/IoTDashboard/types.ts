// IoT Dashboard Type Definitions
export interface TelemetryData {
  orgId: string;
  deviceId: string;
  batchId: string;
  timestamp: string;
  sensors: {
    temperature_c: number;
    humidity_pct: number;
    gps: {
      lat: number;
      lon: number;
      speed_kmh: number;
    };
    shock_g: number;
    light_lux: number;
    battery_pct: number;
    tamper: boolean;
  };
  meta: {
    firmware: string;
    rssi: number;
  };
}

export interface Device {
  id: string;
  name: string;
  type: string;
  batchId?: string;
  status: 'online' | 'offline' | 'warning' | 'critical';
  battery: number;
  lastSeen: string;
  firmware: string;
  location?: string;
  temperature?: number;
  humidity?: number;
  gps?: {
    lat: number;
    lon: number;
  };
  tamper?: boolean;
}

export interface Alert {
  id: string;
  deviceId: string;
  deviceName: string;
  severity: 'critical' | 'warning' | 'info';
  type: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  batchId?: string;
  threshold?: {
    metric: string;
    value: number;
    condition: 'above' | 'below';
  };
}

export interface BlockchainRecord {
  id: string;
  transactionHash: string;
  blockNumber: number;
  ipfsCid?: string;
  batchId: string;
  timestamp: string;
  gasUsed: number;
  status: 'confirmed' | 'pending' | 'failed';
  verificationResult: 'safe' | 'unsafe' | 'unknown';
  dataHash: string;
}

export interface RoutePoint {
  lat: number;
  lon: number;
  timestamp: string;
  temperature: number;
  humidity: number;
  speed: number;
}

export interface TimeSeriesDataPoint {
  timestamp: string;
  temperature: number;
  humidity: number;
  battery: number;
  shock?: number;
  light?: number;
}

export interface AlertRule {
  id: string;
  deviceId?: string;
  batchId?: string;
  metric: 'temperature_c' | 'humidity_pct' | 'battery_pct' | 'tamper' | 'shock_g';
  condition: 'above' | 'below' | 'equals';
  threshold: number;
  severity: 'critical' | 'warning' | 'info';
  enabled: boolean;
  description: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  timestamp: string;
}

export interface DeviceListResponse {
  devices: Device[];
  total: number;
  page: number;
  limit: number;
}

export interface TelemetryResponse {
  data: TimeSeriesDataPoint[];
  device: Device;
  timeRange: string;
  aggregation: 'raw' | '1min' | '5min' | '1hour';
}

export interface AlertsResponse {
  alerts: Alert[];
  unacknowledgedCount: number;
  criticalCount: number;
}

// WebSocket Message Types
export interface WebSocketMessage {
  type: 'telemetry' | 'alert' | 'device_status' | 'blockchain_event';
  data: any;
  timestamp: string;
  deviceId?: string;
}

export interface TelemetryMessage extends WebSocketMessage {
  type: 'telemetry';
  data: TelemetryData;
}

export interface AlertMessage extends WebSocketMessage {
  type: 'alert';
  data: Alert;
}

export interface DeviceStatusMessage extends WebSocketMessage {
  type: 'device_status';
  data: {
    deviceId: string;
    status: Device['status'];
    lastSeen: string;
  };
}

// Component Props Interfaces
export interface DashboardConfig {
  refreshInterval: number;
  autoRefresh: boolean;
  defaultTimeRange: string;
  enableRealtime: boolean;
  theme: 'light' | 'dark' | 'auto';
}

export interface FeatureFlags {
  iot_monitoring: boolean;
  real_time_alerts: boolean;
  blockchain_logging: boolean;
  route_playback: boolean;
  advanced_analytics: boolean;
}