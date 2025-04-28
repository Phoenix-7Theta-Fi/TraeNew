'use client';

import { useMemo } from 'react';
import TimeIndicator from './TimeIndicator';
import { ScheduleActivity, ScheduleTimelineProps, CATEGORY_CONFIG } from '@/types/schedule';

const START_HOUR = 6;  // 6 AM
const END_HOUR = 22;   // 10 PM
const HOUR_HEIGHT = 60; // pixels per hour

export default function ScheduleTimeline({ 
  activities, 
  selectedActivity, 
  onActivitySelect 
}: ScheduleTimelineProps) {
  // Generate hour markers
  const hourMarkers = useMemo(() => {
    return Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => {
      const hour = START_HOUR + i;
      return {
        hour,
        label: `${hour % 12 || 12}${hour < 12 ? 'am' : 'pm'}`
      };
    });
  }, []);

  // Calculate activity position and height
  const getActivityStyle = (activity: ScheduleActivity) => {
    const [startHour, startMinute] = activity.startTime.split(':').map(Number);
    const [endHour, endMinute] = activity.endTime.split(':').map(Number);
    
    const startDecimal = startHour + (startMinute / 60);
    const endDecimal = endHour + (endMinute / 60);
    
    const top = ((startDecimal - START_HOUR) / (END_HOUR - START_HOUR)) * 100;
    const height = ((endDecimal - startDecimal) / (END_HOUR - START_HOUR)) * 100;
    
    return {
      top: `${top}%`,
      height: `${height}%`
    };
  };

  return (
    <div className="relative h-full">
      {/* Hour markers */}
      <div className="absolute left-0 top-0 w-16 h-full">
        {hourMarkers.map(({ hour, label }) => (
          <div 
            key={hour}
            className="absolute text-xs text-gray-400"
            style={{ top: `${((hour - START_HOUR) / (END_HOUR - START_HOUR)) * 100}%` }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Timeline grid */}
      <div className="absolute left-16 right-0 top-0 h-full">
        {hourMarkers.map(({ hour }) => (
          <div 
            key={hour}
            className="absolute w-full border-t border-gray-800"
            style={{ top: `${((hour - START_HOUR) / (END_HOUR - START_HOUR)) * 100}%` }}
          />
        ))}

        {/* Current time indicator */}
        <TimeIndicator startHour={START_HOUR} endHour={END_HOUR} />

        {/* Activities */}
        {activities.map((activity) => {
          const style = getActivityStyle(activity);
          const config = CATEGORY_CONFIG[activity.category];
          
          return (
            <div
              key={activity.id}
              className={`absolute left-0 right-0 mx-2 p-2 rounded cursor-pointer transition-all
                ${selectedActivity?.id === activity.id ? 'ring-2 ring-primary' : ''}
                ${activity.status === 'completed' ? 'opacity-50' : ''}`}
              style={{
                ...style,
                backgroundColor: config.color + '20', // Add transparency
                borderLeft: `4px solid ${config.color}`
              }}
              onClick={() => onActivitySelect(activity)}
            >
              <div className="flex items-center gap-2">
                <span>{config.icon}</span>
                <span className="text-sm font-medium truncate">{activity.title}</span>
              </div>
              <div className="text-xs text-gray-400">
                {activity.startTime} - {activity.endTime}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}