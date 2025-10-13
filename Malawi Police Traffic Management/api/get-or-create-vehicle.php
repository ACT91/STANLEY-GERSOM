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
    
    $licensePlate = strtoupper(trim($data['license_plate']));
    $isNewVehicle = false;
    
    // First, try to find existing vehicle
    $stmt = $pdo->prepare("SELECT * FROM vehicles WHERE license_plate = ?");
    $stmt->execute([$licensePlate]);
    $vehicle = $stmt->fetch();
    
    // If vehicle doesn't exist, create it
    if (!$vehicle) {
        $insertStmt = $pdo->prepare("
            INSERT INTO vehicles (license_plate, owner_name, owner_phone, vehicles_type, registration_date) 
            VALUES (?, ?, ?, ?, CURDATE())
        ");
        
        $insertStmt->execute([
            $licensePlate,
            'To be updated',
            'To be updated',
            'sedan'
        ]);
        
        // Get the newly created vehicle
        $vehicleId = $pdo->lastInsertId();
        $stmt = $pdo->prepare("SELECT * FROM vehicles WHERE vehiclesID = ?");
        $stmt->execute([$vehicleId]);
        $vehicle = $stmt->fetch();
        $isNewVehicle = true;
    }
    
    // Get today's violations for this vehicle
    $violationsStmt = $pdo->prepare("
        SELECT v.*, vt.violation_name, vt.base_fine, o.fullName as officer_name
        FROM violations v 
        LEFT JOIN violation_types vt ON v.violation_type_id = vt.typeID 
        LEFT JOIN officers o ON v.officer_id = o.officerID
        WHERE v.vehicle_id = ? AND DATE(v.violation_date) = CURDATE()
        ORDER BY v.violation_date DESC
    ");
    $violationsStmt->execute([$vehicle['vehiclesID']]);
    $todayViolations = $violationsStmt->fetchAll();
    
    // Add today's violations to vehicle data
    $vehicle['todayViolations'] = $todayViolations;
    $vehicle['hasViolationsToday'] = count($todayViolations) > 0;
    
    echo json_encode([
        'success' => true,
        'vehicle' => $vehicle,
        'isNewVehicle' => $isNewVehicle,
        'message' => $isNewVehicle ? 'New vehicle registered' : 'Vehicle found'
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'System error. Please try again.'
    ]);
}
?>