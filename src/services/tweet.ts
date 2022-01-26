import express from 'express';
import { TweetErrors } from '../errors/tweet';
import { LessThanOrEqual, Repository } from 'typeorm';
import { TweetEntity } from '../entity/tweet';
import { Tweet, TweetCreateInput } from '../types/tweet';

class TweetService {
    tweetRepository: Repository<TweetEntity>;

    constructor(app: express.Application) {
        this.tweetRepository = app.get('db').getRepository(TweetEntity);
        this.tweetRepository = app.get('db').getRepository(TweetEntity);
    }

    async createTweet(tweet: TweetCreateInput, userId: number): Promise<Tweet> {
        try {
            const lastTweet = await this.tweetRepository.findOne({}, { order: { id: 'DESC' } });

            if (tweet.replyTo == lastTweet.id) {
                throw new TweetErrors.SelfReplyError();
            }

            const createdTweet: Tweet = await this.tweetRepository.save({ ...tweet, createdBy: userId });

            return createdTweet;
        } catch (err) {
            throw err;
        }
    }

    async getUserTweets(userId: number, limit: number, cursor: number): Promise<Tweet[]> {
        try {
            if (!cursor) {
                const [tweetList] = await this.tweetRepository.findAndCount({
                    relations: ['owner'],
                    order: { createdAt: 'DESC' },
                    where: { createdBy: userId },
                    take: limit,
                });
                return tweetList;
            }

            const [tweetList] = await this.tweetRepository.findAndCount({
                order: { createdAt: 'DESC' },
                where: { createdBy: userId, id: LessThanOrEqual(cursor) },
                take: limit,
            });
            return tweetList;
        } catch (err) {
            throw err;
        }
    }

    async getTweetById(tweetId: number): Promise<Tweet> {
        try {
            const tweet: Tweet = await this.tweetRepository.findOne({ id: tweetId }, { relations: ['likedBy'] });
            return tweet;
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

    async likeTweet(userId: number, tweetId: number): Promise<Tweet> {
        try {
            const tweet = await this.tweetRepository.findOne({ id: tweetId }, { relations: ['owner', 'likedBy'] });

            const alreadyLiked = tweet.likedBy.some((user) => user.id == userId);

            if (alreadyLiked) {
                const filtered = tweet.likedBy.filter((user) => user.id != userId);
                tweet.likedBy = filtered;
                const updated = await this.tweetRepository.save(tweet);
                return updated;
            } else {
                tweet.likedBy.push({ id: userId });
                await this.tweetRepository.save(tweet);
                const updated = await this.tweetRepository.findOne(
                    { id: tweetId },
                    { relations: ['owner', 'likedBy'] },
                );
                return updated;
            }
        } catch (err) {
            throw err;
        }
    }
}

export default TweetService;
