import choferes, { type IChoferes } from "@/core/data/choferes";
import { defineStore } from "pinia";

export const useChoferesStore = defineStore("choferes", {
  state: () => ({
    choferes: choferes,
  }),
  actions: {
    addChofer(chofer: IChoferes) {
      chofer.id = this.choferes.length + 1;
      this.choferes.push(chofer);
      console.log("Choferes:", this.choferes);
    },

    updateChofer(updateChofer: IChoferes) {
      const index = this.choferes.findIndex((o) => o.id === updateChofer.id);
      if (index !== -1) {
        this.choferes[index] = updateChofer;
        console.log("Oferta actualizada en el store:", updateChofer);
      } else {
        console.error("Oferta no encontrada para actualizar");
      }
    },
  },
  getters: {
    getProducts: (state) => state.choferes,
  },
});
