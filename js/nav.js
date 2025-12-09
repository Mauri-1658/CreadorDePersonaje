/**
 * NAV.JS - Script de navegación compartido
 * Gestiona partículas, sesión de usuario y navegación básica
 */

// Detectar si estamos en un subdirectorio (ej. /views/)
const isInViews = window.location.pathname.includes('/views/');
const ROOT_PATH = isInViews ? '../' : '';
const API_BASE = isInViews ? '../api/endpoints' : 'api/endpoints';

// === FUNCIONES AUXILIARES ===

/**
 * Muestra un mensaje toast
 */
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            container.removeChild(toast);
        }, 300);
    }, 4000);
}

/**
 * Muestra/oculta overlay de carga
 */
function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.toggle('hidden', !show);
    }
}

/**
 * Crea las partículas de fondo
 */
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.opacity = Math.random() * 0.5 + 0.3;
        container.appendChild(particle);
    }
}

/**
 * Verifica la sesión del usuario
 */
async function checkUserSession() {
    try {
        const response = await fetch(`${API_BASE}/profile.php`, {
            method: 'GET',
            credentials: 'include'
        });

        const data = await response.json();

        if (data.success && data.user) {
            // Usuario autenticado
            updateNavForUser(data.user.username);
            return true;
        } else {
            // No autenticado
            updateNavForGuest();
            return false;
        }
    } catch (error) {
        console.error('Error al verificar sesión:', error);
        updateNavForGuest();
        return false;
    }
}

/**
 * Actualiza la navegación para usuario autenticado
 */
function updateNavForUser(username) {
    const navUsername = document.getElementById('navUsername');
    const btnLogin = document.getElementById('btnLogin');
    const btnLogout = document.getElementById('btnLogout');
    const linkDashboard = document.getElementById('linkDashboard');
    const linkCreator = document.getElementById('linkCreator');

    if (navUsername) {
        navUsername.textContent = username;
        navUsername.classList.remove('hidden');
    }
    if (btnLogin) btnLogin.classList.add('hidden');
    if (btnLogout) btnLogout.classList.remove('hidden');
    if (linkDashboard) linkDashboard.classList.remove('hidden');
    if (linkCreator) linkCreator.classList.remove('hidden');

    // Guardar username en storage
    localStorage.setItem('username', username);
}

/**
 * Actualiza la navegación para visitante
 */
function updateNavForGuest() {
    const navUsername = document.getElementById('navUsername');
    const btnLogin = document.getElementById('btnLogin');
    const btnLogout = document.getElementById('btnLogout');

    if (navUsername) navUsername.classList.add('hidden');
    if (btnLogin) btnLogin.classList.remove('hidden');
    if (btnLogout) btnLogout.classList.add('hidden');
}

/**
 * Cierra la sesión del usuario
 */
async function handleLogout() {
    try {
        showLoading(true);

        const response = await fetch(`${API_BASE}/logout.php`, {
            method: 'POST',
            credentials: 'include'
        });

        const data = await response.json();

        if (data.success) {
            localStorage.removeItem('username');
            showToast('Sesión cerrada correctamente', 'success');
            setTimeout(() => {
                window.location.href = `${ROOT_PATH}index.html`;
            }, 500);
        } else {
            showToast('Error al cerrar sesión', 'error');
        }
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        showToast('Error de conexión', 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Redirige a login si no hay sesión (para páginas protegidas)
 */
function requireAuth() {
    checkUserSession().then(isAuthenticated => {
        if (!isAuthenticated) {
            // Si no estamos en views, la ruta es views/login.html
            const loginPath = isInViews ? 'login.html' : 'views/login.html';
            window.location.href = loginPath;
        }
    });
}

// === INICIALIZACIÓN ===

document.addEventListener('DOMContentLoaded', () => {
    // Crear partículas
    createParticles();

    // Configurar botón de logout
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', handleLogout);
    }

    // Verificar sesión en página de inicio
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    if (currentPage === 'index.html' || currentPage === '' || currentPage === 'login.html') {
        checkUserSession();
    }
});

console.log('Script de navegación cargado');
