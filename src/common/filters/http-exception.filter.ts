import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { WinstonConfigService } from '../config/winston.config';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private winstonLogger;

  constructor(private winstonConfigService: WinstonConfigService) {
    this.winstonLogger = this.winstonConfigService.createLogger();
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const error =
      typeof exceptionResponse === 'string'
        ? { message: exceptionResponse }
        : (exceptionResponse as any);

    // Log request and exception details
    this.winstonLogger.error('HTTP Exception', {
      message: error.message || 'Internal server error',
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      body: request.body,
      query: request.query,
      params: request.params,
      headers: request.headers,
      stack: exception.stack,
      response: error, // Logging the response body
    });

    // Send response to the client
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: error.message || 'Internal server error',
      ...(error.errors && { errors: error.errors }),
    });
  }
}
