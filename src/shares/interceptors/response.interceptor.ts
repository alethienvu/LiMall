import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getConfig } from 'src/configs';

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
        metadata.apiName = getConfig().get<string>('app.name');
        metadata.apiVersion = getConfig().get<string>('app.prefix');

        if (data?.data?.length || data?.length) {
          metadata.length = data?.data?.length || data?.length;
        }
        delete data.metadata;
        return {
          data: data.data || data,
          metadata: metadata,
        };
      }),
    );
  }
}
