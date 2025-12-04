<?php
/**
 * Endpoint: Logout de Usuarios
 * Método: POST
 * Descripción: Cierra sesión y destruye cookie
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
    $result = $auth->logout();

    http_response_code(200);
    echo json_encode($result);

} catch (Exception $e) {
    error_log("Error en logout: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error interno del servidor']);
}
