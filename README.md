# Nexo - Creador de Personajes RPG

Aplicación web completa para crear y gestionar personajes de juegos de rol (RPG) estilo World of Warcraft y Dungeons & Dragons.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Documentación de la API](#documentación-de-la-api)
- [Uso de la Aplicación](#uso-de-la-aplicación)

## ✨ Características

### Backend (PHP + MySQL)

- ✅ Sistema de autenticación con hash de contraseñas (password_hash/password_verify)
- ✅ Gestión de sesiones PHP para mantener estado del usuario
- ✅ API REST completa con endpoints CRUD
- ✅ Conexión a base de datos mediante PDO
- ✅ Validación de datos y seguridad
- ✅ Cambio de contraseña con verificación de contraseña actual
- ✅ Cambio de nombre de usuario
- ✅ Sistema de personaje principal/favorito
- ✅ Panel de administración

### Frontend (JavaScript + HTML + CSS)

- ✅ Interfaz responsive (mobile-first)
- ✅ JavaScript modular y reutilizable
- ✅ Manipulación dinámica del DOM
- ✅ Validación de formularios con expresiones regulares
- ✅ Almacenamiento local (localStorage)
- ✅ Efectos CSS (hover, transiciones, animaciones)
- ✅ Perfil de usuario con información y cambio de contraseña
- ✅ Selector de nivel de personaje (1-60)

### Sistema de Juego

- 🎭 5 Razas: Humano, Elfo, Enano, Orco, Drakoniano
- ⚔️ 5 Clases con roles definidos (Tank, Healer, DPS)
- 🎯 15 Subclases (3 por clase)
- ✨ Sistema de habilidades (4 generales + 2 por subclase)
- ⭐ Sistema de personaje principal/favorito

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

## 🚀 Instalación

### 1. Clonar/Copiar el Proyecto

Coloca el proyecto en la carpeta `htdocs` de XAMPP:

```
C:\xampp\htdocs\CreadorDePersonaje\
```

### 2. Crear la Base de Datos

1. Inicia XAMPP y arranca Apache y MySQL
2. Abre phpMyAdmin: `http://localhost/phpmyadmin`
3. Ejecuta el script SQL ubicado en `/database/rpg_character_creator.sql`

Esto creará:

- Base de datos: `rpg_character_creator`
- Tablas con datos iniciales de razas, clases, subclases y habilidades

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
http://localhost/CreadorDePersonaje/
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
│       ├── profile.php             # GET, PUT - Perfil y cambio contraseña
│       ├── change-username.php     # POST - Cambiar nombre de usuario
│       ├── set-main.php            # POST - Establecer personaje principal
│       ├── characters.php          # GET, POST, PUT, DELETE
│       ├── admin.php               # GET - Dashboard admin
│       ├── admin-users.php         # GET, PUT, DELETE - Gestión usuarios
│       ├── races.php               # GET - Razas
│       ├── classes.php             # GET - Clases
│       ├── subclasses.php          # GET - Subclases
│       └── abilities.php           # GET - Habilidades
├── assets/
│   └── images/
│       ├── Logo.png                # Logo de Nexo
│       ├── races/                  # Imágenes de razas
│       └── classes/                # Imágenes de clases y subclases
├── css/
│   └── styles.css                  # Estilos principales
├── database/
│   └── rpg_character_creator.sql   # Script de creación de BD
├── views/
│   ├── dashboard.html              # Vista de personajes
│   ├── creator.html                # Creador de personajes
│   ├── profile.html                # Perfil de usuario
│   ├── admin.html                  # Panel de administración
│   └── login.html                  # Login y registro
├── js/
│   ├── nav.js                      # Navegación compartida
│   ├── auth.js                     # Autenticación
│   ├── dashboard.js                # Lista de personajes
│   ├── creator-page.js             # Creador de personajes
│   ├── profile-page.js             # Perfil de usuario
│   └── admin.js                    # Panel de administración
├── index.html                      # Página principal
├── credits.html                    # Créditos y atribuciones
└── README.md                       # Este archivo
```

## 🔌 Documentación de la API

### Base URL

```
http://localhost/CreadorDePersonaje/api/endpoints/
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

#### Login

```http
POST /login.php
Content-Type: application/json

{
  "email": "usuario@email.com",
  "password": "contraseña123"
}
```

#### Logout

```http
POST /logout.php
```

### Endpoints de Personajes (Requieren Autenticación)

#### Listar Personajes

```http
GET /characters.php
```

#### Crear Personaje

```http
POST /characters.php
Content-Type: application/json

{
  "name": "Aragorn",
  "race_id": 1,
  "class_id": 1,
  "subclass_id": 1,
  "level": 1
}
```

#### Actualizar Personaje

```http
PUT /characters.php
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
Content-Type: application/json

{
  "id": 1
}
```

## 💻 Uso de la Aplicación

### Para Usuarios

1. **Registro:** Completa el formulario con username, email y contraseña
2. **Login:** Usa tus credenciales para iniciar sesión
3. **Crear Personaje:** Selecciona nombre, nivel, raza, clase y subclase
4. **Gestionar Personajes:** Edita, elimina o marca como favorito
5. **Mi Perfil:** Cambia tu nombre de usuario o contraseña

### Para Administradores

1. Accede desde el perfil con el botón "Panel de Administración"
2. Visualiza estadísticas de usuarios y personajes
3. Gestiona usuarios (eliminar, dar/quitar permisos de admin)

## 📝 Licencia

© 2025 Nexo

---

**Desarrollado con ⚔️**
