<?php
require_once '../config/database.php';

try {
    $whereClause = "";
    $params = [];
    $conditions = [];

    // Handle officer filter
    if (isset($_GET['officer_id'])) {
        $conditions[] = "v.officer_id = ?";
        $params[] = $_GET['officer_id'];
    }

    // Handle status filter
    if (isset($_GET['status']) && $_GET['status'] !== 'all') {
        $conditions[] = "v.status = ?";
        $params[] = $_GET['status'];
    }

    if (!empty($conditions)) {
        $whereClause = "WHERE " . implode(" AND ", $conditions);
    }

    $stmt = $pdo->prepare("
        SELECT 
            v.*,
            vt.violation_name,
            vt.description as violation_description,
            vh.license_plate,
            vh.owner_name,
            vh.vehicles_type,
            o.serviceNumber,
            o.fullName as officer_name,
            o.rank as officer_rank
        FROM violations v
        LEFT JOIN violation_types vt ON v.violation_type_id = vt.typeID
        LEFT JOIN vehicles vh ON v.vehicle_id = vh.vehiclesID
        LEFT JOIN officers o ON v.officer_id = o.officerID
        $whereClause
        ORDER BY v.violation_date DESC
        LIMIT 100
    ");
    
    $stmt->execute($params);
    $violations = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'data' => $violations
    ]);
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>