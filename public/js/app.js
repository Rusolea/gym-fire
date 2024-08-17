// Este archivo será el punto de entrada principal de la aplicación. colocar el código que se ejecuta al cargar la página y los event listeners principales:

// app.js

document.addEventListener('DOMContentLoaded', function() {
    inicializarModales();
    
    auth.onAuthStateChanged((user) => {
        if(user) {
            // Usuario ha iniciado sesión
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('registerForm').style.display = 'none';
            document.getElementById('userInfo').style.display = 'block';
            document.getElementById('mainContent').style.display = 'block';
            document.getElementById('userEmail').textContent = user.email;

            cargarEjerciciosDesdeFirebase();
        } else {
            // Usuario no ha iniciado sesión
            document.getElementById('loginForm').style.display = 'block';
            document.getElementById('registerForm').style.display = 'none';
            document.getElementById('userInfo').style.display = 'none';
            document.getElementById('mainContent').style.display = 'none';
        }
    });

    const myModal = new bootstrap.Modal(document.getElementById('ejercicioModal'));
    
    document.querySelectorAll('.ejercicio img').forEach(img => {
        img.addEventListener('click', function() {
            const ejercicio = this.getAttribute('data-ejercicio');
            const modalTitle = document.querySelector('#ejercicioModalLabel');
            modalTitle.textContent = `Tabla de Pesos - ${ejercicio}`;
            
            cargarTablaDePesos(ejercicio);
            myModal.show();
        });
    });
});

// Add any other general app logic or event listeners here