<?php
/**
 * Endpoint: Dashboard de Administración
 * Método: GET - Obtiene estadísticas generales
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
    echo json_encode(['success' => false, 'message' => 'Acceso denegado. Se requieren permisos de administrador']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit();
}

try {
    $db = Database::getInstance()->getConnection();

    // Total de usuarios
    $stmt = $db->query("SELECT COUNT(*) as total FROM users");
    $totalUsers = $stmt->fetch()['total'];

    // Total de personajes
    $stmt = $db->query("SELECT COUNT(*) as total FROM characters");
    $totalCharacters = $stmt->fetch()['total'];

    // Clases más populares
    $stmt = $db->query("
        SELECT cl.name, COUNT(c.id) as count 
        FROM characters c 
        INNER JOIN classes cl ON c.class_id = cl.id 
        GROUP BY cl.id, cl.name 
        ORDER BY count DESC 
        LIMIT 5
    ");
    $popularClasses = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Razas más populares
    $stmt = $db->query("
        SELECT r.name, COUNT(c.id) as count 
        FROM characters c 
        INNER JOIN races r ON c.race_id = r.id 
        GROUP BY r.id, r.name 
        ORDER BY count DESC 
        LIMIT 5
    ");
    $popularRaces = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Usuarios recientes (últimos 5)
    $stmt = $db->query("
        SELECT id, username, email, created_at 
        FROM users 
        ORDER BY created_at DESC 
        LIMIT 5
    ");
    $recentUsers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Personajes recientes (últimos 5)
    $stmt = $db->query("
        SELECT c.name, c.level, u.username, c.created_at,
               r.name as race_name, cl.name as class_name
        FROM characters c
        INNER JOIN users u ON c.user_id = u.id
        INNER JOIN races r ON c.race_id = r.id
        INNER JOIN classes cl ON c.class_id = cl.id
        ORDER BY c.created_at DESC 
        LIMIT 5
    ");
    $recentCharacters = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'stats' => [
            'total_users' => (int)$totalUsers,
            'total_characters' => (int)$totalCharacters,
            'popular_classes' => $popularClasses,
            'popular_races' => $popularRaces,
            'recent_users' => $recentUsers,
            'recent_characters' => $recentCharacters
        ]
    ]);

} catch (Exception $e) {
    error_log("Error en admin dashboard: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error interno del servidor']);
}
