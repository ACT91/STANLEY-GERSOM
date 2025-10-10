# Malawi Police Traffic Management System

A comprehensive traffic management system with React dashboard for supervisors and Flutter mobile app for officers.

## System Architecture

- **Frontend Dashboard**: React + TypeScript + Tailwind CSS + shadcn/ui
- **Mobile App**: Flutter (for officers in the field)
- **Backend API**: PHP + MySQL (XAMPP)
- **Database**: MySQL with comprehensive schema

## Features

### Supervisor Dashboard
- **Authentication**: Secure login for supervisors/managers
- **Officer Management**: Add, edit, activate/deactivate officers
- **Violation Management**: Review, approve, dispute violations
- **Real-time Analytics**: Dashboard with key metrics
- **Reports**: Generate performance and revenue reports

### Officer Mobile App (Flutter)
- **License Plate Scanning**: Firebase ML Kit integration
- **Violation Recording**: Quick ticket issuance
- **Payment Processing**: Mobile money integration
- **Offline Capability**: Work without internet connection

## Installation

### 1. Database Setup (XAMPP)

1. Start XAMPP and ensure MySQL is running
2. Open phpMyAdmin (http://localhost/phpmyadmin)
3. Import the database schema:
   ```sql
   -- Run the contents of database/schema.sql
   ```

### 2. Backend API Setup

1. Copy the `api` folder to your XAMPP htdocs directory:
   ```
   C:\xampp\htdocs\malawi-police-api\
   ```

2. Update database configuration in `api/config/database.php` if needed

3. Test API endpoints:
   - http://localhost/malawi-police-api/auth/login.php
   - http://localhost/malawi-police-api/dashboard/stats.php

### 3. Frontend Dashboard Setup

1. Navigate to project directory:
   ```bash
   cd "Malawi Police Traffic Management"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update API base URL in `src/utils/api.ts`:
   ```typescript
   const API_BASE_URL = 'http://localhost/malawi-police-api';
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

5. Access dashboard at: http://localhost:5173

## Default Login Credentials

### Supervisors/Managers
- **Username**: `admin` | **Password**: `admin123`
- **Username**: `supervisor1` | **Password**: `admin123`
- **Username**: `manager1` | **Password**: `admin123`

### Officers (Mobile App)
- **Service Number**: `MP001` | **PIN**: `1234`
- **Service Number**: `MP002` | **PIN**: `5678`

## Database Schema

### Key Tables
- `admins` - Supervisor/manager accounts
- `officers` - Police officers using mobile app
- `vehicles` - Vehicle registration data
- `violations` - Traffic violation records
- `violation_types` - Predefined violation categories
- `officer_shifts` - Shift tracking and performance

## API Endpoints

### Authentication
- `POST /auth/login.php` - Admin login

### Dashboard
- `GET /dashboard/stats.php` - Dashboard statistics

### Officers Management
- `GET /officers/list.php` - List all officers
- `POST /officers/create.php` - Create new officer
- `POST /officers/update.php` - Update officer details

### Violations Management
- `GET /violations/list.php` - List violations (with filters)
- `POST /violations/update-status.php` - Update violation status

## Mobile App Integration

The Flutter mobile app connects to the same MySQL database through PHP APIs:

### Officer Functions
- License plate scanning with Firebase ML Kit
- Vehicle history lookup
- Violation recording and ticket generation
- Payment processing (Airtel Money, Mpamba)
- Shift management

### API Endpoints for Mobile
- `POST /mobile/officer-login.php` - Officer authentication
- `POST /mobile/scan-vehicle.php` - Vehicle lookup
- `POST /mobile/issue-ticket.php` - Create violation
- `POST /mobile/process-payment.php` - Handle payments

## Security Features

- Password hashing for admin accounts
- PIN-based authentication for officers
- CORS protection for API endpoints
- SQL injection prevention with prepared statements
- Session management and timeout

## Performance Optimization

- Database indexing on frequently queried fields
- Pagination for large datasets
- Caching for dashboard statistics
- Optimized queries with JOINs

## Deployment

### Production Setup
1. Configure proper database credentials
2. Enable HTTPS for secure communication
3. Set up proper CORS policies
4. Configure backup and monitoring
5. Deploy to web server (Apache/Nginx)

## Support

For technical support or feature requests, contact the development team.

## License

This project is licensed under the MIT License.