import 'package:flutter_local_notifications/flutter_local_notifications.dart';

class NotificationService {
  static final FlutterLocalNotificationsPlugin _notifications = FlutterLocalNotificationsPlugin();

  static Future<void> initialize() async {
    const androidSettings = AndroidInitializationSettings('@mipmap/ic_launcher');
    const initSettings = InitializationSettings(android: androidSettings);
    await _notifications.initialize(initSettings);
  }

  static Future<void> showViolationIssued(String licensePlate, String violationType) async {
    const androidDetails = AndroidNotificationDetails(
      'violations',
      'Traffic Violations',
      channelDescription: 'Notifications for issued traffic violations',
      importance: Importance.high,
      priority: Priority.high,
    );
    const details = NotificationDetails(android: androidDetails);

    await _notifications.show(
      DateTime.now().millisecondsSinceEpoch.remainder(100000),
      'Violation Issued',
      'Issued $violationType to $licensePlate',
      details,
    );
  }

  static Future<void> showVehicleRegistered(String licensePlate) async {
    const androidDetails = AndroidNotificationDetails(
      'registrations',
      'Vehicle Registrations',
      channelDescription: 'Notifications for vehicle registrations',
      importance: Importance.defaultImportance,
    );
    const details = NotificationDetails(android: androidDetails);

    await _notifications.show(
      DateTime.now().millisecondsSinceEpoch.remainder(100000),
      'Vehicle Registered',
      'Successfully registered $licensePlate',
      details,
    );
  }
}