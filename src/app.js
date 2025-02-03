import express from 'express';
import path from 'path';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { engine } from 'express-handlebars';

import { __dirname } from './utils.js';
import vistasRouter from './routes/viewsRouter.js';

import { router as sessionsRouter } from './routes/sessionsRouter.js';
import { router as productsRouter} from './routes/apiProducts.router.js';
import { router as cartsRouter } from './routes/apiCarts.router.js';
import { connDB } from './connDB.js';
import { config } from './config/config.js';
import { iniciarPassport } from './config/passport.config.js';
import { userService } from './repository/User.service.js';

export class Server {
    constructor() {
        this.app = express();
        this.PORT = config.PORT;
        this.middlewares();
        this.templateEngine();
        this.routes();
        this.handleErrors();
        this.connectDatabase();
        userService.initializeAdmin();
    }

    middlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(express.static('./src/public'));
        iniciarPassport();
        this.app.use(passport.initialize());
        this.app.use(express.static(path.join(__dirname, '/public')));
        this.app.use((req, res, next) => {
            res.locals.isLogin = !!req.cookies.tokenCookie;
            next();
        });
    }

    templateEngine() {
        this.app.engine('handlebars', engine({
            runtimeOptions: {
                allowProtoPropertiesByDefault: true,
                allowProtoMethodsByDefault: true,
            },
        }));
        this.app.set('view engine', 'handlebars');
        this.app.set('views', path.join(__dirname, '/views'));
    }

    routes() {
        this.app.use('/', vistasRouter);
        this.app.use('/api/products', productsRouter)
        this.app.use('/api/sessions', sessionsRouter);
        this.app.use('/api/carts', cartsRouter);
    }

    handleErrors() {
        this.app.use((req, res, next) => {
            res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
        });
        this.app.use((err, req, res, next) => {
            res.status(500).json({ error: 'Error del servidor.' });
        });
    }

    connectDatabase() {
        connDB(config.MONGO_URL, config.DB_NAME);
    }

    start() {
        this.app.listen(this.PORT, () => {
            console.log(`Server escuchando en puerto ${this.PORT}`);
        });
    }
}