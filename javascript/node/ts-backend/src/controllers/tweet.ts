import express from 'express';
import RouteConfig from './RouteConfig';
import TweetService from '../services/tweet';
import HttpStatusCode from '../types/http-status';
import { classValidatorMiddleware } from '../utils/classValidator';
import { GetUserTweetsQuery, Tweet, TweetCreateInput } from '../types/tweet';
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
                    const jwtPayload: JwtPayload = req.decodedToken as JwtPayload;
                    const requestData: TweetCreateInput = req.body;
                    const userId: number = jwtPayload.id;
                    const tweet: Tweet = await this.createTweet(requestData, userId);
                    res.status(HttpStatusCode.CREATED).send(tweet);
                } catch (err) {
                    throw err;
                }
            },
        );

        // get all logged in user tweets
        this.app.get(
            `/${this.prefix}/user`,
            [authenticatedRequest],
            async (req: express.Request, res: express.Response) => {
                try {
                    const { page = 1, limit = 5 } = req.query as unknown as GetUserTweetsQuery;
                    const jwtPayload: JwtPayload = req.decodedToken as JwtPayload;
                    const userId: number = jwtPayload.id;
                    const tweets: Tweet[] = await this.paginateUserTweets(userId, page, limit);
                    res.status(HttpStatusCode.OK).send(tweets);
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

    async paginateUserTweets(userId: number, page: number, limit: number): Promise<Tweet[]> {
        try {
            const tweets: Tweet[] = await this.tweetService.getUserTweets(userId, page, limit);
            return tweets;
        } catch (err) {
            throw err;
        }
    }
}

export default TweetController;
