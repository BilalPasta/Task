import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WinstonConfigService } from '../config/winston.config';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private winstonLogger;

  constructor(private winstonConfigService: WinstonConfigService) {
    this.winstonLogger = this.winstonConfigService.createLogger();
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const now = Date.now();

    return next.handle().pipe(
      tap((data) => {
        this.winstonLogger.info(`${req.method} ${req.url}`, {
          body: req.body,
          query: req.query,
          params: req.params,
          headers: req.headers,
          responseTime: `${Date.now() - now}ms`,
          response: data, // Logging the response body
        });
      }),
    );
  }
}
