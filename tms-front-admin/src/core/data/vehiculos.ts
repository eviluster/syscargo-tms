interface IVehiculos {
  id: number;
  nombre: string;
  modelo: string;
  matricula: string;
  conductor: string;
  estado: string;
  ultimoViajeKm: number;
}
const vehiculos: Array<IVehiculos> = [
  {
    id: 1,
    nombre: "Camión Volvo",
    modelo: "Volvo FH16",
    matricula: "TRC123",
    conductor: "Juan Pérez",
    estado: "Activo",
    ultimoViajeKm: 1200,
  },
  {
    id: 2,
    nombre: "Camión Scania",
    modelo: "Scania R500",
    matricula: "TRC456",
    conductor: "Carlos López",
    estado: "En mantenimiento",
    ultimoViajeKm: 800,
  },
];

// Función para generar un número aleatorio entre un rango
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Aumentar el arreglo a 20 elementos
for (let i = 3; i <= 20; i++) {
  const baseIndex = i % 2; // Alternar entre los dos vehículos base
  const vehiculoBase = vehiculos[baseIndex];

  vehiculos.push({
    id: i,
    nombre: `${vehiculoBase.nombre} ${i}`,
    modelo: `${vehiculoBase.modelo} ${i}`,
    matricula: `TRC${getRandomInt(100, 999)}`,
    conductor: `Conductor ${i}`,
    estado: i % 2 === 0 ? "Activo" : "En mantenimiento",
    ultimoViajeKm: getRandomInt(500, 1500),
  });
}

console.log(vehiculos);

export type { IVehiculos };
export default vehiculos;
