import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/utils/api';
import type { Officer } from '@/types';

export default function Officers() {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [filteredOfficers, setFilteredOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOfficer, setNewOfficer] = useState({
    serviceNumber: '',
    fullName: '',
    rank: '',
    station: '',
    pin: ''
  });

  useEffect(() => {
    loadOfficers();
    // Set up real-time updates every 60 seconds for officers
    const interval = setInterval(loadOfficers, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterOfficers();
  }, [searchTerm, officers]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadOfficers = async () => {
    try {
      const result = await api.getOfficers();
      if (result.success) {
        setOfficers(result.data);
      }
    } catch (error) {
      console.error('Failed to load officers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOfficers = () => {
    if (!searchTerm.trim()) {
      setFilteredOfficers(officers);
      return;
    }

    const filtered = officers.filter(officer =>
      officer.serviceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      officer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      officer.rank.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOfficers(filtered);
  };

  const handleAddOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await api.createOfficer(newOfficer);
      if (result.success) {
        setOfficers([...officers, result.data]);
        setNewOfficer({ serviceNumber: '', fullName: '', rank: '', station: '', pin: '' });
        setShowAddForm(false);
        // Refresh data immediately after adding
        loadOfficers();
      }
    } catch (error) {
      console.error('Failed to add officer:', error);
    }
  };

  const toggleOfficerStatus = async (officer: Officer) => {
    try {
      const result = await api.updateOfficer(officer.officerID, {
        isActive: !officer.isActive
      });
      if (result.success) {
        setOfficers(officers.map(o => 
          o.officerID === officer.officerID 
            ? { ...o, isActive: !o.isActive }
            : o
        ));
        // Refresh data immediately after update
        loadOfficers();
      }
    } catch (error) {
      console.error('Failed to update officer:', error);
    }
  };

  if (loading) {
    return <div className="p-6">Loading officers...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Officers Management</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add New Officer
        </button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Officer</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddOfficer} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Service Number</label>
                <input
                  type="text"
                  value={newOfficer.serviceNumber}
                  onChange={(e) => setNewOfficer({...newOfficer, serviceNumber: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter service number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={newOfficer.fullName}
                  onChange={(e) => setNewOfficer({...newOfficer, fullName: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rank</label>
                <select
                  value={newOfficer.rank}
                  onChange={(e) => setNewOfficer({...newOfficer, rank: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  title="Select officer rank"
                  required
                >
                  <option value="">Select Rank</option>
                  <option value="Constable">Constable</option>
                  <option value="Corporal">Corporal</option>
                  <option value="Sergeant">Sergeant</option>
                  <option value="Inspector">Inspector</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Station</label>
                <input
                  type="text"
                  value={newOfficer.station}
                  onChange={(e) => setNewOfficer({...newOfficer, station: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter station name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">PIN (4-6 digits)</label>
                <input
                  type="text"
                  value={newOfficer.pin}
                  onChange={(e) => setNewOfficer({...newOfficer, pin: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter 4-6 digit PIN"
                  maxLength={6}
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Add Officer
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Officers List</CardTitle>
          <CardDescription>Manage police officers and their access</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by service number, name, or rank..."
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Service Number</th>
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Rank</th>
                  <th className="text-left p-2">Station</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Last Login</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOfficers.map((officer) => (
                  <tr key={officer.officerID} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{officer.serviceNumber}</td>
                    <td className="p-2">{officer.fullName}</td>
                    <td className="p-2">{officer.rank}</td>
                    <td className="p-2">{officer.station}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        officer.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {officer.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-2 text-sm text-gray-600">
                      {officer.last_login 
                        ? new Date(officer.last_login).toLocaleDateString()
                        : 'Never'
                      }
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => toggleOfficerStatus(officer)}
                        className={`px-3 py-1 rounded text-xs ${
                          officer.isActive
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {officer.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredOfficers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? 'No officers found matching your search.' : 'No officers found.'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}