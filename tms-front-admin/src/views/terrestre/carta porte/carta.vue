<template>
  <div class="container mt-4">
    <h1 class="mb-4">Formulario Simplificado</h1>

    <form
      id="formularioSimplificado"
      class="needs-validation"
      novalidate
      @submit.prevent="submitForm"
    >
      <div class="card mb-4">
        <div class="card-header text-white">
          <h2 class="mb-0 my-4 py-4">Datos del Cliente</h2>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-4 mb-3">
              <label for="nombre" class="form-label">Nombre</label>
              <input
                type="text"
                class="form-control"
                id="nombre"
                v-model="formData.nombre"
                required
              />
              <div class="invalid-feedback">Este campo es obligatorio</div>
            </div>
            <div class="col-md-4 mb-3">
              <label for="fecha" class="form-label">Fecha</label>
              <input
                type="date"
                class="form-control"
                id="fecha"
                v-model="formData.fecha"
                required
              />
              <div class="invalid-feedback">Este campo es obligatorio</div>
            </div>
            <div class="col-md-4 mb-3">
              <label for="contacto" class="form-label">Contacto</label>
              <input
                type="text"
                class="form-control"
                id="contacto"
                v-model="formData.contacto"
                required
              />
              <div class="invalid-feedback">Este campo es obligatorio</div>
            </div>
          </div>
        </div>
      </div>
      <div class="card mb-4">
        <div class="card-header text-white">
          <h2 class="mb-0 my-4 py-4">Datos Fiscales</h2>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-4 mb-3">
              <label for="subtotal" class="form-label">Subtotal</label>
              <input
                type="number"
                step="0.01"
                class="form-control"
                id="subtotal"
                v-model="formData.subtotal"
                required
              />
              <div class="invalid-feedback">Este campo es obligatorio</div>
            </div>
            <div class="col-md-4 mb-3">
              <label for="impuestos" class="form-label">Impuestos</label>
              <input
                type="number"
                step="0.01"
                class="form-control"
                id="impuestos"
                v-model="formData.impuestos"
                required
              />
              <div class="invalid-feedback">Este campo es obligatorio</div>
            </div>
            <div class="col-md-4 mb-3">
              <label for="total" class="form-label">Total</label>
              <input
                type="number"
                step="0.01"
                class="form-control"
                id="total"
                v-model="calcularTotal"
                readonly
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Botón de Envío -->
      <div class="d-grid gap-2 col-md-6 mx-auto mb-4">
        <button
          type="submit"
          class="btn btn-primary btn-lg"
          :disabled="loading"
        >
          <span v-if="!loading">Enviar Carta Porte</span>
          <span v-if="loading">
            Enviando...
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useCartasPorteStore } from "@/stores/cartasPorte";
import type { ICartaPorte } from "@/core/data/cartasPorte";
import Swal from "sweetalert2/dist/sweetalert2.js";

const cartasPorteStore = useCartasPorteStore();

const formData = ref<ICartaPorte>({
  id: 0,
  nombre: "",
  fecha: "",
  contacto: "",
  subtotal: 0,
  impuestos: 0,
  total: 0,
});

const calcularTotal = computed(() => {
  const subtotal = formData.value.subtotal || 0;
  const impuestos = formData.value.impuestos || 0;
  return subtotal + impuestos;
});

const formSubmitted = ref(false);
const formValid = ref(false);
const loading = ref(false);

const submitForm = async () => {
  const form = document.getElementById(
    "formularioSimplificado",
  ) as HTMLFormElement;
  formValid.value = form.checkValidity();

  if (formValid.value) {
    loading.value = true;

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      formData.value.total = calcularTotal.value;

      cartasPorteStore.addCartaPorte(formData.value);

      Swal.fire({
        text: "Formulario enviado correctamente!",
        icon: "success",
        buttonsStyling: false,
        confirmButtonText: "Ok, entendido",
        customClass: {
          confirmButton: "btn btn-primary",
        },
      });

      formData.value = {
        id: 0,
        nombre: "",
        fecha: "",
        contacto: "",
        subtotal: 0,
        impuestos: 0,
        total: 0,
      };
      formSubmitted.value = true;
    } catch (error) {
      console.error("Error al enviar el formulario:", error);

      Swal.fire({
        text: "Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.",
        icon: "error",
        buttonsStyling: false,
        confirmButtonText: "Ok, entendido",
        customClass: {
          confirmButton: "btn btn-primary",
        },
      });
    } finally {
      loading.value = false;
    }
  } else {
    form.reportValidity();
  }
};
</script>
