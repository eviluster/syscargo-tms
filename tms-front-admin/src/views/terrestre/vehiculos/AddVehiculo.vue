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
            <!-- Campo para el nombre del vehículo -->
            <div class="mb-4 px-4 py-4 col-5 mx-6">
              <label class="required form-label">Nombre</label>
              <Field
                name="nombre"
                as="input"
                type="text"
                class="form-control"
                placeholder="Nombre del vehículo"
              />
              <ErrorMessage name="nombre" class="text-danger" />
            </div>

            <!-- Campo para el modelo del vehículo -->
            <div class="mb-4 px-4 py-4 col-5 mx-6">
              <label class="required form-label">Modelo</label>
              <Field
                name="modelo"
                as="input"
                type="text"
                class="form-control"
                placeholder="Modelo del vehículo"
              />
              <ErrorMessage name="modelo" class="text-danger" />
            </div>

            <!-- Campo para la matrícula del vehículo -->
            <div class="mb-4 px-4 py-4 col-5 mx-6">
              <label class="required form-label">Matrícula</label>
              <Field
                name="matricula"
                as="input"
                type="text"
                class="form-control"
                placeholder="Matrícula del vehículo"
              />
              <ErrorMessage name="matricula" class="text-danger" />
            </div>

            <!-- Campo para el conductor del vehículo -->
            <div class="mb-4 px-4 py-4 col-5 mx-6">
              <label class="required form-label">Conductor</label>
              <Field
                name="conductor"
                as="input"
                type="text"
                class="form-control"
                placeholder="Conductor del vehículo"
              />
              <ErrorMessage name="conductor" class="text-danger" />
            </div>

            <!-- Campo para el último viaje con km -->
            <div class="mb-4 px-4 py-4 col-5 mx-6">
              <label class="required form-label">Último viaje con km</label>
              <Field
                name="ultimoViajeKm"
                as="input"
                type="number"
                class="form-control"
                placeholder="Último viaje con km"
              />
              <ErrorMessage name="ultimoViajeKm" class="text-danger" />
            </div>
          </div>
        </div>
        <!-- Botones de acción -->
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
import { type IVehiculos } from "@/core/data/vehiculos";
import { useVehiculosStore } from "@/stores/vehiculos";
import Swal from "sweetalert2/dist/sweetalert2.js";

// Interfaz para los valores del formulario
interface FormValues {
  nombre: string;
  modelo: string;
  matricula: string;
  conductor: string;
  ultimoViajeKm: number;
}

export default defineComponent({
  name: "AddVehiculo",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  setup() {
    const vehiculosStore = useVehiculosStore();
    const loading = ref(false);

    // Esquema de validación con Yup
    const schema = yup.object({
      nombre: yup.string().required("El nombre es requerido"),
      modelo: yup.string().required("El modelo es requerido"),
      matricula: yup.string().required("La matrícula es requerida"),
      conductor: yup.string().required("El conductor es requerido"),
      ultimoViajeKm: yup
        .number()
        .required("El último viaje con km es requerido"),
    });

    const handleSubmit = async (
      values: FormValues,
      { resetForm }: { resetForm: () => void },
    ) => {
      loading.value = true;
      try {
        const newVehiculo: IVehiculos = {
          id: vehiculosStore.vehiculos.length + 1,
          nombre: values.nombre,
          modelo: values.modelo,
          matricula: values.matricula,
          conductor: values.conductor,
          estado: "Activo", // Estado por defecto
          ultimoViajeKm: values.ultimoViajeKm,
        };
        await new Promise((resolve) => setTimeout(resolve, 2000));
        vehiculosStore.addVehiculo(newVehiculo);
        console.log("Vehículo agregado:", newVehiculo);
        Swal.fire({
          text: "Vehículo guardado exitosamente!",
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
        console.error("Error al agregar el vehículo:", error);
        Swal.fire({
          text: "Hubo un error al guardar el vehículo. Por favor, inténtalo de nuevo.",
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
