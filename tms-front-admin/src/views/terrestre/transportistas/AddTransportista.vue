<template>
  <Form
    @submit="handleSubmit"
    :validation-schema="schema"
    v-slot="{ resetForm }"
  >
    <div class="row my-6">
      <div class="col-md-12">
        <div class="card shadow-sm">
          <div class="card-body row">
            <div class="mb-4 col-md-6">
              <label class="required form-label">Nombre</label>
              <Field
                name="nombre"
                as="input"
                type="text"
                class="form-control"
                placeholder="Nombre del transportista"
              />
              <ErrorMessage name="nombre" class="text-danger" />
            </div>
            <div class="mb-4 col-md-6">
              <label class="required form-label">Dirección</label>
              <Field
                name="direccion"
                as="input"
                type="text"
                class="form-control"
                placeholder="Dirección del transportista"
              />
              <ErrorMessage name="direccion" class="text-danger" />
            </div>
            <div class="mb-4 col-md-6">
              <label class="required form-label">Teléfono de contacto</label>
              <Field
                name="telefono"
                as="input"
                type="tel"
                class="form-control"
                placeholder="Teléfono de contacto"
              />
              <ErrorMessage name="telefono" class="text-danger" />
            </div>
            <div class="mb-4 col-md-6">
              <label class="required form-label">Correo electrónico</label>
              <Field
                name="correo"
                as="input"
                type="email"
                class="form-control"
                placeholder="Correo electrónico"
              />
              <ErrorMessage name="correo" class="text-danger" />
            </div>
            <div class="mb-4 col-md-6">
              <label class="required form-label">Razón social</label>
              <Field
                as="select"
                name="razonSocial"
                class="form-select form-select-solid"
              >
                <option disabled value="">Seleccione una opción</option>
                <option value="Empresa">Empresa</option>
                <option value="Autónomo">Autónomo</option>
                <option value="Otro">Otro</option>
              </Field>
              <ErrorMessage name="razonSocial" class="text-danger" />
            </div>
            <div class="mb-4 col-md-6">
              <label class="required form-label">Tipo de servicio</label>
              <Field
                as="select"
                name="tipoServicio"
                class="form-select form-select-solid"
              >
                <option disabled value="">
                  Seleccione un tipo de servicio
                </option>
                <option value="Carga">Carga</option>
                <option value="Pasajeros">Pasajeros</option>
                <option value="Mudanzas">Mudanzas</option>
                <option value="Otro">Otro</option>
              </Field>
              <ErrorMessage name="tipoServicio" class="text-danger" />
            </div>
          </div>
          <div class="card-footer d-flex justify-content-end">
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
    </div>
  </Form>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { useTransportistasStore } from "@/stores/transportistas";
import Swal from "sweetalert2/dist/sweetalert2.js";

export default defineComponent({
  name: "AddTransportista",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  setup() {
    const transportistasStore = useTransportistasStore();
    const loading = ref(false);

    const schema = yup.object({
      nombre: yup.string().required("El nombre es requerido"),
      direccion: yup.string().required("La dirección es requerida"),
      telefono: yup
        .string()
        .required("El teléfono es requerido")
        .matches(/^\d+$/, "El teléfono solo debe contener números"),
      correo: yup
        .string()
        .required("El correo es requerido")
        .email("El correo no es válido"),
      razonSocial: yup.string().required("La razón social es requerida"),
      tipoServicio: yup.string().required("El tipo de servicio es requerido"),
    });

    const handleSubmit = (
      values: any,
      { resetForm }: { resetForm: () => void },
    ) => {
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
        const newTransportista = {
          ...values,
          estado: "Activo", // Estado por defecto
        };
        transportistasStore.addTransportista(newTransportista);
        Swal.fire({
          text: "Transportista guardado exitosamente!",
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "Ok, entendido!",
          heightAuto: false,
          customClass: {
            confirmButton: "btn btn-primary",
          },
        }).then(() => {
          resetForm();
        });
      }, 2000);
    };

    return {
      schema,
      handleSubmit,
      loading,
    };
  },
});
</script>
