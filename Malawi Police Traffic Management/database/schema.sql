-- Malawi Police Traffic Management System Database Schema
-- Run this in phpMyAdmin or MySQL command line

CREATE DATABASE IF NOT EXISTS malawi_police_traffic;
USE malawi_police_traffic;

-- Admins/Supervisors table
CREATE TABLE admins (
    adminID INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Use password_hash() in PHP
    fullName VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    role ENUM('supervisor', 'manager', 'admin') DEFAULT 'supervisor',
    station VARCHAR(100),
    isActive BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- Officers table (updated)
CREATE TABLE officers (
    officerID INT PRIMARY KEY AUTO_INCREMENT,
    serviceNumber VARCHAR(20) UNIQUE NOT NULL,
    fullName VARCHAR(100) NOT NULL,
    rank VARCHAR(50),
    station VARCHAR(100),
    pin VARCHAR(6) NOT NULL, -- Simple PIN for mobile login
    isActive BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    assigned_supervisor INT,
    FOREIGN KEY (assigned_supervisor) REFERENCES admins(adminID)
);

-- Vehicles table
CREATE TABLE vehicles (
    vehiclesID INT PRIMARY KEY AUTO_INCREMENT,
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    owner_name VARCHAR(100),
    owner_phone VARCHAR(15),
    vehicles_type ENUM('sedan', 'suv', 'truck', 'motorcycle', 'bus', 'other') DEFAULT 'sedan',
    registration_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Violation types table
CREATE TABLE violation_types (
    typeID INT PRIMARY KEY AUTO_INCREMENT,
    violation_name VARCHAR(100) NOT NULL,
    base_fine DECIMAL(10,2) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true
);

-- Violations table (updated)
CREATE TABLE violations (
    violationID INT PRIMARY KEY AUTO_INCREMENT,
    ticket_number VARCHAR(20) UNIQUE NOT NULL,
    vehicle_id INT,
    officer_id INT,
    violation_type_id INT,
    fine_amount DECIMAL(10,2),
    violation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    location VARCHAR(200),
    notes TEXT,
    status ENUM('pending', 'paid', 'disputed', 'cancelled') DEFAULT 'pending',
    payment_date TIMESTAMP NULL,
    payment_method ENUM('cash', 'airtel_money', 'mpamba', 'bank') NULL,
    dispute_reason TEXT NULL,
    resolved_by INT NULL,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehiclesID),
    FOREIGN KEY (officer_id) REFERENCES officers(officerID),
    FOREIGN KEY (violation_type_id) REFERENCES violation_types(typeID),
    FOREIGN KEY (resolved_by) REFERENCES admins(adminID)
);

-- Officer shifts table
CREATE TABLE officer_shifts (
    shiftID INT PRIMARY KEY AUTO_INCREMENT,
    officer_id INT,
    shift_start TIMESTAMP,
    shift_end TIMESTAMP NULL,
    tickets_issued INT DEFAULT 0,
    total_fines DECIMAL(10,2) DEFAULT 0.00,
    location VARCHAR(100),
    FOREIGN KEY (officer_id) REFERENCES officers(officerID)
);

-- System logs table
CREATE TABLE system_logs (
    logID INT PRIMARY KEY AUTO_INCREMENT,
    user_type ENUM('admin', 'officer'),
    user_id INT,
    action VARCHAR(100),
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default violation types
INSERT INTO violation_types (violation_name, base_fine, description) VALUES
('Speeding', 20000.00, 'Exceeding speed limit'),
('No Seatbelt', 5000.00, 'Driver or passenger not wearing seatbelt'),
('Expired License', 15000.00, 'Driving with expired license'),
('No Insurance', 25000.00, 'Vehicle without valid insurance'),
('Reckless Driving', 30000.00, 'Dangerous or reckless driving behavior'),
('Overloading', 18000.00, 'Vehicle carrying excess passengers or cargo'),
('No Valid Registration', 22000.00, 'Vehicle without valid registration'),
('Mobile Phone Use', 8000.00, 'Using mobile phone while driving'),
('Wrong Lane', 12000.00, 'Driving in wrong lane'),
('Traffic Light Violation', 15000.00, 'Running red light or ignoring traffic signals');

-- Insert sample admin user (password: admin123)
INSERT INTO admins (username, password, fullName, email, role, station) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator', 'admin@police.gov.mw', 'admin', 'Headquarters'),
('supervisor1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John Phiri', 'j.phiri@police.gov.mw', 'supervisor', 'Blantyre Central'),
('manager1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mary Banda', 'm.banda@police.gov.mw', 'manager', 'Lilongwe Central');

-- Insert sample officers
INSERT INTO officers (serviceNumber, fullName, rank, station, pin, assigned_supervisor) VALUES
('MP001', 'James Mwale', 'Constable', 'Blantyre Central', '1234', 2),
('MP002', 'Grace Tembo', 'Sergeant', 'Blantyre Central', '5678', 2),
('MP003', 'Peter Kachala', 'Constable', 'Lilongwe Central', '9012', 3),
('MP004', 'Ruth Nyirenda', 'Corporal', 'Lilongwe Central', '3456', 3);

-- Insert sample vehicles
INSERT INTO vehicles (license_plate, owner_name, owner_phone, vehicles_type, registration_date) VALUES
('BL 1234 A', 'Alice Mwale', '0999123456', 'sedan', '2023-01-15'),
('LL 5678 B', 'Robert Chisale', '0888765432', 'suv', '2022-11-20'),
('BL 9012 C', 'Sarah Banda', '0777654321', 'truck', '2023-03-10'),
('NN 3456 D', 'David Phiri', '0666543210', 'motorcycle', '2023-05-05');

-- Insert sample violations
INSERT INTO violations (ticket_number, vehicle_id, officer_id, violation_type_id, fine_amount, location, notes) VALUES
('TK001001', 1, 1, 1, 20000.00, 'Blantyre-Lilongwe Road', 'Speed: 120km/h in 80km/h zone'),
('TK001002', 2, 2, 2, 5000.00, 'Kamuzu Highway', 'Driver not wearing seatbelt'),
('TK001003', 3, 3, 5, 30000.00, 'City Centre', 'Reckless overtaking'),
('TK001004', 1, 1, 8, 8000.00, 'Limbe Market', 'Using phone while driving');

-- Create indexes for better performance
CREATE INDEX idx_violations_date ON violations(violation_date);
CREATE INDEX idx_violations_status ON violations(status);
CREATE INDEX idx_violations_officer ON violations(officer_id);
CREATE INDEX idx_officers_station ON officers(station);
CREATE INDEX idx_vehicles_plate ON vehicles(license_plate);