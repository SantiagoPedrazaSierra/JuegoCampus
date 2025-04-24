export function initEquipment() {
    const container = document.getElementById('equipment-container');
    container.innerHTML = '<div class="loading">Cargando equipamiento...</div>';
  
    const categories = {
      'Armor': 'Armaduras',
      'Shield': 'Escudos',
      'Tool': 'Herramientas',
      'Backpack': 'Mochilas',
      'Potion': 'Pociones',
      'Mount': 'Monturas',
      'Ammunition': 'Municiones',
      'Weapon': 'Armas'
    };
  
    const categoryMap = {
      'Armor': ['Light Armor', 'Medium Armor', 'Heavy Armor', 'Shield'],
      'Weapon': ['Simple Melee', 'Martial Melee', 'Simple Ranged', 'Martial Ranged'],
      'Ammunition': ['Ammunition'],
      'Potion': ['Potion'],
      'Mount': ['Mounts and Vehicles'],
      'Tool': ['Kits', 'Gaming Sets', 'Musical Instruments', 'Tools'],
      'Backpack': ['Adventuring Gear']
    };
  
    const translations = {
      // ... (mantener tus traducciones existentes)
    };
  
    function translateName(name) {
      return translations[name.toLowerCase()] || name;
    }
  
    function detectCategory(equipment) {
      for (const [key, apiCategories] of Object.entries(categoryMap)) {
        if (apiCategories.includes(equipment.equipment_category.name)) {
          return key;
        }
      }
      return null;
    }
  
    function createSelectElement(title, options) {
      const label = document.createElement('label');
      label.textContent = title;
  
      const select = document.createElement('select');
      select.innerHTML = `<option disabled selected>Selecciona ${title.toLowerCase()}</option>`;
  
      options.forEach(opt => {
        const option = document.createElement('option');
        option.textContent = translateName(opt.name);
        option.value = opt.index;
        select.appendChild(option);
      });
  
      container.appendChild(label);
      container.appendChild(select);
    }
  
    fetch('https://www.dnd5eapi.co/api/equipment')
      .then(res => res.json())
      .then(async data => {
        const categorizedItems = {};
  
        // Obtener detalles completos de cada ítem
        const detailedItems = await Promise.all(
          data.results.map(item => 
            fetch(`https://www.dnd5eapi.co${item.url}`).then(res => res.json())
          )
        );
  
        detailedItems.forEach(item => {
          const category = detectCategory(item);
          if (category) {
            if (!categorizedItems[category]) categorizedItems[category] = [];
            categorizedItems[category].push(item);
          }
        });
  
        container.innerHTML = '';
  
        Object.entries(categories).forEach(([key, title]) => {
          if (categorizedItems[key]) {
            createSelectElement(title, categorizedItems[key]);
          }
        });
      })
      .catch(err => {
        console.error('Error:', err);
        container.innerHTML = '<p class="error">Error al cargar el equipamiento. Recarga la página.</p>';
      });
  }