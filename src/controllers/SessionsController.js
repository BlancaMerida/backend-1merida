import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import UsersDTO from '../DTO/UsersDTO.js';

export class SessionsController {
    static async registro(req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.status(201).json({ message: "Registro exitoso", nuevoUsuario: req.user });
    }

    static async login(req, res) {
        const token = jwt.sign(
            {
            id: req.user._id,
            email: req.user.email,
            first_name: req.user.first_name,
            role: req.user.role,             
            cart: req.user.cart             
        }, 
        config.SECRET, { expiresIn: '1h' });

        const userDTO = new UsersDTO(req.user); 

        res.cookie('tokenCookie', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'Strict', 
            maxAge: 3600000 * 4 
        });

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ message: "Login exitoso", usuario: userDTO, token });
    }

    static async current(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: "Usuario no autenticado." });
            }
    
            const response = {
                id: req.user.id,
                email: req.user.email,
                first_name: req.user.first_name,
                role: req.user.role,
            };
    
            if (req.user.cart) {
                response.cart = req.user.cart;
            }
    
            res.status(200).json({
                message: "Información del usuario obtenida exitosamente",
                usuario: response,
            });
        } catch (error) {
            console.error("Error en controlador current:", error);
            res.status(500).json({ error: "Error inesperado al obtener información del usuario." });
        }
    }

    static async logout(req, res) {
        res.clearCookie('tokenCookie');
        const { web } = req.query;
        if (web) {
            return res.redirect(`/login?mensaje=¡Logout exitoso!`);
        }

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ mensaje: '¡Logout exitoso!' });
    }

    static async githubCallback(req, res) {
        const token = jwt.sign(
            {
                _id: req.user._id,
                email: req.user.email,
                role: req.user.role,
                first_name: req.user.first_name
            },
            config.SECRET,
            { expiresIn: '1h' }
        );
        res.cookie('tokenCookie', token, { httpOnly: true });
        res.redirect('/current');
    }

    static async error(req, res) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(401).json({ error: 'Error al autenticar' });
    }
}