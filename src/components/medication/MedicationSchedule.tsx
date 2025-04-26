'use client';

import { useEffect, useState } from 'react';
import type { MedicationSchedule } from '@/types/medication';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const MedicationScheduleChart = () => {
  const [scheduleData, setScheduleData] = useState<MedicationSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/medications?type=schedule&days=30', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch medication schedule data');
        const { data } = await response.json();
        setScheduleData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching medication schedule:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        setLoading(false);
      }
    };

    fetchScheduleData();
  }, []);

  const getColorForScore = (score: number) => {
    const hue = Math.min(score * 100, 100); // 0-100 range
    return `hsl(${hue}, 70%, 50%)`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  if (loading) {
    return (
      <div className="bg-surface p-6 rounded-lg shadow-lg flex items-center justify-center h-[400px]">
        <div className="text-primary">Loading medication schedule data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface p-6 rounded-lg shadow-lg flex items-center justify-center h-[400px]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-surface p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-primary">Medication Schedule</h2>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day Headers */}
        {DAYS.map(day => (
          <div key={day} className="text-center text-sm p-2 text-foreground">
            {day}
          </div>
        ))}
        
        {/* Calendar Cells */}
        {scheduleData.map((day) => {
          const date = new Date(day.date);
          const dayOfWeek = date.getDay();
          const score = day.adherenceScore;
          
          return (
            <div
              key={day.date}
              className="aspect-square p-1 relative group"
              style={{
                backgroundColor: getColorForScore(score),
                gridColumnStart: dayOfWeek === 0 ? 7 : dayOfWeek,
              }}
            >
              <div className="text-xs">{date.getDate()}</div>
              
              {/* Tooltip */}
              <div className="absolute hidden group-hover:block z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-background rounded shadow-lg text-sm">
                <div className="whitespace-nowrap">
                  <div>{formatDate(day.date)}</div>
                  <div>Adherence: {(score * 100).toFixed(0)}%</div>
                  <div>Medications: {day.medications.length}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <div className="flex items-center">
          <div className="w-4 h-4 mr-2" style={{ backgroundColor: getColorForScore(0) }}></div>
          <span className="text-sm">0%</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 mr-2" style={{ backgroundColor: getColorForScore(0.5) }}></div>
          <span className="text-sm">50%</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 mr-2" style={{ backgroundColor: getColorForScore(1) }}></div>
          <span className="text-sm">100%</span>
        </div>
      </div>
    </div>
  );
};

export default MedicationScheduleChart;



