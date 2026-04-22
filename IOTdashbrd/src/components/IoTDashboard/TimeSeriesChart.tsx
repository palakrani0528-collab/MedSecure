import React, { useState, useRef, useEffect } from 'react';
import { TrendingUp, Download, Maximize2 } from 'lucide-react';

interface DataPoint {
  timestamp: string;
  temperature: number;
  humidity: number;
  battery: number;
}

interface TimeSeriesChartProps {
  data: DataPoint[];
  title: string;
  selectedTimeRange: string;
  onTimeRangeChange: (range: string) => void;
}

const timeRanges = [
  { label: '1H', value: '1h' },
  { label: '6H', value: '6h' },
  { label: '24H', value: '24h' },
  { label: '7D', value: '7d' }
];

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  data,
  title,
  selectedTimeRange,
  onTimeRangeChange
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{x: number, y: number, data: DataPoint} | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'temperature' | 'humidity' | 'battery'>('temperature');
  const chartRef = useRef<HTMLDivElement>(null);

  // Simulate chart dimensions
  const chartWidth = 600;
  const chartHeight = 300;
  const margin = { top: 20, right: 20, bottom: 40, left: 50 };

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case 'temperature': return 'rgb(59, 130, 246)'; // blue
      case 'humidity': return 'rgb(20, 184, 166)'; // teal
      case 'battery': return 'rgb(34, 197, 94)'; // green
      default: return 'rgb(107, 114, 128)';
    }
  };

  const getMetricValue = (dataPoint: DataPoint, metric: string) => {
    switch (metric) {
      case 'temperature': return dataPoint.temperature;
      case 'humidity': return dataPoint.humidity;
      case 'battery': return dataPoint.battery;
      default: return 0;
    }
  };

  const getMetricUnit = (metric: string) => {
    switch (metric) {
      case 'temperature': return '°C';
      case 'humidity': return '%';
      case 'battery': return '%';
      default: return '';
    }
  };

  const handleExport = () => {
    // Simulate CSV export
    const csv = data.map(d => 
      `${d.timestamp},${d.temperature},${d.humidity},${d.battery}`
    ).join('\n');
    const blob = new Blob([`timestamp,temperature,humidity,battery\n${csv}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `telemetry-${selectedTimeRange}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded"
            title="Export CSV"
          >
            <Download className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded" title="Fullscreen">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1">
          {timeRanges.map(range => (
            <button
              key={range.value}
              onClick={() => onTimeRangeChange(range.value)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                selectedTimeRange === range.value
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* Metric Selector */}
        <div className="flex gap-1">
          {['temperature', 'humidity', 'battery'].map(metric => (
            <button
              key={metric}
              onClick={() => setSelectedMetric(metric as any)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1 ${
                selectedMetric === metric
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 border border-transparent'
              }`}
            >
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: getMetricColor(metric) }}
              />
              {metric.charAt(0).toUpperCase() + metric.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div 
        ref={chartRef}
        className="relative bg-gray-50 rounded border border-gray-200"
        style={{ height: chartHeight + margin.top + margin.bottom }}
      >
        <svg width="100%" height="100%" className="absolute inset-0">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Sample chart line */}
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {data.length > 0 && (
              <path
                d={`M ${data.map((d, i) => `${(i / (data.length - 1)) * (chartWidth - margin.left - margin.right)},${
                  chartHeight - margin.bottom - ((getMetricValue(d, selectedMetric) / 100) * (chartHeight - margin.top - margin.bottom))
                }`).join(' L ')}`}
                fill="none"
                stroke={getMetricColor(selectedMetric)}
                strokeWidth="2"
                className="drop-shadow-sm"
              />
            )}
            
            {/* Data points */}
            {data.map((d, i) => (
              <circle
                key={i}
                cx={(i / (data.length - 1)) * (chartWidth - margin.left - margin.right)}
                cy={chartHeight - margin.bottom - ((getMetricValue(d, selectedMetric) / 100) * (chartHeight - margin.top - margin.bottom))}
                r="3"
                fill={getMetricColor(selectedMetric)}
                className="cursor-pointer hover:r-4 transition-all"
                onMouseEnter={(e) => {
                  const rect = chartRef.current?.getBoundingClientRect();
                  if (rect) {
                    setHoveredPoint({
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top,
                      data: d
                    });
                  }
                }}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            ))}
          </g>
        </svg>

        {/* Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute z-10 bg-gray-900 text-white text-xs rounded px-2 py-1 pointer-events-none"
            style={{
              left: hoveredPoint.x + 10,
              top: hoveredPoint.y - 30,
              transform: hoveredPoint.x > chartWidth - 100 ? 'translateX(-100%)' : 'none'
            }}
          >
            <div className="font-medium">{new Date(hoveredPoint.data.timestamp).toLocaleTimeString()}</div>
            <div>
              {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}: {getMetricValue(hoveredPoint.data, selectedMetric)}{getMetricUnit(selectedMetric)}
            </div>
          </div>
        )}
      </div>

      {/* Legend and Stats */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            Normal Range
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-amber-500 rounded-full" />
            Warning
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            Critical
          </div>
        </div>
        <div className="text-right">
          {data.length > 0 && (
            <div>
              Latest: {getMetricValue(data[data.length - 1], selectedMetric)}{getMetricUnit(selectedMetric)} • 
              Avg: {(data.reduce((sum, d) => sum + getMetricValue(d, selectedMetric), 0) / data.length).toFixed(1)}{getMetricUnit(selectedMetric)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};