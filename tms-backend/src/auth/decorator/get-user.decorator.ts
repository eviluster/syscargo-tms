import {
  ConflictException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { User } from '../../user/entities/user.entity';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    if (data) {
      return request.user[data];
    }
    // otherwise continue
    return request.user;
  },
);

export const GetUserAdmin = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    const user: Partial<User> = request.user;

    if (
      (user && user.role.id === '792e024b-f781-4f39-ba6a-2445fc1db712') || // Administrador
      (user && user.role.id === '04926be1-db39-4456-91ed-808c490725cc')
    ) {
      // Propietario
      return user;
    } else {
      throw new ConflictException(
        'El usuario no tiene permisos para ejecutar esta acción',
      );
    }
  },
);

export const GetUserComercial = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    const user: Partial<User> = request.user;

    if (
      (user && user.role.id === '792e024b-f781-4f39-ba6a-2445fc1db712') || // Administrador
      (user && user.role.id === 'cc42a0e2-f339-495b-b147-ab1e53cbdf7d') || // Comercial
      (user && user.role.id === '04926be1-db39-4456-91ed-808c490725cc')
    ) {
      // Propietario
      return user;
    } else {
      throw new ConflictException(
        'El usuario no tiene permisos para ejecutar esta acción',
      );
    }
  },
);
export const GetUserEconComercial = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    const user: Partial<User> = request.user;

    if (
      (user && user.role.id === '792e024b-f781-4f39-ba6a-2445fc1db712') || // Administrador
      (user && user.role.id === '31007a7f-b624-4bf9-b4d4-a296c46e083d') || // Economico
      (user && user.role.id === 'cc42a0e2-f339-495b-b147-ab1e53cbdf7d') || // Comercial
      (user && user.role.id === '04926be1-db39-4456-91ed-808c490725cc')
    ) {
      // Propietario
      return user;
    } else {
      throw new ConflictException(
        'El usuario no tiene permisos para ejecutar esta acción',
      );
    }
  },
);

export const GetUserEconomico = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    const user: Partial<User> = request.user;

    if (
      (user && user.role.id === '792e024b-f781-4f39-ba6a-2445fc1db712') || // Administrador
      (user && user.role.id === '31007a7f-b624-4bf9-b4d4-a296c46e083d') || // Economico
      (user && user.role.id === '04926be1-db39-4456-91ed-808c490725cc')
    ) {
      // Propietario
      return user;
    } else {
      throw new ConflictException(
        'El usuario no tiene permisos para ejecutar esta acción',
      );
    }
  },
);

export const GetUserServices = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    const user: Partial<User> = request.user;

    if (
      (user && user.role.id === '792e024b-f781-4f39-ba6a-2445fc1db712') || // Administrador
      (user && user.role.id === '1e829090-3f35-4d72-a79c-1611000c9d5e') || // Services
      (user && user.role.id === '04926be1-db39-4456-91ed-808c490725cc')
    ) {
      // Propietario
      return user;
    } else {
      throw new ConflictException(
        'El usuario no tiene permisos para ejecutar esta acción',
      );
    }
  },
);

export const GetUserClient = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    const user: Partial<User> = request.user;

    if (
      (user && user.role.id === '792e024b-f781-4f39-ba6a-2445fc1db712') || // Administrador
      (user && user.role.id === '79beb28a-a469-49eb-bda1-ae1c5e4a9261') || // Cliente
      (user && user.role.id === '04926be1-db39-4456-91ed-808c490725cc')
    ) {
      // Propietario
      return user;
    } else {
      throw new ConflictException(
        'El usuario no tiene permisos para ejecutar esta acción',
      );
    }
  },
);

export const GetUserCalendar = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    const user: Partial<User> = request.user;

    if (
      (user && user.role.id === '792e024b-f781-4f39-ba6a-2445fc1db712') || // Administrador
      (user && user.role.id === '1e829090-3f35-4d72-a79c-1611000c9d5e') || // Services
      (user && user.role.id === 'cc42a0e2-f339-495b-b147-ab1e53cbdf7d') || // Comercial
      (user && user.role.id === '04926be1-db39-4456-91ed-808c490725cc')
    ) {
      // Propietario
      return user;
    } else {
      throw new ConflictException(
        'El usuario no tiene permisos para ejecutar esta acción',
      );
    }
  },
);

export const GetUserBussiness = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    const user: Partial<User> = request.user;

    if (
      (user && user.role.id === '792e024b-f781-4f39-ba6a-2445fc1db712') || // Administrador
      (user && user.role.id === 'cc42a0e2-f339-495b-b147-ab1e53cbdf7d') || // Comercial
      (user && user.role.id === '04926be1-db39-4456-91ed-808c490725cc')
    ) {
      // Propietario
      return user;
    } else {
      throw new ConflictException(
        'El usuario no tiene permisos para ejecutar esta acción',
      );
    }
  },
);
