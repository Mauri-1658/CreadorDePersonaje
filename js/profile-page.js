/**
 * PROFILE-PAGE.JS - Script del Perfil de Usuario
 * Versión para la página profile.html
 */

// Verificar autenticación
requireAuth();

// === ELEMENTOS DEL DOM ===
const ProfileDOM = {
    profileUsername: document.getElementById('profileUsername'),
    profileEmail: document.getElementById('profileEmail'),
    profileCreatedAt: document.getElementById('profileCreatedAt'),
    formChangePassword: document.getElementById('formChangePassword'),
    formChangeUsername: document.getElementById('formChangeUsername'),
    newUsername: document.getElementById('newUsername'),
    currentPassword: document.getElementById('currentPassword'),
    newPassword: document.getElementById('newPassword'),
    confirmPassword: document.getElementById('confirmPassword'),
    mainCharacterEmpty: document.getElementById('mainCharacterEmpty'),
    mainCharacterCard: document.getElementById('mainCharacterCard'),
    adminButtonContainer: document.getElementById('adminButtonContainer')
};


// === CARGA DE PERFIL ===

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
            
            // Verificar si es admin y mostrar botón
            checkAdminButton();
        } else {
            showToast('Error al cargar perfil', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error de conexión', 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Verifica si el usuario es admin y muestra el botón de admin
 */
async function checkAdminButton() {
    try {
        const response = await fetch(`${API_BASE}/admin.php`, {
            method: 'GET',
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success && ProfileDOM.adminButtonContainer) {
            ProfileDOM.adminButtonContainer.classList.remove('hidden');
        }
    } catch (error) {
        // No es admin, el botón permanece oculto
    }
}


function renderProfileData(user) {
    ProfileDOM.profileUsername.textContent = user.username;
    ProfileDOM.profileEmail.textContent = user.email;

    const date = new Date(user.created_at);
    ProfileDOM.profileCreatedAt.textContent = date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    // Actualizar nombre en nav
    const navUsername = document.getElementById('navUsername');
    if (navUsername) {
        navUsername.textContent = user.username;
    }
}

function renderMainCharacter(character) {
    if (!character) {
        ProfileDOM.mainCharacterEmpty.classList.remove('hidden');
        ProfileDOM.mainCharacterCard.classList.add('hidden');
        return;
    }

    // Mapeo robusto igual que en creator-page.js
    const ClassFolderNames = {
        'Guerrero': 'warrior',
        'Clérigo': 'priest',
        'Mago': 'mage',
        'Cazador': 'hunter',
        'Pícaro': 'rogue'
    };

    const CombinationSuffixes = {
        'warrior': 'War',
        'priest': 'Priest',
        'mage': 'Mage',
        'hunter': 'Hunter',
        'rogue': 'Rogue'
    };

    const raceName = character.race_name ? character.race_name.trim() : '';
    const className = character.class_name ? character.class_name.trim() : '';

    // Cadena de resolución: Nombre Clase -> Carpeta -> Sufijo
    const folderName = ClassFolderNames[className];
    const suffix = folderName ? CombinationSuffixes[folderName] : null;

    let imageHtml = '';

    if (raceName && suffix) {
        const basePath = '../';
        const imagePath = `${basePath}assets/images/Combinaciones/${raceName}/${raceName}${suffix}.png`;
        imageHtml = `
            <div class="main-char-image-container">
                <img src="${imagePath}" alt="${raceName} ${className}" class="main-char-image" onerror="this.parentElement.style.display='none'">
            </div>
        `;
    }

    ProfileDOM.mainCharacterCard.classList.remove('hidden');
    ProfileDOM.mainCharacterEmpty.classList.add('hidden');

    ProfileDOM.mainCharacterCard.innerHTML = `
        ${imageHtml}
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

// === CAMBIO DE CONTRASEÑA ===

async function handleChangePassword(event) {
    event.preventDefault();

    const currentPassword = ProfileDOM.currentPassword.value;
    const newPassword = ProfileDOM.newPassword.value;
    const confirmPassword = ProfileDOM.confirmPassword.value;

    if (newPassword.length < 6) {
        showToast('La contraseña debe tener al menos 6 caracteres', 'error');
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
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                current_password: currentPassword,
                new_password: newPassword,
                confirm_password: confirmPassword
            })
        });

        const data = await response.json();

        if (data.success) {
            showToast('Contraseña actualizada correctamente', 'success');
            ProfileDOM.formChangePassword.reset();
        } else {
            showToast(data.message || 'Error al cambiar contraseña', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error de conexión', 'error');
    } finally {
        showLoading(false);
    }
}

// === CAMBIAR NOMBRE DE USUARIO ===

async function handleChangeUsername(e) {
    e.preventDefault();

    const newUsername = ProfileDOM.newUsername.value.trim();

    if (newUsername.length < 3) {
        showToast('El nombre debe tener al menos 3 caracteres', 'error');
        return;
    }

    try {
        showLoading(true);

        const response = await fetch(`${API_BASE}/change-username.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ new_username: newUsername })
        });

        const data = await response.json();

        if (data.success) {
            showToast('Nombre de usuario actualizado', 'success');
            ProfileDOM.formChangeUsername.reset();
            
            // Actualizar el nombre en pantalla
            ProfileDOM.profileUsername.textContent = newUsername;
            const navUsername = document.getElementById('navUsername');
            if (navUsername) navUsername.textContent = newUsername;
            
            localStorage.setItem('username', newUsername);
        } else {
            showToast(data.message || 'Error al cambiar nombre', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error de conexión', 'error');
    } finally {
        showLoading(false);
    }
}

// === INICIALIZACIÓN ===

document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
    checkUserSession();

    ProfileDOM.formChangePassword.addEventListener('submit', handleChangePassword);
    ProfileDOM.formChangeUsername.addEventListener('submit', handleChangeUsername);
});

console.log('Perfil cargado');
