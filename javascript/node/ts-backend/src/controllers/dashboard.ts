import express from 'express';
import { authenticatedRequest } from '../utils/jwt';
import RouteConfig from './RouteConfig';

class DashboardController extends RouteConfig {
    constructor(app: express.Application) {
        super(app, 'DashboardController');
        this.configureRoutes();
    }

    configureRoutes() {
        this.app.get('/dashboard', authenticatedRequest, async (req, res) => {
            res.send('dashboard page');
        });
        return this.app;
    }
}

export default DashboardController;
