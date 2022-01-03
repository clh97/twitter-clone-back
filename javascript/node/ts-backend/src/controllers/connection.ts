import express from 'express';
import RouteConfig from './RouteConfig';
import ConnectionService from '../services/connection';
import HttpStatusCode from '../types/http-status';
import { classValidatorMiddleware } from '../utils/classValidator';
import { Connection, ConnectionInput } from '../types/connection';
import { authenticatedRequest } from '../utils/jwt';
import { JwtPayload } from 'jsonwebtoken';

class ConnectionController extends RouteConfig {
    prefix = 'connection';
    connectionService: ConnectionService;

    constructor(app: express.Application) {
        super(app, 'ConnectionController');
        this.connectionService = new ConnectionService(this.app);
        this.configureRoutes();
    }

    configureRoutes() {
        // create connection
        this.app.post(
            `/${this.prefix}`,
            [classValidatorMiddleware(ConnectionInput), authenticatedRequest],
            async (req: express.Request, res: express.Response) => {
                try {
                    const jwtPayload: JwtPayload = req.decodedToken as JwtPayload;
                    const requestData: ConnectionInput = req.body;
                    const userId: number = jwtPayload.id;
                    const Connection: Connection = await this.createConnection(requestData, userId);
                    res.status(HttpStatusCode.CREATED).send(Connection);
                } catch (err) {
                    throw err;
                }
            },
        );

        return this.app;
    }

    async createConnection(connection: ConnectionInput, userId: number): Promise<Connection> {
        try {
            const createdConnection: Connection = await this.connectionService.createConnection(connection, userId);
            return createdConnection;
        } catch (err) {
            throw err;
        }
    }
}

export default ConnectionController;
