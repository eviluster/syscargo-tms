import { PartialType } from '@nestjs/swagger';
import { CreatePlanesDto } from './create-planes.dto';

export class UpdatePlanesDto extends PartialType(CreatePlanesDto) {}
