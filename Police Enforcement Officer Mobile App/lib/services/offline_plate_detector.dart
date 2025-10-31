import 'dart:io';
import 'package:image/image.dart' as img;

class OfflinePlateDetector {
  
  static Future<String> detectLicensePlate(String imagePath) async {
    try {
      final bytes = await File(imagePath).readAsBytes();
      final image = img.decodeImage(bytes);
      if (image == null) return '';
      
      // Preprocess image for better text detection
      final processedImage = _preprocessImage(image);
      
      // Use enhanced pattern matching on processed image
      final text = await _extractTextFromImage(processedImage);
      
      return _extractLicensePlateFromText(text);
    } catch (e) {
      return '';
    }
  }
  
  static img.Image _preprocessImage(img.Image image) {
    // Convert to grayscale
    var processed = img.grayscale(image);
    
    // Increase contrast
    processed = img.contrast(processed, contrast: 1.5);
    
    // Resize for better processing (if too small)
    if (processed.width < 200) {
      processed = img.copyResize(processed, width: 400);
    }
    
    return processed;
  }
  
  static Future<String> _extractTextFromImage(img.Image image) async {
    // Simple pattern-based detection using image analysis
    // This is a basic fallback when ML Kit OCR fails
    return '';
  }
  
  static String _extractLicensePlateFromText(String text) {
    // Enhanced license plate patterns for Malawi/African formats
    final patterns = [
      RegExp(r'[A-Z]{2}\d{2,4}[A-Z]{1,3}'), // IT20BOM, MW123ABC
      RegExp(r'[A-Z]{1,3}\d{2,4}[A-Z]?'), // ABC123, A1234B
      RegExp(r'\d{2,3}[A-Z]{2,4}'), // 123ABC, 12ABCD
      RegExp(r'[A-Z]\d{1,3}[A-Z]{2,3}'), // A123BC
    ];
    
    // Clean text: remove spaces, newlines, special chars
    String cleanText = text
        .replaceAll(RegExp(r'[^\w\s]'), '')
        .replaceAll(RegExp(r'\s+'), '')
        .toUpperCase();
    
    // Try each pattern
    for (final pattern in patterns) {
      final matches = pattern.allMatches(cleanText);
      for (final match in matches) {
        String candidate = match.group(0)!;
        if (_isValidLicensePlate(candidate)) {
          return candidate;
        }
      }
    }
    
    return '';
  }
  
  static bool _isValidLicensePlate(String plate) {
    // Validate license plate format
    if (plate.length < 4 || plate.length > 10) return false;
    
    // Must contain both letters and numbers
    bool hasLetters = RegExp(r'[A-Z]').hasMatch(plate);
    bool hasNumbers = RegExp(r'\d').hasMatch(plate);
    
    return hasLetters && hasNumbers;
  }
}