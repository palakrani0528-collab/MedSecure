import React, { useState } from 'react';
import { Shield, Activity, Database, Users, Settings, Menu, X } from 'lucide-react';
import { IoTDashboard } from './components/IoTDashboard/IoTDashboard';

function App() {
  const [activeTab, setActiveTab] = useState('verification');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [iotEnabled, setIotEnabled] = useState(true); // Feature flag

  const navigation = [
    { name: 'Verification', key: 'verification', icon: Shield },
    { name: 'Analytics', key: 'analytics', icon: Database },
    { name: 'Users', key: 'users', icon: Users },
    ...(iotEnabled ? [{ name: 'IoT Monitoring', key: 'iot', icon: Activity }] : []),
    { name: 'Settings', key: 'settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'iot':
        return <IoTDashboard />;
      case 'verification':
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Medicine Verification</h1>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600">
                This is the existing MedSecure verification module. The IoT monitoring system 
                integrates seamlessly without disturbing this interface.
              </p>
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 Click "IoT Monitoring" in the sidebar to see the new sensor dashboard
                </p>
              </div>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics Dashboard</h1>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600">Analytics module - existing functionality preserved</p>
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">User Management</h1>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600">User management module - existing functionality preserved</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">IoT Monitoring</h3>
                    <p className="text-xs text-gray-500">Enable/disable IoT sensor monitoring features</p>
                  </div>
                  <button
                    onClick={() => setIotEnabled(!iotEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      iotEnabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        iotEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Feature flag demonstration: Toggle to show/hide IoT module gracefully
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-lg font-semibold text-gray-900">MedSecure</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 text-gray-400 hover:text-gray-600 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6 px-4">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setActiveTab(item.key);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === item.key
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                  {item.key === 'iot' && (
                    <div className="ml-auto">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;