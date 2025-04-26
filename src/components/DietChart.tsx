'use client';

import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import type { NutrientData } from '@/types/diet';

const DietChart = () => {
  const [options, setOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found');
          setLoading(false);
          return;
        }

        // Fetch nutrient data
        const response = await fetch('/api/diet', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch diet data');
        }

        const { data } = await response.json();
        
        // Format dates and extract nutrient values
        const days = data.map((item: NutrientData) => {
          const date = new Date(item.date);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        });

        const proteins = data.map((item: NutrientData) => item.nutrients.proteins);
        const carbs = data.map((item: NutrientData) => item.nutrients.carbs);
        const fats = data.map((item: NutrientData) => item.nutrients.fats);
        const vitaminC = data.map((item: NutrientData) => item.nutrients.vitaminC);
        const calcium = data.map((item: NutrientData) => item.nutrients.calcium);
        const iron = data.map((item: NutrientData) => item.nutrients.iron);

        const chartOptions = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['Proteins', 'Carbs', 'Fats', 'Vitamin C', 'Calcium', 'Iron'],
            textStyle: {
              color: '#ededed'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: days,
            axisLabel: {
              color: '#ededed'
            }
          },
          yAxis: [
            {
              type: 'value',
              name: 'Macros (g)',
              axisLabel: {
                color: '#ededed'
              },
              nameTextStyle: {
                color: '#ededed'
              }
            },
            {
              type: 'value',
              name: 'Micros (mg)',
              axisLabel: {
                color: '#ededed'
              },
              nameTextStyle: {
                color: '#ededed'
              }
            }
          ],
          series: [
            {
              name: 'Proteins',
              type: 'bar',
              stack: 'macros',
              emphasis: { focus: 'series' },
              data: proteins
            },
            {
              name: 'Carbs',
              type: 'bar',
              stack: 'macros',
              emphasis: { focus: 'series' },
              data: carbs
            },
            {
              name: 'Fats',
              type: 'bar',
              stack: 'macros',
              emphasis: { focus: 'series' },
              data: fats
            },
            {
              name: 'Vitamin C',
              type: 'bar',
              yAxisIndex: 1,
              stack: 'micros',
              emphasis: { focus: 'series' },
              data: vitaminC
            },
            {
              name: 'Calcium',
              type: 'bar',
              yAxisIndex: 1,
              stack: 'micros',
              emphasis: { focus: 'series' },
              data: calcium
            },
            {
              name: 'Iron',
              type: 'bar',
              yAxisIndex: 1,
              stack: 'micros',
              emphasis: { focus: 'series' },
              data: iron
            }
          ],
          backgroundColor: 'transparent'
        };

        setOptions(chartOptions);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching diet data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch diet data');
        setLoading(false);
      }
    };

    fetchData();

  }, []);

  if (loading) {
    return (
      <div className="w-full p-6 bg-surface rounded-lg shadow-lg flex items-center justify-center">
        <div className="text-primary">Loading diet data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 bg-surface rounded-lg shadow-lg">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-surface rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-primary">Diet Analytics</h2>
      <div className="h-[400px]">
        <ReactECharts
          option={options}
          style={{ height: '100%', width: '100%' }}
          theme="dark"
        />
      </div>
    </div>
  );
};

export default DietChart;
