
const inputEmail = document.getElementById('email');
const inputPassword = document.getElementById('password');
const btnSubmit = document.getElementById('btnSubmit');
const divMensajes = document.getElementById('mensajes');

btnSubmit.addEventListener('click', async (e) => {
    e.preventDefault();

    const email = inputEmail.value.trim();
    const password = inputPassword.value.trim();

    if (!email || !password) {
        mostrarMensaje('Por favor, completa todos los campos obligatorios.');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        mostrarMensaje('Introduce un email válido.');
        return;
    }

    const body = { email, password };

    try {
        const respuesta = await fetch('/api/sessions/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (respuesta.status === 401) {
            mostrarMensaje('Credenciales incorrectas. Inténtalo de nuevo.');
            return;
        }

        if (!respuesta.ok) {
            mostrarMensaje('Ocurrió un error al procesar la solicitud. Por favor, intenta más tarde.');
            console.error('Error en la respuesta:', await respuesta.text());
            return;
        }

        const datos = await respuesta.json();

        if (datos.usuario) {
            console.log('Usuario autenticado:', datos.usuario);
            window.location.href = '/current';
        } else {
            mostrarMensaje('Ocurrió un error al iniciar sesión. Inténtelo de nuevo.');
        }
    } catch (error) {
        mostrarMensaje('Error de conexión con el servidor. Por favor, inténtalo más tarde.');
        console.error('Error al hacer la solicitud:', error);
    }
});

function mostrarMensaje(mensaje) {
    divMensajes.textContent = mensaje;
    setTimeout(() => {
        divMensajes.textContent = '';
    }, 6000);
}
document.addEventListener('DOMContentLoaded', () => {
    const getQueryParam = (param) => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    };

    const mensaje = getQueryParam('mensaje');
    if (mensaje) {
        mostrarMensaje(mensaje);
    }
});