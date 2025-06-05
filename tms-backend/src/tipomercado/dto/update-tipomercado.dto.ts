import { PartialType } from '@nestjs/swagger';
import { CreateTipomercadoDto } from './create-tipomercado.dto';

export class UpdateTipomercadoDto extends PartialType(CreateTipomercadoDto) {}
