<?php
/**
 * Endpoint: Login de Usuarios
 * Método: POST
 * Descripción: Inicia sesión y envía cookie de sesión
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
    // Obtener datos del body
    $data = json_decode(file_get_contents('php://input'), true);

    // Validar datos requeridos
    if (empty($data['email']) || empty($data['password'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Email y contraseña son requeridos']);
        exit();
    }

    $auth = new Auth();
    $result = $auth->login($data['email'], $data['password']);

    if ($result['success']) {
        http_response_code(200);
    } else {
        http_response_code(401);
    }

    echo json_encode($result);

} catch (Exception $e) {
    error_log("Error en login: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error interno del servidor']);
}
