# Troubleshooting Guide - Payment Integration

## Common Issues and Solutions

### 1. Composer Install Fails

**Problem:** `composer install` command not found or fails

**Solutions:**
```bash
# Install Composer first
# Download from: https://getcomposer.org/download/

# Then run in project directory:
cd "Malawi Police Traffic Management"
composer install
```

**Alternative:** Download dependencies manually:
- Stripe PHP: https://github.com/stripe/stripe-php
- PHPMailer: https://github.com/PHPMailer/PHPMailer

---

### 2. Database Migration Errors

**Problem:** `ALTER TABLE` commands fail

**Error:** `Column 'owner_email' already exists`

**Solution:**
```sql
-- Check if column exists first
SHOW COLUMNS FROM vehicles LIKE 'owner_email';

-- If it exists, skip that ALTER statement
-- Or drop and recreate:
ALTER TABLE vehicles DROP COLUMN owner_email;
ALTER TABLE vehicles ADD COLUMN owner_email VARCHAR(100) AFTER owner_phone;
```

---

### 3. Stripe Payment Intent Creation Fails

**Problem:** Error: "No API key provided"

**Solutions:**

1. Check `.env` file exists in correct location:
   ```
   Malawi Police Traffic Management/.env
   ```

2. Verify env.php is loading correctly:
   ```php
   // Add to create-payment-intent.php for debugging
   var_dump(getenv('STRIPE_SECRET_KEY'));
   ```

3. Ensure API key format is correct:
   ```
   STRIPE_SECRET_KEY=sk_test_51ABC...xyz
   ```
   (No quotes, no spaces)

---

### 4. Email Not Sending

**Problem:** E-ticket email not received

**Solutions:**

**For Gmail:**
1. Enable 2-Factor Authentication
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use App Password in .env (not regular password)

**Check SMTP Settings:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_16_char_app_password
```

**Test Email Manually:**
```php
// Create test-email.php
<?php
require_once 'api/config/env.php';
require_once 'api/vendor/autoload.php';

$mail = new PHPMailer\PHPMailer\PHPMailer(true);
$mail->isSMTP();
$mail->Host = getenv('SMTP_HOST');
$mail->SMTPAuth = true;
$mail->Username = getenv('SMTP_USERNAME');
$mail->Password = getenv('SMTP_PASSWORD');
$mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
$mail->Port = getenv('SMTP_PORT');

$mail->setFrom(getenv('SMTP_FROM_EMAIL'));
$mail->addAddress('test@example.com');
$mail->Subject = 'Test Email';
$mail->Body = 'This is a test';

if ($mail->send()) {
    echo "Email sent successfully!";
} else {
    echo "Error: " . $mail->ErrorInfo;
}
?>
```

**Check Spam Folder:** E-tickets might be filtered as spam initially.

---

### 5. Flutter Stripe Package Errors

**Problem:** `flutter_stripe` package not found

**Solution:**
```bash
cd product_verification
flutter clean
flutter pub get
```

**Problem:** Stripe initialization error

**Solution:** Check main.dart has:
```dart
import 'package:flutter_stripe/flutter_stripe.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: ".env");
  
  Stripe.publishableKey = dotenv.env['STRIPE_PUBLISHABLE_KEY'] ?? '';
  
  runApp(MyApp());
}
```

---

### 6. Payment Sheet Not Appearing

**Problem:** "Pay Now" button does nothing

**Solutions:**

1. **Check API Response:**
   ```dart
   // Add debug print in payment_page.dart
   print('Payment Intent Result: $result');
   ```

2. **Verify client_secret format:**
   Should be: `pi_xxxxx_secret_xxxxx`

3. **Check Stripe Dashboard:**
   - Go to https://dashboard.stripe.com
   - Check "Payments" section
   - Verify payment intents are being created

4. **Android Permissions:**
   Ensure `AndroidManifest.xml` has:
   ```xml
   <uses-permission android:name="android.permission.INTERNET"/>
   ```

---

### 7. Payment Succeeds but Status Not Updated

**Problem:** Payment goes through but violation stays "pending"

**Solutions:**

1. **Check confirm-payment.php:**
   ```php
   // Add logging
   error_log("Payment Intent ID: " . $data['payment_intent_id']);
   error_log("Violation ID: " . $data['violation_id']);
   ```

2. **Verify Database Connection:**
   ```php
   // Test database connection
   try {
       $pdo = new PDO("mysql:host=localhost;dbname=malawi_police_traffic", "root", "");
       echo "Database connected!";
   } catch(PDOException $e) {
       echo "Connection failed: " . $e->getMessage();
   }
   ```

3. **Check Stripe Webhook (if using):**
   - Webhooks are optional for this implementation
   - We use direct API verification instead

---

### 8. CORS Errors in Browser

**Problem:** "Access-Control-Allow-Origin" error

**Solution:** Ensure all PHP files have CORS headers:
```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
```

---

### 9. Invalid Email Format Error

**Problem:** Email validation fails in Flutter

**Solution:** Check validation in vehicle_registration_page.dart:
```dart
validator: (value) {
  if (value?.isEmpty ?? true) return 'Email required';
  if (!value!.contains('@')) return 'Invalid email';
  if (!value.contains('.')) return 'Invalid email';
  return null;
}
```

---

### 10. Test Card Not Working

**Problem:** Test card 4242 4242 4242 4242 fails

**Solutions:**

1. **Verify Test Mode:**
   - Check you're using `sk_test_` and `pk_test_` keys
   - Not `sk_live_` and `pk_live_`

2. **Card Details:**
   - Card: 4242 4242 4242 4242
   - Expiry: Any future date (e.g., 12/25)
   - CVC: Any 3 digits (e.g., 123)
   - Postal: Any 5 digits (e.g., 12345)

3. **Check Stripe Dashboard:**
   - Switch to "Test mode" (toggle in top right)
   - Check for any errors in logs

---

### 11. App Crashes on Payment Page

**Problem:** App crashes when navigating to payment page

**Solutions:**

1. **Check violation data:**
   ```dart
   // Ensure all required fields are present
   violation: {
     'violationID': result['violation_id'],
     'ticket_number': result['ticket_number'],
     'violation_name': result['violation_name'],
     'fine_amount': result['final_fine'],
     'license_plate': widget.vehicle['license_plate'],
     'location': _locationController.text.trim(),
     'owner_email': widget.vehicle['owner_email'],
   }
   ```

2. **Check for null values:**
   ```dart
   // Add null checks
   Text(widget.violation['ticket_number'] ?? 'N/A')
   ```

3. **View Flutter logs:**
   ```bash
   flutter logs
   ```

---

### 12. Environment Variables Not Loading

**Problem:** `getenv()` returns null in PHP

**Solutions:**

1. **Check .env file location:**
   ```
   Malawi Police Traffic Management/.env
   ```
   (Not in api/ folder)

2. **Verify env.php path:**
   ```php
   $envFile = __DIR__ . '/../../.env';
   ```

3. **Test loading:**
   ```php
   require_once '../config/env.php';
   echo getenv('STRIPE_SECRET_KEY');
   ```

---

### 13. Vendor Directory Not Found

**Problem:** `require_once '../vendor/autoload.php'` fails

**Solution:**
```bash
cd "Malawi Police Traffic Management"
composer install
```

This creates the `vendor/` directory with all dependencies.

---

### 14. Payment Amount Incorrect

**Problem:** Stripe shows wrong amount

**Solution:** Stripe uses cents/smallest currency unit:
```php
// Correct:
'amount' => $violation['fine_amount'] * 100, // MWK 20000 = 2000000 cents

// Wrong:
'amount' => $violation['fine_amount'], // Would be MWK 200
```

---

### 15. Multiple Emails Sent

**Problem:** Duplicate e-tickets received

**Solution:** Check confirm-payment.php only calls sendETicket once:
```php
// Should only be called once per payment
if ($violation && $violation['owner_email']) {
    sendETicket($violation);
}
```

---

## Debugging Tips

### Enable PHP Error Logging
```php
// Add to top of PHP files
ini_set('display_errors', 1);
error_reporting(E_ALL);
```

### Enable Flutter Debug Mode
```bash
flutter run --debug
```

### Check Stripe Logs
- Dashboard → Developers → Logs
- Shows all API requests and responses

### Check Email Logs
```php
// In sendETicket function
$mail->SMTPDebug = 2; // Enable verbose debug output
```

### Database Query Logging
```php
// After PDO queries
echo $stmt->queryString;
print_r($stmt->errorInfo());
```

---

## Getting Help

1. **Stripe Documentation:** https://stripe.com/docs
2. **PHPMailer Documentation:** https://github.com/PHPMailer/PHPMailer
3. **Flutter Stripe Plugin:** https://pub.dev/packages/flutter_stripe

## Contact Support

For system-specific issues, contact your system administrator with:
- Error message (exact text)
- Steps to reproduce
- Screenshots if applicable
- Relevant log files
