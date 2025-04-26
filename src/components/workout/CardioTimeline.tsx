'use client';

import ReactECharts from 'echarts-for-react';
import type { CardioSession, WorkoutDocument } from '@/types/workout';
import { useEffect, useState } from 'react';

// Utility functions
const metersToKm = (meters: number = 0) => (meters / 1000).toFixed(2);
const formatPace = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Activity configurations
const activityConfig = {
  running: { icon: '🏃', color: '#3B82F6' }, // Blue-500
  cycling: { icon: '🚴', color: '#22C55E' }, // Green-500
  swimming: { icon: '🏊', color: '#06B6D4' }, // Cyan-500
  rowing: { icon: '🚣', color: '#8B5CF6' }   // Purple-500
};

const CardioTimeline: React.FC = () => {
  const [data, setData] = useState<CardioSession[]>([]);
  const [options, setOptions] = useState({});

  useEffect(() => {
    const dates = data.map(session => session.date);
    const distances = data.map(session => session.distance ? parseFloat(metersToKm(session.distance)) : 0);
    const durations = data.map(session => session.duration);
    const paces = data.map(session => session.averagePace ? session.averagePace : 0);
    const heartRates = data.map(session => session.averageHeartRate);

    const newOptions = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        formatter: (params: any) => {
          const index = params[0].dataIndex;
          const session = data[index];
          const distance = session.distance ? metersToKm(session.distance) : '0';
          const pace = session.averagePace ? formatPace(session.averagePace) : 'N/A';
          return `
            <div class="font-semibold" style="margin-bottom: 8px">
              ${activityConfig[session.activity].icon} ${new Date(session.date).toLocaleDateString()}
            </div>
            <div style="display: grid; gap: 4px">
              <div style="color: var(--primary)">Distance: ${distance} km</div>
              <div style="color: #22c55e">Duration: ${session.duration} mins</div>
              <div style="color: #fde047">Pace: ${pace} min/km</div>
              <div style="color: #ef4444">
                Heart Rate: ${session.averageHeartRate} bpm
                ${session.maxHeartRate ? `(max: ${session.maxHeartRate} bpm)` : ''}
              </div>
            </div>
          `;
        }
      },
      legend: {
        data: ['Distance (km)', 'Duration (min)', 'Pace (min/km)', 'Heart Rate (bpm)'],
        textStyle: {
          color: 'var(--foreground)'
        },
        bottom: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLabel: {
          color: 'var(--foreground)',
          formatter: (value: string) => {
            return new Date(value).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            });
          }
        },
        axisLine: {
          lineStyle: {
            color: 'var(--foreground)'
          }
        }
      },
      yAxis: [
        {
          type: 'value',
          name: 'Distance/Duration',
          position: 'left',
          axisLabel: {
            color: 'var(--foreground)'
          },
          axisLine: {
            lineStyle: {
              color: 'var(--foreground)'
            }
          }
        },
        {
          type: 'value',
          name: 'Pace',
          position: 'right',
          axisLabel: {
            color: 'var(--foreground)',
            formatter: '{value} min/km'
          },
          axisLine: {
            lineStyle: {
              color: 'var(--foreground)'
            }
          }
        },
        {
          type: 'value',
          name: 'Heart Rate',
          position: 'right',
          offset: 80,
          min: 'dataMin',
          axisLabel: {
            color: 'var(--foreground)',
            formatter: '{value} bpm'
          },
          axisLine: {
            lineStyle: {
              color: '#ef4444'
            }
          }
        }
      ],
      series: [
        {
          name: 'Distance (km)',
          type: 'bar',
          data: distances,
          itemStyle: {
            color: (params: any) => {
              const session = data[params.dataIndex];
              return activityConfig[session.activity].color;
            }
          },
          emphasis: {
            itemStyle: {
              opacity: 0.8
            }
          }
        },
        {
          name: 'Duration (min)',
          type: 'line',
          data: durations,
          smooth: true,
          lineStyle: {
            color: '#22c55e' // Green-500
          },
          itemStyle: {
            color: '#22c55e'
          }
        },
        {
          name: 'Pace (min/km)',
          type: 'line',
          yAxisIndex: 1,
          data: paces.map(seconds => seconds / 60), // Convert seconds to minutes for display
          smooth: true,
          lineStyle: {
            color: '#fde047' // Yellow-300
          },
          itemStyle: {
            color: '#fde047'
          },
          label: {
            show: true,
            formatter: (params: any) => formatPace(params.value * 60) // Convert back to seconds for formatting
          }
        },
        {
          name: 'Heart Rate (bpm)',
          type: 'line',
          yAxisIndex: 2,
          data: heartRates,
          smooth: true,
          lineStyle: {
            color: '#ef4444' // Red-500
          },
          itemStyle: {
            color: '#ef4444'
          },
          showSymbol: true,
          symbol: 'circle',
          symbolSize: 6
        }
      ],
      backgroundColor: 'transparent'
    };

    setOptions(newOptions);
  }, [data]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/workouts', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch workout data');
        }

        const result = await response.json();
        if (result.success && result.data) {
          const workoutData = result.data as WorkoutDocument;
          setData(workoutData.cardioSessions.sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          ));
        } else {
          setError(result.error || 'No workout data available');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch workout data');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutData();
  }, []);

  if (loading) {
    return (
      <div className="bg-surface p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Cardio Progress Timeline</h2>
        <div className="flex justify-center items-center h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !data.length) {
    return (
      <div className="bg-surface p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Cardio Progress Timeline</h2>
        <div className="flex justify-center items-center h-[400px] text-error">
          {error || 'No cardio data available'}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Cardio Progress Timeline</h2>
      <ReactECharts 
        option={options} 
        style={{ height: '400px', width: '100%' }}
        theme="dark"
      />
    </div>
  );
};

export default CardioTimeline;
