<?php
require_once 'config/env.php';
require_once 'vendor/autoload.php';

$mail = new PHPMailer\PHPMailer\PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = getenv('SMTP_HOST');
    $mail->SMTPAuth = true;
    $mail->Username = getenv('SMTP_USERNAME');
    $mail->Password = getenv('SMTP_PASSWORD');
    $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = getenv('SMTP_PORT');
    
    $mail->setFrom(getenv('SMTP_FROM_EMAIL'), getenv('SMTP_FROM_NAME'));
    $mail->addAddress(getenv('SMTP_USERNAME')); // Send to yourself
    
    $mail->Subject = 'Test Email - Malawi Police System';
    $mail->Body = 'Email configuration is working correctly!';
    
    $mail->send();
    echo "✓ Email sent successfully!\n";
    echo "Check your inbox: " . getenv('SMTP_USERNAME') . "\n";
} catch (Exception $e) {
    echo "✗ Email failed: " . $mail->ErrorInfo . "\n";
}
?>
