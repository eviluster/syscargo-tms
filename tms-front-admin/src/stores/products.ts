import { defineStore } from "pinia";
import productos, { type IProducts } from "@/core/data/productos";

export const useProductStore = defineStore("products", {
  state: () => ({
    products: productos,
  }),
  actions: {
    addProduct(product: IProducts) {
      product.id = this.products.length + 1;
      this.products.push(product);
      console.log("Productos en el store:", this.products);
    },
  },
  getters: {
    getProducts: (state) => state.products,
  },
});
