import { PartialType } from '@nestjs/swagger';
import { CreateDoccargaDto } from './create-doccarga.dto';

export class UpdateDoccargaDto extends PartialType(CreateDoccargaDto) {}
