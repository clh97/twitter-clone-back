import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import HttpStatusCode from '../types/http-status';

function authenticatedRequest(req: Request, res: Response, next: NextFunction): void {
  if (!req.authenticated) {
    res.status(HttpStatusCode.UNAUTHORIZED).send();
    return;
  }
  next();
}

function decodeTokenMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {
    const token = String(req.headers['x-access-token']);
    const decodedToken = jwt.decode(token);

    if (!decodedToken) {
      throw Error('Authentication not supplied');
    }

    req.decodedToken = decodedToken;
    req.authenticated = true;
  } catch (err) {
    req.authenticated = false;
  } finally {
    next();
  }
}

export { decodeTokenMiddleware, authenticatedRequest };
