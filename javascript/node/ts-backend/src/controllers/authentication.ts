import express from 'express';
import RouteConfig from './RouteConfig';
import AuthenticationService from '../services/authentication';
import { PublicUser, UserCreateInput, UserUpdateInput } from '../types/user';

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
        this.app.post(`/${this.prefix}`, async (req, res) => {
            const requestData = req.body;
            try {
                const user: UserCreateInput = { ...requestData };
                const createdUser: PublicUser = await this.createUser(user);
                res.status(201).send({ createdUser });
            } catch (err) {
                res.status(err.httpCode).send({
                    error: err.message,
                });
            }
        });

        // read user by id
        this.app.get(`/${this.prefix}/:id`, async (req, res) => {
            try {
                const id = parseInt(req.params.id as string);
                const user: PublicUser = await this.readUser(id);
                res.status(200).send({
                    user,
                });
            } catch (err) {
                res.status(err.httpCode).send({
                    error: err.message,
                });
            }
        });

        // update user by id
        this.app.patch(`/${this.prefix}/:id`, async (req, res) => {
            try {
                const id = parseInt(req.params.id as string);
                const requestData = req.body;
                const user: UserUpdateInput = { ...requestData };
                const updatedUser = await this.updateUser(id, user);
                res.status(200).send({
                    updatedUser,
                });
            } catch (err) {
                console.log('error at controller', err);
                res.status(err.httpCode).send({
                    error: err.message,
                    detail: err.detail,
                });
            }
        });

        // delete user by id
        this.app.delete(`/${this.prefix}/:id`, async (req, res) => {
            try {
                const id = parseInt(req.query.id as string);
                const deletedUser = this.deleteUser(id);
                res.status(200).send({
                    deletedUser,
                });
            } catch (err) {
                res.status(err.statusCode).send({
                    error: err.message,
                });
            }
        });

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
        return false;
    }
}

export default AuthenticationController;
