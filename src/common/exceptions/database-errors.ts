import { QueryFailedError } from 'typeorm';

/**
 * Postgres error codes we care about.
 * @see https://www.postgresql.org/docs/current/errcodes-appendix.html
 */
export enum PostgresErrorCode {
  UNIQUE_VIOLATION = '23505',
  FOREIGN_KEY_VIOLATION = '23503',
  NOT_NULL_VIOLATION = '23502',
  CHECK_VIOLATION = '23514',
  EXCLUSION_VIOLATION = '23P01',
  SERIALIZATION_FAILURE = '40001',
  DEADLOCK_DETECTED = '40P01',
}

type QueryFailedErrorWithCode = QueryFailedError & {
  driverError?: { code?: string; constraint?: string };
};

/**
 * Returns true if the error is a Postgres unique constraint violation.
 * Optionally narrow by constraint name (e.g. 'UQ_user_email').
 */
export function isUniqueViolation(err: unknown, constraint?: string): boolean {
  if (!(err instanceof QueryFailedError)) return false;

  const driverError = (err as QueryFailedErrorWithCode).driverError;
  if (driverError?.code !== PostgresErrorCode.UNIQUE_VIOLATION) return false;

  // If caller wants a specific constraint, enforce it
  if (constraint && driverError.constraint !== constraint) return false;

  return true;
}

export function isForeignKeyViolation(err: unknown): boolean {
  return (
    err instanceof QueryFailedError &&
    (err as QueryFailedErrorWithCode).driverError?.code ===
      PostgresErrorCode.FOREIGN_KEY_VIOLATION
  );
}

export function isDeadlock(err: unknown): boolean {
  return (
    err instanceof QueryFailedError &&
    (err as QueryFailedErrorWithCode).driverError?.code ===
      PostgresErrorCode.DEADLOCK_DETECTED
  );
}

export function isSerializationFailure(err: unknown): boolean {
  return (
    err instanceof QueryFailedError &&
    (err as QueryFailedErrorWithCode).driverError?.code ===
      PostgresErrorCode.SERIALIZATION_FAILURE
  );
}
