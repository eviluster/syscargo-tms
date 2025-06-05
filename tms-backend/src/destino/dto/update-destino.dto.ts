import { PartialType } from '@nestjs/swagger';
import { CreateDestinoDto } from './create-destino.dto';

export class UpdateDestinoDto extends PartialType(CreateDestinoDto) {}
