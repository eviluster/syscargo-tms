import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  IsDate,
  IsOptional,
  IsUUID,
  IsEnum,
  Min,
  IsDateString, // añadido
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseExtendedDto } from 'src/common/base/dto/base.dto';
import { TipoCargaEnum } from '../enum/tipo-carga.enum';
import { ViaMode } from 'src/carga/enum/vias'; // <-- IMPORT

export class CreateCargaDto extends BaseExtendedDto {
  @IsOptional()
  @IsString()
  remitente_dni: string;

  @IsOptional()
  @IsString()
  remitente_nombre: string;

  @IsOptional()
  @IsString()
  direccion: string;

  @IsOptional()
  @IsString()
  emisor_dni: string;

  @IsOptional()
  @IsString()
  emisor_nombre: string;

  @IsOptional()
  @IsString()
  emisor_direccion: string;

  @IsOptional()
  @IsNumber()
  cant_bultos: number;

  @IsOptional()
  @IsNumber()
  peso_total: number;

  @IsOptional()
  @IsNumber()
  vol_bulto: number;

  @IsOptional()
  @IsString()
  autorizado_recoger: string;

  @IsOptional()
  @IsEnum(TipoCargaEnum)
  tipo_carga: TipoCargaEnum;

  @IsOptional()
  @IsString()
  order_id: string;

  @IsOptional()
  @IsString()
  carga_serie: string;

  @IsOptional()
  @IsString()
  origen_string: string;

  @IsOptional()
  @IsString()
  destino_string: string;

  @IsOptional()
  @IsNumber()
  @Min(0.1)
  precio: number;

  @IsOptional()
  @IsNumber()
  @Min(0.1)
  tarifabase: number;

  @IsOptional()
  @IsNumber()
  @Min(0.1)
  volumen: number;

  @IsOptional()
  @IsNumber()
  @Min(0.1)
  impuesto: number;

  @IsOptional()
  @IsNumber()
  @Min(0.1)
  comision: number;

  @ApiProperty({
    required: false,
    description: 'UUID del cliente (opcional para admin)',
  })
  @IsOptional()
  @IsUUID()
  clientId?: string;

  /**
   * Vía de transporte para esta carga (opcional).
   * Valida contra ViaMode.
   */
  @IsOptional()
  @IsEnum(ViaMode)
  via: ViaMode;

  // ----------------------
  // Campos añadidos desde el formulario (opcionales)
  // Los colocamos debajo de los existentes para diferenciar
  // ----------------------

  @ApiProperty({
    required: false,
    description: 'Fecha de emisión (ISO string)',
  })
  @IsOptional()
  @IsDateString()
  fecha_emision?: string;

  @ApiProperty({
    required: false,
    description: 'Número u identificador de orden',
  })
  @IsOptional()
  @IsString()
  no_orden?: string;

  @ApiProperty({ required: false, description: 'Comprador interno (opcional)' })
  @IsOptional()
  @IsString()
  comprador_interno?: string;

  @ApiProperty({ required: false, description: 'Lugar autorizado (opcional)' })
  @IsOptional()
  @IsString()
  autorizado_lugar?: string;

  @ApiProperty({
    required: false,
    description: 'Fecha autorizada (ISO string)',
  })
  @IsOptional()
  @IsDateString()
  fecha_autorizada?: string;

  @ApiProperty({
    required: false,
    description: 'Nombre del representante (opcional)',
  })
  @IsOptional()
  @IsString()
  representante_nombre?: string;

  @ApiProperty({
    required: false,
    description: 'Carnet del representante (opcional)',
  })
  @IsOptional()
  @IsString()
  representante_carnet?: string;

  @ApiProperty({
    required: false,
    description: 'Cargo del representante (opcional)',
  })
  @IsOptional()
  @IsString()
  representante_cargo?: string;

  @ApiProperty({
    required: false,
    description: 'Firma (texto/base64 si aplica) (opcional)',
  })
  @IsOptional()
  @IsString()
  firma?: string;

  @ApiProperty({ required: false, description: 'Tipo de producto (opcional)' })
  @IsOptional()
  @IsString()
  tipo_producto?: string;

  @ApiProperty({
    required: false,
    description: 'Siglas del contenedor (opcional)',
  })
  @IsOptional()
  @IsString()
  contenedor_siglas?: string;

  @ApiProperty({
    required: false,
    description: 'Nombre del destinatario (opcional)',
  })
  @IsOptional()
  @IsString()
  nombre_destinatario?: string;

  @ApiProperty({
    required: false,
    description: 'Nombre del buque (opcional, marítimo)',
  })
  @IsOptional()
  @IsString()
  nombre_buque?: string;

  @ApiProperty({ required: false, description: 'mfto number (opcional)' })
  @IsOptional()
  @IsString()
  mfto_no?: string;

  @ApiProperty({ required: false, description: 'BL number (opcional)' })
  @IsOptional()
  @IsString()
  bl_no?: string;

  @ApiProperty({ required: false, description: 'DM number (opcional)' })
  @IsOptional()
  @IsString()
  dm_no?: string;

  @ApiProperty({
    required: false,
    description: 'Vehículo pertenece a (opcional)',
  })
  @IsOptional()
  @IsString()
  vehiculo_pertenece_a?: string;

  @ApiProperty({ required: false, description: 'Conducido por (opcional)' })
  @IsOptional()
  @IsString()
  conducido_por?: string;

  @ApiProperty({ required: false, description: 'Número de chapa (opcional)' })
  @IsOptional()
  @IsString()
  chapa_no?: string;

  @ApiProperty({ required: false, description: 'Lote / lot no (opcional)' })
  @IsOptional()
  @IsString()
  lot_no?: string;

  @ApiProperty({ required: false, description: 'Hoja de ruta (opcional)' })
  @IsOptional()
  @IsString()
  hoja_ruta_no?: string;

  @ApiProperty({ required: false, description: 'Carta porte nº (opcional)' })
  @IsOptional()
  @IsString()
  carta_porte_no?: string;

  @ApiProperty({ required: false, description: 'Chapa tractivo nº (opcional)' })
  @IsOptional()
  @IsString()
  chapa_tractivo_no?: string;

  @ApiProperty({ required: false, description: 'Remolque nº (opcional)' })
  @IsOptional()
  @IsString()
  remolque_no?: string;

  @ApiProperty({
    required: false,
    description: 'Carnet del conductor (opcional)',
  })
  @IsOptional()
  @IsString()
  conductor_carnet_no?: string;

  @ApiProperty({
    required: false,
    description: 'Licencia de conducción nº (opcional)',
  })
  @IsOptional()
  @IsString()
  licencia_conduccion_no?: string;

  @ApiProperty({
    required: false,
    description: 'Basificado en (observación) (opcional)',
  })
  @IsOptional()
  @IsString()
  basificado_en?: string;
}
