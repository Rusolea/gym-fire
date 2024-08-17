// Incluye las funciones relacionadas con la carga y manejo de ejercicios (cargarEjerciciosDesdeFirebase, getImageUrl, etc.).

//cargar datos en tabla dentro del modal 1
function cargarTablaDePesos(ejercicio) {
    const user = auth.currentUser;
    if (!user) {
        console.error("Usuario no autenticado");
        return;
    }

    console.log(ejercicio)
    db.collection("historialRM")
        .where("userId", "==", user.uid)
        .where("ejercicio", "==", ejercicio)
        .orderBy("fecha", "desc")
        .limit(1)
        .get()
        .then((querySnapshot) => {
            const tablaHistorial = document.getElementById("tabla-pesos").getElementsByTagName("tbody")[0];
            tablaHistorial.innerHTML = ""; // Limpia la tabla

            if (querySnapshot.empty) {
                console.log("No se encontraron registros para este ejercicio");
                tablaHistorial.innerHTML = "<tr><td colspan='2'>No se encontraron registros</td></tr>";
                return;
            }
            
            const doc = querySnapshot.docs[0];
            const rm = doc.data().rm;

            for (let rep = 1; rep <= 15; rep++) {
                const row = tablaHistorial.insertRow();
                const repCell = row.insertCell();
                const pesoCell = row.insertCell();
                
                repCell.textContent = rep;
                // Cálculo del peso usando la fórmula de Brzycki
                const peso = rm * (1.0278 - 0.0278 * rep);
                let pesoRedondeado = peso;
                if(pesoRedondeado >= 10){
                    // Redondear a 2.5 kg más cercano para pesos mayores o iguales a 10 kg
                    pesoRedondeado = Math.round(pesoRedondeado / 2.5) * 2.5;
                }
                else{
                    // Redondear a 1 kg más cercano para pesos menores a 10 kg
                    pesoRedondeado = Math.round(pesoRedondeado);
                }

                pesoCell.textContent = pesoRedondeado + " kg"; // Redondear a 2 decimales
            }
        })


       
            
            // // Redondeo según las especificaciones
            // if (peso >= 10) {
            //     // Redondear a 2.5 kg más cercano para pesos mayores o iguales a 10 kg
            //     peso = Math.round(peso / 2.5) * 2.5;
            // } else {
            //     // Redondear a 1 kg más cercano para pesos menores a 10 kg
            //     peso = Math.round(peso);
            // }
            
            // pesoCell.textContent = peso.toFixed(1) + " kg"; // Mostrar siempre un decimal






        
        .catch((error) => {
            console.error("Error al obtener los documentos: ", error);
            alert("Error al obtener los registros: " + error.message);
            document.getElementById("tabla-pesos").getElementsByTagName("tbody")[0].innerHTML = "<tr><td colspan='2'>Error al cargar los datos</td></tr>";
        });
}

//boton para ver registros histtoricos con dia mes año, RM, peso y repeticiones , ejercicio.
// Función para ver registros históricos
function verRegistros() {
    const user = auth.currentUser;
            if (!user) {
                console.error("Usuario no autenticado");
                return;
            }
    console.log("Iniciando función verRegistros()");
    
    const ejercicio = document.querySelector('#ejercicioModalLabel').textContent.split(' - ')[1];
    console.log("Ejercicio seleccionado:", ejercicio);
    
    // Cerrar el modal de la tabla de pesos
    const tablaPesosModal = bootstrap.Modal.getInstance(document.getElementById('ejercicioModal'));
    tablaPesosModal.hide();

    // Abrir el modal de registros
    const recordsModal = new bootstrap.Modal(document.getElementById('recordsModal'));
    recordsModal.show();

    document.getElementById('recordsModal').addEventListener('shown.bs.modal', function () {
        console.log("Modal de registros mostrado");
        
        const tabla = document.getElementById("tabla-registros");
        if (!tabla) {
            console.error("No se pudo encontrar la tabla con id 'tabla-registros'");
            alert("Error: No se pudo encontrar la tabla de registros");
            return;
        }

        let tbody = tabla.querySelector("tbody");
        if (!tbody) {
            console.log("No se encontró <tbody>, creando uno nuevo");
            tbody = document.createElement("tbody");
            tabla.appendChild(tbody);
        }

        // Limpiar la tabla
        tbody.innerHTML = "";
        console.log("Tabla limpiada");

        // Realizar la consulta a Firestore
        db.collection("historialRM")
            .where("userId", "==", user.uid)
            .where("ejercicio", "==", ejercicio)
            .orderBy("fecha", "desc")
            .get()
            .then((querySnapshot) => {
                console.log("Consulta a Firestore completada");
                if (querySnapshot.empty) {
                    const row = tbody.insertRow();
                    const cell = row.insertCell();
                    cell.colSpan = 5;
                    cell.textContent = "No se encontraron registros para este ejercicio";
                    console.log("No se encontraron registros");
                } else {
                    querySnapshot.forEach((doc) => {
                        const row = tbody.insertRow();
                        const data = doc.data();
                        
                        // Fecha
                        const date = data.fecha.toDate();
                        row.insertCell().textContent = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
                        
                        // RM, Peso, Repeticiones
                        row.insertCell().textContent = data.rm;
                        row.insertCell().textContent = data.peso;
                        row.insertCell().textContent = data.reps;
                        
                        // Acciones
                        const accionesCell = row.insertCell();
                        const editarBtn = document.createElement('button');
                        editarBtn.textContent = 'Editar';
                        editarBtn.className = 'btn btn-sm btn-warning me-2';
                        editarBtn.onclick = () => editarRegistro(doc.id, data);
                        
                        const borrarBtn = document.createElement('button');
                        borrarBtn.textContent = 'Borrar';
                        borrarBtn.className = 'btn btn-sm btn-danger';
                        borrarBtn.onclick = () => eliminarRegistro(doc.id);
                        
                        accionesCell.appendChild(editarBtn);
                        accionesCell.appendChild(borrarBtn);
                    });
                    console.log("Registros añadidos a la tabla");
                }
            })
            .catch((error) => {
                console.error("Error al obtener los documentos: ", error);
                alert("Error al obtener los registros: " + error.message);
            });
    }, { once: true }); // Añadimos { once: true } para que el evento solo se ejecute una vez
}

// Modificar la función calcular1RM para resetear el formulario y el botón
function calcular1RM() {
    console.log("Abriendo modal de cálculo 1RM");
    
    // Resetear el formulario
    document.getElementById('pesoUsado').value = '';
    document.getElementById('repsLogradas').value = '';

    // Resetear el texto y la función del botón
    const guardarBtn = document.querySelector('#calculo1RMModal .btn-success');
    guardarBtn.textContent = 'Calcular y Guardar';
    guardarBtn.onclick = guardar1RM;

    // Cerrar el modal de la tabla de pesos
    const tablaPesosModal = bootstrap.Modal.getInstance(document.getElementById('ejercicioModal'));
    tablaPesosModal.hide();

    // Abrir el modal de cálculo 1RM
    const calculo1RMModal = new bootstrap.Modal(document.getElementById('calculo1RMModal'));
    calculo1RMModal.show();
}

// Modificar la función guardar1RM para resetear el formulario después de guardar
async function guardar1RM() {
    const user = auth.currentUser;
            if (!user) {
                console.error("Usuario no autenticado");
                return;
            }

    console.log("Iniciando cálculo y guardado de 1RM");
    
    const peso = parseFloat(document.getElementById('pesoUsado').value);
    const reps = parseInt(document.getElementById('repsLogradas').value);
    const ejercicio = document.querySelector('#ejercicioModalLabel').textContent.split(' - ')[1];

    if (isNaN(peso) || isNaN(reps) || peso <= 0 || reps <= 0) {
        alert('Por favor, ingrese valores válidos para peso y repeticiones.');
        return;
    }

    // Fórmula de Brzycki para estimar 1RM
    const rm1 = Math.round(peso / (1.0278 - 0.0278 * reps));

    const nuevoRegistro = {
        userId: user.uid,
        fecha: new Date(),
        rm: rm1,
        peso: peso,
        reps: reps,
        ejercicio: ejercicio
    };

    // Colección: historialRM
{
//   id: string, // ID del documento (generado automáticamente por Firestore)
  
  
  
 
}

    try {
        await db.collection("historialRM").add(nuevoRegistro);
        console.log("Registro guardado en Firestore con éxito");
        alert(`Nuevo 1RM calculado y guardado: ${rm1} kg`);
        
        // Resetear el formulario
        document.getElementById('pesoUsado').value = '';
        document.getElementById('repsLogradas').value = '';
        
        // Cerrar el modal de cálculo 1RM
        const calculo1RMModal = bootstrap.Modal.getInstance(document.getElementById('calculo1RMModal'));
        calculo1RMModal.hide();

        // Volver a la tabla de pesos
        volverATabla();
    } catch (error) {
        console.error("Error al guardar en Firestore: ", error);
        alert("Hubo un error al guardar el registro en la base de datos.");
    }
}

// Función para eliminar un registro
function eliminarRegistro(docId) {
    if (confirm('¿Estás seguro de que quieres eliminar este registro?')) {
        db.collection("historialRM").doc(docId).delete().then(() => {
            console.log("Registro eliminado con éxito");
            alert("Registro eliminado con éxito");
            // En lugar de llamar a verRegistros, cerramos el modal actual y volvemos a abrirlo
            const recordsModal = bootstrap.Modal.getInstance(document.getElementById('recordsModal'));
            recordsModal.hide();
            setTimeout(() => verRegistros(), 500); // Esperamos un poco antes de volver a abrir el modal
        }).catch((error) => {
            console.error("Error al eliminar el registro: ", error);
            alert("Error al eliminar el registro: " + error.message);
        });
    }
}



// Función para editar un registro
function editarRegistro(docId, data) {
    console.log("Editando registro:", docId);
    
    // Cerrar el modal de registros
    const recordsModal = bootstrap.Modal.getInstance(document.getElementById('recordsModal'));
    recordsModal.hide();

    // Abrir el modal de cálculo 1RM
    const calculo1RMModal = new bootstrap.Modal(document.getElementById('calculo1RMModal'));
    calculo1RMModal.show();

    // Rellenar el formulario con los datos actuales
    document.getElementById('pesoUsado').value = data.peso;
    document.getElementById('repsLogradas').value = data.reps;

    // Cambiar el texto del botón
    const guardarBtn = document.querySelector('#calculo1RMModal .btn-success');
    guardarBtn.textContent = 'Actualizar';
    
    // Cambiar la función del botón
    guardarBtn.onclick = () => actualizarRegistro(docId);
}

// Función para actualizar un registro
async function actualizarRegistro(docId) {
    console.log("Actualizando registro:", docId);
    
    const peso = parseFloat(document.getElementById('pesoUsado').value);
    const reps = parseInt(document.getElementById('repsLogradas').value);
    const ejercicio = document.querySelector('#ejercicioModalLabel').textContent.split(' - ')[1];

    if (isNaN(peso) || isNaN(reps) || peso <= 0 || reps <= 0) {
        alert('Por favor, ingrese valores válidos para peso y repeticiones.');
        return;
    }

    // Fórmula de Brzycki para estimar 1RM
    const rm1 = Math.round(peso / (1.0278 - 0.0278 * reps));

    const registroActualizado = {
        fecha: new Date(),
        rm: rm1,
        peso: peso,
        reps: reps,
        ejercicio: ejercicio
    };

    try {
        await db.collection("historialRM").doc(docId).update(registroActualizado);
        console.log("Registro actualizado en Firestore con éxito");
        alert(`Registro actualizado con éxito. Nuevo 1RM: ${rm1} kg`);
        
        // Cerrar el modal de cálculo 1RM
        const calculo1RMModal = bootstrap.Modal.getInstance(document.getElementById('calculo1RMModal'));
        calculo1RMModal.hide();

        // Volver a la tabla de registros
        verRegistros();
    } catch (error) {
        console.error("Error al actualizar en Firestore: ", error);
        alert("Hubo un error al actualizar el registro en la base de datos.");
    }
}

//el directoiro de la imagens es public, esta funcion busca este direcorio y lo agrega a la URL del html
// function getImageUrl(url) {
//   return `/public/${url}`;
// }

//obtiene las imagenes de la url en firebase en base a la ruta storage de firebase 


async function getImageUrl(path) {
  try {
    if (path.startsWith('gs://')) {
      // Si es una URL de gs://, usamos refFromURL
      const url = await storage.refFromURL(path).getDownloadURL();
      return url;
    } else {
      // Si es una ruta relativa, usamos ref
      const url = await storage.ref(path).getDownloadURL();
      return url;
    }
  } catch (error) {
    console.error("Error al obtener la URL de la imagen:", error);
    return '/path/to/placeholder/image.jpg'; // Una imagen por defecto en caso de error
  }
}

// Y luego usarla en tu HTML así:

//cargar contenido imagenes de ejercicios dinamicamnete 
// Función para cargar ejercicios dinámicamente
// Asegúrate de haber inicializado Firebase antes de usar estas funciones

async function cargarEjerciciosDesdeFirebase() {
  const ejerciciosContainer = document.getElementById('ejerciciosContainer');
  const loadingEffect = document.getElementById('loadingEffect');

  loadingEffect.style.display = 'block';
  ejerciciosContainer.style.display = 'none';

  try {
    const querySnapshot = await db.collection("ejercicios").get();
    
    loadingEffect.style.display = 'none';
    ejerciciosContainer.style.display = 'flex';
    ejerciciosContainer.innerHTML = '';

    for (const doc of querySnapshot.docs) {
      const ejercicio = doc.data();
      let imageUrl;
      try {
        imageUrl = await getImageUrl(ejercicio.imagenUrl);
      } catch (error) {
        console.error(`Error al obtener URL para ${ejercicio.nombre}:`, error);
        imageUrl = '/path/to/placeholder/image.jpg'; // Usa una imagen de placeholder
      }
      
      const ejercicioHTML = `
        <div class="col-md-4">
          <div class="card text-center mb-4">
            <div class="ejercicio card-body">
              <img src="${imageUrl}" class="card-img-top rounded" alt="${ejercicio.nombre}"
                   data-bs-toggle="modal" data-bs-target="#ejercicioModal" data-ejercicio="${ejercicio.nombre}">
              <h5 class="card-title mt-3">${ejercicio.nombre}</h5>
            </div>
          </div>
        </div>
      `;
      ejerciciosContainer.innerHTML += ejercicioHTML;
    }
    
    agregarEventListeners();
  } catch (error) {
    console.error("Error al cargar ejercicios:", error);
    loadingEffect.style.display = 'none';
    ejerciciosContainer.innerHTML = '<p>Error al cargar los ejercicios. Por favor, intenta de nuevo más tarde.</p>';
  }
}

function agregarEventListeners() {
    document.querySelectorAll('.ejercicio img').forEach(img => {
      img.addEventListener('click', function() {
        const ejercicio = this.getAttribute('data-ejercicio');
        const modalTitle = document.querySelector('#ejercicioModalLabel');
        modalTitle.textContent = `Tabla de Pesos - ${ejercicio}`;
        cargarTablaDePesos(ejercicio);
        // Asumiendo que estás usando Bootstrap para los modales
        var myModal = new bootstrap.Modal(document.getElementById('ejercicioModal'));
        myModal.show();
      });
    });
  }