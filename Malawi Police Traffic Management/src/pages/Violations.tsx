import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/utils/api';
import type { Violation } from '@/types';

export default function Violations() {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);

  useEffect(() => {
    loadViolations();
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadViolations = async () => {
    try {
      const filters = filter !== 'all' ? { status: filter } : {};
      const result = await api.getViolations(filters);
      if (result.success) {
        setViolations(result.data);
      }
    } catch (error) {
      console.error('Failed to load violations:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateViolationStatus = async (violationId: number, newStatus: string, notes?: string) => {
    try {
      const result = await api.updateViolationStatus(violationId, newStatus, notes);
      if (result.success) {
        setViolations(violations.map(v => 
          v.violationID === violationId 
            ? { ...v, status: newStatus as Violation['status'] }
            : v
        ));
        setSelectedViolation(null);
      }
    } catch (error) {
      console.error('Failed to update violation:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'disputed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-6">Loading violations...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Violations Management</h1>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border rounded-md"
            title="Filter violations by status"
          >
            <option value="all">All Violations</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="disputed">Disputed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {violations.filter(v => v.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {violations.filter(v => v.status === 'paid').length}
            </div>
            <div className="text-sm text-gray-600">Paid</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {violations.filter(v => v.status === 'disputed').length}
            </div>
            <div className="text-sm text-gray-600">Disputed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">
              {violations.filter(v => v.status === 'cancelled').length}
            </div>
            <div className="text-sm text-gray-600">Cancelled</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Violations List</CardTitle>
          <CardDescription>Review and manage traffic violations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Ticket #</th>
                  <th className="text-left p-2">Vehicle</th>
                  <th className="text-left p-2">Violation</th>
                  <th className="text-left p-2">Fine Amount</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Officer</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {violations.map((violation) => (
                  <tr key={violation.violationID} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{violation.ticket_number}</td>
                    <td className="p-2">Vehicle #{violation.vehicle_id}</td>
                    <td className="p-2">Type #{violation.violation_type_id}</td>
                    <td className="p-2 font-medium">
                      MWK {violation.fine_amount.toLocaleString()}
                    </td>
                    <td className="p-2 text-sm">
                      {new Date(violation.violation_date).toLocaleDateString()}
                    </td>
                    <td className="p-2">Officer #{violation.officer_id}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(violation.status)}`}>
                        {violation.status}
                      </span>
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => setSelectedViolation(violation)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {selectedViolation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Manage Violation</CardTitle>
              <CardDescription>Ticket: {selectedViolation.ticket_number}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p><strong>Current Status:</strong> {selectedViolation.status}</p>
                <p><strong>Fine Amount:</strong> MWK {selectedViolation.fine_amount.toLocaleString()}</p>
                <p><strong>Location:</strong> {selectedViolation.location}</p>
                {selectedViolation.notes && (
                  <p><strong>Notes:</strong> {selectedViolation.notes}</p>
                )}
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {selectedViolation.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateViolationStatus(selectedViolation.violationID, 'paid')}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Mark as Paid
                    </button>
                    <button
                      onClick={() => updateViolationStatus(selectedViolation.violationID, 'disputed')}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Mark as Disputed
                    </button>
                  </>
                )}
                
                {selectedViolation.status === 'disputed' && (
                  <button
                    onClick={() => updateViolationStatus(selectedViolation.violationID, 'paid')}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    Resolve as Paid
                  </button>
                )}
                
                <button
                  onClick={() => updateViolationStatus(selectedViolation.violationID, 'cancelled')}
                  className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                >
                  Cancel Violation
                </button>
              </div>
              
              <button
                onClick={() => setSelectedViolation(null)}
                className="w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}