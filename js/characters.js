/**
 * CHARACTERS.JS - Módulo de Gestión de Personajes
 * Maneja la lista, visualización, edición y eliminación de personajes
 */

// === ELEMENTOS DEL DOM ===
const CharactersDOM = {
    charactersList: document.getElementById('charactersList'),
    emptyState: document.getElementById('emptyState')
};

// === ICONOS POR RAZA ===
const RaceIcons = {
    'Humano': '⚔️',
    'Elfo': '🧝',
    'Enano': '🪓',
    'Orco': '👹',
    'Drakoniano': '🐲'
};

// === FUNCIONES DE RENDERIZADO ===

/**
 * Renderiza la lista de personajes en el DOM
 * @param {Array} characters - Array de personajes
 */
function renderCharacters(characters) {
    // Limpiar lista actual
    CharactersDOM.charactersList.innerHTML = '';

    // Si no hay personajes, mostrar estado vacío
    if (!characters || characters.length === 0) {
        CharactersDOM.emptyState.classList.remove('hidden');
        return;
    }

    // Ocultar estado vacío
    CharactersDOM.emptyState.classList.add('hidden');

    // Iterar sobre los personajes usando forEach
    characters.forEach(character => {
        const card = createCharacterCard(character);
        CharactersDOM.charactersList.appendChild(card);
    });

    console.log(`Renderizados ${characters.length} personajes`);
}

/**
 * Crea una tarjeta de personaje
 * @param {Object} character - Datos del personaje
 * @returns {HTMLElement} - Elemento de la tarjeta
 */
function createCharacterCard(character) {
    // Crear elementos usando createElement
    const card = document.createElement('div');
    card.className = 'character-card';
    card.dataset.characterId = character.id;

    // Botón de estrella para marcar como main
    const btnStar = document.createElement('button');
    btnStar.className = `btn-star ${character.is_main ? 'active' : ''}`;
    btnStar.textContent = character.is_main ? '⭐' : '☆';
    btnStar.title = character.is_main ? 'Personaje principal' : 'Marcar como principal';
    btnStar.addEventListener('click', (e) => {
        e.stopPropagation();
        handleToggleMain(character.id, !character.is_main);
    });

    // Header con icono y nombre
    const header = document.createElement('div');
    header.className = 'character-header';

    const icon = document.createElement('span');
    icon.className = 'character-icon';
    icon.textContent = RaceIcons[character.race_name] || '🎭';

    const name = document.createElement('h3');
    name.className = 'character-name';
    name.textContent = character.name;

    header.appendChild(icon);
    header.appendChild(name);

    // Información del personaje
    const info = document.createElement('div');
    info.className = 'character-info';

    const raceText = document.createElement('p');
    raceText.innerHTML = `<strong>Raza:</strong> ${character.race_name}`;

    const classText = document.createElement('p');

    // Crear badge de rol según el tipo
    const roleBadge = document.createElement('span');
    roleBadge.className = `role-badge role-${character.class_role.toLowerCase()}`;
    roleBadge.textContent = character.class_role;

    classText.innerHTML = `<strong>Clase:</strong> ${character.class_name} `;
    classText.appendChild(roleBadge);

    const subclassText = document.createElement('p');
    subclassText.innerHTML = `<strong>Especialización:</strong> ${character.subclass_name}`;

    const levelText = document.createElement('p');
    levelText.innerHTML = `<strong>Nivel:</strong> ${character.level}`;

    info.appendChild(raceText);
    info.appendChild(classText);
    info.appendChild(subclassText);
    info.appendChild(levelText);

    // Botones de acción
    const actions = document.createElement('div');
    actions.className = 'character-actions';

    const btnEdit = document.createElement('button');
    btnEdit.className = 'btn-edit';
    btnEdit.textContent = '✏️ Editar';
    btnEdit.addEventListener('click', (e) => {
        e.stopPropagation();
        handleEditCharacter(character.id);
    });

    const btnDelete = document.createElement('button');
    btnDelete.className = 'btn-delete';
    btnDelete.textContent = '🗑️ Eliminar';
    btnDelete.addEventListener('click', (e) => {
        e.stopPropagation();
        handleDeleteCharacter(character.id, character.name);
    });

    actions.appendChild(btnEdit);
    actions.appendChild(btnDelete);

    // Ensamblar tarjeta
    card.appendChild(btnStar);
    card.appendChild(header);
    card.appendChild(info);
    card.appendChild(actions);

    return card;
}

// === FUNCIONES DE ACCIONES ===

/**
 * Maneja la edición de un personaje
 * @param {number} characterId - ID del personaje a editar
 */
async function handleEditCharacter(characterId) {
    try {
        showLoading(true);

        // Obtener datos del personaje
        const response = await fetch(`${API_BASE}/characters.php?id=${characterId}`, {
            method: 'GET',
            credentials: 'include'
        });

        const data = await response.json();

        if (data.success) {
            // Establecer modo edición en el estado global
            AppState.editingCharacterId = characterId;

            // Cambiar título del creador
            DOM.creatorTitle.textContent = `Editar Personaje: ${data.character.name}`;

            // Cambiar texto del botón
            DOM.btnSubmitCharacter.textContent = 'Guardar Cambios';

            // Pre-llenar formulario de creador
            if (typeof populateCreatorForm === 'function') {
                populateCreatorForm(data.character);
            }

            // Cambiar a vista de creador
            switchView('creator');
        } else {
            showToast('Error al cargar personaje', 'error');
        }
    } catch (error) {
        console.error('Error al editar personaje:', error);
        showToast('Error de conexión', 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Maneja la eliminación de un personaje
 * @param {number} characterId - ID del personaje a eliminar
 * @param {string} characterName - Nombre del personaje
 */
async function handleDeleteCharacter(characterId, characterName) {
    // Confirmar eliminación
    if (!confirm(`¿Estás seguro de que quieres eliminar a "${characterName}"? Esta acción no se puede deshacer.`)) {
        return;
    }

    try {
        showLoading(true);

        const response = await fetch(`${API_BASE}/characters.php`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                id: characterId
            })
        });

        const data = await response.json();

        if (data.success) {
            showToast(`✅ Personaje "${characterName}" eliminado correctamente`, 'success');

            // Recargar lista de personajes
            if (typeof loadCharactersForDashboard === 'function') {
                loadCharactersForDashboard();
            }
        } else {
            showToast(data.message || 'Error al eliminar personaje', 'error');
        }
    } catch (error) {
        console.error('Error al eliminar personaje:', error);
        showToast('Error de conexión', 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Maneja el toggle de personaje principal
 * @param {number} characterId - ID del personaje
 * @param {boolean} setAsMain - Si establecer como main
 */
async function handleToggleMain(characterId, setAsMain) {
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

            // Recargar lista de personajes
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

// === FUNCIONALIDAD DE BÚSQUEDA ===

/**
 * Filtra los personajes según el término de búsqueda
 * @param {string} searchTerm - Término de búsqueda
 */
function filterCharacters(searchTerm) {
    const characters = AppState.characters;
    const normalizedSearch = searchTerm.toLowerCase().trim();

    // Si no hay término de búsqueda, mostrar todos
    if (!normalizedSearch) {
        renderCharacters(characters);
        return;
    }

    // Filtrar personajes por nombre, raza, clase o subclase
    const filtered = characters.filter(character => {
        const name = (character.name || '').toLowerCase();
        const race = (character.race_name || '').toLowerCase();
        const charClass = (character.class_name || '').toLowerCase();
        const subclass = (character.subclass_name || '').toLowerCase();
        const role = (character.class_role || '').toLowerCase();

        return name.includes(normalizedSearch) ||
            race.includes(normalizedSearch) ||
            charClass.includes(normalizedSearch) ||
            subclass.includes(normalizedSearch) ||
            role.includes(normalizedSearch);
    });

    // Si hay resultados, renderizarlos
    if (filtered.length > 0) {
        renderCharacters(filtered);
    } else {
        // Mostrar mensaje de no resultados
        showNoResults(searchTerm);
    }
}

/**
 * Muestra mensaje de no resultados encontrados
 * @param {string} searchTerm - Término buscado
 */
function showNoResults(searchTerm) {
    CharactersDOM.charactersList.innerHTML = '';
    CharactersDOM.emptyState.classList.add('hidden');

    const noResults = document.createElement('div');
    noResults.className = 'no-results';
    noResults.innerHTML = `
        <span class="no-results-icon">🔮</span>
        <h3>No se encontraron héroes</h3>
        <p>No hay personajes que coincidan con "<strong>${searchTerm}</strong>"</p>
        <p>Intenta buscar por nombre, raza, clase o especialización</p>
    `;

    CharactersDOM.charactersList.appendChild(noResults);
}

/**
 * Debounce para optimizar búsquedas
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Inicializar buscador cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchCharacters');

    if (searchInput) {
        // Usar debounce para evitar búsquedas excesivas
        const debouncedFilter = debounce((value) => {
            filterCharacters(value);
        }, 300);

        searchInput.addEventListener('input', (e) => {
            debouncedFilter(e.target.value);
        });

        // Limpiar búsqueda al presionar Escape
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchInput.value = '';
                filterCharacters('');
                searchInput.blur();
            }
        });
    }
});

console.log('Módulo de Personajes cargado');

