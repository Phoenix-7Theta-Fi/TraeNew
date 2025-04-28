'use client';

import { useState } from 'react';
import type { ScheduleActivity, ActivityStatus } from '@/types/schedule';
import ScheduleTimeline from './ScheduleTimeline';
import ActivityDetail from './ActivityDetail';

// Mock data
const MOCK_SCHEDULE: ScheduleActivity[] = [
  {
    id: '1',
    title: 'Morning Yoga',
    startTime: '07:00',
    endTime: '08:00',
    category: 'yoga',
    status: 'completed',
    description: 'Energizing morning flow',
    style: 'Vinyasa',
    props: ['mat', 'blocks'],
    intensity: 'Moderate'
  },
  {
    id: '2',
    title: 'Blood Pressure Medication',
    startTime: '08:30',
    endTime: '08:35',
    category: 'medication',
    status: 'completed',
    medications: ['Lisinopril'],
    dosage: '10mg',
    instructions: 'Take with water before breakfast'
  },
  {
    id: '3',
    title: 'Strength Training',
    startTime: '10:00',
    endTime: '11:00',
    category: 'workout',
    status: 'in_progress',
    type: 'strength',
    targetMuscles: ['back', 'biceps'],
    intensity: 4,
    description: 'Upper body focus'
  },
  {
    id: '4',
    title: 'Acupuncture Session',
    startTime: '14:00',
    endTime: '15:00',
    category: 'treatment',
    status: 'upcoming',
    practitioner: 'Dr. Smith',
    location: 'Wellness Center',
    type: 'acupuncture',
    description: 'Monthly session'
  },
  {
    id: '5',
    title: 'Evening Meditation',
    startTime: '20:00',
    endTime: '20:30',
    category: 'mental',
    status: 'upcoming',
    type: 'meditation',
    duration: 30,
    description: 'Mindfulness practice'
  }
];

export default function DailySchedule() {
  const [selectedActivity, setSelectedActivity] = useState<ScheduleActivity | null>(null);

  const handleActivitySelect = (activity: ScheduleActivity) => {
    setSelectedActivity(activity);
  };

  const handleStatusChange = (id: string, status: ActivityStatus) => {
    // In real implementation, this would update the backend
    console.log('Status changed:', id, status);
  };

  const handleClose = () => {
    setSelectedActivity(null);
  };

  return (
    <div className="flex h-[600px] gap-4 p-6 bg-surface rounded-lg shadow-lg">
      <div className="flex-grow">
        <ScheduleTimeline
          activities={MOCK_SCHEDULE}
          selectedActivity={selectedActivity}
          onActivitySelect={handleActivitySelect}
        />
      </div>
      <div className="w-1/4 min-w-[300px]">
        <ActivityDetail
          activity={selectedActivity}
          onClose={handleClose}
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
}