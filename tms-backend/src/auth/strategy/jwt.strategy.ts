// src/auth/strategy/jwt.strategy.ts
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly config: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // fallback a process.env por si acaso
      secretOrKey:
        config.get<string>('JWT_SECRET_KEY') || process.env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: {
    sub?: string;
    username?: string;
    roleID?: number;
  }) {
    this.logger.debug(`JWT payload: ${JSON.stringify(payload)}`);

    if (!payload || !payload.sub) {
      this.logger.warn('JWT inválido: payload o sub ausente');
      throw new UnauthorizedException('Invalid token payload');
    }

    const userId = payload.sub;

    try {
      // findOneBy está bien si 'id' es la columna. Si tu PK tiene otro nombre, ajusta.
      const user = await this.userRepository.findOneBy({ id: userId } as any);

      if (!user) {
        this.logger.warn(`Usuario no encontrado (id=${userId})`);
        throw new UnauthorizedException('User not found');
      }

      // Eliminar hash de forma segura (sólo si existe)
      if (user && Object.prototype.hasOwnProperty.call(user, 'hash')) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete (user as any).hash;
      }

      return user;
    } catch (err) {
      this.logger.error('Error buscando usuario en JwtStrategy', err as any);
      throw new UnauthorizedException('Authentication error');
    }
  }
}
