import { IsOptional, IsString } from 'class-validator';

export class ChangeStateDto {
  @IsOptional()
  @IsString()
  note?: string;
}
