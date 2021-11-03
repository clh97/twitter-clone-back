import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import HttpStatusCode from "../types/http-status";

function verifyJWT(req: Request, res: Response, next: NextFunction): void {
    let token = String(req.headers["x-access-token"]);
    if (!token) {
        res.status(400).send({ auth: false, message: "No token provided." });
    }
    jwt.verify(token, process.env.SECRET || "", function (err: Error): void {
        if (err) {
            res
                .status(401)
                .send({ auth: false, message: "Failed to authenticate token." });
        }
        next();
    });
}

function decodeTokenMiddleware(req: Request, res: Response, next: NextFunction): void {
    try {
        const token = String(req.headers["x-access-token"]);
        const decodedToken = jwt.decode(token);

        if (!decodedToken) {
            throw Error('Authentication not supplied');
        }

        req.decodedToken = decodedToken;
        req.authenticated = true;
        next();
    } catch (err) {
        req.authenticated = false;
        next();
    }
}

function authenticatedRequest(req: Request, res: Response, next: NextFunction): void {
    if(!req.authenticated) {
        res.status(HttpStatusCode.UNAUTHORIZED).send();
        return;
    }
    next();
}

export { verifyJWT, decodeTokenMiddleware, authenticatedRequest };