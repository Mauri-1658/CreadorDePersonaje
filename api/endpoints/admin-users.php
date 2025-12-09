<?php
/**
 * Endpoint: Gestión de Usuarios (Admin)
 * Métodos: GET (listar), DELETE (eliminar)
 */

require_once '../config.php';
require_once '../classes/Database.php';
require_once '../classes/Auth.php';

$auth = new Auth();

// Verificar autenticación y permisos de admin
if (!$auth->isAuthenticated()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'No autenticado']);
    exit();
}

if (!$auth->isAdmin()) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Acceso denegado']);
    exit();
}

$db = Database::getInstance()->getConnection();

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        // Listar todos los usuarios
        try {
            $stmt = $db->query("
                SELECT u.id, u.username, u.email, u.is_admin, u.created_at,
                       COUNT(c.id) as character_count
                FROM users u
                LEFT JOIN characters c ON u.id = c.user_id
                GROUP BY u.id
                ORDER BY u.created_at DESC
            ");
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                'success' => true,
                'users' => $users
            ]);
        } catch (Exception $e) {
            error_log("Error al listar usuarios: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error interno']);
        }
        break;

    case 'DELETE':
        // Eliminar usuario
        try {
            $data = json_decode(file_get_contents('php://input'), true);

            if (empty($data['id'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'ID de usuario requerido']);
                exit();
            }

            $userId = $data['id'];
            $currentUserId = $auth->getUserId();

            // No permitir eliminar el propio usuario
            if ($userId == $currentUserId) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'No puedes eliminarte a ti mismo']);
                exit();
            }

            // Eliminar personajes del usuario primero
            $stmt = $db->prepare("DELETE FROM characters WHERE user_id = ?");
            $stmt->execute([$userId]);

            // Eliminar usuario
            $stmt = $db->prepare("DELETE FROM users WHERE id = ?");
            $stmt->execute([$userId]);

            if ($stmt->rowCount() === 0) {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Usuario no encontrado']);
                exit();
            }

            echo json_encode([
                'success' => true,
                'message' => 'Usuario eliminado correctamente'
            ]);

        } catch (Exception $e) {
            error_log("Error al eliminar usuario: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error interno']);
        }
        break;

    case 'PUT':
        // Cambiar estado de admin
        try {
            $data = json_decode(file_get_contents('php://input'), true);

            if (empty($data['id'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'ID de usuario requerido']);
                exit();
            }

            $userId = $data['id'];
            $isAdmin = $data['is_admin'] ?? false;
            $currentUserId = $auth->getUserId();

            // No permitir quitarse admin a sí mismo
            if ($userId == $currentUserId && !$isAdmin) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'No puedes quitarte permisos de admin a ti mismo']);
                exit();
            }

            $stmt = $db->prepare("UPDATE users SET is_admin = ? WHERE id = ?");
            $stmt->execute([$isAdmin ? 1 : 0, $userId]);

            if ($stmt->rowCount() === 0) {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Usuario no encontrado']);
                exit();
            }

            echo json_encode([
                'success' => true,
                'message' => $isAdmin ? 'Usuario ahora es administrador' : 'Permisos de admin eliminados'
            ]);

        } catch (Exception $e) {
            error_log("Error al cambiar admin: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error interno']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
