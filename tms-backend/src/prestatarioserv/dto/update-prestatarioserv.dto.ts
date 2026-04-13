import { PartialType } from '@nestjs/swagger';
import { CreatePrestatarioservDto } from './create-prestatarioserv.dto';

export class UpdatePrestatarioservDto extends PartialType(CreatePrestatarioservDto) {}
