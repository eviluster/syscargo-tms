interface ITransportistas {
  id: string | number;
  name?: string;
  nombre?: string;
  direccion?: string;
  telefono?: string;
  phone?: string;
  correo?: string;
  email?: string;
  razonSocial?: string;
  tipoServicio?: string;
  servicios?: string[];
  estado?: string;
  user?: { name: string; email: string; phone: string };
  [key: string]: any;
}

const transportistas: Array<ITransportistas> = [];

export type { ITransportistas };
export default transportistas;
