document.getElementById('logoutButton').addEventListener('click', async () => {
    try {
        const response = await fetch('/api/sessions/logout', { method: 'GET' });

        if (response.ok) {
            console.log('Sesión cerrada exitosamente.');
            window.location.href = '/login';
        } else {
            console.error('Error al cerrar sesión:', await response.json());
            alert('Hubo un problema al cerrar sesión. Inténtalo de nuevo.');
        }
    } catch (error) {
        console.error('Error al intentar cerrar sesión:', error);
        alert('Error al cerrar sesión. Por favor, intenta nuevamente más tarde.');
    }
});