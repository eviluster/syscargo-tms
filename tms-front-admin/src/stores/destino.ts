import { defineStore } from "pinia";
import api from "@/services/api";

interface IDestino {
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

export const useDestinoStore = defineStore("destino", {
  state: () => ({
    destinoes: [] as IDestino[],
  }),
  actions: {
    async fetchDestinos() {
      try {
        const { data } = await api.get("/destino/all");
        console.log("Datos:", data);
        this.destinoes = [...data.data];
      } catch (error) {
        console.error("Error al obtener los destinoes:", error);
      }
    },

    async addDestino(destino: any) {
      console.log("Destino a agregar:", destino);

      const payload = {
        ...destino,
      };

      console.log("Payload:", payload);
      try {
        const { data } = await api.post("/destino", payload);
        await this.fetchDestinos();
        return data;
      } catch (error) {
        console.error("Error al crear el destino:", error);
        throw error;
      }
    },

    async updateDestino(destino: IDestino) {
      const payload = {
        ...destino,
      };
      console.log(payload);

      try {
        const { data } = await api.patch("/destino", payload);
        const index = this.destinoes.findIndex(
          (item: any) => item.id === destino.id,
        );

        if (index !== -1) {
          this.destinoes.splice(index, 1, data.data);
        }
        return data;
      } catch (error) {
        console.error("Error al actualizar el destino:", error);
        throw error;
      }
    },

    async deleteDestino(id: string) {
      try {
        const { data } = await api.delete("/destino", { data: { id } });
        await this.fetchDestinos();
        return data;
      } catch (error) {
        console.error("Error al eliminar el destino:", error);
        throw error;
      }
    },
  },
});
