import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        const isGetRequest = request.method === 'GET';

        const responseData = {
          statusCode: response.statusCode,
          timestamp: new Date().toISOString(),
        };

        if (
          isGetRequest &&
          data &&
          data.hasOwnProperty('totalCount') &&
          data.hasOwnProperty('items')
        ) {
          const skip = Number(request.query.skip) || 0;
          const take = Number(request.query.take) || 10;

          responseData['data'] = data.items;
          responseData['meta'] = {
            totalCount: data.totalCount,
            currentPage: Math.floor(skip / take) + 1, // Calculate current page from skip and take
            itemsPerPage: take,
          };
        } else {
          responseData['data'] = data;
        }

        return responseData;
      }),
    );
  }
}
