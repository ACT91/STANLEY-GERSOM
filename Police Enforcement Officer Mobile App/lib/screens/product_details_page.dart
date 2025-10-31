import 'package:flutter/material.dart';


class ProductDetailsPage extends StatelessWidget {
  final Map<String, dynamic> product;

  const ProductDetailsPage({super.key, required this.product});

  @override
  Widget build(BuildContext context) {
    final isVerified = product['is_verified'] == 1;
    
    return Scaffold(
      appBar: AppBar(
        title: Text('Product Details'),
        backgroundColor: isVerified ? Colors.green : Colors.red,
      ),
      body: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: double.infinity,
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isVerified ? Colors.green.shade100 : Colors.red.shade100,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(
                  color: isVerified ? Colors.green : Colors.red,
                  width: 2,
                ),
              ),
              child: Column(
                children: [
                  Icon(
                    isVerified ? Icons.verified : Icons.warning,
                    size: 48,
                    color: isVerified ? Colors.green : Colors.red,
                  ),
                  SizedBox(height: 8),
                  Text(
                    isVerified ? 'VERIFIED PRODUCT' : 'UNVERIFIED PRODUCT',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: isVerified ? Colors.green : Colors.red,
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(height: 24),
            _buildDetailRow('Product Name', product['name'] ?? 'Unknown'),
            _buildDetailRow('Brand', product['brand'] ?? 'Unknown'),
            _buildDetailRow('QR Code', product['qr_code'] ?? 'N/A'),
            _buildDetailRow('Description', product['description'] ?? 'No description'),
            SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => Navigator.pop(context),
                child: Text('Scan Another Product'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              '$label:',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
          Expanded(
            child: Text(value),
          ),
        ],
      ),
    );
  }
}

