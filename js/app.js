/**
 * APP.JS - Lógica Principal de la Aplicación
 * Gestiona el estado global, vistas y funciones auxiliares
 */

// === ESTADO GLOBAL ===
const AppState = {
  currentUser: null,
  isAuthenticated: false,
  currentView: "hero",
  characters: [],
  editingCharacterId: null,
};

// === CONFIGURACIÓN DE LA API ===
const API_BASE = "api/endpoints";

// === ELEMENTOS DEL DOM ===
const DOM = {
  // Secciones principales
  heroSection: document.getElementById("heroSection"),
  authSection: document.getElementById("authSection"),
  mainSection: document.getElementById("mainSection"),
  mainNav: document.getElementById("mainNav"),

  // Vistas
  dashboardView: document.getElementById("dashboardView"),
  creatorView: document.getElementById("creatorView"),
  profileView: document.getElementById("profileView"),

  // Navegación
  navBrand: document.getElementById("navBrand"),
  navUsername: document.getElementById("navUsername"),
  btnShowHome: document.getElementById("btnShowHome"),
  btnShowDashboard: document.getElementById("btnShowDashboard"),
  btnShowCreator: document.getElementById("btnShowCreator"),
  btnLogin: document.getElementById("btnLogin"),
  btnLogout: document.getElementById("btnLogout"),

  // Hero
  btnHeroStart: document.getElementById("btnHeroStart"),

  // Dashboard
  charactersList: document.getElementById("charactersList"),
  emptyState: document.getElementById("emptyState"),
  btnCreateFirst: document.getElementById("btnCreateFirst"),

  // Creator
  btnBackToDashboard: document.getElementById("btnBackToDashboard"),
  btnCancelCreate: document.getElementById("btnCancelCreate"),
  creatorTitle: document.getElementById("creatorTitle"),
  btnSubmitCharacter: document.getElementById("btnSubmitCharacter"),

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
 * @param {string} view - 'hero', 'auth', 'dashboard', 'creator', 'profile'
 */
function switchView(view) {
  console.log(`Cambiando a vista: ${view}`);

  // Ocultar todas las secciones
  DOM.heroSection.classList.add("hidden");
  DOM.authSection.classList.add("hidden");
  DOM.mainSection.classList.add("hidden");
  DOM.dashboardView.classList.add("hidden");
  DOM.creatorView.classList.add("hidden");
  DOM.profileView.classList.add("hidden");

  // Mostrar la vista solicitada
  switch (view) {
    case "hero":
      DOM.heroSection.classList.remove("hidden");
      DOM.mainNav.classList.remove("nav-hidden");
      break;

    case "auth":
      DOM.authSection.classList.remove("hidden");
      DOM.mainNav.classList.remove("nav-hidden");
      DOM.btnLogin.classList.add("hidden"); // Ocultar botón porque ya estamos en login
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

    case "profile":
      DOM.mainSection.classList.remove("hidden");
      DOM.profileView.classList.remove("hidden");
      DOM.mainNav.classList.remove("nav-hidden");
      if (typeof loadProfile === "function") {
        loadProfile();
      }
      break;
  }

  AppState.currentView = view;
}

/**
 * Actualiza la información del usuario en la navegación
 */
function updateUserInfo(isAuthenticated = false) {
  if (isAuthenticated) {
    const username = localStorage.getItem("username");
    if (username) {
      DOM.navUsername.textContent = username;
      DOM.navUsername.classList.remove("hidden");
      AppState.currentUser = username;
    }
    DOM.btnLogin.classList.add("hidden");
    DOM.btnLogout.classList.remove("hidden");
    DOM.btnShowDashboard.classList.remove("hidden");
    DOM.btnShowCreator.classList.remove("hidden");
  } else {
    DOM.navUsername.classList.add("hidden");
    DOM.btnLogin.classList.remove("hidden");
    DOM.btnLogout.classList.add("hidden");
    DOM.btnShowDashboard.classList.add("hidden");
    DOM.btnShowCreator.classList.add("hidden");
  }
}

/**
 * Verifica si el usuario tiene una sesión activa al cargar la página
 */
async function checkSession() {
  try {
    const response = await fetch(`${API_BASE}/characters.php`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    if (data.success) {
      AppState.isAuthenticated = true;
      updateUserInfo(true);
      switchView("dashboard");
    } else {
      AppState.isAuthenticated = false;
      updateUserInfo(false);
      switchView("hero");
    }
  } catch (error) {
    console.error("Error al verificar sesión:", error);
    AppState.isAuthenticated = false;
    updateUserInfo(false);
    switchView("hero");
  }
}

/**
 * Maneja el inicio de sesión exitoso
 * @param {Object} userData - Datos del usuario
 */
function handleLoginSuccess(userData) {
  AppState.isAuthenticated = true;
  AppState.currentUser = userData.username;
  localStorage.setItem("username", userData.username);
  updateUserInfo(true);
  switchView("dashboard");
}

/**
 * Maneja el cierre de sesión
 */
async function handleLogoutClick() {
  console.log('[LOGOUT] Iniciando logout');

  try {
    showLoading(true);

    const response = await fetch(`${API_BASE}/logout.php`, {
      method: "POST",
      credentials: "include",
    });

    const data = await response.json();

    if (data.success) {
      AppState.isAuthenticated = false;
      AppState.currentUser = null;
      AppState.characters = [];
      localStorage.removeItem("username");
      showToast("Sesión cerrada correctamente", "success");
      updateUserInfo(false);
      switchView("auth");
    } else {
      showToast("Error al cerrar sesión", "error");
    }
  } catch (error) {
    console.error("[LOGOUT] Error:", error);
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
  if (typeof renderCharacters === "function") {
    renderCharacters(characters);
  }
}

// === EVENT LISTENERS ===

DOM.navBrand.addEventListener("click", () => {
  if (AppState.isAuthenticated) {
    switchView("dashboard");
  } else {
    switchView("hero");
  }
});

DOM.btnShowHome.addEventListener("click", () => {
  if (AppState.isAuthenticated) {
    switchView("dashboard");
  } else {
    switchView("hero");
  }
});

DOM.btnShowDashboard.addEventListener("click", () => {
  switchView("dashboard");
});

DOM.btnShowCreator.addEventListener("click", () => {
  if (!AppState.isAuthenticated) {
    showToast("Debes iniciar sesión para crear personajes", "warning");
    switchView("auth");
    return;
  }

  AppState.editingCharacterId = null;
  DOM.creatorTitle.textContent = "Crear Nuevo Personaje";

  if (typeof resetCreatorForm === "function") {
    resetCreatorForm();
  }

  switchView("creator");
});

DOM.btnLogin.addEventListener("click", () => {
  switchView("auth");
});

DOM.btnLogout.addEventListener("click", handleLogoutClick);

// Nombre de usuario clickeable - lleva al perfil
DOM.navUsername.addEventListener("click", () => {
  switchView("profile");
});

// Botón Hero - Comenzar Aventura
DOM.btnHeroStart.addEventListener("click", () => {
  if (AppState.isAuthenticated) {
    switchView("dashboard");
  } else {
    switchView("auth");
  }
});

DOM.btnCreateFirst.addEventListener("click", () => {
  if (!AppState.isAuthenticated) {
    showToast("Debes iniciar sesión para crear personajes", "warning");
    switchView("auth");
    return;
  }

  AppState.editingCharacterId = null;
  DOM.creatorTitle.textContent = "Crear Nuevo Personaje";

  if (typeof resetCreatorForm === "function") {
    resetCreatorForm();
  }

  switchView("creator");
});

DOM.btnBackToDashboard.addEventListener("click", () => {
  switchView("dashboard");
});

DOM.btnCancelCreate.addEventListener("click", () => {
  if (confirm("¿Quieres cancelar? Los cambios no guardados se perderán.")) {
    switchView("dashboard");
  }
});

// === INICIALIZACIÓN ===

document.addEventListener("DOMContentLoaded", () => {
  console.log("Aplicación iniciada");
  checkSession();
});
