// src/proposal/dto/create-proposal.dto.ts
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
  IsOptional,
  IsUUID,
  IsString,
  IsNotEmpty,
} from 'class-validator';

/**
 * Constraint a nivel de objeto: exige que al menos uno de
 * cargaId | peticionId esté presente en el DTO.
 */
@ValidatorConstraint({ name: 'AtLeastOneResourceId', async: false })
export class AtLeastOneResourceIdConstraint
  implements ValidatorConstraintInterface
{
  validate(_: any, args: ValidationArguments) {
    const obj = args.object as any;
    // true si viene al menos cargaId o peticionId no vacío
    return !!(obj?.cargaId || obj?.peticionId);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Se requiere al menos cargaId o peticionId (uno de los dos)';
  }
}

export class CreateProposalDto {
  // Si es una propuesta sobre una carga (opcional)
  @IsOptional()
  @IsUUID('4', { message: 'cargaId must be a UUID' })
  cargaId?: string;

  // Si es una propuesta sobre una petición (opcional)
  @IsOptional()
  @IsUUID('4', { message: 'peticionId must be a UUID' })
  peticionId?: string;

  // prestatarioId es obligatorio (a quién vas a proponer)
  @IsNotEmpty({ message: 'prestatarioId should not be empty' })
  @IsUUID('4', { message: 'prestatarioId must be a UUID' })
  prestatarioId!: string;

  // mensaje opcional
  @IsOptional()
  @IsString()
  message?: string;

  // validación de negocio: al menos uno de cargaId | peticionId
  // usamos una propiedad fantasma validada por la constraint que mira todo el objeto
  @Validate(AtLeastOneResourceIdConstraint)
  _atLeastOne?: any;
}
