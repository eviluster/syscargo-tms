import { defineStore } from "pinia";
import transportistas, {
  type ITransportistas,
} from "@/core/data/transportistas";

export const useTransportistasStore = defineStore("transportistas", {
  state: () => ({
    transportistas: transportistas,
  }),
  actions: {
    addTransportista(transportista: ITransportistas) {
      transportista.id = this.transportistas.length + 1;
      this.transportistas.push(transportista);
      console.log("Transportista añadido:", transportista);
    },
    updateTransportista(updatedTransportista: ITransportistas) {
      const index = this.transportistas.findIndex(
        (t) => t.id === updatedTransportista.id,
      );
      if (index !== -1) {
        this.transportistas[index] = updatedTransportista;
        console.log("Transportista actualizado:", updatedTransportista);
      } else {
        console.error("Transportista no encontrado para actualizar");
      }
    },
  },
  getters: {
    getTransportistas: (state) => state.transportistas,
  },
});
