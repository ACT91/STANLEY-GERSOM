<?php
require_once '../config/database.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['id']) || !isset($data['status'])) {
    echo json_encode(['success' => false, 'message' => 'Violation ID and status required']);
    exit();
}

try {
    $updates = ["status = ?"];
    $params = [$data['status']];

    // Set payment date if status is paid
    if ($data['status'] === 'paid') {
        $updates[] = "payment_date = NOW()";
    }

    // Add notes if provided
    if (isset($data['notes']) && !empty($data['notes'])) {
        if ($data['status'] === 'disputed') {
            $updates[] = "dispute_reason = ?";
            $params[] = $data['notes'];
        }
    }

    $params[] = $data['id'];
    $sql = "UPDATE violations SET " . implode(', ', $updates) . " WHERE violationID = ?";
    
    $stmt = $pdo->prepare($sql);
    $success = $stmt->execute($params);

    if ($success) {
        echo json_encode([
            'success' => true,
            'message' => 'Violation status updated successfully'
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update violation']);
    }
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>