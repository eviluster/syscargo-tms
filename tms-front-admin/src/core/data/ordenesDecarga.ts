interface IOrdenesC {
  id: number;
  codigoOrden: string; // Nuevo campo
  carnetIdentidad: string;
  direccionRemitente: string;
  nombreRemitente: string;
  carnetIdentidadEmisor: string;
  nombreEmisor: string;
  direccionEmisor: string;
  cantidadBultos: number;
  peso: number;
  volumenBulto: number;
  origen: string;
  destino: string;
  autorizadoRecoger: string;
  tipoCarga: "Misceláneas" | "Carga General";
  tarifaBase: number;
  impuestoAeroportuario: number;
  costoVolumen: number;
  comisionServicio: number;
  precioTotal: number;
  fechaRegistro: string;
  estado:
    | "Pendiente"
    | "Transportista"
    | "Confirmado"
    | "Centro de Distribución"
    | "En Tránsito"
    | "Cancelado"
    | "Reprogramado";
}

const ordenes: Array<IOrdenesC> = [
  {
    id: 1,
    codigoOrden: "ORD12345",
    carnetIdentidad: "12345678",
    direccionRemitente: "Av. Principal 123, Ciudad A",
    nombreRemitente: "Juan Pérez",
    carnetIdentidadEmisor: "87654321",
    nombreEmisor: "Empresa XYZ",
    direccionEmisor: "Calle Secundaria 456, Ciudad B",
    cantidadBultos: 5,
    peso: 50.5,
    volumenBulto: 0.75,
    origen: "Ciudad A",
    destino: "Ciudad B",
    autorizadoRecoger: "María López",
    tipoCarga: "Misceláneas",
    tarifaBase: 100.0,
    impuestoAeroportuario: 15.0,
    costoVolumen: 20.0,
    comisionServicio: 10.0,
    precioTotal: 145.0,
    fechaRegistro: "2025-04-13",
    estado: "Pendiente",
  },
  {
    id: 2,
    codigoOrden: "ORD67890",
    carnetIdentidad: "23456789",
    direccionRemitente: "Av. Central 789, Ciudad C",
    nombreRemitente: "Ana Gómez",
    carnetIdentidadEmisor: "98765432",
    nombreEmisor: "Empresa ABC",
    direccionEmisor: "Calle Terciaria 321, Ciudad D",
    cantidadBultos: 10,
    peso: 100.0,
    volumenBulto: 1.5,
    origen: "Ciudad C",
    destino: "Ciudad D",
    autorizadoRecoger: "Carlos Martínez",
    tipoCarga: "Carga General",
    tarifaBase: 200.0,
    impuestoAeroportuario: 30.0,
    costoVolumen: 40.0,
    comisionServicio: 20.0,
    precioTotal: 290.0,
    fechaRegistro: "2025-04-13",
    estado: "Transportista",
  },
];

export type { IOrdenesC };
export default ordenes;
