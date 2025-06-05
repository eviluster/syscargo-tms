import vehiculos, { type IVehiculos } from "@/core/data/vehiculos";
import { defineStore } from "pinia";

export const useVehiculosStore = defineStore("vehiculos", {
  state: () => ({
    vehiculos: vehiculos,
  }),
  actions: {
    addVehiculo(vehiculo: IVehiculos) {
      vehiculo.id = this.vehiculos.length + 1;
      this.vehiculos.push(vehiculo);
      console.log("Vehículos:", this.vehiculos);
    },

    updateVehiculo(updateVehiculo: IVehiculos) {
      const index = this.vehiculos.findIndex((v) => v.id === updateVehiculo.id);
      if (index !== -1) {
        this.vehiculos[index] = updateVehiculo;
        console.log("Vehículo actualizado en el store:", updateVehiculo);
      } else {
        console.error("Vehículo no encontrado para actualizar");
      }
    },
  },
  getters: {
    getVehiculos: (state) => state.vehiculos,
  },
});
