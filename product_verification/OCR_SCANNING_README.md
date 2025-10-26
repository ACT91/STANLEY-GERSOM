# OCR License Plate Scanning Feature

## Overview
The license plate scanner now uses OCR (Optical Character Recognition) to extract text from camera images instead of relying on QR/barcode scanning.

## How It Works

### 1. Camera Capture
- Open the License Plate Scanner from the main menu
- Position the license plate within the white frame overlay
- Tap the camera button to capture an image

### 2. Text Extraction
- The app uses Google ML Kit Text Recognition to extract text from the captured image
- Multiple license plate patterns are supported:
  - ABC 123 (letters followed by numbers)
  - AB 1234A (letters, numbers, optional letter)
  - 123 ABC (numbers followed by letters)
  - A123ABC (mixed patterns)

### 3. Database Check
- If a license plate is successfully extracted, the app automatically searches the database
- **If found**: Shows vehicle details with today's violations prominently displayed
- **If not found**: Redirects to vehicle registration page

### 4. Violation Management
- **Existing violations**: Displays all violations recorded today with clear warning indicators
- **No violations**: Shows green confirmation that no violations exist today
- **Record new**: Button text changes based on existing violations ("Record Additional Violation" vs "Issue New Violation")

## Key Features

### Enhanced UI
- Real-time camera preview with overlay guide
- Clear visual feedback for successful/failed text extraction
- Color-coded violation status (red for violations, green for clean record)
- Highlighted license plate information

### Smart Text Recognition
- Handles various license plate formats
- Filters out non-license plate text
- Normalizes spacing and formatting

### Improved Workflow
- Seamless transition from scanning to vehicle management
- Context-aware violation recording
- Clear indication of daily violation count

## Technical Implementation

### Dependencies Added
- `google_mlkit_text_recognition: ^0.13.0` - OCR text extraction
- `camera: ^0.10.5+9` - Camera functionality
- `image: ^4.1.7` - Image processing

### Permissions Required
- Camera access (already configured in AndroidManifest.xml)

## Installation
1. Run `install_dependencies.bat` to install new Flutter packages
2. Build and run the application
3. Grant camera permissions when prompted

## Usage Tips
- Ensure good lighting for better text recognition
- Position license plate clearly within the frame
- Clean license plates work better than dirty/damaged ones
- The app works with both front and rear license plates

## Fallback Option
Manual entry is still available by tapping the keyboard icon in the top-right corner of the scanner page.