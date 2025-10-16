import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/utils/api';
import type { Vehicle } from '@/types';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadVehicles();
    // Set up real-time updates every 45 seconds for vehicles
    const interval = setInterval(loadVehicles, 45000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterVehicles();
  }, [searchTerm, vehicles]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadVehicles = async () => {
    try {
      const result = await api.getVehicles();
      if (result.success) {
        setVehicles(result.data);
      }
    } catch (error) {
      console.error('Failed to load vehicles:', error);
    } finally {
      setLoading(false);
    }
  };



  const filterVehicles = () => {
    if (!searchTerm.trim()) {
      setFilteredVehicles(vehicles);
      return;
    }

    const filtered = vehicles.filter(vehicle =>
      vehicle.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.vehicles_type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVehicles(filtered);
  };

  if (loading) {
    return <div className="p-6">Loading vehicles...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Vehicles Management</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicles List</CardTitle>
          <CardDescription>View and manage registered vehicles</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by license plate, owner name, or vehicle type..."
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Vehicle ID</th>
                  <th className="text-left p-2">License Plate</th>
                  <th className="text-left p-2">Owner Name</th>
                  <th className="text-left p-2">Vehicle Type</th>
                  <th className="text-left p-2">Phone Number</th>
                  <th className="text-left p-2">Registration Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.vehiclesID} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">#{vehicle.vehiclesID}</td>
                    <td className="p-2 font-medium">{vehicle.license_plate}</td>
                    <td className="p-2">{vehicle.owner_name}</td>
                    <td className="p-2 capitalize">{vehicle.vehicles_type}</td>
                    <td className="p-2">{vehicle.owner_phone}</td>
                    <td className="p-2 text-sm text-gray-600">
                      {new Date(vehicle.registration_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredVehicles.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? 'No vehicles found matching your search.' : 'No vehicles registered yet.'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}