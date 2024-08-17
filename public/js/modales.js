// funciones relacionadas con el manejo de modales (cerrarModal, limpiarBackdrop, inicializarModales, etc.).

//cerrar modal 
function cerrarModal(modalId) {
    const modal = document.getElementById(modalId);
    const modalInstance = bootstrap.Modal.getInstance(modal);
    if (modalInstance) {
        modalInstance.hide();
    }
    limpiarBackdrop();
}

function limpiarBackdrop() {
    // Eliminar manualmente el backdrop si persiste
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
        backdrop.remove();
    }
    // Restaurar el scroll del body
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
}

function inicializarModales() {
    const modales = ['ejercicioModal', 'calculo1RMModal', 'recordsModal'];
    modales.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.addEventListener('hidden.bs.modal', function () {
                limpiarBackdrop();
            });
        }
    });
}

function volverATabla() {
    console.log("Volviendo a la tabla de pesos");
    
    // Cerrar el modal de cálculo 1RM si está abierto
    const calculo1RMModal = bootstrap.Modal.getInstance(document.getElementById('calculo1RMModal'));
    if (calculo1RMModal) {
        calculo1RMModal.hide();
    }

    // Cerrar el modal de registros si está abierto
    const recordsModal = bootstrap.Modal.getInstance(document.getElementById('recordsModal'));
    if (recordsModal) {
        recordsModal.hide();
    }

    // Abrir el modal de la tabla de pesos
    const tablaPesosModal = new bootstrap.Modal(document.getElementById('ejercicioModal'));
    tablaPesosModal.show();

    // Recargar la tabla de pesos
    const ejercicio = document.querySelector('#ejercicioModalLabel').textContent.split(' - ')[1];
    cargarTablaDePesos(ejercicio);
}