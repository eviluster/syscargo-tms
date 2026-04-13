import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

// Palabras clave SQL comunes para detectar inyección
const SQL_KEYWORDS = [
  'SELECT',
  'INSERT',
  'UPDATE',
  'DELETE',
  'DROP',
  'ALTER',
  'CREATE',
  'TRUNCATE',
  'EXEC',
  'UNION',
  '--',
  ';',
  ' OR ',
  ' AND ',
  '/*',
  '*/',
  '@@',
  '@',
  'CHAR',
  'NCHAR',
  'VARCHAR',
  'NVARCHAR',
  'CAST',
  'CONVERT',
];

function containsSQLInjection(value: string): boolean {
  const upperValue = value.toUpperCase();
  return SQL_KEYWORDS.some((keyword) => upperValue.includes(keyword));
}

function checkForSQLInjection(data: any, path = ''): void {
  if (typeof data === 'string') {
    if (containsSQLInjection(data)) {
      throw new BadRequestException(
        `Posible inyección SQL detectada en el campo${path ? ' ' + path : ''}`,
      );
    }
  } else if (typeof data === 'object' && data !== null) {
    Object.keys(data).forEach((key) => {
      checkForSQLInjection(data[key], path ? `${path}.${key}` : key);
    });
  }
}

@Injectable()
export class SqlInjectionInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request: Request = context.switchToHttp().getRequest();
    const { body } = request;
    if (body && Object.keys(body).length) {
      checkForSQLInjection(body);
    }
    return next.handle();
  }
}
