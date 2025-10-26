import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';
import '../providers/auth_provider.dart';

class ViolationsPage extends StatefulWidget {
  const ViolationsPage({super.key});

  @override
  _ViolationsPageState createState() => _ViolationsPageState();
}

class _ViolationsPageState extends State<ViolationsPage> {
  List<Map<String, dynamic>> _violations = [];
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _loadViolations();
  }

  Future<void> _loadViolations() async {
    final officer = Provider.of<AuthProvider>(context, listen: false).officer;
    if (officer == null) return;

    setState(() => _isLoading = true);

    final result = await ApiService.getOfficerActivities(
      int.parse(officer['officerID'].toString()),
    );

    setState(() {
      _isLoading = false;
      if (result['success']) {
        _violations = List<Map<String, dynamic>>.from(result['data']);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('My Activities'),
        backgroundColor: Colors.blue[900],
        foregroundColor: Colors.white,
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : _violations.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.receipt_long, size: 64, color: Colors.grey),
                      SizedBox(height: 16),
                      Text(
                        'No activities recorded yet',
                        style: TextStyle(fontSize: 18, color: Colors.grey[600]),
                      ),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _loadViolations,
                  child: ListView.builder(
                    padding: EdgeInsets.all(16),
                    itemCount: _violations.length,
                    itemBuilder: (context, index) {
                      final violation = _violations[index];
                      return Card(
                        margin: EdgeInsets.only(bottom: 12),
                        child: Padding(
                          padding: EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    violation['ticket_number'] ?? 'N/A',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  Container(
                                    padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: _getStatusColor(violation['status']),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Text(
                                      violation['status']?.toUpperCase() ?? 'UNKNOWN',
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 12,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              SizedBox(height: 8),
                              Text('Vehicle: ${violation['license_plate'] ?? 'N/A'}'),
                              Text('Owner: ${violation['owner_name'] ?? 'N/A'}'),
                              Text('Violation: ${violation['violation_name'] ?? 'N/A'}'),
                              Text('Location: ${violation['location'] ?? 'N/A'}'),
                              Text('Fine: MWK ${violation['fine_amount'] ?? '0'}'),
                              Text('Date: ${violation['violation_date'] ?? 'N/A'}'),
                              if (violation['notes'] != null && violation['notes'].isNotEmpty)
                                Text('Notes: ${violation['notes']}'),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
    );
  }

  Color _getStatusColor(String? status) {
    switch (status?.toLowerCase()) {
      case 'pending':
        return Colors.blue[600]!;
      case 'paid':
        return Colors.green;
      case 'overdue':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }
}