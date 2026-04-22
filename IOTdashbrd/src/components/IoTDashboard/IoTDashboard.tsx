import React, { useState, useEffect } from 'react';
import { Activity, Settings, RefreshCw } from 'lucide-react';
import { LiveFeedCard } from './LiveFeedCard';
import { TimeSeriesChart } from './TimeSeriesChart';
import { AlertsPanel } from './AlertsPanel';
import { TransportMap } from './TransportMap';
import { BlockchainRecord } from './BlockchainRecord';
import { DeviceInventory } from './DeviceInventory';

// Sample data - in production this would come from your API
const sampleDevices = [
  {
    id: 'DEV-1024',
    name: 'Cold Chain Sensor A',
    batchId: 'VTD123-2024',
    temperature: 6.2,
    humidity: 65.4,
    battery: 78,
    gps: { lat: 28.6139, lon: 77.2090 },
    lastSeen: '2 minutes ago',
    status: 'safe' as const,
    tamper: false,
    type: 'Temperature/Humidity',
    firmware: 'v1.2.0',
    location: 'Transport Vehicle 1'
  },
  {
    id: 'DEV-1025',
    name: 'Shock Monitor B',
    batchId: 'VTD124-2024',
    temperature: 12.8,
    humidity: 58.2,
    battery: 23,
    gps: { lat: 28.7041, lon: 77.1025 },
    lastSeen: '15 minutes ago',
    status: 'warning' as const,
    tamper: false,
    type: 'Multi-Sensor',
    firmware: 'v1.1.5',
    location: 'Transport Vehicle 2'
  }
];

const sampleAlerts = [
  {
    id: 'alert-001',
    deviceId: 'DEV-1025',
    deviceName: 'Shock Monitor B',
    severity: 'warning' as const,
    type: 'Battery Low',
    message: 'Device battery level has dropped below 25%',
    timestamp: '2024-01-15T10:30:00Z',
    acknowledged: false,
    batchId: 'VTD124-2024'
  },
  {
    id: 'alert-002',
    deviceId: 'DEV-1026',
    deviceName: 'GPS Tracker C',
    severity: 'critical' as const,
    type: 'Temperature Exceeded',
    message: 'Temperature exceeded safe limit of 10°C (current: 15.2°C)',
    timestamp: '2024-01-15T09:45:00Z',
    acknowledged: false,
    batchId: 'VTD125-2024'
  }
];

const sampleTelemetryData = Array.from({ length: 48 }, (_, i) => ({
  timestamp: new Date(Date.now() - (47 - i) * 30 * 60 * 1000).toISOString(),
  temperature: 6 + Math.random() * 4 + Math.sin(i / 12) * 2,
  humidity: 60 + Math.random() * 20 + Math.cos(i / 8) * 5,
  battery: 100 - (i / 48) * 40 + Math.random() * 5
}));

const sampleRouteHistory = Array.from({ length: 20 }, (_, i) => ({
  lat: 28.6139 + (Math.random() - 0.5) * 0.1 + i * 0.001,
  lon: 77.2090 + (Math.random() - 0.5) * 0.1 + i * 0.002,
  timestamp: new Date(Date.now() - (19 - i) * 60 * 60 * 1000).toISOString(),
  temperature: 6 + Math.random() * 2,
  humidity: 65 + Math.random() * 10,
  speed: 30 + Math.random() * 20
}));

const sampleBlockchainRecord = {
  id: 'bc-001',
  transactionHash: '0x1234567890abcdef1234567890abcdef12345678',
  blockNumber: 18542156,
  ipfsCid: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
  batchId: 'VTD123-2024',
  timestamp: '2024-01-15T10:15:30Z',
  gasUsed: 45230,
  status: 'confirmed' as const,
  verificationResult: 'safe' as const,
  dataHash: '0xabcdef1234567890abcdef1234567890abcdef12'
};

export const IoTDashboard: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [isPlayingRoute, setIsPlayingRoute] = useState(false);
  const [alerts, setAlerts] = useState(sampleAlerts);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // Simulate new telemetry data
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const handleEscalateAlert = (alertId: string) => {
    console.log('Escalating alert:', alertId);
    // In production, this would trigger escalation workflow
  };

  const handlePlaybackControl = (action: 'play' | 'pause' | 'reset') => {
    if (action === 'play') {
      setIsPlayingRoute(true);
    } else if (action === 'pause') {
      setIsPlayingRoute(false);
    } else if (action === 'reset') {
      setIsPlayingRoute(false);
      // Reset playback to start
    }
  };

  const handleViewExplorer = (txHash: string) => {
    window.open(`https://etherscan.io/tx/${txHash}`, '_blank');
  };

  const handleViewIPFS = (cid: string) => {
    window.open(`https://ipfs.io/ipfs/${cid}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Activity className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">IoT Monitoring Dashboard</h1>
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdate.toLocaleTimeString()}
              <span className="ml-2 inline-flex items-center gap-1 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Live
              </span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLastUpdate(new Date())}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Live Feed Cards */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Live Feed</h2>
          {sampleDevices.map(device => (
            <LiveFeedCard
              key={device.id}
              device={device}
              onViewDetails={() => console.log('View details:', device.id)}
              onAcknowledge={() => console.log('Acknowledge:', device.id)}
              onViewBlockchain={() => console.log('View blockchain:', device.id)}
            />
          ))}
        </div>

        {/* Time Series Chart */}
        <div className="col-span-12 lg:col-span-8">
          <TimeSeriesChart
            data={sampleTelemetryData}
            title="Sensor Telemetry"
            selectedTimeRange={selectedTimeRange}
            onTimeRangeChange={setSelectedTimeRange}
          />
        </div>

        {/* Transport Map */}
        <div className="col-span-12 lg:col-span-8">
          <TransportMap
            deviceId="DEV-1024"
            currentLocation={sampleDevices[0].gps}
            routeHistory={sampleRouteHistory}
            isPlaying={isPlayingRoute}
            onPlaybackControl={handlePlaybackControl}
          />
        </div>

        {/* Alerts Panel */}
        <div className="col-span-12 lg:col-span-4">
          <AlertsPanel
            alerts={alerts}
            onAcknowledge={handleAcknowledgeAlert}
            onEscalate={handleEscalateAlert}
          />
        </div>

        {/* Blockchain Record */}
        <div className="col-span-12 lg:col-span-6">
          <BlockchainRecord
            record={sampleBlockchainRecord}
            onViewExplorer={handleViewExplorer}
            onViewIPFS={handleViewIPFS}
          />
        </div>

        {/* Device Inventory */}
        <div className="col-span-12">
          <DeviceInventory
            devices={sampleDevices.map(d => ({
              ...d,
              status: d.status as 'online' | 'offline' | 'warning'
            }))}
            onDeviceSelect={(id) => console.log('Select device:', id)}
            onDeviceSettings={(id) => console.log('Device settings:', id)}
          />
        </div>
      </div>
    </div>
  );
};