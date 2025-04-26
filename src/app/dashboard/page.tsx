'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import DietChart from '@/components/DietChart';
import MedicationDashboard from '@/components/medication/MedicationDashboard';
import TreatmentPlanDashboard from '@/components/treatment/TreatmentPlanDashboard';
import WorkoutDashboard from '@/components/workout/WorkoutDashboard';
import YogaDashboard from '@/components/yoga/YogaDashboard';

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Navigation */}
          <div className="flex gap-4 mb-6 flex-wrap">
            <button
              onClick={() => setActiveSection(activeSection === 'treatment' ? null : 'treatment')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeSection === 'treatment'
                  ? 'bg-primary text-background'
                  : 'bg-surface text-foreground hover:bg-primary hover:text-background'
              }`}
            >
              Treatment Plan
            </button>
            <button
              onClick={() => setActiveSection(activeSection === 'diet' ? null : 'diet')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeSection === 'diet'
                  ? 'bg-primary text-background'
                  : 'bg-surface text-foreground hover:bg-primary hover:text-background'
              }`}
            >
              Diet
            </button>
            <button
              onClick={() => setActiveSection(activeSection === 'medication' ? null : 'medication')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeSection === 'medication'
                  ? 'bg-primary text-background'
                  : 'bg-surface text-foreground hover:bg-primary hover:text-background'
              }`}
            >
              Medication
            </button>
            <button
              onClick={() => setActiveSection(activeSection === 'workout' ? null : 'workout')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeSection === 'workout'
                  ? 'bg-primary text-background'
                  : 'bg-surface text-foreground hover:bg-primary hover:text-background'
              }`}
            >
              Workout
            </button>
            <button
              onClick={() => setActiveSection(activeSection === 'yoga' ? null : 'yoga')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeSection === 'yoga'
                  ? 'bg-primary text-background'
                  : 'bg-surface text-foreground hover:bg-primary hover:text-background'
              }`}
            >
              Yoga
            </button>
          </div>

          {/* Section Content */}
          {activeSection === 'diet' && <DietChart />}
          {activeSection === 'medication' && <MedicationDashboard />}
          {activeSection === 'treatment' && <TreatmentPlanDashboard />}
          {activeSection === 'workout' && <WorkoutDashboard />}
          {activeSection === 'yoga' && <YogaDashboard />}
        </div>
      </div>
    </div>
  );
}
