import { getRaces, getClasses } from './api/dndApi.js';
import { descripcionesClases } from './clases.js';

// ==================== RAZAS ====================
const traducciones = {
  razas: {
    "dwarf": "Enano",
    "elf": "Elfo",
    "halfling": "Mediano",
    "human": "Humano",
    "dragonborn": "Dracónido",
    "gnome": "Gnomo",
    "half-elf": "Medio-Elfo",
    "half-orc": "Medio-Orco",
    "tiefling": "Tiefling"
  },
  descripciones: {
    "dwarf": "Resistentes y fuertes, expertos en combate cuerpo a cuerpo.",
    "elf": "Ágiles y con afinidad mágica, precisos en combate a distancia.",
    "halfling": "Pequeños y ágiles, con suerte natural.",
    "human": "Versátiles y adaptables, aprenden rápido.",
    "dragonborn": "Fuertes con aliento elemental, orgullosos como dragones.",
    "gnome": "Pequeños e ingeniosos, amantes de la invención.",
    "half-elf": "Carismáticos, con gracia élfica y ambición humana.",
    "half-orc": "Fuertes y resistentes, con furia en batalla.",
    "tiefling": "Con herencia infernal, habilidades mágicas innatas."
  },
  estadisticas: {
    "dwarf": { hp: 120, atk: 80 },
    "elf": { hp: 90, atk: 110 },
    "halfling": { hp: 85, atk: 95 },
    "human": { hp: 100, atk: 100 },
    "dragonborn": { hp: 130, atk: 90 },
    "gnome": { hp: 80, atk: 85 },
    "half-elf": { hp: 95, atk: 105 },
    "half-orc": { hp: 110, atk: 105 },
    "tiefling": { hp: 90, atk: 100 }
  }
};

let todasLasRazas = [];
const cartaRaza = document.getElementById('race-card');
const btnAnterior = document.getElementById('btn-prev');
const btnSiguiente = document.getElementById('btn-next');

let indiceActual = 0;

function mostrarRaza(indice) {
  if (indice < 0 || indice >= todasLasRazas.length) return;

  const raza = todasLasRazas[indice];
  const clave = raza.index;
  const datos = traducciones.estadisticas[clave] || { hp: 100, atk: 100 };

  cartaRaza.innerHTML = `
    <div class="title">${traducciones.razas[clave] || raza.name}</div>
    <div class="image-box">
      <img class="img_tarjet" src="storade/img/${clave}.jpg" alt="${raza.name}">
    </div>
    <div class="description">
      ${traducciones.descripciones[clave] || "Descripción no disponible"}
    </div>
    <div class="stats">
      <span>HP: ${datos.hp}</span>
      <span>ATK: ${datos.atk}</span>
    </div>
  `;

  indiceActual = indice;
}

async function cargarRazas() {
  try {
    const respuesta = await getRaces();
    todasLasRazas = respuesta.results;

    if (todasLasRazas.length > 0) {
      mostrarRaza(0);
    } else {
      cartaRaza.innerHTML = "<p>No se encontraron razas disponibles</p>";
    }
  } catch (error) {
    cartaRaza.innerHTML = `<div class="error"><p>Error al cargar las razas</p></div>`;
    console.error("Error al cargar las razas:", error);
  }
}

btnAnterior.addEventListener('click', () => {
  if (indiceActual > 0) mostrarRaza(indiceActual - 1);
});

btnSiguiente.addEventListener('click', () => {
  if (indiceActual < todasLasRazas.length - 1) mostrarRaza(indiceActual + 1);
});

// ==================== CLASES ====================
const classCardContainer = document.getElementById('class-card-container');
let todasLasClases = [];
let claseSeleccionada = null;

function mostrarTodasLasClases() {
  classCardContainer.innerHTML = '';

  todasLasClases.forEach(clase => {
    const descripcion = descripcionesClases[clase.index] || "Descripción no disponible.";

    const card = document.createElement('div');
    card.classList.add('class-card');
    card.setAttribute('data-clase', clase.index);

    card.innerHTML = `
      <h3>${clase.name.toUpperCase()}</h3>
      <p>${descripcion}</p>
    `;

    card.addEventListener('click', () => {
      document.querySelectorAll('.class-card').forEach(c => {
        c.style.border = 'none';
      });
      card.style.border = '2px solid white';
      claseSeleccionada = clase.index;
    });

    classCardContainer.appendChild(card);
  });
}

async function cargarClases() {
  try {
    todasLasClases = await getClasses();
    mostrarTodasLasClases();
  } catch (error) {
    classCardContainer.innerHTML = `<p>Error al cargar las clases</p>`;
    console.error("Error al cargar las clases:", error);
  }
}

// ==================== ESTADÍSTICAS ====================
function crearEstadisticasPersonaje(clase, raza) {
  const datosRaza = traducciones.estadisticas[raza] || { hp: 100, atk: 100 };
  const modificadoresClase = {
    "barbarian": { hp: 30, atk: 20, def: 15 },
    "bard": { hp: 15, atk: 10, def: 5 },
    "cleric": { hp: 20, atk: 15, def: 10 },
    "druid": { hp: 18, atk: 12, def: 8 },
    "fighter": { hp: 25, atk: 18, def: 12 },
    "monk": { hp: 15, atk: 20, def: 10 },
    "paladin": { hp: 22, atk: 16, def: 14 },
    "ranger": { hp: 20, atk: 18, def: 10 },
    "rogue": { hp: 18, atk: 22, def: 8 },
    "sorcerer": { hp: 12, atk: 25, def: 6 },
    "warlock": { hp: 14, atk: 20, def: 8 },
    "wizard": { hp: 10, atk: 28, def: 5 }
  };
  
  const modClase = modificadoresClase[clase] || { hp: 0, atk: 0, def: 0 };
  const hpFinal = datosRaza.hp + modClase.hp;
  const atkFinal = datosRaza.atk + modClase.atk;

  return `
    <div class="stat-container"><div class="stat-name">FUERZA</div><div class="stat-value">${Math.floor(atkFinal * 0.8)}</div><div class="stat-modifier">+${Math.floor(atkFinal * 0.8 / 10)}</div></div>
    <div class="stat-container"><div class="stat-name">DESTREZA</div><div class="stat-value">${Math.floor(atkFinal * 0.9)}</div><div class="stat-modifier">+${Math.floor(atkFinal * 0.9 / 10)}</div></div>
    <div class="stat-container"><div class="stat-name">CONSTITUCIÓN</div><div class="stat-value">${Math.floor(hpFinal * 0.7)}</div><div class="stat-modifier">+${Math.floor(hpFinal * 0.7 / 10)}</div></div>
    <div class="stat-container"><div class="stat-name">INTELIGENCIA</div><div class="stat-value">${clase.includes('wizard') ? 18 : Math.floor(atkFinal * 0.6)}</div><div class="stat-modifier">+${clase.includes('wizard') ? 4 : Math.floor(atkFinal * 0.6 / 10)}</div></div>
    <div class="stat-container"><div class="stat-name">SABIDURÍA</div><div class="stat-value">${clase.includes('cleric') ? 16 : Math.floor(hpFinal * 0.5)}</div><div class="stat-modifier">+${clase.includes('cleric') ? 3 : Math.floor(hpFinal * 0.5 / 10)}</div></div>
    <div class="stat-container"><div class="stat-name">CARISMA</div><div class="stat-value">${clase.includes('bard') ? 18 : Math.floor(atkFinal * 0.4)}</div><div class="stat-modifier">+${clase.includes('bard') ? 4 : Math.floor(atkFinal * 0.4 / 10)}</div></div>
  `;
}

// ==================== REVISAR PERSONAJE ====================
function mostrarResumenPersonaje() {
  const nombre = document.getElementById('nombre').value || 'Sin nombre';
  const genero = document.getElementById('genero').value || 'No especificado';
  const razaSeleccionada = todasLasRazas[indiceActual]?.index;
  const nombreRaza = traducciones.razas[razaSeleccionada] || 'No seleccionada';
  const nombreClase = claseSeleccionada ? claseSeleccionada.toUpperCase() : 'No seleccionada';
  const descripcionRaza = traducciones.descripciones[razaSeleccionada] || 'Descripción no disponible';
  const descripcionClase = descripcionesClases[claseSeleccionada] || 'Descripción no disponible';
  
  // Obtener estadísticas
  let statsHTML = '';
  if (razaSeleccionada && claseSeleccionada) {
    statsHTML = crearEstadisticasPersonaje(claseSeleccionada, razaSeleccionada);
  } else {
    statsHTML = '<div class="stat-item" style="grid-column: 1 / -1;"><p>Faltan seleccionar raza y/o clase</p></div>';
  }

  // Obtener equipamiento seleccionado
  const equipmentItems = [];
  const selects = document.querySelectorAll('#equipment-container select');
  selects.forEach(select => {
    if (select.value) {
      equipmentItems.push(`<li class="equipment-item">${select.selectedOptions[0].text}</li>`);
    }
  });
  const equipmentHTML = equipmentItems.length > 0 ? 
    equipmentItems.join('') : 
    '<li class="equipment-item">No se ha seleccionado equipamiento</li>';

  // Datos de raza y clase para resumen
  const datosRaza = razaSeleccionada ? traducciones.estadisticas[razaSeleccionada] : { hp: '--', atk: '--' };
  const modificadoresClase = claseSeleccionada ? {
    "barbarian": { hp: 30, atk: 20, def: 15 },
    "bard": { hp: 15, atk: 10, def: 5 },
    "cleric": { hp: 20, atk: 15, def: 10 },
    "druid": { hp: 18, atk: 12, def: 8 },
    "fighter": { hp: 25, atk: 18, def: 12 },
    "monk": { hp: 15, atk: 20, def: 10 },
    "paladin": { hp: 22, atk: 16, def: 14 },
    "ranger": { hp: 20, atk: 18, def: 10 },
    "rogue": { hp: 18, atk: 22, def: 8 },
    "sorcerer": { hp: 12, atk: 25, def: 6 },
    "warlock": { hp: 14, atk: 20, def: 8 },
    "wizard": { hp: 10, atk: 28, def: 5 }
  }[claseSeleccionada] : { hp: 0, atk: 0, def: 0 };

  const hpFinal = datosRaza.hp + (modificadoresClase?.hp || 0);
  const atkFinal = datosRaza.atk + (modificadoresClase?.atk || 0);
  const defFinal = (modificadoresClase?.def || 0);

  // Crear el HTML del resumen
  const html = `
    <div class="character-card">
      <div class="card-header">
        <h1 class="card-title">${nombre.toUpperCase()}</h1>
      </div>
      
      <div class="card-body">
        <div class="section_left">
          <!-- Columna izquierda -->
          <div class="section">
            <img src="storade/img/${razaSeleccionada || 'default'}.jpg" alt="Imagen del personaje" class="character-image">
          </div>
          
          <div class="section">
            <h2 class="section-title">DESCRIPCIÓN</h2>
            <p><strong>Raza:</strong> ${nombreRaza}</p>
            <p><strong>Clase:</strong> ${nombreClase}</p>
            <p><strong>Género:</strong> ${genero.charAt(0).toUpperCase() + genero.slice(1)}</p>
          </div>
          
          <div class="section">
            <h2 class="section-title">HISTORIA</h2>
            <p><strong>Raza:</strong> ${descripcionRaza}</p>
            <p><strong>Clase:</strong> ${descripcionClase}</p>
          </div>
        </div>
        
        <div class="section_rigth">
          <!-- Columna derecha -->
          <div class="section">
            <h2 class="section-title">ESTADÍSTICAS</h2>
            <div class="stats-grid">
              ${statsHTML}
            </div>
          </div>
          
          <div class="section">
            <h2 class="section-title">EQUIPO</h2>
            <ul class="equipment-list">
              ${equipmentHTML}
            </ul>
          </div>
          
          <div class="section">
            <h2 class="section-title">RESUMEN</h2>
            <ul class="equipment-list">
              <li class="equipment-item"><strong>HP:</strong> ${datosRaza.hp} + ${modificadoresClase?.hp || 0} = ${hpFinal}</li>
              <li class="equipment-item"><strong>ATK:</strong> ${datosRaza.atk} + ${modificadoresClase?.atk || 0} = ${atkFinal}</li>
              <li class="equipment-item"><strong>DEF:</strong> ${defFinal}</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class= "section_stats">
        <p><strong>HP:</strong> ${hpFinal} | <strong>ATK:</strong> ${atkFinal} | <strong>DEF:</strong> ${defFinal}</p>
      </div>
    </div>
  `;

  // Crear o actualizar el contenedor de revisión
  const reviewSection = document.getElementById('review-container');
  if (reviewSection) {
    reviewSection.innerHTML = html;
  } else {
    const section = document.createElement('section');
    section.id = 'review-container';
    section.classList.add('section_card');
    section.innerHTML = html;
    document.querySelector('main.container').appendChild(section);
  }
}

// ==================== PESTAÑAS ====================
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', async () => {
    const tabId = tab.dataset.tab;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Ocultar todas las secciones
    document.getElementById('raza-container').classList.add('hidden');
    document.getElementById('clase-container').classList.add('hidden');
    document.getElementById('formulario-inicial').classList.add('hidden');
    document.getElementById('estadisticas-container').classList.add('hidden');
    document.getElementById('equipo-container').classList.add('hidden');
    const reviewSection = document.getElementById('review-container');
    if (reviewSection) reviewSection.classList.add('hidden');

    if (tabId === 'raza') {
      document.getElementById('raza-container').classList.remove('hidden');
      document.getElementById('formulario-inicial').classList.remove('hidden');
      await cargarRazas();
    } else if (tabId === 'clase') {
      document.getElementById('clase-container').classList.remove('hidden');
      if (todasLasClases.length === 0) await cargarClases();
    } else if (tabId === 'stats') {
      document.getElementById('estadisticas-container').classList.remove('hidden');
      const razaSeleccionada = todasLasRazas[indiceActual]?.index;
      const contenedorEstadisticas = document.getElementById('contenido-estadisticas');
      const resumenEstadisticas = document.getElementById('resumen-estadisticas');

      if (razaSeleccionada && claseSeleccionada) {
        contenedorEstadisticas.innerHTML = crearEstadisticasPersonaje(claseSeleccionada, razaSeleccionada);
        resumenEstadisticas.innerHTML = `
          <p>Personaje:</p>
          <p>Raza: <strong>${traducciones.razas[razaSeleccionada]}</strong></p>
          <p>Clase: <strong>${claseSeleccionada.toUpperCase()}</strong></p>
          <p>HP: <span>${traducciones.estadisticas[razaSeleccionada].hp}</span></p>
          <p>ATK: <span>${traducciones.estadisticas[razaSeleccionada].atk}</span></p>
        `;
      } else {
        contenedorEstadisticas.innerHTML = `<div class="stat-item" style="grid-column: 1 / -1;"><p>Por favor, selecciona una raza y una clase primero.</p></div>`;
        resumenEstadisticas.innerHTML = '';
      }
    } else if (tabId === 'equipo') {
      document.getElementById('equipo-container').classList.remove('hidden');
      const container = document.getElementById('equipment-container');
      if (!container.dataset.loaded) {
        try {
          const { initEquipment } = await import('./equipamiento.js');
          initEquipment();
          container.dataset.loaded = "true";
        } catch (error) {
          container.innerHTML = '<p class="error">Error al cargar el equipamiento</p>';
          console.error("Error al cargar equipamiento:", error);
        }
      }
    } else if (tabId === 'review') {
      mostrarResumenPersonaje();
      const reviewSection = document.getElementById('review-container');
      if (reviewSection) {
        reviewSection.classList.remove('hidden');
      }
    }
  });
});

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('raza-tab').classList.add('active');
  document.getElementById('raza-container').classList.remove('hidden');
  document.getElementById('formulario-inicial').classList.remove('hidden');
  await cargarRazas();
});

// ==================== SISTEMA DE GUARDADO ====================
function guardarPersonaje() {
  const nombre = document.getElementById('nombre').value;
  if (!nombre) {
    alert("Por favor ingresa un nombre para tu personaje");
    return;
  }

  const personaje = {
    nombre: nombre,
    genero: document.getElementById('genero').value,
    raza: todasLasRazas[indiceActual]?.index,
    clase: claseSeleccionada,
    equipo: obtenerEquipamientoSeleccionado(),
    stats: calcularStatsCompletas(),
    fechaCreacion: new Date().toISOString()
  };

  // Obtener personajes existentes o crear array vacío
  const personajesGuardados = JSON.parse(localStorage.getItem('personajesDND')) || [];
  
  // Añadir nuevo personaje
  personajesGuardados.push(personaje);
  
  // Guardar en localStorage
  localStorage.setItem('personajesDND', JSON.stringify(personajesGuardados));
  
  alert(`Personaje "${nombre}" guardado correctamente!`);
}

function obtenerEquipamientoSeleccionado() {
  const equipos = [];
  document.querySelectorAll('#equipment-container select').forEach(select => {
    if (select.value) {
      equipos.push({
        nombre: select.selectedOptions[0].text,
        tipo: select.previousElementSibling.textContent,
        id: select.value
      });
    }
  });
  return equipos;
}

function calcularStatsCompletas() {
  const raza = todasLasRazas[indiceActual]?.index;
  const clase = claseSeleccionada;
  
  if (!raza || !clase) return null;
  
  const datosRaza = traducciones.estadisticas[raza] || { hp: 100, atk: 100 };
  const modClase = {
    "barbarian": { hp: 30, atk: 20, def: 15 },
    // ... (resto de clases)
  }[clase] || { hp: 0, atk: 0, def: 0 };

  return {
    hp: datosRaza.hp + modClase.hp,
    atk: datosRaza.atk + modClase.atk,
    def: modClase.def,
    fuerza: Math.floor((datosRaza.atk + modClase.atk) * 0.8),
    // ... (resto de stats)
  };
}

// Añadir botón de guardado (debes añadir este botón en tu HTML)
document.addEventListener('DOMContentLoaded', () => {
  const btnGuardar = document.createElement('button');
  btnGuardar.id = 'btn-guardar';
  btnGuardar.textContent = 'Guardar Personaje';
  btnGuardar.addEventListener('click', guardarPersonaje);
  document.querySelector('main.container').appendChild(btnGuardar);
});

// ==================== BOTÓN VER PERSONAJES ====================
document.addEventListener('DOMContentLoaded', () => {
  // ... código existente ...
  
  // Añadir funcionalidad al botón de personajes
  const btnPersonajes = document.getElementById('btn-personajes');
  if (btnPersonajes) {
    btnPersonajes.addEventListener('click', () => {
      window.location.href = 'personajes.html';
    });
  }
  
  // Verificar si hay personajes para mostrar el botón
  const personajesGuardados = JSON.parse(localStorage.getItem('personajesDND')) || [];
  if (personajesGuardados.length === 0) {
    btnPersonajes.style.display = 'none';
  }
});