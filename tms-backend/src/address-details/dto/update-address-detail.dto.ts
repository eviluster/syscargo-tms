import { PartialType } from '@nestjs/swagger';
import { CreateAddressDetailDto } from './create-address-detail.dto';

export class UpdateAddressDetailDto extends PartialType(
  CreateAddressDetailDto,
) {}
