import express from 'express';
import RouteConfig from './RouteConfig';

class DashboardController extends RouteConfig {
    constructor(app: express.Application) {
        super(app, 'DashboardController');
    }

    configureRoutes() {
        this.app.get('/dashboard', (req, res) => {
            res.send('dashboard page');
        });
        return this.app;
    }
}

export default DashboardController;
