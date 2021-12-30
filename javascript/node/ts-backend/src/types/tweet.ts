import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

type Tweet = {
    id?: number;
    uuid?: string;
    content?: string;
    createdAt?: Date;
};

class TweetCreateInput implements Tweet {
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(140)
    content: string;
}

export { Tweet, TweetCreateInput };
