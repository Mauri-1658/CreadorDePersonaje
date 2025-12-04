<?php
/**
 * Clase Auth
 * Gestiona la autenticación de usuarios (registro, login, logout, sesiones)
 */

class Auth {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    /**
     * Registra un nuevo usuario
     * @param string $username
     * @param string $email
     * @param string $password
     * @return array
     */
    public function register($username, $email, $password) {
        try {
            // Validar que no exista el email
            $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$email]);
            
            if ($stmt->fetch()) {
                return ['success' => false, 'message' => 'El email ya está registrado'];
            }

            // Validar que no exista el username
            $stmt = $this->db->prepare("SELECT id FROM users WHERE username = ?");
            $stmt->execute([$username]);
            
            if ($stmt->fetch()) {
                return ['success' => false, 'message' => 'El nombre de usuario ya existe'];
            }

            // Hash de la contraseña con password_hash
            $passwordHash = password_hash($password, PASSWORD_BCRYPT);

            // Insertar usuario
            $stmt = $this->db->prepare(
                "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)"
            );
            $stmt->execute([$username, $email, $passwordHash]);

            return [
                'success' => true,
                'message' => 'Usuario registrado correctamente',
                'user_id' => $this->db->lastInsertId()
            ];

        } catch (PDOException $e) {
            error_log("Error en registro: " . $e->getMessage());
            return ['success' => false, 'message' => 'Error al registrar usuario'];
        }
    }

    /**
     * Inicia sesión de usuario
     * @param string $email
     * @param string $password
     * @return array
     */
    public function login($email, $password) {
        try {
            // Buscar usuario por email
            $stmt = $this->db->prepare(
                "SELECT id, username, email, password_hash FROM users WHERE email = ?"
            );
            $stmt->execute([$email]);
            $user = $stmt->fetch();

            if (!$user) {
                return ['success' => false, 'message' => 'Credenciales incorrectas'];
            }

            // Verificar contraseña con password_verify
            if (!password_verify($password, $user['password_hash'])) {
                return ['success' => false, 'message' => 'Credenciales incorrectas'];
            }

            // Iniciar sesión
            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }

            // Regenerar ID de sesión por seguridad
            session_regenerate_id(true);

            // Guardar datos en sesión
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['logged_in'] = true;

            return [
                'success' => true,
                'message' => 'Login exitoso',
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'email' => $user['email']
                ]
            ];

        } catch (PDOException $e) {
            error_log("Error en login: " . $e->getMessage());
            return ['success' => false, 'message' => 'Error al iniciar sesión'];
        }
    }

    /**
     * Cierra la sesión del usuario
     * @return array
     */
    public function logout() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        // Limpiar variables de sesión
        $_SESSION = [];

        // Destruir cookie de sesión
        if (isset($_COOKIE[session_name()])) {
            setcookie(session_name(), '', time() - 3600, '/');
        }

        // Destruir sesión
        session_destroy();

        return ['success' => true, 'message' => 'Sesión cerrada correctamente'];
    }

    /**
     * Verifica si el usuario está autenticado
     * @return bool
     */
    public function isAuthenticated() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        return isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true;
    }

    /**
     * Obtiene el ID del usuario autenticado
     * @return int|null
     */
    public function getUserId() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        return $_SESSION['user_id'] ?? null;
    }

    /**
     * Obtiene los datos del usuario autenticado
     * @return array|null
     */
    public function getUserData() {
        if (!$this->isAuthenticated()) {
            return null;
        }

        return [
            'id' => $_SESSION['user_id'],
            'username' => $_SESSION['username'],
            'email' => $_SESSION['email']
        ];
    }
}
