-- Update admin passwords to plain text for testing
UPDATE admins SET password = 'admin123' WHERE username = 'admin';
UPDATE admins SET password = 'admin123' WHERE username = 'supervisor1';
UPDATE admins SET password = 'admin123' WHERE username = 'manager1';