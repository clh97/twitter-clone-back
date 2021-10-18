import express from 'express';
import * as uuid from 'uuid';
import RouteConfig from './RouteConfig';
import { PublicUser, UserCreateInput, UserUpdateInput } from '../types/user';

class AuthenticationController extends RouteConfig {
    prefix = 'authentication';

    constructor(app: express.Application) {
        super(app, 'AuthenticationController');
        this.configureRoutes();
    }

    configureRoutes() {
        // create user
        this.app.post(`/${this.prefix}`, (req, res) => {
            const requestData = req.body;
            try {
                const user: UserCreateInput = { ...requestData };
                const userId = this.createUser(user);
                res.status(201).send({
                    userId,
                });
            } catch (err) {
                res.status(500).send({
                    error: err.message,
                });
            }
        });

        // read user by id
        this.app.get(`/${this.prefix}/:id`, (req, res) => {
            try {
                const id = parseInt(req.query.id as string);
                const user = this.readUser(id);
                res.status(201).send({
                    user,
                });
            } catch (err) {
                res.status(500).send({
                    error: err.message,
                });
            }
        });

        // update user by id
        this.app.patch(`/${this.prefix}/:id`, (req, res) => {
            try {
                const id = parseInt(req.query.id as string);
                const requestData = req.body;
                const user: UserUpdateInput = { ...requestData };
                const updatedUser = this.updateUser(id, user);
                res.status(200).send({
                    updatedUser,
                });
            } catch (err) {
                res.status(500).send({
                    error: err.message,
                });
            }
        });

        // delete user by id
        this.app.delete(`/${this.prefix}/:id`, (req, res) => {
            try {
                const id = parseInt(req.query.id as string);
                const deletedUser = this.deleteUser(id);
                res.status(200).send({
                    deletedUser,
                });
            } catch (err) {
                res.status(500).send({
                    error: err.message,
                });
            }
        });

        return this.app;
    }

    createUser(user: UserCreateInput): number {
        console.log(user);
        return 1;
    }

    readUser(id: number): PublicUser {
        return {
            username: 'a',
            email: 'a',
            birthdate: new Date(),
            uuid: uuid.v4(),
        };
    }

    updateUser(id: number, user: UserUpdateInput): PublicUser {
        return {
            username: 'b',
            email: 'b',
            birthdate: new Date(),
            uuid: uuid.v4(),
        };
    }

    deleteUser(id: number): boolean {
        return false;
    }
}

export default AuthenticationController;
