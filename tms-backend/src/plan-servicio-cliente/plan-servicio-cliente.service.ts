import { Injectable } from '@nestjs/common';
import { CreatePlanServicioClienteDto } from './dto/create-plan-servicio-cliente.dto';
import { UpdatePlanServicioClienteDto } from './dto/update-plan-servicio-cliente.dto';
import { BaseServiceCRUD } from 'src/common/base/class/base.service.crud.class';
import { PlanServicioCliente } from './entities/plan-servicio-cliente.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PlanServicioClienteService  extends BaseServiceCRUD<
PlanServicioCliente,
CreatePlanServicioClienteDto,
UpdatePlanServicioClienteDto> {
  constructor(
    @InjectRepository(PlanServicioCliente)
    private readonly repository: Repository<PlanServicioCliente>,
  ) {
    super(repository)
  }
  
}