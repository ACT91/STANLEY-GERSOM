import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import 'package:google_mlkit_text_recognition/google_mlkit_text_recognition.dart';
import '../services/api_service.dart';
import 'vehicle_registration_page.dart';
import 'vehicle_details_page.dart';

class LicensePlateScannerPage extends StatefulWidget {
  const LicensePlateScannerPage({super.key});

  @override
  _LicensePlateScannerPageState createState() => _LicensePlateScannerPageState();
}

class _LicensePlateScannerPageState extends State<LicensePlateScannerPage> {
  final _manualController = TextEditingController();
  CameraController? _cameraController;
  final _textRecognizer = TextRecognizer();
  bool _isScanning = true;
  bool _isLoading = false;
  bool _isCameraInitialized = false;
  String _scannedText = '';
  String _extractedPlate = '';

  @override
  void initState() {
    super.initState();
    _initializeCamera();
  }

  Future<void> _initializeCamera() async {
    final cameras = await availableCameras();
    if (cameras.isNotEmpty) {
      _cameraController = CameraController(
        cameras.first,
        ResolutionPreset.high,
        enableAudio: false,
      );
      await _cameraController!.initialize();
      setState(() => _isCameraInitialized = true);
    }
  }

  @override
  void dispose() {
    _cameraController?.dispose();
    _textRecognizer.close();
    _manualController.dispose();
    super.dispose();
  }

  Future<void> _captureAndProcessImage() async {
    if (_cameraController == null || !_cameraController!.value.isInitialized) return;

    setState(() => _isLoading = true);

    try {
      final image = await _cameraController!.takePicture();
      
      // Process full image directly
      final fullImage = InputImage.fromFilePath(image.path);
      final fullText = await _textRecognizer.processImage(fullImage);
      String extractedPlate = _extractLicensePlate(fullText.text);
      
      if (extractedPlate.isNotEmpty) {
        setState(() {
          _extractedPlate = extractedPlate;
          _scannedText = 'Extracted: $extractedPlate';
        });
        await _searchVehicle(extractedPlate);
      } else {
        setState(() => _scannedText = 'No license plate detected - try repositioning');
      }
    } catch (e) {
      setState(() => _scannedText = 'Error processing image: $e');
    }

    setState(() => _isLoading = false);
  }

  String _extractLicensePlate(String text) {
    if (text.isEmpty) return '';
    
    String normalizedText = text.toUpperCase().trim();
    
    // Try pattern matching with spaces first
    final patterns = [
      RegExp(r'[A-Z]{1,3}\s+\d{2,4}\s+[A-Z]{1,3}'), // MQ 7950 AH
      RegExp(r'[A-Z]{2,3}\s+\d{2,4}[A-Z]?'), // IT 20BOM
      RegExp(r'[A-Z]{1,3}\d{2,4}[A-Z]{1,3}'), // MQ7950AH
      RegExp(r'[A-Z]{2,3}\d{2,4}[A-Z]?'), // IT20BOM
    ];
    
    for (final pattern in patterns) {
      final match = pattern.firstMatch(normalizedText);
      if (match != null) {
        String candidate = match.group(0)!.replaceAll(RegExp(r'\s+'), '');
        if (candidate.length >= 5 && candidate.length <= 12) {
          bool hasLetters = RegExp(r'[A-Z]').hasMatch(candidate);
          bool hasNumbers = RegExp(r'\d').hasMatch(candidate);
          if (hasLetters && hasNumbers) {
            return candidate;
          }
        }
      }
    }
    
    return '';
  }

  Future<void> _searchVehicle(String licensePlate) async {
    if (licensePlate.trim().isEmpty) return;

    setState(() => _isLoading = true);

    final result = await ApiService.searchVehicle(licensePlate.trim());

    setState(() => _isLoading = false);

    if (mounted) {
      if (result['success']) {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => VehicleDetailsPage(
              vehicle: result['vehicle'],
              todayViolations: List<Map<String, dynamic>>.from(result['today_violations'] ?? []),
            ),
          ),
        );
      } else {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => VehicleRegistrationPage(licensePlate: licensePlate.trim()),
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('License Plate Scanner'),
        backgroundColor: Colors.blue[900],
        foregroundColor: Colors.white,
        actions: [
          Container(
            margin: EdgeInsets.only(right: 8),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                GestureDetector(
                  onTap: () => setState(() => _isScanning = true),
                  child: Container(
                    padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: _isScanning ? Colors.white : Colors.transparent,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Icon(
                      Icons.camera_alt,
                      color: _isScanning ? Colors.blue[900] : Colors.white,
                      size: 20,
                    ),
                  ),
                ),
                GestureDetector(
                  onTap: () => setState(() => _isScanning = false),
                  child: Container(
                    padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: !_isScanning ? Colors.white : Colors.transparent,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Icon(
                      Icons.keyboard,
                      color: !_isScanning ? Colors.blue[900] : Colors.white,
                      size: 20,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      body: Stack(
        children: [
          if (_isScanning) ...[
            Positioned.fill(
              child: _isCameraInitialized && _cameraController != null
                  ? CameraPreview(_cameraController!)
                  : Container(
                      color: Colors.black,
                      child: Center(
                        child: CircularProgressIndicator(color: Colors.white),
                      ),
                    ),
            ),
            Center(
              child: Container(
                width: 280,
                height: 120,
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.white, width: 3),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Center(
                  child: Text(
                    'Position license plate here',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      shadows: [Shadow(color: Colors.black, blurRadius: 2)],
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
              ),
            ),
            if (_scannedText.isNotEmpty)
              Positioned(
                top: 50,
                left: 16,
                right: 16,
                child: Container(
                  padding: EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: _extractedPlate.isNotEmpty ? Colors.green.withValues(alpha: 0.9) : Colors.blue.withValues(alpha: 0.9),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        _extractedPlate.isNotEmpty ? Icons.check_circle : Icons.info,
                        color: Colors.white,
                      ),
                      SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          _scannedText,
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
          ] else ...[
            Positioned.fill(
              child: Container(
                color: Colors.grey[50],
                padding: EdgeInsets.all(24),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.directions_car,
                      size: 80,
                      color: Colors.blue[600],
                    ),
                    SizedBox(height: 24),
                    Text(
                      'Enter License Plate',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Colors.grey[900],
                      ),
                    ),
                    SizedBox(height: 32),
                    TextField(
                      controller: _manualController,
                      decoration: InputDecoration(
                        labelText: 'License Plate Number',
                        hintText: 'e.g., MQ7950AH',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                          borderSide: BorderSide(color: Colors.blue[500]!, width: 2),
                        ),
                        contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      ),
                      textCapitalization: TextCapitalization.characters,
                    ),
                    SizedBox(height: 24),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _isLoading ? null : () => _searchVehicle(_manualController.text),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blue[600],
                          foregroundColor: Colors.white,
                          padding: EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                        child: _isLoading
                            ? CircularProgressIndicator(color: Colors.white, strokeWidth: 2)
                            : Text(
                                'Search Vehicle',
                                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
                              ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
          if (_isScanning)
            Positioned(
              bottom: 30,
              left: 0,
              right: 0,
              child: Center(
                child: FloatingActionButton.large(
                  onPressed: _isLoading ? null : _captureAndProcessImage,
                  backgroundColor: Colors.blue[600],
                  child: _isLoading
                      ? CircularProgressIndicator(color: Colors.white, strokeWidth: 3)
                      : Icon(Icons.camera_alt, color: Colors.white, size: 35),
                ),
              ),
            ),
        ],
      ),
    );
  }
}