import { IsNotEmpty, IsString, IsNumber, IsBoolean, IsDate, IsOptional, IsUUID, IsEnum, min, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseExtendedDto } from 'src/common/base/dto/base.dto';
import { TipoCargaEnum } from '../enum/tipo-carga.enum';

export class CreateCargaDto extends BaseExtendedDto {
  @IsNotEmpty()
  @IsString()
  remitente_dni: string;

  @IsNotEmpty()
  @IsString()
  remitente_nombre: string;

  @IsNotEmpty()
  @IsString()
  direccion: string;

  @IsNotEmpty()
  @IsString()
  emisor_dni: string;

  @IsNotEmpty()
  @IsString()
  emisor_nombre: string;

  @IsNotEmpty()
  @IsString()
  emisor_direccion: string;

  @IsNotEmpty()
  @IsNumber()
  cant_bultos: number;

  @IsNotEmpty()
  @IsNumber()
  peso_total: number;

  @IsNotEmpty()
  @IsNumber()
  vol_bulto: number;

  // @IsNotEmpty()
  // @IsString()
  // @IsUUID()
  // origen: string;

  // @IsNotEmpty()
  // @IsString()
  // @IsUUID()
  // destino: string;

  @IsNotEmpty()
  @IsString()
  autorizado_recoger: string;

  @IsNotEmpty()
  @IsEnum(TipoCargaEnum)
  tipo_carga: TipoCargaEnum;

  @IsNotEmpty()
  @IsString()
  order_id: string;

  @IsNotEmpty()
  @IsString()
  carga_serie: string;

  @IsNotEmpty()
  @IsString()
  origen_string: string;

  @IsNotEmpty()
  @IsString()
  destino_string: string;

  // @IsOptional()
  // @IsString()
  // @IsUUID()
  // prestatarioserv?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0.1)
  precio: number;
  @IsNotEmpty()
  @IsNumber()
  @Min(0.1)
  tarifabase: number;
  @IsNotEmpty()
  @IsNumber()
  @Min(0.1)
  volumen: number;
  @IsNotEmpty()
  @IsNumber()
  @Min(0.1)
  impuesto: number;
  @IsNotEmpty()
  @IsNumber()
  @Min(0.1)
  comision: number;
  
  
}
