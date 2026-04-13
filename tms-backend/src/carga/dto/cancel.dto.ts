import { IsNotEmpty, IsString } from 'class-validator';

export class CancelDto {
  @IsNotEmpty()
  @IsString()
  reason: string;
}
