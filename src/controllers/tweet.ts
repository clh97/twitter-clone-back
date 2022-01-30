import express from 'express';
import RouteConfig from './RouteConfig';
import TweetService from '../services/tweet';
import HttpStatusCode from '../types/http-status';
import { classValidatorMiddleware } from '../utils/classValidator';
import { GetUserTweetsQuery, Tweet, TweetCreateInput } from '../types/tweet';
import { authenticatedRequest } from '../utils/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { TweetErrors } from '../errors/tweet';
import { QueryFailedError } from 'typeorm';
import { PostgresError, handlePostgresError } from '../errors/typeorm';

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
                    const errorMessage = { error: err.message };

                    if (err instanceof TweetErrors.SelfReplyError) {
                        res.status(HttpStatusCode.BAD_REQUEST).send(errorMessage);
                        throw err;
                    }

                    if (err instanceof QueryFailedError) {
                        const error: PostgresError = handlePostgresError(err);
                        res.status(error.statusCode).send({ error: error.message });
                        throw error;
                    }

                    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(errorMessage);
                    throw err;
                }
            },
        );

        // get single tweet by id
        this.app.get(`/${this.prefix}/:id`, async (req: express.Request, res: express.Response) => {
            try {
                const tweetId = parseInt(req.params.id as string);
                const tweet: Tweet = await this.getTweetById(tweetId);
                res.status(HttpStatusCode.OK).send(tweet);
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

        // get all tweets from user
        this.app.get(
            `/${this.prefix}/user/all`,
            [authenticatedRequest],
            async (req: express.Request, res: express.Response) => {
                try {
                    const { cursor, limit = 10 } = req.query as unknown as GetUserTweetsQuery;
                    const jwtPayload: JwtPayload = req.decodedToken as JwtPayload;
                    const userId: number = jwtPayload.id;
                    const tweets: Tweet[] = await this.paginateUserTweets(userId, limit, cursor);
                    res.status(HttpStatusCode.OK).send(tweets);
                } catch (err) {
                    const errorMessage = { error: err.message };

                    if (err instanceof QueryFailedError) {
                        const error: PostgresError = handlePostgresError(err);
                        res.status(error.statusCode).send({ error: error.message });
                        throw error;
                    }

                    if (err instanceof TweetErrors.PaginationError) {
                        res.status(HttpStatusCode.BAD_REQUEST).send(errorMessage);
                        throw err;
                    }

                    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(errorMessage);
                    throw err;
                }
            },
        );

        // get all replies for a tweet
        this.app.get(`/${this.prefix}/thread/:id`, async (req: express.Request, res: express.Response) => {
            try {
                const threadId = parseInt(req.params.id as string);
                const tweets = await this.getTweetThread(threadId);
                res.status(HttpStatusCode.OK).send(tweets);
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

        // like tweet
        this.app.get(
            `/${this.prefix}/like/:id`,
            [authenticatedRequest],
            async (req: express.Request, res: express.Response) => {
                try {
                    const jwtPayload: JwtPayload = req.decodedToken as JwtPayload;
                    const userId: number = jwtPayload.id;
                    const tweetId = parseInt(req.params.id as string);
                    const likedTweet = await this.likeTweet(userId, tweetId);
                    res.status(HttpStatusCode.OK).send(likedTweet);
                } catch (err) {
                    const errorMessage = { error: err.message };

                    if (err instanceof QueryFailedError) {
                        const error: PostgresError = handlePostgresError(err);
                        res.status(error.statusCode).send({ error: error.message });
                        throw error;
                    }
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

    async getTweetById(tweetId: number): Promise<Tweet> {
        try {
            const tweet: Tweet = await this.tweetService.getTweetById(tweetId);
            return tweet;
        } catch (err) {
            throw err;
        }
    }

    async paginateUserTweets(userId: number, limit: number, cursor: number): Promise<Tweet[]> {
        try {
            const tweets: Tweet[] = await this.tweetService.getUserTweets(userId, limit, cursor);
            return tweets;
        } catch (err) {
            throw err;
        }
    }

    async getTweetThread(tweetId: number): Promise<Tweet[]> {
        try {
            const tweets: Tweet[] = await this.tweetService.getTweetThread(tweetId);
            return tweets;
        } catch (err) {
            throw err;
        }
    }

    async likeTweet(userId: number, tweetId: number): Promise<Tweet> {
        try {
            const likedTweet: Tweet = await this.tweetService.likeTweet(userId, tweetId);
            return likedTweet;
        } catch (err) {
            throw err;
        }
    }
}

export default TweetController;
