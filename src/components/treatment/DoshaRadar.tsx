'use client';

import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { DoshaData } from '@/types/medication';

const DoshaRadar = () => {
  const [options, setOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoshaData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/dosha', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dosha data');
        }

        const { data } = await response.json();

        const relevantDoshas = {
          // Main doshas
          'Vata': data.vata,
          'Pitta': data.pitta,
          'Kapha': data.kapha,
          // Relevant sub-doshas for this patient's condition
          'Prana (Vata)': data.prana,
          'Samana (Vata)': data.samana,
          'Pachaka (Pitta)': data.pachaka,
          'Sadhaka (Pitta)': data.sadhaka,
          'Avalambaka (Kapha)': data.avalambaka,
        };

        const chartOptions = {
          radar: {
            indicator: Object.keys(relevantDoshas).map(name => ({
              name,
              max: 100
            })),
            center: ['50%', '50%'],
            radius: '65%',
            splitArea: {
              areaStyle: {
                color: ['rgba(255, 155, 66, 0.1)'],
                shadowColor: 'rgba(0, 0, 0, 0.2)',
                shadowBlur: 10
              }
            },
            axisName: {
              color: '#ededed',
              fontSize: 12,
              padding: [3, 5],
              formatter: (name: string) => {
                // Break long names into multiple lines
                return name.replace(' (', '\n(');
              }
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(255, 155, 66, 0.3)'
              }
            }
          },
          series: [{
            type: 'radar',
            data: [{
              value: Object.values(relevantDoshas),
              name: 'Dosha Profile',
              areaStyle: {
                color: 'rgba(255, 155, 66, 0.4)'
              },
              lineStyle: {
                color: '#ff9b42',
                width: 2
              },
              itemStyle: {
                color: '#ff9b42'
              },
              symbol: 'circle',
              symbolSize: 6
            }]
          }],
          backgroundColor: 'transparent',
          tooltip: {
            trigger: 'item',
            formatter: function(params: any) {
              if (!params.value) return '';
              
              const indicators = chartOptions.radar.indicator;
              return indicators
                .map((ind: any, index: number) => 
                  `${ind.name}: ${params.value[index]}`
                )
                .join('<br/>');
            }
          }
        };

        setOptions(chartOptions);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dosha data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        setLoading(false);
      }
    };

    fetchDoshaData();
  }, []);

  if (loading) {
    return (
      <div className="w-full p-6 bg-surface rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-primary">Dosha Balance</h2>
        <div className="h-[500px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 bg-surface rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-primary">Dosha Balance</h2>
        <div className="h-[500px] flex items-center justify-center">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-surface rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-primary">Dosha Balance</h2>
      <div className="h-[500px]">
        <ReactECharts
          option={options}
          style={{ height: '100%', width: '100%' }}
          theme="dark"
        />
      </div>
    </div>
  );
};

export default DoshaRadar;
