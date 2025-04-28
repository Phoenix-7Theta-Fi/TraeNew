'use client';

import { ResponsiveSunburst } from '@nivo/sunburst';

// Mock data structure for mindfulness practices
const mockMindfulnessData = {
  name: 'mindfulness',
  color: '#9333ea',
  children: [
    {
      name: 'Meditation',
      color: '#a855f7',
      children: [
        {
          name: 'Breathing',
          color: '#c084fc',
          value: 45,
        },
        {
          name: 'Body Scan',
          color: '#c084fc',
          value: 30,
        },
        {
          name: 'Loving-Kindness',
          color: '#c084fc',
          value: 25,
        },
      ],
    },
    {
      name: 'Movement',
      color: '#a855f7',
      children: [
        {
          name: 'Walking',
          color: '#c084fc',
          value: 35,
        },
        {
          name: 'Yoga',
          color: '#c084fc',
          value: 40,
        },
      ],
    },
    {
      name: 'Daily Life',
      color: '#a855f7',
      children: [
        {
          name: 'Eating',
          color: '#c084fc',
          value: 20,
        },
        {
          name: 'Observation',
          color: '#c084fc',
          value: 25,
        },
        {
          name: 'Gratitude',
          color: '#c084fc',
          value: 30,
        },
      ],
    },
  ],
};

const MindfulnessSunburst = () => {
  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">250</div>
          <div className="text-sm text-foreground/60">Total Minutes</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">8</div>
          <div className="text-sm text-foreground/60">Practices</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">31</div>
          <div className="text-sm text-foreground/60">Avg Min/Day</div>
        </div>
      </div>

      {/* Sunburst Chart */}
      <div className="h-[300px]">
        <ResponsiveSunburst
          data={mockMindfulnessData}
          margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
          id="name"
          value="value"
          cornerRadius={2}
          borderWidth={1}
          borderColor={{
            from: 'color',
            modifiers: [['darker', 0.2]],
          }}
          colors={{ datum: 'data.color' }}
          childColor={{
            from: 'color',
            modifiers: [['brighter', 0.13]],
          }}
          enableArcLabels={true}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{
            from: 'color',
            modifiers: [['darker', 1.4]],
          }}
          tooltip={({ id, value, color }) => (
            <div className="bg-background/90 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-primary/20">
              <div style={{ color }} className="font-semibold">
                {id}
              </div>
              <div className="text-sm">
                {value} minutes
              </div>
            </div>
          )}
          theme={{
            labels: {
              text: {
                fontSize: 11,
                fill: '#e2e8f0',
              },
            },
            tooltip: {
              container: {
                background: 'transparent',
                border: 'none',
                borderRadius: '8px',
                boxShadow: 'none',
              },
            },
          }}
        />
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="space-y-1">
          <div className="font-semibold">Meditation</div>
          <div className="text-foreground/60">• Breathing</div>
          <div className="text-foreground/60">• Body Scan</div>
          <div className="text-foreground/60">• Loving-Kindness</div>
        </div>
        <div className="space-y-1">
          <div className="font-semibold">Movement</div>
          <div className="text-foreground/60">• Walking</div>
          <div className="text-foreground/60">• Yoga</div>
        </div>
        <div className="space-y-1">
          <div className="font-semibold">Daily Life</div>
          <div className="text-foreground/60">• Eating</div>
          <div className="text-foreground/60">• Observation</div>
          <div className="text-foreground/60">• Gratitude</div>
        </div>
      </div>
    </div>
  );
};

export default MindfulnessSunburst;