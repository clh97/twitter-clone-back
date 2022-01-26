import { Request, Response, NextFunction, RequestHandler } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { sanitize } from 'class-sanitizer';
import HttpStatusCode from '../types/http-status';

type Constructor<T> = { new (): T };
type GenericObject = { [key: string]: any };

function classValidatorMiddleware<T>(type: Constructor<T>): RequestHandler {
    return (req, res, next) => {
        const inputObject: any = plainToClass(type, req.body);
        validate(inputObject, { skipMissingProperties: false }).then((errors: ValidationError[]) => {
            if (errors.length > 0) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ validationErrors: errors });
                next();
            } else {
                sanitize(inputObject);
                req.body = JSON.stringify(inputObject);
                next();
            }
        });
    };
}

function validationError(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof Array && err[0] instanceof ValidationError) {
        res.status(400).json({ errors: err }).end();
    } else {
        next(err);
    }
}

export { classValidatorMiddleware, validationError };
