/**
 * CREATOR-PAGE.JS - Script del Creador de Personajes
 * Versión simplificada para la página creator.html
 */

// Verificar autenticación (opcional, para UI)
checkUserSession().then(isAuthenticated => {
    // Si hay un personaje pendiente y el usuario acaba de loguearse, restaurarlo
    if (isAuthenticated) {
        checkPendingCharacter();
    }
});

// === ELEMENTOS DEL DOM ===
const CreatorDOM = {
    form: document.getElementById('formCharacter'),
    characterName: document.getElementById('characterName'),
    characterLevel: document.getElementById('characterLevel'),
    racesList: document.getElementById('racesList'),
    classesList: document.getElementById('classesList'),
    subclassesList: document.getElementById('subclassesList'),
    subclassSection: document.getElementById('subclassSection'),
    abilitiesSection: document.getElementById('abilitiesSection'),
    generalAbilitiesList: document.getElementById('generalAbilitiesList'),
    subclassAbilitiesList: document.getElementById('subclassAbilitiesList'),
    btnSubmit: document.getElementById('btnSubmitCharacter'),
    creatorTitle: document.getElementById('creatorTitle')
};

// === ESTADO ===
const CreatorState = {
    races: [],
    classes: [],
    subclasses: [],
    selectedRaceId: null,
    selectedClassId: null,
    selectedSubclassId: null,
    editingId: null
};

// === MAPEOS ===
const ClassFolderNames = {
    'Guerrero': 'warrior',
    'Clérigo': 'priest',
    'Mago': 'mage',
    'Cazador': 'hunter',
    'Pícaro': 'rogue'
};

const ClassLogoNames = {
    'warrior': 'logoWarrior.png',
    'priest': 'logoPriest.png',
    'mage': 'logoMago.png',
    'hunter': 'logoHunter.png',
    'rogue': 'logoRogue.png'
};

const RaceIcons = {
    'Humano': '⚔️',
    'Elfo': '🧝',
    'Enano': '🪓',
    'Orco': '👹',
    'Drakoniano': '🐲'
};

function normalizeFileName(str) {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// === CARGA DE DATOS ===

async function loadRaces() {
    try {
        const response = await fetch(`${API_BASE}/races.php`);
        const data = await response.json();
        if (data.success) {
            CreatorState.races = data.races;
            renderRaces(data.races);
        }
    } catch (error) {
        console.error('Error al cargar razas:', error);
    }
}

async function loadClasses() {
    try {
        const response = await fetch(`${API_BASE}/classes.php`);
        const data = await response.json();
        if (data.success) {
            CreatorState.classes = data.classes;
            renderClasses(data.classes);
        }
    } catch (error) {
        console.error('Error al cargar clases:', error);
    }
}

async function loadSubclasses(classId) {
    try {
        const response = await fetch(`${API_BASE}/subclasses.php?class_id=${classId}`);
        const data = await response.json();
        if (data.success) {
            CreatorState.subclasses = data.subclasses;
            renderSubclasses(data.subclasses);
            CreatorDOM.subclassSection.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error al cargar subclases:', error);
    }
}

async function loadAbilities(classId, subclassId) {
    try {
        const response = await fetch(`${API_BASE}/abilities.php?class_id=${classId}&subclass_id=${subclassId}`);
        const data = await response.json();
        if (data.success) {
            renderAbilities(data.abilities);
            CreatorDOM.abilitiesSection.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error al cargar habilidades:', error);
    }
}

// === RENDERIZADO ===

function renderRaces(races) {
    CreatorDOM.racesList.innerHTML = '';
    races.forEach(race => {
        const card = document.createElement('div');
        card.className = 'selection-card';
        card.dataset.raceId = race.id;

        const icon = document.createElement('div');
        icon.className = 'selection-icon';

        if (race.image_path) {
            const img = document.createElement('img');
            img.src = race.image_path;
            img.alt = race.name;
            img.className = 'race-image';
            icon.appendChild(img);
        } else {
            icon.textContent = RaceIcons[race.name] || '🎭';
        }

        card.innerHTML += `
            <div class="selection-name">${race.name}</div>
            <div class="selection-desc">${race.description}</div>
        `;
        card.prepend(icon);

        card.addEventListener('click', () => selectRace(race.id, card));
        CreatorDOM.racesList.appendChild(card);
    });
}

function renderClasses(classes) {
    CreatorDOM.classesList.innerHTML = '';
    classes.forEach(cls => {
        const card = document.createElement('div');
        card.className = 'selection-card';
        card.dataset.classId = cls.id;

        const icon = document.createElement('div');
        icon.className = 'selection-icon';

        const folderName = ClassFolderNames[cls.name];
        if (folderName) {
            const img = document.createElement('img');
            img.src = `assets/images/classes/${folderName}/${ClassLogoNames[folderName]}`;
            img.alt = cls.name;
            img.className = 'class-logo';
            img.onerror = function () {
                this.style.display = 'none';
            };
            icon.appendChild(img);
        }

        card.innerHTML += `
            <div class="selection-name">${cls.name}</div>
            <div class="selection-role">Rol: ${cls.role}</div>
            <div class="selection-desc">${cls.description}</div>
        `;
        card.prepend(icon);

        card.addEventListener('click', () => selectClass(cls.id, card));
        CreatorDOM.classesList.appendChild(card);
    });
}

function renderSubclasses(subclasses) {
    CreatorDOM.subclassesList.innerHTML = '';
    const selectedClass = CreatorState.classes.find(c => c.id === CreatorState.selectedClassId);
    const folderName = selectedClass ? ClassFolderNames[selectedClass.name] : null;

    subclasses.forEach(subcls => {
        const card = document.createElement('div');
        card.className = 'selection-card';
        card.dataset.subclassId = subcls.id;

        if (folderName) {
            const icon = document.createElement('div');
            icon.className = 'selection-icon';
            const img = document.createElement('img');
            img.src = `assets/images/classes/${folderName}/${normalizeFileName(subcls.name)}/${normalizeFileName(subcls.name)}.png`;
            img.alt = subcls.name;
            img.className = 'subclass-image';
            img.onerror = function () { icon.style.display = 'none'; };
            icon.appendChild(img);
            card.appendChild(icon);
        }

        card.innerHTML += `
            <div class="selection-name">${subcls.name}</div>
            <div class="selection-desc">${subcls.description}</div>
        `;

        card.addEventListener('click', () => selectSubclass(subcls.id, card));
        CreatorDOM.subclassesList.appendChild(card);
    });
}

function renderAbilities(abilities) {
    CreatorDOM.generalAbilitiesList.innerHTML = '';
    CreatorDOM.subclassAbilitiesList.innerHTML = '';

    if (abilities.general) {
        abilities.general.forEach(ability => {
            CreatorDOM.generalAbilitiesList.innerHTML += `
                <div class="ability-item">
                    <div class="ability-name">${ability.name}</div>
                    <div class="ability-desc">${ability.description}</div>
                </div>
            `;
        });
    }

    if (abilities.subclass) {
        abilities.subclass.forEach(ability => {
            CreatorDOM.subclassAbilitiesList.innerHTML += `
                <div class="ability-item">
                    <div class="ability-name">${ability.name}</div>
                    <div class="ability-desc">${ability.description}</div>
                </div>
            `;
        });
    }
}

// === SELECCIÓN ===

function selectRace(raceId, card) {
    CreatorDOM.racesList.querySelectorAll('.selection-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    CreatorState.selectedRaceId = raceId;
}

function selectClass(classId, card) {
    CreatorDOM.classesList.querySelectorAll('.selection-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    CreatorState.selectedClassId = classId;
    CreatorState.selectedSubclassId = null;
    CreatorDOM.subclassSection.classList.add('hidden');
    CreatorDOM.abilitiesSection.classList.add('hidden');
    loadSubclasses(classId);
}

function selectSubclass(subclassId, card) {
    CreatorDOM.subclassesList.querySelectorAll('.selection-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    CreatorState.selectedSubclassId = subclassId;
    loadAbilities(CreatorState.selectedClassId, subclassId);
}

// === SUBMIT ===

async function handleSubmit(event) {
    event.preventDefault();

    const name = CreatorDOM.characterName.value.trim();

    if (!name) {
        showToast('El nombre es requerido', 'error');
        return;
    }
    if (!CreatorState.selectedRaceId) {
        showToast('Selecciona una raza', 'error');
        return;
    }
    if (!CreatorState.selectedClassId) {
        showToast('Selecciona una clase', 'error');
        return;
    }
    if (!CreatorState.selectedSubclassId) {
        showToast('Selecciona una especialización', 'error');
        return;
    }

    const characterData = {
        name: name,
        race_id: CreatorState.selectedRaceId,
        class_id: CreatorState.selectedClassId,
        subclass_id: CreatorState.selectedSubclassId,
        level: parseInt(CreatorDOM.characterLevel.value) || 1
    };

    const isEditing = CreatorState.editingId !== null;
    if (isEditing) {
        characterData.id = CreatorState.editingId;
    }

    if (isEditing) {
        characterData.id = CreatorState.editingId;
    }

    try {
        if (isEditing) {
            // Flujo normal de edición (usuario autenticado)
            sendCharacterData(characterData, true);
        } else {
            // Verificar sesión antes de crear
            const isAuthenticated = await checkUserSession();

            if (!isAuthenticated) {
                // GUARDADO TEMPORAL
                localStorage.setItem('pendingCharacter', JSON.stringify(characterData));

                showToast('🔑 Inicia sesión para guardar tu héroe', 'info');

                setTimeout(() => {
                    window.location.href = 'login.html?redirect=creator';
                }, 1500);
                return;
            }

            // Si está autenticado, enviar
            sendCharacterData(characterData, false);
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error de conexión', 'error');
    }
}

async function sendCharacterData(data, isEditing) {
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE}/characters.php`, {
            method: isEditing ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data)
        });

        const resData = await response.json();

        if (resData.success) {
            showToast(isEditing ? 'Personaje actualizado' : 'Personaje creado', 'success');
            // Limpiar pendiente si existía
            localStorage.removeItem('pendingCharacter');

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 500);
        } else {
            showToast(resData.message || 'Error', 'error');
        }
    } catch (error) {
        console.error('Error al guardar:', error);
        showToast('Error de conexión', 'error');
    } finally {
        showLoading(false);
    }
}

function checkPendingCharacter() {
    const pending = localStorage.getItem('pendingCharacter');
    if (pending) {
        try {
            const charData = JSON.parse(pending);
            showToast('🔄 Restaurando tu héroe pendiente...', 'info');

            CreatorDOM.characterName.value = charData.name;
            CreatorDOM.characterLevel.value = charData.level;

            // Esperar carga de datos
            setTimeout(() => {
                if (charData.race_id) {
                    CreatorState.selectedRaceId = charData.race_id;
                    const el = document.querySelector(`[data-race-id="${charData.race_id}"]`);
                    if (el) el.classList.add('selected');
                }
                if (charData.class_id) {
                    CreatorState.selectedClassId = charData.class_id;
                    const el = document.querySelector(`[data-class-id="${charData.class_id}"]`);
                    if (el) el.classList.add('selected');

                    loadSubclasses(charData.class_id).then(() => {
                        setTimeout(() => {
                            if (charData.subclass_id) {
                                CreatorState.selectedSubclassId = charData.subclass_id;
                                const subEl = document.querySelector(`[data-subclass-id="${charData.subclass_id}"]`);
                                if (subEl) subEl.classList.add('selected');
                                loadAbilities(charData.class_id, charData.subclass_id);
                            }
                        }, 500);
                    });
                }
            }, 1000);

            // Podríamos auto-guardar aquí, pero mejor dejar que el usuario revise y guarde
        } catch (e) {
            console.error('Error restaurando pendingCharacter', e);
        }
    }
}

// === EDICIÓN ===

async function loadCharacterForEdit(characterId) {
    try {
        showLoading(true);

        const response = await fetch(`${API_BASE}/characters.php?id=${characterId}`, {
            method: 'GET',
            credentials: 'include'
        });

        const data = await response.json();

        if (data.success && data.character) {
            const char = data.character;
            CreatorState.editingId = char.id;

            CreatorDOM.creatorTitle.textContent = `Editar: ${char.name}`;
            CreatorDOM.btnSubmit.textContent = 'Guardar Cambios';
            CreatorDOM.characterName.value = char.name;
            CreatorDOM.characterLevel.value = char.level;

            // Esperar a que carguen las razas y clases
            setTimeout(() => {
                // Seleccionar raza
                CreatorState.selectedRaceId = char.race_id;
                const raceCard = CreatorDOM.racesList.querySelector(`[data-race-id="${char.race_id}"]`);
                if (raceCard) raceCard.classList.add('selected');

                // Seleccionar clase
                CreatorState.selectedClassId = char.class_id;
                const classCard = CreatorDOM.classesList.querySelector(`[data-class-id="${char.class_id}"]`);
                if (classCard) classCard.classList.add('selected');

                // Cargar subclases
                loadSubclasses(char.class_id).then(() => {
                    setTimeout(() => {
                        CreatorState.selectedSubclassId = char.subclass_id;
                        const subclassCard = CreatorDOM.subclassesList.querySelector(`[data-subclass-id="${char.subclass_id}"]`);
                        if (subclassCard) subclassCard.classList.add('selected');
                        loadAbilities(char.class_id, char.subclass_id);
                    }, 300);
                });
            }, 500);
        }
    } catch (error) {
        console.error('Error al cargar personaje:', error);
        showToast('Error al cargar personaje', 'error');
    } finally {
        showLoading(false);
    }
}

// === INICIALIZACIÓN ===

document.addEventListener('DOMContentLoaded', () => {
    loadRaces();
    loadClasses();
    checkUserSession();

    CreatorDOM.form.addEventListener('submit', handleSubmit);

    // Verificar si es edición
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    if (editId) {
        loadCharacterForEdit(parseInt(editId));
    }
});

console.log('Creador de personajes cargado');
