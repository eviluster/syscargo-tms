import * as dotenv from 'dotenv';
import { Role } from './src/roles/entities/role.entity';
import { User } from './src/user/entities/user.entity';
import { TipoUm } from './src/tipo-um/entities/tipo-um.entity';
import { Um } from './src/um/entities/um.entity';
import { Proveedor } from './src/proveedor/entities/proveedor.entity';
import { Country } from './src/country/entities/country.entity';
import { Province } from './src/province/entities/province.entity';
import { Municipality } from './src/municipality/entities/municipality.entity';
import { Locality } from './src/locality/entities/locality.entity';
import { AddressDetail } from './src/address-details/entities/address-detail.entity';
import { Notification } from './src/notifications/entities/notification.entity';
import { UserRole } from './src/user-roles/entities/user-role.entity';
import { Configuracion } from './src/configuracion/entities/configuracion.entity';

import { Traza } from 'src/trazas/entities/traza.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Servicio } from 'src/servicio/entities/servicio.entity';
import { Reserva } from 'src/reserva/entities/reserva.entity';
import { Comercial } from 'src/comercial/entities/comercial.entity';
import { Pago } from 'src/pago/entities/pago.entity';
import { CuentaBancaria } from 'src/cuenta-bancaria/entities/cuenta-bancaria.entity';
import { CustomerCuenta } from 'src/customer-cuenta/entities/customer-cuenta.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
//import

import { Prestatarioserv } from './src/prestatarioserv/entities/prestatarioserv.entity';
import { Doccarga } from './src/doccarga/entities/doccarga.entity';
import { Carga } from './src/carga/entities/carga.entity';
import { Calendar } from './src/calendar/entities/calendar.entity';
import { Tipopago } from './src/tipopago/entities/tipopago.entity';
import { Tipomercado } from './src/tipomercado/entities/tipomercado.entity';
import { Tipotransporte } from './src/tipotransporte/entities/tipotransporte.entity';
import { Tipoviaje } from './src/tipoviaje/entities/tipoviaje.entity';
import { Destino } from './src/destino/entities/destino.entity';
import { Origen } from './src/origen/entities/origen.entity';
import { Modalidad } from './src/modalidad/entities/modalidad.entity';
import { Prestatario } from './src/prestatario/entities/prestatario.entity';
import { Proposal } from './src/proposal/entities/proposal.entity';
import { Setting } from './src/settings/entities/settings.entity';

import { Client } from 'src/cliente/entities/cliente.entity';
import { Planes } from './src/planes/entities/planes.entity';
import { PlanServicioCliente } from 'src/plan-servicio-cliente/entities/plan-servicio-cliente.entity';
import { PlanServicioPrestatario } from 'src/plan-servicio-prestatario/entities/plan-servicio-prestatario.entity';

import { Solicitud } from './src/solicitudes/solicitudes.entity';
import { ProposalAlquiler } from './src/proposals_alquiler/entities/proposal-alquiler.entity';
import { ProposalService } from './src/proposals_services/entities/proposal-service.entity';
import { Peticion } from 'src/peticion/entities/peticion.entity';

dotenv.config(); // Carga las variables de entorno desde el archivo .env
export const config: TypeOrmModuleOptions = {
  type: 'postgres',
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  password: process.env.DB_PASS,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  migrations: ['src/database/migrations/*.ts'],
  synchronize: true,

  entities: [
    Customer,
    AddressDetail,
    Comercial,
    Configuracion,
    Country,
    CuentaBancaria,
    CustomerCuenta,
    Locality,
    Municipality,
    Notification,
    Pago,
    Proveedor,
    Province,
    Reserva,
    Role,
    Servicio,
    TipoUm,
    Traza,
    Um,
    User,
    UserRole,
    //////------- New tables

    Prestatarioserv,
    Doccarga,
    Carga,
    Calendar,
    Calendar,
    Tipopago,
    Tipomercado,
    Tipotransporte,
    Tipoviaje,
    Destino,
    Origen,
    Modalidad,
    Prestatario,
    Proposal,
    Setting,
    Client,
    Planes,
    PlanServicioCliente,
    PlanServicioPrestatario,
    Solicitud,
    ProposalAlquiler,
    ProposalService,
    Peticion,
  ],
};

export default config;
