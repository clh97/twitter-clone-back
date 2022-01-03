import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

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

export { Connection, ConnectionInput };
