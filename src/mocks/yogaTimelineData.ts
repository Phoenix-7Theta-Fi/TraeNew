import { subDays, format } from 'date-fns';

// Define yoga types and their associated colors (matching sunburst)
export const YOGA_TYPES = {
  hatha: {
    name: 'Hatha',
    color: '#5A67D8',
    intensityRange: { min: 20, max: 60 }, // minutes
    frequency: 0.4 // 40% chance of occurrence
  },
  vinyasa: {
    name: 'Vinyasa',
    color: '#38A169',
    intensityRange: { min: 30, max: 75 },
    frequency: 0.3
  },
  yin: {
    name: 'Yin',
    color: '#DD6B20',
    intensityRange: { min: 45, max: 90 },
    frequency: 0.2
  },
  restorative: {
    name: 'Restorative',
    color: '#805AD5',
    intensityRange: { min: 40, max: 80 },
    frequency: 0.1
  }
};

// Helper to generate random duration within range
const getRandomDuration = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate practice data for a single day
const generateDayPractices = (date: Date) => {
  const practices: any[] = [];
  
  // Always have 1-2 practices per day
  const practiceCount = Math.random() < 0.7 ? 1 : 2;

  // Get random yoga types for this day
  const availableTypes = Object.entries(YOGA_TYPES);
  const shuffledTypes = availableTypes.sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < practiceCount; i++) {
    const [typeId, typeInfo] = shuffledTypes[i];
    
    // Ensure at least one practice is added
    if (i === 0 || Math.random() < typeInfo.frequency) {
      practices.push({
        id: `${format(date, 'yyyy-MM-dd')}-${typeId}`,
        date: format(date, 'yyyy-MM-dd'),
        type: typeId,
        typeName: typeInfo.name,
        color: typeInfo.color,
        duration: getRandomDuration(
          typeInfo.intensityRange.min,
          typeInfo.intensityRange.max
        ),
        // Add some interesting metadata for rich tooltips
        focus: ['Strength', 'Flexibility', 'Balance', 'Mindfulness'][
          Math.floor(Math.random() * 4)
        ],
        intensity: ['Gentle', 'Moderate', 'Vigorous'][
          Math.floor(Math.random() * 3)
        ],
        props: ['Blocks', 'Strap', 'Bolster', 'Mat'][
          Math.floor(Math.random() * 4)
        ]
      });
    }
  }

  return practices;
};

// Generate data for the last 90 days
export const generateTimelineData = () => {
  const data: any[] = [];
  const today = new Date();
  
  for (let i = 90; i >= 0; i--) {
    const date = subDays(today, i);
    const practices = generateDayPractices(date);
    if (practices.length > 0) {
      data.push(...practices);
    }
  }

  return data;
};

// Export mock data
export const mockTimelineData = generateTimelineData();

// Generate summary stats for the mock data
export const mockSummaryStats = {
  totalPractices: mockTimelineData.length,
  totalMinutes: mockTimelineData.reduce((acc, curr) => acc + curr.duration, 0),
  typeDistribution: Object.fromEntries(
    Object.keys(YOGA_TYPES).map(type => [
      type,
      mockTimelineData.filter(p => p.type === type).length
    ])
  ),
  averageDuration: Math.round(
    mockTimelineData.reduce((acc, curr) => acc + curr.duration, 0) /
      mockTimelineData.length
  ),
  longestStreak: 5, // We could calculate this but keeping it simple for now
  currentStreak: 3
};
