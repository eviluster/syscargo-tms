import { defineStore } from "pinia";
import ordenesCarga from "@/core/data/ordenesCarga";
import type { IOrdenCarga } from "@/core/data/ordenesCarga";
import { ref } from "vue";

export const useOrdenesCargaStore = defineStore("ordenesCarga", () => {
  const ordenesCargaList = ref<IOrdenCarga[]>(ordenesCarga);

  const agregarOrdenCarga = (orden: IOrdenCarga) => {
    orden.id = ordenesCargaList.value.length + 1;
    ordenesCargaList.value.push(orden);
  };

  const obtenerOrdenesCarga = () => {
    return ordenesCargaList.value;
  };

  const eliminarOrdenCarga = (id: number) => {
    ordenesCargaList.value = ordenesCargaList.value.filter(
      (orden) => orden.id !== id,
    );
  };

  const updateOrdenCarga = (updateOrden: IOrdenCarga) => {
    const index = ordenesCargaList.value.findIndex(
      (o) => o.id === updateOrden.id,
    );
    if (index !== -1) {
      ordenesCargaList.value[index] = updateOrden;
      console.log("Orden de carga actualizada en el store:", updateOrden);
    } else {
      console.error("Orden de carga no encontrada para actualizar");
    }
  };

  return {
    ordenesCarga: ordenesCargaList,
    agregarOrdenCarga,
    obtenerOrdenesCarga,
    eliminarOrdenCarga,
    updateOrdenCarga,
  };
});
