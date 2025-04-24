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