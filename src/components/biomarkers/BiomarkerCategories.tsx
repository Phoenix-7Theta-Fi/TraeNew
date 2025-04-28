'use client';

import { useState } from 'react';
import type { BiomarkerCategoriesProps, BiomarkerCategory, Biomarker } from '@/types/biomarkers';

// Category icons and colors mapping
const CATEGORY_CONFIG = {
  blood: {
    icon: '🩸',
    color: '#EF4444', // red-500
    label: 'Blood Markers'
  },
  hormones: {
    icon: '⚡',
    color: '#8B5CF6', // purple-500
    label: 'Hormones'
  },
  vitamins: {
    icon: '💊',
    color: '#F59E0B', // amber-500
    label: 'Vitamins & Minerals'
  },
  inflammatory: {
    icon: '🔥',
    color: '#EC4899', // pink-500
    label: 'Inflammatory Markers'
  },
  metabolic: {
    icon: '⚖️',
    color: '#10B981', // emerald-500
    label: 'Metabolic Markers'
  }
};

const BiomarkerCategories: React.FC<BiomarkerCategoriesProps> = ({
  categories,
  onCategorySelect
}) => {
  const [expandedCategory, setExpandedCategory] = useState<BiomarkerCategory | null>(null);

  const handleCategoryClick = (category: BiomarkerCategory) => {
    setExpandedCategory(expandedCategory === category ? null : category);
    onCategorySelect(category);
  };

  const renderBiomarkerCard = (biomarker: Biomarker) => {
    const isOutOfRange = biomarker.latestReading?.isOutOfRange;
    const trendIcon = biomarker.trend === 'increasing' ? '↑' : 
                     biomarker.trend === 'decreasing' ? '↓' : '→';
    
    return (
      <div 
        key={biomarker.id}
        className="bg-surface-dark p-4 rounded-lg space-y-2"
      >
        <div className="flex justify-between items-start">
          <h4 className="font-medium">{biomarker.name}</h4>
          <span className={`
            text-sm font-medium
            ${isOutOfRange ? 'text-red-400' : 'text-green-400'}
          `}>
            {trendIcon}
          </span>
        </div>
        
        {biomarker.latestReading && (
          <div className="space-y-1">
            <div className="flex justify-between items-baseline">
              <span className="text-xl font-semibold">
                {biomarker.latestReading.value}
              </span>
              <span className="text-sm text-foreground/70">
                {biomarker.unit}
              </span>
            </div>
            <div className="text-xs text-foreground/50">
              Range: {biomarker.referenceRange.min} - {biomarker.referenceRange.max}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((categoryGroup) => {
        const config = CATEGORY_CONFIG[categoryGroup.category];
        const isExpanded = expandedCategory === categoryGroup.category;
        
        return (
          <div
            key={categoryGroup.category}
            className={`
              bg-surface p-4 rounded-lg transition-all duration-200
              ${isExpanded ? 'col-span-full' : ''}
            `}
          >
            <button
              onClick={() => handleCategoryClick(categoryGroup.category)}
              className="w-full flex items-center justify-between p-2 hover:bg-surface-dark rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{config.icon}</span>
                <div className="text-left">
                  <h3 className="font-semibold">{config.label}</h3>
                  <p className="text-sm text-foreground/70">
                    {categoryGroup.biomarkers.length} markers
                  </p>
                </div>
              </div>
              <span className={`
                transform transition-transform
                ${isExpanded ? 'rotate-180' : ''}
              `}>
                ▼
              </span>
            </button>

            {isExpanded && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryGroup.biomarkers.map(renderBiomarkerCard)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BiomarkerCategories;