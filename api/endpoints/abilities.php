<?php
/**
 * Endpoint: Habilidades
 * Método: GET
 * Descripción: Obtiene habilidades filtradas por clase y/o subclase
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
    $classId = $_GET['class_id'] ?? null;
    $subclassId = $_GET['subclass_id'] ?? null;

    if (empty($classId)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Se requiere class_id']);
        exit();
    }

    $gameData = new GameData();
    $result = $gameData->getAbilities($classId, $subclassId);

    http_response_code(200);
    echo json_encode($result);

} catch (Exception $e) {
    error_log("Error en abilities endpoint: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error interno del servidor']);
}
