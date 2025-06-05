import { defineStore } from "pinia";
import { ref } from "vue";

export const useAppStore = defineStore("app", () => {
  const categoriaSeleccionada = ref(); // Valor inicial

  return { categoriaSeleccionada };
});
