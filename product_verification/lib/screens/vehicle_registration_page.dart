import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../services/notification_service.dart';
import 'issue_violation_page.dart';

class VehicleRegistrationPage extends StatefulWidget {
  final String licensePlate;

  const VehicleRegistrationPage({super.key, required this.licensePlate});

  @override
  _VehicleRegistrationPageState createState() => _VehicleRegistrationPageState();
}

class _VehicleRegistrationPageState extends State<VehicleRegistrationPage> {
  final _ownerNameController = TextEditingController();
  final _ownerPhoneController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  String _selectedVehicleType = '';
  bool _isLoading = false;
  String _error = '';

  final List<String> _vehicleTypes = ['Car', 'Motorcycle', 'Truck', 'Bus', 'Bicycle'];

  Future<void> _registerVehicle() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
      _error = '';
    });

    try {
      final result = await ApiService.registerVehicle(
        licensePlate: widget.licensePlate,
        ownerName: _ownerNameController.text.trim(),
        ownerPhone: _ownerPhoneController.text.trim(),
        vehicleType: _selectedVehicleType,
      );

      if (mounted) {
        setState(() => _isLoading = false);
        
        if (result['success']) {
          // Send notification
          if (mounted) {
            await NotificationService.showVehicleRegistered(widget.licensePlate);
          }
          
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (context) => IssueViolationPage(vehicle: result['vehicle']),
            ),
          );
        } else {
          setState(() => _error = result['message'] ?? 'Registration failed');
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isLoading = false;
          _error = 'Connection error. Please try again.';
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.blue[50],
      appBar: AppBar(
        title: Text('Register Vehicle'),
        backgroundColor: Colors.blue[900],
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: EdgeInsets.all(24),
        child: Column(
          children: [
            Card(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  children: [
                    Icon(
                      Icons.add_circle,
                      size: 48,
                      color: Colors.blue[600],
                    ),
                    SizedBox(height: 16),
                    Text(
                      'Vehicle Not Found',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.grey[900],
                      ),
                    ),
                    SizedBox(height: 8),
                    Text(
                      'License Plate: ${widget.licensePlate}',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                        color: Colors.blue[700],
                      ),
                    ),
                    SizedBox(height: 8),
                    Text(
                      'Register this vehicle to continue',
                      style: TextStyle(color: Colors.grey[600]),
                    ),
                  ],
                ),
              ),
            ),
            SizedBox(height: 24),
            Expanded(
              child: Form(
                key: _formKey,
                child: Column(
                  children: [
                    _buildFormField(
                      'Owner Name',
                      _ownerNameController,
                      'Enter owner full name',
                      (value) => value?.isEmpty ?? true ? 'Owner name required' : null,
                    ),
                    SizedBox(height: 16),
                    _buildFormField(
                      'Owner Phone',
                      _ownerPhoneController,
                      'Enter phone number',
                      (value) => value?.isEmpty ?? true ? 'Phone number required' : null,
                      keyboardType: TextInputType.phone,
                    ),
                    SizedBox(height: 16),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Vehicle Type',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                            color: Colors.grey[700],
                          ),
                        ),
                        SizedBox(height: 8),
                        DropdownButtonFormField<String>(
                          value: _selectedVehicleType.isEmpty ? null : _selectedVehicleType,
                          decoration: InputDecoration(
                            hintText: 'Select Vehicle Type',
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(8),
                              borderSide: BorderSide(color: Colors.blue[500]!, width: 2),
                            ),
                            contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                          ),
                          items: _vehicleTypes.map((type) => DropdownMenuItem(
                            value: type,
                            child: Text(type),
                          )).toList(),
                          onChanged: (value) => setState(() => _selectedVehicleType = value!),
                          validator: (value) => value == null ? 'Vehicle type required' : null,
                        ),
                      ],
                    ),
                    if (_error.isNotEmpty) ...[
                      SizedBox(height: 16),
                      Container(
                        width: double.infinity,
                        padding: EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.red[50],
                          border: Border.all(color: Colors.red[200]!),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          _error,
                          style: TextStyle(color: Colors.red[700]),
                        ),
                      ),
                    ],
                    SizedBox(height: 24),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _isLoading ? null : _registerVehicle,
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
                                'Register & Continue',
                                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
                              ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFormField(
    String label,
    TextEditingController controller,
    String hint,
    String? Function(String?) validator, {
    TextInputType? keyboardType,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: Colors.grey[700],
          ),
        ),
        SizedBox(height: 8),
        TextFormField(
          controller: controller,
          decoration: InputDecoration(
            hintText: hint,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(color: Colors.blue[500]!, width: 2),
            ),
            contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          ),
          keyboardType: keyboardType,
          validator: validator,
        ),
      ],
    );
  }
}