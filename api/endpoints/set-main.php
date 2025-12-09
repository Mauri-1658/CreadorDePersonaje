<?php
/**
 * Endpoint: Establecer Personaje Principal
 * Método: POST
 * Descripción: Marca un personaje como main (solo uno por usuario)
 */

require_once '../config.php';
require_once '../classes/Database.php';
require_once '../classes/Auth.php';

// Solo permitir POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit();
}

try {
    $auth = new Auth();

    // Verificar autenticación
    if (!$auth->isAuthenticated()) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'No autenticado']);
        exit();
    }

    $userId = $auth->getUserId();
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['character_id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID de personaje requerido']);
        exit();
    }

    $characterId = $data['character_id'];
    $setAsMain = $data['is_main'] ?? true;

    $db = Database::getInstance()->getConnection();

    // Verificar que el personaje pertenece al usuario
    $stmt = $db->prepare("SELECT id FROM characters WHERE id = ? AND user_id = ?");
    $stmt->execute([$characterId, $userId]);
    
    if (!$stmt->fetch()) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Personaje no encontrado']);
        exit();
    }

    // Quitar main de todos los personajes del usuario
    $stmt = $db->prepare("UPDATE characters SET is_main = FALSE WHERE user_id = ?");
    $stmt->execute([$userId]);

    // Si setAsMain es true, establecer este como main
    if ($setAsMain) {
        $stmt = $db->prepare("UPDATE characters SET is_main = TRUE WHERE id = ? AND user_id = ?");
        $stmt->execute([$characterId, $userId]);
    }

    echo json_encode([
        'success' => true,
        'message' => $setAsMain ? 'Personaje establecido como principal' : 'Personaje principal eliminado'
    ]);

} catch (Exception $e) {
    error_log("Error al establecer personaje principal: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error interno del servidor']);
}
