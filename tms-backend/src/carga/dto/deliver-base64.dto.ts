// src/carga/dto/deliver-base64.dto.ts
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeliverBase64Dto {
  @ApiProperty({
    description: 'DataURL base64 (data:image/...;base64,...)',
    example: 'data:image/webp;base64,...',
  })
  @IsNotEmpty()
  @IsString()
  dni_front_base64: string;

  @ApiProperty({
    description: 'DataURL base64 (data:image/...;base64,...)',
    example: 'data:image/webp;base64,...',
  })
  @IsNotEmpty()
  @IsString()
  dni_back_base64: string;

  @ApiProperty({
    description: 'Booleano indicando si hubo firma física',
    required: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  pod_signed: boolean;

  @ApiProperty({
    description: 'Booleano opcional, confirmado firma',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  signatureConfirmed?: boolean;
}
