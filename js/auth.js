/**
 * AUTH.JS - Módulo de Autenticación
 * Gestiona registro, login y validación de formularios con RegExp
 */

// === ELEMENTOS DEL DOM ===
const AuthDOM = {
    // Formularios
    loginForm: document.getElementById('loginForm'),
    registerForm: document.getElementById('registerForm'),
    formLogin: document.getElementById('formLogin'),
    formRegister: document.getElementById('formRegister'),
    
    // Botones de toggle
    showRegister: document.getElementById('showRegister'),
    showLogin: document.getElementById('showLogin'),
    
    // Inputs de login
    loginEmail: document.getElementById('loginEmail'),
    loginPassword: document.getElementById('loginPassword'),
    
    // Inputs de registro
    registerUsername: document.getElementById('registerUsername'),
    registerEmail: document.getElementById('registerEmail'),
    registerPassword: document.getElementById('registerPassword')
};

// === EXPRESIONES REGULARES PARA VALIDACIÓN ===
const ValidationRegex = {
    // Email: formato válido de email
    email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    
    // Contraseña: mínimo 6 caracteres
    password: /^.{6,}$/,
    
    // Username: alfanumérico, 3-20 caracteres
    username: /^[a-zA-Z0-9_]{3,20}$/
};

// === FUNCIONES DE VALIDACIÓN ===

/**
 * Valida un email usando RegExp
 * @param {string} email - El email a validar
 * @returns {boolean} - true si es válido
 */
function validateEmail(email) {
    return ValidationRegex.email.test(email);
}

/**
 * Valida una contraseña usando RegExp
 * @param {string} password - La contraseña a validar
 * @returns {boolean} - true si es válida
 */
function validatePassword(password) {
    return ValidationRegex.password.test(password);
}

/**
 * Valida un nombre de usuario usando RegExp
 * @param {string} username - El username a validar
 * @returns {boolean} - true si es válido
 */
function validateUsername(username) {
    return ValidationRegex.username.test(username);
}

// === FUNCIONES DE AUTENTICACIÓN ===

/**
 * Maneja el registro de nuevos usuarios
 * @param {Event} event - Evento del formulario
 */
async function handleRegister(event) {
    // Prevenir envío por defecto del formulario
    event.preventDefault();
    
    const username = AuthDOM.registerUsername.value.trim();
    const email = AuthDOM.registerEmail.value.trim();
    const password = AuthDOM.registerPassword.value;
    
    // Validar campos con RegExp
    if (!validateUsername(username)) {
        showToast('El nombre de usuario debe tener entre 3 y 20 caracteres alfanuméricos', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showToast('El email no tiene un formato válido', 'error');
        return;
    }
    
    if (!validatePassword(password)) {
        showToast('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }
    
    try {
        showLoading(true);
        
        // Enviar datos a la API
        const response = await fetch(`${API_BASE}/register.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast('✅ Usuario registrado correctamente. Ahora puedes iniciar sesión', 'success');
            
            // Limpiar formulario
            AuthDOM.formRegister.reset();
            
            // Cambiar a formulario de login
            toggleAuthForms('login');
            
            // Pre-llenar email en login
            AuthDOM.loginEmail.value = email;
        } else {
            showToast(data.message || 'Error al registrar usuario', 'error');
        }
    } catch (error) {
        console.error('Error en registro:', error);
        showToast('Error de conexión con el servidor', 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Maneja el inicio de sesión
 * @param {Event} event - Evento del formulario
 */
async function handleLogin(event) {
    // Prevenir envío por defecto del formulario
    event.preventDefault();
    
    const email = AuthDOM.loginEmail.value.trim();
    const password = AuthDOM.loginPassword.value;
    
    // Validar campos con RegExp
    if (!validateEmail(email)) {
        showToast('El email no tiene un formato válido', 'error');
        return;
    }
    
    if (!password) {
        showToast('La contraseña es requerida', 'error');
        return;
    }
    
    try {
        showLoading(true);
        
        // Enviar datos a la API
        const response = await fetch(`${API_BASE}/login.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // Importante para enviar/recibir cookies
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast(`✅ Bienvenido, ${data.user.username}!`, 'success');
            
            // Limpiar formulario
            AuthDOM.formLogin.reset();
            
            // Llamar a función de app.js para manejar login exitoso
            if (typeof handleLoginSuccess === 'function') {
                handleLoginSuccess(data.user);
            }
        } else {
            showToast(data.message || 'Credenciales incorrectas', 'error');
        }
    } catch (error) {
        console.error('Error en login:', error);
        showToast('Error de conexión con el servidor', 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Alterna entre formularios de login y registro
 * @param {string} form - 'login' o 'register'
 */
function toggleAuthForms(form) {
    if (form === 'register') {
        AuthDOM.loginForm.classList.add('hidden');
        AuthDOM.registerForm.classList.remove('hidden');
    } else {
        AuthDOM.registerForm.classList.add('hidden');
        AuthDOM.loginForm.classList.remove('hidden');
    }
}

// === EVENT LISTENERS ===

// Evento submit del formulario de registro
AuthDOM.formRegister.addEventListener('submit', handleRegister);

// Evento submit del formulario de login
AuthDOM.formLogin.addEventListener('submit', handleLogin);

// Botones para cambiar entre formularios
AuthDOM.showRegister.addEventListener('click', () => {
    toggleAuthForms('register');
});

AuthDOM.showLogin.addEventListener('click', () => {
    toggleAuthForms('login');
});

// Validación en tiempo real (opcional, mejora UX)
AuthDOM.registerEmail.addEventListener('blur', () => {
    const email = AuthDOM.registerEmail.value.trim();
    if (email && !validateEmail(email)) {
        AuthDOM.registerEmail.style.borderColor = 'var(--color-error)';
    } else {
        AuthDOM.registerEmail.style.borderColor = '';
    }
});

AuthDOM.registerPassword.addEventListener('blur', () => {
    const password = AuthDOM.registerPassword.value;
    if (password && !validatePassword(password)) {
        AuthDOM.registerPassword.style.borderColor = 'var(--color-error)';
    } else {
        AuthDOM.registerPassword.style.borderColor = '';
    }
});

console.log('Módulo de Autenticación cargado');
