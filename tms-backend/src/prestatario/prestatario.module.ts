import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prestatario } from './entities/prestatario.entity';
import { PrestatarioService } from './prestatario.service';
import { PrestatarioController } from './prestatario.controller';
import { Carga } from 'src/carga/entities/carga.entity';
import { Proposal } from 'src/proposal/entities/proposal.entity';
import { User } from 'src/user/entities/user.entity';
import { Solicitud } from 'src/solicitudes/solicitudes.entity';
//import { SolicitudesModule } from 'src/solicitudes/solicitudes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Prestatario, Carga, Proposal, User, Solicitud]),
  ],
  controllers: [PrestatarioController],
  providers: [PrestatarioService],
  exports: [PrestatarioService],
})
export class PrestatarioModule {}
