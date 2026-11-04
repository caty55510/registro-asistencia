document.addEventListener('DOMContentLoaded', () => {
    const formCurso = document.getElementById('form-curso');
    const listaCursosBody = document.getElementById('lista-cursos-body');

    // Cargar cursos guardados al iniciar la página
    cargarCursos();

    // Evento para agregar un curso
    formCurso.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombre-curso').value.trim();
        const profesor = document.getElementById('profesor-curso').value.trim();
        const horario = document.getElementById('horario-curso').value.trim();

        if (nombre && profesor && horario) {
            const nuevoCurso = {
                id: Date.now(),
                nombre,
                profesor,
                horario
            };

            guardarCursoEnStorage(nuevoCurso);
            formCurso.reset();
            cargarCursos();
        }
    });

    // Función para obtener los cursos de localStorage
    function obtenerCursos() {
        const cursos = localStorage.getItem('asistenciero_cursos');
        return cursos ? JSON.parse(cursos) : [];
    }

    // Función para guardar un curso en localStorage
    function guardarCursoEnStorage(curso) {
        const cursos = obtenerCursos();
        cursos.push(curso);
        localStorage.setItem('asistenciero_cursos', JSON.stringify(cursos));
    }

    // Función para renderizar los cursos en la tabla
    function cargarCursos() {
        const cursos = obtenerCursos();
        listaCursosBody.innerHTML = '';

        if (cursos.length === 0) {
            listaCursosBody.innerHTML = `<tr><td colspan="4" style="text-align: center;">No hay cursos registrados.</td></tr>`;
            return;
        }

        cursos.forEach((curso) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${curso.nombre}</td>
                <td>${curso.profesor}</td>
                <td>${curso.horario}</td>
                <td><button onclick="eliminarCurso(${curso.id})" class="btn-eliminar">Eliminar</button></td>
            `;
            listaCursosBody.appendChild(fila);
        });
    }
});

// Función global para eliminar un curso
function eliminarCurso(id) {
    let cursos = JSON.parse(localStorage.getItem('asistenciero_cursos')) || [];
    cursos = cursos.filter(curso => curso.id !== id);
    localStorage.setItem('asistenciero_cursos', JSON.stringify(cursos));
    
    // Recargar la tabla
    location.reload();
}