// Basic biomarker reading type
export interface BiomarkerReading {
    value: number;
    unit: string;
    date: string;
    isOutOfRange: boolean;
    referenceRange: {
        min: number;
        max: number;
    };
}

// Individual biomarker definition
export interface Biomarker {
    id: string;
    name: string;
    category: BiomarkerCategory;
    description: string;
    unit: string;
    referenceRange: {
        min: number;
        max: number;
    };
    readings: BiomarkerReading[];
    trend: 'increasing' | 'decreasing' | 'stable';
    latestReading?: BiomarkerReading;
}

// Biomarker categories
export type BiomarkerCategory = 
    | 'blood'
    | 'hormones'
    | 'vitamins'
    | 'inflammatory'
    | 'metabolic';

// Category group type
export interface BiomarkerCategoryGroup {
    category: BiomarkerCategory;
    name: string;
    description: string;
    biomarkers: Biomarker[];
}

// Timeline data point
export interface BiomarkerTimelinePoint {
    date: string;
    markers: {
        [key: string]: number;
    };
}

// Analysis/Insights type
export interface BiomarkerInsight {
    id: string;
    biomarkerId: string;
    type: 'warning' | 'improvement' | 'info';
    message: string;
    recommendation?: string;
    date: string;
}

// Component props types
export interface BiomarkerTimelineProps {
    data: BiomarkerTimelinePoint[];
    timeRange: '7d' | '30d' | '90d';
    selectedMarkers: string[];
    onTimeRangeChange: (range: '7d' | '30d' | '90d') => void;
    onMarkerToggle: (markerId: string) => void;
}

export interface BiomarkerCategoriesProps {
    categories: BiomarkerCategoryGroup[];
    onCategorySelect: (category: BiomarkerCategory) => void;
}

export interface LatestReadingsProps {
    biomarkers: Biomarker[];
}

export interface BiomarkerInsightsProps {
    insights: BiomarkerInsight[];
}

// Response types for API integration (for future use)
export interface BiomarkerResponse {
    success: boolean;
    data?: {
        biomarkers: Biomarker[];
        insights: BiomarkerInsight[];
    };
    error?: string;
}