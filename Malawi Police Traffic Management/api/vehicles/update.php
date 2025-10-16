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
    
    if (!$data || !isset($data['vehicleId'])) {
        echo json_encode(['success' => false, 'message' => 'Vehicle ID required']);
        exit();
    }
    
    $vehicleId = $data['vehicleId'];
    $ownerName = $data['owner_name'] ?? '';
    $ownerPhone = $data['owner_phone'] ?? '';
    $vehicleType = $data['vehicles_type'] ?? 'sedan';
    
    $stmt = $pdo->prepare("
        UPDATE vehicles 
        SET owner_name = ?, owner_phone = ?, vehicles_type = ?
        WHERE vehiclesID = ?
    ");
    
    $stmt->execute([$ownerName, $ownerPhone, $vehicleType, $vehicleId]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'Vehicle information updated successfully'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Vehicle not found or no changes made'
        ]);
    }
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>