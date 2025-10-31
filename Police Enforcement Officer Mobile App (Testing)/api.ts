  const API_BASE_URL = 'http://localhost/malawi-police-api';

export const api = {
  // Officer registration
  registerOfficer: async (data: {
    serviceNumber: string;
    fullName: string;
    rank: string;
    station: string;
    pin: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/officers/register.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Officer login
  loginOfficer: async (serviceNumber: string, pin: string) => {
    const response = await fetch(`${API_BASE_URL}/officers/login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceNumber, pin })
    });
    return response.json();
  },

  // Get vehicle info (creates if not exists)
  getVehicle: async (licensePlate: string) => {
    const response = await fetch(`${API_BASE_URL}/get-or-create-vehicle.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ license_plate: licensePlate })
    });
    return response.json();
  },

  // Get violation types
  getViolationTypes: async () => {
    const response = await fetch(`${API_BASE_URL}/violations/types.php`);
    return response.json();
  },

  // Update vehicle information
  updateVehicle: async (vehicleId: number, data: {
    owner_name: string;
    owner_phone: string;
    vehicles_type: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/vehicles/update.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vehicleId, ...data })
    });
    return response.json();
  },

  // Issue violation
  issueViolation: async (data: {
    vehicle_id: number;
    officer_id: number;
    violation_type_id: number;
    location: string;
    notes: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/violations/issue.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};