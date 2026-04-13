import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { PrestatarioModule } from 'src/prestatario/prestatario.module';
import { Role } from '../roles/entities/role.entity';
import { Configuracion } from 'src/configuracion/entities/configuracion.entity';
import { ClientModule } from 'src/cliente/cliente.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Configuracion]),
    PrestatarioModule,
    ClientModule,
    JwtModule.register({
      secret: 'process.env.JWT_SECRET_KEY',
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
