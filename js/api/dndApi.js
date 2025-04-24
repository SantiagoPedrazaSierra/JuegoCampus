// Funciones existentes para razas
export async function getRaces() {
    const response = await fetch('https://www.dnd5eapi.co/api/races');
    if (!response.ok) throw new Error('Error al obtener razas');
    return await response.json();
}

export async function getRaceDetails(raceIndex) {
    const response = await fetch(`https://www.dnd5eapi.co/api/races/${raceIndex}`);
    if (!response.ok) throw new Error('Error al obtener detalles de raza');
    return await response.json();
}

export async function getClasses() {
    try {
        const response = await fetch('https://www.dnd5eapi.co/api/classes');
        if (!response.ok) throw new Error('Error al obtener las clases');
        const data = await response.json();
        return data.results; // array de { index, name }
    } catch (error) {
        console.error("Error al obtener clases:", error);
        throw new Error("No se pudieron cargar las clases");
    }
}

