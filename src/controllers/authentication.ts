import express from 'express';
import { QueryFailedError } from 'typeorm';
import { JwtPayload } from 'jsonwebtoken';
import RouteConfig from './RouteConfig';
import HttpStatusCode from '../types/http-status';
import AuthenticationService from '../services/authentication';
import { PublicUser, UserCreateInput, UserLoginInput, UserLoginOutput, UserUpdateInput } from '../types/user';
import { classValidatorMiddleware } from '../utils/classValidator';
import { PostgresError, handlePostgresError } from '../errors/typeorm';
import { authenticatedRequest } from '../utils/jwt';
import { AuthenticationErrors } from '../errors/authentication';

class AuthenticationController extends RouteConfig {
  prefix = 'authentication';
  authenticationService: AuthenticationService;

  constructor(app: express.Application) {
    super(app, 'AuthenticationController');
    this.authenticationService = new AuthenticationService(this.app);
    this.configureRoutes();
  }

  configureRoutes() {
    // create user
    this.app.post(
      `/${this.prefix}`,
      [classValidatorMiddleware(UserCreateInput)],
      async (req: express.Request, res: express.Response) => {
        const requestData = req.body;
        try {
          const user: UserCreateInput = { ...requestData };
          console.log(user);
          const createdUser: PublicUser = await this.createUser(user);
          res.status(HttpStatusCode.CREATED).send({ createdUser });
        } catch (err) {
          const errorMessage = { error: err.message };
          if (err instanceof QueryFailedError) {
            const error: PostgresError = handlePostgresError(err);
            res.status(error.statusCode).send({ error: error.message });
            throw error;
          }
          res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(errorMessage);
          throw err;
        }
      },
    );

    // read user by id
    this.app.get(`/${this.prefix}/:id`, [authenticatedRequest], async (req: express.Request, res: express.Response) => {
      try {
        const id = parseInt(req.params.id as string);
        const user: PublicUser = await this.readUser(id);
        res.status(HttpStatusCode.OK).send({
          user,
        });
      } catch (err) {
        const errorMessage = { error: err.message };
        if (err instanceof QueryFailedError) {
          const error: PostgresError = handlePostgresError(err);
          res.status(error.statusCode).send({ error: error.message });
          throw error;
        }
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(errorMessage);
        throw err;
      }
    });

    // update user by id
    this.app.patch(
      `/${this.prefix}`,
      [authenticatedRequest, classValidatorMiddleware(UserUpdateInput)],
      async (req: express.Request, res: express.Response) => {
        try {
          const jwtPayload: JwtPayload = req.decodedToken as JwtPayload;
          const userId: number = jwtPayload.id;
          const requestData = req.body;
          const user: UserUpdateInput = { ...requestData };
          const updatedUser = await this.updateUser(userId, user);
          res.status(HttpStatusCode.OK).send({
            updatedUser,
          });
        } catch (err) {
          const errorMessage = { error: err.message };
          if (err instanceof QueryFailedError) {
            const error: PostgresError = handlePostgresError(err);
            res.status(error.statusCode).send({ error: error.message });
            throw error;
          }
          res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(errorMessage);
          throw err;
        }
      },
    );

    // delete user by id
    this.app.delete(`/${this.prefix}`, [authenticatedRequest], async (req: express.Request, res: express.Response) => {
      try {
        const jwtPayload: JwtPayload = req.decodedToken as JwtPayload;
        const userId: number = jwtPayload.id;
        const deletedUser = this.deleteUser(userId);
        res.status(HttpStatusCode.OK).send({
          deletedUser,
        });
      } catch (err) {
        const errorMessage = { error: err.message };
        if (err instanceof QueryFailedError) {
          const error: PostgresError = handlePostgresError(err);
          res.status(error.statusCode).send({ error: error.message });
          throw error;
        }
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(errorMessage);
        throw err;
      }
    });

    // login user
    this.app.post(
      `/${this.prefix}/login`,
      classValidatorMiddleware(UserLoginInput),
      async (req: express.Request, res: express.Response) => {
        const requestData = req.body;
        try {
          const user: UserLoginInput = { ...requestData };
          const result: UserLoginOutput = await this.login(user);
          res.status(HttpStatusCode.OK).send({ result });
        } catch (err) {
          const errorMessage = { error: err.message };

          if (err instanceof AuthenticationErrors.AuthenticationError) {
            res.status(HttpStatusCode.UNAUTHORIZED).send(errorMessage);
            throw err;
          }

          if (err instanceof QueryFailedError) {
            const error: PostgresError = handlePostgresError(err);
            res.status(error.statusCode).send({ error: error.message });
            throw error;
          }
          res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(errorMessage);
          throw err;
        }
      },
    );

    return this.app;
  }

  async createUser(user: UserCreateInput): Promise<PublicUser> {
    try {
      const createdUser: PublicUser = await this.authenticationService.createUser(user);
      return createdUser;
    } catch (err) {
      throw err;
    }
  }

  async readUser(id: number): Promise<PublicUser> {
    try {
      const foundUser: PublicUser = await this.authenticationService.readUser(id);
      return foundUser;
    } catch (err) {
      throw err;
    }
  }

  async updateUser(id: number, user: UserUpdateInput): Promise<PublicUser> {
    try {
      const updatedUser: PublicUser = await this.authenticationService.updateUser(id, user);
      return updatedUser;
    } catch (err) {
      throw err;
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      const deleted = await this.authenticationService.deleteUser(id);
      return deleted;
    } catch (err) {
      throw err;
    }
  }

  async login(user: UserLoginInput): Promise<UserLoginOutput> {
    try {
      const result = await this.authenticationService.authenticateUser(user);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

export default AuthenticationController;
