import { BaseExtendedDto } from "src/common/base/dto/base.dto";

export class CreateReservaDto  extends BaseExtendedDto{
apellido: string;
correo: string;
fecha: string;
hora: string;
direccion: string;
comercial?: string;
oferta?: string;
contrato?: string;
// si es servicio
nombreSolicitante: string;
correoSolicitante: string;
telefonoSolicitante: string;
tipoServicio: string;
fechaSolicitud: string;
comentarios: string;
user: string;

}
