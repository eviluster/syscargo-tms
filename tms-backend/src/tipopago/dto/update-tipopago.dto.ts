import { PartialType } from '@nestjs/swagger';
import { CreateTipopagoDto } from './create-tipopago.dto';

export class UpdateTipopagoDto extends PartialType(CreateTipopagoDto) {}
