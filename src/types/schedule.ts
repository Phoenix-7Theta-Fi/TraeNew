export type ActivityStatus = 'completed' | 'in_progress' | 'upcoming' | 'missed';
export type ActivityCategory = 'yoga' | 'workout' | 'medication' | 'treatment' | 'mental';

export interface BaseActivity {
  id: string;
  title: string;
  description?: string;
  startTime: string; // Format: "HH:mm"
  endTime: string; // Format: "HH:mm"
  category: ActivityCategory;
  status: ActivityStatus;
}

export interface YogaActivity extends BaseActivity {
  category: 'yoga';
  style: string;
  intensity: string;
  props: string[];
}

export interface WorkoutActivity extends BaseActivity {
  category: 'workout';
  type: string;
  intensity: number;
  targetMuscles?: string[];
}

export interface MedicationActivity extends BaseActivity {
  category: 'medication';
  medications: string[];
  dosage: string;
  instructions?: string;
}

export interface TreatmentActivity extends BaseActivity {
  category: 'treatment';
  type: string;
  practitioner: string;
  location: string;
}

export interface MentalActivity extends BaseActivity {
  category: 'mental';
  type: string;
  duration: number;
}

export type ScheduleActivity = 
  | YogaActivity 
  | WorkoutActivity 
  | MedicationActivity 
  | TreatmentActivity 
  | MentalActivity;

export interface ScheduleTimelineProps {
  activities: ScheduleActivity[];
  selectedActivity: ScheduleActivity | null;
  onActivitySelect: (activity: ScheduleActivity) => void;
}

export interface ActivityDetailProps {
  activity: ScheduleActivity | null;
  onClose: () => void;
  onStatusChange: (id: string, status: ActivityStatus) => void;
}

export const CATEGORY_CONFIG = {
  yoga: {
    color: '#8B5CF6',
    icon: '🧘',
  },
  workout: {
    color: '#EF4444',
    icon: '💪',
  },
  medication: {
    color: '#3B82F6',
    icon: '💊',
  },
  treatment: {
    color: '#10B981',
    icon: '🏥',
  },
  mental: {
    color: '#F59E0B',
    icon: '🧠',
  },
} as const;
