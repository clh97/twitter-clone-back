import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

interface GetFollowingQuery {
    cursor: number;
    limit: number;
}

interface GetFollowersQuery {
    cursor: number;
    limit: number;
}

type Connection = {
    id?: number;
    uuid?: string;
    from?: number;
    to?: number;
    createdAt?: Date;
};

class ConnectionInput {
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    userId: number;
}

export { Connection, ConnectionInput, GetFollowingQuery, GetFollowersQuery };
