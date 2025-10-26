import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import 'login_page.dart';
import 'license_plate_scanner_page.dart';
import 'violations_page.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Police Enforcement'),
        backgroundColor: Colors.blue[900],
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.logout),
            onPressed: () async {
              final navigator = Navigator.of(context);
              await Provider.of<AuthProvider>(context, listen: false).logout();
              if (mounted) {
                navigator.pushReplacement(
                  MaterialPageRoute(builder: (context) => LoginPage()),
                );
              }
            },
          ),
        ],
      ),
      body: Consumer<AuthProvider>(
        builder: (context, authProvider, child) {
          final officer = authProvider.officer;
          return Padding(
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
                            Icon(Icons.local_police, color: Colors.blue[900], size: 32),
                            SizedBox(width: 12),
                            Text(
                              'Officer Information',
                              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                        SizedBox(height: 12),
                        if (officer != null) ...[
                          Text('Name: ${officer['fullName'] ?? 'N/A'}'),
                          Text('Service Number: ${officer['serviceNumber'] ?? 'N/A'}'),
                          Text('Rank: ${officer['rank'] ?? 'N/A'}'),
                          Text('Station: ${officer['station'] ?? 'N/A'}'),
                        ],
                      ],
                    ),
                  ),
                ),
                SizedBox(height: 24),
                Text(
                  'Quick Actions',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                SizedBox(height: 16),
                GridView.count(
                  shrinkWrap: true,
                  crossAxisCount: 2,
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                  children: [
                    _buildActionCard(
                      context,
                      'Scan License Plate',
                      Icons.camera_alt,
                      Colors.blue,
                      () => Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => LicensePlateScannerPage()),
                      ),
                    ),
                    _buildActionCard(
                      context,
                      'My Activities',
                      Icons.history,
                      Colors.orange,
                      () => Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => ViolationsPage()),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildActionCard(
    BuildContext context,
    String title,
    IconData icon,
    Color color,
    VoidCallback onTap,
  ) {
    return Card(
      elevation: 4,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(8),
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 48, color: color),
              SizedBox(height: 12),
              Text(
                title,
                textAlign: TextAlign.center,
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
