import {
  BadRequestException,
  ConflictException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

interface PgErrorLike {
  code?: string;
  detail?: string;
  driverError?: {
    code?: string;
    detail?: string;
  };
}

function extractPgCode(err: unknown): string | undefined {
  if (!err || typeof err !== 'object') return undefined;
  const e = err as PgErrorLike;
  return e.code ?? e.driverError?.code;
}

function extractPgDetail(err: unknown): string | undefined {
  if (!err || typeof err !== 'object') return undefined;
  const e = err as PgErrorLike;
  return e.detail ?? e.driverError?.detail;
}

export const Exceptions = {
  uniqueConflict(resource: string): ConflictException {
    return new ConflictException(`${resource} could not be created`);
  },

  alreadyExists(resource: string, field: string): ConflictException {
    return new ConflictException(
      `${resource} with this ${field} already exists`,
    );
  },

  notFound(resource: string, identifier?: string | number): NotFoundException {
    const message =
      identifier !== undefined
        ? `${resource} with ID ${identifier} not found`
        : `${resource} not found`;

    return new NotFoundException(message);
  },

  getErrorDetails(err: unknown): string {
    if (err instanceof Error) {
      return err.stack ?? err.message;
    }
    if (typeof err === 'string') {
      return err;
    }
    try {
      return JSON.stringify(err) ?? 'Unknown error';
    } catch {
      return 'Unable to serialize error details';
    }
  },

  toHttpException(err: unknown, resource = 'Resource'): HttpException {
    if (err instanceof HttpException) {
      return err;
    }

    const code = extractPgCode(err);
    const detail = extractPgDetail(err);

    // 23505 = unique_violation in PostgreSQL
    if (code === '23505') {
      const emailMatch = detail?.match(/\(([^)]{1,254})\)=\(([^)]{1,254})\)/);
      const field = emailMatch?.[1] ?? 'field';
      const value = emailMatch?.[2];

      return new ConflictException({
        statusCode: 409,
        error: 'Conflict',
        message: value
          ? `${resource} with ${field} "${value}" already exists`
          : `${resource} with this ${field} already exists`,
        code: 'DUPLICATE_RECORD',
        field,
        ...(value ? { conflictValue: value } : {}),
      });
    }

    // 23502 = not_null_violation, 22P02 = invalid_text_representation
    if (code === '23502' || code === '22P02') {
      return new BadRequestException({
        statusCode: 400,
        error: 'Bad Request',
        message: `Invalid ${resource.toLowerCase()} data provided`,
        code: 'INVALID_DATA',
      });
    }

    return new InternalServerErrorException({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'Unable to process your request. Please try again later',
    });
  },
};