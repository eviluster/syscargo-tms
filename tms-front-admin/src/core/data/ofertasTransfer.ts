interface IOfertasT {
  id: number;
  producto: string;
  idioma: string;
  nombre: string;
  periodo: [Date, Date];
  descripcion: string;
  diasVentaSemana: string[];
}
const ofertasT: Array<IOfertasT> = [
  {
    id: 1,
    producto: "Sedán",
    idioma: "Español",
    nombre: "Sedán Económico",
    periodo: [new Date("2024-10-01"), new Date("2024-10-31")],
    descripcion: "Alquiler de sedanes económicos con descuento especial.",
    diasVentaSemana: ["Lunes", "Miércoles", "Viernes"],
  },
  {
    id: 2,
    producto: "SUV",
    idioma: "Español",
    nombre: "SUV Familiar",
    periodo: [new Date("2024-10-05"), new Date("2024-11-05")],
    descripcion: "Alquiler de SUVs ideales para familias con descuento.",
    diasVentaSemana: [
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
      "Domingo",
    ],
  },
  {
    id: 3,
    producto: "Deportivo",
    idioma: "Español",
    nombre: "Deportivo de Lujo",
    periodo: [new Date("2024-10-10"), new Date("2024-11-10")],
    descripcion: "Alquiler de autos deportivos de lujo con tarifas especiales.",
    diasVentaSemana: ["Martes", "Jueves", "Sábado"],
  },
  {
    id: 4,
    producto: "Camioneta",
    idioma: "Español",
    nombre: "Camioneta de Trabajo",
    periodo: [new Date("2024-10-15"), new Date("2024-11-15")],
    descripcion: "Alquiler de camionetas para trabajo con descuentos.",
    diasVentaSemana: ["Lunes", "Miércoles", "Viernes"],
  },
  {
    id: 5,
    producto: "Híbrido",
    idioma: "Español",
    nombre: "Coche Híbrido",
    periodo: [new Date("2024-10-20"), new Date("2024-11-20")],
    descripcion: "Alquiler de coches híbridos con tarifas ecológicas.",
    diasVentaSemana: [
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
      "Domingo",
    ],
  },
  {
    id: 6,
    producto: "Furgoneta",
    idioma: "Español",
    nombre: "Furgoneta de Carga",
    periodo: [new Date("2024-10-25"), new Date("2024-11-25")],
    descripcion: "Alquiler de furgonetas de carga con descuentos especiales.",
    diasVentaSemana: ["Martes", "Jueves", "Sábado"],
  },
  {
    id: 7,
    producto: "Compacto",
    idioma: "Español",
    nombre: "Coche Compacto",
    periodo: [new Date("2024-11-01"), new Date("2024-11-30")],
    descripcion:
      "Alquiler de coches compactos para ciudad con tarifas reducidas.",
    diasVentaSemana: ["Lunes", "Miércoles", "Viernes"],
  },
  {
    id: 8,
    producto: "Pickup",
    idioma: "Español",
    nombre: "Pickup 4x4",
    periodo: [new Date("2024-11-05"), new Date("2024-12-05")],
    descripcion: "Alquiler de pickups 4x4 para aventuras off-road.",
    diasVentaSemana: [
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
      "Domingo",
    ],
  },
  {
    id: 9,
    producto: "Limusina",
    idioma: "Español",
    nombre: "Limusina de Lujo",
    periodo: [new Date("2024-11-10"), new Date("2024-12-10")],
    descripcion: "Alquiler de limusinas para eventos especiales.",
    diasVentaSemana: ["Viernes", "Sábado", "Domingo"],
  },
  {
    id: 10,
    producto: "Motocicleta",
    idioma: "Español",
    nombre: "Motocicleta Urbana",
    periodo: [new Date("2024-11-15"), new Date("2024-12-15")],
    descripcion: "Alquiler de motocicletas para movilidad urbana.",
    diasVentaSemana: ["Lunes", "Miércoles", "Viernes"],
  },
];

export type { IOfertasT };
export default ofertasT;
