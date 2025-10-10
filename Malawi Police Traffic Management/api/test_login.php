<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Simulate the exact login request
$testData = [
    'username' => 'admin',
    'password' => 'admin123'
];

// Database connection
$host = 'localhost';
$dbname = 'malawi_police_traffic';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = ? AND isActive = 1");
    $stmt->execute([$testData['username']]);
    $admin = $stmt->fetch();
    
    $passwordMatch = false;
    if ($admin) {
        $passwordMatch = ($testData['password'] === $admin['password']) || password_verify($testData['password'], $admin['password']);
    }
    
    echo json_encode([
        'success' => true,
        'admin_found' => $admin ? true : false,
        'stored_password' => $admin ? $admin['password'] : 'N/A',
        'test_password' => $testData['password'],
        'password_match' => $passwordMatch,
        'login_result' => $passwordMatch ? 'SUCCESS' : 'FAILED'
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>