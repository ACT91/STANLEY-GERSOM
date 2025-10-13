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
    
    $stmt = $pdo->prepare("SELECT * FROM vehicles WHERE license_plate = ?");
    $stmt->execute([$licensePlate]);
    $vehicle = $stmt->fetch();
    
    if ($vehicle) {
        echo json_encode([
            'success' => true,
            'vehicle' => $vehicle
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Vehicle not found in database'
        ]);
    }
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>