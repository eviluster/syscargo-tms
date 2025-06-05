interface IHotel {
  id: number;
  name: string;
  provincia: string;
  cadenahotelera: string;
  datecreacion: string;
}

const hoteles: Array<IHotel> = [
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Hotel1",
    provincia: "La Habana",
    cadenahotelera: "Islazul",
    datecreacion: "01 Dec 2020, 10:12 am",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Hotel2",
    provincia: "La Habana",
    cadenahotelera: "Islazul",
    datecreacion: "01 Dec 2020, 10:12 am",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Hotel3",
    provincia: "La Habana",
    cadenahotelera: "Islazul",
    datecreacion: "01 Dec 2020, 10:12 am",
  },
];

export type { IHotel };

export default hoteles;
