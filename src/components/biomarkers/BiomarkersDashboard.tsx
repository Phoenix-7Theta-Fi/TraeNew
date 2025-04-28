'use client';

import { useState, useEffect } from 'react';
import type { 
  Biomarker, 
  BiomarkerCategoryGroup, 
  BiomarkerTimelinePoint,
  BiomarkerInsight,
  BiomarkerCategory 
} from '@/types/biomarkers';
import BiomarkerTimeline from './BiomarkerTimeline';
import BiomarkerCategories from './BiomarkerCategories';
import LatestReadings from './LatestReadings';
import BiomarkerInsights from './BiomarkerInsights';

// Mock data (would normally be in a separate file or fetched from API)
const mockTimelineData: BiomarkerTimelinePoint[] = [
  {
    date: '2024-01-01',
    markers: {
      'glucose': 95,
      'vitamin_d': 45,
      'crp': 1.2,
    }
  },
  {
    date: '2024-02-01',
    markers: {
      'glucose': 92,
      'vitamin_d': 50,
      'crp': 0.8,
    }
  },
  // Add more mock data points...
];

const mockCategories: BiomarkerCategoryGroup[] = [
  {
    category: 'blood',
    name: 'Blood Markers',
    description: 'Key blood health indicators',
    biomarkers: [
      {
        id: 'glucose',
        name: 'Glucose',
        category: 'blood',
        description: 'Blood sugar level',
        unit: 'mg/dL',
        referenceRange: { min: 70, max: 100 },
        readings: [],
        trend: 'stable',
        latestReading: {
          value: 92,
          unit: 'mg/dL',
          date: '2024-02-01',
          isOutOfRange: false,
          referenceRange: { min: 70, max: 100 }
        }
      },
      {
        id: 'hemoglobin',
        name: 'Hemoglobin',
        category: 'blood',
        description: 'Oxygen-carrying protein in blood',
        unit: 'g/dL',
        referenceRange: { min: 12, max: 16 },
        readings: [],
        trend: 'stable',
        latestReading: {
          value: 14,
          unit: 'g/dL',
          date: '2024-02-01',
          isOutOfRange: false,
          referenceRange: { min: 12, max: 16 }
        }
      }
    ]
  },
  {
    category: 'hormones',
    name: 'Hormones',
    description: 'Endocrine system markers',
    biomarkers: [
      {
        id: 'cortisol',
        name: 'Cortisol',
        category: 'hormones',
        description: 'Stress hormone',
        unit: 'μg/dL',
        referenceRange: { min: 6, max: 23 },
        readings: [],
        trend: 'increasing',
        latestReading: {
          value: 15,
          unit: 'μg/dL',
          date: '2024-02-01',
          isOutOfRange: false,
          referenceRange: { min: 6, max: 23 }
        }
      },
      {
        id: 'thyroid',
        name: 'TSH',
        category: 'hormones',
        description: 'Thyroid stimulating hormone',
        unit: 'mIU/L',
        referenceRange: { min: 0.4, max: 4.0 },
        readings: [],
        trend: 'stable',
        latestReading: {
          value: 2.1,
          unit: 'mIU/L',
          date: '2024-02-01',
          isOutOfRange: false,
          referenceRange: { min: 0.4, max: 4.0 }
        }
      }
    ]
  },
  {
    category: 'vitamins',
    name: 'Vitamins & Minerals',
    description: 'Nutrient levels',
    biomarkers: [
      {
        id: 'vitamin_d',
        name: 'Vitamin D',
        category: 'vitamins',
        description: '25-hydroxy vitamin D',
        unit: 'ng/mL',
        referenceRange: { min: 30, max: 100 },
        readings: [],
        trend: 'decreasing',
        latestReading: {
          value: 25,
          unit: 'ng/mL',
          date: '2024-02-01',
          isOutOfRange: true,
          referenceRange: { min: 30, max: 100 }
        }
      },
      {
        id: 'b12',
        name: 'Vitamin B12',
        category: 'vitamins',
        description: 'Cobalamin',
        unit: 'pg/mL',
        referenceRange: { min: 200, max: 900 },
        readings: [],
        trend: 'stable',
        latestReading: {
          value: 550,
          unit: 'pg/mL',
          date: '2024-02-01',
          isOutOfRange: false,
          referenceRange: { min: 200, max: 900 }
        }
      }
    ]
  },
  {
    category: 'inflammatory',
    name: 'Inflammatory Markers',
    description: 'Inflammation indicators',
    biomarkers: [
      {
        id: 'crp',
        name: 'CRP',
        category: 'inflammatory',
        description: 'C-reactive protein',
        unit: 'mg/L',
        referenceRange: { min: 0, max: 3 },
        readings: [],
        trend: 'decreasing',
        latestReading: {
          value: 0.8,
          unit: 'mg/L',
          date: '2024-02-01',
          isOutOfRange: false,
          referenceRange: { min: 0, max: 3 }
        }
      }
    ]
  },
  {
    category: 'metabolic',
    name: 'Metabolic Markers',
    description: 'Metabolism health indicators',
    biomarkers: [
      {
        id: 'hba1c',
        name: 'HbA1c',
        category: 'metabolic',
        description: 'Glycated hemoglobin',
        unit: '%',
        referenceRange: { min: 4, max: 5.6 },
        readings: [],
        trend: 'stable',
        latestReading: {
          value: 5.2,
          unit: '%',
          date: '2024-02-01',
          isOutOfRange: false,
          referenceRange: { min: 4, max: 5.6 }
        }
      }
    ]
  }
];

const mockInsights: BiomarkerInsight[] = [
  {
    id: '1',
    type: 'improvement',
    title: 'Blood glucose stabilized',
    description: 'Blood glucose levels have stabilized within optimal range',
    markers: ['glucose'],
    priority: 1,
    timestamp: '2024-02-01',
    action: {
      label: 'View trend',
      href: '/biomarkers/glucose'
    }
  },
  {
    id: '2',
    type: 'warning',
    title: 'Vitamin D deficiency',
    description: 'Vitamin D levels are below the recommended range',
    markers: ['vitamin_d'],
    priority: 1,
    timestamp: '2024-02-01',
    action: {
      label: 'View recommendations',
      href: '/biomarkers/vitamin-d'
    }
  },
  {
    id: '3',
    type: 'trend',
    title: 'CRP trending downward',
    description: 'C-reactive protein levels show a decreasing trend',
    markers: ['crp'],
    priority: 2,
    timestamp: '2024-02-01'
  }
];

const BiomarkersDashboard = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedCategory, setSelectedCategory] = useState<BiomarkerCategory | null>(null);
  const [selectedMarkers, setSelectedMarkers] = useState<string[]>(['glucose', 'vitamin_d', 'crp']);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      try {
        setIsLoading(true);
        // In real implementation, this would fetch data from an API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleTimeRangeChange = (range: '7d' | '30d' | '90d') => {
    setTimeRange(range);
  };

  const handleMarkerToggle = (markerId: string) => {
    setSelectedMarkers(prev =>
      prev.includes(markerId)
        ? prev.filter(id => id !== markerId)
        : [...prev, markerId]
    );
  };

  const handleCategorySelect = (category: BiomarkerCategory) => {
    setSelectedCategory(category);
  };

  const handleBiomarkerClick = (biomarkerId: string) => {
    if (!selectedMarkers.includes(biomarkerId)) {
      setSelectedMarkers(prev => [...prev, biomarkerId]);
    }
  };

  const handleInsightClick = (insightId: string) => {
    // Handle insight click - could show detailed view or navigate
    console.log('Insight clicked:', insightId);
  };

  if (isLoading) {
    return (
      <div className="w-full p-6 bg-surface rounded-lg shadow-lg">
        <div className="animate-pulse flex justify-center items-center h-[400px]">
          Loading biomarker data...
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
      {/* Timeline Section */}
      <div className="bg-surface p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Biomarker Timeline</h2>
        <BiomarkerTimeline
          data={mockTimelineData}
          timeRange={timeRange}
          selectedMarkers={selectedMarkers}
          onTimeRangeChange={handleTimeRangeChange}
          onMarkerToggle={handleMarkerToggle}
        />
      </div>

      {/* Latest Readings Section */}
      <div className="bg-surface p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Latest Readings</h2>
        <LatestReadings
          biomarkers={mockCategories.flatMap(cat => cat.biomarkers)}
          onBiomarkerClick={handleBiomarkerClick}
        />
      </div>

      {/* Insights Section */}
      <div className="bg-surface p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Insights & Recommendations</h2>
        <BiomarkerInsights
          insights={mockInsights}
          onInsightClick={handleInsightClick}
        />
      </div>

      {/* Categories Grid */}
      <div className="bg-surface p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        <BiomarkerCategories
          categories={mockCategories}
          onCategorySelect={handleCategorySelect}
        />
      </div>
    </div>
  );
};

export default BiomarkersDashboard;
