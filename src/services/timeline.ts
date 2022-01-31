import express from 'express';
import { ConnectionEntity } from '../entity/connection';
import { TweetEntity } from '../entity/tweet';
import { UserEntity } from '../entity/user';
import { Repository } from 'typeorm';
import { Tweet } from '../types/tweet';
import { UserProfileEntity } from '../entity/user-profile';
import { Timeline } from '../types/timeline';

class TimelineService {
    userRepository: Repository<UserEntity>;
    tweetRepository: Repository<TweetEntity>;
    connectionRepository: Repository<ConnectionEntity>;

    constructor(app: express.Application) {
        this.tweetRepository = app.get('db').getRepository(TweetEntity);
        this.connectionRepository = app.get('db').getRepository(ConnectionEntity);
        this.userRepository = app.get('db').getRepository(UserEntity);
    }

    async getTimeline(userId: number): Promise<Timeline> {
        try {
            const timelineUserIdEntities = await this.connectionRepository.find({
                where: { from: userId },
                select: ['to'],
            });

            const timelineUserIds = [userId, ...timelineUserIdEntities.map((conn) => conn.to)];

            // returns list of tweets from users the authorized user follows,
            // unless it is a response for another tweet
            let tweetList: Tweet[] = await this.tweetRepository
                .createQueryBuilder('twt')
                .where('"createdBy" IN(:...ids)', { ids: timelineUserIds })
                .andWhere('"replyTo" IS NULL')
                .leftJoinAndMapOne('twt.owner', UserEntity, 'owner', 'twt.owner.id = owner.id')
                .leftJoinAndMapOne('twt.profile', UserProfileEntity, 'profile', 'twt.owner.id = profile.ownerId')
                .orderBy('"twt"."createdAt"', 'DESC')
                .limit(10)
                .getMany();

            tweetList = tweetList.map((tweet: Tweet) => ({
                ...tweet,
                profile: {
                    ...tweet.profile,
                    ownerId: tweet.owner.id,
                    ownerUsername: tweet.owner.username,
                    profileImage: `${process.env.STATIC_IMAGE_BASE_URL}/${tweet.profile.profileImage}`,
                    profileBackgroundImage: `${process.env.STATIC_IMAGE_BASE_URL}/${tweet.profile.profileBackgroundImage}`,
                },
            }));

            const profiles = tweetList.map((tweet) => tweet.profile);

            return { tweets: tweetList, profiles };
        } catch (err) {
            throw err;
        }
    }
}

export default TimelineService;
