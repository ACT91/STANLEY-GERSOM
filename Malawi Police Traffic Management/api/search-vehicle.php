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
    
    if (!$data || !isset($data['license_plate'])) {
        echo json_encode(['success' => false, 'message' => 'License plate required']);
        exit();
    }
    
    $licensePlate = $data['license_plate'];
    
    // Find vehicle
    $stmt = $pdo->prepare("SELECT * FROM vehicles WHERE license_plate = ?");
    $stmt->execute([$licensePlate]);
    $vehicle = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($vehicle) {
        // Get today's violations for this vehicle
        $violationsStmt = $pdo->prepare("
            SELECT v.*, vt.violation_name, vt.base_fine 
            FROM violations v
            LEFT JOIN violation_types vt ON v.violation_type_id = vt.typeID
            WHERE v.vehicle_id = ? AND DATE(v.violation_date) = CURDATE()
            ORDER BY v.violation_date DESC
        ");
        $violationsStmt->execute([$vehicle['vehiclesID']]);
        $todayViolations = $violationsStmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'vehicle' => $vehicle,
            'today_violations' => $todayViolations,
            'message' => 'Vehicle found'
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Vehicle not found']);
    }
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>