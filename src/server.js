import express from 'express';
import path from 'path';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { engine } from 'express-handlebars';
import compression from 'express-compression';

import { __dirname } from './utils/utils.js'
import vistasRouter from './routes/views.router.js';

import { router as sessionsRouter } from './routes/sessions.router.js';
import { router as productsRouter } from './routes/apiProducts.router.js';
import { router as cartsRouter } from './routes/apiCarts.router.js';
import { router as mocksRouter } from './routes/mocks.router.js'
import { connDB } from './connDB.js';
import { config } from './config/config.js';
import { iniciarPassport } from './config/passport.config.js';
import { userService } from './services/User.service.js';
import loggerUtil from './utils/logger.util.js'
import errorHandler from './middleware/errorHandler.js';
import httpLogger from './middleware/httpLogger.mid.js';
;

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
        this.app.use(compression({
            brotli: { enabled: true, zlib: {} }
        }))
        this.app.use(cookieParser());
        this.app.use(express.static('./src/public'));
        iniciarPassport();
        this.app.use(passport.initialize());
        this.app.use(express.static(path.join(__dirname, '/public')));
        this.app.use((req, res, next) => {
            res.locals.isLogin = !!req.cookies.tokenCookie;
            next();
        });
        this.app.use(httpLogger)
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
        this.app.use('/api/mocks', mocksRouter);
    }

    handleErrors() {
        this.app.use((req, res, next) => {
            res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
        });
        this.app.use(errorHandler);
    }

    connectDatabase() {
        connDB(config.MONGO_URL, config.DB_NAME);
    }

    start() {
        this.app.listen(this.PORT, () => {
            loggerUtil.INFO(`Server escuchando en puerto ${this.PORT}`);
        });
    }
}