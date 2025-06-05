// src/core/data/cartasPorte.ts
interface ICartaPorte {
  id: number;
  nombre: string;
  fecha: string;
  contacto: string;
  subtotal: number;
  impuestos: number;
  total: number;
}

const cartasPorte: Array<ICartaPorte> = [
  {
    id: 1,
    nombre: "Carta Porte 1",
    fecha: "2023-10-01",
    contacto: "contacto1@example.com",
    subtotal: 1000,
    impuestos: 160,
    total: 1160,
  },
  {
    id: 2,
    nombre: "Carta Porte 2",
    fecha: "2023-10-02",
    contacto: "contacto2@example.com",
    subtotal: 2000,
    impuestos: 320,
    total: 2320,
  },
];

export type { ICartaPorte };
export default cartasPorte;
