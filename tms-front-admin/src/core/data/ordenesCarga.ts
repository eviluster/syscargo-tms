interface IOrdenCarga {
  id: number;
  fechaEmision: string;
  numeroDocumento: string;
  nombreComprador: string;
  domicilioComprador: string;
  terminalPortuaria: string;
  domicilioTerminal: string;
  fechaAutorizacion: string;
  tipoProducto: string;
  claseProducto: string;
  cantidadProducto: number;
  siglasContenedor: string;
  numeroContenedor: string;
  cantidadBultos: number;
  pesoBruto: number;
  nombreBuque: string;
  numeroConocimientoEmbarque: string;
  numeroManifiesto: string;
  numeroDeclaracionMercancias: string;
  entidadPropietaria: string;
  matriculaVehiculo: string;
  licenciaOperacion: string;
  hojaRuta: string;
  cartaPorte: string;
  lugarVinculacion: string;
  nombreConductor: string;
  numeroIdentidadConductor: string;
  nombreResponsable: string;
  cargoResponsable: string;
  numeroIdentidadResponsable: string;
  firmaResponsable: string;
}
const ordenesCarga: Array<IOrdenCarga> = [
  {
    id: 1,
    fechaEmision: "2023-10-01",
    numeroDocumento: "DOC001",
    nombreComprador: "Juan Pérez",
    domicilioComprador: "Calle Falsa 123, Ciudad A",
    terminalPortuaria: "Terminal Puerto Norte",
    domicilioTerminal: "Avenida Puerto 456, Ciudad B",
    fechaAutorizacion: "2023-10-02",
    tipoProducto: "Granos",
    claseProducto: "Trigo",
    cantidadProducto: 5000,
    siglasContenedor: "ABC",
    numeroContenedor: "123456",
    cantidadBultos: 100,
    pesoBruto: 25000,
    nombreBuque: "Buque Carguero Uno",
    numeroConocimientoEmbarque: "CE123456",
    numeroManifiesto: "MF123456",
    numeroDeclaracionMercancias: "DM123456",
    entidadPropietaria: "Empresa Naviera Uno",
    matriculaVehiculo: "XYZ789",
    licenciaOperacion: "LO123456",
    hojaRuta: "HR123456",
    cartaPorte: "CP123456",
    lugarVinculacion: "Puerto Norte",
    nombreConductor: "Carlos López",
    numeroIdentidadConductor: "1234567890",
    nombreResponsable: "Ana Gómez",
    cargoResponsable: "Gerente de Logística",
    numeroIdentidadResponsable: "0987654321",
    firmaResponsable: "Ana Gómez",
  },
  {
    id: 2,
    fechaEmision: "2023-10-03",
    numeroDocumento: "DOC002",
    nombreComprador: "María Rodríguez",
    domicilioComprador: "Avenida Real 456, Ciudad C",
    terminalPortuaria: "Terminal Puerto Sur",
    domicilioTerminal: "Calle Puerto 789, Ciudad D",
    fechaAutorizacion: "2023-10-04",
    tipoProducto: "Minerales",
    claseProducto: "Hierro",
    cantidadProducto: 10000,
    siglasContenedor: "DEF",
    numeroContenedor: "654321",
    cantidadBultos: 200,
    pesoBruto: 50000,
    nombreBuque: "Buque Carguero Dos",
    numeroConocimientoEmbarque: "CE654321",
    numeroManifiesto: "MF654321",
    numeroDeclaracionMercancias: "DM654321",
    entidadPropietaria: "Empresa Naviera Dos",
    matriculaVehiculo: "ABC123",
    licenciaOperacion: "LO654321",
    hojaRuta: "HR654321",
    cartaPorte: "CP654321",
    lugarVinculacion: "Puerto Sur",
    nombreConductor: "Luis Martínez",
    numeroIdentidadConductor: "1122334455",
    nombreResponsable: "Pedro Sánchez",
    cargoResponsable: "Coordinador de Operaciones",
    numeroIdentidadResponsable: "5566778899",
    firmaResponsable: "Pedro Sánchez",
  },
  {
    id: 3,
    fechaEmision: "2023-10-05",
    numeroDocumento: "DOC003",
    nombreComprador: "Carlos Gómez",
    domicilioComprador: "Boulevard Central 789, Ciudad E",
    terminalPortuaria: "Terminal Puerto Este",
    domicilioTerminal: "Calle Este 101, Ciudad F",
    fechaAutorizacion: "2023-10-06",
    tipoProducto: "Combustibles",
    claseProducto: "Diesel",
    cantidadProducto: 20000,
    siglasContenedor: "GHI",
    numeroContenedor: "987654",
    cantidadBultos: 50,
    pesoBruto: 100000,
    nombreBuque: "Buque Carguero Tres",
    numeroConocimientoEmbarque: "CE987654",
    numeroManifiesto: "MF987654",
    numeroDeclaracionMercancias: "DM987654",
    entidadPropietaria: "Empresa Naviera Tres",
    matriculaVehiculo: "LMN456",
    licenciaOperacion: "LO987654",
    hojaRuta: "HR987654",
    cartaPorte: "CP987654",
    lugarVinculacion: "Puerto Este",
    nombreConductor: "Jorge Fernández",
    numeroIdentidadConductor: "9988776655",
    nombreResponsable: "Lucía Torres",
    cargoResponsable: "Supervisora de Carga",
    numeroIdentidadResponsable: "4433221100",
    firmaResponsable: "Lucía Torres",
  },
];

export type { IOrdenCarga };
export default ordenesCarga;
