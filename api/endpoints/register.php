<?php
/**
 * Endpoint: Registro de Usuarios
 * Método: POST
 * Descripción: Registra un nuevo usuario con hash de contraseña
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
    if (empty($data['username']) || empty($data['email']) || empty($data['password'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Faltan datos requeridos']);
        exit();
    }

    // Validar formato de email
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Email inválido']);
        exit();
    }

    // Validar longitud de contraseña
    if (strlen($data['password']) < 6) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'La contraseña debe tener al menos 6 caracteres']);
        exit();
    }

    $auth = new Auth();
    $result = $auth->register($data['username'], $data['email'], $data['password']);

    if ($result['success']) {
        http_response_code(201);
    } else {
        http_response_code(400);
    }

    echo json_encode($result);

} catch (Exception $e) {
    error_log("Error en registro: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error interno del servidor']);
}
