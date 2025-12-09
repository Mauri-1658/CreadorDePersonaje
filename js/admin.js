/**
 * ADMIN.JS - Módulo del Panel de Administración
 * Gestiona estadísticas, usuarios y contenido del juego
 */

// === ELEMENTOS DEL DOM ===
const AdminDOM = {
    adminView: document.getElementById('adminView'),
    statUsers: document.getElementById('statUsers'),
    statCharacters: document.getElementById('statCharacters'),
    adminUsersTable: document.getElementById('adminUsersTable'),
    popularClasses: document.getElementById('popularClasses'),
    popularRaces: document.getElementById('popularRaces')
};

// === ESTADO ===
let isAdminUser = false;

/**
 * Verifica si el usuario actual es admin
 */
async function checkAdminStatus() {
    try {
        const response = await fetch(`${API_BASE}/admin.php`, {
            method: 'GET',
            credentials: 'include'
        });
        
        const data = await response.json();
        isAdminUser = data.success === true;
        return isAdminUser;
    } catch (error) {
        isAdminUser = false;
        return false;
    }
}

/**
 * Carga los datos del panel de administración
 */
async function loadAdminDashboard() {
    try {
        showLoading(true);
        
        // Cargar estadísticas
        const statsResponse = await fetch(`${API_BASE}/admin.php`, {
            method: 'GET',
            credentials: 'include'
        });
        
        const statsData = await statsResponse.json();
        
        if (statsData.success) {
            renderAdminStats(statsData.stats);
        } else {
            showToast('Error al cargar estadísticas', 'error');
        }
        
        // Cargar usuarios
        const usersResponse = await fetch(`${API_BASE}/admin-users.php`, {
            method: 'GET',
            credentials: 'include'
        });
        
        const usersData = await usersResponse.json();
        
        if (usersData.success) {
            renderUsersTable(usersData.users);
        }
        
    } catch (error) {
        console.error('Error al cargar admin:', error);
        showToast('Error de conexión', 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Renderiza las estadísticas del admin
 */
function renderAdminStats(stats) {
    AdminDOM.statUsers.textContent = stats.total_users;
    AdminDOM.statCharacters.textContent = stats.total_characters;
    
    // Clases populares
    AdminDOM.popularClasses.innerHTML = '';
    stats.popular_classes.forEach(cls => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${cls.name}</span><span class="stat-count">${cls.count}</span>`;
        AdminDOM.popularClasses.appendChild(li);
    });
    
    // Razas populares
    AdminDOM.popularRaces.innerHTML = '';
    stats.popular_races.forEach(race => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${race.name}</span><span class="stat-count">${race.count}</span>`;
        AdminDOM.popularRaces.appendChild(li);
    });
}

/**
 * Renderiza la tabla de usuarios
 */
function renderUsersTable(users) {
    if (!users || users.length === 0) {
        AdminDOM.adminUsersTable.innerHTML = '<p class="empty-message">No hay usuarios</p>';
        return;
    }
    
    let tableHtml = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Email</th>
                    <th>Personajes</th>
                    <th>Admin</th>
                    <th>Registrado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    users.forEach(user => {
        const date = new Date(user.created_at);
        const dateStr = date.toLocaleDateString('es-ES');
        const isAdmin = user.is_admin == 1;
        
        tableHtml += `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.character_count}</td>
                <td>
                    <button class="btn-toggle-admin ${isAdmin ? 'active' : ''}" 
                            data-user-id="${user.id}" 
                            data-is-admin="${isAdmin ? '1' : '0'}"
                            title="${isAdmin ? 'Quitar admin' : 'Hacer admin'}">
                        ${isAdmin ? '✅' : '⬜'}
                    </button>
                </td>
                <td>${dateStr}</td>
                <td>
                    <button class="btn-delete-user" data-user-id="${user.id}" data-username="${user.username}">🗑️</button>
                </td>
            </tr>
        `;
    });
    
    tableHtml += '</tbody></table>';
    AdminDOM.adminUsersTable.innerHTML = tableHtml;
    
    // Event listeners para eliminar
    const deleteButtons = AdminDOM.adminUsersTable.querySelectorAll('.btn-delete-user');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            handleDeleteUser(btn.dataset.userId, btn.dataset.username);
        });
    });

    // Event listeners para toggle admin
    const adminButtons = AdminDOM.adminUsersTable.querySelectorAll('.btn-toggle-admin');
    adminButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const userId = btn.dataset.userId;
            const currentlyAdmin = btn.dataset.isAdmin === '1';
            handleToggleAdmin(userId, !currentlyAdmin);
        });
    });
}

/**
 * Maneja el cambio de estado admin de un usuario
 */
async function handleToggleAdmin(userId, makeAdmin) {
    const action = makeAdmin ? 'hacer administrador' : 'quitar permisos de admin';
    
    if (!confirm(`¿Estás seguro de ${action} a este usuario?`)) {
        return;
    }
    
    try {
        showLoading(true);
        
        const response = await fetch(`${API_BASE}/admin-users.php`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ id: userId, is_admin: makeAdmin })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast(data.message, 'success');
            loadAdminDashboard(); // Recargar datos
        } else {
            showToast(data.message || 'Error al cambiar permisos', 'error');
        }
    } catch (error) {
        console.error('Error al cambiar admin:', error);
        showToast('Error de conexión', 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Maneja la eliminación de un usuario
 */
async function handleDeleteUser(userId, username) {
    if (!confirm(`¿Estás seguro de eliminar al usuario "${username}"?\n\nEsto también eliminará todos sus personajes.`)) {
        return;
    }
    
    try {
        showLoading(true);
        
        const response = await fetch(`${API_BASE}/admin-users.php`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ id: userId })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast(`✅ Usuario "${username}" eliminado`, 'success');
            loadAdminDashboard();
        } else {
            showToast(data.message || 'Error al eliminar usuario', 'error');
        }
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        showToast('Error de conexión', 'error');
    } finally {
        showLoading(false);
    }
}

console.log('Módulo Admin cargado');

