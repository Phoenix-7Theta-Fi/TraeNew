'use client';

import HerbUsageTimeline from './HerbUsageTimeline';
import MedicationSchedule from './MedicationSchedule';

const MedicationDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HerbUsageTimeline />
      </div>
      <div className="grid grid-cols-1 gap-6">
        <MedicationSchedule />
      </div>
    </div>
  );
};

export default MedicationDashboard;



