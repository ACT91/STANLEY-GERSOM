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
    
    // Find vehicle
    $vehicleStmt = $pdo->prepare("SELECT * FROM vehicles WHERE license_plate = ?");
    $vehicleStmt->execute([$licensePlate]);
    $vehicle = $vehicleStmt->fetch();
    
    if (!$vehicle) {
        echo json_encode(['success' => false, 'message' => 'Vehicle not found']);
        exit();
    }
    
    // Get violation statistics
    $statsStmt = $pdo->prepare("
        SELECT 
            COUNT(*) as totalViolations,
            SUM(fine_amount) as totalFines,
            SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paidViolations,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pendingViolations
        FROM violations 
        WHERE vehicle_id = ?
    ");
    $statsStmt->execute([$vehicle['vehiclesID']]);
    $stats = $statsStmt->fetch(PDO::FETCH_ASSOC);
    
    // Get recent violations
    $recentStmt = $pdo->prepare("
        SELECT 
            v.*,
            vt.violation_name,
            o.fullName as officer_name
        FROM violations v
        LEFT JOIN violation_types vt ON v.violation_type_id = vt.typeID
        LEFT JOIN officers o ON v.officer_id = o.officerID
        WHERE v.vehicle_id = ?
        ORDER BY v.violation_date DESC
        LIMIT 10
    ");
    $recentStmt->execute([$vehicle['vehiclesID']]);
    $recentViolations = $recentStmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => [
            'vehicle' => $vehicle,
            'totalViolations' => (int)$stats['totalViolations'],
            'totalFines' => (float)$stats['totalFines'],
            'paidViolations' => (int)$stats['paidViolations'],
            'pendingViolations' => (int)$stats['pendingViolations'],
            'recentViolations' => $recentViolations
        ]
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>