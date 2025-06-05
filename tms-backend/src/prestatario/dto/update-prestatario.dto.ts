import { PartialType } from '@nestjs/swagger';
import { CreatePrestatarioDto } from './create-prestatario.dto';

export class UpdatePrestatarioDto extends PartialType(CreatePrestatarioDto) {}
