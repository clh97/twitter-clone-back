import { createConnection } from 'typeorm';
import { UserEntity } from './entity/user';
import { TweetEntity } from './entity/tweet';

export default async () =>
    createConnection({
        type: 'postgres',
        host: 'db',
        port: 5432,
        username: 'tsbackenduser',
        password: '123456',
        database: 'tsbackend',
        entities: [UserEntity, TweetEntity],
        synchronize: true,
        logging: true,
    });
