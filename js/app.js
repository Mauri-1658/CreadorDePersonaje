/**
 * APP.JS - Lógica Principal de la Aplicación
 * Gestiona el estado global, vistas y funciones auxiliares
 */

// === ESTADO GLOBAL ===
const AppState = {
  currentUser: null,
  isAuthenticated: false,
  currentView: "auth",
  characters: [],
  editingCharacterId: null,
};

// === CONFIGURACIÓN DE LA API ===
const API_BASE = "/DAW/Ilerna/CreadorDePersonaje/api/endpoints";

// === ELEMENTOS DEL DOM ===
const DOM = {
  // Secciones principales
  authSection: document.getElementById("authSection"),
  mainSection: document.getElementById("mainSection"),
  mainNav: document.getElementById("mainNav"),

  // Vistas
  dashboardView: document.getElementById("dashboardView"),
  creatorView: document.getElementById("creatorView"),

  // Navegación
  navUsername: document.getElementById("navUsername"),
  btnShowDashboard: document.getElementById("btnShowDashboard"),
  btnShowCreator: document.getElementById("btnShowCreator"),
  btnLogout: document.getElementById("btnLogout"),

  // Dashboard
  charactersList: document.getElementById("charactersList"),
  emptyState: document.getElementById("emptyState"),
  btnCreateNew: document.getElementById("btnCreateNew"),
  btnCreateFirst: document.getElementById("btnCreateFirst"),

  // Creator
  btnBackToDashboard: document.getElementById("btnBackToDashboard"),
  btnCancelCreate: document.getElementById("btnCancelCreate"),
  creatorTitle: document.getElementById("creatorTitle"),

  // Toast y Loading
  toastContainer: document.getElementById("toastContainer"),
  loadingOverlay: document.getElementById("loadingOverlay"),
};

// === FUNCIONES AUXILIARES ===

/**
 * Muestra un mensaje toast
 * @param {string} message - El mensaje a mostrar
 * @param {string} type - Tipo: 'success', 'error', 'warning', 'info'
 */
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  DOM.toastContainer.appendChild(toast);

  // Auto-remover después de 4 segundos
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => {
      DOM.toastContainer.removeChild(toast);
    }, 300);
  }, 4000);

  console.log(`[${type.toUpperCase()}] ${message}`);
}

/**
 * Muestra/oculta el overlay de carga
 * @param {boolean} show - true para mostrar, false para ocultar
 */
function showLoading(show) {
  if (show) {
    DOM.loadingOverlay.classList.remove("hidden");
  } else {
    DOM.loadingOverlay.classList.add("hidden");
  }
}

/**
 * Cambia entre vistas de la aplicación
 * @param {string} view - 'auth', 'dashboard', 'creator'
 */
function switchView(view) {
  console.log(`Cambiando a vista: ${view}`);

  // Ocultar todas las secciones
  DOM.authSection.classList.add("hidden");
  DOM.mainSection.classList.add("hidden");
  DOM.dashboardView.classList.add("hidden");
  DOM.creatorView.classList.add("hidden");

  // Mostrar la vista solicitada
  switch (view) {
    case "auth":
      DOM.authSection.classList.remove("hidden");
      DOM.mainNav.classList.add("nav-hidden");
      break;

    case "dashboard":
      DOM.mainSection.classList.remove("hidden");
      DOM.dashboardView.classList.remove("hidden");
      DOM.mainNav.classList.remove("nav-hidden");
      loadCharactersForDashboard();
      break;

    case "creator":
      DOM.mainSection.classList.remove("hidden");
      DOM.creatorView.classList.remove("hidden");
      DOM.mainNav.classList.remove("nav-hidden");
      break;
  }

  AppState.currentView = view;
}

/**
 * Actualiza la información del usuario en la navegación
 */
function updateUserInfo() {
  // Intentar obtener username de localStorage
  const username = localStorage.getItem("username");
  if (username) {
    DOM.navUsername.textContent = username;
    AppState.currentUser = username;
  }
}

/**
 * Verifica si el usuario tiene una sesión activa al cargar la página
 */
async function checkSession() {
  try {
    // Intentar obtener personajes (requiere autenticación)
    const response = await fetch(`${API_BASE}/characters.php`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    if (data.success) {
      // Usuario autenticado
      AppState.isAuthenticated = true;
      updateUserInfo();
      switchView("dashboard");
    } else {
      // No autenticado
      switchView("auth");
    }
  } catch (error) {
    console.error("Error al verificar sesión:", error);
    switchView("auth");
  }
}

/**
 * Maneja el inicio de sesión exitoso
 * @param {Object} userData - Datos del usuario
 */
function handleLoginSuccess(userData) {
  AppState.isAuthenticated = true;
  AppState.currentUser = userData.username;

  // Guardar username en localStorage (datos no sensibles)
  localStorage.setItem("username", userData.username);

  updateUserInfo();
  switchView("dashboard");
}

/**
 * Maneja el cierre de sesión
 */
async function handleLogoutClick() {
  if (!confirm("¿Estás seguro de que quieres cerrar sesión?")) {
    return;
  }

  try {
    showLoading(true);

    const response = await fetch(`${API_BASE}/logout.php`, {
      method: "POST",
      credentials: "include",
    });

    const data = await response.json();

    if (data.success) {
      // Limpiar estado
      AppState.isAuthenticated = false;
      AppState.currentUser = null;
      AppState.characters = [];

      // Limpiar localStorage
      localStorage.removeItem("username");

      showToast("Sesión cerrada correctamente", "success");
      switchView("auth");
    } else {
      showToast("Error al cerrar sesión", "error");
    }
  } catch (error) {
    console.error("Error en logout:", error);
    showToast("Error de conexión", "error");
  } finally {
    showLoading(false);
  }
}

/**
 * Carga los personajes del usuario para mostrar en el dashboard
 */
async function loadCharactersForDashboard() {
  try {
    showLoading(true);

    const response = await fetch(`${API_BASE}/characters.php`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    if (data.success) {
      AppState.characters = data.characters;
      renderCharactersGrid(data.characters);
    } else {
      showToast("Error al cargar personajes", "error");
    }
  } catch (error) {
    console.error("Error al cargar personajes:", error);
    showToast("Error de conexión", "error");
  } finally {
    showLoading(false);
  }
}

/**
 * Renderiza la grilla de personajes
 * @param {Array} characters - Array de personajes
 */
function renderCharactersGrid(characters) {
  // Esta función se implementa en characters.js
  // Se llama aquí para mantener la separación de responsabilidades
  if (typeof renderCharacters === "function") {
    renderCharacters(characters);
  }
}

// === EVENT LISTENERS ===

// Navegación
DOM.btnShowDashboard.addEventListener("click", () => {
  switchView("dashboard");
});

DOM.btnShowCreator.addEventListener("click", () => {
  // Resetear formulario y estado de edición
  AppState.editingCharacterId = null;
  DOM.creatorTitle.textContent = "Crear Nuevo Personaje";

  if (typeof resetCreatorForm === "function") {
    resetCreatorForm();
  }

  switchView("creator");
});

DOM.btnLogout.addEventListener("click", handleLogoutClick);

// Botones para crear personaje desde dashboard
DOM.btnCreateNew.addEventListener("click", () => {
  AppState.editingCharacterId = null;
  DOM.creatorTitle.textContent = "Crear Nuevo Personaje";

  if (typeof resetCreatorForm === "function") {
    resetCreatorForm();
  }

  switchView("creator");
});

DOM.btnCreateFirst.addEventListener("click", () => {
  AppState.editingCharacterId = null;
  DOM.creatorTitle.textContent = "Crear Nuevo Personaje";

  if (typeof resetCreatorForm === "function") {
    resetCreatorForm();
  }

  switchView("creator");
});

// Botones de cancelar/volver desde creator
DOM.btnBackToDashboard.addEventListener("click", () => {
  switchView("dashboard");
});

DOM.btnCancelCreate.addEventListener("click", () => {
  if (confirm("¿Quieres cancelar? Los cambios no guardados se perderán.")) {
    switchView("dashboard");
  }
});

// === INICIALIZACIÓN ===

/**
 * Inicializa la aplicación al cargar la página
 */
document.addEventListener("DOMContentLoaded", () => {
  console.log("Aplicación iniciada");
  checkSession();
});
