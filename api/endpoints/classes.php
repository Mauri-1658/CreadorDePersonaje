<?php
/**
 * Endpoint: Clases
 * Método: GET
 * Descripción: Obtiene todas las clases disponibles
 */

require_once '../config.php';
require_once '../classes/Database.php';
require_once '../classes/GameData.php';

// Solo permitir GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit();
}

try {
    $gameData = new GameData();
    $result = $gameData->getClasses();

    http_response_code(200);
    echo json_encode($result);

} catch (Exception $e) {
    error_log("Error en classes endpoint: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error interno del servidor']);
}
