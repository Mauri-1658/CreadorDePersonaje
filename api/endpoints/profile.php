<?php
/**
 * Endpoint: Perfil de Usuario
 * Métodos: GET (obtener perfil), PUT (cambiar contraseña)
 */

require_once '../config.php';
require_once '../classes/Database.php';
require_once '../classes/Auth.php';

$auth = new Auth();

// Verificar autenticación
if (!$auth->isAuthenticated()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'No autenticado']);
    exit();
}

$userId = $auth->getUserId();

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        // Obtener datos del perfil
        try {
            $userData = $auth->getFullUserData($userId);
            
            if (!$userData) {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Usuario no encontrado']);
                exit();
            }

            // Obtener personaje principal
            $db = Database::getInstance()->getConnection();
            $stmt = $db->prepare("
                SELECT c.*, r.name as race_name, cl.name as class_name, s.name as subclass_name
                FROM characters c
                LEFT JOIN races r ON c.race_id = r.id
                LEFT JOIN classes cl ON c.class_id = cl.id
                LEFT JOIN subclasses s ON c.subclass_id = s.id
                WHERE c.user_id = ? AND c.is_main = TRUE
                LIMIT 1
            ");
            $stmt->execute([$userId]);
            $mainCharacter = $stmt->fetch(PDO::FETCH_ASSOC);

            echo json_encode([
                'success' => true,
                'user' => [
                    'id' => $userData['id'],
                    'username' => $userData['username'],
                    'email' => $userData['email'],
                    'created_at' => $userData['created_at']
                ],
                'main_character' => $mainCharacter ?: null
            ]);

        } catch (Exception $e) {
            error_log("Error al obtener perfil: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error interno del servidor']);
        }
        break;

    case 'PUT':
        // Cambiar contraseña
        try {
            $data = json_decode(file_get_contents('php://input'), true);

            if (empty($data['current_password']) || empty($data['new_password'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Contraseña actual y nueva son requeridas']);
                exit();
            }

            if ($data['new_password'] !== ($data['confirm_password'] ?? '')) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Las contraseñas no coinciden']);
                exit();
            }

            $result = $auth->changePassword($userId, $data['current_password'], $data['new_password']);

            if ($result['success']) {
                http_response_code(200);
            } else {
                http_response_code(400);
            }

            echo json_encode($result);

        } catch (Exception $e) {
            error_log("Error al cambiar contraseña: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error interno del servidor']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
