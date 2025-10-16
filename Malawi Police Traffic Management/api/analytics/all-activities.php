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
    
    $stmt = $pdo->prepare("
        SELECT 
            v.violation_date,
            v.fine_amount,
            v.status,
            v.ticket_number,
            vt.violation_name,
            vh.license_plate,
            o.serviceNumber,
            o.fullName as officer_name
        FROM violations v
        LEFT JOIN violation_types vt ON v.violation_type_id = vt.typeID
        LEFT JOIN vehicles vh ON v.vehicle_id = vh.vehiclesID
        LEFT JOIN officers o ON v.officer_id = o.officerID
        ORDER BY v.violation_date DESC
    ");
    
    $stmt->execute();
    $allActivities = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => $allActivities
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>