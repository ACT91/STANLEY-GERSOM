import { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { eventBus, EVENTS } from '@/utils/eventBus';

interface RecentViolation {
  violation_date: string;
  fine_amount: number;
  violation_name: string;
  license_plate: string;
  serviceNumber: string;
  officer_name: string;
}

interface RecentActivityProps {
  onSeeMore: () => void;
}

export default function RecentActivity({ onSeeMore }: RecentActivityProps) {
  const [recentViolations, setRecentViolations] = useState<RecentViolation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentActivity();
    // Set up real-time updates every 15 seconds for recent activity
    const interval = setInterval(loadRecentActivity, 15000);
    
    // Listen for real-time events
    const handleViolationChange = () => {
      loadRecentActivity();
    };
    
    eventBus.on(EVENTS.VIOLATION_CREATED, handleViolationChange);
    eventBus.on(EVENTS.VIOLATION_UPDATED, handleViolationChange);
    
    return () => {
      clearInterval(interval);
      eventBus.off(EVENTS.VIOLATION_CREATED, handleViolationChange);
      eventBus.off(EVENTS.VIOLATION_UPDATED, handleViolationChange);
    };
  }, []);

  const loadRecentActivity = async () => {
    try {
      const result = await api.getRecentActivity();
      if (result.success) {
        setRecentViolations(result.data);
      }
    } catch (error) {
      console.error('Failed to load recent activity:', error);
    } finally {
      setLoading(false);
    }
  };



  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const violationDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - violationDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading recent activity...</div>;
  }

  return (
    <div className="space-y-3">
      {recentViolations.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No recent violations</div>
      ) : (
        <>
          {recentViolations.slice(0, 5).map((violation, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b">
              <div>
                <p className="font-medium">{violation.violation_name}</p>
                <p className="text-sm text-gray-600">
                  {violation.license_plate} - Officer {violation.serviceNumber}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">MWK {violation.fine_amount?.toLocaleString()}</p>
                <p className="text-xs text-gray-600">{formatTimeAgo(violation.violation_date)}</p>
              </div>
            </div>
          ))}
          {recentViolations.length > 5 && (
            <div className="text-center pt-3">
              <button
                onClick={onSeeMore}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                See More <FontAwesomeIcon icon={faArrowRight} className="ml-1" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}