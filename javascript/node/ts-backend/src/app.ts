import express from 'express';
import helmet from 'helmet';
import logging from './logging';
import controllers from './controllers';
import RouteConfig from './controllers/RouteConfig';

class ExpressApp {
    app: express.Application;
    port: number;
    routes: Array<RouteConfig> = [];
    logger: express.Handler;

    constructor() {
        this.port = 3000;
        this.init();
    }

    init() {
        this.initializeExpress();
        this.configureLogging();
        this.middlewares();
        this.configureRoutes();
    }

    initializeExpress() {
        this.app = express();
    }

    middlewares() {
        this.app.use(helmet());
        this.app.use(express.json());
        this.app.use(express.urlencoded());
        this.app.use(this.logger);
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
                console.log(`Route configured for ${route.getName()}`);
            });
            console.log(`Server started at http://localhost:${this.port}`);
        });
    }
}

const app: ExpressApp = new ExpressApp();
app.start();
