<?php
/**
 * Clase GameData
 * Gestiona la obtención de datos estáticos del juego (razas, clases, subclases, habilidades)
 */

class GameData {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    /**
     * Obtiene todas las razas
     * @return array
     */
    public function getRaces() {
        try {
            $stmt = $this->db->query("SELECT id, name, description, image_path FROM races ORDER BY name");
            
            return [
                'success' => true,
                'races' => $stmt->fetchAll()
            ];

        } catch (PDOException $e) {
            error_log("Error al obtener razas: " . $e->getMessage());
            return ['success' => false, 'message' => 'Error al cargar razas'];
        }
    }

    /**
     * Obtiene todas las clases
     * @return array
     */
    public function getClasses() {
        try {
            $stmt = $this->db->query("SELECT id, name, role, description FROM classes ORDER BY name");
            
            return [
                'success' => true,
                'classes' => $stmt->fetchAll()
            ];

        } catch (PDOException $e) {
            error_log("Error al obtener clases: " . $e->getMessage());
            return ['success' => false, 'message' => 'Error al cargar clases'];
        }
    }

    /**
     * Obtiene todas las subclases de una clase específica
     * @param int $classId
     * @return array
     */
    public function getSubclassesByClass($classId) {
        try {
            $stmt = $this->db->prepare("
                SELECT id, name, description 
                FROM subclasses 
                WHERE class_id = ? 
                ORDER BY name
            ");
            $stmt->execute([$classId]);
            
            return [
                'success' => true,
                'subclasses' => $stmt->fetchAll()
            ];

        } catch (PDOException $e) {
            error_log("Error al obtener subclases: " . $e->getMessage());
            return ['success' => false, 'message' => 'Error al cargar subclases'];
        }
    }

    /**
     * Obtiene habilidades de una clase o subclase
     * @param int|null $classId
     * @param int|null $subclassId
     * @return array
     */
    public function getAbilities($classId = null, $subclassId = null) {
        try {
            if ($subclassId) {
                // Obtener habilidades generales de la clase + habilidades de la subclase
                $stmt = $this->db->prepare("
                    SELECT id, name, description, is_general
                    FROM abilities 
                    WHERE (class_id = ? AND is_general = TRUE) OR subclass_id = ?
                    ORDER BY is_general DESC, name
                ");
                $stmt->execute([$classId, $subclassId]);
            } elseif ($classId) {
                // Solo habilidades generales de la clase
                $stmt = $this->db->prepare("
                    SELECT id, name, description, is_general
                    FROM abilities 
                    WHERE class_id = ? AND is_general = TRUE
                    ORDER BY name
                ");
                $stmt->execute([$classId]);
            } else {
                return ['success' => false, 'message' => 'Se requiere class_id o subclass_id'];
            }
            
            $abilities = $stmt->fetchAll();

            // Agrupar habilidades por tipo
            $general = [];
            $subclass = [];

            foreach ($abilities as $ability) {
                if ($ability['is_general']) {
                    $general[] = $ability;
                } else {
                    $subclass[] = $ability;
                }
            }

            return [
                'success' => true,
                'abilities' => [
                    'general' => $general,
                    'subclass' => $subclass,
                    'all' => $abilities
                ]
            ];

        } catch (PDOException $e) {
            error_log("Error al obtener habilidades: " . $e->getMessage());
            return ['success' => false, 'message' => 'Error al cargar habilidades'];
        }
    }

    /**
     * Obtiene información completa de una raza
     * @param int $raceId
     * @return array
     */
    public function getRaceById($raceId) {
        try {
            $stmt = $this->db->prepare("SELECT * FROM races WHERE id = ?");
            $stmt->execute([$raceId]);
            $race = $stmt->fetch();

            if (!$race) {
                return ['success' => false, 'message' => 'Raza no encontrada'];
            }

            return [
                'success' => true,
                'race' => $race
            ];

        } catch (PDOException $e) {
            error_log("Error al obtener raza: " . $e->getMessage());
            return ['success' => false, 'message' => 'Error al cargar raza'];
        }
    }
}
