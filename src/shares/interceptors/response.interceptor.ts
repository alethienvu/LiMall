import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  metadata: Record<string, unknown>;
}
@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((_data) => {
        // @Exclude sensitive data
        const data = instanceToPlain(_data);
        const metadata = {
          ...data.metadata,
        };
        delete data.metadata;
        return {
          data: data.data || data,
          metadata: metadata,
        };
      }),
    );
  }
}
