// Third-Party Imports:
import express, { json } from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

// Middleware Imports:
import { corsMiddleware } from '../Middlewares/corsMiddleware.js';
import { sessionMiddleware } from '../Middlewares/sessionMiddleware.js';
import { refreshTokenMiddleware } from '../Middlewares/refreshTokenMiddleware.js';
import { invalidJSONMiddleware } from '../Middlewares/invalidJSONMiddleware.js';

// Router Imports:
import AuthRouter from '../Routes/AuthRouter.js';
import UsersRouter from '../Routes/UsersRouter.js';

export default class App {
    constructor() {
        this.app = express();
        this.PORT = process.env.BACKEND_PORT ?? 3001;
        this.API_VERSION = process.env.API_VERSION;
        this.API_PREFIX = `/api/v${this.API_VERSION}`;
        this.IGNORED_ROUTES = [
            `${this.API_PREFIX}/auth/login`,
            `${this.API_PREFIX}/auth/register`,
            `${this.API_PREFIX}/auth/status`,
            `${this.API_PREFIX}/auth/confirm`,
            `${this.API_PREFIX}/auth/password/reset`,
            `${this.API_PREFIX}/auth/password/change`,
            `${this.API_PREFIX}/auth/oauth`,
        ];

        this.#setupMiddleware();
        this.#setupRoutes();
    }

    startApp() {
        this.app.listen(this.PORT, () => {
            console.log(`Server listening on http://localhost:${this.PORT}`);
        });
    }

    #setupMiddleware() {
        this.app.disable('x-powered-by'); // Disable 'x-powered-by' header
        this.app.use(json());
        this.app.use(corsMiddleware());
        this.app.use(cookieParser());
        this.app.use(sessionMiddleware());
        this.app.use(refreshTokenMiddleware(this.IGNORED_ROUTES));
        this.app.use(invalidJSONMiddleware());
    }

    #setupRoutes() {
        this.app.use(`${this.API_PREFIX}/auth`, AuthRouter.createRouter());
        this.app.use(`${this.API_PREFIX}/users`, UsersRouter.createRouter());
    }
}
