import { Injectable } from '@nestjs/common';
import { CreatePlanServicioPrestatarioDto } from './dto/create-plan-servicio-prestatario.dto';
import { UpdatePlanServicioPrestatarioDto } from './dto/update-plan-servicio-prestatario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseServiceCRUD } from 'src/common/base/class/base.service.crud.class';
import { PlanServicioPrestatario } from './entities/plan-servicio-prestatario.entity';

@Injectable()
export class PlanServicioPrestatarioService  extends BaseServiceCRUD<
PlanServicioPrestatario,
CreatePlanServicioPrestatarioDto,
UpdatePlanServicioPrestatarioDto
> {
  constructor(
    @InjectRepository(PlanServicioPrestatario)
    private readonly repository: Repository<PlanServicioPrestatario>,
  ) {
    super(repository)
  }
}