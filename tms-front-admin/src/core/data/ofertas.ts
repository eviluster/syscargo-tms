interface IOferta {
  id: number;
  codigo: string;
  hotel: string;
  tipooferta: string;
  date: string;
}

const ofertas: Array<IOferta> = [
  {
    id: Math.floor(Math.random() * 99999) + 1,
    codigo: "qweqwas876",
    hotel: "Hotel1",
    tipooferta: "tipo1",
    date: "14 Dec 2020, 8:43 pm",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    codigo: "9asd9",
    hotel: "Hotel2",
    tipooferta: "tipo2",
    date: "01 Dec 2020, 10:12 am",
  },
];

export type { IOferta };

export default ofertas;
