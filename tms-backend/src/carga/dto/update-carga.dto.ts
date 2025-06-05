import { PartialType } from '@nestjs/swagger';
import { CreateCargaDto } from './create-carga.dto';

export class UpdateCargaDto extends PartialType(CreateCargaDto) {}
