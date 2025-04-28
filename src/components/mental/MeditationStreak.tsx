'use client';

import { ResponsiveBar } from '@nivo/bar';

// Generate last 14 days of mock meditation data
const generateMockMeditationData = () => {
  const data = [];
  const now = new Date();
  const meditationTypes = ['mindfulness', 'breathing', 'bodyScan'];
  
  for (let i = 13; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Randomly decide if there was meditation on this day (80% chance)
    const hasMeditation = Math.random() < 0.8;
    
    if (hasMeditation) {
      const type = meditationTypes[Math.floor(Math.random() * meditationTypes.length)];
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        duration: Math.floor(Math.random() * 30) + 10, // 10-40 minutes
        type,
        completed: true
      });
    } else {
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        duration: 0,
        type: 'none',
        completed: false
      });
    }
  }
  
  return data;
};

const mockData = generateMockMeditationData();

// Calculate current streak
const calculateStreak = (data) => {
  let currentStreak = 0;
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i].completed) {
      currentStreak++;
    } else {
      break;
    }
  }
  return currentStreak;
};

const MeditationStreak = () => {
  const currentStreak = calculateStreak(mockData);
  
  return (
    <div className="space-y-4">
      {/* Streak Information */}
      <div className="flex items-center justify-between">
        <div className="text-sm">
          <span className="text-2xl font-bold text-primary mr-2">{currentStreak}</span>
          day streak
        </div>
        <div className="text-sm text-foreground/60">
          Last 14 days
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-[200px]">
        <ResponsiveBar
          data={mockData}
          keys={['duration']}
          indexBy="date"
          margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
          padding={0.3}
          valueScale={{ type: 'linear' }}
          colors={({ data }) => data.completed ? '#9333ea' : '#4b5563'}
          borderRadius={4}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            tickValues: mockData.map(d => d.date),
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'minutes',
            legendPosition: 'middle',
            legendOffset: -32
          }}
          enableLabel={false}
          role="application"
          tooltip={({ value, indexValue, color }) => (
            <div className="bg-background/90 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-primary/20">
              <div className="font-semibold">{indexValue}</div>
              {value > 0 ? (
                <>
                  <div className="text-sm">{value} minutes</div>
                  <div className="text-sm text-foreground/60">
                    {mockData.find(d => d.date === indexValue)?.type}
                  </div>
                </>
              ) : (
                <div className="text-sm text-foreground/60">No meditation</div>
              )}
            </div>
          )}
          theme={{
            axis: {
              ticks: {
                text: {
                  fill: '#e2e8f0',
                  fontSize: 11
                }
              },
              legend: {
                text: {
                  fill: '#e2e8f0',
                  fontSize: 12
                }
              }
            },
            grid: {
              line: {
                stroke: '#2d374810'
              }
            },
            tooltip: {
              container: {
                background: 'transparent',
                border: 'none',
                borderRadius: '8px',
                boxShadow: 'none'
              }
            }
          }}
        />
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-[#9333ea] mr-2"></div>
          Completed
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-[#4b5563] mr-2"></div>
          Missed
        </div>
      </div>
    </div>
  );
};

export default MeditationStreak;