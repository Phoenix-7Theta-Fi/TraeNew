'use client';

import { useState, useEffect } from 'react';
import { YogaTimeline } from './YogaTimeline';
import YogaSunburst from './YogaSunburst';
import type { YogaTimeRange, YogaPracticeEntry } from '@/types/yoga';

const YogaDashboard = () => {
  const [timeRange, setTimeRange] = useState<YogaTimeRange>('week');
  const [practiceData, setPracticeData] = useState<YogaPracticeEntry[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMockData = async () => {
      try {
        setIsLoading(true);
        const { mockTimelineData } = await import('@/mocks/yogaTimelineData');
        setPracticeData(mockTimelineData);
        setIsInitialized(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    loadMockData();
  }, []);

  const handleTimeRangeChange = (newRange: YogaTimeRange) => {
    setTimeRange(newRange);
  };

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Yoga Practice Timeline</h1>
        <div className="flex items-center space-x-4">
          {/* Add additional controls here if needed */}
        </div>
      </div>

      <div className="bg-surface rounded-xl p-6 shadow-lg">
        <YogaTimeline
          data={practiceData}
          timeRange={timeRange}
          onTimeRangeChange={handleTimeRangeChange}
          isLoading={isLoading || !isInitialized}
          error={error || undefined}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface rounded-xl p-6 shadow-lg">
          <YogaSunburst />
        </div>
        <div className="bg-surface rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Practice Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-foreground/70">Total Sessions</span>
              <span className="font-medium">{practiceData.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/70">Total Minutes</span>
              <span className="font-medium">
                {practiceData.reduce((sum, practice) => sum + practice.duration, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YogaDashboard;
