import { DatabaseError } from 'pg-protocol';
import { QueryFailedError } from 'typeorm';
import * as PgErrorCodes from '@drdgvhbh/postgres-error-codes';
import HttpStatusCode from '../types/http-status';

enum PostgresErrorMessage {
  GENERIC = 'Database error',
}

class PostgresError extends Error {
  statusCode: number;

  constructor(msg: string = PostgresErrorMessage.GENERIC, statusCode: number) {
    super(msg);
    Object.setPrototypeOf(this, PostgresError.prototype);
    this.statusCode = statusCode;
  }
}

// todo: set error message
const handlePostgresError = (error: QueryFailedError): PostgresError => {
  let errorCode: HttpStatusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
  const err = error.driverError as DatabaseError;

  if (err.code === PgErrorCodes.PG_UNIQUE_VIOLATION) {
    errorCode = HttpStatusCode.CONFLICT;
  }
  if (err.code === PgErrorCodes.PG_FOREIGN_KEY_VIOLATION) {
    errorCode = HttpStatusCode.CONFLICT;
  }

  return new PostgresError(err.detail, errorCode);
};

export { handlePostgresError, PostgresError };
