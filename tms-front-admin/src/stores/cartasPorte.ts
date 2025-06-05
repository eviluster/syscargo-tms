// src/stores/cartasPorte.ts
import { defineStore } from "pinia";
import cartasPorte, { type ICartaPorte } from "@/core/data/cartasPorte";

export const useCartasPorteStore = defineStore("cartasPorte", {
  state: () => ({
    cartasPorte: cartasPorte,
  }),
  actions: {
    // Añadir una nueva Carta Porte
    addCartaPorte(cartaPorte: ICartaPorte) {
      cartaPorte.id = this.cartasPorte.length + 1; // Asignar un ID único
      this.cartasPorte.push(cartaPorte);
      console.log("Carta Porte añadida:", cartaPorte);
    },

    // Actualizar una Carta Porte existente
    updateCartaPorte(updatedCartaPorte: ICartaPorte) {
      const index = this.cartasPorte.findIndex(
        (c) => c.id === updatedCartaPorte.id,
      );
      if (index !== -1) {
        this.cartasPorte[index] = updatedCartaPorte;
        console.log("Carta Porte actualizada:", updatedCartaPorte);
      } else {
        console.error("Carta Porte no encontrada para actualizar");
      }
    },

    // Eliminar una Carta Porte
    deleteCartaPorte(id: number) {
      this.cartasPorte = this.cartasPorte.filter((c) => c.id !== id);
      console.log("Carta Porte eliminada:", id);
    },
  },
  getters: {
    getCartasPorte: (state) => state.cartasPorte,
  },
});
