interface IClasificacionH {
  id: number;
  name: string;
  descripcion: string;
}

const clasificacionesH: Array<IClasificacionH> = [
  // {
  //   id: Math.floor(Math.random() * 99999) + 1,
  //   name: "AP",
  //   descripcion: "Desayuno y una comida a elección del cliente",
  // },
  // {
  //   id: Math.floor(Math.random() * 99999) + 1,
  //   name: "AP NRF",
  //   descripcion: "Alojamiento, desayuno, almuerzo y cena. Tarifa No Reembolsable",
  // },
  // {
  //   id: Math.floor(Math.random() * 99999) + 1,
  //   name: "CP NRF",
  //   descripcion: "Alojamiento y Desayuno. Tarifa No Reembolsable",
  // },
  // {
  //   id: Math.floor(Math.random() * 99999) + 1,
  //   name: "EP NRF",
  //   descripcion: "Solo Alojamiento. Tarifa No Reembolsable",
  // },
  // {
  //   id: Math.floor(Math.random() * 99999) + 1,
  //   name: "MAP NRF",
  //   descripcion: "Alojamiento, desayuno y una comida a elección del cliente. Tarifa No Reembolsable",
  // },
];

export type { IClasificacionH };

export default clasificacionesH;
