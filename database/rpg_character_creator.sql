-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 09-12-2025 a las 18:56:14
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12
CREATE DATABASE IF NOT EXISTS `rpg_character_creator` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `rpg_character_creator`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `abilities`
--

CREATE TABLE `abilities` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `class_id` int(11) DEFAULT NULL,
  `subclass_id` int(11) DEFAULT NULL,
  `is_general` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `abilities`
--

INSERT INTO `abilities` (`id`, `name`, `description`, `class_id`, `subclass_id`, `is_general`) VALUES
(1, 'Golpe Poderoso', 'Un ataque devastador que inflige daño masivo.', 1, NULL, 1),
(2, 'Grito de Guerra', 'Intimida a los enemigos reduciendo su moral.', 1, NULL, 1),
(3, 'Resistencia Férrea', 'Reduce el daño recibido temporalmente.', 1, NULL, 1),
(4, 'Carga Heroica', 'Se lanza contra el enemigo cerrando distancias.', 1, NULL, 1),
(5, 'Bloqueo de Escudo', 'Bloquea completamente un ataque con el escudo.', NULL, 1, 0),
(6, 'Muro Inquebrantable', 'Protege a aliados cercanos absorbiendo daño.', NULL, 1, 0),
(7, 'Maestría de Armas', 'Cambia entre armas adaptándose al combate.', NULL, 2, 0),
(8, 'Embestida del Campeón', 'Serie de golpes rápidos contra múltiples enemigos.', NULL, 2, 0),
(9, 'Furia Salvaje', 'Aumenta drásticamente el daño ignorando el dolor.', NULL, 3, 0),
(10, 'Sed de Sangre', 'Se cura con cada enemigo derrotado.', NULL, 3, 0),
(11, 'Curación Divina', 'Restaura una cantidad significativa de salud.', 2, NULL, 1),
(12, 'Bendición', 'Aumenta las capacidades de un aliado temporalmente.', 2, NULL, 1),
(13, 'Palabra Sagrada', 'Daña a los enemigos profanos con energía divina.', 2, NULL, 1),
(14, 'Escudo de Fe', 'Protege a un aliado con una barrera mágica.', 2, NULL, 1),
(15, 'Rayo de Luz', 'Dispara un rayo sagrado que atraviesa enemigos.', NULL, 4, 0),
(16, 'Aura Radiante', 'Daña a enemigos cercanos con luz pura.', NULL, 4, 0),
(17, 'Resurrección', 'Revive a un aliado caído con parte de su salud.', NULL, 5, 0),
(18, 'Vitalidad Renovada', 'Regeneración continua de salud en área.', NULL, 5, 0),
(19, 'Juicio Divino', 'Castiga a los enemigos que atacan a aliados.', NULL, 6, 0),
(20, 'Ley Sagrada', 'Silencia hechizos enemigos en un área.', NULL, 6, 0),
(21, 'Bola de Fuego', 'Lanza una esfera de fuego explosiva.', 3, NULL, 1),
(22, 'Escudo Arcano', 'Crea una barrera mágica protectora.', 3, NULL, 1),
(23, 'Teletransporte', 'Se desplaza instantáneamente a corta distancia.', 3, NULL, 1),
(24, 'Misiles Arcanos', 'Proyectiles mágicos que persiguen al objetivo.', 3, NULL, 1),
(25, 'Infierno', 'Convierte un área en un mar de llamas.', NULL, 7, 0),
(26, 'Meteoro', 'Invoca una roca ardiente del cielo.', NULL, 7, 0),
(27, 'Ventisca', 'Tormenta de hielo que ralentiza y daña.', NULL, 8, 0),
(28, 'Prisión de Hielo', 'Congela a un enemigo dejándolo inmóvil.', NULL, 8, 0),
(29, 'Explosión Arcana', 'Libera energía mágica pura en todas direcciones.', NULL, 9, 0),
(30, 'Amplificación Mística', 'Aumenta el poder de todos los hechizos.', NULL, 9, 0),
(31, 'Disparo Certero', 'Ataque a distancia con precisión aumentada.', 4, NULL, 1),
(32, 'Trampa de Cazador', 'Coloca una trampa que inmoviliza enemigos.', 4, NULL, 1),
(33, 'Ojo de Águila', 'Mejora la puntería y alcance temporalmente.', 4, NULL, 1),
(34, 'Rodar', 'Esquiva ágilmente ataques enemigos.', 4, NULL, 1),
(35, 'Disparo Penetrante', 'Flecha que atraviesa múltiples objetivos.', NULL, 10, 0),
(36, 'Tiro Mortal', 'Disparo crítico devastador a punto débil.', NULL, 10, 0),
(37, 'Camuflaje', 'Se vuelve prácticamente invisible en la naturaleza.', NULL, 11, 0),
(38, 'Bomba de Humo', 'Crea cortina de humo para escapar o emboscar.', NULL, 11, 0),
(39, 'Invocar Lobo', 'Convoca un lobo espiritual que lucha a tu lado.', NULL, 12, 0),
(40, 'Furia Bestial', 'Tu mascota entra en frenesí aumentando su poder.', NULL, 12, 0),
(41, 'Apuñalar', 'Ataque rápido con daga desde la sombra.', 5, NULL, 1),
(42, 'Evasión', 'Esquiva completamente un ataque.', 5, NULL, 1),
(43, 'Sigilo', 'Se vuelve invisible temporalmente.', 5, NULL, 1),
(44, 'Ataque Furtivo', 'Daño aumentado al atacar por la espalda.', 5, NULL, 1),
(45, 'Veneno Letal', 'Impregna armas con veneno mortal.', NULL, 13, 0),
(46, 'Ejecución Silenciosa', 'Elimina instantáneamente objetivos debilitados.', NULL, 13, 0),
(47, 'Paso de Sombras', 'Se teletransporta entre sombras.', NULL, 14, 0),
(48, 'Capa y Daga', 'Se vuelve inmune a daño brevemente.', NULL, 14, 0),
(49, 'Corte Relámpago', 'Serie de ataques veloces con ambas dagas.', NULL, 15, 0),
(50, 'Riposte', 'Contraataca después de esquivar un golpe.', NULL, 15, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `characters`
--

CREATE TABLE `characters` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `race_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `subclass_id` int(11) NOT NULL,
  `level` int(11) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_main` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `characters`
--

INSERT INTO `characters` (`id`, `user_id`, `name`, `race_id`, `class_id`, `subclass_id`, `level`, `created_at`, `updated_at`, `is_main`) VALUES
(1, 1, 'asd', 3, 1, 2, 1, '2025-12-09 16:13:52', '2025-12-09 16:13:52', 0),
(2, 1, 'Tixiords', 2, 5, 15, 1, '2025-12-09 16:17:37', '2025-12-09 17:47:55', 1),
(3, 1, 'tyutyu', 2, 1, 3, 1, '2025-12-09 17:00:47', '2025-12-09 17:47:55', 0),
(4, 2, 'erte', 3, 1, 2, 1, '2025-12-09 17:19:02', '2025-12-09 17:19:02', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `classes`
--

CREATE TABLE `classes` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `role` enum('Tank','Healer','DPS') NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `classes`
--

INSERT INTO `classes` (`id`, `name`, `role`, `description`) VALUES
(1, 'Guerrero', 'Tank', 'Maestros del combate cuerpo a cuerpo, protegen a sus aliados en primera línea.'),
(2, 'Clérigo', 'Healer', 'Canalizadores de energía divina, curan heridas y bendicen a sus compañeros.'),
(3, 'Mago', 'DPS', 'Eruditos del arcano, lanzan hechizos devastadores desde la distancia.'),
(4, 'Cazador', 'DPS', 'Expertos en combate a distancia y supervivencia en la naturaleza.'),
(5, 'Pícaro', 'DPS', 'Maestros del sigilo y los ataques precisos desde las sombras.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `races`
--

CREATE TABLE `races` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `races`
--

INSERT INTO `races` (`id`, `name`, `description`, `image_path`) VALUES
(1, 'Humano', 'Versátiles y adaptables, los humanos son la raza más común en los reinos.', 'assets/images/races/human.png'),
(2, 'Elfo', 'Longevos y sabios, los elfos poseen afinidad natural con la magia y el bosque.', 'assets/images/races/elf.png'),
(3, 'Enano', 'Fuertes y resistentes, destacan por su maestría en la forja y el combate.', 'assets/images/races/dwarf.png'),
(4, 'Orco', 'Guerreros feroces y poderosos, respetan la fuerza por encima de todo.', 'assets/images/races/orc.png'),
(5, 'Drakoniano', 'Descendientes de dragones, combinan poder físico con aliento elemental.', 'assets/images/races/dragonborn.png');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `subclasses`
--

CREATE TABLE `subclasses` (
  `id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `subclasses`
--

INSERT INTO `subclasses` (`id`, `class_id`, `name`, `description`) VALUES
(1, 1, 'Protector', 'Especializado en defender aliados con escudo y armadura pesada.'),
(2, 1, 'Gladiador', 'Combatiente de arena que domina múltiples estilos de armas.'),
(3, 1, 'Berserker', 'Guerrero furioso que sacrifica defensa por poder destructivo.'),
(4, 2, 'Luz', 'Canaliza el poder de la luz para curar y castigar a los profanos.'),
(5, 2, 'Vida', 'Dedicado a preservar la vida y fortalecer a los aliados.'),
(6, 2, 'Orden', 'Impone disciplina divina en el campo de batalla.'),
(7, 3, 'Fuego', 'Maestro de la piromancia, destruye enemigos con llamas ardientes.'),
(8, 3, 'Hielo', 'Controla el frío glacial para ralentizar y congelar oponentes.'),
(9, 3, 'Arcano', 'Estudioso de la magia pura, manipula las energías místicas.'),
(10, 4, 'Puntería', 'Francotirador maestro con precisión letal.'),
(11, 4, 'Supervivencia', 'Experto en tácticas de guerrilla y trampas.'),
(12, 4, 'Bestias', 'Convoca y controla criaturas salvajes para luchar a su lado.'),
(13, 5, 'Asesinato', 'Especialista en eliminaciones silenciosas y venenos letales.'),
(14, 5, 'Sutileza', 'Maestro del sigilo y los trucos de sombra.'),
(15, 5, 'Combate', 'Duelista ágil que combina velocidad con ataques precisos.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `created_at`) VALUES
(1, 'Mauri', 'mauri@gmail.com', '$2y$10$C.e3qh20IsRtZn7Am8FpXuYoaYw13G0PF6spCKJ4f7HThxLmkS6Eq', '2025-12-09 16:01:19'),
(2, 'manuel', 'manuel@gmail.com', '$2y$10$y3kDJMHbp8yiS4d8kgS4EuHsDtGv4zdhcX9fy6OjDVfUjKIrVfntO', '2025-12-09 17:05:21'),
(3, 'test', 'test@test.com', '$2y$10$A2Na8iVilbCWiw3uSu3s8OxYfWtkX7l1qJP7BHBI7bRnh1xreMIIy', '2025-12-09 17:07:52'),
(4, 'test2', 'test2@test.com', '$2y$10$7hilnnxzRukAyzOGKKkEx.o3SVVEknd9ipsbxOVruAD1Xo03DR7ia', '2025-12-09 17:08:40'),
(5, 'test3', 'test3@test.com', '$2y$10$unEVgWirVGxL9qgEfeuYhuP/MtJYrCHT3PzTxEDXkyObBX7QG/V.O', '2025-12-09 17:30:03'),
(6, 'test4', 'test4@test.com', '$2y$10$1aLFQP8bZVC4NL6dK1vr1.CxXmIrW9b7J5UNmIw1iVHafV6/AtOyS', '2025-12-09 17:30:52');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `abilities`
--
ALTER TABLE `abilities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_class` (`class_id`),
  ADD KEY `idx_subclass` (`subclass_id`);

--
-- Indices de la tabla `characters`
--
ALTER TABLE `characters`
  ADD PRIMARY KEY (`id`),
  ADD KEY `race_id` (`race_id`),
  ADD KEY `class_id` (`class_id`),
  ADD KEY `subclass_id` (`subclass_id`),
  ADD KEY `idx_user` (`user_id`);

--
-- Indices de la tabla `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `races`
--
ALTER TABLE `races`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `subclasses`
--
ALTER TABLE `subclasses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_class` (`class_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `abilities`
--
ALTER TABLE `abilities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT de la tabla `characters`
--
ALTER TABLE `characters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `classes`
--
ALTER TABLE `classes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `races`
--
ALTER TABLE `races`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `subclasses`
--
ALTER TABLE `subclasses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `abilities`
--
ALTER TABLE `abilities`
  ADD CONSTRAINT `abilities_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `abilities_ibfk_2` FOREIGN KEY (`subclass_id`) REFERENCES `subclasses` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `characters`
--
ALTER TABLE `characters`
  ADD CONSTRAINT `characters_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `characters_ibfk_2` FOREIGN KEY (`race_id`) REFERENCES `races` (`id`),
  ADD CONSTRAINT `characters_ibfk_3` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`),
  ADD CONSTRAINT `characters_ibfk_4` FOREIGN KEY (`subclass_id`) REFERENCES `subclasses` (`id`);

--
-- Filtros para la tabla `subclasses`
--
ALTER TABLE `subclasses`
  ADD CONSTRAINT `subclasses_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
