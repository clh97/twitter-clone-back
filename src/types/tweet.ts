import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { PublicUser } from './user';

interface GetUserTweetsQuery {
    cursor: number;
    limit: number;
}

type Tweet = {
    id?: number;
    uuid?: string;
    content?: string;
    replyTo?: number;
    owner?: PublicUser;
    likedBy?: PublicUser[];
    createdBy?: number;
    createdAt?: Date;
};

class TweetCreateInput implements Tweet {
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(140)
    content: string;
}

export { Tweet, TweetCreateInput, GetUserTweetsQuery };