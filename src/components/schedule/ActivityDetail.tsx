'use client';

import { CATEGORY_CONFIG, ActivityDetailProps } from '@/types/schedule';

export default function ActivityDetail({ 
  activity, 
  onClose,
  onStatusChange 
}: ActivityDetailProps) {
  if (!activity) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-center p-4">
        <p>Select an activity to view details</p>
      </div>
    );
  }

  const config = CATEGORY_CONFIG[activity.category];

  const renderSpecificDetails = () => {
    switch (activity.category) {
      case 'yoga':
        return (
          <>
            <div className="mb-2">
              <span className="text-gray-400">Style:</span> {activity.style}
            </div>
            <div className="mb-2">
              <span className="text-gray-400">Intensity:</span> {activity.intensity}
            </div>
            <div className="mb-2">
              <span className="text-gray-400">Props:</span> {activity.props.join(', ')}
            </div>
          </>
        );
      
      case 'workout':
        return (
          <>
            <div className="mb-2">
              <span className="text-gray-400">Type:</span> {activity.type}
            </div>
            <div className="mb-2">
              <span className="text-gray-400">Intensity:</span> {activity.intensity}/5
            </div>
            {activity.targetMuscles && (
              <div className="mb-2">
                <span className="text-gray-400">Target:</span> {activity.targetMuscles.join(', ')}
              </div>
            )}
          </>
        );

      case 'medication':
        return (
          <>
            <div className="mb-2">
              <span className="text-gray-400">Medications:</span> {activity.medications.join(', ')}
            </div>
            <div className="mb-2">
              <span className="text-gray-400">Dosage:</span> {activity.dosage}
            </div>
            {activity.instructions && (
              <div className="mb-2">
                <span className="text-gray-400">Instructions:</span> {activity.instructions}
              </div>
            )}
          </>
        );

      case 'treatment':
        return (
          <>
            <div className="mb-2">
              <span className="text-gray-400">Type:</span> {activity.type}
            </div>
            <div className="mb-2">
              <span className="text-gray-400">Practitioner:</span> {activity.practitioner}
            </div>
            <div className="mb-2">
              <span className="text-gray-400">Location:</span> {activity.location}
            </div>
          </>
        );

      case 'mental':
        return (
          <>
            <div className="mb-2">
              <span className="text-gray-400">Type:</span> {activity.type}
            </div>
            <div className="mb-2">
              <span className="text-gray-400">Duration:</span> {activity.duration} minutes
            </div>
          </>
        );
    }
  };

  return (
    <div className="h-full bg-surface rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{config.icon}</span>
          <h3 className="text-lg font-semibold">{activity.title}</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-300"
        >
          ✕
        </button>
      </div>

      {/* Time and Status */}
      <div className="mb-4">
        <div className="text-sm mb-2">
          {activity.startTime} - {activity.endTime}
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              activity.status === 'completed' ? 'bg-green-500' :
              activity.status === 'in_progress' ? 'bg-blue-500' :
              activity.status === 'upcoming' ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
          />
          <span className="text-sm capitalize">{activity.status}</span>
        </div>
      </div>

      {/* Description */}
      {activity.description && (
        <div className="mb-4">
          <p className="text-sm text-gray-300">{activity.description}</p>
        </div>
      )}

      {/* Specific Details */}
      <div className="text-sm">{renderSpecificDetails()}</div>

      {/* Actions */}
      <div className="mt-6 flex gap-2">
        <button
          onClick={() => onStatusChange(activity.id, 'completed')}
          className="px-3 py-1 bg-primary hover:bg-primary-dark rounded text-sm"
        >
          Mark Complete
        </button>
        <button
          className="px-3 py-1 border border-gray-600 hover:border-gray-500 rounded text-sm"
        >
          View in Dashboard
        </button>
      </div>
    </div>
  );
}