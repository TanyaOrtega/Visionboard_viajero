const API_URL = "http://localhost:3000/destinos";

// Cargar destinos
document.addEventListener("DOMContentLoaded", cargarDestinos);

async function cargarDestinos() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Error al cargar destinos');
        }
        const destinos = await response.json();
        const lista = document.getElementById("destinos-list");
        lista.innerHTML = "";

        destinos.forEach(destino => {
            lista.innerHTML += `
                <tr>
                    <td>${destino.nombre}</td>
                    <td>${destino.pais}</td>
                    <td>${destino.descripcion}</td>
                    <td>${destino.visitado ? "Sí" : "No"}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarDestino(${destino.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarDestino(${destino.id})">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error al cargar los destinos:", error);
        alert("No se pudieron cargar los destinos.");
    }
}


// Manejar el formulario
document.getElementById("destino-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const id = document.getElementById("destino-id").value;
    const nombre = document.getElementById("nombre").value;
    const pais = document.getElementById("pais").value;
    const descripcion = document.getElementById("descripcion").value;
    const visitado = document.getElementById("visitado").value === "true";

    const data = { nombre, pais, descripcion, visitado };
    const method = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/${id}` : API_URL;
    
    const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        alert("Error al guardar el destino");
        return;
    }

    document.getElementById("destino-form").reset();
    document.getElementById("destino-id").value = "";
    cargarDestinos();
});


async function editarDestino(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error("Destino no encontrado");
        }
        const destino = await response.json();
        
        document.getElementById("destino-id").value = destino.id;
        document.getElementById("nombre").value = destino.nombre;
        document.getElementById("pais").value = destino.pais;
        document.getElementById("descripcion").value = destino.descripcion;
        document.getElementById("visitado").value = destino.visitado;
    } catch (error) {
        alert("Error: " + error.message);
    }
}


async function eliminarDestino(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este destino?")) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE', 
            });

            if (!response.ok) {
                throw new Error("Error al eliminar el destino");
            }

            cargarDestinos();
        } catch (error) {
            alert("Error: " + error.message);
        }
    }
}

window.editarDestino = editarDestino;
window.eliminarDestino = eliminarDestino;