interface IProvincia {
  id: number;
  name: string;
  pais: string;
}

const provincias: Array<IProvincia> = [
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Pinar del Río",
    pais: "Cuba",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Artemisa",
    pais: "Cuba",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "La Habana",
    pais: "Cuba",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Mayabeque",
    pais: "Cuba",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Matanzas",
    pais: "Cuba",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Cienfuegos",
    pais: "Cuba",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Villa Clara",
    pais: "Cuba",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Sancti Spíritus",
    pais: "Cuba",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Ciego de Ávila",
    pais: "Cuba",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Camagüey",
    pais: "Cuba",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Las Tunas",
    pais: "Cuba",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Holguín",
    pais: "Cuba",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Granma",
    pais: "Cuba",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Santiago de Cuba",
    pais: "Cuba",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Guantánamo",
    pais: "Cuba",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Isla de la Juventud",
    pais: "Cuba",
  },
];

export type { IProvincia };

export default provincias;
