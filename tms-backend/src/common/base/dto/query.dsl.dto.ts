import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Enumeración de operadores de comparación disponibles
 */
export enum ComparisonOperator {
  EQUALS = 'eq',
  NOT_EQUALS = 'neq',
  GREATER_THAN = 'gt',
  GREATER_THAN_OR_EQUAL = 'gte',
  LESS_THAN = 'lt',
  LESS_THAN_OR_EQUAL = 'lte',
  LIKE = 'like',
  IN = 'in',
  NOT_IN = 'notIn',
  IS_NULL = 'isNull',
  IS_NOT_NULL = 'isNotNull',
  BETWEEN = 'between',
  RAW = 'raw' // Para condiciones SQL personalizadas
}

/**
 * Enumeración de operadores lógicos
 */
export enum LogicalOperator {
  AND = 'and',
  OR = 'or'
}

/**
 * Enumeración de direcciones de ordenamiento
 */
export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

/**
 * Clase que define una condición de filtro
 */
export class FilterCondition {
  @ApiProperty({ description: 'Nombre del campo a filtrar' })
  @IsString()
  field: string;

  @ApiProperty({ enum: ComparisonOperator, description: 'Operador de comparación' })
  @IsEnum(ComparisonOperator)
  operator: ComparisonOperator;

  @ApiProperty({ description: 'Valor para la comparación' })
  value: any;

  @ApiProperty({ enum: LogicalOperator, required: false, description: 'Operador lógico para combinar condiciones' })
  @IsEnum(LogicalOperator)
  @IsOptional()
  logicalOperator?: LogicalOperator;

  @ApiProperty({ required: false, description: 'Alias de la tabla para campos en relaciones' })
  @IsString()
  @IsOptional()
  tableAlias?: string;
}

/**
 * Clase que define una condición de ordenamiento
 */
export class SortCondition {
  @ApiProperty({ description: 'Campo por el cual ordenar' })
  @IsString()
  field: string;

  @ApiProperty({ enum: SortDirection, description: 'Dirección del ordenamiento' })
  @IsEnum(SortDirection)
  direction: SortDirection;

  @ApiProperty({ required: false, description: 'Alias de la tabla para campos en relaciones' })
  @IsString()
  @IsOptional()
  tableAlias?: string;
}

/**
 * Clase que define una relación entre tablas
 */
export class JoinCondition {
  @ApiProperty({ description: 'Nombre de la tabla a unir' })
  @IsString()
  table: string;

  @ApiProperty({ description: 'Alias para la tabla unida' })
  @IsString()
  alias: string;

  @ApiProperty({ description: 'Condición de unión' })
  @IsString()
  condition: string;

  @ApiProperty({ enum: ['inner', 'left', 'right'], default: 'left', description: 'Tipo de unión' })
  @IsString()
  type: 'inner' | 'left' | 'right' = 'left';

  @ApiProperty({ type: () => [FilterCondition], required: false, description: 'Filtros para la tabla unida' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilterCondition)
  @IsOptional()
  filters?: FilterCondition[];

  @ApiProperty({ type: () => [JoinCondition], required: false, description: 'Relaciones anidadas' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JoinCondition)
  @IsOptional()
  joins?: JoinCondition[];

  @ApiProperty({ type: () => [SortCondition], required: false, description: 'Ordenamiento para la tabla unida' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SortCondition)
  @IsOptional()
  sort?: SortCondition[];
}

/**
 * Clase principal que define la estructura de la consulta DSL
 */
export class QueryDSL {
  @ApiProperty({ type: () => [String], description: 'Campos a seleccionar de la tabla principal' })
  @IsArray()
  @IsString({ each: true })
  select: string[];

  @ApiProperty({ type: () => [FilterCondition], required: false, description: 'Condiciones de filtro para la tabla principal' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilterCondition)
  @IsOptional()
  where?: FilterCondition[];

  @ApiProperty({ type: () => [JoinCondition], required: false, description: 'Relaciones con otras tablas' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JoinCondition)
  @IsOptional()
  joins?: JoinCondition[];

  @ApiProperty({ type: () => [SortCondition], required: false, description: 'Ordenamiento de los resultados' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SortCondition)
  @IsOptional()
  sort?: SortCondition[];

  @ApiProperty({ required: false, description: 'Número de registros a saltar (paginación)' })
  @IsOptional()
  skip?: number;

  @ApiProperty({ required: false, description: 'Número máximo de registros a retornar (paginación)' })
  @IsOptional()
  take?: number;

  @ApiProperty({ required: false, description: 'Alias para la tabla principal' })
  @IsString()
  @IsOptional()
  mainAlias?: string = 'main';
} 