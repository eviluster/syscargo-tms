import ofertasT, { type IOfertasT } from "@/core/data/ofertasTransfer";
import { defineStore } from "pinia";

export const useOfertastore = defineStore("ofertas", {
  state: () => ({
    ofertas: ofertasT,
  }),
  actions: {
    AddOferta(product: IOfertasT) {
      product.id = this.ofertas.length + 1;
      this.ofertas.push(product);
      console.log("Productos en el store:", this.ofertas);
    },

    // Nueva acción para actualizar una oferta
    updateOferta(updatedOferta: IOfertasT) {
      const index = this.ofertas.findIndex((o) => o.id === updatedOferta.id);
      if (index !== -1) {
        this.ofertas[index] = updatedOferta;
        console.log("Oferta actualizada en el store:", updatedOferta);
      } else {
        console.error("Oferta no encontrada para actualizar");
      }
    },
  },
  getters: {
    getProducts: (state) => state.ofertas,
  },
});
