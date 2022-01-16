import express from 'express';
import { Repository } from 'typeorm';
import { TweetEntity } from '../entity/tweet';
import { Tweet, TweetCreateInput } from '../types/tweet';

class TweetService {
    tweetRepository: Repository<TweetEntity>;

    constructor(app: express.Application) {
        this.tweetRepository = app.get('db').getRepository(TweetEntity);
    }

    async createTweet(tweet: TweetCreateInput, userId: number): Promise<Tweet> {
        try {
            const createdTweet = await this.tweetRepository.save({ ...tweet, createdBy: userId });
            return createdTweet;
        } catch (err) {
            throw err;
        }
    }

    async getUserTweets(userId: number, page: number, limit: number): Promise<Tweet[]> {
        try {
            const startIndex: number = (page - 1) * limit;
            const [tweetList] = await this.tweetRepository.findAndCount({
                order: { createdAt: 'DESC' },
                where: { createdBy: userId },
                skip: startIndex,
                take: limit,
            });
            return tweetList;
        } catch (err) {
            throw err;
        }
    }

    async getTweetThread(tweetId: number): Promise<Tweet[]> {
        try {
            const tweetList: Tweet[] = await this.tweetRepository.find({
                order: { createdAt: 'DESC' },
                where: { replyTo: tweetId },
            });
            return tweetList;
        } catch (err) {
            throw err;
        }
    }
}

export default TweetService;
