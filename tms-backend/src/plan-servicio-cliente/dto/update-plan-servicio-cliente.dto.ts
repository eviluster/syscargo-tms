import { PartialType } from '@nestjs/swagger';
import { CreatePlanServicioClienteDto } from './create-plan-servicio-cliente.dto';

export class UpdatePlanServicioClienteDto extends PartialType(CreatePlanServicioClienteDto) {}
