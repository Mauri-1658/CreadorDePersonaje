-- =========================================
-- CREADOR DE PERSONAJES RPG - BASE DE DATOS
-- =========================================

DROP DATABASE IF EXISTS rpg_character_creator;
CREATE DATABASE rpg_character_creator CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE rpg_character_creator;

-- Tabla de Usuarios
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Razas
CREATE TABLE races (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    image_path VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Clases
CREATE TABLE classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    role ENUM('Tank', 'Healer', 'DPS') NOT NULL,
    description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Subclases
CREATE TABLE subclasses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    INDEX idx_class (class_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Habilidades
CREATE TABLE abilities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    class_id INT NULL,
    subclass_id INT NULL,
    is_general BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (subclass_id) REFERENCES subclasses(id) ON DELETE CASCADE,
    INDEX idx_class (class_id),
    INDEX idx_subclass (subclass_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Personajes
CREATE TABLE characters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    race_id INT NOT NULL,
    class_id INT NOT NULL,
    subclass_id INT NOT NULL,
    level INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (race_id) REFERENCES races(id),
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (subclass_id) REFERENCES subclasses(id),
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- DATOS INICIALES
-- =========================================

-- Insertar Razas
INSERT INTO races (name, description, image_path) VALUES
('Humano', 'Versátiles y adaptables, los humanos son la raza más común en los reinos.', 'assets/images/races/human.png'),
('Elfo', 'Longevos y sabios, los elfos poseen afinidad natural con la magia y el bosque.', 'assets/images/races/elf.png'),
('Enano', 'Fuertes y resistentes, destacan por su maestría en la forja y el combate.', 'assets/images/races/dwarf.png'),
('Orco', 'Guerreros feroces y poderosos, respetan la fuerza por encima de todo.', 'assets/images/races/orc.png'),
('Drakoniano', 'Descendientes de dragones, combinan poder físico con aliento elemental.', 'assets/images/races/dragonborn.png');

-- Insertar Clases
INSERT INTO classes (name, role, description) VALUES
('Guerrero', 'Tank', 'Maestros del combate cuerpo a cuerpo, protegen a sus aliados en primera línea.'),
('Clérigo', 'Healer', 'Canalizadores de energía divina, curan heridas y bendicen a sus compañeros.'),
('Mago', 'DPS', 'Eruditos del arcano, lanzan hechizos devastadores desde la distancia.'),
('Cazador', 'DPS', 'Expertos en combate a distancia y supervivencia en la naturaleza.'),
('Pícaro', 'DPS', 'Maestros del sigilo y los ataques precisos desde las sombras.');

-- Insertar Subclases del Guerrero
INSERT INTO subclasses (class_id, name, description) VALUES
(1, 'Protector', 'Especializado en defender aliados con escudo y armadura pesada.'),
(1, 'Gladiador', 'Combatiente de arena que domina múltiples estilos de armas.'),
(1, 'Berserker', 'Guerrero furioso que sacrifica defensa por poder destructivo.');

-- Insertar Subclases del Clérigo
INSERT INTO subclasses (class_id, name, description) VALUES
(2, 'Luz', 'Canaliza el poder de la luz para curar y castigar a los profanos.'),
(2, 'Vida', 'Dedicado a preservar la vida y fortalecer a los aliados.'),
(2, 'Orden', 'Impone disciplina divina en el campo de batalla.');

-- Insertar Subclases del Mago
INSERT INTO subclasses (class_id, name, description) VALUES
(3, 'Fuego', 'Maestro de la piromancia, destruye enemigos con llamas ardientes.'),
(3, 'Hielo', 'Controla el frío glacial para ralentizar y congelar oponentes.'),
(3, 'Arcano', 'Estudioso de la magia pura, manipula las energías místicas.');

-- Insertar Subclases del Cazador
INSERT INTO subclasses (class_id, name, description) VALUES
(4, 'Puntería', 'Francotirador maestro con precisión letal.'),
(4, 'Supervivencia', 'Experto en tácticas de guerrilla y trampas.'),
(4, 'Bestias', 'Convoca y controla criaturas salvajes para luchar a su lado.');

-- Insertar Subclases del Pícaro
INSERT INTO subclasses (class_id, name, description) VALUES
(5, 'Asesinato', 'Especialista en eliminaciones silenciosas y venenos letales.'),
(5, 'Sutileza', 'Maestro del sigilo y los trucos de sombra.'),
(5, 'Combate', 'Duelista ágil que combina velocidad con ataques precisos.');

-- =========================================
-- HABILIDADES DEL GUERRERO
-- =========================================

-- Habilidades generales del Guerrero
INSERT INTO abilities (name, description, class_id, is_general) VALUES
('Golpe Poderoso', 'Un ataque devastador que inflige daño masivo.', 1, TRUE),
('Grito de Guerra', 'Intimida a los enemigos reduciendo su moral.', 1, TRUE),
('Resistencia Férrea', 'Reduce el daño recibido temporalmente.', 1, TRUE),
('Carga Heroica', 'Se lanza contra el enemigo cerrando distancias.', 1, TRUE);

-- Habilidades del Protector
INSERT INTO abilities (name, description, subclass_id) VALUES
('Bloqueo de Escudo', 'Bloquea completamente un ataque con el escudo.', 1),
('Muro Inquebrantable', 'Protege a aliados cercanos absorbiendo daño.', 1);

-- Habilidades del Gladiador
INSERT INTO abilities (name, description, subclass_id) VALUES
('Maestría de Armas', 'Cambia entre armas adaptándose al combate.', 2),
('Embestida del Campeón', 'Serie de golpes rápidos contra múltiples enemigos.', 2);

-- Habilidades del Berserker
INSERT INTO abilities (name, description, subclass_id) VALUES
('Furia Salvaje', 'Aumenta drásticamente el daño ignorando el dolor.', 3),
('Sed de Sangre', 'Se cura con cada enemigo derrotado.', 3);

-- =========================================
-- HABILIDADES DEL CLÉRIGO
-- =========================================

-- Habilidades generales del Clérigo
INSERT INTO abilities (name, description, class_id, is_general) VALUES
('Curación Divina', 'Restaura una cantidad significativa de salud.', 2, TRUE),
('Bendición', 'Aumenta las capacidades de un aliado temporalmente.', 2, TRUE),
('Palabra Sagrada', 'Daña a los enemigos profanos con energía divina.', 2, TRUE),
('Escudo de Fe', 'Protege a un aliado con una barrera mágica.', 2, TRUE);

-- Habilidades de Luz
INSERT INTO abilities (name, description, subclass_id) VALUES
('Rayo de Luz', 'Dispara un rayo sagrado que atraviesa enemigos.', 4),
('Aura Radiante', 'Daña a enemigos cercanos con luz pura.', 4);

-- Habilidades de Vida
INSERT INTO abilities (name, description, subclass_id) VALUES
('Resurrección', 'Revive a un aliado caído con parte de su salud.', 5),
('Vitalidad Renovada', 'Regeneración continua de salud en área.', 5);

-- Habilidades de Orden
INSERT INTO abilities (name, description, subclass_id) VALUES
('Juicio Divino', 'Castiga a los enemigos que atacan a aliados.', 6),
('Ley Sagrada', 'Silencia hechizos enemigos en un área.', 6);

-- =========================================
-- HABILIDADES DEL MAGO
-- =========================================

-- Habilidades generales del Mago
INSERT INTO abilities (name, description, class_id, is_general) VALUES
('Bola de Fuego', 'Lanza una esfera de fuego explosiva.', 3, TRUE),
('Escudo Arcano', 'Crea una barrera mágica protectora.', 3, TRUE),
('Teletransporte', 'Se desplaza instantáneamente a corta distancia.', 3, TRUE),
('Misiles Arcanos', 'Proyectiles mágicos que persiguen al objetivo.', 3, TRUE);

-- Habilidades de Fuego
INSERT INTO abilities (name, description, subclass_id) VALUES
('Infierno', 'Convierte un área en un mar de llamas.', 7),
('Meteoro', 'Invoca una roca ardiente del cielo.', 7);

-- Habilidades de Hielo
INSERT INTO abilities (name, description, subclass_id) VALUES
('Ventisca', 'Tormenta de hielo que ralentiza y daña.', 8),
('Prisión de Hielo', 'Congela a un enemigo dejándolo inmóvil.', 8);

-- Habilidades Arcanas
INSERT INTO abilities (name, description, subclass_id) VALUES
('Explosión Arcana', 'Libera energía mágica pura en todas direcciones.', 9),
('Amplificación Mística', 'Aumenta el poder de todos los hechizos.', 9);

-- =========================================
-- HABILIDADES DEL CAZADOR
-- =========================================

-- Habilidades generales del Cazador
INSERT INTO abilities (name, description, class_id, is_general) VALUES
('Disparo Certero', 'Ataque a distancia con precisión aumentada.', 4, TRUE),
('Trampa de Cazador', 'Coloca una trampa que inmoviliza enemigos.', 4, TRUE),
('Ojo de Águila', 'Mejora la puntería y alcance temporalmente.', 4, TRUE),
('Rodar', 'Esquiva ágilmente ataques enemigos.', 4, TRUE);

-- Habilidades de Puntería
INSERT INTO abilities (name, description, subclass_id) VALUES
('Disparo Penetrante', 'Flecha que atraviesa múltiples objetivos.', 10),
('Tiro Mortal', 'Disparo crítico devastador a punto débil.', 10);

-- Habilidades de Supervivencia
INSERT INTO abilities (name, description, subclass_id) VALUES
('Camuflaje', 'Se vuelve prácticamente invisible en la naturaleza.', 11),
('Bomba de Humo', 'Crea cortina de humo para escapar o emboscar.', 11);

-- Habilidades de Bestias
INSERT INTO abilities (name, description, subclass_id) VALUES
('Invocar Lobo', 'Convoca un lobo espiritual que lucha a tu lado.', 12),
('Furia Bestial', 'Tu mascota entra en frenesí aumentando su poder.', 12);

-- =========================================
-- HABILIDADES DEL PÍCARO
-- =========================================

-- Habilidades generales del Pícaro
INSERT INTO abilities (name, description, class_id, is_general) VALUES
('Apuñalar', 'Ataque rápido con daga desde la sombra.', 5, TRUE),
('Evasión', 'Esquiva completamente un ataque.', 5, TRUE),
('Sigilo', 'Se vuelve invisible temporalmente.', 5, TRUE),
('Ataque Furtivo', 'Daño aumentado al atacar por la espalda.', 5, TRUE);

-- Habilidades de Asesinato
INSERT INTO abilities (name, description, subclass_id) VALUES
('Veneno Letal', 'Impregna armas con veneno mortal.', 13),
('Ejecución Silenciosa', 'Elimina instantáneamente objetivos debilitados.', 13);

-- Habilidades de Sutileza
INSERT INTO abilities (name, description, subclass_id) VALUES
('Paso de Sombras', 'Se teletransporta entre sombras.', 14),
('Capa y Daga', 'Se vuelve inmune a daño brevemente.', 14);

-- Habilidades de Combate
INSERT INTO abilities (name, description, subclass_id) VALUES
('Corte Relámpago', 'Serie de ataques veloces con ambas dagas.', 15),
('Riposte', 'Contraataca después de esquivar un golpe.', 15);
