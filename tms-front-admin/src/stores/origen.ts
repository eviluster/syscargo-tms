import { defineStore } from "pinia";
import api from "@/services/api";

interface IOrigen {
  id: string;
  name: {
    es: string;
    en: string;
  };
  description: {
    es: string;
    en: string;
  };
}

export const useOrigenStore = defineStore("origen", {
  state: () => ({
    origenes: [] as IOrigen[],
  }),
  actions: {
    async fetchOrigens() {
      try {
        const { data } = await api.get("/origen/all");
        console.log("Datos:", data);
        this.origenes = [...data.data];
      } catch (error) {
        console.error("Error al obtener los origenes:", error);
      }
    },

    async addOrigen(origen: any) {
      console.log("Origen a agregar:", origen);

      const payload = {
        ...origen,
      };

      console.log("Payload:", payload);
      try {
        const { data } = await api.post("/origen", payload);
        await this.fetchOrigens();
        return data;
      } catch (error) {
        console.error("Error al crear el origen:", error);
        throw error;
      }
    },

    async updateOrigen(origen: IOrigen) {
      const payload = {
        ...origen,
      };
      console.log(payload);

      try {
        const { data } = await api.patch("/origen", payload);
        const index = this.origenes.findIndex(
          (item: any) => item.id === origen.id,
        );

        if (index !== -1) {
          this.origenes.splice(index, 1, data.data);
        }
        return data;
      } catch (error) {
        console.error("Error al actualizar el origen:", error);
        throw error;
      }
    },

    async deleteOrigen(id: string) {
      try {
        const { data } = await api.delete("/origen", { data: { id } });
        await this.fetchOrigens();
        return data;
      } catch (error) {
        console.error("Error al eliminar el origen:", error);
        throw error;
      }
    },
  },
});
