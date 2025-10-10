@echo off
echo Starting Malawi Police Traffic Management System...
echo.
echo 1. Starting XAMPP services...
start "" "C:\xampp\xampp-control.exe"
timeout /t 3 /nobreak >nul

echo 2. Starting React development server...
start cmd /k "npm run dev"

echo 3. Opening browser tabs...
timeout /t 5 /nobreak >nul
start "" "http://localhost:5173"
start "" "http://localhost/phpmyadmin"

echo.
echo ✅ Development environment ready!
echo - React Dashboard: http://localhost:5173
echo - phpMyAdmin: http://localhost/phpmyadmin
echo - API Base: http://localhost/malawi-police-api
echo.
pause