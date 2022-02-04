import express from 'express';
import { LessThanOrEqual, Repository } from 'typeorm';
import { ConnectionEntity } from '../entity/connection';
import { Connection, ConnectionInput } from '../types/connection';
import { ConnectionErrors } from '../errors/connection';

class ConnectionService {
  connectionRepository: Repository<ConnectionEntity>;

  constructor(app: express.Application) {
    this.connectionRepository = app.get('db').getRepository(ConnectionEntity);
  }

  async follow(connection: ConnectionInput, userId: number): Promise<Connection> {
    try {
      if (connection.userId == userId) {
        throw new ConnectionErrors.SelfConnectionError();
      }

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
      throw err;
    }
  }

  async unfollow(connection: ConnectionInput, userId: number): Promise<Connection> {
    try {
      if (connection.userId == userId) {
        throw new ConnectionErrors.SelfConnectionError();
      }

      const followingUser = await this.connectionRepository.findOne({
        where: {
          from: userId,
          to: connection.userId,
          createdBy: userId,
        },
      });

      if (!followingUser) {
        throw new ConnectionErrors.NotFollowingError();
      }

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

  async getFollowing(userId: number, limit: number, cursor: number): Promise<Connection[]> {
    try {
      if (!cursor) {
        const [followerList] = await this.connectionRepository.findAndCount({
          relations: ['to'],
          where: { from: userId },
          take: limit,
        });
        return followerList;
      }

      const [followerList] = await this.connectionRepository.findAndCount({
        relations: ['to'],
        where: { from: userId, id: LessThanOrEqual(cursor) },
        take: limit,
      });
      return followerList;
    } catch (err) {
      throw err;
    }
  }

  async getFollowers(userId: number, limit: number, cursor: number): Promise<Connection[]> {
    try {
      if (!cursor) {
        const [followerList] = await this.connectionRepository.findAndCount({
          relations: ['from'],
          where: { to: userId },
          take: limit,
        });
        return followerList;
      }

      const [followerList] = await this.connectionRepository.findAndCount({
        relations: ['from'],
        where: { to: userId, id: LessThanOrEqual(cursor) },
        take: limit,
      });
      return followerList;
    } catch (err) {
      throw err;
    }
  }
}

export default ConnectionService;
