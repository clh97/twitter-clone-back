import express from 'express';
import RouteConfig from './RouteConfig';
import TweetService from '../services/tweet';
import HttpStatusCode from '../types/http-status';
import { classValidatorMiddleware } from '../utils/classValidator';
import { Tweet, TweetCreateInput } from '../types/tweet';
import { authenticatedRequest } from '../utils/jwt';
import { JwtPayload } from 'jsonwebtoken';

class TweetController extends RouteConfig {
    prefix = 'tweet';
    tweetService: TweetService;

    constructor(app: express.Application) {
        super(app, 'TweetController');
        this.tweetService = new TweetService(this.app);
        this.configureRoutes();
    }

    configureRoutes() {
        // create tweet
        this.app.post(
            `/${this.prefix}`,
            [classValidatorMiddleware(TweetCreateInput), authenticatedRequest],
            async (req: express.Request, res: express.Response) => {
                try {
                    if (!req.authenticated) {
                        throw new Error('Unauthenticated');
                    }

                    const jwtPayload: JwtPayload = req.decodedToken as JwtPayload;
                    const requestData: TweetCreateInput = req.body;
                    const tweet: Tweet = await this.createTweet(requestData, jwtPayload.id);
                    res.status(HttpStatusCode.CREATED).send(tweet);
                } catch (err) {
                    throw err;
                }
            },
        );

        return this.app;
    }

    async createTweet(tweet: TweetCreateInput, userId: number): Promise<Tweet> {
        try {
            const createdTweet: Tweet = await this.tweetService.createTweet(tweet, userId);
            return createdTweet;
        } catch (err) {
            throw err;
        }
    }
}

export default TweetController;
