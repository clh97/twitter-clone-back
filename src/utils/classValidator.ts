import { Request, Response, NextFunction, RequestHandler } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { sanitize } from 'class-sanitizer';

import HttpStatusCode from '../types/http-status';

type Constructor<T> = { new (): T };

function classValidatorMiddleware<T>(type: Constructor<T>): RequestHandler {
  return (req, res, next) => {
    const inputObject: any = plainToClass(type, req.body);
    validate(inputObject, { skipMissingProperties: false }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const { validationErrorsHTML, validationErrorsHuman, validationErrors } = getValidationErrorMessages(errors);

        res.status(HttpStatusCode.BAD_REQUEST).json({
          validationErrorsHTML,
          validationErrorsHuman,
          validationErrors,
        });

        next();
      } else {
        // if there are no validation errors, sanitize input and continue to the controller
        sanitize(inputObject);
        req.body = inputObject;
        next();
      }
    });
  };
}

type UnprocessedValidationErrors = {
  [key: string]: string[];
};

const getValidationErrorMessages = (errors: ValidationError[]) => {
  const unprocessedErrors: UnprocessedValidationErrors = errors.reduce((acc, cur) => {
    return {
      ...acc,
      [cur.property]: Object.keys(cur.constraints).map((ck) => cur.constraints[ck]),
    };
  }, {});
  const validationErrorsHTML = Object.keys(unprocessedErrors)
    .map(
      (key: string) =>
        `&bull; ${key}:\r\n${unprocessedErrors[key].map((text: string) => `&emsp;&#10060; ${text}`).join('\r\n')}`,
    )
    .join('\r\n');

  const validationErrorsHuman = Object.keys(unprocessedErrors)
    .map((key: string) => `${key.toUpperCase()}: ${unprocessedErrors[key].map((text: string) => `${text}`).join(', ')}`)
    .join('\r\n');

  const validationErrors = errors;

  return {
    validationErrorsHTML,
    validationErrorsHuman,
    validationErrors,
  };
};

function validationError(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof Array && err[0] instanceof ValidationError) {
    res.status(400).json({ errors: err });
    next();
  } else {
    next(err);
  }
}

export { classValidatorMiddleware, validationError };
