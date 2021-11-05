import { DatabaseError } from 'pg-protocol';
import generateError from '.';
import HttpStatusCode from '../types/http-status';
import HttpError from './http-error';

const PG_UNIQUE_CONSTRAINT_VIOLATION = '23505';

enum DatabaseErrorMessage {
    ENTITY_ALREADY_EXISTS = 'Entity already exists',
    ENTITY_NOT_FOUND = 'Entity not found',
    UNKNOWN_ERROR = 'Unknown error',
}

const databaseErrorHandler = (error: DatabaseError): HttpError => {
    switch (error.code) {
        case PG_UNIQUE_CONSTRAINT_VIOLATION:
            return generateError({
                error,
                message: DatabaseErrorMessage.ENTITY_ALREADY_EXISTS,
                detail: error.detail,
                httpCode: HttpStatusCode.CONFLICT,
            });

        default:
            return generateError({
                error,
                message: DatabaseErrorMessage.UNKNOWN_ERROR,
                httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
            });
    }
};

export { databaseErrorHandler, DatabaseErrorMessage };
