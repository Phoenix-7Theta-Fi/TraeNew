'use client';

import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { graphic } from 'echarts';
import { useYogaSunburst } from '@/hooks/useYogaSunburst';

// Define a cohesive color palette
const YOGA_COLORS = {
  hatha: ['#5A67D8', '#805AD5', '#D53F8C'],
  vinyasa: ['#38A169', '#319795', '#3182CE'],
  yin: ['#DD6B20', '#D69E2E', '#FAF089'],
  center: '#CBD5E0',
  background: '#1A202C',
  border: '#2D3748',
  text: '#E2E8F0',
};

// Function to assign colors dynamically based on level and name
const assignColors = (node: any, level: number = 0, parentColor?: string) => {
  let color;
  if (level === 1) {
    // Assign base colors to top-level categories
    if (node.name.toLowerCase().includes('hatha')) color = YOGA_COLORS.hatha[0];
    else if (node.name.toLowerCase().includes('vinyasa')) color = YOGA_COLORS.vinyasa[0];
    else if (node.name.toLowerCase().includes('yin')) color = YOGA_COLORS.yin[0];
    else color = '#cccccc'; // Fallback
  } else if (parentColor) {
    color = parentColor;
  } else {
    color = '#cccccc'; // Fallback for root or unexpected cases
  }

  node.itemStyle = {
    ...node.itemStyle,
    color: color,
  };

  if (node.children) {
    node.children.forEach((child: any) => assignColors(child, level + 1, color));
  }
};

export default function YogaSunburstChart() {
  const { data, loading, error } = useYogaSunburst();

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-4 sm:p-6">
        <h3 className="text-slate-100 font-semibold text-lg mb-4 text-center">
          Yoga Practice Distribution
        </h3>
        <div className="flex justify-center items-center h-[450px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-4 sm:p-6">
        <h3 className="text-slate-100 font-semibold text-lg mb-4 text-center">
          Yoga Practice Distribution
        </h3>
        <div className="flex justify-center items-center h-[450px] text-red-500">
          {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-4 sm:p-6">
        <h3 className="text-slate-100 font-semibold text-lg mb-4 text-center">
          Yoga Practice Distribution
        </h3>
        <div className="flex justify-center items-center h-[450px] text-slate-400">
          No yoga practice data available
        </div>
      </div>
    );
  }

  // Calculate total time from the API data
  const totalPracticeTime = data.children.reduce((sum, child) => sum + (child.value || 0), 0);

  // Apply colors to the data
  data.children.forEach(child => assignColors(child, 1));

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const data = params.data as { name: string; value: number };
        if (!data || data.value === undefined) return '';

        const value = data.value;
        const percent = totalPracticeTime > 0 ? ((value / totalPracticeTime) * 100).toFixed(1) : 0;
        const path = params.treePathInfo.map((item: any) => item.name).join(' > ');

        return `
          <div style="font-size: 14px; color: #eee; background: rgba(40, 40, 40, 0.85); border-radius: 4px; padding: 8px 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
            <strong>${data.name}</strong><br/>
            <span style="font-size: 12px; color: #bbb;">Path: ${path}</span><br/>
            Practice Time: ${value} min (${percent}%)
          </div>
        `;
      },
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      padding: 0,
      textStyle: {
        color: YOGA_COLORS.text,
      },
    },
    title: {
        text: `{val|${totalPracticeTime}}\n{desc|Total Mins}`,
        left: 'center',
        top: 'center',
        textStyle: {
            rich: {
                val: {
                    fontSize: 30,
                    fontWeight: 'bold',
                    color: YOGA_COLORS.text,
                    lineHeight: 35,
                },
                desc: {
                    fontSize: 14,
                    color: YOGA_COLORS.center,
                    lineHeight: 20,
                }
            }
        }
    },
    series: {
      type: 'sunburst',
      data: data.children,
      radius: ['25%', '95%'],
      sort: undefined,
      itemStyle: {
        borderRadius: 8,
        borderWidth: 3,
        borderColor: YOGA_COLORS.border,
      },
      label: {
        show: true,
        rotate: 'radial',
        color: YOGA_COLORS.text,
        fontSize: 11,
        minAngle: 5,
        formatter: '{b}',
      },
      emphasis: {
        focus: 'ancestor',
        itemStyle: {
          shadowBlur: 15,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowColor: 'rgba(255, 255, 255, 0.5)',
          opacity: 1,
        },
        label: {
            fontSize: 13,
            fontWeight: 'bold',
        }
      },
      levels: [
        {},
        {
          r0: '25%',
          r: '48%',
          label: {
            fontSize: 14,
            fontWeight: 'bold',
            rotate: 0,
          },
          itemStyle: {
            borderWidth: 4,
          }
        },
        {
          r0: '48%',
          r: '68%',
          label: {
            fontSize: 12,
          },
           itemStyle: {
            borderWidth: 2,
          }
        },
        {
          r0: '68%',
          r: '85%',
          label: {
            fontSize: 10,
          },
           itemStyle: {
            borderWidth: 1,
          }
        },
        {
          r0: '85%',
          r: '95%',
          label: {
            show: false,
          },
           itemStyle: {
            borderWidth: 1,
          }
        }
      ],
    },
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-4 sm:p-6">
      <h3 className="text-slate-100 font-semibold text-lg mb-4 text-center">
        Yoga Practice Distribution
      </h3>
      <ReactECharts
        option={option}
        style={{ height: '450px' }}
        notMerge={true}
        lazyUpdate={true}
      />
    </div>
  );
}
