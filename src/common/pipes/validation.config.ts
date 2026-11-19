import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export interface FieldValidationError {
  field: string;
  messages: string[];
}

export function flattenValidationErrors(
  errors: ValidationError[],
  parentPath = '',
): FieldValidationError[] {
  const result: FieldValidationError[] = [];

  for (const err of errors) {
    const fieldPath = parentPath
      ? `${parentPath}.${err.property}`
      : err.property;

    if (err.constraints) {
      result.push({
        field: fieldPath,
        messages: Object.values(err.constraints),
      });
    }

    if (err.children?.length) {
      result.push(...flattenValidationErrors(err.children, fieldPath));
    }
  }

  return result;
}

export function createAppValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (validationErrors: ValidationError[]) =>
      new BadRequestException({
        statusCode: 400,
        error: 'Bad Request',
        code: 'VALIDATION_ERROR',
        message: 'Validation failed for one or more fields',
        errors: flattenValidationErrors(validationErrors),
      }),
  });
}
