<?php
/**
 * Endpoint: Gestión de Personajes
 * Métodos: GET, POST, PUT, DELETE
 * Descripción: CRUD completo de personajes (requiere autenticación)
 */

require_once '../config.php';
require_once '../classes/Database.php';
require_once '../classes/Auth.php';
require_once '../classes/Character.php';

try {
    $auth = new Auth();

    // Verificar autenticación para todas las operaciones
    if (!$auth->isAuthenticated()) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'No autenticado']);
        exit();
    }

    $userId = $auth->getUserId();
    $character = new Character();
    $method = $_SERVER['REQUEST_METHOD'];

    switch ($method) {
        case 'GET':
            // Obtener personajes del usuario
            if (isset($_GET['id'])) {
                // Obtener un personaje específico
                $result = $character->getById($_GET['id'], $userId);
            } else {
                // Obtener todos los personajes del usuario
                $result = $character->getAll($userId);
            }

            http_response_code(200);
            echo json_encode($result);
            break;

        case 'POST':
            // Crear nuevo personaje
            $data = json_decode(file_get_contents('php://input'), true);

            if (empty($data)) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Datos inválidos']);
                exit();
            }

            $result = $character->create($userId, $data);

            if ($result['success']) {
                http_response_code(201);
            } else {
                http_response_code(400);
            }

            echo json_encode($result);
            break;

        case 'PUT':
        case 'PATCH':
            // Actualizar personaje existente
            $data = json_decode(file_get_contents('php://input'), true);

            if (empty($data) || empty($data['id'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'ID de personaje requerido']);
                exit();
            }

            $characterId = $data['id'];
            unset($data['id']); // Remover ID de los datos a actualizar

            $result = $character->update($characterId, $userId, $data);

            if ($result['success']) {
                http_response_code(200);
            } else {
                http_response_code(400);
            }

            echo json_encode($result);
            break;

        case 'DELETE':
            // Eliminar personaje
            $data = json_decode(file_get_contents('php://input'), true);

            if (empty($data['id'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'ID de personaje requerido']);
                exit();
            }

            $result = $character->delete($data['id'], $userId);

            if ($result['success']) {
                http_response_code(200);
            } else {
                http_response_code(404);
            }

            echo json_encode($result);
            break;

        default:
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Método no permitido']);
            break;
    }

} catch (Exception $e) {
    error_log("Error en characters endpoint: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error interno del servidor']);
}
