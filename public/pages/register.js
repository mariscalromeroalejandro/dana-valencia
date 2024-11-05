    // Array para almacenar las personas registradas
let people = [];
    let isFormValid = false;

    // Inicializar tooltips de Bootstrap
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Función para obtener todas las personas del servidor
    async function getAll() {
        try {
            const response = await fetch('/all');
            console.log('response', response);
            const data = await response.json();
            console.log('data', data);
            document.getElementById('searchText').textContent = 'Mostrando todas las personas';
            people = data;
            updateTable();
        } catch (error) {
            console.error(error);
        }
    }

    // Inicializar la tabla al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
        isFormValid = false;
        await getAll();
    });

    // Manejar el envío del formulario
    document.getElementById('registerForm').addEventListener('submit', async function (e) {
        e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

        // Obtener valores del formulario
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const contact = document.getElementById('contact').value;
        const lastSeen = document.getElementById('lastSeen').value;
        const termsAccepted = document.getElementById('termsCheckbox').checked;

        // Validar los campos requeridos
        if (!firstName || !lastName || !contact || !termsAccepted) {
            alert('Por favor, completa todos los campos requeridos y acepta los términos.');
            return; // No continuar si falta información
        }

        // Crear un objeto persona
        const person = { firstName, lastName, contact, lastSeen };
        people.push(person); // Añadir a la lista

        // Limpiar el formulario
        this.reset();

        // Actualizar la tabla
        updateTable();
    });

    // Función para actualizar la tabla de personas
    function updateTable() {
        const tbody = document.getElementById('peopleTable').querySelector('tbody');
        tbody.innerHTML = ''; // Limpiar el contenido anterior

        people.forEach((person, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${person.nombre ?? 'No especificado'}</td>
                <td>${person.contacto ?? 'No especificado'}</td>
                <td>${person.ubicacion ?? 'No especificado'}</td>
                <td>
                    <button class="btn btn-success btn-sm" onclick="markFound(${person.id})">Marcar como localizado</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Función para marcar una persona como encontrada
    let indexToDelete = null;

    function markFound(index) {
        indexToDelete = index;

        const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
        confirmModal.show();
    }

    // Función para eliminar una persona
    async function deletePerson(index) {
        try {
            await fetch(`/delete/${index}`, { method: 'DELETE' });
        } catch (error) {
            console.error(error);
        }
    }

    // Cuando el usuario confirme la acción, ejecutar la eliminación
    document.getElementById('confirmButton').addEventListener('click', async function () {
        if (indexToDelete !== null) {
            await deletePerson(indexToDelete);
            await getAll();
            indexToDelete = null;
        }
        const confirmModal = bootstrap.Modal.getInstance(document.getElementById('confirmModal'));
        confirmModal.hide();
    });

    // Función para buscar personas
    async function searchPeople(field, searchTerm) {
        const response = await fetch(`/find?${field}=${searchTerm}`, { method: 'POST' });
        const data = await response.json();
        return data;
    }

    // Manejar el envío del formulario de búsqueda
function searchAndDisplayPeople(field) {
    const searchTerm = document.getElementById(`searchInput${field === 'name' ? '' : '2'}`).value.toLowerCase();
    searchPeople(field, searchTerm).then(filteredPeople => {
        const searchText = document.getElementById('searchText');
        searchText.innerHTML = `Se encontraron ${filteredPeople.length} personas para la búsqueda por ${field === 'name' ? 'nombre y apellidos' : 'ubicación'}: ${searchTerm}`;
        displayFilteredPeople(filteredPeople);
    });
    // Limpiar el campo de entrada de búsqueda
    document.getElementById(`searchInput${field === 'name' ? '' : '2'}`).value = '';
    
}

document.getElementById('searchButton').addEventListener('click', () => searchAndDisplayPeople('name'));
document.getElementById('searchButton2').addEventListener('click', () => searchAndDisplayPeople('lastSeen'));
document.getElementById('searchButton3').addEventListener('click', () => getAll());

    // Función para mostrar personas filtradas

function displayFilteredPeople(filteredPeople) {
        const tbody = document.getElementById('peopleTable').querySelector('tbody');
        tbody.innerHTML = ''; // Limpiar el contenido anterior

        filteredPeople.forEach((person) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${person.nombre ?? 'No especificado'}</td>
                <td>${person.contacto ?? 'No especificado'}</td>
                <td>${person.ubicacion ?? 'No especificado'}</td>
                <td>
                    <button class="btn btn-success btn-sm" onclick="markFound(${person.id})">Marcar como localizado</button>
                </td>
            `;
            tbody.appendChild(row);
        });
}