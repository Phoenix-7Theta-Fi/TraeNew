'use client';

import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Treatment, TreatmentResponse } from '@/types/medication';
import * as echarts from 'echarts/core';
// Correct import for renderItem types
import { CustomSeriesRenderItemAPI, CustomSeriesRenderItemParams } from 'echarts/types/dist/shared';
import { EChartsCoreOption } from 'echarts/core'; // Correct import for options type

// Define status type based on Treatment interface
type TreatmentStatus = Treatment['status'];

const TreatmentTimeline = () => {
  const [options, setOptions] = useState<EChartsCoreOption>({});
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/treatments', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch treatments');
        
        const data = await response.json() as TreatmentResponse;
        if (!data.success) throw new Error(data.error || 'Failed to fetch treatments');
        
        setTreatments(data.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTreatments();
  }, []);

  // Update options whenever treatments, loading, or error changes
  useEffect(() => {
    const categories = ['Herbs', 'Therapy', 'Diet', 'Exercise'];

    // Add correct types to renderItem parameters
    const renderItem = (params: CustomSeriesRenderItemParams, api: CustomSeriesRenderItemAPI) => {
      // Get data directly from api.value()
      // Use api.value directly, casting if necessary based on expected data structure
      const categoryIndex = api.value(0) as number;
      const start = api.coord([api.value(1) as number, categoryIndex]); // Assuming value(1) is time/number
      const end = api.coord([api.value(2) as number, categoryIndex]); // Assuming value(2) is time/number
      
      // Safely calculate height with checks for api and api.size
      let height = 20; // Default height
      if (api && typeof api.size === 'function') {
        const size = api.size([0, 1]);
        if (Array.isArray(size)) {
          height = size[1] * 0.6;
        }
      }

      const status = api.value(3) as TreatmentStatus; // Cast status to the defined type
      const treatmentName = api.value(4) as string; // Cast name to string

      // Define colors with better contrast for text
      const colors: Record<TreatmentStatus, string> = { // Type the colors object
        completed: '#a3a3a3', // Neutral-400 (Lighter Gray)
        ongoing: '#fca5a5',   // Red-300 (Lighter Red/Orange)
        scheduled: '#fde047'  // Yellow-300 (Lighter Yellow)
      };
      const statusColor = colors[status] || '#e5e5e5'; // Fallback color (Neutral-200) - TS error resolved
      const textColor = '#1f2937'; // Gray-800 (Dark text for light backgrounds)

      // Create the rectangle shape
      const rectShape = {
        type: 'rect',
        transition: ['shape'],
        shape: {
          x: start[0],
          y: start[1] - height / 2,
          width: end[0] - start[0],
          height: height
        },
        style: {
          fill: statusColor,
        }
      };

      // Calculate text position
      const textX = start[0] + 5; // Padding from left
      const textY = start[1]; // Vertically centered
      const textWidth = end[0] - start[0] - 10; // Max width with padding

      // Create the text shape
      const textShape = {
        type: 'text',
        transition: ['style'],
        style: {
          x: textX,
          y: textY,
          text: treatmentName,
          textAlign: 'left',
          textVerticalAlign: 'middle',
          fill: textColor, // Use dark text color
          fontSize: 11, // Slightly smaller font
          fontWeight: '500',
          overflow: 'truncate',
          ellipsis: '...',
          width: textWidth,
        }
      };

      // Group shapes, conditionally add text
      // Use a more generic type or 'any' if specific graphic types aren't easily available/imported
      const children: any[] = [rectShape]; // Use 'any[]' for simplicity to resolve TS error
      if (textWidth > 40) { // Adjust minimum width threshold if needed
        children.push(textShape);
      }

      // The return type of renderItem should conform to what ECharts expects
      return {
        type: 'group',
        children: children
      };
    };

    if (loading) return;

    if (error || treatments.length === 0) {
      setOptions({});
      return;
    }

    // Process the treatments data
    const data = treatments.map(treatment => [
      categories.indexOf(treatment.category),
      treatment.startDate,
      treatment.endDate,
      treatment.status,
      treatment.name,
      treatment.description || '' // Add description
    ]);

    const chartOptions = {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          // params.value = [categoryIndex, startDate, endDate, status, name, description]
          if (!params || params.value === undefined) return '';
          const treatmentName = params.value[4];
          const startDate = new Date(params.value[1]).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
          const endDate = new Date(params.value[2]).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
          const status = params.value[3];
          const description = params.value[5];

          return `
            <div class="p-2 rounded shadow-lg bg-surface text-foreground font-sans text-sm max-w-xs">
              <div class="font-bold text-base mb-1 text-primary">${treatmentName}</div>
              <div class="mb-0.5"><strong class="font-semibold">Duration:</strong> ${startDate} - ${endDate}</div>
              <div class="mb-1"><strong class="font-semibold">Status:</strong> <span class="capitalize">${status}</span></div>
              ${description ? `<div class="text-xs text-gray-400">${description}</div>` : ''}
            </div>
          `;
        },
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        padding: 0,
        extraCssText: 'box-shadow: none;'
      },
      xAxis: {
        type: 'time',
        axisLabel: {
          color: '#ededed',
          formatter: (value: string) => {
            return new Date(value).toLocaleDateString('en-US', { 
              month: 'short',
              day: 'numeric'
            });
          }
        }
      },
      yAxis: {
        data: categories,
        axisLabel: {
          color: '#ededed'
        }
      },
      series: [{
        type: 'custom',
        renderItem: renderItem,
        itemStyle: {
          opacity: 0.8
        },
        encode: {
          x: [1, 2],
          y: 0
        },
        data: data
      }],
      backgroundColor: 'transparent'
    };

    setOptions(chartOptions);
  }, [treatments, loading, error]);

    return (
      <div className="w-full p-6 bg-surface rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-primary">Treatment Timeline</h2>
        <div className="h-[300px]">
          {loading && (
            <div className="flex items-center justify-center h-full text-primary">
              Loading treatment timeline...
            </div>
          )}
          {error && (
            <div className="flex items-center justify-center h-full text-red-500">
              {error}
            </div>
          )}
          {!loading && !error && (
            <ReactECharts
              option={options}
              style={{ height: '100%', width: '100%' }}
              theme="dark"
            />
          )}
        </div>
      </div>
  );
};

export default TreatmentTimeline;
