// Obtener elementos
const servicioSelect = document.getElementById('servicio');
const problemaSelect = document.getElementById('problema');
const problemaContainer = document.getElementById('problemaContainer');
const descripcionContainer = document.getElementById('descripcionContainer');
const enviarQuejaButton = document.getElementById('enviarQueja');

// Datos de los problemas para cada servicio
const problemas = {
    agua_potable: [
        { value: "falta_agua", text: "Falta de agua" },
        { value: "agua_sucia", text: "Agua sucia" },
        { value: "baja_presion", text: "Baja presión" },
        // Nuevos problemas agregados
        { value: "fugas", text: "Fugas de agua" },
        { value: "mal_olor", text: "Mal olor en el agua" },
        { value: "interrupcion_servicio", text: "Interrupción en el servicio" }
    ],
    alumbrado_publico: [
        { value: "lampara_fundida", text: "Lámpara fundida" },
        { value: "falta_luz", text: "Falta de luz" },
        { value: "luz_parpadeante", text: "Luz parpadeante" },
        // Nuevos problemas agregados
        { value: "poco_iluminado", text: "Zona poco iluminada" },
        { value: "cable_colgando", text: "Cable colgando" }
    ],
    pavimentacion: [
        { value: "baches", text: "Baches" },
        { value: "carretera_danada", text: "Carretera dañada" },
        { value: "pavimento_agrietado", text: "Pavimento agrietado" },
        // Nuevos problemas agregados
        { value: "falta_senalizacion", text: "Falta de señalización" },
        { value: "pavimento_incompleto", text: "Pavimento incompleto" }
    ],
    areas_verdes: [
        { value: "falta_riego", text: "Falta de riego" },
        { value: "mal_mantenimiento", text: "Mal mantenimiento" },
        { value: "basura_acumulada", text: "Basura acumulada" },
        // Nuevos problemas agregados
        { value: "mal_olor", text: "Mal olor en áreas verdes" },
        { value: "plagas", text: "Plagas en áreas verdes" },
        { value: "falta_poda", text: "Falta de poda" }
    ]
};

// Manejar el cambio de selección del servicio
servicioSelect.addEventListener('change', function() {
    const servicio = servicioSelect.value;

    // Limpiar la selección anterior
    problemaSelect.innerHTML = '<option value="">Selecciona un problema</option>';
    
    if (servicio) {
        // Mostrar los problemas asociados al servicio
        const problemasSeleccionados = problemas[servicio] || [];
        problemasSeleccionados.forEach(problema => {
            const option = document.createElement('option');
            option.value = problema.value;
            option.textContent = problema.text;
            problemaSelect.appendChild(option);
        });

        // Mostrar el contenedor de problemas
        problemaContainer.style.display = 'block';
    } else {
        problemaContainer.style.display = 'none';
        descripcionContainer.style.display = 'none';
        enviarQuejaButton.style.display = 'none';
    }
});

// Manejar el cambio de selección del problema
problemaSelect.addEventListener('change', function() {
    if (problemaSelect.value) {
        // Mostrar el campo de descripción
        descripcionContainer.style.display = 'block';
        enviarQuejaButton.style.display = 'inline-block';
    } else {
        descripcionContainer.style.display = 'none';
        enviarQuejaButton.style.display = 'none';
    }
});

// Función para obtener los datos del usuario desde localStorage
function obtenerInformacionUsuario() {
    const usuarioData = localStorage.getItem('usuario');
    if (usuarioData) {
        return JSON.parse(usuarioData); // Devuelve los datos del usuario si existen
    }
    return null;  // Si no existe el usuario, devolvemos null
}

// Enviar la queja
enviarQuejaButton.addEventListener('click', function () {
    const servicio = servicioSelect.value;
    const problema = problemaSelect.value;
    const descripcion = document.getElementById('descripcion').value;

    // Obtener la información del usuario desde localStorage
    const usuario = obtenerInformacionUsuario();

    if (usuario) {
        // Crear el objeto de la queja, incluyendo los datos del usuario
        const queja = {
            servicio,
            problema,
            descripcion,
            usuarioId: usuario.id,  // Añadir el ID del usuario
            usuarioImagen: usuario.imagen,  // Añadir la imagen del usuario
            usuarioComprobante: usuario.comprobante,  // Añadir el comprobante del usuario
            usuarioCalle: usuario.calle,  // Añadir la calle del usuario
            fecha: new Date().toISOString()
        };

        // Guardar la queja en localStorage
        localStorage.setItem('queja', JSON.stringify(queja));

        // Mostrar confirmación con SweetAlert
        Swal.fire({
            title: '¡Queja enviada con éxito!',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            // Redirigir a index.html después de enviar la queja
            window.location.href = '/index.html';  // Redirigir a la página principal (index.html)
        });
    } else {
        // Si no hay datos del usuario, mostrar un mensaje de error
        Swal.fire({
            title: 'Error',
            text: 'No se encontraron los datos del usuario.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
});
