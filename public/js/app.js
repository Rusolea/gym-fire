// Este archivo será el punto de entrada principal de la aplicación. colocar el código que se ejecuta al cargar la página y los event listeners principales:

// app.js

document.addEventListener('DOMContentLoaded', function() {
    inicializarModales();

    //Registrar Service Worker
    if('serviceWorker' in navigator){
        navigator.serviceWorker.register('/public/service-worker.js')
        .then((registration) => {
            console.log("Service Worker Registrado", registration.scope);
        }).catch((error) => {
            console.error('Error al registrar el services worker', error);
        })
    }
    
    auth.onAuthStateChanged((user) => {
        if(user) {
            // Usuario ha iniciado sesión s
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

    
    
    document.querySelectorAll('.ejercicio img').forEach(img => {
        img.addEventListener('click', function() {
            const ejercicio = this.getAttribute('data-ejercicio');
            const modalTitle = document.querySelector('#ejercicioModalLabel');
            modalTitle.textContent = `Tabla de Pesos - ${ejercicio}`;
            
            cargarTablaDePesos(ejercicio);
            const myModal = new bootstrap.Modal(document.getElementById('ejercicioModal'));
            myModal.show();
        });
    });
});

// Add any other general app logic or event listeners here