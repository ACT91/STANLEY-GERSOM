export interface Admin {
  adminID: number;
  username: string;
  fullName: string;
  email: string;
  role: 'supervisor' | 'manager' | 'admin';
  station: string;
  isActive: boolean;
  created_at: string;
  last_login?: string;
}

export interface Officer {
  officerID: number;
  serviceNumber: string;
  fullName: string;
  rank: string;
  station: string;
  isActive: boolean;
  created_at: string;
  last_login?: string;
  assigned_supervisor: number;
}

export interface Vehicle {
  vehiclesID: number;
  license_plate: string;
  owner_name: string;
  owner_phone: string;
  vehicles_type: 'sedan' | 'suv' | 'truck' | 'motorcycle' | 'bus' | 'other';
  registration_date: string;
  created_at: string;
}

export interface ViolationType {
  typeID: number;
  violation_name: string;
  base_fine: number;
  description: string;
  is_active: boolean;
}

export interface Violation {
  violationID: number;
  ticket_number: string;
  vehicle_id: number;
  officer_id: number;
  violation_type_id: number;
  fine_amount: number;
  violation_date: string;
  location: string;
  notes: string;
  status: 'pending' | 'paid' | 'disputed' | 'cancelled';
  payment_date?: string;
  payment_method?: 'cash' | 'airtel_money' | 'mpamba' | 'bank';
  dispute_reason?: string;
  resolved_by?: number;
}

export interface DashboardStats {
  totalOfficers: number;
  activeOfficers: number;
  totalViolations: number;
  pendingViolations: number;
  totalRevenue: number;
  todayRevenue: number;
}