import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

interface GetUserTweetsQuery {
    page: number;
    limit: number;
}

type Tweet = {
    id?: number;
    uuid?: string;
    content?: string;
    replyTo?: number;
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
