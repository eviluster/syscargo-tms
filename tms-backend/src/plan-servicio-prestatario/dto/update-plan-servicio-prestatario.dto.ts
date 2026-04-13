import { PartialType } from '@nestjs/swagger';
import { CreatePlanServicioPrestatarioDto } from './create-plan-servicio-prestatario.dto';

export class UpdatePlanServicioPrestatarioDto extends PartialType(CreatePlanServicioPrestatarioDto) {}
