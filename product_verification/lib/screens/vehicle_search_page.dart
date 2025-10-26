import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'issue_violation_page.dart';

class VehicleSearchPage extends StatefulWidget {
  const VehicleSearchPage({super.key});

  @override
  _VehicleSearchPageState createState() => _VehicleSearchPageState();
}

class _VehicleSearchPageState extends State<VehicleSearchPage> {
  final _licensePlateController = TextEditingController();
  bool _isLoading = false;
  Map<String, dynamic>? _vehicleData;

  Future<void> _searchVehicle() async {
    if (_licensePlateController.text.trim().isEmpty) return;

    setState(() => _isLoading = true);

    final result = await ApiService.searchVehicle(_licensePlateController.text.trim());

    setState(() {
      _isLoading = false;
      _vehicleData = result['success'] ? result['vehicle'] : null;
    });

    if (!result['success'] && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(result['message'] ?? 'Vehicle not found'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Vehicle Search'),
        backgroundColor: Colors.blue[900],
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Card(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Search Vehicle',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    SizedBox(height: 16),
                    TextField(
                      controller: _licensePlateController,
                      decoration: InputDecoration(
                        labelText: 'License Plate Number',
                        prefixIcon: Icon(Icons.directions_car),
                        border: OutlineInputBorder(),
                        hintText: 'Enter license plate number',
                      ),
                      textCapitalization: TextCapitalization.characters,
                    ),
                    SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _isLoading ? null : _searchVehicle,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blue[900],
                          foregroundColor: Colors.white,
                        ),
                        child: _isLoading
                            ? CircularProgressIndicator(color: Colors.white)
                            : Text('Search Vehicle'),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            SizedBox(height: 16),
            if (_vehicleData != null) ...[
              Card(
                child: Padding(
                  padding: EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Icon(Icons.directions_car, color: Colors.green),
                          SizedBox(width: 8),
                          Text(
                            'Vehicle Found',
                            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                      SizedBox(height: 16),
                      _buildInfoRow('License Plate', _vehicleData!['license_plate']),
                      _buildInfoRow('Owner Name', _vehicleData!['owner_name']),
                      _buildInfoRow('Owner Phone', _vehicleData!['owner_phone']),
                      _buildInfoRow('Vehicle Type', _vehicleData!['vehicles_type']),
                      _buildInfoRow('Registration Date', _vehicleData!['registration_date']),
                      SizedBox(height: 16),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: () => Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => IssueViolationPage(vehicle: _vehicleData!),
                            ),
                          ),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.red[700],
                            foregroundColor: Colors.white,
                          ),
                          child: Text('Issue Violation'),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String? value) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 120,
            child: Text(
              '$label:',
              style: TextStyle(fontWeight: FontWeight.w500),
            ),
          ),
          Expanded(
            child: Text(value ?? 'N/A'),
          ),
        ],
      ),
    );
  }
}