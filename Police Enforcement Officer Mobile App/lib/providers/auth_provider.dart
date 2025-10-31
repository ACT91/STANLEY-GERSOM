import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class AuthProvider with ChangeNotifier {
  Map<String, dynamic>? _officer;
  bool _isLoggedIn = false;

  Map<String, dynamic>? get officer => _officer;
  bool get isLoggedIn => _isLoggedIn;

  Future<void> saveOfficerSession(Map<String, dynamic> officer) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('officer', jsonEncode(officer));
    await prefs.setBool('isLoggedIn', true);
    
    _officer = officer;
    _isLoggedIn = true;
    notifyListeners();
  }

  Future<void> loadUserSession() async {
    final prefs = await SharedPreferences.getInstance();
    final isLoggedIn = prefs.getBool('isLoggedIn') ?? false;
    
    if (isLoggedIn) {
      final officerJson = prefs.getString('officer');
      if (officerJson != null) {
        _officer = jsonDecode(officerJson);
        _isLoggedIn = true;
        notifyListeners();
      }
    }
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    
    _officer = null;
    _isLoggedIn = false;
    notifyListeners();
  }
}