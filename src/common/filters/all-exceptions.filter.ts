import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations like when starting up the server, the HttpAdapter might not be available yet
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

    // Extract valuable information from the request
    const { method, url, body, headers } = request;
    const requestInfo = {
      method,
      url,
      body,
      headers: { ...headers },
    };

    // Prepare sensitive headers to be redacted
    if (requestInfo.headers.authorization) {
      requestInfo.headers.authorization = 'REDACTED';
    }

    // Determine the HTTP status code
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Prepare the error response
    let errorResponse: any;
    if (exception instanceof HttpException) {
      // For HTTP exceptions, use the existing response structure
      errorResponse = exception.getResponse();
    } else if (exception instanceof Error) {
      // For standard errors, format nicely
      errorResponse = {
        message: exception.message,
        name: exception.name,
      };

      // In development, include the stack trace
      if (process.env.NODE_ENV !== 'production') {
        errorResponse.stack = exception.stack;
      }
    } else {
      // For non-Error exceptions
      errorResponse = {
        message: 'Internal server error',
      };
    }

    // Always ensure a formatted response object
    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(typeof errorResponse === 'object'
        ? errorResponse
        : { message: errorResponse }),
    };

    // Log the error with appropriate level based on severity
    if (httpStatus >= 500) {
      this.logger.error(
        `${method} ${url} ${httpStatus}`,
        JSON.stringify({
          request: requestInfo,
          exception: exception instanceof Error ? exception.stack : exception,
        }),
      );
    } else {
      this.logger.warn(
        `${method} ${url} ${httpStatus}`,
        JSON.stringify({
          request: requestInfo,
          response: responseBody,
        }),
      );
    }

    // Send the response to the client
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}