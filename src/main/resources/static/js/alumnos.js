let modoBajaActivo = false;

document.addEventListener('DOMContentLoaded', () => {
    cargarAlumnos();
});

// Obtener lista de alumnos guardados
function obtenerAlumnos() {
    const alumnos = localStorage.getItem('asistenciero_alumnos');
    return alumnos ? JSON.parse(alumnos) : [];
}

// Guardar lista de alumnos
function guardarAlumnos(alumnos) {
    localStorage.setItem('asistenciero_alumnos', JSON.stringify(alumnos));
}

// Renderizar tabla de alumnos dinámicamente
function cargarAlumnos(listaFiltrada = null) {
    const alumnos = listaFiltrada !== null ? listaFiltrada : obtenerAlumnos();
    const tbody = document.getElementById('tabla-alumnos-body');
    const columnaAccionHeader = document.getElementById('columna-accion');
    
    tbody.innerHTML = '';

    // Mostrar u ocultar la columna de acción (botón de dar baja) según el modo activo
    if (modoBajaActivo) {
        columnaAccionHeader.classList.remove('oculto');
    } else {
        columnaAccionHeader.classList.add('oculto');
    }

    if (alumnos.length === 0) {
        const filaVacia = document.createElement('tr');
        const numCols = modoBajaActivo ? 5 : 4;
        filaVacia.innerHTML = `<td colspan="${numCols}">No hay alumnos registrados.</td>`;
        tbody.appendChild(filaVacia);
        return;
    }

    alumnos.forEach((alumno, index) => {
        const fila = document.createElement('tr');
        
        let contenidoFila = `
            <td>${index + 1}</td>
            <td>${alumno.nombre}</td>
            <td>${alumno.apellido}</td>
            <td>${alumno.dni}</td>
        `;

        if (modoBajaActivo) {
            contenidoFila += `<td><button class="btn-eliminar-tabla" onclick="eliminarAlumno('${alumno.dni}')">Dar Baja</button></td>`;
        }

        fila.innerHTML = contenidoFila;
        tbody.appendChild(fila);
    });
}

// Funcionalidad Botón: Abrir recuadro (Modal) de Alta
function abrirModalAlta() {
    modoBajaActivo = false;
    cargarAlumnos();
    document.getElementById('modal-alta').classList.remove('oculto');
}

// Cerrar recuadro de Alta
function cerrarModalAlta() {
    document.getElementById('modal-alta').classList.add('oculto');
    document.getElementById('form-alumno').reset();
}

// Guardar el nuevo alumno desde el recuadro y mostrarlo en la tabla
function guardarNuevoAlumno(event) {
    event.preventDefault();

    const nombre = document.getElementById('modal-nombre').value.trim();
    const apellido = document.getElementById('modal-apellido').value.trim();
    const dni = document.getElementById('modal-dni').value.trim();

    let alumnos = obtenerAlumnos();

    if (alumnos.some(a => a.dni === dni)) {
        alert("Ya existe un alumno registrado con este DNI.");
        return;
    }

    alumnos.push({ nombre, apellido, dni });
    guardarAlumnos(alumnos);

    cerrarModalAlta();
    cargarAlumnos();
}

// Funcionalidad Botón: Activar Modo Baja y enfocar la lupa
function activarModoBaja() {
    modoBajaActivo = true;
    cargarAlumnos();
    document.getElementById('input-buscar').focus();
}

// Buscador interactivo en tiempo real con la lupa
function buscarAlumno() {
    const texto = document.getElementById('input-buscar').value.toLowerCase().trim();
    const alumnos = obtenerAlumnos();

    const filtrados = alumnos.filter(a => 
        a.nombre.toLowerCase().includes(texto) ||
        a.apellido.toLowerCase().includes(texto) ||
        a.dni.toLowerCase().includes(texto)
    );

    cargarAlumnos(filtrados);
}

// Ejecutar la baja de un alumno específico
function eliminarAlumno(dni) {
    if (confirm(`¿Está seguro de que desea dar de baja al alumno con DNI ${dni}?`)) {
        let alumnos = obtenerAlumnos();
        alumnos = alumnos.filter(a => a.dni !== dni);
        guardarAlumnos(alumnos);
        buscarAlumno(); // Refresca la tabla manteniendo el filtro de búsqueda
    }
}