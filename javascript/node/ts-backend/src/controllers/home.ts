import express from 'express';
import RouteConfig from './RouteConfig';

class HomeController extends RouteConfig {
    constructor(app: express.Application) {
        super(app, 'HomeController');
    }

    configureRoutes() {
        this.app.get('/', (req, res) => {
            res.send('home page');
        });
        return this.app;
    }
}

export default HomeController;
