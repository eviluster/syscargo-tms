import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import logger from '../../logging/winston.config';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request: Request = context.switchToHttp().getRequest();
    const { method, url, ip, headers } = request;
    const user = request.user as any;
    const timestamp = new Date().toISOString();

    // Extraer información relevante del request
    const logData = {
      timestamp,
      method,
      url,
      ip,
      userAgent: headers['user-agent'],
      userId: user?.id || null,
      userEmail: user?.email || null,
      userRole: user?.role?.name || null,
      body: request.body ? this.sanitizeBody(request.body) : null,
      query: request.query || null,
    };

    // Log del request
    logger.info('Incoming request', logData);

    return next.handle().pipe(
      tap({
        next: (response) => {
          logger.info('Request completed', {
            ...logData,
            status: 'success',
            responseTime: Date.now() - new Date(timestamp).getTime() + 'ms',
          });
        },
        error: (error) => {
          logger.error('Request failed', {
            ...logData,
            status: 'error',
            errorMessage: error.message,
            errorStack: error.stack,
          });
        },
      }),
    );
  }

  private sanitizeBody(body: any): any {
    // Remover información sensible del body antes de loguear
    const sanitized = { ...body };
    const sensitiveFields = ['password', 'hash', 'token', 'secret', 'apiKey'];
    
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  }
}