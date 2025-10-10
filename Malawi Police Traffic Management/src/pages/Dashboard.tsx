import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/utils/api';
import type { DashboardStats } from '@/types';

import type { Admin } from '@/types';

interface DashboardProps {
  admin: Admin;
}

export default function Dashboard({ admin }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
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
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-sm text-gray-600">
          Welcome, {admin.fullName} ({admin.role})
        </div>
      </div>

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
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-medium">Speeding Violation</p>
                  <p className="text-sm text-gray-600">BL 1234 A - Officer MP001</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">MWK 20,000</p>
                  <p className="text-xs text-gray-600">2 hours ago</p>
                </div>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-medium">No Seatbelt</p>
                  <p className="text-sm text-gray-600">LL 5678 B - Officer MP002</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">MWK 5,000</p>
                  <p className="text-xs text-gray-600">4 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common management tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 text-left border rounded-lg hover:bg-gray-50">
                <div className="font-medium">Add Officer</div>
                <div className="text-sm text-gray-600">Register new officer</div>
              </button>
              <button className="p-3 text-left border rounded-lg hover:bg-gray-50">
                <div className="font-medium">View Reports</div>
                <div className="text-sm text-gray-600">Generate reports</div>
              </button>
              <button className="p-3 text-left border rounded-lg hover:bg-gray-50">
                <div className="font-medium">Manage Violations</div>
                <div className="text-sm text-gray-600">Review violations</div>
              </button>
              <button className="p-3 text-left border rounded-lg hover:bg-gray-50">
                <div className="font-medium">System Settings</div>
                <div className="text-sm text-gray-600">Configure system</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}