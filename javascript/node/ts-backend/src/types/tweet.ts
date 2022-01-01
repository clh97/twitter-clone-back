import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { User } from './user';

interface GetUserTweetsQuery {
    page: number;
    limit: number;
}

type Tweet = {
    id?: number;
    uuid?: string;
    content?: string;
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
