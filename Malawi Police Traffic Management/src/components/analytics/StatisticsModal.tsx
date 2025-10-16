import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/utils/api';

interface StatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ViolationTypeStats {
  violation_name: string;
  count: number;
  total_revenue: number;
  percentage: number;
}

interface VehicleTypeStats {
  vehicles_type: string;
  count: number;
  percentage: number;
}

interface AnalyticsData {
  violationTypes: ViolationTypeStats[];
  vehicleTypes: VehicleTypeStats[];
}

interface ViolationRecord {
  violation_name: string;
  violation_date: string;
  fine_amount: number;
  status: string;
}

interface VehicleStatsData {
  totalViolations: number;
  totalFines: number;
  paidViolations: number;
  pendingViolations: number;
  recentViolations: ViolationRecord[];
}

export default function StatisticsModal({ isOpen, onClose }: StatisticsModalProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [vehicleStats, setVehicleStats] = useState<VehicleStatsData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadAnalytics();
    }
  }, [isOpen]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const result = await api.getAnalytics();
      if (result.success) {
        setAnalytics(result.data);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchVehicleStats = async () => {
    if (!vehicleSearch.trim()) return;
    
    setLoading(true);
    try {
      const result = await api.getVehicleAnalytics(vehicleSearch);
      if (result.success) {
        setVehicleStats(result.data);
      }
    } catch (error) {
      console.error('Failed to load vehicle stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold">Statistics & Analytics</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {loading && <div className="text-center py-4">Loading analytics...</div>}

          {/* Violation Type Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Most Common Violations</CardTitle>
              <CardDescription>Violation types ranked by frequency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics?.violationTypes?.map((item, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{item.violation_name}</p>
                      <p className="text-sm text-gray-600">{item.count} violations</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">MWK {item.total_revenue?.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">{item.percentage}% of total</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Type Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Violations by Vehicle Type</CardTitle>
              <CardDescription>Which vehicle types have more violations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {analytics?.vehicleTypes?.map((item, index: number) => (
                  <div key={index} className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{item.count}</div>
                    <div className="text-sm font-medium capitalize">{item.vehicles_type}</div>
                    <div className="text-xs text-gray-600">{item.percentage}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Search */}
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Statistics</CardTitle>
              <CardDescription>Search for specific vehicle violation history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={vehicleSearch}
                  onChange={(e) => setVehicleSearch(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter license plate (e.g., BL 1234 A)"
                />
                <button
                  onClick={searchVehicleStats}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Search
                </button>
              </div>

              {vehicleStats && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <div className="text-xl font-bold text-blue-600">{vehicleStats.totalViolations}</div>
                      <div className="text-sm">Total Violations</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded">
                      <div className="text-xl font-bold text-red-600">MWK {vehicleStats.totalFines?.toLocaleString()}</div>
                      <div className="text-sm">Total Fines</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="text-xl font-bold text-green-600">{vehicleStats.paidViolations}</div>
                      <div className="text-sm">Paid</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded">
                      <div className="text-xl font-bold text-yellow-600">{vehicleStats.pendingViolations}</div>
                      <div className="text-sm">Pending</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Recent Violations</h4>
                    <div className="space-y-2">
                      {vehicleStats.recentViolations?.map((violation, index: number) => (
                        <div key={index} className="flex justify-between items-center p-2 border rounded">
                          <div>
                            <p className="font-medium">{violation.violation_name}</p>
                            <p className="text-sm text-gray-600">{new Date(violation.violation_date).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">MWK {violation.fine_amount?.toLocaleString()}</p>
                            <p className={`text-xs px-2 py-1 rounded ${
                              violation.status === 'paid' ? 'bg-green-100 text-green-800' :
                              violation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {violation.status}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}