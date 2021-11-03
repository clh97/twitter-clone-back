import { createConnection } from 'typeorm';
import { UserEntity } from './entity/user';

export default async () =>
    createConnection({
        type: 'postgres',
        host: 'db',
        port: 5432,
        username: 'tsbackenduser',
        password: '123456',
        database: 'tsbackend',
        entities: [UserEntity],
        synchronize: true,
        // logging: true,
    });
