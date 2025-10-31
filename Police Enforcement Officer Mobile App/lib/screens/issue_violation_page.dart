import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';
import '../services/notification_service.dart';
import '../providers/auth_provider.dart';
import 'payment_page.dart';

class IssueViolationPage extends StatefulWidget {
  final Map<String, dynamic> vehicle;

  const IssueViolationPage({super.key, required this.vehicle});

  @override
  _IssueViolationPageState createState() => _IssueViolationPageState();
}

class _IssueViolationPageState extends State<IssueViolationPage> {
  final _locationController = TextEditingController();
  final _notesController = TextEditingController();
  List<Map<String, dynamic>> _violationTypes = [];
  int? _selectedViolationType;
  bool _isLoading = false;
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _loadViolationTypes();
  }

  Future<void> _loadViolationTypes() async {
    setState(() => _isLoading = true);
    
    final result = await ApiService.getViolationTypes();
    
    setState(() {
      _isLoading = false;
      if (result['success']) {
        _violationTypes = List<Map<String, dynamic>>.from(result['data']);
      }
    });
  }

  Future<void> _issueViolation() async {
    if (_selectedViolationType == null || _locationController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Please select violation type and enter location'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    final officer = Provider.of<AuthProvider>(context, listen: false).officer;
    if (officer == null) return;

    setState(() => _isSubmitting = true);

    final result = await ApiService.issueViolation(
      vehicleId: int.parse(widget.vehicle['vehiclesID'].toString()),
      officerId: int.parse(officer['officerID'].toString()),
      violationTypeId: _selectedViolationType!,
      location: _locationController.text.trim(),
      notes: _notesController.text.trim(),
    );

    setState(() => _isSubmitting = false);

    if (result['success'] && mounted) {
      // Send notification
      if (mounted) {
        await NotificationService.showViolationIssued(
          widget.vehicle['license_plate'],
          result['violation_name'],
        );
      }
      
      // Navigate to payment page
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (context) => PaymentPage(
            violation: {
              'violationID': result['violation_id'],
              'ticket_number': result['ticket_number'],
              'violation_name': result['violation_name'],
              'fine_amount': result['final_fine'],
              'license_plate': widget.vehicle['license_plate'],
              'location': _locationController.text.trim(),
              'owner_email': widget.vehicle['owner_email'],
            },
          ),
        ),
      );
    } else if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(result['message'] ?? 'Failed to issue violation'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Issue Violation'),
        backgroundColor: Colors.red[700],
        foregroundColor: Colors.white,
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : Padding(
              padding: EdgeInsets.all(16),
              child: SingleChildScrollView(
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
                            'Vehicle Information',
                            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                          SizedBox(height: 8),
                          Text('License Plate: ${widget.vehicle['license_plate']}'),
                          Text('Owner: ${widget.vehicle['owner_name']}'),
                          Text('Type: ${widget.vehicle['vehicles_type']}'),
                        ],
                      ),
                    ),
                  ),
                  SizedBox(height: 16),
                  Card(
                    child: Padding(
                      padding: EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Violation Details',
                            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                          SizedBox(height: 16),
                          DropdownButtonFormField<int>(
                            decoration: InputDecoration(
                              labelText: 'Violation Type',
                              border: OutlineInputBorder(),
                            ),
                            value: _selectedViolationType,
                            items: _violationTypes.map((type) {
                              return DropdownMenuItem<int>(
                                value: int.parse(type['typeID'].toString()),
                                child: Text('${type['violation_name']} - MWK ${type['base_fine']}'),
                              );
                            }).toList(),
                            onChanged: (value) {
                              setState(() => _selectedViolationType = value);
                            },
                          ),
                          SizedBox(height: 16),
                          TextField(
                            controller: _locationController,
                            decoration: InputDecoration(
                              labelText: 'Location',
                              border: OutlineInputBorder(),
                              hintText: 'Enter violation location',
                            ),
                          ),
                          SizedBox(height: 16),
                          TextField(
                            controller: _notesController,
                            decoration: InputDecoration(
                              labelText: 'Notes (Optional)',
                              border: OutlineInputBorder(),
                              hintText: 'Additional notes',
                            ),
                            maxLines: 3,
                          ),
                          SizedBox(height: 24),
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton(
                              onPressed: _isSubmitting ? null : _issueViolation,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.red[700],
                                foregroundColor: Colors.white,
                                padding: EdgeInsets.symmetric(vertical: 16),
                              ),
                              child: _isSubmitting
                                  ? CircularProgressIndicator(color: Colors.white)
                                  : Text(
                                      'Issue Violation',
                                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
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
            ),
    );
  }
}