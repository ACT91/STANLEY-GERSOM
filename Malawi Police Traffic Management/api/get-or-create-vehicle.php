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
    
    // First try to find existing vehicle
    $stmt = $pdo->prepare("SELECT * FROM vehicles WHERE license_plate = ?");
    $stmt->execute([$licensePlate]);
    $vehicle = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($vehicle) {
        echo json_encode([
            'success' => true,
            'vehicle' => $vehicle,
            'message' => 'Vehicle found'
        ]);
    } else {
        // Create new vehicle
        if (!isset($data['owner_name']) || !isset($data['owner_phone']) || !isset($data['vehicles_type'])) {
            echo json_encode(['success' => false, 'message' => 'Owner name, phone, and vehicle type required for registration']);
            exit();
        }
        
        $insertStmt = $pdo->prepare("
            INSERT INTO vehicles (license_plate, owner_name, owner_phone, vehicles_type, registration_date) 
            VALUES (?, ?, ?, ?, NOW())
        ");
        
        $success = $insertStmt->execute([
            $licensePlate,
            $data['owner_name'],
            $data['owner_phone'],
            $data['vehicles_type']
        ]);
        
        if ($success) {
            $vehicleId = $pdo->lastInsertId();
            
            // Get the newly created vehicle
            $newVehicleStmt = $pdo->prepare("SELECT * FROM vehicles WHERE vehiclesID = ?");
            $newVehicleStmt->execute([$vehicleId]);
            $newVehicle = $newVehicleStmt->fetch(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'success' => true,
                'vehicle' => $newVehicle,
                'message' => 'Vehicle registered successfully'
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to register vehicle']);
        }
    }
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>