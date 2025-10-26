import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';

class ApiService {
  static String get baseUrl => dotenv.env['API_BASE_URL'] ?? 'http://localhost/malawi_police_traffic/api';

  static Future<Map<String, dynamic>> loginOfficer({
    required String serviceNumber,
    required String pin,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/officers/login.php'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'serviceNumber': serviceNumber,
          'pin': pin,
        }),
      );
      return jsonDecode(response.body);
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  static Future<Map<String, dynamic>> searchVehicle(String licensePlate) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/search-vehicle.php'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'license_plate': licensePlate}),
      );
      return jsonDecode(response.body);
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  static Future<Map<String, dynamic>> issueViolation({
    required int vehicleId,
    required int officerId,
    required int violationTypeId,
    required String location,
    String? notes,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/violations/issue.php'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'vehicle_id': vehicleId,
          'officer_id': officerId,
          'violation_type_id': violationTypeId,
          'location': location,
          'notes': notes,
        }),
      );
      return jsonDecode(response.body);
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  static Future<Map<String, dynamic>> getViolationTypes() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/violations/types.php'),
        headers: {'Content-Type': 'application/json'},
      );
      return jsonDecode(response.body);
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  static Future<Map<String, dynamic>> getOfficerActivities(int officerId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/violations/list.php?officer_id=$officerId'),
        headers: {'Content-Type': 'application/json'},
      );
      return jsonDecode(response.body);
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  static Future<Map<String, dynamic>> registerOfficer({
    required String serviceNumber,
    required String fullName,
    required String rank,
    required String station,
    required String pin,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/officers/register.php'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'serviceNumber': serviceNumber,
          'fullName': fullName,
          'rank': rank,
          'station': station,
          'pin': pin,
        }),
      );
      return jsonDecode(response.body);
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  static Future<Map<String, dynamic>> registerVehicle({
    required String licensePlate,
    required String ownerName,
    required String ownerPhone,
    required String vehicleType,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/get-or-create-vehicle.php'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'license_plate': licensePlate,
          'owner_name': ownerName,
          'owner_phone': ownerPhone,
          'vehicles_type': vehicleType,
        }),
      );
      return jsonDecode(response.body);
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }
}