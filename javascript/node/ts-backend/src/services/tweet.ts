import express from 'express';
import { Repository } from 'typeorm';
import { TweetEntity } from '../entity/tweet';
import { Tweet, TweetCreateInput } from '../types/tweet';

class TweetService {
    tweetRepository: Repository<TweetEntity>;

    constructor(app: express.Application) {
        this.tweetRepository = app.get('db').getRepository(TweetEntity);
    }

    async createTweet(tweet: TweetCreateInput): Promise<Tweet> {
        try {
            const createdTweet = this.tweetRepository.save(tweet);
            return createdTweet;
        } catch (err) {
            throw err;
        }
    }
}

export default TweetService;
