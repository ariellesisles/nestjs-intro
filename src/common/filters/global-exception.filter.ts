import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  /**
   * Handles application-wide exceptions and foprmat HTTP error response
   * @param exception Type of exeption that encountered during request processing
   * @param host Provides access  to the current execution context
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] =
      'Unable to process your request. Please try again later';
    let errorName = 'Internal Server Error';
    let extraPayload: Record<string, unknown> = {};

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
        errorName = exception.name;
      } else if (typeof res === 'object' && res !== null) {
        const body = res as Record<string, unknown>;
        message = (body.message as string | string[]) ?? exception.message;
        errorName = (body.error as string) ?? exception.name;

        // Preserve custom fields like `code`, `field`, `conflictValue`, `conflicts`
        const { statusCode: _s, message: _m, error: _e, ...rest } = body;
        extraPayload = rest;
      }
    } else if (exception instanceof Error) {
      this.logger.error(
        `Unhandled error on ${request.method} ${request.url}: ${exception.message}`,
        exception.stack,
      );
    }

    // Log 4xx/5xx details to terminal so you can see validation & conflict reasons
    const formattedMessage = Array.isArray(message)
      ? message.join('; ')
      : message;

    if (status >= 500) {
      this.logger.error(
        `[${status}] ${request.method} ${request.url} -> ${formattedMessage}`,
      );
    } else {
      this.logger.warn(
        `[${status}] ${request.method} ${request.url} -> ${formattedMessage}`,
      );
    }

    response.status(status).json({
      statusCode: status,
      error: errorName,
      message,
      ...extraPayload,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
