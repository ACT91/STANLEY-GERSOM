import 'package:flutter/material.dart';
import 'package:flutter_stripe/flutter_stripe.dart' as stripe;
import '../services/api_service.dart';

class PaymentPage extends StatefulWidget {
  final Map<String, dynamic> violation;

  const PaymentPage({super.key, required this.violation});

  @override
  _PaymentPageState createState() => _PaymentPageState();
}

class _PaymentPageState extends State<PaymentPage> {
  bool _isProcessing = false;

  Future<void> _processPayment() async {
    setState(() => _isProcessing = true);

    try {
      // Create payment intent
      print('Creating payment intent for violation: ${widget.violation['violationID']}');
      final result = await ApiService.createPaymentIntent(
        int.parse(widget.violation['violationID'].toString()),
      );

      print('Payment intent result: $result');

      if (!result['success']) {
        _showError(result['message'] ?? 'Failed to create payment');
        setState(() => _isProcessing = false);
        return;
      }

      if (result['client_secret'] == null) {
        _showError('No payment secret received');
        setState(() => _isProcessing = false);
        return;
      }

      print('Client secret received: ${result['client_secret']}');

      // Initialize payment sheet
      await stripe.Stripe.instance.initPaymentSheet(
        paymentSheetParameters: stripe.SetupPaymentSheetParameters(
          merchantDisplayName: 'Malawi Police Traffic Management',
          paymentIntentClientSecret: result['client_secret'],
          style: ThemeMode.light,
        ),
      );

      // Present payment sheet
      await stripe.Stripe.instance.presentPaymentSheet();

      // Confirm payment on backend
      final confirmResult = await ApiService.confirmPayment(
        int.parse(widget.violation['violationID'].toString()),
        result['client_secret'].split('_secret_')[0],
      );

      if (confirmResult['success'] && mounted) {
        _showSuccess();
      } else {
        _showError(confirmResult['message'] ?? 'Payment confirmation failed');
      }
    } on stripe.StripeException catch (e) {
      _showError(e.error.message ?? 'Payment cancelled');
    } catch (e) {
      _showError('Payment error: $e');
    }

    setState(() => _isProcessing = false);
  }

  void _showSuccess() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        title: Row(
          children: [
            Icon(Icons.check_circle, color: Colors.green, size: 32),
            SizedBox(width: 8),
            Text('Payment Successful'),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Your payment has been processed successfully.'),
            SizedBox(height: 16),
            Text('An e-ticket has been sent to your email address.'),
            SizedBox(height: 8),
            Text(
              widget.violation['owner_email'] ?? '',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              Navigator.of(context).pop();
              Navigator.of(context).pop();
            },
            child: Text('Done'),
          ),
        ],
      ),
    );
  }

  void _showError(String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Payment'),
        backgroundColor: Colors.blue[900],
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
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
                    Divider(),
                    _buildDetailRow('Ticket Number', widget.violation['ticket_number']),
                    _buildDetailRow('Vehicle', widget.violation['license_plate']),
                    _buildDetailRow('Violation', widget.violation['violation_name']),
                    _buildDetailRow('Location', widget.violation['location']),
                    SizedBox(height: 16),
                    Container(
                      width: double.infinity,
                      padding: EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.blue[50],
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Column(
                        children: [
                          Text(
                            'Amount to Pay',
                            style: TextStyle(fontSize: 14, color: Colors.grey[700]),
                          ),
                          SizedBox(height: 4),
                          Text(
                            'MWK ${widget.violation['fine_amount']}',
                            style: TextStyle(
                              fontSize: 32,
                              fontWeight: FontWeight.bold,
                              color: Colors.blue[900],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            SizedBox(height: 24),
            Card(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  children: [
                    Icon(Icons.credit_card, size: 48, color: Colors.blue[600]),
                    SizedBox(height: 8),
                    Text(
                      'Pay with Card',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
                    ),
                    SizedBox(height: 4),
                    Text(
                      'Secure payment via Stripe',
                      style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                    ),
                  ],
                ),
              ),
            ),
            Spacer(),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _isProcessing ? null : _processPayment,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue[600],
                  foregroundColor: Colors.white,
                  padding: EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: _isProcessing
                    ? CircularProgressIndicator(color: Colors.white)
                    : Text(
                        'Pay Now',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(color: Colors.grey[700])),
          Text(value, style: TextStyle(fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }
}
