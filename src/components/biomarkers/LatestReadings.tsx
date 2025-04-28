'use client';

import { useMemo } from 'react';
import type { Biomarker } from '@/types/biomarkers';

interface LatestReadingsProps {
  biomarkers: Biomarker[];
  onBiomarkerClick?: (biomarkerId: string) => void;
}

const LatestReadings: React.FC<LatestReadingsProps> = ({
  biomarkers,
  onBiomarkerClick
}) => {
  const sortedBiomarkers = useMemo(() => {
    return biomarkers
      .filter(marker => marker.latestReading)
      .sort((a, b) => {
        // Sort by out of range status first, then by date
        if (a.latestReading?.isOutOfRange && !b.latestReading?.isOutOfRange) return -1;
        if (!a.latestReading?.isOutOfRange && b.latestReading?.isOutOfRange) return 1;
        
        const dateA = new Date(a.latestReading?.date || '');
        const dateB = new Date(b.latestReading?.date || '');
        return dateB.getTime() - dateA.getTime();
      });
  }, [biomarkers]);

  const getTrendColor = (biomarker: Biomarker) => {
    if (!biomarker.latestReading?.isOutOfRange) return 'text-green-400';
    return biomarker.trend === 'improving' ? 'text-yellow-400' : 'text-red-400';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return '↑';
      case 'decreasing':
        return '↓';
      case 'stable':
        return '→';
      default:
        return '•';
    }
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedBiomarkers.map((biomarker) => (
        <button
          key={biomarker.id}
          onClick={() => onBiomarkerClick?.(biomarker.id)}
          className="text-left bg-surface-dark hover:bg-surface-darker p-4 rounded-lg transition-colors"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium">{biomarker.name}</h3>
              <p className="text-sm text-foreground/70">{biomarker.category}</p>
            </div>
            <span className={`
              text-lg font-medium
              ${getTrendColor(biomarker)}
            `}>
              {getTrendIcon(biomarker.trend)}
            </span>
          </div>

          {biomarker.latestReading && (
            <>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-semibold">
                  {biomarker.latestReading.value}
                </span>
                <span className="text-sm text-foreground/70">
                  {biomarker.unit}
                </span>
              </div>

              <div className="flex justify-between items-baseline text-sm">
                <span className="text-foreground/50">
                  Range: {biomarker.referenceRange.min} - {biomarker.referenceRange.max}
                </span>
                <span className="text-foreground/50">
                  {getRelativeTime(biomarker.latestReading.date)}
                </span>
              </div>

              {biomarker.latestReading.isOutOfRange && (
                <div className="mt-2 text-sm font-medium text-red-400">
                  Outside reference range
                </div>
              )}
            </>
          )}
        </button>
      ))}
    </div>
  );
};

export default LatestReadings;