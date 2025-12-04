<?php
/**
 * Clase Character
 * Gestiona operaciones CRUD de personajes
 */

class Character {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    /**
     * Obtiene todos los personajes de un usuario
     * @param int $userId
     * @return array
     */
    public function getAll($userId) {
        try {
            $stmt = $this->db->prepare("
                SELECT 
                    c.id,
                    c.name,
                    c.level,
                    c.created_at,
                    r.name as race_name,
                    r.image_path as race_image,
                    cl.name as class_name,
                    cl.role as class_role,
                    sc.name as subclass_name
                FROM characters c
                INNER JOIN races r ON c.race_id = r.id
                INNER JOIN classes cl ON c.class_id = cl.id
                INNER JOIN subclasses sc ON c.subclass_id = sc.id
                WHERE c.user_id = ?
                ORDER BY c.created_at DESC
            ");
            $stmt->execute([$userId]);
            
            return [
                'success' => true,
                'characters' => $stmt->fetchAll()
            ];

        } catch (PDOException $e) {
            error_log("Error al obtener personajes: " . $e->getMessage());
            return ['success' => false, 'message' => 'Error al cargar personajes'];
        }
    }

    /**
     * Obtiene un personaje por ID
     * @param int $characterId
     * @param int $userId
     * @return array
     */
    public function getById($characterId, $userId) {
        try {
            $stmt = $this->db->prepare("
                SELECT 
                    c.*,
                    r.name as race_name,
                    r.description as race_description,
                    r.image_path as race_image,
                    cl.name as class_name,
                    cl.role as class_role,
                    cl.description as class_description,
                    sc.name as subclass_name,
                    sc.description as subclass_description
                FROM characters c
                INNER JOIN races r ON c.race_id = r.id
                INNER JOIN classes cl ON c.class_id = cl.id
                INNER JOIN subclasses sc ON c.subclass_id = sc.id
                WHERE c.id = ? AND c.user_id = ?
            ");
            $stmt->execute([$characterId, $userId]);
            $character = $stmt->fetch();

            if (!$character) {
                return ['success' => false, 'message' => 'Personaje no encontrado'];
            }

            return [
                'success' => true,
                'character' => $character
            ];

        } catch (PDOException $e) {
            error_log("Error al obtener personaje: " . $e->getMessage());
            return ['success' => false, 'message' => 'Error al cargar personaje'];
        }
    }

    /**
     * Crea un nuevo personaje
     * @param int $userId
     * @param array $data
     * @return array
     */
    public function create($userId, $data) {
        try {
            // Validar datos requeridos
            $required = ['name', 'race_id', 'class_id', 'subclass_id'];
            foreach ($required as $field) {
                if (empty($data[$field])) {
                    return ['success' => false, 'message' => "Campo requerido: $field"];
                }
            }

            // Verificar que la subclase pertenece a la clase
            $stmt = $this->db->prepare("SELECT id FROM subclasses WHERE id = ? AND class_id = ?");
            $stmt->execute([$data['subclass_id'], $data['class_id']]);
            
            if (!$stmt->fetch()) {
                return ['success' => false, 'message' => 'La subclase no pertenece a la clase seleccionada'];
            }

            // Insertar personaje
            $stmt = $this->db->prepare("
                INSERT INTO characters (user_id, name, race_id, class_id, subclass_id, level)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            
            $level = $data['level'] ?? 1;
            $stmt->execute([
                $userId,
                $data['name'],
                $data['race_id'],
                $data['class_id'],
                $data['subclass_id'],
                $level
            ]);

            $characterId = $this->db->lastInsertId();

            return [
                'success' => true,
                'message' => 'Personaje creado correctamente',
                'character_id' => $characterId
            ];

        } catch (PDOException $e) {
            error_log("Error al crear personaje: " . $e->getMessage());
            return ['success' => false, 'message' => 'Error al crear personaje'];
        }
    }

    /**
     * Actualiza un personaje existente
     * @param int $characterId
     * @param int $userId
     * @param array $data
     * @return array
     */
    public function update($characterId, $userId, $data) {
        try {
            // Verificar que el personaje pertenece al usuario
            $stmt = $this->db->prepare("SELECT id FROM characters WHERE id = ? AND user_id = ?");
            $stmt->execute([$characterId, $userId]);
            
            if (!$stmt->fetch()) {
                return ['success' => false, 'message' => 'Personaje no encontrado'];
            }

            // Si se actualiza subclase, verificar que pertenece a la clase
            if (isset($data['class_id']) && isset($data['subclass_id'])) {
                $stmt = $this->db->prepare("SELECT id FROM subclasses WHERE id = ? AND class_id = ?");
                $stmt->execute([$data['subclass_id'], $data['class_id']]);
                
                if (!$stmt->fetch()) {
                    return ['success' => false, 'message' => 'La subclase no pertenece a la clase'];
                }
            }

            // Construir query dinámicamente
            $fields = [];
            $values = [];

            if (isset($data['name'])) {
                $fields[] = "name = ?";
                $values[] = $data['name'];
            }
            if (isset($data['race_id'])) {
                $fields[] = "race_id = ?";
                $values[] = $data['race_id'];
            }
            if (isset($data['class_id'])) {
                $fields[] = "class_id = ?";
                $values[] = $data['class_id'];
            }
            if (isset($data['subclass_id'])) {
                $fields[] = "subclass_id = ?";
                $values[] = $data['subclass_id'];
            }
            if (isset($data['level'])) {
                $fields[] = "level = ?";
                $values[] = $data['level'];
            }

            if (empty($fields)) {
                return ['success' => false, 'message' => 'No hay datos para actualizar'];
            }

            $values[] = $characterId;
            $values[] = $userId;

            $sql = "UPDATE characters SET " . implode(', ', $fields) . " WHERE id = ? AND user_id = ?";
            $stmt = $this->db->prepare($sql);
            $stmt->execute($values);

            return [
                'success' => true,
                'message' => 'Personaje actualizado correctamente'
            ];

        } catch (PDOException $e) {
            error_log("Error al actualizar personaje: " . $e->getMessage());
            return ['success' => false, 'message' => 'Error al actualizar personaje'];
        }
    }

    /**
     * Elimina un personaje
     * @param int $characterId
     * @param int $userId
     * @return array
     */
    public function delete($characterId, $userId) {
        try {
            $stmt = $this->db->prepare("DELETE FROM characters WHERE id = ? AND user_id = ?");
            $stmt->execute([$characterId, $userId]);

            if ($stmt->rowCount() === 0) {
                return ['success' => false, 'message' => 'Personaje no encontrado'];
            }

            return [
                'success' => true,
                'message' => 'Personaje eliminado correctamente'
            ];

        } catch (PDOException $e) {
            error_log("Error al eliminar personaje: " . $e->getMessage());
            return ['success' => false, 'message' => 'Error al eliminar personaje'];
        }
    }
}
