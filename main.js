const obtenerRaza = async () => {
  const url = "https://www.dnd5eapi.co/api/races";
  try {
    const response = await fetch(url);
    const data = await response.json();
 console.log("datos", data)
    const select = document.getElementById("select-raza");

    data.results.forEach((raza) => {
      const option = document.createElement("option");
      option.textContent = raza.name;
      option.value = raza.index;
      select.appendChild(option);
    });

  } catch (error) {
    console.log("error", error.message);
  }
};

// Ejecutar función
obtenerRaza();