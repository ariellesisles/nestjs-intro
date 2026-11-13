import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

export const Exceptions = {
  uniqueConflict(resource: string): ConflictException {
    // Generic on purpose — avoids enumeration
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
};
