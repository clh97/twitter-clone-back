import express from 'express';
import { DatabaseError } from 'pg-protocol';
import { formatBirthdate } from '../utils/common';
import { Repository, TypeORMError } from 'typeorm';
import { UserEntity } from '../entity/user';
import { User, PublicUser, UserCreateInput } from '../types/user';
import { databaseErrorHandler } from '../errors/database';

class AuthenticationService {
    app: express.Application;
    userRepository: Repository<UserEntity>;

    constructor(app: express.Application) {
        this.app = app;
        this.userRepository = this.app.get('db').getRepository(UserEntity);
    }

    async createUser(user: UserCreateInput): Promise<PublicUser> {
        try {
            const createdUser: PublicUser = await this.userRepository.save({
                ...user,
                birthdate: formatBirthdate(user.birthdate),
            });
            return createdUser;
        } catch (err) {
            if (err instanceof TypeORMError || err instanceof DatabaseError) {
                const httpError = databaseErrorHandler(err as DatabaseError);
                throw httpError;
            }
            throw err;
        }
    }

    // readUser(): User | PublicUser {}

    // updateUser(): User | PublicUser {}

    // deleteUser(): boolean {}
}

export default AuthenticationService;
