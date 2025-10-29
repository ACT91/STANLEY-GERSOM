# Payment Integration Setup Guide

## Overview
This guide covers the setup of Stripe payment integration and email notifications for the Malawi Police Traffic Management System.

## Features Added
- ✅ Email field in vehicle registration
- ✅ Stripe payment processing for violations
- ✅ Automatic email notifications for violations
- ✅ Email receipts for payments
- ✅ Payment tracking in database

## Database Setup

### For New Installations
Run the updated `database/schema.sql` file which includes:
- `owner_email` field in vehicles table
- `payment_intent_id` and `email_sent` fields in violations table
- Updated payment methods to include 'stripe'

### For Existing Installations
Run the migration script:
```sql
-- Run this in phpMyAdmin or MySQL command line
source database/add_email_migration.sql
```

## Environment Configuration

Update your `.env` file with the following variables:

```env
# API Base URL
VITE_API_BASE_URL=http://localhost/malawi_police_traffic/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM_EMAIL=noreply@police.gov.mw
SMTP_FROM_NAME=Malawi Police Traffic Management
```

## Stripe Setup

1. **Create Stripe Account**
   - Go to https://stripe.com and create an account
   - Complete account verification

2. **Get API Keys**
   - Navigate to Developers > API Keys
   - Copy the Publishable Key and Secret Key
   - For testing, use test keys (pk_test_... and sk_test_...)

3. **Update Environment Variables**
   - Replace the placeholder keys in `.env` with your actual Stripe keys

## Email Setup

### Gmail Configuration
1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security > 2-Step Verification > App passwords
   - Generate password for "Mail"
3. **Update .env file** with your Gmail credentials

### Alternative SMTP Providers
You can use other SMTP providers by updating the SMTP configuration in `.env`:
- **SendGrid**: smtp.sendgrid.net (Port 587)
- **Mailgun**: smtp.mailgun.org (Port 587)
- **AWS SES**: email-smtp.region.amazonaws.com (Port 587)

## Frontend Dependencies

Install Stripe React components:
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

## PHP Dependencies

Install Stripe PHP SDK:
```bash
composer require stripe/stripe-php
```

## Testing the Integration

### Test Payment Flow
1. **Issue a Violation** through the mobile app
2. **Navigate to Violations** in the admin dashboard
3. **Click "Pay"** button for a pending violation
4. **Use Test Card Numbers**:
   - Success: 4242 4242 4242 4242
   - Decline: 4000 0000 0000 0002
   - Any future expiry date and CVC

### Test Email Notifications
1. **Ensure email configuration** is correct in `.env`
2. **Issue a violation** to a vehicle with valid email
3. **Check email inbox** for violation notice
4. **Complete payment** and check for receipt email

## File Structure

```
api/
├── payments/
│   ├── create-payment-intent.php
│   └── confirm-payment.php
├── utils/
│   └── email-service.php
├── config/
│   └── env.php
└── violations/
    └── issue.php (updated)

src/pages/
└── PaymentPage.tsx

database/
├── schema.sql (updated)
└── add_email_migration.sql
```

## Security Considerations

1. **Never expose Secret Keys** in frontend code
2. **Use HTTPS** in production
3. **Validate all inputs** on server side
4. **Store sensitive data** securely
5. **Use environment variables** for all credentials

## Troubleshooting

### Payment Issues
- Check Stripe dashboard for failed payments
- Verify API keys are correct
- Ensure webhook endpoints are configured (if using webhooks)

### Email Issues
- Verify SMTP credentials
- Check spam/junk folders
- Test with different email providers
- Enable less secure apps (if using Gmail without app password)

### Database Issues
- Run migration script for existing databases
- Check column names match the updated schema
- Verify foreign key constraints

## Production Deployment

1. **Replace test keys** with live Stripe keys
2. **Configure production SMTP** settings
3. **Enable HTTPS** for secure payment processing
4. **Set up proper error logging**
5. **Configure email delivery** monitoring

## Support

For issues with:
- **Stripe Integration**: Check Stripe documentation
- **Email Delivery**: Verify SMTP provider settings
- **Database**: Run migration scripts and check logs