class Product {
  final int id;
  final String name;
  final String brand;
  final String qrCode;
  final bool isVerified;
  final String description;
  final String imageUrl;

  Product({
    required this.id,
    required this.name,
    required this.brand,
    required this.qrCode,
    required this.isVerified,
    required this.description,
    required this.imageUrl,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'],
      name: json['name'],
      brand: json['brand'],
      qrCode: json['qr_code'],
      isVerified: json['is_verified'] == 1,
      description: json['description'] ?? '',
      imageUrl: json['image_url'] ?? '',
    );
  }
}