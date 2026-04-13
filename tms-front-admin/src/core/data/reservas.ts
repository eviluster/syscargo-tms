import { getAssetPath } from "@/core/helpers/assets";

interface IReserva {
  id: number;
  nombrecliente: string;
  email: string;
  numerofactura: string;
  estado: {
    color: string;
    label: string;
  };
  datecreacion: string;
}

const reservas: Array<IReserva> = [
  {
    id: Math.floor(Math.random() * 99999) + 1,
    nombrecliente: "Emma Smith",
    email: "e.smith@kpmg.com.au",
    numerofactura: "wd2323d",
    estado: {
      color: "warning",
      label: "Cancelado",
    },
    datecreacion: "14 Dec 2020, 8:43 pm",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    nombrecliente: "Melody Macy",
    email: "melody@altbox.com",
    numerofactura: "32d23d23d",
    estado: {
      color: "success",
      label: "Pagado",
    },
    datecreacion: "01 Dec 2020, 10:12 am",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    nombrecliente: "Max Smith",
    email: "max@kt.com",
    numerofactura: "U23d23n",
    estado: {
      color: "success",
      label: "Pagado",
    },
    datecreacion: "12 Nov 2020, 2:01 pm",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    nombrecliente: "Sean Bean",
    email: "sean@dellito.com",
    numerofactura: "2836284",
    estado: {
      color: "warning",
      label: "Cancelado",
    },
    datecreacion: "21 Oct 2020, 5:54 pm",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    nombrecliente: "Brian Cox",
    email: "brian@exchange.com",
    numerofactura: "2332",
    estado: {
      color: "primary",
      label: "Por pagar",
    },
    datecreacion: "19 Oct 2020, 7:32 am",
  },
];

export type { IReserva };

export default reservas;
