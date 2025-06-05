interface IContratos {
  id: number;
  prestatario: string;
  fechaI: string;
  fechaF: string;
  correo: string;
  serviciosOfrecidos: string;
  tarifasAcordadas: number;
  condicionesContractuales: string;
  notificacionesVencimiento: boolean;
  contrato: string;
}
const contratos: Array<IContratos> = [
  {
    id: 1,
    prestatario: "prestatario A",
    fechaI: "2023-10-01",
    fechaF: "2023-12-31",
    correo: "prestatarioA@example.com",
    serviciosOfrecidos: "Servicio de consultoría",
    tarifasAcordadas: 1000,
    condicionesContractuales: "Pago mensual",
    notificacionesVencimiento: true,
    contrato: "https://example.com/documentos/contrato1.pdf",
  },
];

export type { IContratos };
export default contratos;
