@echo off
echo Installing Flutter dependencies for enhanced police app...
cd /d "%~dp0"
echo Cleaning previous build...
flutter clean
echo Getting dependencies...
flutter pub get
echo.
echo Dependencies installed successfully!
echo Android SDK updated to version 36 for camera compatibility.
echo.
echo New features added:
echo - Full-screen camera preview for license plate scanning
echo - Tab switcher between camera and keyboard input
echo - OCR text extraction from camera images
echo - System notifications for activities
echo - Enhanced UI with app color scheme (blue theme)
echo - Improved violation display and management
echo.
echo You can now run: flutter run
echo.
pause