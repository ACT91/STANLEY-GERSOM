<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/env.php';
require_once '../vendor/autoload.php';

\Stripe\Stripe::setApiKey(getenv('STRIPE_SECRET_KEY'));

$data = json_decode(file_get_contents('php://input'), true);

$host = 'localhost';
$dbname = 'malawi_police_traffic';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    if (!$data || !isset($data['violation_id']) || !isset($data['payment_intent_id'])) {
        echo json_encode(['success' => false, 'message' => 'Violation ID and Payment Intent ID required']);
        exit();
    }
    
    // Verify payment with Stripe
    $paymentIntent = \Stripe\PaymentIntent::retrieve($data['payment_intent_id']);
    
    if ($paymentIntent->status !== 'succeeded') {
        echo json_encode(['success' => false, 'message' => 'Payment not completed']);
        exit();
    }
    
    // Update violation status
    $updateStmt = $pdo->prepare("
        UPDATE violations 
        SET status = 'paid', 
            payment_date = NOW(), 
            payment_method = 'stripe',
            payment_intent_id = ?
        WHERE violationID = ?
    ");
    $updateStmt->execute([$data['payment_intent_id'], $data['violation_id']]);
    
    // Get violation details for email
    $stmt = $pdo->prepare("
        SELECT v.*, vt.violation_name, ve.owner_email, ve.owner_name, ve.license_plate,
               o.fullName as officer_name, o.serviceNumber
        FROM violations v 
        JOIN violation_types vt ON v.violation_type_id = vt.typeID 
        JOIN vehicles ve ON v.vehicle_id = ve.vehiclesID 
        JOIN officers o ON v.officer_id = o.officerID
        WHERE v.violationID = ?
    ");
    $stmt->execute([$data['violation_id']]);
    $violation = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Send email
    if ($violation && $violation['owner_email']) {
        sendETicket($violation);
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Payment confirmed and e-ticket sent',
        'violation' => $violation
    ]);
    
} catch(\Stripe\Exception\ApiErrorException $e) {
    echo json_encode(['success' => false, 'message' => 'Stripe error: ' . $e->getMessage()]);
} catch(Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}

function sendETicket($violation) {
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
        $mail->addAddress($violation['owner_email'], $violation['owner_name']);
        
        $mail->isHTML(true);
        $mail->Subject = 'Traffic Violation E-Ticket - ' . $violation['ticket_number'];
        
        $mail->Body = "
        <html>
        <body style='font-family: Arial, sans-serif;'>
            <h2 style='color: #1976d2;'>Malawi Police Traffic Management</h2>
            <h3>Traffic Violation E-Ticket</h3>
            <hr>
            <p><strong>Ticket Number:</strong> {$violation['ticket_number']}</p>
            <p><strong>Status:</strong> <span style='color: green;'>PAID</span></p>
            <p><strong>Vehicle:</strong> {$violation['license_plate']}</p>
            <p><strong>Owner:</strong> {$violation['owner_name']}</p>
            <p><strong>Violation:</strong> {$violation['violation_name']}</p>
            <p><strong>Fine Amount:</strong> MWK " . number_format($violation['fine_amount'], 2) . "</p>
            <p><strong>Location:</strong> {$violation['location']}</p>
            <p><strong>Date:</strong> {$violation['violation_date']}</p>
            <p><strong>Payment Date:</strong> {$violation['payment_date']}</p>
            <p><strong>Issuing Officer:</strong> {$violation['officer_name']} ({$violation['serviceNumber']})</p>
            <hr>
            <p style='color: #666; font-size: 12px;'>This is an automated email. Please do not reply.</p>
            <p style='color: #666; font-size: 12px;'>Keep this e-ticket for your records.</p>
        </body>
        </html>
        ";
        
        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Email sending failed: " . $mail->ErrorInfo);
        return false;
    }
}
?>
