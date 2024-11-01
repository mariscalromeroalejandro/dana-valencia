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
  
          personDiv.innerHTML = `
            <p><strong>Nombre:</strong> ${person.nombre}</p>
            <p><strong>Contacto:</strong> ${person.contacto}</p>
            <img src="/uploads/${person.foto}" alt="Foto de ${person.nombre}" style="width:100px; height:auto;">
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
  
  
  