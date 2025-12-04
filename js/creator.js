/**
 * CREATOR.JS - Módulo del Creador de Personajes
 * Gestiona la creación y edición de personajes, carga de datos del juego
 */

// === ELEMENTOS DEL DOM ===
const CreatorDOM = {
    form: document.getElementById('formCharacter'),
    characterName: document.getElementById('characterName'),
    
    // Listas de selección
    racesList: document.getElementById('racesList'),
    classesList: document.getElementById('classesList'),
    subclassesList: document.getElementById('subclassesList'),
    
    // Secciones
    subclassSection: document.getElementById('subclassSection'),
    abilitiesSection: document.getElementById('abilitiesSection'),
    
    // Habilidades
    generalAbilitiesList: document.getElementById('generalAbilitiesList'),
    subclassAbilitiesList: document.getElementById('subclassAbilitiesList'),
    
    // Botón
    btnSubmit: document.getElementById('btnSubmitCharacter')
};

// === ESTADO DEL CREADOR ===
const CreatorState = {
    races: [],
    classes: [],
    subclasses: [],
    abilities: [],
    
    selectedRaceId: null,
    selectedClassId: null,
    selectedSubclassId: null
};

// === ICONOS ===
const ClassIcons = {
    'Guerrero': '🛡️',
    'Clérigo': '✨',
    'Mago': '🔥',
    'Cazador': '🏹',
    'Pícaro': '🗡️'
};

// === FUNCIONES DE CARGA DE DATOS ===

/**
 * Carga las razas desde la API
 */
async function loadRaces() {
    try {
        const response = await fetch(`${API_BASE}/races.php`, {
            method: 'GET'
        });
        
        const data = await response.json();
        
        if (data.success) {
            CreatorState.races = data.races;
            renderRaces(data.races);
        } else {
            console.error('Error al cargar razas');
        }
    } catch (error) {
        console.error('Error al cargar razas:', error);
    }
}

/**
 * Carga las clases desde la API
 */
async function loadClasses() {
    try {
        const response = await fetch(`${API_BASE}/classes.php`, {
            method: 'GET'
        });
        
        const data = await response.json();
        
        if (data.success) {
            CreatorState.classes = data.classes;
            renderClasses(data.classes);
        } else {
            console.error('Error al cargar clases');
        }
    } catch (error) {
        console.error('Error al cargar clases:', error);
    }
}

/**
 * Carga las subclases de una clase específica
 * @param {number} classId - ID de la clase
 */
async function loadSubclasses(classId) {
    try {
        const response = await fetch(`${API_BASE}/subclasses.php?class_id=${classId}`, {
            method: 'GET'
        });
        
        const data = await response.json();
        
        if (data.success) {
            CreatorState.subclasses = data.subclasses;
            renderSubclasses(data.subclasses);
            
            // Mostrar sección de subclases
            CreatorDOM.subclassSection.classList.remove('hidden');
        } else {
            console.error('Error al cargar subclases');
        }
    } catch (error) {
        console.error('Error al cargar subclases:', error);
    }
}

/**
 * Carga las habilidades de una clase y subclase
 * @param {number} classId - ID de la clase
 * @param {number} subclassId - ID de la subclase
 */
async function loadAbilities(classId, subclassId) {
    try {
        const response = await fetch(
            `${API_BASE}/abilities.php?class_id=${classId}&subclass_id=${subclassId}`,
            { method: 'GET' }
        );
        
        const data = await response.json();
        
        if (data.success) {
            CreatorState.abilities = data.abilities;
            renderAbilities(data.abilities);
            
            // Mostrar sección de habilidades
            CreatorDOM.abilitiesSection.classList.remove('hidden');
        } else {
            console.error('Error al cargar habilidades');
        }
    } catch (error) {
        console.error('Error al cargar habilidades:', error);
    }
}

// === FUNCIONES DE RENDERIZADO ===

/**
 * Renderiza las razas disponibles
 * @param {Array} races - Array de razas
 */
function renderRaces(races) {
    CreatorDOM.racesList.innerHTML = '';
    
    races.forEach(race => {
        const card = document.createElement('div');
        card.className = 'selection-card';
        card.dataset.raceId = race.id;
        
        const icon = document.createElement('div');
        icon.className = 'selection-icon';
        icon.textContent = RaceIcons[race.name] || '🎭';
        
        const name = document.createElement('div');
        name.className = 'selection-name';
        name.textContent = race.name;
        
        const desc = document.createElement('div');
        desc.className = 'selection-desc';
        desc.textContent = race.description;
        
        card.appendChild(icon);
        card.appendChild(name);
        card.appendChild(desc);
        
        // Evento click para seleccionar raza
        card.addEventListener('click', () => {
            selectRace(race.id, card);
        });
        
        CreatorDOM.racesList.appendChild(card);
    });
}

/**
 * Renderiza las clases disponibles
 * @param {Array} classes - Array de clases
 */
function renderClasses(classes) {
    CreatorDOM.classesList.innerHTML = '';
    
    classes.forEach(cls => {
        const card = document.createElement('div');
        card.className = 'selection-card';
        card.dataset.classId = cls.id;
        
        const icon = document.createElement('div');
        icon.className = 'selection-icon';
        icon.textContent = ClassIcons[cls.name] || '⚔️';
        
        const name = document.createElement('div');
        name.className = 'selection-name';
        name.textContent = cls.name;
        
        const role = document.createElement('div');
        role.className = 'selection-role';
        role.textContent = `Rol: ${cls.role}`;
        
        const desc = document.createElement('div');
        desc.className = 'selection-desc';
        desc.textContent = cls.description;
        
        card.appendChild(icon);
        card.appendChild(name);
        card.appendChild(role);
        card.appendChild(desc);
        
        // Evento click para seleccionar clase
        card.addEventListener('click', () => {
            selectClass(cls.id, card);
        });
        
        CreatorDOM.classesList.appendChild(card);
    });
}

/**
 * Renderiza las subclases disponibles
 * @param {Array} subclasses - Array de subclases
 */
function renderSubclasses(subclasses) {
    CreatorDOM.subclassesList.innerHTML = '';
    
    subclasses.forEach(subcls => {
        const card = document.createElement('div');
        card.className = 'selection-card';
        card.dataset.subclassId = subcls.id;
        
        const name = document.createElement('div');
        name.className = 'selection-name';
        name.textContent = subcls.name;
        
        const desc = document.createElement('div');
        desc.className = 'selection-desc';
        desc.textContent = subcls.description;
        
        card.appendChild(name);
        card.appendChild(desc);
        
        // Evento click para seleccionar subclase
        card.addEventListener('click', () => {
            selectSubclass(subcls.id, card);
        });
        
        CreatorDOM.subclassesList.appendChild(card);
    });
}

/**
 * Renderiza las habilidades
 * @param {Object} abilities - Objeto con habilidades generales y de subclase
 */
function renderAbilities(abilities) {
    // Renderizar habilidades generales
    CreatorDOM.generalAbilitiesList.innerHTML = '';
    
    if (abilities.general && abilities.general.length > 0) {
        abilities.general.forEach(ability => {
            const item = createAbilityItem(ability);
            CreatorDOM.generalAbilitiesList.appendChild(item);
        });
    }
    
    // Renderizar habilidades de subclase
    CreatorDOM.subclassAbilitiesList.innerHTML = '';
    
    if (abilities.subclass && abilities.subclass.length > 0) {
        abilities.subclass.forEach(ability => {
            const item = createAbilityItem(ability);
            CreatorDOM.subclassAbilitiesList.appendChild(item);
        });
    }
}

/**
 * Crea un elemento de habilidad
 * @param {Object} ability - Datos de la habilidad
 * @returns {HTMLElement} - Elemento de la habilidad
 */
function createAbilityItem(ability) {
    const item = document.createElement('div');
    item.className = 'ability-item';
    
    const name = document.createElement('div');
    name.className = 'ability-name';
    name.textContent = ability.name;
    
    const desc = document.createElement('div');
    desc.className = 'ability-desc';
    desc.textContent = ability.description;
    
    item.appendChild(name);
    item.appendChild(desc);
    
    return item;
}

// === FUNCIONES DE SELECCIÓN ===

/**
 * Selecciona una raza
 * @param {number} raceId - ID de la raza
 * @param {HTMLElement} card - Elemento de la tarjeta
 */
function selectRace(raceId, card) {
    // Remover selección previa
    const cards = CreatorDOM.racesList.querySelectorAll('.selection-card');
    cards.forEach(c => c.classList.remove('selected'));
    
    // Marcar como seleccionada
    card.classList.add('selected');
    CreatorState.selectedRaceId = raceId;
    
    console.log('Raza seleccionada:', raceId);
}

/**
 * Selecciona una clase
 * @param {number} classId - ID de la clase
 * @param {HTMLElement} card - Elemento de la tarjeta
 */
function selectClass(classId, card) {
    // Remover selección previa
    const cards = CreatorDOM.classesList.querySelectorAll('.selection-card');
    cards.forEach(c => c.classList.remove('selected'));
    
    // Marcar como seleccionada
    card.classList.add('selected');
    CreatorState.selectedClassId = classId;
    
    // Resetear subclase y habilidades
    CreatorState.selectedSubclassId = null;
    CreatorDOM.subclassSection.classList.add('hidden');
    CreatorDOM.abilitiesSection.classList.add('hidden');
    
    // Cargar subclases
    loadSubclasses(classId);
    
    console.log('Clase seleccionada:', classId);
}

/**
 * Selecciona una subclase
 * @param {number} subclassId - ID de la subclase
 * @param {HTMLElement} card - Elemento de la tarjeta
 */
function selectSubclass(subclassId, card) {
    // Remover selección previa
    const cards = CreatorDOM.subclassesList.querySelectorAll('.selection-card');
    cards.forEach(c => c.classList.remove('selected'));
    
    // Marcar como seleccionada
    card.classList.add('selected');
    CreatorState.selectedSubclassId = subclassId;
    
    // Cargar habilidades
    loadAbilities(CreatorState.selectedClassId, subclassId);
    
    console.log('Subclase seleccionada:', subclassId);
}

// === FUNCIONES DE FORMULARIO ===

/**
 * Maneja el envío del formulario de personaje
 * @param {Event} event - Evento del formulario
 */
async function handleCharacterSubmit(event) {
    event.preventDefault();
    
    const name = CreatorDOM.characterName.value.trim();
    
    // Validar que se completaron todos los campos
    if (!name) {
        showToast('El nombre del personaje es requerido', 'error');
        return;
    }
    
    if (!CreatorState.selectedRaceId) {
        showToast('Debes seleccionar una raza', 'error');
        return;
    }
    
    if (!CreatorState.selectedClassId) {
        showToast('Debes seleccionar una clase', 'error');
        return;
    }
    
    if (!CreatorState.selectedSubclassId) {
        showToast('Debes seleccionar una especialización', 'error');
        return;
    }
    
    // Determinar si es creación o edición
    const isEditing = AppState.editingCharacterId !== null;
    
    const characterData = {
        name: name,
        race_id: CreatorState.selectedRaceId,
        class_id: CreatorState.selectedClassId,
        subclass_id: CreatorState.selectedSubclassId,
        level: 1
    };
    
    if (isEditing) {
        characterData.id = AppState.editingCharacterId;
        await updateCharacter(characterData);
    } else {
        await createCharacter(characterData);
    }
}

/**
 * Crea un nuevo personaje
 * @param {Object} characterData - Datos del personaje
 */
async function createCharacter(characterData) {
    try {
        showLoading(true);
        
        const response = await fetch(`${API_BASE}/characters.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(characterData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast(`✅ Personaje "${characterData.name}" creado correctamente`, 'success');
            
            // Resetear formulario
            resetCreatorForm();
            
            // Volver al dashboard
            switchView('dashboard');
        } else {
            showToast(data.message || 'Error al crear personaje', 'error');
        }
    } catch (error) {
        console.error('Error al crear personaje:', error);
        showToast('Error de conexión', 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Actualiza un personaje existente
 * @param {Object} characterData - Datos del personaje
 */
async function updateCharacter(characterData) {
    try {
        showLoading(true);
        
        const response = await fetch(`${API_BASE}/characters.php`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(characterData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast(`✅ Personaje actualizado correctamente`, 'success');
            
            // Resetear estado de edición
            AppState.editingCharacterId = null;
            
            // Resetear formulario
            resetCreatorForm();
            
            // Volver al dashboard
            switchView('dashboard');
        } else {
            showToast(data.message || 'Error al actualizar personaje', 'error');
        }
    } catch (error) {
        console.error('Error al actualizar personaje:', error);
        showToast('Error de conexión', 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Resetea el formulario del creador
 */
function resetCreatorForm() {
    // Limpiar formulario
    CreatorDOM.form.reset();
    
    // Resetear estado
    CreatorState.selectedRaceId = null;
    CreatorState.selectedClassId = null;
    CreatorState.selectedSubclassId = null;
    
    // Remover selecciones visuales
    const allCards = document.querySelectorAll('.selection-card');
    allCards.forEach(card => card.classList.remove('selected'));
    
    // Ocultar secciones
    CreatorDOM.subclassSection.classList.add('hidden');
    CreatorDOM.abilitiesSection.classList.add('hidden');
    
    // Resetear botón
    CreatorDOM.btnSubmit.textContent = 'Crear Personaje';
    
    console.log('Formulario reseteado');
}

/**
 * Pre-llena el formulario con datos de un personaje (para edición)
 * @param {Object} character - Datos del personaje
 */
function populateCreatorForm(character) {
    // Llenar nombre
    CreatorDOM.characterName.value = character.name;
    
    // Seleccionar raza
    CreatorState.selectedRaceId = character.race_id;
    const raceCard = CreatorDOM.racesList.querySelector(`[data-race-id="${character.race_id}"]`);
    if (raceCard) {
        raceCard.classList.add('selected');
    }
    
    // Seleccionar clase
    CreatorState.selectedClassId = character.class_id;
    const classCard = CreatorDOM.classesList.querySelector(`[data-class-id="${character.class_id}"]`);
    if (classCard) {
        classCard.classList.add('selected');
    }
    
    // Cargar y seleccionar subclase
    loadSubclasses(character.class_id).then(() => {
        CreatorState.selectedSubclassId = character.subclass_id;
        const subclassCard = CreatorDOM.subclassesList.querySelector(`[data-subclass-id="${character.subclass_id}"]`);
        if (subclassCard) {
            subclassCard.classList.add('selected');
        }
        
        // Cargar habilidades
        loadAbilities(character.class_id, character.subclass_id);
    });
}

// === EVENT LISTENERS ===

// Evento submit del formulario
CreatorDOM.form.addEventListener('submit', handleCharacterSubmit);

// === INICIALIZACIÓN ===

// Cargar razas y clases al inicio
loadRaces();
loadClasses();

console.log('Módulo del Creador cargado');
