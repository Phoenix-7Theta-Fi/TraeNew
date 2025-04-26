// Base types
export type HerbDosage = {
    [herb: string]: number;
};

export type HerbUsage = {
    userId: string;
    date: Date;
    herbs: HerbDosage;
};

export type MedicationSchedule = {
    userId: string;
    date: Date;
    adherenceScore: number;
    medications: string[];
};

export type TreatmentCategory = 'Herbs' | 'Therapy' | 'Exercise' | 'Diet';

export type TreatmentStatus = 'scheduled' | 'ongoing' | 'completed';

export type Treatment = {
    userId: string;
    name: string;
    category: TreatmentCategory;
    description: string;
    startDate: Date;
    endDate: Date;
    status: TreatmentStatus;
};

// API Response types
export type HerbUsageResponse = {
    success: boolean;
    data: HerbUsage[];
    error?: string;
};

export type MedicationScheduleResponse = {
    success: boolean;
    data: MedicationSchedule[];
    error?: string;
};

export type TreatmentResponse = {
    success: boolean;
    data: Treatment[];
    error?: string;
};

// API Request types
export type DateRangeRequest = {
    startDate?: string;
    endDate?: string;
    days?: number;
};

// Add this interface to your existing types
export interface DoshaData {
  vata: number;
  pitta: number;
  kapha: number;
  prana: number;
  samana: number;
  pachaka: number;
  sadhaka: number;
  avalambaka: number;
}

export const mockDoshaData: DoshaData = {
  vata: 65,
  pitta: 45,
  kapha: 70,
  prana: 75,
  samana: 60,
  pachaka: 50,
  sadhaka: 55,
  avalambaka: 65
};
