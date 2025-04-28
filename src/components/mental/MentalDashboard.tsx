'use client';

import { useState } from 'react';
import SleepCalendar from './SleepCalendar';
import MeditationStreak from './MeditationStreak';
import MindfulnessSunburst from './MindfulnessSunburst';

// Types
interface SleepEntry {
  date: string;
  duration: number;
  quality: number;
  bedtime: string;
  wakeTime: string;
  disruptions: number;
}

interface MeditationSession {
  date: string;
  duration: number;
  type: 'mindfulness' | 'breathing' | 'bodyScan';
  notes?: string;
}

interface MindfulnessData {
  name: string;
  value: number;
  children?: MindfulnessData[];
}

const MentalDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="w-full p-6 bg-surface rounded-lg shadow-lg">
        <div className="animate-pulse flex justify-center items-center h-[400px]">
          Loading mental wellness data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 bg-surface rounded-lg shadow-lg">
        <div className="text-red-500 flex justify-center items-center h-[400px]">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Sleep Stats</h3>
          {/* Sleep stats will go here */}
        </div>
        <div className="bg-surface p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Meditation Stats</h3>
          {/* Meditation stats will go here */}
        </div>
      </div>

      {/* Sleep Calendar */}
      <div className="bg-surface p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Sleep Calendar</h3>
        <SleepCalendar />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Meditation Streak</h3>
          <MeditationStreak />
        </div>
        <div className="bg-surface p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Mindfulness Distribution</h3>
          <MindfulnessSunburst />
        </div>
      </div>
    </div>
  );
};

export default MentalDashboard;


