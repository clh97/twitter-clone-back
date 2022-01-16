import express from 'express';
import { JwtPayload } from 'jsonwebtoken';

import RouteConfig from './RouteConfig';
import TimelineService from '../services/timeline';
import { authenticatedRequest } from '../utils/jwt';
import { Tweet, TweetCreateInput } from '../types/tweet';
import HttpStatusCode from '../types/http-status';
import { QueryFailedError } from 'typeorm';
import { PostgresError, handlePostgresError } from '../errors/typeorm';

class HomeController extends RouteConfig {
    prefix = '';
    timelineService: TimelineService;

    constructor(app: express.Application) {
        super(app, 'HomeController');
        this.timelineService = new TimelineService(this.app);
        this.configureRoutes();
    }

    configureRoutes() {
        this.app.get('/', (req, res) => {
            res.send('home page');
        });

        // get user timeline
        this.app.get(`/timeline`, [authenticatedRequest], async (req: express.Request, res: express.Response) => {
            try {
                const jwtPayload: JwtPayload = req.decodedToken as JwtPayload;
                const userId: number = jwtPayload.id;
                const timeline = await this.timelineService.getTimeline(userId);
                res.status(HttpStatusCode.OK).send({ timeline });
            } catch (err) {
                const errorMessage = { error: err.message };

                if (err instanceof QueryFailedError) {
                    const error: PostgresError = handlePostgresError(err);
                    res.status(error.statusCode).send(errorMessage);
                    throw error;
                }
                throw err;
            }
        });

        return this.app;
    }
}

export default HomeController;
