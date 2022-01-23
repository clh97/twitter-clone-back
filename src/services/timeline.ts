import express from 'express';
import { ConnectionEntity } from '../entity/connection';
import { TweetEntity } from '../entity/tweet';
import { UserEntity } from '../entity/user';
import { Repository } from 'typeorm';
import { Tweet } from '../types/tweet';

class TimelineService {
    userRepository: Repository<UserEntity>;
    tweetRepository: Repository<TweetEntity>;
    connectionRepository: Repository<ConnectionEntity>;

    constructor(app: express.Application) {
        this.tweetRepository = app.get('db').getRepository(TweetEntity);
        this.connectionRepository = app.get('db').getRepository(ConnectionEntity);
        this.userRepository = app.get('db').getRepository(UserEntity);
    }

    async getTimeline(userId: number): Promise<Tweet[]> {
        try {
            const timelineUserIdEntities = await this.connectionRepository.find({
                where: { from: userId },
                select: ['to'],
            });

            const timelineUserIds = [userId, ...timelineUserIdEntities.map((conn) => conn.to)];

            // returns list of tweets from users the authorized user follows,
            // unless it is a response for another tweet
            const tweetList = await this.tweetRepository
                .createQueryBuilder('twt')
                .where('"createdBy" IN(:...ids)', { ids: timelineUserIds })
                .andWhere('"replyTo" IS NULL')
                .leftJoinAndSelect('twt.owner', 'owner')
                .orderBy('"twt"."createdAt"', 'DESC')
                .limit(10)
                .getMany();
            return tweetList;
        } catch (err) {
            throw err;
        }
    }
}

export default TimelineService;
