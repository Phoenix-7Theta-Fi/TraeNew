'use client';

import FitnessRadar from './FitnessRadar';
import CardioTimeline from './CardioTimeline';

const WorkoutDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <FitnessRadar />
      </div>
      <div className="grid grid-cols-1 gap-6">
        <CardioTimeline />
      </div>
    </div>
  );
};

export default WorkoutDashboard;



