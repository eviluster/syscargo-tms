import { defineStore } from "pinia";
import api from "@/services/api";

interface ITipoviaje {
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

export const useTipoviajeStore = defineStore("tipoviaje", {
  state: () => ({
    tipoviajees: [] as ITipoviaje[],
  }),
  actions: {
    async fetchTipoviajes() {
      try {
        const { data } = await api.get("/tipoviaje/all");
        console.log("Datos:", data);
        this.tipoviajees = [...data.data];
      } catch (error) {
        console.error("Error al obtener los tipoviajees:", error);
      }
    },

    async addTipoviaje(tipoviaje: any) {
      console.log("Tipoviaje a agregar:", tipoviaje);

      const payload = {
        ...tipoviaje,
      };

      console.log("Payload:", payload);
      try {
        const { data } = await api.post("/tipoviaje", payload);
        await this.fetchTipoviajes();
        return data;
      } catch (error) {
        console.error("Error al crear el tipoviaje:", error);
        throw error;
      }
    },

    async updateTipoviaje(tipoviaje: ITipoviaje) {
      const payload = {
        ...tipoviaje,
      };
      console.log(payload);

      try {
        const { data } = await api.patch("/tipoviaje", payload);
        const index = this.tipoviajees.findIndex(
          (item: any) => item.id === tipoviaje.id,
        );

        if (index !== -1) {
          this.tipoviajees.splice(index, 1, data.data);
        }
        return data;
      } catch (error) {
        console.error("Error al actualizar el tipoviaje:", error);
        throw error;
      }
    },

    async deleteTipoviaje(id: string) {
      try {
        const { data } = await api.delete("/tipoviaje", { data: { id } });
        await this.fetchTipoviajes();
        return data;
      } catch (error) {
        console.error("Error al eliminar el tipoviaje:", error);
        throw error;
      }
    },
  },
});
