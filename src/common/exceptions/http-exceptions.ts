import {
  ConflictException,
  InternalServerErrorException,
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

  unexpected(): InternalServerErrorException {
    return new InternalServerErrorException(
      'Unable to process your request. Please try again later.',
    );
  },
} as const;
