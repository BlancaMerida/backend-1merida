import { Router } from 'express';
import passport from 'passport';
import { SessionsController } from '../controllers/SessionsController.js'
import { passportCall } from '../utils/utils.js';

export const router = Router();

router.get(
    '/error',
    SessionsController.error
);

router.post(
    '/registro',
    passportCall('registro'),
    SessionsController.registro
);

router.post(
    '/login',
    passportCall('login'),
    SessionsController.login
);

router.get(
    '/current',
    passportCall('current'),
    SessionsController.current
);

router.get(
    '/logout',
    SessionsController.logout
);

router.get(
    '/github',
    passport.authenticate(
        'github',
        {
            scope: ['user:email'],
            session: false
        }
    )
);

router.get(
    '/github/callback',
    passport.authenticate('github', { failureRedirect: '/api/sessions/error', session: false }),
    SessionsController.githubCallback
);