<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection
$host = 'localhost';
$dbname = 'malawi_police_traffic';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Get violation types statistics
    $violationTypesStmt = $pdo->prepare("
        SELECT 
            vt.violation_name,
            COUNT(v.violationID) as count,
            SUM(v.fine_amount) as total_revenue,
            ROUND((COUNT(v.violationID) * 100.0 / (SELECT COUNT(*) FROM violations)), 2) as percentage
        FROM violation_types vt
        LEFT JOIN violations v ON vt.typeID = v.violation_type_id
        GROUP BY vt.typeID, vt.violation_name
        HAVING count > 0
        ORDER BY count DESC
    ");
    $violationTypesStmt->execute();
    $violationTypes = $violationTypesStmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get vehicle types statistics
    $vehicleTypesStmt = $pdo->prepare("
        SELECT 
            vh.vehicles_type,
            COUNT(v.violationID) as count,
            ROUND((COUNT(v.violationID) * 100.0 / (SELECT COUNT(*) FROM violations)), 2) as percentage
        FROM vehicles vh
        LEFT JOIN violations v ON vh.vehiclesID = v.vehicle_id
        GROUP BY vh.vehicles_type
        HAVING count > 0
        ORDER BY count DESC
    ");
    $vehicleTypesStmt->execute();
    $vehicleTypes = $vehicleTypesStmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => [
            'violationTypes' => $violationTypes,
            'vehicleTypes' => $vehicleTypes
        ]
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>