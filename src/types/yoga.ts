// Base types for yoga poses and categories
export interface YogaPose {
    id: string;
    name: {
        sanskrit: string;
        english: string;
    };
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    durationInSeconds: number;
    benefits: string[];
    frequency: number; // Times practiced
    practiceTimeMinutes: number;
}

// Level 4 - Sub-subcategories containing poses
export interface YogaSubSubCategory {
    id: string;
    name: string;
    description: string;
    practiceTimeMinutes: number;
    poses: YogaPose[];
}

// Level 3 - Subcategories that can contain either poses directly or sub-subcategories
export interface YogaSubCategory {
    id: string;
    name: string;
    description: string;
    practiceTimeMinutes: number;
    subCategories?: YogaSubSubCategory[]; // Optional: some subcategories might have deeper nesting
    poses?: YogaPose[]; // Optional: some subcategories might have poses directly
}

// Level 2 - Main categories
export interface YogaCategory {
    id: string;
    name: string;
    description: string;
    practiceTimeMinutes: number;
    subCategories: YogaSubCategory[];
}

// Type for the complete yoga practice data
export interface YogaPracticeData {
    userId: string;
    categories: YogaCategory[];
    lastUpdated: Date;
}

// Types for Sunburst visualization
export interface YogaSunburstNode {
    name: string;
    value?: number; // Practice time in minutes
    itemStyle?: {
        color?: string;
    };
    children?: YogaSunburstNode[];
}

export interface YogaSunburstData {
    name: string;
    children: YogaSunburstNode[];
}

// Extended API response types
export interface YogaResponse {
    success: boolean;
    data?: YogaPracticeData | YogaSunburstData; // Can return either format
    error?: string;
}

// Type for aggregated practice metrics
export interface YogaPracticeMetrics {
    totalPracticeTime: number; // in minutes
    practicesByCategory: {
        [categoryId: string]: number;
    };
    practicesByDifficulty: {
        beginner: number;
        intermediate: number;
        advanced: number;
    };
}

// Type for API query parameters
export interface YogaQueryParams {
    view?: 'detailed' | 'sunburst';
    timeframe?: 'week' | 'month' | 'year' | 'all';
    categoryId?: string;
}

// Type for the POST request body when updating practice data
export interface YogaPracticeUpdateBody {
    poseId: string;
    categoryId: string;
    subCategoryId: string;
    subSubCategoryId?: string; // Optional: needed only for poses in level 4
}

// New types for timeline visualization
export type YogaTimeRange = 'week' | 'month' | '3months';

export interface YogaType {
  name: string;
  color: string;
  intensityRange: {
    min: number;
    max: number;
  };
  frequency: number;
}

export interface YogaPracticeEntry {
  id: string;
  date: string;
  type: string;
  typeName: string;
  color: string;
  duration: number;
  focus: string;
  intensity: 'Gentle' | 'Moderate' | 'Vigorous';
  props: string;
}

export interface YogaTimelineSummaryStats {
  totalPractices: number;
  totalMinutes: number;
  typeDistribution: Record<string, number>;
  averageDuration: number;
  longestStreak: number;
  currentStreak: number;
}

export interface YogaTimelineProps {
  data: YogaPracticeEntry[];
  timeRange: YogaTimeRange;
  onTimeRangeChange: (range: YogaTimeRange) => void;
  isLoading?: boolean;
  error?: string;
}

// For the stacked bar chart data structure
export interface YogaTimelineBarData {
  date: string;
  [key: string]: string | number; // For dynamic yoga type properties
  total?: number;
}

// For the timeline tooltip
export interface YogaTimelineTooltipProps {
  date: string;
  practices: YogaPracticeEntry[];
  total: number;
}
