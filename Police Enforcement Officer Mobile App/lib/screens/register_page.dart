import 'package:flutter/material.dart';
import '../services/api_service.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  _RegisterPageState createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final _serviceNumberController = TextEditingController();
  final _nameController = TextEditingController();
  final _stationController = TextEditingController();
  final _pinController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  String _selectedRank = '';
  bool _isLoading = false;
  String _error = '';
  bool _success = false;

  final List<String> _ranks = ['Constable', 'Corporal', 'Sergeant', 'Inspector'];

  Future<void> _register() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
      _error = '';
    });

    try {
      final result = await ApiService.registerOfficer(
        serviceNumber: _serviceNumberController.text.trim(),
        fullName: _nameController.text.trim(),
        rank: _selectedRank,
        station: _stationController.text.trim(),
        pin: _pinController.text,
      );

      if (mounted) {
        setState(() => _isLoading = false);
        
        if (result['success']) {
          setState(() => _success = true);
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
    if (_success) {
      return Scaffold(
        backgroundColor: Colors.green[50],
        body: SafeArea(
          child: Padding(
            padding: EdgeInsets.symmetric(horizontal: 24, vertical: 48),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 64,
                  height: 64,
                  decoration: BoxDecoration(
                    color: Colors.green[600],
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    Icons.check,
                    size: 32,
                    color: Colors.white,
                  ),
                ),
                SizedBox(height: 16),
                Text(
                  'Registration Successful!',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.grey[900],
                  ),
                ),
                SizedBox(height: 16),
                Text(
                  'Your account has been created. Please wait for admin approval before you can login.',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.grey[600],
                  ),
                ),
                SizedBox(height: 32),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () => Navigator.pop(context),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue[600],
                      foregroundColor: Colors.white,
                      padding: EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: Text(
                      'Go to Login',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: Colors.blue[50],
      body: SafeArea(
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: 24, vertical: 48),
          child: SingleChildScrollView(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 64,
                  height: 64,
                  decoration: BoxDecoration(
                    color: Colors.blue[600],
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    Icons.edit,
                    size: 32,
                    color: Colors.white,
                  ),
                ),
                SizedBox(height: 16),
                Text(
                  'Officer Registration',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.grey[900],
                  ),
                ),
                SizedBox(height: 8),
                Text(
                  'Create your account',
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.grey[600],
                  ),
                ),
                SizedBox(height: 32),
                Form(
                  key: _formKey,
                  child: Column(
                    children: [
                      _buildFormField(
                        'Service Number',
                        _serviceNumberController,
                        'e.g., MP001',
                        (value) => value?.isEmpty ?? true ? 'Service number required' : null,
                      ),
                      SizedBox(height: 16),
                      _buildFormField(
                        'Full Name',
                        _nameController,
                        'Enter your full name',
                        (value) => value?.isEmpty ?? true ? 'Full name required' : null,
                      ),
                      SizedBox(height: 16),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Rank',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                              color: Colors.grey[700],
                            ),
                          ),
                          SizedBox(height: 8),
                          DropdownButtonFormField<String>(
                            value: _selectedRank.isEmpty ? null : _selectedRank,
                            decoration: InputDecoration(
                              hintText: 'Select Rank',
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
                                borderSide: BorderSide(color: Colors.grey[300]!),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
                                borderSide: BorderSide(color: Colors.blue[500]!, width: 2),
                              ),
                              contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                            ),
                            items: _ranks.map((rank) => DropdownMenuItem(
                              value: rank,
                              child: Text(rank),
                            )).toList(),
                            onChanged: (value) => setState(() => _selectedRank = value!),
                            validator: (value) => value == null ? 'Rank required' : null,
                          ),
                        ],
                      ),
                      SizedBox(height: 16),
                      _buildFormField(
                        'Station',
                        _stationController,
                        'e.g., Blantyre Central',
                        (value) => value?.isEmpty ?? true ? 'Station required' : null,
                      ),
                      SizedBox(height: 16),
                      _buildFormField(
                        'PIN (4-6 digits)',
                        _pinController,
                        'Create a PIN',
                        (value) {
                          if (value?.isEmpty ?? true) return 'PIN required';
                          if (value!.length < 4 || value.length > 6) return 'PIN must be 4-6 digits';
                          return null;
                        },
                        obscureText: true,
                        keyboardType: TextInputType.number,
                        maxLength: 6,
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
                          onPressed: _isLoading ? null : _register,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.blue[600],
                            foregroundColor: Colors.white,
                            padding: EdgeInsets.symmetric(vertical: 12),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                            disabledBackgroundColor: Colors.blue[600]?.withValues(alpha: 0.5),
                          ),
                          child: _isLoading
                              ? CircularProgressIndicator(color: Colors.white, strokeWidth: 2)
                              : Text(
                                  'Register',
                                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
                                ),
                        ),
                      ),
                    ],
                  ),
                ),
                SizedBox(height: 24),
                Text(
                  "Already have an account? ",
                  style: TextStyle(color: Colors.grey[600]),
                ),
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: Text(
                    'Sign in here',
                    style: TextStyle(
                      color: Colors.blue[600],
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFormField(
    String label,
    TextEditingController controller,
    String hint,
    String? Function(String?) validator, {
    bool obscureText = false,
    TextInputType? keyboardType,
    int? maxLength,
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
              borderSide: BorderSide(color: Colors.grey[300]!),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(color: Colors.blue[500]!, width: 2),
            ),
            contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            counterText: '',
          ),
          obscureText: obscureText,
          keyboardType: keyboardType,
          maxLength: maxLength,
          validator: validator,
        ),
      ],
    );
  }
}