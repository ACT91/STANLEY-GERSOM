import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/utils/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faFilter } from '@fortawesome/free-solid-svg-icons';

interface RecentViolation {
  violation_date: string;
  fine_amount: number;
  violation_name: string;
  license_plate: string;
  serviceNumber: string;
  officer_name: string;
  status: string;
}

export default function AllActivities() {
  const [allViolations, setAllViolations] = useState<RecentViolation[]>([]);
  const [filteredViolations, setFilteredViolations] = useState<RecentViolation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 20;

  useEffect(() => {
    loadAllActivities();
    // Set up real-time updates every 30 seconds for all activities
    const interval = setInterval(loadAllActivities, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterViolations();
  }, [allViolations, statusFilter, searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAllActivities = async () => {
    try {
      const result = await api.getViolations({});
      if (result.success) {
        setAllViolations(result.data);
      }
    } catch (error) {
      console.error('Failed to load all activities:', error);
    } finally {
      setLoading(false);
    }
  };



  const filterViolations = () => {
    let filtered = allViolations;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(v => v.status === statusFilter);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(v =>
        v.violation_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.license_plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.serviceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredViolations(filtered);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredViolations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentViolations = filteredViolations.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
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
    return <div className="p-6">Loading all activities...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">All Activities</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>All Violations History</CardTitle>
          <CardDescription>
            Complete list of all violations and activities ({filteredViolations.length} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex gap-4 items-center">
              <FontAwesomeIcon icon={faFilter} className="text-gray-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 max-w-md px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Search by violation, license plate, or officer..."
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
                title="Filter by status"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="disputed">Disputed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Violations List */}
          <div className="space-y-3">
            {currentViolations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {filteredViolations.length === 0 && allViolations.length > 0
                  ? 'No violations match your filters'
                  : 'No violations found'
                }
              </div>
            ) : (
              currentViolations.map((violation, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b hover:bg-gray-50 px-2 rounded">
                  <div>
                    <p className="font-medium">{violation.violation_name}</p>
                    <p className="text-sm text-gray-600">
                      {violation.license_plate} - Officer {violation.serviceNumber}
                    </p>
                    <p className={`text-xs px-2 py-1 rounded inline-block mt-1 ${
                      violation.status === 'paid' ? 'bg-green-100 text-green-800' :
                      violation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      violation.status === 'disputed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {violation.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">MWK {violation.fine_amount?.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">{formatTimeAgo(violation.violation_date)}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredViolations.length)} of {filteredViolations.length} violations
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Previous page"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + Math.max(1, currentPage - 2);
                  if (page > totalPages) return null;
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-3 py-1 border rounded ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Next page"
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}