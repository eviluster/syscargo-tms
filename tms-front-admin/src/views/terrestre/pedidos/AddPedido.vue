<template>
  <Form
    @submit="handleSubmit"
    :validation-schema="schema"
    v-slot="{ resetForm }"
  >
    <div class="row my-6">
      <div class="py-4">
        <div class="card shadow-sm">
          <div class="row">
            <div class="mb-4 px-4 py-4 col-5 mx-6">
              <label class="required form-label">Fecha de emisión</label>
              <Field
                name="fechaEmision"
                as="input"
                type="date"
                class="form-control"
              />
              <ErrorMessage name="fechaEmision" class="text-danger" />
            </div>

            <div class="mb-4 px-4 py-4 col-5 mx-6">
              <label class="required form-label">Número de documento</label>
              <Field
                name="numeroDocumento"
                as="input"
                type="text"
                class="form-control"
                placeholder="Número de documento"
              />
              <ErrorMessage name="numeroDocumento" class="text-danger" />
            </div>

            <div class="mb-4 px-4 py-4 col-5 mx-6">
              <label class="required form-label">Nombre del comprador</label>
              <Field
                name="nombreComprador"
                as="input"
                type="text"
                class="form-control"
                placeholder="Nombre completo del comprador"
              />
              <ErrorMessage name="nombreComprador" class="text-danger" />
            </div>

            <div class="mb-4 px-4 py-4 col-5 mx-6">
              <label class="required form-label">Domicilio del comprador</label>
              <Field
                name="domicilioComprador"
                as="input"
                type="text"
                class="form-control"
                placeholder="Domicilio legal del comprador"
              />
              <ErrorMessage name="domicilioComprador" class="text-danger" />
            </div>

            <div class="mb-4 px-4 py-4 col-5 mx-6">
              <label class="required form-label">Terminal portuaria</label>
              <Field
                name="terminalPortuaria"
                as="input"
                type="text"
                class="form-control"
                placeholder="Denominación de la terminal portuaria"
              />
              <ErrorMessage name="terminalPortuaria" class="text-danger" />
            </div>

            <div class="mb-4 px-4 py-4 col-5 mx-6">
              <label class="required form-label"
                >Domicilio de la terminal</label
              >
              <Field
                name="domicilioTerminal"
                as="input"
                type="text"
                class="form-control"
                placeholder="Domicilio de la terminal portuaria"
              />
              <ErrorMessage name="domicilioTerminal" class="text-danger" />
            </div>

            <div class="mb-4 px-4 py-4 col-5 mx-6">
              <label class="required form-label">Fecha de autorización</label>
              <Field
                name="fechaAutorizacion"
                as="input"
                type="date"
                class="form-control"
              />
              <ErrorMessage name="fechaAutorizacion" class="text-danger" />
            </div>

            <div class="mb-4 px-4 py-4 col-5 mx-6">
              <label class="required form-label">Tipo de producto</label>
              <Field
                name="tipoProducto"
                as="input"
                type="text"
                class="form-control"
                placeholder="Tipo de producto"
              />
              <ErrorMessage name="tipoProducto" class="text-danger" />
            </div>

            <div class="mb-4 px-4 py-4 col-5 mx-6">
              <label class="required form-label">Clase de producto</label>
              <Field
                name="claseProducto"
                as="input"
                type="text"
                class="form-control"
                placeholder="Clase de producto"
              />
              <ErrorMessage name="claseProducto" class="text-danger" />
            </div>

            <div class="mb-4 px-4 py-4 col-5 mx-6">
              <label class="required form-label">Cantidad de producto</label>
              <Field
                name="cantidadProducto"
                as="input"
                type="number"
                class="form-control"
                placeholder="Cantidad de producto"
              />
              <ErrorMessage name="cantidadProducto" class="text-danger" />
            </div>
          </div>
        </div>

        <div class="card-footer my-8 d-flex justify-content-end">
          <a href="#" class="btn btn-bg-secondary">Cancelar</a>
          <button
            type="submit"
            class="btn btn-bg-primary mx-3"
            :disabled="loading"
          >
            <span v-if="!loading">Guardar</span>
            <span v-if="loading">
              Guardando...
              <span
                class="spinner-border spinner-border-sm align-middle ms-2"
              ></span>
            </span>
          </button>
        </div>
      </div>
    </div>
  </Form>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { useOrdenesCargaStore } from "@/stores/ordenesCarga";
import type { IOrdenCarga } from "@/core/data/ordenesCarga";
import Swal from "sweetalert2/dist/sweetalert2.js";

export default defineComponent({
  name: "AddOrdenCarga",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  setup() {
    const ordenesCargaStore = useOrdenesCargaStore();
    const loading = ref(false);

    const schema = yup.object({
      fechaEmision: yup.string().required("La fecha de emisión es requerida"),
      numeroDocumento: yup
        .string()
        .required("El número de documento es requerido"),
      nombreComprador: yup
        .string()
        .required("El nombre del comprador es requerido"),
      domicilioComprador: yup
        .string()
        .required("El domicilio del comprador es requerido"),
      terminalPortuaria: yup
        .string()
        .required("La terminal portuaria es requerida"),
      domicilioTerminal: yup
        .string()
        .required("El domicilio de la terminal es requerido"),
      fechaAutorizacion: yup
        .string()
        .required("La fecha de autorización es requerida"),
      tipoProducto: yup.string().required("El tipo de producto es requerido"),
      claseProducto: yup.string().required("La clase de producto es requerida"),
      cantidadProducto: yup
        .number()
        .required("La cantidad de producto es requerida"),
    });

    const handleSubmit = async (
      values: IOrdenCarga,
      { resetForm }: { resetForm: () => void },
    ) => {
      loading.value = true;
      try {
        await ordenesCargaStore.agregarOrdenCarga(values);
        Swal.fire({
          text: "Orden de carga guardada exitosamente!",
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "Ok, entendido",
          heightAuto: false,
          customClass: {
            confirmButton: "btn btn-primary",
          },
        }).then(() => {
          resetForm();
        });
      } catch (error) {
        console.error("Error al guardar la orden de carga:", error);
        Swal.fire({
          text: "Hubo un error al guardar la orden de carga. Por favor, inténtalo de nuevo.",
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "Ok, entendido",
          heightAuto: false,
          customClass: {
            confirmButton: "btn btn-primary",
          },
        });
      } finally {
        loading.value = false;
      }
    };

    return {
      schema,
      handleSubmit,
      loading,
    };
  },
});
</script>
