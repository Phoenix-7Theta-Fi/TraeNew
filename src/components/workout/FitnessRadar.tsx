'use client';

import ReactECharts from 'echarts-for-react';
import type { FitnessMetrics, WorkoutDocument } from '@/types/workout';
import { useEffect, useState } from 'react';

const FitnessRadar: React.FC = () => {
  const [current, setCurrent] = useState<FitnessMetrics | null>(null);
  const [target, setTarget] = useState<FitnessMetrics | null>(null);
  const [options, setOptions] = useState({});
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

        const data = await response.json();
        if (data.success && data.data) {
          const workoutData = data.data as WorkoutDocument;
          setCurrent(workoutData.fitnessMetrics.current);
          setTarget(workoutData.fitnessMetrics.target);
        } else {
          setError(data.error || 'No workout data available');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch workout data');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutData();
  }, []);

  useEffect(() => {
    if (!current || !target) return;
    const metrics = Object.keys(current) as (keyof FitnessMetrics)[];
    const currentData = metrics.map(metric => current[metric]);
    const targetData = metrics.map(metric => target[metric]);

    const formattedMetrics = metrics.map(metric => 
      metric
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .replace('vo2Max', 'VO2 Max')
    );

    const newOptions = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(23, 23, 23, 0.95)',
        borderColor: 'var(--primary)',
        textStyle: {
          color: 'var(--foreground)'
        },
        formatter: (params: any) => {
          const index = params.dataIndex;
          const metricName = formattedMetrics[index];
          const currentValue = currentData[index];
          const targetValue = targetData[index];
          return `${metricName}<br/>
                  <span style="color: #3B82F6">Current: ${currentValue}</span><br/>
                  <span style="color: #22C55E">Target: ${targetValue}</span>`;
        }
      },
      legend: {
        data: ['Current', 'Target'],
        textStyle: {
          color: 'var(--foreground)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: [4, 8]
        },
        bottom: 0
      },
      radar: {
        indicator: formattedMetrics.map(name => ({
          name,
          max: 100,
          color: '#ffffff', // Bright white color for labels
        })),
        splitArea: {
          areaStyle: {
            color: [
              'rgba(59, 130, 246, 0.2)', // Blue with higher opacity
              'rgba(34, 197, 94, 0.2)',  // Green with higher opacity
            ]
          }
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.7)' // Brighter lines
          }
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.4)' // Brighter grid lines
          }
        },
        name: {
          textStyle: {
            color: '#ffffff', // Bright white color
            fontSize: 14, // Slightly larger
            fontWeight: 600,
            padding: [4, 8],
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark background for contrast
            borderRadius: 2,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowBlur: 2,
            shadowOffsetX: 1,
            shadowOffsetY: 1
          }
        }
      },
      series: [
        {
          name: 'Fitness Metrics',
          type: 'radar',
          data: [
            {
              value: currentData,
              name: 'Current',
              symbol: 'circle',
              symbolSize: 8,
              lineStyle: {
                color: '#3B82F6', // Blue-500
                width: 3
              },
              areaStyle: {
                color: 'rgba(59, 130, 246, 0.4)' // Blue with opacity
              },
              itemStyle: {
                color: '#3B82F6'
              }
            },
            {
              value: targetData,
              name: 'Target',
              symbol: 'diamond',
              symbolSize: 8,
              lineStyle: {
                color: '#22C55E', // Green-500
                width: 3,
                type: 'dashed'
              },
              areaStyle: {
                color: 'rgba(34, 197, 94, 0.3)' // Green with opacity
              },
              itemStyle: {
                color: '#22C55E'
              }
            }
          ]
        }
      ]
    };

    setOptions(newOptions);
  }, [current, target]);

  if (loading) {
    return (
      <div className="bg-surface p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Fitness Performance</h2>
        <div className="flex justify-center items-center h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !current || !target) {
    return (
      <div className="bg-surface p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Fitness Performance</h2>
        <div className="flex justify-center items-center h-[400px] text-error">
          {error || 'No data available'}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Fitness Performance</h2>
      <ReactECharts 
        option={options} 
        style={{ height: '400px', width: '100%' }}
        theme="dark"
      />
    </div>
  );
};

export default FitnessRadar;
