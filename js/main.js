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

function mostrarTodasLasClases() {
  classCardContainer.innerHTML = '';

  todasLasClases.forEach(clase => {
    const descripcion = descripcionesClases[clase.index] || "Descripción no disponible.";

    const card = document.createElement('div');
    card.classList.add('class-card');
    card.innerHTML = `
      <h3>${clase.name.toUpperCase()}</h3>
      <p>${descripcion}</p>
    `;

    card.addEventListener('click', () => {
      document.querySelectorAll('.class-card').forEach(c => c.style.border = '2px solid #FED904');
      card.style.border = '2px solid white';
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
  }
}

// ==================== PESTAÑAS ====================
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', async () => {
    const tabId = tab.dataset.tab;

    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    document.getElementById('raza-container').classList.add('hidden');
    document.getElementById('clase-container').classList.add('hidden');
    document.getElementById('formulario-inicial').classList.add('hidden');

    if (tabId === 'raza') {
      document.getElementById('raza-container').classList.remove('hidden');
      document.getElementById('formulario-inicial').classList.remove('hidden');
      await cargarRazas();
    } else if (tabId === 'clase') {
      document.getElementById('clase-container').classList.remove('hidden');
      if (todasLasClases.length === 0) await cargarClases();
    }
  });
});

// ==================== CARGA INICIAL ====================
document.addEventListener('DOMContentLoaded', async () => {
  // Activar RAZA por defecto
  document.getElementById('raza-tab').classList.add('active');
  document.getElementById('raza-container').classList.remove('hidden');
  document.getElementById('formulario-inicial').classList.remove('hidden');
  await cargarRazas();
});
