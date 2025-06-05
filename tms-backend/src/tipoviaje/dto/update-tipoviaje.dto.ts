import { PartialType } from '@nestjs/swagger';
import { CreateTipoviajeDto } from './create-tipoviaje.dto';

export class UpdateTipoviajeDto extends PartialType(CreateTipoviajeDto) {}
