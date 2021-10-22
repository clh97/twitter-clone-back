import express from 'express';
import { DatabaseError } from 'pg-protocol';
import { formatBirthdate } from '../utils/common';
import { EntityNotFoundError, QueryFailedError, Repository, TypeORMError } from 'typeorm';
import { UserEntity } from '../entity/user';
import { User, PublicUser, UserCreateInput, UserUpdateInput } from '../types/user';
import { databaseErrorHandler, DatabaseErrorMessage, generateDatabaseError } from '../errors/database';
import HttpStatusCode from '../types/http-status';

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
            if (err instanceof TypeORMError || err instanceof DatabaseError || err instanceof QueryFailedError) {
                const httpError = databaseErrorHandler(err as DatabaseError);
                throw httpError;
            }
            throw err;
        }
    }

    async readUser(id: number): Promise<PublicUser> {
        try {
            const foundUser: PublicUser = await this.userRepository.findOneOrFail({ id });
            return foundUser;
        } catch (err) {
            if (err instanceof EntityNotFoundError) {
                const httpError = generateDatabaseError({
                    error: err,
                    message: DatabaseErrorMessage.ENTITY_NOT_FOUND,
                    httpCode: HttpStatusCode.NOT_FOUND,
                });
                throw httpError;
            }

            if (err instanceof TypeORMError || err instanceof DatabaseError || err instanceof QueryFailedError) {
                const httpError = databaseErrorHandler(err as DatabaseError);
                throw httpError;
            }
            throw err;
        }
    }

    async updateUser(id: number, user: UserUpdateInput): Promise<PublicUser> {
        try {
            const updatedUser: PublicUser = (await this.userRepository.update(
                { id },
                { ...user, birthdate: formatBirthdate(user.birthdate) },
            )) as PublicUser;
            return updatedUser;
        } catch (err) {
            if (err instanceof TypeORMError || err instanceof DatabaseError || err instanceof QueryFailedError) {
                const httpError = databaseErrorHandler(err as DatabaseError);
                throw httpError;
            }
            throw err;
        }
    }

    // deleteUser(): boolean {}
}

export default AuthenticationService;
