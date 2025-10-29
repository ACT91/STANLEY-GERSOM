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
    
    if (!$data || !isset($data['violation_id'])) {
        echo json_encode(['success' => false, 'message' => 'Violation ID required']);
        exit();
    }
    
    // Get violation details
    $stmt = $pdo->prepare("
        SELECT v.*, vt.violation_name, ve.owner_email, ve.owner_name, ve.license_plate
        FROM violations v 
        JOIN violation_types vt ON v.violation_type_id = vt.typeID 
        JOIN vehicles ve ON v.vehicle_id = ve.vehiclesID 
        WHERE v.violationID = ? AND v.status = 'pending'
    ");
    $stmt->execute([$data['violation_id']]);
    $violation = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$violation) {
        echo json_encode(['success' => false, 'message' => 'Violation not found or already paid']);
        exit();
    }
    
    // Create Stripe payment intent
    $paymentIntent = \Stripe\PaymentIntent::create([
        'amount' => intval($violation['fine_amount'] * 100), // Convert to cents
        'currency' => 'mwk',
        'description' => "Traffic Violation - {$violation['ticket_number']}",
        'metadata' => [
            'violation_id' => $violation['violationID'],
            'ticket_number' => $violation['ticket_number'],
            'license_plate' => $violation['license_plate']
        ]
    ]);
    
    echo json_encode([
        'success' => true,
        'client_secret' => $paymentIntent->client_secret,
        'payment_intent_id' => $paymentIntent->id,
        'amount' => $violation['fine_amount']
    ]);
    
} catch(\Stripe\Exception\ApiErrorException $e) {
    echo json_encode(['success' => false, 'message' => 'Stripe error: ' . $e->getMessage()]);
} catch(Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>
