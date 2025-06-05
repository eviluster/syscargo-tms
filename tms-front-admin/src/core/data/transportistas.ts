interface ITransportistas {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  correo: string;
  razonSocial: string;
  tipoServicio: string;
  estado: string;
}

const transportistas: Array<ITransportistas> = [
  {
    id: 1,
    nombre: "Transportes Pérez",
    direccion: "Calle 123, Ciudad",
    telefono: "555-1234",
    correo: "contacto@transportesperez.com",
    razonSocial: "Empresa",
    tipoServicio: "Carga",
    estado: "Activo",
  },
  {
    id: 2,
    nombre: "Mudanzas Rápidas",
    direccion: "Avenida 456, Ciudad",
    telefono: "555-5678",
    correo: "info@mudanzasrapidas.com",
    razonSocial: "Autónomo",
    tipoServicio: "Mudanzas",
    estado: "Suspendido",
  },
];

export type { ITransportistas };
export default transportistas;
