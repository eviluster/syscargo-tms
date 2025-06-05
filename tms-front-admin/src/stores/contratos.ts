import contratos, { type IContratos } from "@/core/data/contratos";
import { defineStore } from "pinia";

export const useContratosStore = defineStore("contratos", {
  state: () => ({
    contracts: contratos,
  }),
  actions: {
    addContrato(contrato: IContratos) {
      contrato.id = this.contracts.length + 1;
      this.contracts.push(contrato);
      console.log("Contratos en el store:", this.contracts);
    },
  },
  getters: {
    getProducts: (state) => state.contracts,
  },
});
