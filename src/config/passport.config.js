import passport from "passport";
import local from "passport-local";
import passportJWT from 'passport-jwt'
import { userService } from "../repository/User.service.js";
import { comparaPassword, generaHash } from "../utils.js";
import { config } from "./config.js";
import { UserManager } from "../dao/userManager.js";
import { cartService } from "../repository/Cart.service.js";


const buscarToken = req => {
    return req.cookies.tokenCookie || null;
};

export const iniciarPassport = () => {
    //paso 1
    passport.use(
        "registro",
        new local.Strategy(
            {
                passReqToCallback: true,
                usernameField: "email",
            },
            async (req, username, password, done) => {
                try {
                    const { first_name: nombre, ...otros } = req.body;
                    if (!nombre || !username || !password) {
                        return done(null, false, { message: "Todos los campos requeridos deben completarse." });
                    }
                    if (password.length < 8) {
                        return done(null, false, { message: "La contraseña debe tener al menos 8 caracteres." });
                    }
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(username)) {
                        return done(null, false, { message: "El email no tiene un formato válido." });
                    }
                    const existe = await userService.getUserBy({ email: username })
                    if (existe) {
                        return done(null, false, { message: `Ya existe un usuario con email ${username}` });
                    }
                    const hashedPassword = generaHash(password);

                    let carritoNuevo = await cartService.createCart()
                    const nuevoUsuario = await UserManager.create({
                        first_name: nombre,
                        ...otros,
                        email: username,
                        password: hashedPassword,
                        cart: carritoNuevo
                    });
                    return done(null, nuevoUsuario);
                } catch (error) {
                    console.error('Error durante el registro:', error);
                    return done(error); //segundo argumento de done es el usuario
                }
            }
        )
    );

    passport.use('login',
        new local.Strategy(
            {
                usernameField: 'email'
            },
            async (username, password, done) => {
                try {
                    const usuario = await UserManager.getBy({ email: username })
                    if (!usuario) {
                        return done(null, false, { message: "Credenciales inválidas" });
                    }
                    if (!comparaPassword(password, usuario.password)) {
                        return done(null, false, { message: "Credenciales inválidas." });
                    }

                    delete usuario.password
                    return done(null, usuario)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

};
passport.use('current',
    new passportJWT.Strategy(
        {
            secretOrKey: config.SECRET,
            jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([buscarToken]),
        },
        async (usuario, done) => {
            try {
                if (usuario) {
                    return done(null, usuario);
                }
                return done(null, false, { message: "Usuario no autenticado o inválido." });
            } catch (error) {
                console.error("Error en estrategia JWT:", error);
                return done(error, false);
            }
        }
    )
);