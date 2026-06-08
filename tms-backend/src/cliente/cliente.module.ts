// src/clients/client.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/cliente.entity';
import { ClientService } from './cliente.service';
import { ClientController } from './cliente.controller';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module'; // sólo si necesitas importar UserModule (ver circularidad)
import { Solicitud } from 'src/solicitudes/solicitudes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client, User, Solicitud]), // <-- registra repositorios Client + User
    forwardRef(() => UserModule), // <-- descomenta si necesitas importar UserModule y hay circularidad
  ],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientModule {}
