import express from 'express';
import helmet from 'helmet';
import controllers from './controllers';
import RouteConfig from './controllers/RouteConfig';

class ExpressApp {
    app: express.Application;
    port: number;
    routes: Array<RouteConfig> = [];

    constructor() {
        this.port = 3000;
        this.init();
    }

    init() {
        this.initializeExpress();
        this.basicSecurityMeasures();
        this.configureRoutes();
    }

    basicSecurityMeasures() {
        this.app.use(helmet());
    }

    configureRoutes() {
        for (const controller in controllers) {
            this.routes.push(new controllers[controller](this.app));
        }
    }

    initializeExpress() {
        this.app = express();
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
