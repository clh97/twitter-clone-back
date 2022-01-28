import express from 'express';
import { JwtPayload } from 'jsonwebtoken';

import RouteConfig from './RouteConfig';
import TimelineService from '../services/timeline';
import { authenticatedRequest } from '../utils/jwt';
import { Tweet, TweetCreateInput } from '../types/tweet';
import HttpStatusCode from '../types/http-status';
import { QueryFailedError } from 'typeorm';
import { PostgresError, handlePostgresError } from '../errors/typeorm';
import { UserProfile } from '../types/user-profile';
import UserProfileService from '../services/user-profile';

class ProfileController extends RouteConfig {
    prefix = 'profile';
    userProfileService: UserProfileService;

    constructor(app: express.Application) {
        super(app, 'ProfileController');
        this.userProfileService = new UserProfileService(this.app);
        this.configureRoutes();
    }

    configureRoutes() {
        // get user profile
        this.app.get(`/${this.prefix}/:id`, async (req: express.Request, res: express.Response) => {
            try {
                const userId = parseInt(req.params.id as string);
                const profile: UserProfile = await this.getProfileByUserId(userId);
                res.status(HttpStatusCode.OK).send({ profile });
            } catch (err) {
                const errorMessage = { error: err.message };

                if (err instanceof QueryFailedError) {
                    const error: PostgresError = handlePostgresError(err);
                    res.status(error.statusCode).send({ error: error.message });
                    throw error;
                }

                res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(errorMessage);
                throw err;
            }
        });

        return this.app;
    }

    async getProfileByUserId(userId: number): Promise<UserProfile> {
        try {
            const profile: UserProfile = await this.userProfileService.getUserProfileById(userId);
            return profile;
        } catch (err) {
            throw err;
        }
    }
}

export default ProfileController;
