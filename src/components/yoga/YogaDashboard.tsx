'use client';

import YogaSunburst from './YogaSunburst';

const YogaDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <YogaSunburst />
      </div>
    </div>
  );
};

export default YogaDashboard;