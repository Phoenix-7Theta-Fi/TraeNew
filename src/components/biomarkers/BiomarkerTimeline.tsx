'use client';

import { ResponsiveBar } from '@nivo/bar';
import { format, subDays } from 'date-fns';
import type { BiomarkerTimelineProps } from '@/types/biomarkers';

// Color scheme for different biomarkers
const BIOMARKER_COLORS = {
  glucose: '#3B82F6',    // blue-500
  vitamin_d: '#F59E0B',  // amber-500
  crp: '#EF4444',        // red-500
  cortisol: '#8B5CF6',   // purple-500
  // Add more as needed
};

const BiomarkerTimeline: React.FC<BiomarkerTimelineProps> = ({
  data,
  timeRange,
  selectedMarkers,
  onTimeRangeChange,
  onMarkerToggle,
}) => {
  // Filter data based on time range
  const filteredData = data.filter(point => {
    const date = new Date(point.date);
    const daysToSubtract = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    return date >= subDays(new Date(), daysToSubtract);
  });

  // Transform data for Nivo bar chart
  const chartData = filteredData.map(point => ({
    date: point.date,
    ...selectedMarkers.reduce((acc, markerId) => ({
      ...acc,
      [markerId]: point.markers[markerId],
    }), {}),
  }));

  return (
    <div className="space-y-4">
      {/* Time range selector */}
      <div className="flex gap-2">
        {(['7d', '30d', '90d'] as const).map((range) => (
          <button
            key={range}
            onClick={() => onTimeRangeChange(range)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors
              ${timeRange === range 
                ? 'bg-primary text-white' 
                : 'bg-surface-dark hover:bg-surface-darker text-foreground/70'
              }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Marker selector */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(BIOMARKER_COLORS).map(([markerId, color]) => (
          <button
            key={markerId}
            onClick={() => onMarkerToggle(markerId)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors
              flex items-center gap-2
              ${selectedMarkers.includes(markerId)
                ? 'bg-surface-dark'
                : 'bg-surface hover:bg-surface-dark'
              }`}
            style={{
              borderLeft: `4px solid ${color}`,
            }}
          >
            <span className="capitalize">{markerId.replace('_', ' ')}</span>
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-[400px] w-full">
        <ResponsiveBar
          data={chartData}
          keys={selectedMarkers}
          indexBy="date"
          margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
          padding={0.3}
          valueScale={{ type: 'linear' }}
          colors={({ id }) => BIOMARKER_COLORS[id as keyof typeof BIOMARKER_COLORS]}
          borderRadius={4}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            format: (value) => format(new Date(value), 'MMM d'),
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Value',
            legendPosition: 'middle',
            legendOffset: -40,
          }}
          enableLabel={false}
          animate={true}
          motionConfig="gentle"
          tooltip={({ id, value, color }) => (
            <div className="bg-surface-dark p-2 rounded-lg shadow-lg border border-surface-darker">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="capitalize font-medium">
                  {id.toString().replace('_', ' ')}
                </span>
              </div>
              <div className="text-sm opacity-90">
                Value: {value}
              </div>
            </div>
          )}
          theme={{
            axis: {
              ticks: {
                text: {
                  fill: 'var(--foreground)',
                },
              },
              legend: {
                text: {
                  fill: 'var(--foreground)',
                },
              },
            },
            grid: {
              line: {
                stroke: 'var(--foreground)',
                strokeOpacity: 0.1,
              },
            },
            legends: {
              text: {
                fill: 'var(--foreground)',
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default BiomarkerTimeline;