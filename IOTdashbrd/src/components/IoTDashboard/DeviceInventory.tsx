import React, { useState } from 'react';
import { Search, Filter, Wifi, WifiOff, Battery, BatteryLow, MoreVertical } from 'lucide-react';

interface Device {
  id: string;
  name: string;
  type: string;
  batchId?: string;
  status: 'online' | 'offline' | 'warning';
  battery: number;
  lastSeen: string;
  firmware: string;
  location?: string;
  temperature?: number;
  humidity?: number;
}

interface DeviceInventoryProps {
  devices: Device[];
  onDeviceSelect: (deviceId: string) => void;
  onDeviceSettings: (deviceId: string) => void;
}

const statusColors = {
  online: 'text-green-600',
  offline: 'text-gray-400',
  warning: 'text-amber-600'
};

const statusBgColors = {
  online: 'bg-green-100 border-green-200',
  offline: 'bg-gray-100 border-gray-200',
  warning: 'bg-amber-100 border-amber-200'
};

export const DeviceInventory: React.FC<DeviceInventoryProps> = ({
  devices,
  onDeviceSelect,
  onDeviceSettings
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline' | 'warning'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  const filteredDevices = devices.filter(device => {
    const matchesSearch = searchTerm === '' ||
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.batchId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const onlineCount = devices.filter(d => d.status === 'online').length;
  const offlineCount = devices.filter(d => d.status === 'offline').length;
  const warningCount = devices.filter(d => d.status === 'warning').length;

  const getBatteryIcon = (battery: number, status: string) => {
    if (status === 'offline') return <Battery className="w-4 h-4 text-gray-400" />;
    return battery < 20 ? 
      <BatteryLow className="w-4 h-4 text-red-500" /> : 
      <Battery className="w-4 h-4 text-green-500" />;
  };

  const getStatusIcon = (status: string) => {
    return status === 'online' ? 
      <Wifi className={`w-4 h-4 ${statusColors[status]}`} /> :
      <WifiOff className={`w-4 h-4 ${statusColors[status]}`} />;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Device Inventory</h3>
          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              {onlineCount} Online
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              {warningCount} Warning
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              {offlineCount} Offline
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search devices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        
        <div className="flex bg-gray-100 rounded-lg p-1">
          {[
            { key: 'all', label: 'All' },
            { key: 'online', label: 'Online' },
            { key: 'warning', label: 'Warning' },
            { key: 'offline', label: 'Offline' }
          ].map(filter => (
            <button
              key={filter.key}
              onClick={() => setStatusFilter(filter.key as any)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                statusFilter === filter.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Device Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDevices.map(device => (
            <div
              key={device.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${statusBgColors[device.status]}`}
              onClick={() => onDeviceSelect(device.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{device.name}</h4>
                  <p className="text-xs text-gray-500">{device.id}</p>
                </div>
                
                <div className="flex items-center gap-1">
                  {getStatusIcon(device.status)}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeviceSettings(device.id);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                {device.batchId && (
                  <div className="text-xs">
                    <span className="text-gray-500">Batch:</span>
                    <span className="ml-1 bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                      {device.batchId}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    {getBatteryIcon(device.battery, device.status)}
                    <span className="text-gray-600">{device.battery}%</span>
                  </div>
                  <span className="text-gray-500">{device.type}</span>
                </div>
                
                {device.temperature !== undefined && device.humidity !== undefined && (
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>{device.temperature}°C</span>
                    <span>{device.humidity}%</span>
                  </div>
                )}
                
                <div className="text-xs text-gray-500">
                  Last seen: {new Date(device.lastSeen).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredDevices.map(device => (
            <div
              key={device.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all hover:bg-gray-50 ${
                device.status === 'offline' ? 'opacity-75' : ''
              }`}
              onClick={() => onDeviceSelect(device.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(device.status)}
                    <div>
                      <div className="font-medium text-gray-900">{device.name}</div>
                      <div className="text-xs text-gray-500">{device.id}</div>
                    </div>
                  </div>
                  
                  {device.batchId && (
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                      {device.batchId}
                    </span>
                  )}
                  
                  <div className="text-sm text-gray-600">{device.type}</div>
                </div>
                
                <div className="flex items-center gap-6 text-sm">
                  {device.temperature !== undefined && (
                    <div className="text-center">
                      <div className="text-gray-500 text-xs">Temp</div>
                      <div className="font-medium">{device.temperature}°C</div>
                    </div>
                  )}
                  
                  {device.humidity !== undefined && (
                    <div className="text-center">
                      <div className="text-gray-500 text-xs">Humidity</div>
                      <div className="font-medium">{device.humidity}%</div>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <div className="text-gray-500 text-xs">Battery</div>
                    <div className={`font-medium ${device.battery < 20 ? 'text-red-600' : 'text-green-600'}`}>
                      {device.battery}%
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-gray-500 text-xs">Last Seen</div>
                    <div className="font-medium text-xs">
                      {new Date(device.lastSeen).toLocaleTimeString()}
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeviceSettings(device.id);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredDevices.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Filter className="w-8 h-8 mx-auto mb-2" />
          <p>No devices found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};