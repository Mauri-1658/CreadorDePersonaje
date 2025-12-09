<?php
/**
 * Configuración de la Base de Datos y Sesiones
 */

// Configuración de la base de datos
define('DB_HOST', 'localhost');
define('DB_NAME', 'rpg_character_creator');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// Configuración de sesiones
ini_set('session.cookie_httponly', 1);
ini_set('session.use_strict_mode', 1);
ini_set('session.cookie_samesite', 'Strict');

// Iniciar sesión si no está iniciada
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Configurar headers para CORS y JSON
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar peticiones OPTIONS (preflight)
if (['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Desactivar la salida de errores de PHP para que no interfiera con JSON
ini_set('display_errors', 0);
error_reporting(E_ALL);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../php_errors.log');
