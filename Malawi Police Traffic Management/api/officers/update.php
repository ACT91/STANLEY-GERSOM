<?php
require_once '../config/database.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['id'])) {
    echo json_encode(['success' => false, 'message' => 'Officer ID required']);
    exit();
}

try {
    $updates = [];
    $params = [];

    if (isset($data['isActive'])) {
        $updates[] = "isActive = ?";
        $params[] = $data['isActive'] ? 1 : 0;
    }

    if (isset($data['fullName'])) {
        $updates[] = "fullName = ?";
        $params[] = $data['fullName'];
    }

    if (isset($data['rank'])) {
        $updates[] = "rank = ?";
        $params[] = $data['rank'];
    }

    if (isset($data['station'])) {
        $updates[] = "station = ?";
        $params[] = $data['station'];
    }

    if (empty($updates)) {
        echo json_encode(['success' => false, 'message' => 'No fields to update']);
        exit();
    }

    $params[] = $data['id'];
    $sql = "UPDATE officers SET " . implode(', ', $updates) . " WHERE officerID = ?";
    
    $stmt = $pdo->prepare($sql);
    $success = $stmt->execute($params);

    if ($success) {
        echo json_encode([
            'success' => true,
            'message' => 'Officer updated successfully'
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update officer']);
    }
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>