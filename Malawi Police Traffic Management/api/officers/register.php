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
    
    if (!$data || !isset($data['serviceNumber']) || !isset($data['fullName']) || !isset($data['pin'])) {
        echo json_encode(['success' => false, 'message' => 'Required fields missing']);
        exit();
    }
    
    // Check if service number already exists
    $checkStmt = $pdo->prepare("SELECT COUNT(*) FROM officers WHERE serviceNumber = ?");
    $checkStmt->execute([$data['serviceNumber']]);
    
    if ($checkStmt->fetchColumn() > 0) {
        echo json_encode(['success' => false, 'message' => 'Service number already exists']);
        exit();
    }
    
    // Insert new officer (inactive by default)
    $stmt = $pdo->prepare("
        INSERT INTO officers (serviceNumber, fullName, rank, station, pin, isActive) 
        VALUES (?, ?, ?, ?, ?, 0)
    ");
    
    $success = $stmt->execute([
        $data['serviceNumber'],
        $data['fullName'],
        $data['rank'],
        $data['station'],
        $data['pin']
    ]);
    
    if ($success) {
        echo json_encode([
            'success' => true,
            'message' => 'Registration successful. Please wait for admin approval.'
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Registration failed']);
    }
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>