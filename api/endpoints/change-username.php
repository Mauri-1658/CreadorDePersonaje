<?php
/**
 * Endpoint: Cambiar Nombre de Usuario
 * Método: POST
 */

require_once '../config.php';
require_once '../classes/Database.php';
require_once '../classes/Auth.php';

header('Content-Type: application/json');

$auth = new Auth();

// Verificar autenticación
if (!$auth->isAuthenticated()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'No autenticado']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit();
}

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (empty($data['new_username'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Nuevo nombre de usuario requerido']);
        exit();
    }
    
    $newUsername = trim($data['new_username']);
    $userId = $auth->getUserId();
    
    // Validar longitud
    if (strlen($newUsername) < 3) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'El nombre debe tener al menos 3 caracteres']);
        exit();
    }
    
    if (strlen($newUsername) > 50) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'El nombre es demasiado largo']);
        exit();
    }
    
    // Validar caracteres permitidos
    if (!preg_match('/^[a-zA-Z0-9_áéíóúÁÉÍÓÚñÑ]+$/', $newUsername)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Solo se permiten letras, números y guiones bajos']);
        exit();
    }
    
    $db = Database::getInstance()->getConnection();
    
    // Verificar que el nombre no esté en uso
    $stmt = $db->prepare("SELECT id FROM users WHERE username = ? AND id != ?");
    $stmt->execute([$newUsername, $userId]);
    
    if ($stmt->fetch()) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Este nombre de usuario ya está en uso']);
        exit();
    }
    
    // Actualizar nombre
    $stmt = $db->prepare("UPDATE users SET username = ? WHERE id = ?");
    $stmt->execute([$newUsername, $userId]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Nombre de usuario actualizado correctamente',
        'username' => $newUsername
    ]);
    
} catch (Exception $e) {
    error_log("Error al cambiar username: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error interno']);
}
