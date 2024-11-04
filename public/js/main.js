document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const formData = new FormData(e.target);  // Esto capturará todos los campos del formulario, incluyendo 'location' y 'status'
  
    try {
      const response = await fetch("/register", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      alert(result.message);
  
      // Limpiar el formulario después de un registro exitoso
      e.target.reset();
    } catch (error) {
      console.error("Error al registrar:", error);
      alert("Ocurrió un error al registrar a la persona.");
    }
});
  

  
  
  
  async function searchPerson() {
    const name = document.getElementById("search-name").value;
  
    try {
      const response = await fetch(`/search?name=${encodeURIComponent(name)}`);
      const results = await response.json();
  
      // Limpiar el contenedor de resultados
      const resultsContainer = document.getElementById("results");
      resultsContainer.innerHTML = "";
  
      if (results.length) {
        results.forEach(person => {
          const personDiv = document.createElement("div");
          personDiv.classList.add("person-result");
          personDiv.id = `person-${person.id}`;
  
          personDiv.innerHTML = `
          <p><strong>Nombre:</strong> ${person.nombre}</p>
          <p><strong>Contacto:</strong> ${person.contacto}</p>
          ${person.foto ? 
              `<img src="/uploads/${person.foto}" alt="Foto de ${person.nombre}" style="width:100px; height:auto;">` 
            : ''}
          <p><strong>Ubicación:</strong> ${person.ubicacion ?? "No especificado"}</p>
          <p><strong>Estado:</strong> ${capitalizeFirstLetter(person.estado.replace(/_/g, ' '))}</p>
              <button onclick="localizarPersona(${person.id})">Marcar como localizada</button>


      `;
      
  
          resultsContainer.appendChild(personDiv);
        });
  
        // Mostrar la sección de resultados y ocultar la sección de búsqueda
        document.getElementById("search-section").style.display = "none";
        document.getElementById("results-section").style.display = "block";
      } else {
        resultsContainer.innerHTML = "<p>No se encontraron resultados.</p>";
        document.getElementById("results-section").style.display = "block";
      }
    } catch (error) {
      console.error("Error al buscar:", error);
    }
  }
  
  
  function newSearch() {
    // Limpiar el campo de búsqueda y los resultados anteriores
    document.getElementById("search-name").value = "";
    document.getElementById("results").innerHTML = "";
  
    // Mostrar la sección de búsqueda y ocultar los resultados
    document.getElementById("search-section").style.display = "block";
    document.getElementById("results-section").style.display = "none";
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  async function localizarPersona(personId) {
    try {
        const response = await fetch(`/person/${personId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
          // Eliminar el elemento del DOM o recargar la lista
          const personElement = document.getElementById(`person-${personId}`);
          if (personElement) {
            personElement.remove();
          }

          alert('Persona marcada como localizada.');
          

        } else {
            const errorData = await response.json();
            alert(errorData.message);
        }
    } catch (error) {
        console.error('Error al eliminar la persona:', error);
        alert('Error al marcar la persona como localizada.');
    }
}


  
function showTooltip(event, text) {
  // Elimina cualquier tooltip existente
  document.querySelectorAll('.tooltip').forEach(tip => tip.remove());

  // Crear un nuevo tooltip
  const tooltip = document.createElement('div');
  tooltip.classList.add('tooltip');
  tooltip.textContent = text;

  document.body.appendChild(tooltip);

  // Posiciona el tooltip cerca del botón
  const rect = event.target.getBoundingClientRect();
  tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight / 2}px`;
  tooltip.style.left = `${rect.right + 10}px`;

  // Hace visible el tooltip
  setTimeout(() => tooltip.classList.add('visible'), 10);

  // Oculta el tooltip al hacer clic en cualquier otro lugar
  document.addEventListener('click', function hideTooltip(e) {
    if (!tooltip.contains(e.target) && e.target !== event.target) {
      tooltip.remove();
      document.removeEventListener('click', hideTooltip);
    }
  });
}

  
  
  