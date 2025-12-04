# Creador de Personajes RPG

Aplicación web completa para crear y gestionar personajes de juegos de rol (RPG) estilo World of Warcraft y Dungeons & Dragons.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Documentación de la API](#documentación-de-la-api)
- [Uso de la Aplicación](#uso-de-la-aplicación)
- [Pruebas](#pruebas)

## ✨ Características

### Backend (PHP + MySQL)

- ✅ Sistema de autenticación con hash de contraseñas (password_hash/password_verify)
- ✅ Gestión de sesiones PHP para mantener estado del usuario
- ✅ API REST completa con endpoints CRUD
- ✅ Conexión a base de datos mediante PDO
- ✅ Validación de datos y seguridad

### Frontend (JavaScript + HTML + CSS)

- ✅ Interfaz responsive (mobile-first)
- ✅ JavaScript modular y reutilizable
- ✅ Manipulación dinámica del DOM
- ✅ Validación de formularios con expresiones regulares
- ✅ Almacenamiento local (localStorage)
- ✅ Efectos CSS (hover, transiciones, animaciones)

### Sistema de Juego

- 🎭 5 Razas: Humano, Elfo, Enano, Orco, Drakoniano
- ⚔️ 5 Clases con roles definidos (Tank, Healer, DPS)
- 🎯 15 Subclases (3 por clase)
- ✨ Sistema de habilidades (4 generales + 2 por subclase)

## 🛠️ Tecnologías Utilizadas

### Backend

- **PHP 7.4+** - Lenguaje de servidor
- **MySQL 5.7+** - Base de datos
- **PDO** - Capa de abstracción de base de datos

### Frontend

- **HTML5** - Estructura semántica
- **CSS3** - Estilos y diseño responsive
  - CSS Grid y Flexbox para layouts
  - Media Queries para responsive
  - Variables CSS para theming
- **JavaScript (Vanilla)** - Lógica de cliente
  - Módulos separados por responsabilidad
  - Fetch API para llamadas HTTP
  - Event delegation para elementos dinámicos

### Fuentes

- **Cinzel** - Títulos medievales (Google Fonts)
- **Inter** - Texto de cuerpo (Google Fonts)

## 📦 Requisitos Previos

- **XAMPP** (o similar) con:
  - PHP 7.4 o superior
  - MySQL 5.7 o superior
  - Apache Web Server
- **Navegador web moderno** (Chrome, Firefox, Edge)
- **Cliente REST** para pruebas (Postman, Insomnia) - opcional

## 🚀 Instalación

### 1. Clonar/Copiar el Proyecto

Coloca el proyecto en la carpeta `htdocs` de XAMPP:

```
C:\xampp\htdocs\DAW\Ilerna\CreadorDePersonaje\
```

### 2. Crear la Base de Datos

1. Inicia XAMPP y arranca Apache y MySQL
2. Abre phpMyAdmin: `http://localhost/phpmyadmin`
3. Ejecuta el script SQL ubicado en `/database/database.sql`

Esto creará:

- Base de datos: `rpg_character_creator`
- 7 tablas con datos iniciales de razas, clases, subclases y habilidades

### 3. Configurar la Conexión

Verifica la configuración en `/api/config.php`:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'rpg_character_creator');
define('DB_USER', 'root');
define('DB_PASS', '');
```

### 4. Acceder a la Aplicación

Abre tu navegador y navega a:

```
http://localhost/DAW/Ilerna/CreadorDePersonaje/
```

## 📁 Estructura del Proyecto

```
CreadorDePersonaje/
├── api/
│   ├── config.php                  # Configuración de BD y sesiones
│   ├── classes/
│   │   ├── Database.php            # Gestión de conexión PDO
│   │   ├── Auth.php                # Autenticación de usuarios
│   │   ├── Character.php           # CRUD de personajes
│   │   └── GameData.php            # Datos del juego (razas, clases)
│   └── endpoints/
│       ├── register.php            # POST - Registro
│       ├── login.php               # POST - Login
│       ├── logout.php              # POST - Logout
│       ├── characters.php          # GET, POST, PUT, DELETE
│       ├── races.php               # GET - Razas
│       ├── classes.php             # GET - Clases
│       ├── subclasses.php          # GET - Subclases
│       └── abilities.php           # GET - Habilidades
├── assets/
│   └── images/
│       └── races/                  # Imágenes de razas (PNG)
├── css/
│   └── styles.css                  # Estilos principales
├── database/
│   └── database.sql                # Script de creación de BD
├── docs/
│   └── design_document.md          # Wireframes y guía de estilo
├── js/
│   ├── app.js                      # Lógica principal y estado
│   ├── auth.js                     # Autenticación y validación
│   ├── characters.js               # Gestión de personajes
│   └── creator.js                  # Creador de personajes
├── index.html                      # Página principal
├── credits.html                    # Créditos y atribuciones
└── README.md                       # Este archivo
```

## 🔌 Documentación de la API

### Base URL

```
http://localhost/DAW/Ilerna/CreadorDePersonaje/api/endpoints/
```

### Endpoints de Autenticación

#### Registro de Usuario

```http
POST /register.php
Content-Type: application/json

{
  "username": "usuario",
  "email": "usuario@email.com",
  "password": "contraseña123"
}
```

**Respuesta Exitosa (201):**

```json
{
  "success": true,
  "message": "Usuario registrado correctamente",
  "user_id": 1
}
```

#### Login

```http
POST /login.php
Content-Type: application/json

{
  "email": "usuario@email.com",
  "password": "contraseña123"
}
```

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Login exitoso",
  "user": {
    "id": 1,
    "username": "usuario",
    "email": "usuario@email.com"
  }
}
```

> **Nota:** El login establece una cookie de sesión que debe ser enviada en peticiones posteriores.

#### Logout

```http
POST /logout.php
```

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Sesión cerrada correctamente"
}
```

### Endpoints de Datos del Juego

#### Obtener Razas

```http
GET /races.php
```

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "races": [
    {
      "id": 1,
      "name": "Humano",
      "description": "Versátiles y adaptables...",
      "image_path": "assets/images/races/human.png"
    }
  ]
}
```

#### Obtener Clases

```http
GET /classes.php
```

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "classes": [
    {
      "id": 1,
      "name": "Guerrero",
      "role": "Tank",
      "description": "Maestros del combate..."
    }
  ]
}
```

#### Obtener Subclases

```http
GET /subclasses.php?class_id=1
```

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "subclasses": [
    {
      "id": 1,
      "name": "Protector",
      "description": "Especializado en defender aliados..."
    }
  ]
}
```

#### Obtener Habilidades

```http
GET /abilities.php?class_id=1&subclass_id=1
```

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "abilities": {
    "general": [
      {
        "id": 1,
        "name": "Golpe Poderoso",
        "description": "Un ataque devastador..."
      }
    ],
    "subclass": [
      {
        "id": 5,
        "name": "Bloqueo de Escudo",
        "description": "Bloquea completamente un ataque..."
      }
    ]
  }
}
```

### Endpoints de Personajes (Requieren Autenticación)

#### Listar Personajes del Usuario

```http
GET /characters.php
Cookie: PHPSESSID=...
```

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "characters": [
    {
      "id": 1,
      "name": "Aragorn",
      "level": 1,
      "race_name": "Humano",
      "class_name": "Guerrero",
      "class_role": "Tank",
      "subclass_name": "Protector",
      "created_at": "2025-11-27 18:00:00"
    }
  ]
}
```

#### Obtener Personaje Específico

```http
GET /characters.php?id=1
Cookie: PHPSESSID=...
```

#### Crear Personaje

```http
POST /characters.php
Cookie: PHPSESSID=...
Content-Type: application/json

{
  "name": "Aragorn",
  "race_id": 1,
  "class_id": 1,
  "subclass_id": 1,
  "level": 1
}
```

**Respuesta Exitosa (201):**

```json
{
  "success": true,
  "message": "Personaje creado correctamente",
  "character_id": 1
}
```

#### Actualizar Personaje

```http
PUT /characters.php
Cookie: PHPSESSID=...
Content-Type: application/json

{
  "id": 1,
  "name": "Aragorn II",
  "level": 5
}
```

#### Eliminar Personaje

```http
DELETE /characters.php
Cookie: PHPSESSID=...
Content-Type: application/json

{
  "id": 1
}
```

## 💻 Uso de la Aplicación

### Para Usuarios

1. **Registro:**

   - Abre la aplicación
   - Completa el formulario de registro
   - El sistema validará email y contraseña

2. **Login:**

   - Usa tus credenciales para iniciar sesión
   - Se establecerá una sesión persistente

3. **Crear Personaje:**

   - Click en "Crear Personaje"
   - Selecciona raza, clase y subclase
   - Visualiza las habilidades automáticamente
   - Guarda tu personaje

4. **Gestionar Personajes:**
   - Ver lista en el dashboard
   - Editar personajes existentes
   - Eliminar personajes (con confirmación)

## 🧪 Pruebas

### Pruebas con Postman/Insomnia

1. **Importar colección:**

   - Crea una nueva colección llamada "RPG Character Creator"

2. **Probar autenticación:**

   ```
   POST http://localhost/DAW/Ilerna/CreadorDePersonaje/api/endpoints/register.php
   POST http://localhost/DAW/Ilerna/CreadorDePersonaje/api/endpoints/login.php
   ```

3. **Verificar cookie de sesión:**

   - Después del login, verifica que se recibe la cookie `PHPSESSID`
   - Esta cookie debe enviarse automáticamente en peticiones posteriores

4. **Probar endpoints protegidos:**
   ```
   GET http://localhost/DAW/Ilerna/CreadorDePersonaje/api/endpoints/characters.php
   POST http://localhost/DAW/Ilerna/CreadorDePersonaje/api/endpoints/characters.php
   ```

### Pruebas en Navegador

1. **Abrir Consola de Desarrollador** (F12)
2. **Verificar logs:**

   - Los módulos JS registran mensajes en consola
   - Errores de red aparecen en la pestaña Network

3. **Probar responsive:**

   - Usar DevTools para simular dispositivos móviles
   - Verificar que el diseño se adapta correctamente

4. **Validación de formularios:**
   - Intentar registrar con email inválido
   - Intentar contraseña corta (< 6 caracteres)
   - Verificar mensajes de error

## 📊 Base de Datos

### Tablas Principales

- **users:** Usuarios registrados
- **races:** Razas disponibles (5)
- **classes:** Clases de personajes (5)
- **subclasses:** Especializaciones (15)
- **abilities:** Habilidades del juego
- **characters:** Personajes creados por usuarios

### Relaciones

```
users (1) ──── (N) characters
races (1) ──── (N) characters
classes (1) ──── (N) characters
classes (1) ──── (N) subclasses
subclasses (1) ──── (N) characters
classes (1) ──── (N) abilities
subclasses (1) ──── (N) abilities
```

## 🎯 Requisitos Académicos Cumplidos

### RA4 - Desarrollo Web Servidor (PHP)

- ✅ Sistema de autenticación con hash de contraseñas
- ✅ Mantenimiento de estado con sesiones PHP
- ✅ Cookies de sesión verificadas

### RA6 - Acceso a Datos

- ✅ Conexión a MySQL con PDO
- ✅ Endpoints GET para lectura (JSON)
- ✅ Endpoints POST, PUT, DELETE para escritura
- ✅ Documentación completa de API

### Desarrollo Web Cliente

- ✅ Sintaxis correcta de JavaScript
- ✅ Variables (let/const), condicionales, bucles
- ✅ Ámbitos de variables gestionados
- ✅ Comentarios explicativos
- ✅ Uso de console.log para depuración

### Objetos Predefinidos

- ✅ Generación dinámica de HTML con DOM
- ✅ Uso de document y métodos DOM
- ✅ Manipulación de clases con classList
- ✅ LocalStorage para datos no sensibles

### Estructuras Definidas

- ✅ Código modular (4 archivos JS)
- ✅ Funciones reutilizables
- ✅ Manejo correcto de arrays con forEach

### Manejo de Eventos

- ✅ addEventListener en todos los eventos
- ✅ Eventos submit, click
- ✅ preventDefault en formularios
- ✅ Expresiones regulares para validación
- ✅ Eventos en elementos dinámicos

### DOM

- ✅ Separación total: HTML, CSS externo, JS externo
- ✅ createElement, appendChild, textContent
- ✅ Manipulación completa del DOM

### Diseño de Interfaces

- ✅ Wireframes en documento de diseño
- ✅ Guía de estilo (colores y tipografías)
- ✅ CSS externo y clases reutilizables
- ✅ Diseño responsive con media queries
- ✅ Flexbox y CSS Grid
- ✅ Página de créditos con atribuciones
- ✅ Imágenes optimizadas
- ✅ Interactividad (hover, transiciones)

## 📝 Licencia

Proyecto académico para ILERNA - 2025

---

**Desarrollado con ⚔️ para el módulo de Desarrollo Web**
