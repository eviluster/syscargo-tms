// ordenesStore.ts
import ordenes, { type IOrdenesC } from "@/core/data/ordenesDecarga";
import { defineStore } from "pinia";

export const useordenesStore = defineStore("ordenes", {
  state: () => ({
    ordenes: ordenes,
  }),
  actions: {
    addOrden(orden: IOrdenesC) {
      orden.id = this.ordenes.length + 1;
      this.ordenes.push(orden);
    },

    updateOrden(updateOrden: IOrdenesC) {
      const index = this.ordenes.findIndex((o) => o.id === updateOrden.id);
      if (index !== -1) {
        this.ordenes[index] = updateOrden;
      }
    },
  },
  getters: {
    getProducts: (state) => state.ordenes,
  },
});
