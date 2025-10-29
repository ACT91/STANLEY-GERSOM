# Payment Integration Setup Guide

## Overview
This guide explains how to set up the Stripe payment integration and email notifications for the Malawi Police Traffic Management System.

## Backend Setup (PHP/API)

### 1. Install Dependencies
Navigate to the API directory and run:
```bash
cd "Malawi Police Traffic Management"
composer install
```

### 2. Configure Environment Variables
Edit `.env` file in `Malawi Police Traffic Management/.env`:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_actual_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_stripe_publishable_key

# Email Configuration (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_gmail_app_password
SMTP_FROM_EMAIL=noreply@malawipolice.gov.mw
SMTP_FROM_NAME=Malawi Police Traffic Management
```

**Note:** For Gmail, you need to:
1. Enable 2-factor authentication
2. Generate an App Password at: https://myaccount.google.com/apppasswords
3. Use the App Password (not your regular password)

### 3. Update Database
Run the migration SQL:
```sql
-- In phpMyAdmin or MySQL command line
source database/migration_add_email_payment.sql
```

Or manually run:
```sql
USE malawi_police_traffic;
ALTER TABLE vehicles ADD COLUMN owner_email VARCHAR(100) AFTER owner_phone;
ALTER TABLE violations ADD COLUMN payment_intent_id VARCHAR(100) NULL AFTER payment_method;
ALTER TABLE violations MODIFY COLUMN payment_method ENUM('cash', 'airtel_money', 'mpamba', 'bank', 'stripe') NULL;
```

## Flutter App Setup

### 1. Install Dependencies
Navigate to the Flutter project:
```bash
cd product_verification
flutter pub get
```

### 2. Configure Environment Variables
Edit `.env` file in `product_verification/.env`:

```env
API_BASE_URL=http://your_server_ip/malawi_police_traffic/api
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_stripe_publishable_key
```

### 3. Android Configuration (for Stripe)
Add to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.INTERNET"/>
```

### 4. iOS Configuration (for Stripe)
Add to `ios/Runner/Info.plist`:
```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

## Getting Stripe API Keys

### Test Mode (for development):
1. Go to https://dashboard.stripe.com/register
2. Create an account
3. Navigate to Developers > API keys
4. Copy the "Publishable key" (starts with `pk_test_`)
5. Copy the "Secret key" (starts with `sk_test_`)

### Live Mode (for production):
1. Complete Stripe account verification
2. Toggle to "Live mode" in dashboard
3. Use live keys (starts with `pk_live_` and `sk_live_`)

## Testing the Payment Flow

### 1. Test Card Numbers (Stripe Test Mode):
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires Authentication: `4000 0025 0000 3155`

Use any future expiry date, any 3-digit CVC, and any postal code.

### 2. Test Flow:
1. Register a vehicle with email address
2. Issue a violation
3. App navigates to payment page
4. Enter test card details
5. Complete payment
6. Check email for e-ticket

## Email Configuration Alternatives

### Using SendGrid (Alternative to Gmail):
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USERNAME=apikey
SMTP_PASSWORD=your_sendgrid_api_key
```

### Using Mailgun:
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USERNAME=your_mailgun_username
SMTP_PASSWORD=your_mailgun_password
```

## Troubleshooting

### Payment not processing:
- Check Stripe API keys are correct
- Verify internet connection
- Check Stripe dashboard for errors

### Email not sending:
- Verify SMTP credentials
- Check spam folder
- Enable "Less secure app access" for Gmail (or use App Password)
- Check PHP error logs

### Database errors:
- Ensure migration was run successfully
- Check database connection in PHP files
- Verify table structure matches schema

## Security Notes

1. **Never commit .env files to version control**
2. Use test keys for development
3. Switch to live keys only in production
4. Keep API keys secure
5. Use HTTPS in production
6. Validate all inputs on backend

## Support

For Stripe documentation: https://stripe.com/docs
For PHPMailer documentation: https://github.com/PHPMailer/PHPMailer
