import { DatabaseError } from 'pg-protocol';
import HttpStatusCode from '../types/http-status';
import HttpError from './http-error';

const PG_UNIQUE_CONSTRAINT_VIOLATION = '23505';

const databaseErrorHandler = (error: DatabaseError): HttpError => {
    switch (error.code) {
        case PG_UNIQUE_CONSTRAINT_VIOLATION:
            return {
                error: error,
                message: error.detail,
                httpCode: HttpStatusCode.CONFLICT,
            };

        default:
            return {
                error: error,
                message: `Unknown error - ${error.detail}`,
                httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
            };
    }
};

export { databaseErrorHandler };
