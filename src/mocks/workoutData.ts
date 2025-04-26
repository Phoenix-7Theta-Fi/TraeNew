import { 
  WorkoutData, 
  FitnessMetrics, 
  WorkoutVolume, 
  CardioSession, 
  HeartRateZone 
} from '../types/workout';

// Mock current fitness metrics
const currentMetrics: FitnessMetrics = {
  strength: 75,
  endurance: 68,
  flexibility: 62,
  power: 70,
  balance: 65,
  coreStability: 72,
  recoveryRate: 80,
  vo2Max: 65,
};

// Mock target fitness metrics
const targetMetrics: FitnessMetrics = {
  strength: 85,
  endurance: 80,
  flexibility: 75,
  power: 82,
  balance: 78,
  coreStability: 85,
  recoveryRate: 88,
  vo2Max: 75,
};

// Helper function to generate heart rate zones
const generateHeartRateZones = (maxHR: number): HeartRateZone[] => {
  return [
    { zone: 1, minutes: Math.floor(Math.random() * 15) + 5, minHR: maxHR * 0.5, maxHR: maxHR * 0.6 },
    { zone: 2, minutes: Math.floor(Math.random() * 20) + 10, minHR: maxHR * 0.6, maxHR: maxHR * 0.7 },
    { zone: 3, minutes: Math.floor(Math.random() * 25) + 15, minHR: maxHR * 0.7, maxHR: maxHR * 0.8 },
    { zone: 4, minutes: Math.floor(Math.random() * 15) + 5, minHR: maxHR * 0.8, maxHR: maxHR * 0.9 },
    { zone: 5, minutes: Math.floor(Math.random() * 10) + 2, minHR: maxHR * 0.9, maxHR: maxHR }
  ];
};

// Generate last 7 days of cardio sessions
const generateCardioSessions = (): CardioSession[] => {
  const sessions: CardioSession[] = [];
  const activities: Array<'running' | 'cycling' | 'swimming' | 'rowing'> = ['running', 'cycling', 'swimming', 'rowing'];
  
  for (let i = 6; i >= 0; i--) {
    if (Math.random() > 0.3) { // 70% chance of having a session on any given day
      const date = new Date();
      date.setDate(date.getDate() - i);
      const maxHR = Math.floor(Math.random() * 20) + 170; // Random max HR between 170-190

      sessions.push({
        date,
        activity: activities[Math.floor(Math.random() * activities.length)],
        duration: Math.floor(Math.random() * 30) + 30, // 30-60 minutes
        distance: Math.floor(Math.random() * 5000) + 3000, // 3-8km
        averageHeartRate: maxHR - 20,
        maxHeartRate: maxHR,
        zones: generateHeartRateZones(maxHR),
        averagePace: Math.floor(Math.random() * 60) + 240 // 4-5 min/km
      });
    }
  }
  return sessions;
};

// Combined mock workout data
export const mockWorkoutData: WorkoutData = {
  fitnessMetrics: {
    current: currentMetrics,
    target: targetMetrics
  },
  cardioSessions: generateCardioSessions()
};

