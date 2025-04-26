'use client';

import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import type { HerbUsage } from '@/types/medication';

const HerbUsageTimeline = () => {
  const [options, setOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHerbData = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found');
          setLoading(false);
          return;
        }

        // Fetch herb usage data
        const response = await fetch('/api/medications?type=herbs&days=30', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch herb usage data');
        }

        const { data } = await response.json();
        
        // Process data for the chart
        const herbs = Array.from(
          new Set(data.flatMap((day: HerbUsage) => Object.keys(day.herbs)))
        );
        
        const dates = data.map((day: HerbUsage) => {
          const date = new Date(day.date);
          return `${date.getMonth() + 1}-${date.getDate()}`; // Format as MM-DD
        });
        
        const series = herbs.map(herb => ({
          name: herb,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          data: data.map((day: HerbUsage) => day.herbs[herb] || 0)
        }));

        const chartOptions = {
          title: {
            text: 'Herb Usage Timeline',
            textStyle: {
              color: '#ededed',
              fontSize: 16,
              fontWeight: 'normal'
            },
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            backgroundColor: '#171717',
            borderColor: '#ff9b42',
            textStyle: {
              color: '#ededed'
            }
          },
          legend: {
            data: herbs,
            bottom: 0,
            textStyle: {
              color: '#ededed'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            top: '15%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: dates,
            axisLine: {
              lineStyle: {
                color: '#ededed'
              }
            },
            axisLabel: {
              color: '#ededed'
            }
          },
          yAxis: {
            type: 'value',
            name: 'Doses',
            nameTextStyle: {
              color: '#ededed'
            },
            axisLine: {
              lineStyle: {
                color: '#ededed'
              }
            },
            axisLabel: {
              color: '#ededed'
            },
            splitLine: {
              lineStyle: {
                color: '#333333'
              }
            }
          },
          series: series,
          color: ['#ff9b42', '#e88a31', '#ffc107', '#4caf50']
        };

        setOptions(chartOptions);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching herb usage data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch herb usage data');
        setLoading(false);
      }
    };

    fetchHerbData();
  }, []);

  if (loading) {
    return (
      <div className="bg-surface p-6 rounded-lg shadow-lg flex items-center justify-center h-[400px]">
        <div className="text-primary">Loading herb usage data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface p-6 rounded-lg shadow-lg flex items-center justify-center h-[400px]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-surface p-6 rounded-lg shadow-lg">
      <ReactECharts 
        option={options} 
        style={{ height: '400px', width: '100%' }}
        theme="dark"
      />
    </div>
  );
};

export default HerbUsageTimeline;

