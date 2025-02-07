//src\public\js\registro.js
const inputNombre = document.getElementById('first_name');
const inputEmail = document.getElementById('email');
const inputPassword = document.getElementById('password');
const btnSubmit = document.getElementById('btnSubmit');
const divMensajes = document.getElementById('mensajes');

btnSubmit.addEventListener('click', async (e) => {
    e.preventDefault();

    const first_name = inputNombre.value.trim();
    const email = inputEmail.value.trim();
    const password = inputPassword.value.trim();

    if (!first_name || !email || !password) {
        mostrarMensaje('Complete todos los campos obligatorios.');
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        mostrarMensaje('Por favor, introduzca un email válido.');
        return;
    }

    if (password.length < 8) {
        mostrarMensaje('La contraseña debe tener al menos 8 caracteres.');
        return;
    }

    const body = {
        first_name,
        email,
        password
    };

    try {
        const respuesta = await fetch('/api/sessions/registro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const datos = await respuesta.json();

        if (respuesta.status >= 400) {
            mostrarMensaje(datos.error || 'Ocurrió un error al procesar la solicitud.');
        } else if (datos.nuevoUsuario) {
            mostrarMensaje(`Registro exitoso para ${datos.nuevoUsuario.email}`);
            setTimeout(() => {
                window.location.href = `/login?mensaje=Registro Exitoso para ${datos.nuevoUsuario.email}`;
            }, 2000);
        } else {
            mostrarMensaje('Respuesta inesperada del servidor.');
        }
    } catch (error) {
        mostrarMensaje('Hubo un problema con la conexión. Por favor, inténtelo más tarde.');
        console.error('Error al hacer fetch:', error);
    }
});

function mostrarMensaje(mensaje) {
    divMensajes.textContent = mensaje;
    setTimeout(() => {
        divMensajes.textContent = '';
    }, 5000);
}