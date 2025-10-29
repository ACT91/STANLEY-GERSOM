# Police Officer Quick Guide - Payment Flow

## New Vehicle Registration Process

When registering a new vehicle, you must now collect:

1. ✅ Owner Name
2. ✅ Owner Phone Number
3. ✅ **Owner Email Address** (NEW - Required for e-ticket)
4. ✅ Vehicle Type

**Important:** The email address is required to send the electronic ticket after payment.

## Issuing Violation - New Flow

### Step 1: Issue Violation (Same as before)
1. Scan or enter license plate
2. Select violation type
3. Enter location
4. Add notes (optional)
5. Click "Issue Violation"

### Step 2: Payment (NEW)
After issuing the violation, the app will automatically take you to the **Payment Page**.

**On the Payment Page:**
- Shows violation details
- Displays fine amount
- Has "Pay Now" button

### Step 3: Process Payment
1. Click "Pay Now"
2. Stripe payment form appears
3. Driver enters their card details:
   - Card number
   - Expiry date
   - CVC code
   - Postal code
4. Click "Pay" on the payment form

### Step 4: Confirmation
- Payment processes immediately
- Success message appears
- E-ticket is automatically sent to owner's email
- You can proceed to next task

## What the Driver Receives

The vehicle owner will receive an email containing:
- Ticket number
- Violation details
- Payment confirmation
- Officer information
- Date and location
- Official e-ticket for their records

## Important Notes

📧 **Email is Mandatory:** Always collect a valid email address during vehicle registration.

💳 **Accepted Cards:** Visa, Mastercard, and other major cards via Stripe.

⚡ **Instant Processing:** Payment is processed immediately, no waiting.

📱 **No Cash Handling:** All payments are digital, reducing cash handling risks.

✉️ **Automatic Receipt:** Driver receives e-ticket automatically, no manual receipt needed.

## Troubleshooting

**Problem:** Payment fails
- **Solution:** Ask driver to check card details and try again

**Problem:** Email not received
- **Solution:** Check spam folder, verify email address was entered correctly

**Problem:** No internet connection
- **Solution:** Payment requires internet. Move to area with signal.

## For Supervisors

All payments are tracked in the system with:
- Payment Intent ID (Stripe reference)
- Payment date and time
- Amount paid
- Violation status automatically updated to "PAID"

Access the admin dashboard to view all payment records and generate reports.
