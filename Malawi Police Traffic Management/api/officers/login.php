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
    
    if (!$data || !isset($data['serviceNumber']) || !isset($data['pin'])) {
        echo json_encode(['success' => false, 'message' => 'Service number and PIN required']);
        exit();
    }
    
    $serviceNumber = $data['serviceNumber'];
    $pin = $data['pin'];
    
    $stmt = $pdo->prepare("SELECT * FROM officers WHERE serviceNumber = ?");
    $stmt->execute([$serviceNumber]);
    $officer = $stmt->fetch();
    
    if (!$officer) {
        echo json_encode(['success' => false, 'message' => 'Officer not found']);
        exit();
    }
    
    if (!$officer['isActive']) {
        echo json_encode(['success' => false, 'message' => 'Account not activated. Please contact admin.']);
        exit();
    }
    
    if ($pin === $officer['pin']) {
        // Update last login
        $updateStmt = $pdo->prepare("UPDATE officers SET last_login = NOW() WHERE officerID = ?");
        $updateStmt->execute([$officer['officerID']]);
        
        unset($officer['pin']);
        echo json_encode([
            'success' => true,
            'officer' => $officer,
            'message' => 'Login successful'
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid PIN']);
    }
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>