<?php
require_once '../config/database.php';

try {
    $stmt = $pdo->query("
        SELECT o.*, a.fullName as supervisor_name 
        FROM officers o 
        LEFT JOIN admins a ON o.assigned_supervisor = a.adminID 
        ORDER BY o.created_at DESC
    ");
    $officers = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'data' => $officers
    ]);
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>