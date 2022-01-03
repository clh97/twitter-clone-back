import { IsNotEmpty, IsNumber } from 'class-validator';

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
    from: number;

    @IsNumber()
    @IsNotEmpty()
    to: number;
}

export { Connection, ConnectionInput };
