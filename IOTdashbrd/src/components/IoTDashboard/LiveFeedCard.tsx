import React from 'react';
import { Thermometer, Droplets, Battery, MapPin, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface LiveFeedCardProps {
  device: {
    id: string;
    name: string;
    batchId: string;
    temperature: number;
    humidity: number;
    battery: number;
    gps: { lat: number; lon: number };
    lastSeen: string;
    status: 'safe' | 'warning' | 'critical';
    tamper: boolean;
  };
  onViewDetails: () => void;
  onAcknowledge: () => void;
  onViewBlockchain: () => void;
}

const statusColors = {
  safe: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-amber-100 text-amber-800 border-amber-200',
  critical: 'bg-red-100 text-red-800 border-red-200'
};

const statusIcons = {
  safe: CheckCircle,
  warning: AlertTriangle,
  critical: AlertTriangle
};

export const LiveFeedCard: React.FC<LiveFeedCardProps> = ({
  device,
  onViewDetails,
  onAcknowledge,
  onViewBlockchain
}) => {
  const StatusIcon = statusIcons[device.status];
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{device.name}</h3>
          <p className="text-sm text-gray-500">Batch: {device.batchId}</p>
        </div>
        <div className={`px-3 py-1 rounded-full border text-xs font-medium flex items-center gap-1 ${statusColors[device.status]}`}>
          <StatusIcon className="w-3 h-3" />
          {device.status.toUpperCase()}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Temperature</p>
            <p className="font-semibold text-gray-900">{device.temperature}°C</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-cyan-500" />
          <div>
            <p className="text-sm text-gray-500">Humidity</p>
            <p className="font-semibold text-gray-900">{device.humidity}%</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Battery className="w-4 h-4 text-green-500" />
          <div>
            <p className="text-sm text-gray-500">Battery</p>
            <p className="font-semibold text-gray-900">{device.battery}%</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-purple-500" />
          <div>
            <p className="text-sm text-gray-500">GPS</p>
            <p className="font-semibold text-gray-900">{device.gps.lat.toFixed(3)}, {device.gps.lon.toFixed(3)}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
        <Clock className="w-3 h-3" />
        Last seen: {device.lastSeen}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onAcknowledge}
          className="px-3 py-2 text-xs font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded hover:bg-orange-100 transition-colors"
        >
          Acknowledge
        </button>
        <button
          onClick={onViewDetails}
          className="px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
        >
          View Details
        </button>
        <button
          onClick={onViewBlockchain}
          className="px-3 py-2 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded hover:bg-purple-100 transition-colors"
        >
          Blockchain
        </button>
      </div>
    </div>
  );
};