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

console.log('Módulo de Personajes cargado');
