/**
 * PROFILE.JS - Módulo del Perfil de Usuario
 * Gestiona la visualización del perfil, cambio de contraseña y personaje principal
 */

// === ELEMENTOS DEL DOM ===
const ProfileDOM = {
    // Vista
    profileView: document.getElementById('profileView'),
    
    // Información del usuario
    profileUsername: document.getElementById('profileUsername'),
    profileEmail: document.getElementById('profileEmail'),
    profileCreatedAt: document.getElementById('profileCreatedAt'),
    
    // Formulario de contraseña
    formChangePassword: document.getElementById('formChangePassword'),
    currentPassword: document.getElementById('currentPassword'),
    newPassword: document.getElementById('newPassword'),
    confirmPassword: document.getElementById('confirmPassword'),
    
    // Personaje principal
    mainCharacterDisplay: document.getElementById('mainCharacterDisplay'),
    mainCharacterEmpty: document.getElementById('mainCharacterEmpty'),
    mainCharacterCard: document.getElementById('mainCharacterCard')
};

// === FUNCIONES DE CARGA ===

/**
 * Carga los datos del perfil desde la API
 */
async function loadProfile() {
    try {
        showLoading(true);
        
        const response = await fetch(`${API_BASE}/profile.php`, {
            method: 'GET',
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success) {
            renderProfileData(data.user);
            renderMainCharacter(data.main_character);
        } else {
            showToast(data.message || 'Error al cargar perfil', 'error');
        }
    } catch (error) {
        console.error('Error al cargar perfil:', error);
        showToast('Error de conexión', 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Renderiza los datos del usuario en el perfil
 * @param {Object} user - Datos del usuario
 */
function renderProfileData(user) {
    ProfileDOM.profileUsername.textContent = user.username;
    ProfileDOM.profileEmail.textContent = user.email;
    
    // Formatear fecha
    const date = new Date(user.created_at);
    ProfileDOM.profileCreatedAt.textContent = date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

/**
 * Renderiza el personaje principal
 * @param {Object|null} character - Datos del personaje principal
 */
function renderMainCharacter(character) {
    if (!character) {
        ProfileDOM.mainCharacterEmpty.classList.remove('hidden');
        ProfileDOM.mainCharacterCard.classList.add('hidden');
        return;
    }
    
    ProfileDOM.mainCharacterEmpty.classList.add('hidden');
    ProfileDOM.mainCharacterCard.classList.remove('hidden');
    
    ProfileDOM.mainCharacterCard.innerHTML = `
        <div class="main-char-header">
            <span class="main-star">⭐</span>
            <h4 class="main-char-name">${character.name}</h4>
        </div>
        <div class="main-char-info">
            <p><strong>Raza:</strong> ${character.race_name}</p>
            <p><strong>Clase:</strong> ${character.class_name}</p>
            <p><strong>Especialización:</strong> ${character.subclass_name}</p>
            <p><strong>Nivel:</strong> ${character.level}</p>
        </div>
    `;
}

// === FUNCIONES DE ACCIONES ===

/**
 * Maneja el cambio de contraseña
 * @param {Event} event - Evento del formulario
 */
async function handleChangePassword(event) {
    event.preventDefault();
    
    const currentPassword = ProfileDOM.currentPassword.value;
    const newPassword = ProfileDOM.newPassword.value;
    const confirmPassword = ProfileDOM.confirmPassword.value;
    
    // Validaciones
    if (newPassword.length < 6) {
        showToast('La nueva contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showToast('Las contraseñas no coinciden', 'error');
        return;
    }
    
    try {
        showLoading(true);
        
        const response = await fetch(`${API_BASE}/profile.php`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                current_password: currentPassword,
                new_password: newPassword,
                confirm_password: confirmPassword
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast('✅ Contraseña actualizada correctamente', 'success');
            ProfileDOM.formChangePassword.reset();
        } else {
            showToast(data.message || 'Error al cambiar contraseña', 'error');
        }
    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        showToast('Error de conexión', 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Establece un personaje como principal
 * @param {number} characterId - ID del personaje
 * @param {boolean} setAsMain - Si establecer o quitar como main
 */
async function setMainCharacter(characterId, setAsMain = true) {
    try {
        const response = await fetch(`${API_BASE}/set-main.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                character_id: characterId,
                is_main: setAsMain
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast(setAsMain ? '⭐ Personaje establecido como principal' : 'Personaje principal eliminado', 'success');
            // Recargar personajes para actualizar estrellas
            if (typeof loadCharactersForDashboard === 'function') {
                loadCharactersForDashboard();
            }
        } else {
            showToast(data.message || 'Error al establecer personaje principal', 'error');
        }
    } catch (error) {
        console.error('Error al establecer personaje principal:', error);
        showToast('Error de conexión', 'error');
    }
}

// === EVENT LISTENERS ===

ProfileDOM.formChangePassword.addEventListener('submit', handleChangePassword);

console.log('Módulo de Perfil cargado');
