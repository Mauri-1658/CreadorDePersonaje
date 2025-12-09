<?php
/**
 * Endpoint: Logout de Usuarios
 * Método: POST
 * Descripción: Cierra sesión y destruye cookie
 */

error_log("[LOGOUT] Endpoint llamado");

require_once '../config.php';
require_once '../classes/Database.php';
require_once '../classes/Auth.php';

// Solo permitir POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    error_log("[LOGOUT] Método no permitido: " . $_SERVER['REQUEST_METHOD']);
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit();
}

try {
    error_log("[LOGOUT] Instanciando Auth y llamando logout()");
    $auth = new Auth();
    $result = $auth->logout();

    error_log("[LOGOUT] Resultado: " . json_encode($result));
    http_response_code(200);
    echo json_encode($result);

} catch (Exception $e) {
    error_log("[LOGOUT] Exception: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error interno del servidor']);
}
