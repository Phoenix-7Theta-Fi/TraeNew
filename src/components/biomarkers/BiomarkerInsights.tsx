'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface BiomarkerInsight {
  id: string;
  type: 'warning' | 'improvement' | 'trend' | 'recommendation';
  title: string;
  description: string;
  markers: string[];
  priority: number; // 1-3, with 1 being highest priority
  timestamp: string;
  action?: {
    label: string;
    href: string;
  };
}

interface BiomarkerInsightsProps {
  insights: BiomarkerInsight[];
  onInsightClick?: (insightId: string) => void;
}

const BiomarkerInsights: React.FC<BiomarkerInsightsProps> = ({
  insights,
  onInsightClick
}) => {
  const sortedInsights = useMemo(() => {
    return [...insights].sort((a, b) => {
      // Sort by priority first, then by timestamp
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [insights]);

  const getInsightIcon = (type: BiomarkerInsight['type']) => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'improvement':
        return '✨';
      case 'trend':
        return '📈';
      case 'recommendation':
        return '💡';
      default:
        return '•';
    }
  };

  const getInsightColor = (type: BiomarkerInsight['type']) => {
    switch (type) {
      case 'warning':
        return 'border-red-500/20 bg-red-500/10';
      case 'improvement':
        return 'border-green-500/20 bg-green-500/10';
      case 'trend':
        return 'border-blue-500/20 bg-blue-500/10';
      case 'recommendation':
        return 'border-yellow-500/20 bg-yellow-500/10';
      default:
        return 'border-gray-500/20 bg-gray-500/10';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sortedInsights.map((insight, index) => (
        <motion.div
          key={insight.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`
            p-4 rounded-lg border
            ${getInsightColor(insight.type)}
            cursor-pointer
            hover:scale-102 transition-transform
          `}
          onClick={() => onInsightClick?.(insight.id)}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl" role="img" aria-label={insight.type}>
              {getInsightIcon(insight.type)}
            </span>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">{insight.title}</h3>
              <p className="text-sm text-foreground/70 mb-3">
                {insight.description}
              </p>
              
              {insight.markers.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {insight.markers.map(marker => (
                    <span
                      key={marker}
                      className="text-xs px-2 py-1 rounded-full bg-surface-dark"
                    >
                      {marker}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center text-sm">
                <span className="text-foreground/50">
                  {new Date(insight.timestamp).toLocaleDateString()}
                </span>
                
                {insight.action && (
                  <a
                    href={insight.action.href}
                    className="text-primary hover:text-primary-dark transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {insight.action.label} →
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default BiomarkerInsights;