# Testing Checklist - Payment Integration

## Pre-Testing Setup

- [ ] Composer dependencies installed (`composer install`)
- [ ] Flutter dependencies installed (`flutter pub get`)
- [ ] Database migration executed
- [ ] Backend .env configured with Stripe test keys
- [ ] Backend .env configured with SMTP credentials
- [ ] Flutter .env configured with Stripe publishable key
- [ ] API server running (XAMPP/WAMP)
- [ ] Flutter app compiled and running

## Database Tests

- [ ] Vehicles table has `owner_email` column
- [ ] Violations table has `payment_intent_id` column
- [ ] Violations table `payment_method` enum includes 'stripe'
- [ ] Can insert vehicle with email address
- [ ] Can query vehicle with email address

## Backend API Tests

### Vehicle Registration
- [ ] POST to `get-or-create-vehicle.php` with email works
- [ ] Email is stored in database
- [ ] Response includes email in vehicle object

### Payment Intent Creation
- [ ] POST to `create-payment-intent.php` returns client_secret
- [ ] Violation details are retrieved correctly
- [ ] Owner email is included in response
- [ ] Payment intent created in Stripe dashboard

### Payment Confirmation
- [ ] POST to `confirm-payment.php` updates violation status
- [ ] Payment method set to 'stripe'
- [ ] Payment date recorded
- [ ] Email sending function executes

## Flutter App Tests

### Vehicle Registration Screen
- [ ] Email field appears in form
- [ ] Email validation works (requires @ symbol)
- [ ] Email is required (shows error if empty)
- [ ] Email is sent to API on registration
- [ ] Registration succeeds with email

### Issue Violation Screen
- [ ] Can issue violation as before
- [ ] After issuing, navigates to Payment Page
- [ ] Violation data passed correctly

### Payment Page
- [ ] Displays violation details correctly
- [ ] Shows correct fine amount
- [ ] "Pay Now" button visible
- [ ] Stripe payment sheet opens on click

## Payment Flow Tests

### Successful Payment
- [ ] Use test card: 4242 4242 4242 4242
- [ ] Payment processes successfully
- [ ] Success dialog appears
- [ ] Email address shown in success message
- [ ] Returns to home screen

### Failed Payment
- [ ] Use decline card: 4000 0000 0000 0002
- [ ] Error message appears
- [ ] Can retry payment
- [ ] Violation remains in pending status

### Authentication Required
- [ ] Use card: 4000 0025 0000 3155
- [ ] 3D Secure authentication appears
- [ ] Can complete authentication
- [ ] Payment succeeds after auth

## Email Tests

- [ ] E-ticket email received
- [ ] Email contains ticket number
- [ ] Email contains violation details
- [ ] Email contains payment confirmation
- [ ] Email contains officer information
- [ ] Email formatting is correct (HTML)
- [ ] Email not in spam folder

## Integration Tests

### Complete Flow Test 1: New Vehicle
1. [ ] Register new vehicle with email
2. [ ] Issue violation
3. [ ] Navigate to payment page
4. [ ] Complete payment
5. [ ] Receive e-ticket email
6. [ ] Check database - status is 'paid'
7. [ ] Check Stripe dashboard - payment recorded

### Complete Flow Test 2: Existing Vehicle
1. [ ] Search existing vehicle (with email)
2. [ ] Issue violation
3. [ ] Complete payment
4. [ ] Receive e-ticket
5. [ ] Verify in database

### Complete Flow Test 3: Multiple Violations
1. [ ] Issue first violation
2. [ ] Complete payment
3. [ ] Issue second violation to same vehicle
4. [ ] Complete payment
5. [ ] Verify both e-tickets received
6. [ ] Verify both payments in Stripe

## Error Handling Tests

- [ ] No internet - shows appropriate error
- [ ] Invalid email format - validation error
- [ ] Payment cancelled - can retry
- [ ] Server error - shows error message
- [ ] Email sending fails - payment still recorded

## Security Tests

- [ ] .env files not accessible via browser
- [ ] API keys not exposed in responses
- [ ] Payment verification done server-side
- [ ] Cannot confirm payment without valid payment_intent_id
- [ ] Cannot access payment endpoints without data

## Performance Tests

- [ ] Payment page loads quickly
- [ ] Stripe payment sheet loads in < 3 seconds
- [ ] Email sends within 5 seconds
- [ ] Database updates are immediate
- [ ] No memory leaks in Flutter app

## Stripe Dashboard Verification

- [ ] Payments appear in Stripe dashboard
- [ ] Correct amounts recorded
- [ ] Metadata includes violation_id
- [ ] Metadata includes ticket_number
- [ ] Receipt email matches owner email

## Production Readiness

- [ ] Test mode works completely
- [ ] Ready to switch to live keys
- [ ] Error logging implemented
- [ ] User instructions documented
- [ ] Officer training materials prepared

## Notes Section

**Issues Found:**
_Document any issues discovered during testing_

**Performance Observations:**
_Note any performance concerns_

**User Feedback:**
_Record feedback from test users_

---

## Sign-off

- [ ] All critical tests passed
- [ ] All issues documented
- [ ] Ready for production deployment

**Tested by:** ___________________  
**Date:** ___________________  
**Signature:** ___________________
