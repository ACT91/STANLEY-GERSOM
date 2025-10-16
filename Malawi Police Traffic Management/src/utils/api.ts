const API_BASE_URL = 'http://localhost/malawi-police-api';

interface CreateOfficerData {
  serviceNumber: string;
  fullName: string;
  rank: string;
  station: string;
  pin: string;
}

interface UpdateOfficerData {
  isActive?: boolean;
  fullName?: string;
  rank?: string;
  station?: string;
}

interface ViolationFilters {
  status?: string;
}

interface DateRange {
  startDate?: string;
  endDate?: string;
}

export const api = {
  // Auth endpoints
  login: async (username: string, password: string) => {
    console.log('Sending login request to:', `${API_BASE_URL}/auth/login.php`);
    console.log('Login data:', { username, password });
    
    const response = await fetch(`${API_BASE_URL}/auth/login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    const result = await response.json();
    console.log('Login response:', result);
    return result;
  },

  // Dashboard stats
  getDashboardStats: async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats.php`);
    return response.json();
  },

  // Officers management
  getOfficers: async () => {
    const response = await fetch(`${API_BASE_URL}/officers/list.php`);
    return response.json();
  },

  createOfficer: async (officer: CreateOfficerData) => {
    const response = await fetch(`${API_BASE_URL}/officers/create.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(officer)
    });
    return response.json();
  },

  updateOfficer: async (id: number, officer: UpdateOfficerData) => {
    const response = await fetch(`${API_BASE_URL}/officers/update.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...officer })
    });
    return response.json();
  },

  // Violations management
  getViolations: async (filters?: ViolationFilters) => {
    const params = new URLSearchParams();
    if (filters?.status) params.set('status', filters.status);
    const query = params.toString();
    const response = await fetch(`${API_BASE_URL}/violations/list.php${query ? `?${query}` : ''}`);
    return response.json();
  },

  updateViolationStatus: async (id: number, status: string, notes?: string) => {
    const response = await fetch(`${API_BASE_URL}/violations/update-status.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, notes })
    });
    return response.json();
  },

  // Vehicles management
  getVehicles: async () => {
    const response = await fetch(`${API_BASE_URL}/vehicles/list.php`);
    return response.json();
  },

  // Analytics
  getAnalytics: async () => {
    const response = await fetch(`${API_BASE_URL}/analytics/statistics.php`);
    return response.json();
  },

  getVehicleAnalytics: async (licensePlate: string) => {
    const response = await fetch(`${API_BASE_URL}/analytics/vehicle-stats.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ license_plate: licensePlate })
    });
    return response.json();
  },

  getRecentActivity: async () => {
    const response = await fetch(`${API_BASE_URL}/analytics/recent-activity.php`);
    return response.json();
  },

  getAllActivities: async () => {
    const response = await fetch(`${API_BASE_URL}/analytics/all-activities.php`);
    return response.json();
  },

  // Reports
  getReports: async (type: string, dateRange: DateRange) => {
    const response = await fetch(`${API_BASE_URL}/reports/generate.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, ...dateRange })
    });
    return response.json();
  }
};