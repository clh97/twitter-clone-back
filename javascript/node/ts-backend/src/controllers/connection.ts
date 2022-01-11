import express from 'express';
import RouteConfig from './RouteConfig';
import ConnectionService from '../services/connection';
import HttpStatusCode from '../types/http-status';
import { classValidatorMiddleware } from '../utils/classValidator';
import { Connection, ConnectionInput } from '../types/connection';
import { authenticatedRequest } from '../utils/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { ConnectionErrors } from '../errors/connection';
import { QueryFailedError } from 'typeorm';
import { PostgresError, handlePostgresError } from '../errors/typeorm';

class ConnectionController extends RouteConfig {
    prefix = 'connection';
    connectionService: ConnectionService;

    constructor(app: express.Application) {
        super(app, 'ConnectionController');
        this.connectionService = new ConnectionService(this.app);
        this.configureRoutes();
    }

    configureRoutes() {
        // follow user
        this.app.post(
            `/${this.prefix}/follow`,
            [classValidatorMiddleware(ConnectionInput), authenticatedRequest],
            async (req: express.Request, res: express.Response) => {
                try {
                    const jwtPayload: JwtPayload = req.decodedToken as JwtPayload;
                    const requestData: ConnectionInput = req.body;
                    const userId: number = jwtPayload.id;
                    const connection: Connection = await this.follow(requestData, userId);
                    res.status(HttpStatusCode.OK).send(connection);
                } catch (err) {
                    const errorMessage = { error: err.message };

                    if (err instanceof QueryFailedError) {
                        const error: PostgresError = handlePostgresError(err);
                        res.status(error.statusCode).send(errorMessage);
                        throw error;
                    }

                    if (err instanceof ConnectionErrors.AlreadyFollowingError) {
                        res.status(HttpStatusCode.CONFLICT).send(errorMessage);
                        throw err;
                    }
                    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(errorMessage);
                    throw err;
                }
            },
        );

        // unfollow user
        this.app.post(
            `/${this.prefix}/unfollow`,
            [classValidatorMiddleware(ConnectionInput), authenticatedRequest],
            async (req: express.Request, res: express.Response) => {
                try {
                    const jwtPayload: JwtPayload = req.decodedToken as JwtPayload;
                    const requestData: ConnectionInput = req.body;
                    const userId: number = jwtPayload.id;
                    const connection: Connection = await this.unfollow(requestData, userId);
                    res.status(HttpStatusCode.OK).send(connection);
                } catch (err) {
                    const errorMessage = { error: err.message };

                    if (err instanceof QueryFailedError) {
                        const error: PostgresError = handlePostgresError(err);
                        res.status(error.statusCode).send(errorMessage);
                        throw error;
                    }

                    if (err instanceof ConnectionErrors.NotFollowingError) {
                        res.status(HttpStatusCode.CONFLICT).send(errorMessage);
                        throw err;
                    }
                    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(errorMessage);
                    throw err;
                }
            },
        );

        return this.app;
    }

    async follow(connection: ConnectionInput, userId: number): Promise<Connection> {
        try {
            const createdConnection: Connection = await this.connectionService.follow(connection, userId);
            return createdConnection;
        } catch (err) {
            throw err;
        }
    }

    async unfollow(connection: ConnectionInput, userId: number): Promise<Connection> {
        try {
            const createdConnection: Connection = await this.connectionService.unfollow(connection, userId);
            return createdConnection;
        } catch (err) {
            throw err;
        }
    }
}

export default ConnectionController;
