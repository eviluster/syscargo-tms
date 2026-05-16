import { defineStore } from "pinia";
import { type ITransportistas } from "@/core/data/transportistas";
import api from "@/services/api";

export const useTransportistasStore = defineStore("transportistas", {
  state: () => ({
    transportistas: [] as ITransportistas[],
  }),
  actions: {
    async fetchTransportistas() {
      try {
        const res = await api.get("/prestatario/all");
        const data = Array.isArray(res.data) ? res.data : [];
        this.transportistas = data.map((p: any) => ({
          id: p.id,
          nombre: p.user?.name || p.name || "",
          telefono: p.user?.phone || p.phone || "",
          correo: p.user?.email || p.email || "",
          estado: "Activo",
          tipoServicio: p.servicios?.join(", ") || "Transporte",
          ...p,
        }));
      } catch (error) {
        console.error("Error fetchTransportistas:", error);
        this.transportistas = [];
      }
    },
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
