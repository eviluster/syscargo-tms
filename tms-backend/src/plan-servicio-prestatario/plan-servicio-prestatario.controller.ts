import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlanServicioPrestatarioService } from './plan-servicio-prestatario.service';
import { CreatePlanServicioPrestatarioDto } from './dto/create-plan-servicio-prestatario.dto';
import { UpdatePlanServicioPrestatarioDto } from './dto/update-plan-servicio-prestatario.dto';
import { BaseControllerCRUD } from 'src/common/base/class/base.controller.crud.class';

@Controller('plan-servicio-prestatario')
export class PlanServicioPrestatarioController  extends BaseControllerCRUD<
CreatePlanServicioPrestatarioDto,
UpdatePlanServicioPrestatarioDto,
PlanServicioPrestatarioService
> {
  constructor(private readonly Service: PlanServicioPrestatarioService) {
    super(Service);
  }
  

}