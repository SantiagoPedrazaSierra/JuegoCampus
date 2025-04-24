import { getRaces, getRaceDetails } from './api/dndApi.js';

// Traducciones al español para todas las razas
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
  
  // Estadísticas base para todas las razas
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

let indiceActual = 0;
let todasLasRazas = [];
const cartaRaza = document.getElementById('race-card');
const btnAnterior = document.getElementById('btn-prev');
const btnSiguiente = document.getElementById('btn-next');

// Función para mostrar una raza específica
function mostrarRaza(indice) {
  if (indice < 0 || indice >= todasLasRazas.length) return;
  
  const raza = todasLasRazas[indice];
  const datos = traducciones.estadisticas[raza.index] || { hp: 100, atk: 100 };
  
  cartaRaza.innerHTML = `
    <div class="title">${traducciones.razas[raza.index] || raza.name}</div>
    <div class="image-box">
      <img  class="img_tarjet" src="storade/img/${raza.index}.jpg" alt="${raza.name}">
    </div>
    <div class="description">
      ${traducciones.descripciones[raza.index] || "Descripción no disponible"}
    </div>
    <div class="stats">
      <span>HP: ${datos.hp} </span>
      <span>ATK: ${datos.atk} </span>
    </div>
  `;
  
  indiceActual = indice;
}

// Cargar todas las razas desde la API
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const respuesta = await getRaces();
    todasLasRazas = respuesta.results;
    
    if (todasLasRazas.length > 0) {
      mostrarRaza(0);
    } else {
      cartaRaza.innerHTML = "<p>No se encontraron razas disponibles</p>";
    }
  } catch (error) {
    cartaRaza.innerHTML = `
      <div class="error">
        <p>Error al cargar las razas</p>
        <p>Intenta recargar la página</p>
      </div>
    `;
    console.error("Error:", error);
  }
});

// Eventos para navegación
btnAnterior.addEventListener('click', () => {
  if (indiceActual > 0) {
    mostrarRaza(indiceActual - 1);
  }
});

btnSiguiente.addEventListener('click', () => {
  if (indiceActual < todasLasRazas.length - 1) {
    mostrarRaza(indiceActual + 1);
  }
});