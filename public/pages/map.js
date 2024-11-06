    // Inicializar el mapa
    var map = L.map('map').setView([39.4668, -0.3768], 12); // Coordenadas de Valencia

    // Añadir la capa de mapa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Cargar los centros existentes al cargar la página
    fetch('/centros')
    .then(response => response.json())
    .then(centros => {
        centros.forEach(centro => {
            // Crear el marcador
            var marker = L.marker([centro.lat, centro.lng]).addTo(map)
                .bindPopup(`
                    <strong>${centro.nombre}</strong><br>${centro.direccion}<br><em>${centro.tipo}</em>
                    <br><button class="delete-marker" data-id="${centro.id}">Eliminar</button>
                `);

            // Añadir la fila a la tabla de centros
            var row = document.createElement('tr');
            row.innerHTML = `
                <td>${centro.nombre}</td>
                <td>${centro.direccion}</td>
                <td>${centro.tipo}</td>
            `;
            document.getElementById('centrosTableBody').appendChild(row);

            // Manejar el clic en el botón de eliminación
            marker.getPopup().on('contentupdate', function() {
                const deleteButton = marker.getPopup().getElement().querySelector('.delete-marker');
                deleteButton?.addEventListener('click', function() {
                    // Eliminar el marcador del mapa
                    map.removeLayer(marker);

                    // Eliminar el centro de la base de datos
                    fetch(`/centros/${centro.id}`, {
                        method: 'DELETE',
                    })
                    .then(response => {
                        if (response.ok) {
                            alert('Centro eliminado');
                            // Eliminar la fila correspondiente en la tabla
                            row.remove();
                        } else {
                            alert('Error al eliminar el centro.');
                        }
                    })
                    .catch(error => {
                        console.error("Error al eliminar el centro:", error);
                    });
                });
            });
        });
    })
    .catch(error => {
        console.error("Error al cargar los centros:", error);
    });

// Manejar el envío del formulario de búsqueda de ubicación
document.getElementById('locationSearchForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
    var address = document.getElementById('locationInput').value;

    //Abrir panel de carga
    document.getElementById('loadingPanel').style.display = 'flex';

    // Geocodificar la dirección
    fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                var lat = data[0].lat;
                var lng = data[0].lon;

                // Centrar el mapa en la nueva ubicación
                map.setView([lat, lng], 15); // Zoom más cercano
            } else {
                alert("No se encontró la dirección.");
            }
        })
        .catch(error => {
            console.error("Error al buscar la dirección:", error);
        })
        .finally(() => {
            document.getElementById('locationInput').value = '';
            document.getElementById('loadingPanel').style.display = 'none';
        });
});


    // Manejar el envío del formulario para añadir chinchetas
    document.getElementById('markerForm').addEventListener('submit', function(e) {
        e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

        // Mostrar el panel de carga
        document.getElementById('loadingPanel').style.display = 'flex';

        var name = document.getElementById('markerName').value;
        var address = document.getElementById('markerAddress').value;
        var tipo = document.getElementById('markerType').value;

        // Geocodificar la dirección
        fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    var lat = data[0].lat;
                    var lng = data[0].lon;

                    // Añadir el popup con el nombre y el tipo
                    var marker = L.marker([lat, lng]).addTo(map)
                        .bindPopup(`<strong>${name}</strong><br>${address}<br><em>${tipo}</em>`).openPopup();

                    // Enviar el nuevo centro al servidor
                    console.log("Enviando centro:", { name, address, tipo, lat, lng });
                    fetch('/centros', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ nombre: name, direccion: address, tipo: tipo, lat: lat, lng: lng })
                    })
                    .then(response => {
                        if (response.ok) {
                            // Añadir fila a la tabla de centros
                            var row = document.createElement('tr');
                            row.innerHTML = `
                                <td>${name}</td>
                                <td>${address}</td>
                                <td>${tipo}</td>
                            `;
                            document.getElementById('centrosTableBody').appendChild(row);
                        } else {
                            alert("Error al añadir el centro.");
                        }
                    })
                    .catch(error => {
                        console.error("Error al enviar los datos del nuevo centro:", error);
                    });
                } else {
                    alert("No se encontró la dirección.");
                }
                // Ocultar el panel de carga
                document.getElementById('loadingPanel').style.display = 'none';
            })
            .catch(error => {
                console.error("Error al geocodificar la dirección:", error);
                document.getElementById('loadingPanel').style.display = 'none'; // Ocultar el panel de carga en caso de error
            });
    });