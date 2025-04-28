'use client';

import { ResponsiveHeatMap } from '@nivo/heatmap';

// Generate mock data for sleep quality over the past month
const generateMockData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  
  return weeks.map(week => ({
    id: week,
    data: days.map(day => ({
      x: day,
      y: Math.floor(Math.random() * 100) // Random sleep quality score between 0-100
    }))
  }));
};

const SleepCalendar = () => {
  const mockData = generateMockData();

  return (
    <div className="h-[300px] w-full">
      <ResponsiveHeatMap
        data={mockData}
        margin={{ top: 20, right: 40, bottom: 20, left: 60 }}
        valueFormat=">-.2f"
        axisTop={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -90,
          legend: '',
          legendOffset: 46
        }}
        axisRight={null}
        axisBottom={null}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: '',
          legendPosition: 'middle',
          legendOffset: -40
        }}
        colors={{
          type: 'sequential',
          scheme: 'purples'
        }}
        emptyColor="#555555"
        borderColor={{
          from: 'color',
          modifiers: [['darker', 0.8]]
        }}
        borderWidth={1}
        borderRadius={4}
        enableLabels={true}
        labelTextColor={{
          from: 'color',
          modifiers: [['darker', 3]]
        }}
        theme={{
          axis: {
            ticks: {
              text: {
                fill: '#e2e8f0'
              }
            },
            legend: {
              text: {
                fill: '#e2e8f0'
              }
            }
          },
          labels: {
            text: {
              fill: '#e2e8f0',
              fontSize: 12
            }
          },
          tooltip: {
            container: {
              background: '#1a1b1e',
              color: '#e2e8f0',
              fontSize: 12
            }
          }
        }}
        tooltip={({ cell }) => (
          <div className="bg-background/90 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-primary/20">
            <strong>{cell.data.x}</strong> ({cell.serieId})
            <br />
            Sleep Quality: {cell.data.y.toFixed(1)}%
          </div>
        )}
      />
    </div>
  );
};

export default SleepCalendar;

