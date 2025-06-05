import { PartialType } from '@nestjs/swagger';
import { CreateComercialDto } from './create-comercial.dto';

export class UpdateComercialDto extends PartialType(CreateComercialDto) {}
