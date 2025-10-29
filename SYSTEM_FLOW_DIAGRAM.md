# System Flow Diagram - Payment Integration

## Overall Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────┐
│  Flutter App    │ ◄─────► │   PHP API        │ ◄─────► │   MySQL     │
│  (Mobile)       │         │   (Backend)      │         │  Database   │
└─────────────────┘         └──────────────────┘         └─────────────┘
        │                            │
        │                            │
        ▼                            ▼
┌─────────────────┐         ┌──────────────────┐
│  Stripe SDK     │ ◄─────► │  Stripe API      │
│  (Payment UI)   │         │  (Payment)       │
└─────────────────┘         └──────────────────┘
                                     │
                                     ▼
                            ┌──────────────────┐
                            │  PHPMailer       │
                            │  (Email)         │
                            └──────────────────┘
                                     │
                                     ▼
                            ┌──────────────────┐
                            │  Vehicle Owner   │
                            │  Email           │
                            └──────────────────┘
```

## Detailed Flow: Vehicle Registration with Email

```
┌──────────────┐
│ Officer      │
│ Scans Plate  │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ Vehicle Not Found?   │
└──────┬───────────────┘
       │ YES
       ▼
┌──────────────────────┐
│ Registration Form    │
│ - Owner Name         │
│ - Owner Phone        │
│ - Owner Email ✨NEW  │
│ - Vehicle Type       │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ POST to API          │
│ /get-or-create-      │
│ vehicle.php          │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Save to Database     │
│ vehicles table       │
│ (includes email)     │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Navigate to          │
│ Issue Violation Page │
└──────────────────────┘
```

## Detailed Flow: Issue Violation & Payment

```
┌──────────────────────┐
│ Officer Selects      │
│ Violation Type       │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Enter Location       │
│ & Notes              │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Click "Issue         │
│ Violation"           │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ POST to API          │
│ /violations/         │
│ issue.php            │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Save Violation       │
│ Status: PENDING      │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Auto Navigate to     │
│ PAYMENT PAGE ✨NEW   │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────────────────────────────┐
│           PAYMENT PAGE                       │
│                                              │
│  ┌────────────────────────────────────┐    │
│  │ Violation Details                  │    │
│  │ - Ticket Number: TK001234          │    │
│  │ - Vehicle: BL 1234 A               │    │
│  │ - Violation: Speeding              │    │
│  │ - Amount: MWK 20,000               │    │
│  └────────────────────────────────────┘    │
│                                              │
│  ┌────────────────────────────────────┐    │
│  │         [Pay Now Button]           │    │
│  └────────────────────────────────────┘    │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────┐
│ Create Payment       │
│ Intent               │
│ POST /payments/      │
│ create-payment-      │
│ intent.php           │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Stripe API           │
│ Creates Payment      │
│ Intent               │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Return client_secret │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────────────────────────────┐
│      STRIPE PAYMENT SHEET                    │
│                                              │
│  ┌────────────────────────────────────┐    │
│  │ Card Number: [____-____-____-____] │    │
│  │ Expiry: [MM/YY]  CVC: [___]        │    │
│  │ Postal Code: [_____]               │    │
│  └────────────────────────────────────┘    │
│                                              │
│  ┌────────────────────────────────────┐    │
│  │            [Pay Button]            │    │
│  └────────────────────────────────────┘    │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────┐
│ Stripe Processes     │
│ Payment              │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Payment Success?     │
└──────┬───────────────┘
       │ YES
       ▼
┌──────────────────────┐
│ Confirm Payment      │
│ POST /payments/      │
│ confirm-payment.php  │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Verify with Stripe   │
│ API                  │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Update Database      │
│ Status: PAID         │
│ Payment Date: NOW    │
│ Method: stripe       │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Send E-Ticket        │
│ via PHPMailer        │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────────────────────────────┐
│           EMAIL TO OWNER                     │
│                                              │
│  Subject: Traffic Violation E-Ticket        │
│                                              │
│  Ticket Number: TK001234                     │
│  Status: PAID ✅                             │
│  Vehicle: BL 1234 A                          │
│  Violation: Speeding                         │
│  Fine: MWK 20,000                            │
│  Location: Blantyre-Lilongwe Road            │
│  Date: 2024-01-15 10:30                      │
│  Payment Date: 2024-01-15 10:35              │
│  Officer: James Mwale (MP001)                │
│                                              │
│  Keep this e-ticket for your records.        │
└──────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────┐
│ Show Success Dialog  │
│ in Flutter App       │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Return to Home       │
│ Ready for Next Task  │
└──────────────────────┘
```

## Database Schema Changes

```
┌─────────────────────────────────────────┐
│           VEHICLES TABLE                │
├─────────────────────────────────────────┤
│ vehiclesID (PK)                         │
│ license_plate                           │
│ owner_name                              │
│ owner_phone                             │
│ owner_email ✨NEW                       │
│ vehicles_type                           │
│ registration_date                       │
│ created_at                              │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         VIOLATIONS TABLE                │
├─────────────────────────────────────────┤
│ violationID (PK)                        │
│ ticket_number                           │
│ vehicle_id (FK)                         │
│ officer_id (FK)                         │
│ violation_type_id (FK)                  │
│ fine_amount                             │
│ violation_date                          │
│ location                                │
│ notes                                   │
│ status (pending/paid/disputed)          │
│ payment_date                            │
│ payment_method (includes 'stripe' ✨)   │
│ payment_intent_id ✨NEW                 │
│ dispute_reason                          │
│ resolved_by (FK)                        │
└─────────────────────────────────────────┘
```

## API Endpoints

```
┌────────────────────────────────────────────────────┐
│ POST /api/get-or-create-vehicle.php               │
│ Input: license_plate, owner_name, owner_phone,    │
│        owner_email ✨, vehicles_type              │
│ Output: vehicle object with email                 │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│ POST /api/violations/issue.php                    │
│ Input: vehicle_id, officer_id, violation_type_id, │
│        location, notes                            │
│ Output: violation object with violation_id        │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│ POST /api/payments/create-payment-intent.php ✨   │
│ Input: violation_id                               │
│ Output: client_secret, violation details          │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│ POST /api/payments/confirm-payment.php ✨         │
│ Input: violation_id, payment_intent_id            │
│ Output: success, sends email                      │
└────────────────────────────────────────────────────┘
```

## Environment Variables

```
┌─────────────────────────────────────────┐
│     Backend .env (PHP)                  │
├─────────────────────────────────────────┤
│ STRIPE_SECRET_KEY=sk_test_...          │
│ STRIPE_PUBLISHABLE_KEY=pk_test_...     │
│ SMTP_HOST=smtp.gmail.com               │
│ SMTP_PORT=587                           │
│ SMTP_USERNAME=email@gmail.com          │
│ SMTP_PASSWORD=app_password             │
│ SMTP_FROM_EMAIL=noreply@police.gov.mw  │
│ SMTP_FROM_NAME=Malawi Police           │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│     Frontend .env (Flutter)             │
├─────────────────────────────────────────┤
│ API_BASE_URL=http://server/api         │
│ STRIPE_PUBLISHABLE_KEY=pk_test_...     │
└─────────────────────────────────────────┘
```

## Key Features

✨ **New Features Added:**
1. Email collection during vehicle registration
2. Automatic navigation to payment page after violation
3. Stripe payment integration with card processing
4. Automatic e-ticket email delivery
5. Payment tracking in database
6. Secure payment verification

🔒 **Security Features:**
1. API keys in .env files (not in code)
2. Server-side payment verification
3. Stripe PCI compliance
4. Secure SMTP email delivery
5. Payment intent validation

📧 **Email Features:**
1. HTML formatted e-ticket
2. Complete violation details
3. Payment confirmation
4. Officer information
5. Automatic delivery
