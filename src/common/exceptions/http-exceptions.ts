import {
  ConflictException,
  InternalServerErrorException,
  Logger,
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

  notFound(resource: string): NotFoundException {
    return new NotFoundException(`${resource} not found`);
  },

  unexpected(logger: Logger, err: unknown): InternalServerErrorException {
    logger.error('An unexpected error occurred', this.getErrorDetails(err));

    return new InternalServerErrorException(
      'Unable to process your request. Please try again later.',
    );
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
