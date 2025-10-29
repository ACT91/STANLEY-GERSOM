<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

// Database connection
$host = 'localhost';
$dbname = 'malawi_police_traffic';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    if (!$data || !isset($data['vehicle_id']) || !isset($data['officer_id']) || !isset($data['violation_type_id'])) {
        echo json_encode(['success' => false, 'message' => 'Required fields missing']);
        exit();
    }
    
    // Get violation type to get fine amount
    $typeStmt = $pdo->prepare("SELECT base_fine, violation_name FROM violation_types WHERE typeID = ?");
    $typeStmt->execute([$data['violation_type_id']]);
    $violationType = $typeStmt->fetch();
    
    if (!$violationType) {
        echo json_encode(['success' => false, 'message' => 'Invalid violation type']);
        exit();
    }
    
    // Check for today's violations (repeat offender)
    $todayViolationsStmt = $pdo->prepare("
        SELECT COUNT(*) as count FROM violations 
        WHERE vehicle_id = ? AND DATE(violation_date) = CURDATE()
    ");
    $todayViolationsStmt->execute([$data['vehicle_id']]);
    $todayCount = $todayViolationsStmt->fetchColumn();
    
    // Calculate fine with surcharge for repeat offenders
    $baseFine = $violationType['base_fine'];
    $finalFine = $baseFine;
    $surcharge = 0;
    
    if ($todayCount > 0) {
        $surcharge = $baseFine * 0.25; // 25% surcharge for repeat offenders
        $finalFine = $baseFine + $surcharge;
    }
    
    // Generate ticket number
    $ticketNumber = 'TK' . date('Ymd') . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
    
    // Insert violation
    $stmt = $pdo->prepare("
        INSERT INTO violations (ticket_number, vehicle_id, officer_id, violation_type_id, fine_amount, location, notes, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
    ");
    
    $success = $stmt->execute([
        $ticketNumber,
        $data['vehicle_id'],
        $data['officer_id'],
        $data['violation_type_id'],
        $finalFine,
        $data['location'],
        $data['notes'] ?? ''
    ]);
    
    if ($success) {
        $violationId = $pdo->lastInsertId();
        echo json_encode([
            'success' => true,
            'violation_id' => $violationId,
            'ticket_number' => $ticketNumber,
            'violation_name' => $violationType['violation_name'],
            'base_fine' => $baseFine,
            'surcharge' => $surcharge,
            'final_fine' => $finalFine,
            'is_repeat_offender' => $todayCount > 0,
            'message' => 'Violation issued successfully'
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to issue violation']);
    }
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>