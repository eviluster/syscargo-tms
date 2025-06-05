interface IMunicipio {
  id: number;
  name: string;
  provincia: string;
}

const municipios: Array<IMunicipio> = [
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Arroyo Naranjo",
    provincia: "La Habana",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Boyeros",
    provincia: "La Habana",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Centro Habana",
    provincia: "La Habana",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Cerro",
    provincia: "La Habana",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Caimito",
    provincia: "Artemisa",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Alquízar",
    provincia: "Artemisa",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Bauta",
    provincia: "Artemisa",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Esmeralda",
    provincia: "Camagüey",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Minas",
    provincia: "Camagüey",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Guáimaro",
    provincia: "Camagüey",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Cárdenas ",
    provincia: "Matanzas",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Colón",
    provincia: "Matanzas",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Martí",
    provincia: "Matanzas",
  },
];

export type { IMunicipio };

export default municipios;
