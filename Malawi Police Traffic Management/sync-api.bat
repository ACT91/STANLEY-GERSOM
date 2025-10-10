@echo off
echo Syncing API files to XAMPP...
xcopy /E /Y "api\*" "C:\xampp\htdocs\malawi-police-api\"
echo Done! API files updated in XAMPP.
pause