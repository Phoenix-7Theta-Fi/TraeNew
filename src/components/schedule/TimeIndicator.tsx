'use client';

import { useState, useEffect } from 'react';

interface TimeIndicatorProps {
  startHour: number;
  endHour: number;
}

export default function TimeIndicator({ startHour, endHour }: TimeIndicatorProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  
  // Calculate position as percentage of timeline height
  const timelineStart = startHour;
  const timelineEnd = endHour;
  const currentTimeDecimal = currentHour + (currentMinute / 60);
  const position = ((currentTimeDecimal - timelineStart) / (timelineEnd - timelineStart)) * 100;

  // Only show indicator if within timeline bounds
  if (currentHour < startHour || currentHour > endHour) {
    return null;
  }

  return (
    <div 
      className="absolute w-full flex items-center pointer-events-none"
      style={{ top: `${position}%` }}
    >
      <div className="w-16 text-xs text-primary font-medium pr-2 text-right">
        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className="flex-grow h-[2px] bg-primary opacity-50" />
    </div>
  );
}