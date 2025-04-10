// Obtener elementos
const formulario = document.getElementById('formulario');
const comprobanteInput = document.getElementById('comprobante');
const comprobantePreview = document.getElementById('comprobantePreview');
const abrirModalBtn = document.getElementById('abrirModalBtn');
const enviarQuejaButton = document.getElementById('enviarQueja');

// Inicialización del mapa
let map;
let marker;
let selectedStreet = "";  // Variable para almacenar el nombre de la calle seleccionada

// Variable para almacenar el archivo subido
let comprobanteArchivo = null;

// Manejar la carga del comprobante de domicilio
formulario.addEventListener('submit', function (event) {
    event.preventDefault();
    
    const file = comprobanteInput.files[0];
    
    if (file) {
        comprobanteArchivo = file;
        const reader = new FileReader();
        
        reader.onload = function (e) {
            // Mostrar el archivo en el contenedor de vista previa
            if (file.type.startsWith('image')) {
                comprobantePreview.innerHTML = `<img src="${e.target.result}" alt="Comprobante" height="200px"/>`;
            } else {
                comprobantePreview.innerHTML = `<p>Archivo subido: ${file.name}</p>`;
            }
            
            // Mostrar el botón para abrir el modal
            abrirModalBtn.style.display = 'inline-block';
        };
        
        reader.readAsDataURL(file);
    }
});

// Guardar la información del comprobante y la calle seleccionada en localStorage
function guardarInformacionUsuario(comprobante, calle) {
    const usuarioData = {
        comprobante,  // Almacenamos solo el nombre del archivo
        calle
    };

    // Guardamos el comprobante y la calle en localStorage
    localStorage.setItem('usuario', JSON.stringify(usuarioData));
}

// Abrir el modal con el mapa
abrirModalBtn.addEventListener('click', function() {
    const modal = new bootstrap.Modal(document.getElementById('mapModal'));
    modal.show();
    mostrarMapa();
});

// Mostrar el mapa dentro del modal
function mostrarMapa() {
  if (map) {
      return; // Si el mapa ya ha sido inicializado, no hacemos nada
  }

  map = L.map('map').setView([19.1749, -98.1604], 13); // Ubicación central por defecto (en Zacatelco)

  // Agregar capa de mapa
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Agregar marcador interactivo
  marker = L.marker([19.1749, -98.1604]).addTo(map);
  marker.bindPopup("<b>Selecciona la calle</b>").openPopup();

  // Permitir al usuario seleccionar la calle haciendo clic en el mapa
  map.on('click', function (e) {
      const latlng = e.latlng;
      marker.setLatLng(latlng);

      // Obtener el nombre de la calle usando la API de Nominatim (OpenStreetMap)
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`)
        .then(response => response.json())
        .then(data => {
          if (data.address && data.address.road) {
            selectedStreet = data.address.road;
            // Al seleccionar, mostrar el botón para confirmar la ubicación
            document.getElementById('confirmarUbicacion').style.display = 'inline-block';
          } else {
            selectedStreet = "Calle no encontrada";
          }
        })
        .catch(error => {
          console.error("Error al obtener la dirección: ", error);
          selectedStreet = "Calle no encontrada";
        });
  });

  // Recargar el mapa para asegurarse de que se ajusta al contenedor después de que se muestra el modal
  const modalElement = document.getElementById('mapModal');
  const modal = bootstrap.Modal.getInstance(modalElement);
  modalElement.addEventListener('shown.bs.modal', function() {
      map.invalidateSize(); // Asegura que el mapa se redimensione correctamente
  });
}

// Confirmar la ubicación seleccionada
document.getElementById('confirmarUbicacion').addEventListener('click', function() {
    // Guardar la información del comprobante y la calle seleccionada en localStorage
    guardarInformacionUsuario(comprobanteArchivo.name, selectedStreet);

    // Mostrar un SweetAlert de confirmación
    Swal.fire({
        title: 'Ubicación seleccionada',
        text: `La calle seleccionada es: ${selectedStreet}`,
        icon: 'success',
        confirmButtonText: 'OK'
    });

    // Cerrar el modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('mapModal'));
    modal.hide();

    // Mostrar el botón para enviar la queja
    enviarQuejaButton.style.display = 'block';
});

// Enviar la queja
enviarQuejaButton.addEventListener('click', function () {
    // Aquí ya hemos guardado la información del usuario previamente, solo podemos confirmar el envío
    Swal.fire({
        title: '¡COMPROBANTE Y UBICACIÓN ENVIADOS CON ÉXITO!',
        icon: 'success',
        confirmButtonText: 'OK'
    }).then(() => {
        // Redirigir a otra página si es necesario
        window.location.href = 'formulario.html';  // Ajusta la URL de redirección si es necesario
    });
});
