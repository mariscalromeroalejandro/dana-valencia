// Configuración inicial del mapa centrado en Valencia
const map = L.map('map').setView([39.4699, -0.3763], 13);

// Añadir una capa de mapa de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Función para añadir un sitio de recogida en el mapa
function addSite() {
  const siteName = document.getElementById("site-name").value;
  const description = document.getElementById("description").value;
  const latitude = parseFloat(document.getElementById("latitude").value);
  const longitude = parseFloat(document.getElementById("longitude").value);

  if (!siteName || !description || isNaN(latitude) || isNaN(longitude)) {
    alert("Por favor, complete todos los campos correctamente.");
    return;
  }

  // Añadir un marcador al mapa
  const marker = L.marker([latitude, longitude]).addTo(map);

  // Añadir un popup al marcador
  marker.bindPopup(`<b>${siteName}</b><br>${description}`).openPopup();

  // Limpiar los campos del formulario después de añadir el sitio
  document.getElementById("collection-site-form").reset();
}
