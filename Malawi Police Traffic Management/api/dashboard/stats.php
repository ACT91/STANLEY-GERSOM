<?php
require_once '../config/database.php';

try {
    // Get total officers
    $stmt = $pdo->query("SELECT COUNT(*) as total, SUM(isActive) as active FROM officers");
    $officerStats = $stmt->fetch();

    // Get violation stats
    $stmt = $pdo->query("SELECT COUNT(*) as total, SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending FROM violations");
    $violationStats = $stmt->fetch();

    // Get revenue stats
    $stmt = $pdo->query("SELECT SUM(fine_amount) as total FROM violations WHERE status = 'paid'");
    $totalRevenue = $stmt->fetch()['total'] ?? 0;

    $stmt = $pdo->query("SELECT SUM(fine_amount) as today FROM violations WHERE status = 'paid' AND DATE(payment_date) = CURDATE()");
    $todayRevenue = $stmt->fetch()['today'] ?? 0;

    echo json_encode([
        'success' => true,
        'data' => [
            'totalOfficers' => (int)$officerStats['total'],
            'activeOfficers' => (int)$officerStats['active'],
            'totalViolations' => (int)$violationStats['total'],
            'pendingViolations' => (int)$violationStats['pending'],
            'totalRevenue' => (float)$totalRevenue,
            'todayRevenue' => (float)$todayRevenue
        ]
    ]);
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>