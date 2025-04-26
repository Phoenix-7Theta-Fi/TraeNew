'use client';

import DoshaRadar from './DoshaRadar';
import TreatmentTimeline from './TreatmentTimeline';

const TreatmentPlanDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DoshaRadar />
      </div>
      <div className="grid grid-cols-1 gap-6">
        <TreatmentTimeline />
      </div>
    </div>
  );
};

export default TreatmentPlanDashboard;
