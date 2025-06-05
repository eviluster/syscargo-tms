import reservas, { type IReservaciones } from "@/core/data/reservaciones";
import { defineStore } from "pinia";

export const useReservasStore = defineStore("reservas", {
  state: () => ({
    reservas: reservas,
  }),
  actions: {
    addReserva(product: IReservaciones) {
      product.id = this.reservas.length + 1;
      this.reservas.push(product);
      console.log("Productos en el store:", this.reservas);
    },

    updateReserva(updateReserva: IReservaciones) {
      const index = this.reservas.findIndex((o) => o.id === updateReserva.id);
      if (index !== -1) {
        this.reservas[index] = updateReserva;
        console.log("Oferta actualizada en el store:", updateReserva);
      } else {
        console.error("Oferta no encontrada para actualizar");
      }
    },
  },
  getters: {
    getProducts: (state) => state.reservas,
  },
});
