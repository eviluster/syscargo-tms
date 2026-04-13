import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carga } from './entities/carga.entity';
import { Client } from 'src/cliente/entities/cliente.entity';
import { CargaService } from './carga.service';
import { CargaController } from './carga.controller';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([Carga, Client]), NotificationsModule],
  controllers: [CargaController],
  providers: [CargaService],
  exports: [CargaService],
})
export class CargaModule {}
