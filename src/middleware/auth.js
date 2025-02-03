export const auth = (role = null) => {
    return (req, res, next) => {
        if (!req.user) {
            const { web } = req.query;
            if (web) {
                return res.redirect('/login?mensaje=Usuario no autenticado.');
            }
            return res.status(401).json({ error: 'Usuario no autenticado.' });
        }

        if (role && req.user.role !== role) {
            const { web } = req.query;
            if (web) {
                return res.status(403).render('error', { error: 'Acceso denegado.' });
            }
            return res.status(403).json({ error: 'Acceso denegado.' });
        }

        next();
    };
};