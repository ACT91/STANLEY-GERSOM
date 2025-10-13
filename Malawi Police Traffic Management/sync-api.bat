@echo off
echo Syncing API files to XAMPP...
xcopy /E /Y "api\*" "C:\xampp\htdocs\malawi-police-api\"
echo Done! API files updated in XAMPP.
echo.
echo Note: Mobile app runs on port 5174
echo Dashboard: http://localhost:5173
echo Mobile App: http://localhost:5174
pause