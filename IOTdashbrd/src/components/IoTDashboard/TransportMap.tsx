import React, { useState } from 'react';
import { MapPin, Play, Pause, RotateCcw, Navigation, Maximize2 } from 'lucide-react';

interface RoutePoint {
  lat: number;
  lon: number;
  timestamp: string;
  temperature: number;
  humidity: number;
  speed: number;
}

interface TransportMapProps {
  deviceId: string;
  currentLocation: { lat: number; lon: number };
  routeHistory: RoutePoint[];
  isPlaying: boolean;
  onPlaybackControl: (action: 'play' | 'pause' | 'reset') => void;
}

export const TransportMap: React.FC<TransportMapProps> = ({
  deviceId,
  currentLocation,
  routeHistory,
  isPlaying,
  onPlaybackControl
}) => {
  const [selectedPoint, setSelectedPoint] = useState<RoutePoint | null>(null);
  const [playbackProgress, setPlaybackProgress] = useState(100);

  // Simulate map dimensions
  const mapWidth = 600;
  const mapHeight = 400;

  // Calculate bounds for the route
  const bounds = routeHistory.length > 0 ? {
    minLat: Math.min(...routeHistory.map(p => p.lat)),
    maxLat: Math.max(...routeHistory.map(p => p.lat)),
    minLon: Math.min(...routeHistory.map(p => p.lon)),
    maxLon: Math.max(...routeHistory.map(p => p.lon))
  } : { minLat: 0, maxLat: 1, minLon: 0, maxLon: 1 };

  const latRange = bounds.maxLat - bounds.minLat || 1;
  const lonRange = bounds.maxLon - bounds.minLon || 1;

  // Convert lat/lon to SVG coordinates
  const coordToSVG = (lat: number, lon: number) => ({
    x: ((lon - bounds.minLon) / lonRange) * (mapWidth - 100) + 50,
    y: mapHeight - 50 - ((lat - bounds.minLat) / latRange) * (mapHeight - 100)
  });

  const visibleRoutePoints = routeHistory.slice(0, Math.floor((playbackProgress / 100) * routeHistory.length));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">Transport Tracking</h3>
          <span className="text-sm text-gray-500">({deviceId})</span>
        </div>
        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded" title="Fullscreen">
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Map Area */}
      <div className="relative bg-gray-50 rounded border border-gray-200 mb-4">
        <svg width={mapWidth} height={mapHeight} className="w-full">
          {/* Background grid */}
          <defs>
            <pattern id="mapGrid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mapGrid)" />
          
          {/* Route path */}
          {visibleRoutePoints.length > 1 && (
            <path
              d={`M ${visibleRoutePoints.map(point => {
                const svg = coordToSVG(point.lat, point.lon);
                return `${svg.x},${svg.y}`;
              }).join(' L ')}`}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              strokeDasharray="5,5"
              className="animate-pulse"
            />
          )}
          
          {/* Route points */}
          {visibleRoutePoints.map((point, index) => {
            const svg = coordToSVG(point.lat, point.lon);
            const isStart = index === 0;
            const isEnd = index === visibleRoutePoints.length - 1;
            const isCurrent = index === visibleRoutePoints.length - 1;
            
            return (
              <g key={index}>
                <circle
                  cx={svg.x}
                  cy={svg.y}
                  r={isCurrent ? "8" : isStart || isEnd ? "6" : "4"}
                  fill={isCurrent ? "#ef4444" : isStart ? "#10b981" : isEnd ? "#f59e0b" : "#3b82f6"}
                  stroke="white"
                  strokeWidth="2"
                  className={`cursor-pointer ${isCurrent ? 'animate-bounce' : ''}`}
                  onClick={() => setSelectedPoint(point)}
                />
                {isStart && (
                  <text x={svg.x} y={svg.y - 15} textAnchor="middle" className="text-xs fill-green-600 font-semibold">
                    START
                  </text>
                )}
                {isEnd && playbackProgress >= 100 && (
                  <text x={svg.x} y={svg.y - 15} textAnchor="middle" className="text-xs fill-amber-600 font-semibold">
                    END
                  </text>
                )}
              </g>
            );
          })}
          
          {/* Current location marker */}
          <g>
            <circle
              cx={coordToSVG(currentLocation.lat, currentLocation.lon).x}
              cy={coordToSVG(currentLocation.lat, currentLocation.lon).y}
              r="12"
              fill="#ef4444"
              className="animate-ping"
              opacity="0.7"
            />
            <circle
              cx={coordToSVG(currentLocation.lat, currentLocation.lon).x}
              cy={coordToSVG(currentLocation.lat, currentLocation.lon).y}
              r="6"
              fill="#ef4444"
            />
            <MapPin 
              x={coordToSVG(currentLocation.lat, currentLocation.lon).x - 6}
              y={coordToSVG(currentLocation.lat, currentLocation.lon).y - 18}
              className="w-3 h-3 text-white"
            />
          </g>
        </svg>
        
        {/* Point details tooltip */}
        {selectedPoint && (
          <div className="absolute top-4 right-4 bg-white border border-gray-200 rounded-lg p-3 shadow-lg z-10">
            <div className="text-sm font-medium text-gray-900 mb-1">
              {new Date(selectedPoint.timestamp).toLocaleString()}
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <div>Temp: {selectedPoint.temperature}°C</div>
              <div>Humidity: {selectedPoint.humidity}%</div>
              <div>Speed: {selectedPoint.speed} km/h</div>
              <div>Coords: {selectedPoint.lat.toFixed(4)}, {selectedPoint.lon.toFixed(4)}</div>
            </div>
            <button
              onClick={() => setSelectedPoint(null)}
              className="mt-2 text-xs text-blue-600 hover:text-blue-800"
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* Playback Controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPlaybackControl(isPlaying ? 'pause' : 'play')}
            className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => {
              onPlaybackControl('reset');
              setPlaybackProgress(0);
            }}
            className="p-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1">
          <input
            type="range"
            min="0"
            max="100"
            value={playbackProgress}
            onChange={(e) => setPlaybackProgress(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>
              {routeHistory.length > 0 ? new Date(routeHistory[0].timestamp).toLocaleTimeString() : '--:--'}
            </span>
            <span>
              {routeHistory.length > 0 ? new Date(routeHistory[routeHistory.length - 1].timestamp).toLocaleTimeString() : '--:--'}
            </span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm font-medium text-gray-900">
            {Math.floor(playbackProgress)}% Complete
          </div>
          <div className="text-xs text-gray-500">
            {visibleRoutePoints.length} / {routeHistory.length} points
          </div>
        </div>
      </div>
    </div>
  );
};