// Traducciones de razas
const traduccionesRazas = {
    "dwarf": "Enano",
    "elf": "Elfo",
    "halfling": "Mediano",
    "human": "Humano",
    "dragonborn": "Dracónido",
    "gnome": "Gnomo",
    "half-elf": "Medio-Elfo",
    "half-orc": "Medio-Orco",
    "tiefling": "Tiefling"
};

// Traducciones de clases
const traduccionesClases = {
    "barbarian": "Bárbaro",
    "bard": "Bardo",
    "cleric": "Clérigo",
    "druid": "Druida",
    "fighter": "Guerrero",
    "monk": "Monje",
    "paladin": "Paladín",
    "ranger": "Explorador",
    "rogue": "Pícaro",
    "sorcerer": "Hechicero",
    "warlock": "Brujo",
    "wizard": "Mago"
};

// Cargar personajes al iniciar
document.addEventListener('DOMContentLoaded', () => {
    cargarPersonajes();
    configurarEventos();
});

function cargarPersonajes() {
    const personajes = JSON.parse(localStorage.getItem('personajesDND')) || [];
    const container = document.getElementById('personajes-container');
    
    container.innerHTML = '';
    
    if (personajes.length === 0) {
        container.innerHTML = '<p class="sin-personajes">No tienes personajes guardados todavía.</p>';
        return;
    }
    
    personajes.forEach(personaje => {
        const card = document.createElement('div');
        card.className = 'personaje-card';
        card.innerHTML = crearHTMLPersonaje(personaje);
        container.appendChild(card);
    });
}

function crearHTMLPersonaje(personaje) {
    return `
        <div class="personaje-header">
            <h2 class="personaje-nombre">${personaje.nombre || 'Sin nombre'}</h2>
            <span class="personaje-fecha">${formatearFecha(personaje.fechaCreacion)}</span>
        </div>
        <p><strong>Raza:</strong> ${traduccionesRazas[personaje.raza] || personaje.raza || '--'}</p>
        <p><strong>Clase:</strong> ${traduccionesClases[personaje.clase] || personaje.clase || '--'}</p>
        
        <div class="personaje-stats">
            <div class="stat-badge">
                <div class="stat-label">HP</div>
                <div class="stat-value">${personaje.stats?.hp || '--'}</div>
            </div>
            <div class="stat-badge">
                <div class="stat-label">ATK</div>
                <div class="stat-value">${personaje.stats?.atk || '--'}</div>
            </div>
            <div class="stat-badge">
                <div class="stat-label">DEF</div>
                <div class="stat-value">${personaje.stats?.def || '--'}</div>
            </div>
        </div>
        
        <div class="personaje-equipo">
            <h3>Equipo (${personaje.equipo?.length || 0})</h3>
            <ul>
                ${personaje.equipo?.map(item => `<li>${item.nombre}</li>`).join('') || '<li>Sin equipo</li>'}
            </ul>
        </div>
    `;
}

function formatearFecha(fechaISO) {
    const opciones = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(fechaISO).toLocaleDateString('es-ES', opciones);
}

function configurarEventos() {
    // Botón volver
    document.getElementById('btn-volver').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    // Filtro de búsqueda
    document.getElementById('buscar-personaje').addEventListener('input', (e) => {
        filtrarPersonajes(e.target.value.toLowerCase());
    });
    
    // Filtro por clase
    document.getElementById('filtro-clase').addEventListener('change', (e) => {
        filtrarPersonajes('', e.target.value);
    });
}

function filtrarPersonajes(nombre = '', clase = '') {
    const personajes = JSON.parse(localStorage.getItem('personajesDND')) || [];
    const container = document.getElementById('personajes-container');
    
    container.innerHTML = '';
    
    const filtrados = personajes.filter(personaje => {
        const cumpleNombre = personaje.nombre?.toLowerCase().includes(nombre);
        const cumpleClase = !clase || personaje.clase === clase;
        return cumpleNombre && cumpleClase;
    });
    
    if (filtrados.length === 0) {
        container.innerHTML = '<p class="sin-personajes">No se encontraron personajes con esos criterios.</p>';
        return;
    }
    
    filtrados.forEach(personaje => {
        const card = document.createElement('div');
        card.className = 'personaje-card';
        card.innerHTML = crearHTMLPersonaje(personaje);
        container.appendChild(card);
    });
}