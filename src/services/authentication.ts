import express from 'express';
import argon2 from 'argon2';
import parseDuration from 'parse-duration';
import jwt from 'jsonwebtoken';
import { formatBirthdate } from '../utils/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../entity/user';
import { User, PublicUser, UserCreateInput, UserUpdateInput, UserLoginInput, UserLoginOutput } from '../types/user';
import HttpStatusCode from '../types/http-status';
import HttpError from '../errors/http-error';
import { AuthenticationErrorMessage } from '../errors/authentication';
import moment from 'moment';
import { UserProfile } from '../types/user-profile';
import { UserProfileEntity } from '../entity/user-profile';

class AuthenticationService {
    userRepository: Repository<UserEntity>;
    userProfileRepository: Repository<UserEntity>;

    constructor(app: express.Application) {
        this.userRepository = app.get('db').getRepository(UserEntity);
        this.userProfileRepository = app.get('db').getRepository(UserProfileEntity);
    }

    async createUser(user: UserCreateInput): Promise<PublicUser> {
        try {
            const hashed = await argon2.hash(user.password);
            const profile = await this.userProfileRepository.save({});
            const createdUser = await this.userRepository.save({
                ...user,
                password: hashed,
                birthdate: formatBirthdate(user.birthdate),
                profile,
            });

            delete createdUser.id;
            delete createdUser.password;
            return createdUser as PublicUser;
        } catch (err) {
            throw err;
        }
    }

    async readUser(id: number): Promise<PublicUser> {
        try {
            const foundUser: PublicUser = await this.userRepository.findOneOrFail({
                where: { id }
            });
            return foundUser;
        } catch (err) {
            throw err;
        }
    }

    async updateUser(id: number, user: UserUpdateInput): Promise<PublicUser> {
        try {
            let userToUpdate = user;

            if (user.birthdate) {
                userToUpdate.birthdate = formatBirthdate(user.birthdate);
            }

            const updatedUser = await this.userRepository.save(
                { id, ...userToUpdate, }
            );

            return updatedUser as PublicUser;
        } catch (err) {
            throw err;
        }
    }

    async deleteUser(id: number): Promise<boolean> {
        try {
            const deleted = await this.userRepository.delete({ id });
            return deleted.affected > 0;
        } catch (err) {
            throw err;
        }
    }

    async authenticateUser(user: UserLoginInput): Promise<UserLoginOutput> {
        const invalidLoginError: HttpError = {
            error: new Error(AuthenticationErrorMessage.USER_NOT_FOUND),
            httpCode: HttpStatusCode.NOT_FOUND,
            message: AuthenticationErrorMessage.USER_NOT_FOUND,
        };

        try {
            const found = await this.userRepository.findOne({
                where: { username: user.username },
                select: ['id', 'password'],
            });
            if (!found) {
                throw invalidLoginError;
            }
            const isValid = await argon2.verify(String(found.password), String(user.password));

            if (!isValid) {
                throw invalidLoginError;
            }
            const expiresIn: number = parseDuration(process.env.JWT_EXPIRATION_TIME);

            const token = jwt.sign({ id: found.id }, process.env.JWT_SECRET, {
                expiresIn,
            });

            return {
                token,
                expiresAt: moment().add(expiresIn, 'milliseconds').toISOString(),
            };
        } catch (err) {
            throw err;
        }
    }
}

export default AuthenticationService;