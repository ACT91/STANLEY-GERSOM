<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get the raw POST data
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Database connection
$host = 'localhost';
$dbname = 'malawi_police_traffic';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    if (!$data || !isset($data['username']) || !isset($data['password'])) {
        echo json_encode([
            'success' => false, 
            'message' => 'Username and password required',
            'received_data' => $data,
            'raw_input' => $input
        ]);
        exit();
    }
    
    $user = $data['username'];
    $pass = $data['password'];
    
    $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = ? AND isActive = 1");
    $stmt->execute([$user]);
    $admin = $stmt->fetch();
    
    if ($admin && $pass === $admin['password']) {
        unset($admin['password']);
        echo json_encode([
            'success' => true,
            'admin' => $admin,
            'message' => 'Login successful'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid credentials',
            'debug' => [
                'input_user' => $user,
                'input_pass' => $pass,
                'admin_found' => $admin ? true : false,
                'stored_pass' => $admin ? $admin['password'] : 'N/A'
            ]
        ]);
    }
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>