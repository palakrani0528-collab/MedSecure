import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, Filter, Search } from 'lucide-react';

interface Alert {
  id: string;
  deviceId: string;
  deviceName: string;
  severity: 'critical' | 'warning' | 'info';
  type: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  batchId?: string;
}

interface AlertsPanelProps {
  alerts: Alert[];
  onAcknowledge: (alertId: string) => void;
  onEscalate: (alertId: string) => void;
}

const severityColors = {
  critical: 'bg-red-100 text-red-800 border-red-200',
  warning: 'bg-amber-100 text-amber-800 border-amber-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200'
};

const severityIcons = {
  critical: AlertTriangle,
  warning: AlertTriangle,
  info: CheckCircle
};

export const AlertsPanel: React.FC<AlertsPanelProps> = ({
  alerts,
  onAcknowledge,
  onEscalate
}) => {
  const [filter, setFilter] = useState<'all' | 'unacknowledged' | 'critical'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAlerts = alerts.filter(alert => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unacknowledged' && !alert.acknowledged) ||
      (filter === 'critical' && alert.severity === 'critical');
    
    const matchesSearch = searchTerm === '' ||
      alert.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.batchId?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900">
            Active Alerts
            {unacknowledgedCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                {unacknowledgedCount}
              </span>
            )}
          </h3>
        </div>
        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded">
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search alerts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        
        <div className="flex bg-gray-100 rounded-lg p-1">
          {[
            { key: 'all', label: 'All' },
            { key: 'unacknowledged', label: 'Pending' },
            { key: 'critical', label: 'Critical' }
          ].map(filterOption => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key as any)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                filter === filterOption.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p>No alerts found</p>
            <p className="text-xs">All systems operating normally</p>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const SeverityIcon = severityIcons[alert.severity];
            
            return (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border transition-colors ${
                  alert.acknowledged 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-white border-l-4 border-l-red-400 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`px-2 py-1 rounded border text-xs font-medium flex items-center gap-1 ${severityColors[alert.severity]}`}>
                      <SeverityIcon className="w-3 h-3" />
                      {alert.severity.toUpperCase()}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{alert.deviceName}</span>
                        <span className="text-xs text-gray-500">({alert.deviceId})</span>
                        {alert.batchId && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                            {alert.batchId}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {new Date(alert.timestamp).toLocaleString()}
                        {alert.acknowledged && (
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="w-3 h-3" />
                            Acknowledged
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {!alert.acknowledged && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => onAcknowledge(alert.id)}
                        className="px-3 py-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded hover:bg-green-100 transition-colors"
                      >
                        Acknowledge
                      </button>
                      <button
                        onClick={() => onEscalate(alert.id)}
                        className="px-3 py-1 text-xs font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded hover:bg-orange-100 transition-colors"
                      >
                        Escalate
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};