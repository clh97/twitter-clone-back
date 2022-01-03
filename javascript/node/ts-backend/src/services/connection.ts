import express from 'express';
import { QueryFailedError, Repository, TypeORMError } from 'typeorm';
import { DatabaseError } from 'pg-protocol';
import { ConnectionEntity } from '../entity/connection';
import { Connection, ConnectionInput } from '../types/connection';
import { ConnectionErrors } from '../errors/connection';
import { databaseErrorHandler } from '../errors/database';

class ConnectionService {
    connectionRepository: Repository<ConnectionEntity>;

    constructor(app: express.Application) {
        this.connectionRepository = app.get('db').getRepository(ConnectionEntity);
    }

    async follow(connection: ConnectionInput, userId: number): Promise<Connection> {
        try {
            const alreadyFollowing = await this.connectionRepository.findOne({
                where: {
                    from: userId,
                    to: connection.userId,
                },
            });

            if (alreadyFollowing) {
                throw new ConnectionErrors.AlreadyFollowingError();
            }

            const followed = await this.connectionRepository.save({
                from: userId,
                to: connection.userId,
                createdBy: userId,
            });
            return followed;
        } catch (err) {
            if (err instanceof TypeORMError || err instanceof DatabaseError || err instanceof QueryFailedError) {
                const httpError = databaseErrorHandler(err as DatabaseError);
                throw httpError;
            }
            throw err;
        }
    }

    async unfollow(connection: ConnectionInput, userId: number): Promise<Connection> {
        try {
            const unfollowed = await this.connectionRepository.delete({
                from: userId,
                to: connection.userId,
                createdBy: userId,
            });

            if (unfollowed.affected != 1) {
                throw new ConnectionErrors.NotAffectedError();
            }

            return null;
        } catch (err) {
            throw err;
        }
    }

    async getUserConnections(userId: number, page: number, limit: number): Promise<Connection[]> {
        try {
            const startIndex: number = (page - 1) * limit;
            const [ConnectionList] = await this.connectionRepository.findAndCount({
                order: { createdAt: 'DESC' },
                where: { createdBy: userId },
                skip: startIndex,
                take: limit,
            });
            return ConnectionList;
        } catch (err) {
            throw err;
        }
    }
}

export default ConnectionService;
