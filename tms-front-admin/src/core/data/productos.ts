interface IProducts {
  id: number;
  nombredelproducto: string;
  descripion: string;
  categoria: string;
  módulo: string;
  nombre: string;
  apellidos: string;
  correo: string;
  teléfono: string;
}
const productos: Array<IProducts> = [
  {
    id: 1,
    nombredelproducto: "Hotel San Quintín",
    descripion: "Gran hotel de 5 estrellas, confort y más",
    categoria: "hoteles",
    módulo: "terrestre",
    nombre: "Pedro",
    apellidos: "Sánchez",
    correo: "pedro.sanchez@example.com",
    teléfono: "555-1122",
  },
  {
    id: 2,
    nombredelproducto: "Hotel Playa Dorada",
    descripion: "Hotel frente al mar con vista al océano",
    categoria: "hoteles",
    módulo: "terrestre",
    nombre: "María",
    apellidos: "Gómez",
    correo: "maria.gomez@example.com",
    teléfono: "555-3344",
  },
  {
    id: 3,
    nombredelproducto: "Tour por la Selva",
    descripion: "Aventura en la selva con guía experto",
    categoria: "experiencias",
    módulo: "terrestre",
    nombre: "Carlos",
    apellidos: "López",
    correo: "carlos.lopez@example.com",
    teléfono: "555-5566",
  },
  {
    id: 4,
    nombredelproducto: "Buceo en el Caribe",
    descripion: "Exploración de arrecifes de coral",
    categoria: "experiencias",
    módulo: "marítima",
    nombre: "Ana",
    apellidos: "Martínez",
    correo: "ana.martinez@example.com",
    teléfono: "555-7788",
  },
  {
    id: 5,
    nombredelproducto: "Transfer Aeropuerto-Hotel",
    descripion: "Servicio de traslado privado",
    categoria: "transfer",
    módulo: "terrestre",
    nombre: "Luis",
    apellidos: "Rodríguez",
    correo: "luis.rodriguez@example.com",
    teléfono: "555-9900",
  },
  {
    id: 6,
    nombredelproducto: "Transfer Puerto-Ciudad",
    descripion: "Traslado desde el puerto al centro de la ciudad",
    categoria: "transfer",
    módulo: "marítima",
    nombre: "Sofía",
    apellidos: "Hernández",
    correo: "sofia.hernandez@example.com",
    teléfono: "555-2233",
  },
  {
    id: 7,
    nombredelproducto: "Tienda de Souvenirs",
    descripion: "Productos artesanales y recuerdos",
    categoria: "tiendas",
    módulo: "terrestre",
    nombre: "Elena",
    apellidos: "García",
    correo: "elena.garcia@example.com",
    teléfono: "555-4455",
  },
  {
    id: 8,
    nombredelproducto: "Tienda Duty-Free",
    descripion: "Productos libres de impuestos en el aeropuerto",
    categoria: "tiendas",
    módulo: "aérea",
    nombre: "Jorge",
    apellidos: "Ruiz",
    correo: "jorge.ruiz@example.com",
    teléfono: "555-6677",
  },
  {
    id: 9,
    nombredelproducto: "Hotel Montaña Azul",
    descripion: "Hotel en la montaña con spa y sauna",
    categoria: "hoteles",
    módulo: "terrestre",
    nombre: "Carmen",
    apellidos: "Vega",
    correo: "carmen.vega@example.com",
    teléfono: "555-8899",
  },
  {
    id: 10,
    nombredelproducto: "Vuelo en Globo",
    descripion: "Experiencia única sobrevolando el valle",
    categoria: "experiencias",
    módulo: "aérea",
    nombre: "Isabel",
    apellidos: "Morales",
    correo: "isabel.morales@example.com",
    teléfono: "555-1122",
  },
];

export type { IProducts };
export default productos;
