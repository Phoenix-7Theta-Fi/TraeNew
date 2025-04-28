'use client';

import { useState, useMemo } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { format, subDays, isWithinInterval, startOfDay } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import {
  YogaTimelineProps,
  YogaTimelineBarData,
  YogaPracticeEntry,
  YogaTimeRange,
  YogaTimelineTooltipProps
} from '@/types/yoga';
import { YOGA_TYPES } from '@/mocks/yogaTimelineData';

const TimelineTooltip = ({ date, practices, total }: YogaTimelineTooltipProps) => (
  <div className="bg-surface/95 backdrop-blur-sm rounded-lg shadow-lg p-4 max-w-xs">
    <div className="text-sm font-medium mb-2">{format(new Date(date), 'MMMM d, yyyy')}</div>
    <div className="text-xs text-foreground/80 mb-3">Total: {total} minutes</div>
    <div className="space-y-2">
      {practices.map((practice) => (
        <div key={practice.id} className="flex items-start space-x-2">
          <div
            className="w-2 h-2 rounded-full mt-1.5"
            style={{ backgroundColor: practice.color }}
          />
          <div>
            <div className="text-sm font-medium">{practice.typeName}</div>
            <div className="text-xs text-foreground/70">
              {practice.duration} mins • {practice.intensity}
            </div>
            <div className="text-xs text-foreground/60">
              Focus: {practice.focus} • Props: {practice.props}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TimeRangeSelector = ({
  timeRange,
  onChange
}: {
  timeRange: YogaTimeRange;
  onChange: (range: YogaTimeRange) => void;
}) => {
  const ranges: { value: YogaTimeRange; label: string }[] = [
    { value: 'week', label: '7 Days' },
    { value: 'month', label: '30 Days' },
    { value: '3months', label: '90 Days' }
  ];

  return (
    <div className="flex space-x-2 mb-6">
      {ranges.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all
            ${timeRange === value
              ? 'bg-primary text-white shadow-lg shadow-primary/20'
              : 'bg-surface hover:bg-surface/80'
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export const YogaTimeline = ({
  data,
  timeRange,
  onTimeRangeChange,
  isLoading,
  error
}: YogaTimelineProps) => {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    const today = startOfDay(new Date());
    const daysToSubtract = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90;
    const startDate = startOfDay(subDays(today, daysToSubtract));

    return data.filter((entry) =>
      isWithinInterval(new Date(entry.date), {
        start: startDate,
        end: today,
      })
    );
  }, [data, timeRange]);

  const chartData: YogaTimelineBarData[] = useMemo(() => {
    const practicesByDate = filteredData.reduce((acc, practice) => {
      if (!acc[practice.date]) {
        acc[practice.date] = {
          date: practice.date,
          total: 0,
        };
      }
      acc[practice.date][practice.type] = practice.duration;
      acc[practice.date].total = (acc[practice.date].total || 0) + practice.duration;
      return acc;
    }, {} as Record<string, YogaTimelineBarData>);

    return Object.values(practicesByDate);
  }, [filteredData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full space-y-4">
      <TimeRangeSelector timeRange={timeRange} onChange={onTimeRangeChange} />
      
      <div className="h-[400px] w-full">
        <ResponsiveBar
          data={chartData}
          keys={Object.keys(YOGA_TYPES)}
          indexBy="date"
          margin={{ top: 20, right: 20, bottom: 40, left: 60 }}
          padding={0.3}
          valueScale={{ type: 'linear' }}
          colors={({ id }) => YOGA_TYPES[id as keyof typeof YOGA_TYPES].color}
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
            legend: 'Duration (minutes)',
            legendPosition: 'middle',
            legendOffset: -40,
          }}
          enableLabel={false}
          animate={true}
          motionConfig="gentle"
          tooltip={({ index, data }) => {
            const date = data.date;
            const practices = filteredData.filter((p) => p.date === date);
            return <TimelineTooltip date={date} practices={practices} total={data.total as number} />;
          }}
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
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'top',
              direction: 'row',
              justify: false,
              translateY: -20,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              itemOpacity: 0.85,
              symbolSize: 10,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      </div>
    </div>
  );
};