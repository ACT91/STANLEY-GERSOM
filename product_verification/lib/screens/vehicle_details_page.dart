import 'package:flutter/material.dart';
import 'issue_violation_page.dart';

class VehicleDetailsPage extends StatelessWidget {
  final Map<String, dynamic> vehicle;
  final List<Map<String, dynamic>> todayViolations;

  const VehicleDetailsPage({
    super.key,
    required this.vehicle,
    required this.todayViolations,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Vehicle Details'),
        backgroundColor: Colors.blue[900],
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
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
                    Row(
                      children: [
                        Container(
                          padding: EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: Colors.blue[100],
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Icon(Icons.directions_car, color: Colors.blue[900], size: 24),
                        ),
                        SizedBox(width: 12),
                        Text(
                          'Vehicle Information',
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    SizedBox(height: 16),
                    _buildInfoRow('License Plate', vehicle['license_plate'], isHighlight: true),
                    _buildInfoRow('Owner Name', vehicle['owner_name']),
                    _buildInfoRow('Owner Phone', vehicle['owner_phone']),
                    _buildInfoRow('Vehicle Type', vehicle['vehicles_type']),
                    _buildInfoRow('Registration Date', vehicle['registration_date']),
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
                    Row(
                      children: [
                        Icon(
                          todayViolations.isNotEmpty ? Icons.warning : Icons.check_circle,
                          color: todayViolations.isNotEmpty ? Colors.red[700] : Colors.green[700],
                          size: 32,
                        ),
                        SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            todayViolations.isNotEmpty 
                                ? 'Today\'s Violations (${todayViolations.length})'
                                : 'No Violations Today',
                            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 16),
                    if (todayViolations.isNotEmpty) ...[
                      Container(
                        padding: EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.red[50],
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: Colors.red[300]!, width: 2),
                        ),
                        child: Column(
                          children: [
                            Row(
                              children: [
                                Icon(Icons.info, color: Colors.red[700]),
                                SizedBox(width: 8),
                                Expanded(
                                  child: Text(
                                    'This vehicle has ${todayViolations.length} violation(s) today',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      color: Colors.red[700],
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      SizedBox(height: 12),
                      ...todayViolations.map((violation) => Container(
                        margin: EdgeInsets.only(bottom: 8),
                        padding: EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.red[50],
                          border: Border.all(color: Colors.red[200]!),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              violation['violation_name'] ?? 'Unknown Violation',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: Colors.red[800],
                              ),
                            ),
                            SizedBox(height: 4),
                            Text(
                              'Fine: MWK ${violation['fine_amount']}',
                              style: TextStyle(color: Colors.grey[700]),
                            ),
                            Text(
                              'Time: ${violation['violation_date']}',
                              style: TextStyle(color: Colors.grey[700]),
                            ),
                            Text(
                              'Status: ${violation['status']?.toUpperCase()}',
                              style: TextStyle(
                                color: Colors.grey[700],
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      )),
                    ] else ...[
                      Container(
                        padding: EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.green[50],
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: Colors.green[300]!, width: 2),
                        ),
                        child: Row(
                          children: [
                            Icon(Icons.check_circle, color: Colors.green[700]),
                            SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                'This vehicle has no violations recorded today',
                                style: TextStyle(
                                  fontWeight: FontWeight.w500,
                                  color: Colors.green[700],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
            SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => IssueViolationPage(vehicle: vehicle),
                      ),
                    ),
                    icon: Icon(Icons.add_circle_outline),
                    label: Text(
                      todayViolations.isNotEmpty 
                          ? 'Record Additional Violation'
                          : 'Issue New Violation',
                      style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red[700],
                      foregroundColor: Colors.white,
                      padding: EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String? value, {bool isHighlight = false}) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 6),
      child: Container(
        padding: isHighlight ? EdgeInsets.all(8) : EdgeInsets.zero,
        decoration: isHighlight ? BoxDecoration(
          color: Colors.blue[50],
          borderRadius: BorderRadius.circular(6),
          border: Border.all(color: Colors.blue[200]!),
        ) : null,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(
              width: 120,
              child: Text(
                '$label:',
                style: TextStyle(
                  fontWeight: FontWeight.w500,
                  color: isHighlight ? Colors.blue[800] : null,
                ),
              ),
            ),
            Expanded(
              child: Text(
                value ?? 'N/A',
                style: TextStyle(
                  fontWeight: isHighlight ? FontWeight.bold : FontWeight.normal,
                  color: isHighlight ? Colors.blue[800] : null,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}