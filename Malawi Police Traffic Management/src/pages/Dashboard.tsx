import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/utils/api';
import type { DashboardStats } from '@/types';
import type { Admin } from '@/types';
import RecentActivity from '@/components/analytics/RecentActivity';
import StatisticsView from '@/components/analytics/StatisticsView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { eventBus, EVENTS } from '@/utils/eventBus';

interface DashboardProps {
  admin: Admin;
  onNavigate: (page: string) => void;
}

export default function Dashboard({ admin, onNavigate }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'statistics'>('dashboard');

  useEffect(() => {
    loadStats();
    // Set up real-time updates every 30 seconds
    const interval = setInterval(loadStats, 30000);
    
    // Listen for real-time events
    const handleDataRefresh = () => {
      loadStats();
    };
    
    eventBus.on(EVENTS.VIOLATION_CREATED, handleDataRefresh);
    eventBus.on(EVENTS.VIOLATION_UPDATED, handleDataRefresh);
    eventBus.on(EVENTS.DATA_REFRESH, handleDataRefresh);
    
    // Listen for messages from mobile app
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'VIOLATION_CREATED') {
        handleDataRefresh();
        eventBus.emit(EVENTS.VIOLATION_CREATED);
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    return () => {
      clearInterval(interval);
      eventBus.off(EVENTS.VIOLATION_CREATED, handleDataRefresh);
      eventBus.off(EVENTS.VIOLATION_UPDATED, handleDataRefresh);
      eventBus.off(EVENTS.DATA_REFRESH, handleDataRefresh);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const loadStats = async () => {
    try {
      const result = await api.getDashboardStats();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Management Portal</h1>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FontAwesomeIcon icon={faChartBar} className="mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'statistics'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FontAwesomeIcon icon={faChartLine} className="mr-2" />
              Statistics
            </button>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          Welcome, {admin.fullName} ({admin.role})
        </div>
      </div>

      {activeTab === 'dashboard' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Officers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalOfficers || 0}</div>
                <p className="text-xs text-gray-600">
                  {stats?.activeOfficers || 0} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Violations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalViolations || 0}</div>
                <p className="text-xs text-gray-600">
                  {stats?.pendingViolations || 0} pending
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  MWK {(stats?.totalRevenue || 0).toLocaleString()}
                </div>
                <p className="text-xs text-gray-600">
                  MWK {(stats?.todayRevenue || 0).toLocaleString()} today
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest violations and activities</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivity onSeeMore={() => onNavigate('all-activities')} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common management tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => onNavigate('officers')}
                    className="p-3 text-left border rounded-lg hover:bg-gray-50"
                  >
                    <div className="font-medium">Add Officer</div>
                    <div className="text-sm text-gray-600">Register new officer</div>
                  </button>
                  <button className="p-3 text-left border rounded-lg hover:bg-gray-50">
                    <div className="font-medium">View Reports</div>
                    <div className="text-sm text-gray-600">Generate reports</div>
                  </button>
                  <button 
                    onClick={() => onNavigate('violations')}
                    className="p-3 text-left border rounded-lg hover:bg-gray-50"
                  >
                    <div className="font-medium">Manage Violations</div>
                    <div className="text-sm text-gray-600">Review violations</div>
                  </button>
                  <button 
                    onClick={() => onNavigate('vehicles')}
                    className="p-3 text-left border rounded-lg hover:bg-gray-50"
                  >
                    <div className="font-medium">Manage Vehicles</div>
                    <div className="text-sm text-gray-600">View vehicle records</div>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <StatisticsView />
      )}
    </div>
  );
}