interface ILocalidad {
  id: number;
  name: string;
  municipio: string;
}

const localidades: Array<ILocalidad> = [
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Localidad1",
    municipio: "Municipio1",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Localidad2",
    municipio: "Municipio2",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Localidad3",
    municipio: "Municipio3",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Localidad4",
    municipio: "Municipio4",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Localidad5",
    municipio: "Municipio5",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Localidad6",
    municipio: "Municipio6",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Localidad7",
    municipio: "Municipio7",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Localidad8",
    municipio: "Municipio8",
  },
];

export type { ILocalidad };

export default localidades;
