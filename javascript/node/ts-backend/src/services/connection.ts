import express from 'express';
import { Repository } from 'typeorm';
import { ConnectionEntity } from '../entity/connection';
import { Connection, ConnectionInput } from '../types/connection';

class ConnectionService {
    connectionRepository: Repository<ConnectionEntity>;

    constructor(app: express.Application) {
        this.connectionRepository = app.get('db').getRepository(ConnectionEntity);
    }

    async createConnection(connection: ConnectionInput, userId: number): Promise<Connection> {
        try {
            const createdConnection = await this.connectionRepository.save({ ...connection, createdBy: userId });
            return createdConnection;
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
