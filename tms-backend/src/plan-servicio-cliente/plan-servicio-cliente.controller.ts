import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlanServicioClienteService } from './plan-servicio-cliente.service';
import { CreatePlanServicioClienteDto } from './dto/create-plan-servicio-cliente.dto';
import { UpdatePlanServicioClienteDto } from './dto/update-plan-servicio-cliente.dto';
import { BaseControllerCRUD } from 'src/common/base/class/base.controller.crud.class';

@Controller('plan-servicio-cliente')
export class PlanServicioClienteController  extends BaseControllerCRUD<
CreatePlanServicioClienteDto,
UpdatePlanServicioClienteDto,
PlanServicioClienteService
> {
  constructor(private readonly Service: PlanServicioClienteService) {
    super(Service);
  }
  
}