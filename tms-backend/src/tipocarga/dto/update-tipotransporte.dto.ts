import { PartialType } from '@nestjs/swagger';
import { CreateTipotransporteDto } from './create-tipotransporte.dto';

export class UpdateTipotransporteDto extends PartialType(CreateTipotransporteDto) {}
