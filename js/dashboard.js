/**
 * DASHBOARD.JS - Script del Dashboard de Personajes
 * Gestiona la lista de personajes y búsqueda
 */

// Verificar autenticación
requireAuth();

// === ELEMENTOS DEL DOM ===
const CharactersDOM = {
    charactersList: document.getElementById('charactersList'),
    emptyState: document.getElementById('emptyState'),
    searchInput: document.getElementById('searchCharacters')
};

// === ESTADO ===
let allCharacters = [];

// === ICONOS POR RAZA ===
const RaceIcons = {
    'Humano': '⚔️',
    'Elfo': '🧝',
    'Enano': '🪓',
    'Orco': '👹',
    'Drakoniano': '🐲'
};

// === FUNCIONES DE CARGA ===

/**
 * Carga los personajes del usuario
 */
async function loadCharacters() {
    try {
        showLoading(true);

        const response = await fetch(`${API_BASE}/characters.php`, {
            method: 'GET',
            credentials: 'include'
        });

        const data = await response.json();

        if (data.success) {
            allCharacters = data.characters;
            renderCharacters(data.characters);
        } else {
            showToast('Error al cargar personajes', 'error');
        }
    } catch (error) {
        console.error('Error al cargar personajes:', error);
        showToast('Error de conexión', 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Renderiza la lista de personajes
 */
function renderCharacters(characters) {
    CharactersDOM.charactersList.innerHTML = '';

    if (!characters || characters.length === 0) {
        CharactersDOM.emptyState.classList.remove('hidden');
        return;
    }

    CharactersDOM.emptyState.classList.add('hidden');

    characters.forEach((character, index) => {
        const card = createCharacterCard(character);
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('animate-fadeIn');
        CharactersDOM.charactersList.appendChild(card);
    });
}

/**
 * Crea una tarjeta de personaje
 */
function createCharacterCard(character) {
    const card = document.createElement('div');
    card.className = 'character-card';
    card.dataset.characterId = character.id;

    // Botón estrella
    const btnStar = document.createElement('button');
    btnStar.className = `btn-star ${character.is_main ? 'active' : ''}`;
    btnStar.textContent = character.is_main ? '⭐' : '☆';
    btnStar.title = character.is_main ? 'Personaje principal' : 'Marcar como principal';
    btnStar.addEventListener('click', (e) => {
        e.stopPropagation();
        handleToggleMain(character.id, !character.is_main);
    });

    // Header
    const header = document.createElement('div');
    header.className = 'character-header';

    const icon = document.createElement('div');
    icon.className = 'character-icon';

    // Mapeo robusto igual que en profile y creator
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
    const folderName = ClassFolderNames[className];
    const suffix = folderName ? CombinationSuffixes[folderName] : null;

    if (raceName && suffix) {
        // Asumimos que dashboard siempre está en /views/ o root, ajustamos path
        const basePath = window.location.pathname.includes('/views/') ? '../' : '';
        const imagePath = `${basePath}assets/images/Combinaciones/${raceName}/${raceName}${suffix}.png`;

        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = `${raceName} ${className}`;
        img.className = 'card-character-image';
        img.onerror = function () {
            this.style.display = 'none';
            icon.textContent = RaceIcons[raceName] || '🎭';
        };
        icon.appendChild(img);
    } else {
        icon.textContent = RaceIcons[raceName] || '🎭';
    }

    const name = document.createElement('h3');
    name.className = 'character-name';
    name.textContent = character.name;

    header.appendChild(icon);
    header.appendChild(name);

    // Info
    const info = document.createElement('div');
    info.className = 'character-info';

    const roleBadge = document.createElement('span');
    roleBadge.className = `role-badge role-${character.class_role.toLowerCase()}`;
    roleBadge.textContent = character.class_role;

    info.innerHTML = `
        <p><strong>Raza:</strong> ${character.race_name}</p>
        <p><strong>Clase:</strong> ${character.class_name} </p>
        <p><strong>Especialización:</strong> ${character.subclass_name}</p>
        <p><strong>Nivel:</strong> ${character.level}</p>
    `;
    info.querySelector('p:nth-child(2)').appendChild(roleBadge);

    // Acciones
    const actions = document.createElement('div');
    actions.className = 'character-actions';

    const btnEdit = document.createElement('a');
    btnEdit.className = 'btn-edit';
    btnEdit.href = `creator.html?edit=${character.id}`;
    btnEdit.textContent = '✏️ Editar';

    const btnDelete = document.createElement('button');
    btnDelete.className = 'btn-delete';
    btnDelete.textContent = '🗑️ Eliminar';
    btnDelete.addEventListener('click', (e) => {
        e.stopPropagation();
        handleDeleteCharacter(character.id, character.name);
    });

    actions.appendChild(btnEdit);
    actions.appendChild(btnDelete);

    // Ensamblar
    card.appendChild(btnStar);
    card.appendChild(header);
    card.appendChild(info);
    card.appendChild(actions);

    return card;
}

// === FUNCIONES DE ACCIONES ===

/**
 * Elimina un personaje
 */
async function handleDeleteCharacter(characterId, characterName) {
    console.log('[DELETE] Intentando eliminar:', { characterId, characterName });
    
    if (!confirm(`¿Estás seguro de eliminar a "${characterName}"?`)) return;

    try {
        showLoading(true);

        const requestBody = { id: parseInt(characterId, 10) };
        console.log('[DELETE] Enviando request:', requestBody);

        const response = await fetch(`${API_BASE}/characters.php`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(requestBody)
        });

        console.log('[DELETE] Response status:', response.status);
        
        const data = await response.json();
        console.log('[DELETE] Response data:', data);

        if (data.success) {
            showToast(`Personaje "${characterName}" eliminado`, 'success');
            loadCharacters();
        } else {
            showToast(data.message || 'Error al eliminar', 'error');
        }
    } catch (error) {
        console.error('[DELETE] Error:', error);
        showToast('Error de conexión', 'error');
    } finally {
        showLoading(false);
    }
}


/**
 * Toggle personaje principal
 */
async function handleToggleMain(characterId, setAsMain) {
    try {
        const response = await fetch(`${API_BASE}/set-main.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ character_id: characterId, is_main: setAsMain })
        });

        const data = await response.json();

        if (data.success) {
            showToast(setAsMain ? '⭐ Personaje principal establecido' : 'Personaje principal eliminado', 'success');
            loadCharacters();
        } else {
            showToast(data.message || 'Error', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error de conexión', 'error');
    }
}

// === BÚSQUEDA ===

/**
 * Filtra personajes
 */
function filterCharacters(searchTerm) {
    const term = searchTerm.toLowerCase().trim();

    if (!term) {
        renderCharacters(allCharacters);
        return;
    }

    const filtered = allCharacters.filter(char => {
        return char.name.toLowerCase().includes(term) ||
            char.race_name.toLowerCase().includes(term) ||
            char.class_name.toLowerCase().includes(term) ||
            char.subclass_name.toLowerCase().includes(term);
    });

    if (filtered.length > 0) {
        renderCharacters(filtered);
    } else {
        showNoResults(searchTerm);
    }
}

/**
 * Muestra mensaje de no resultados
 */
function showNoResults(searchTerm) {
    CharactersDOM.charactersList.innerHTML = `
        <div class="no-results">
            <span class="no-results-icon">🔮</span>
            <h3>No se encontraron héroes</h3>
            <p>No hay personajes que coincidan con "<strong>${searchTerm}</strong>"</p>
        </div>
    `;
    CharactersDOM.emptyState.classList.add('hidden');
}

// === DEBOUNCE ===
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// === INICIALIZACIÓN ===

document.addEventListener('DOMContentLoaded', () => {
    // Cargar personajes
    loadCharacters();

    // Verificar sesión y actualizar nav
    checkUserSession();

    // Configurar búsqueda
    if (CharactersDOM.searchInput) {
        const debouncedFilter = debounce(filterCharacters, 300);

        CharactersDOM.searchInput.addEventListener('input', (e) => {
            debouncedFilter(e.target.value);
        });

        CharactersDOM.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                CharactersDOM.searchInput.value = '';
                filterCharacters('');
            }
        });
    }
});

console.log('Dashboard cargado');
