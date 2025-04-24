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
let indiceActual = 0;
const cartaRaza = document.getElementById('race-card');
const btnAnterior = document.getElementById('btn-prev');
const btnSiguiente = document.getElementById('btn-next');

function mostrarRaza(indice) {
  if (indice < 0 || indice >= todasLasRazas.length) return;

  const raza = todasLasRazas[indice];
  const datos = traducciones.estadisticas[raza.index] || { hp: 100, atk: 100 };

  cartaRaza.innerHTML = `
    <div class="title">${traducciones.razas[raza.index] || raza.name}</div>
    <div class="image-box">
      <img class="img_tarjet" src="storade/img/${raza.index}.jpg" alt="${raza.name}">
    </div>
    <div class="description">${traducciones.descripciones[raza.index] || "Descripción no disponible"}</div>
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
    mostrarRaza(0);
  } catch (error) {
    cartaRaza.innerHTML = `
      <div class="error">
        <p>Error al cargar las razas</p>
        <p>${error.message}</p>
      </div>
    `;
  }
}

btnAnterior.addEventListener('click', () => {
  if (indiceActual > 0) mostrarRaza(indiceActual - 1);
});

btnSiguiente.addEventListener('click', () => {
  if (indiceActual < todasLasRazas.length - 1) mostrarRaza(indiceActual + 1);
});

// ==================== CLASES ====================
const classCard = document.getElementById('class-card');
let todasLasClases = [];
let indiceClaseActual = 0;

function mostrarClase(indice) {
  if (indice < 0 || indice >= todasLasClases.length) return;

  const clase = todasLasClases[indice];
  const descripcion = descripcionesClases[clase.index] || "Descripción no disponible";

  classCard.innerHTML = `
    <h3>${clase.name}</h3>
    <p>${descripcion}</p>
  `;

  indiceClaseActual = indice;
}

async function cargarClases() {
  try {
    todasLasClases = await getClasses();
    mostrarClase(0);
  } catch (error) {
    classCard.innerHTML = `<p>Error al cargar las clases</p>`;
  }
}

document.getElementById('class-prev').addEventListener('click', () => {
  if (indiceClaseActual > 0) mostrarClase(indiceClaseActual - 1);
});

document.getElementById('class-next').addEventListener('click', () => {
  if (indiceClaseActual < todasLasClases.length - 1) mostrarClase(indiceClaseActual + 1);
});

// ==================== MANEJO DE PESTAÑAS ====================
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', async () => {
    const tabId = tab.dataset.tab;

    document.querySelectorAll('.section_card').forEach(section => {
      section.classList.add('hidden');
    });

    const section = document.getElementById(`${tabId}-tab`);
    if (section) section.classList.remove('hidden');

    if (tabId === 'raza' && todasLasRazas.length === 0) {
      await cargarRazas();
    }

    if (tabId === 'clase' && todasLasClases.length === 0) {
      await cargarClases();
    }
  });
});

// ==================== CARGA INICIAL ====================
document.addEventListener('DOMContentLoaded', async () => {
  const razaTab = document.getElementById('raza-tab');
  if (razaTab && !razaTab.classList.contains('hidden')) {
    await cargarRazas();
  }
});
