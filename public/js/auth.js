//funciones relacionadas con la autenticación (login, register, logout, etc.).


function checkUserRole(user) {
    if (user) {
        db.collection('users').doc(user.uid).get()
            .then((doc) => {
                if (doc.exists && doc.data().role === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    showUserInterface();
                }
            })
            .catch((error) => {
                console.error("Error al verificar el rol del usuario:", error);
            });
    } else {
        showLoginInterface();
    }
}
// Funciones de autenticación
function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    auth.signInWithEmailAndPassword(email, password)
        .catch((error) => {
            console.error("Error de inicio de sesión:", error);
            alert("Error de inicio de sesión: " + error.message);
        });
}

//registrarse
// Crear un nuevo usuari




function register() {
const email = document.getElementById('registerEmail').value;
const password = document.getElementById('registerPassword').value;

auth.createUserWithEmailAndPassword(email, password)
.then((userCredential) => {
    const user = userCredential.user;

    // Crear documento en Firestore para el nuevo usuario
    db.collection('users').doc(user.uid).set({
        email: user.email,
        name: "", // Puedes solicitar un nombre en el formulario de registro y usarlo aquí.
        role: "user", // Asigna "user" por defecto. Puedes cambiar a "admin" si es necesario.
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        console.log("Usuario registrado y documento creado en Firestore.");
    })
    .catch((error) => {
        console.error("Error al crear documento en Firestore:", error);
    });
})
.catch((error) => {
    console.error("Error de registro:", error);
    alert("Error de registro: " + error.message);
});
}


function logout() {
    auth.signOut().then(() => {
        console.log("Sesión cerrada");
    }).catch((error) => {
        console.error("Error al cerrar sesión:", error);
    });
}

function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

function showLoginForm() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
}