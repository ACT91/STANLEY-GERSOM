<?php
require_once '../config/database.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['serviceNumber']) || !isset($data['fullName']) || !isset($data['pin'])) {
    echo json_encode(['success' => false, 'message' => 'Required fields missing']);
    exit();
}

try {
    // Check if service number already exists
    $checkStmt = $pdo->prepare("SELECT COUNT(*) FROM officers WHERE serviceNumber = ?");
    $checkStmt->execute([$data['serviceNumber']]);
    
    if ($checkStmt->fetchColumn() > 0) {
        echo json_encode(['success' => false, 'message' => 'Service number already exists']);
        exit();
    }

    $stmt = $pdo->prepare("
        INSERT INTO officers (serviceNumber, fullName, rank, station, pin) 
        VALUES (?, ?, ?, ?, ?)
    ");
    
    $success = $stmt->execute([
        $data['serviceNumber'],
        $data['fullName'],
        $data['rank'],
        $data['station'],
        $data['pin']
    ]);

    if ($success) {
        $officerId = $pdo->lastInsertId();
        
        // Get the created officer
        $getStmt = $pdo->prepare("SELECT * FROM officers WHERE officerID = ?");
        $getStmt->execute([$officerId]);
        $officer = $getStmt->fetch();

        echo json_encode([
            'success' => true,
            'data' => $officer,
            'message' => 'Officer created successfully'
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to create officer']);
    }
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>