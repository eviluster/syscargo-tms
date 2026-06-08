import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { config } from '../ormconfig';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { RolesModule } from './roles/roles.module';
import { TipoUmModule } from './tipo-um/tipo-um.module';
import { UmModule } from './um/um.module';
import { ProveedorModule } from './proveedor/proveedor.module';
import { CountryModule } from './country/country.module';
import { ProvinceModule } from './province/province.module';
import { MunicipalityModule } from './municipality/municipality.module';
import { AddressDetailsModule } from './address-details/address-details.module';
import { LocalityModule } from './locality/locality.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UserRolesModule } from './user-roles/user-roles.module';
import { TrazasModule } from './trazas/trazas.module';
import { ConfiguracionModule } from './configuracion/configuracion.module';
import { TrazaService } from './trazas/trazas.service';
import { CuentaBancariaModule } from './cuenta-bancaria/cuenta-bancaria.module';
import { ReservaModule } from './reserva/reserva.module';
import { ComercialModule } from './comercial/comercial.module';
import { PagoModule } from './pago/pago.module';
import { ServicioModule } from './servicio/servicio.module';
import { CustomerModule } from './customer/customer.module';
import { CustomerCuentaModule } from './customer-cuenta/customer-cuenta.module';
import { PlanesModule } from './planes/planes.module';
import { PlanServicioClienteModule } from './plan-servicio-cliente/plan-servicio-cliente.module';
import { PrestatarioModule } from './prestatario/prestatario.module';
import { PlanServicioPrestatarioModule } from './plan-servicio-prestatario/plan-servicio-prestatario.module';
import { ModalidadModule } from './modalidad/modalidad.module';
import { OrigenModule } from './origen/origen.module';
import { DestinoModule } from './destino/destino.module';
import { TipoviajeModule } from './tipoviaje/tipoviaje.module';
import { TipotransporteModule } from './tipotransporte/tipotransporte.module';
import { TipomercadoModule } from './tipomercado/tipomercado.module';
import { TipopagoModule } from './tipopago/tipopago.module';
import { CalendarModule } from './calendar/calendar.module';
import { CargaModule } from './carga/carga.module';
import { DoccargaModule } from './doccarga/doccarga.module';
import { PrestatarioservModule } from './prestatarioserv/prestatarioserv.module';
import { ClientModule } from './cliente/cliente.module';
import { ProposalsModule } from './proposal/proposal.module';
import { SettingsModule } from './settings/settings.module';
import { SolicitudesModule } from './solicitudes/solicitudes.module';
import { ProposalsAlquilerModule } from './proposals_alquiler/proposal-alquiler.module';
import { ProposalsServicesModule } from './proposals_services/proposal-service.module';
import { PeticionModule } from './peticion/peticion.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRoot(config),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
    }),
    // MongooseModule.forRoot('mongodb://localhost:27017/parking'),
    AuthModule,
    UserModule,
    RolesModule,
    TipoUmModule,
    UmModule,
    ProveedorModule,
    CountryModule,
    ProvinceModule,
    MunicipalityModule,
    AddressDetailsModule,
    LocalityModule,
    NotificationsModule,
    UserRolesModule,
    TrazasModule,
    ConfiguracionModule,
    CuentaBancariaModule,
    ReservaModule,
    ComercialModule,
    PagoModule,
    ServicioModule,
    CustomerModule,
    CustomerCuentaModule,
    PlanesModule,
    PlanServicioClienteModule,
    PrestatarioModule,
    PlanServicioPrestatarioModule,
    ModalidadModule,
    OrigenModule,
    DestinoModule,
    TipoviajeModule,
    TipotransporteModule,
    TipomercadoModule,
    TipopagoModule,
    CalendarModule,
    CargaModule,
    DoccargaModule,
    PrestatarioservModule,
    ProposalsModule,
    ClientModule,
    SettingsModule,
    SolicitudesModule,
    ProposalsAlquilerModule,
    ProposalsServicesModule,
    PeticionModule,
  ],
  controllers: [],
  providers: [],
  exports: [], // Exporta el servicio para ser utilizado en otros módulos
})
export class AppModule {}
