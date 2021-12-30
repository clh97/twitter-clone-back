import express from 'express';
import RouteConfig from './RouteConfig';
import TweetService from '../services/tweet';
import HttpStatusCode from '../types/http-status';
import { classValidatorMiddleware } from '../utils/classValidator';
import { Tweet, TweetCreateInput } from '../types/tweet';
import { authenticatedRequest } from '../utils/jwt';

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
                    const requestData: TweetCreateInput = req.body;
                    const tweet: Tweet = await this.createTweet(requestData);
                    res.status(HttpStatusCode.CREATED).send(tweet);
                } catch (err) {
                    throw err;
                }
            },
        );

        return this.app;
    }

    async createTweet(tweet: TweetCreateInput): Promise<Tweet> {
        try {
            const createdTweet: Tweet = await this.tweetService.createTweet(tweet);
            return createdTweet;
        } catch (err) {
            throw err;
        }
    }
}

export default TweetController;
