import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';
import { PublicUser } from './user';
import { UserProfile } from './user-profile';

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
    profile?: UserProfile;
    likedBy?: PublicUser[];
    createdBy?: number;
    createdAt?: Date;
};

class TweetCreateInput implements Tweet {
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(140)
    content: string;

    @IsOptional()
    replyTo?: number;
}

export { Tweet, TweetCreateInput, GetUserTweetsQuery };
