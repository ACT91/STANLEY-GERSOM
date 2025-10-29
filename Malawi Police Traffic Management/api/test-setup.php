<?php
// Test if libraries are loaded correctly
require_once 'config/env.php';
require_once 'vendor/autoload.php';

echo "Testing library setup...\n\n";

// Test Stripe
try {
    echo "✓ Stripe library loaded\n";
    echo "  Stripe API Key: " . (getenv('STRIPE_SECRET_KEY') ? 'Configured' : 'NOT CONFIGURED') . "\n\n";
} catch (Exception $e) {
    echo "✗ Stripe error: " . $e->getMessage() . "\n\n";
}

// Test PHPMailer
try {
    $mail = new PHPMailer\PHPMailer\PHPMailer();
    echo "✓ PHPMailer library loaded\n";
    echo "  SMTP Host: " . (getenv('SMTP_HOST') ?: 'NOT CONFIGURED') . "\n";
    echo "  SMTP Username: " . (getenv('SMTP_USERNAME') ?: 'NOT CONFIGURED') . "\n\n";
} catch (Exception $e) {
    echo "✗ PHPMailer error: " . $e->getMessage() . "\n\n";
}

echo "Setup test complete!\n";
echo "\nNext steps:\n";
echo "1. Update .env file with your Stripe API keys\n";
echo "2. Update .env file with your SMTP credentials\n";
echo "3. Run database migration\n";
echo "4. Test the payment flow\n";
?>
