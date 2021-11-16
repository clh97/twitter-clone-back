require('./global');
require('dotenv').config();

import 'reflect-metadata';
import express from 'express';
import helmet from 'helmet';

import initializeDatabase from './database';
import logging from './logging';
import controllers from './controllers';
import RouteConfig from './controllers/RouteConfig';

import { decodeTokenMiddleware } from './utils/jwt';
import { validationError } from './utils/classValidator';

class ExpressApp {
    app: express.Application;
    port: number;
    routes: Array<RouteConfig> = [];
    logger: express.Handler;

    constructor() {
        this.port = 3000;
        this.init();
    }

    async init() {
        this.initializeExpress();
        this.configureLogging();
        await this.initializeDatabase();
        this.expressMiddlewares();
        this.configureRoutes();
        this.middlewares();
    }

    initializeExpress() {
        this.app = express();
    }

    async initializeDatabase() {
        try {
            if (process.env.NODE_ENV !== 'test') {
                const database = await initializeDatabase();
                this.app.set('db', database);
            }
        } catch (err) {
            console.error('initializeDatabase:', err);
        }
    }

    expressMiddlewares() {
        this.app.use(helmet());
        this.app.use(express.json());
    }

    middlewares() {
        this.app.use(validationError);
        this.app.use(this.logger);
        this.app.use(decodeTokenMiddleware);
    }

    configureRoutes() {
        for (const controller in controllers) {
            this.routes.push(new controllers[controller](this.app));
        }
    }

    configureLogging() {
        this.logger = logging.createLogger();
    }

    start() {
        this.app.listen(this.port, () => {
            this.routes.forEach((route) => {
                console.log(`Route configured for ${route.getName()} -> /${route.getPrefix()}`);
            });
            console.log(`Server started at http://localhost:${this.port}`);
        });
    }
}

export default ExpressApp;