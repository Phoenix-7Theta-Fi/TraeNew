import { ObjectId } from "mongodb";

// Fitness Metrics Types
export interface FitnessMetrics {
  strength: number;
  endurance: number;
  flexibility: number;
  power: number;
  balance: number;
  coreStability: number;
  recoveryRate: number;
  vo2Max: number;
}

// Cardio Performance Types
export type CardioActivity = 'running' | 'cycling' | 'swimming' | 'rowing';

export interface HeartRateZone {
  zone: 1 | 2 | 3 | 4 | 5;
  minutes: number;
  minHR: number;
  maxHR: number;
}

export interface CardioSession {
  date: Date;
  activity: CardioActivity;
  duration: number; // in minutes
  distance?: number; // in meters
  averageHeartRate: number;
  maxHeartRate: number;
  zones: HeartRateZone[];
  averagePace?: number; // in seconds per kilometer
}

// MongoDB Document Type
export interface WorkoutDocument {
  _id?: ObjectId;
  userId: string;
  fitnessMetrics: {
    current: FitnessMetrics;
    target: FitnessMetrics;
  };
  cardioSessions: CardioSession[];
  createdAt: Date;
  updatedAt: Date;
}
