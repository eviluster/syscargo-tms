import { BaseExtendedDto } from "src/common/base/dto/base.dto";
import { EstadoPago } from "../enum/pago.enum";
import { IsDate, IsEnum, IsNumber, IsString, IsUUID, MaxLength, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePagoDto  extends BaseExtendedDto{
@ApiProperty({ type: String, nullable: false })
@IsString()
@IsUUID()
customer: string;

@ApiProperty({ type: String, nullable: false, maxLength: 100 })
@IsString()
@MaxLength(100)
facturaNumero: string;

@ApiProperty({ type: Number, nullable: false })
@IsNumber()
@Min(1)
monto: number;

@ApiProperty({ type: Date, nullable: false })
@IsDate()
fechaRegistro: Date;

@ApiProperty({ type: Date, nullable: false })
@IsDate()
fechaFactura: Date;

@ApiProperty({ type: String, nullable: false })
@IsString()
@IsUUID()
comercial_id: string;

@ApiProperty({ type: String, nullable: false })
@IsString()
@IsUUID()
cuentaBancariaOrigen: string;

@ApiProperty({ type: String, nullable: false })
@IsString()
@IsUUID()
cuentaBancariaDestino: string;

@ApiProperty({ type: String, nullable: false })
@IsString()
@IsUUID()
reserva_id: string;

@ApiProperty({ enum: EstadoPago, default: EstadoPago.REGISTRADO })
@IsEnum(EstadoPago)
estado: EstadoPago;
}
