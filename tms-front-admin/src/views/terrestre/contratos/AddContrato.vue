<template>
  <Form
    @submit="handleSubmit"
    :validation-schema="schema"
    v-slot="{ resetForm }"
  >
    <div class="row my-6">
      <div class="py-4">
        <div class="card shadow-sm">
          <div class="row mx-1">
            <div class="mb-4 px-4 py-4 col-5 mx-8">
              <label class="required form-label">Prestatario</label>
              <Field
                name="prestatario"
                as="input"
                type="text"
                class="form-control"
                placeholder="Nombre del prestatario"
              />
              <ErrorMessage name="prestatario" class="text-danger" />
            </div>
            <div class="mb-4 px-4 py-4 col-5 mx-8">
              <label class="required form-label">Correo</label>
              <Field
                name="correo"
                as="input"
                type="email"
                class="form-control"
                placeholder="Correo del prestatario"
              />
              <ErrorMessage name="correo" class="text-danger" />
            </div>
          </div>
          <div class="row mx-1">
            <div class="mb-4 px-4 py-4 col-5 mx-8">
              <label class="required form-label">Fecha de inicio</label>
              <Field
                name="fechaI"
                as="input"
                type="date"
                class="form-control"
              />
              <ErrorMessage name="fechaI" class="text-danger" />
            </div>
            <div class="mb-4 px-4 py-4 col-5 mx-8">
              <label class="required form-label">Fecha de finalización</label>
              <Field
                name="fechaF"
                as="input"
                type="date"
                class="form-control"
              />
              <ErrorMessage name="fechaF" class="text-danger" />
            </div>
          </div>
          <div class="mb-4 px-4 py-4 col-11 mx-6">
            <label class="required form-label">Servicios Ofrecidos</label>
            <Field
              name="serviciosOfrecidos"
              as="textarea"
              class="form-control"
              placeholder="Descripción de los servicios ofrecidos"
            />
            <ErrorMessage name="serviciosOfrecidos" class="text-danger" />
          </div>
          <div class="mb-4 px-4 py-4 col-11 mx-6">
            <label class="required form-label">Tarifas Acordadas</label>
            <Field
              name="tarifasAcordadas"
              as="input"
              type="number"
              class="form-control"
              placeholder="Tarifas acordadas"
            />
            <ErrorMessage name="tarifasAcordadas" class="text-danger" />
          </div>
          <div class="mb-4 px-4 py-4 col-11 mx-6">
            <label class="required form-label">Condiciones Contractuales</label>
            <Field
              name="condicionesContractuales"
              as="textarea"
              class="form-control"
              placeholder="Condiciones contractuales"
            />
            <ErrorMessage name="condicionesContractuales" class="text-danger" />
          </div>
          <div class="mb-4 px-4 py-4 col-11 mx-6">
            <label class="form-label">Notificaciones de Vencimiento</label>
            <Field
              name="notificacionesVencimiento"
              type="checkbox"
              v-model="notificacionesVencimiento"
              :value="true"
              class="form-check-input"
            />
            <ErrorMessage
              name="notificacionesVencimiento"
              class="text-danger"
            />
          </div>
          <div class="mb-4 px-4 py-4 col-11 mx-6">
            <label class="form-label">Contrato (PDF o Word)</label>
            <input
              name="contrato"
              type="file"
              @change="handleFileChange"
              class="form-control"
              accept=".pdf,.doc,.docx"
            />
            <small v-if="contratoFile" class="text-muted"
              >Archivo seleccionado: {{ contratoFile.name }}</small
            >
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
import { type IContratos } from "@/core/data/contratos";
import { useContratosStore } from "@/stores/contratos";
import Swal from "sweetalert2/dist/sweetalert2.js";

interface FormValues {
  prestatario: string;
  correo: string;
  fechaI: string;
  fechaF: string;
  serviciosOfrecidos: string;
  tarifasAcordadas: number;
  condicionesContractuales: string;
  notificacionesVencimiento: boolean;
}

export default defineComponent({
  name: "AddContratos",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  setup() {
    const contratosStore = useContratosStore();
    const loading = ref(false);
    const contratoFile = ref<File | null>(null);
    const notificacionesVencimiento = ref(false);

    const schema = yup.object({
      prestatario: yup
        .string()
        .required("El nombre del prestatario es requerido"),
      correo: yup
        .string()
        .email("Correo inválido")
        .required("El correo es requerido"),
      fechaI: yup.string().required("La fecha de inicio es requerida"),
      fechaF: yup.string().required("La fecha de finalización es requerida"),
      serviciosOfrecidos: yup
        .string()
        .required("Los servicios ofrecidos son requeridos"),
      tarifasAcordadas: yup
        .number()
        .required("Las tarifas acordadas son requeridas"),
      condicionesContractuales: yup
        .string()
        .required("Las condiciones contractuales son requeridas"),
      notificacionesVencimiento: yup
        .boolean()
        .required("Las notificaciones de vencimiento son requeridas"),
    });

    const handleFileChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        if (!file.name.match(/\.(pdf|doc|docx)$/i)) {
          Swal.fire({
            text: "Formato de archivo no válido. Solo se permiten PDF o Word.",
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Ok, entendido",
            heightAuto: false,
            customClass: {
              confirmButton: "btn btn-primary",
            },
          });
          return;
        }
        contratoFile.value = file;
      } else {
        contratoFile.value = null;
      }
    };

    const handleSubmit = async (
      values: FormValues,
      { resetForm }: { resetForm: () => void },
    ) => {
      loading.value = true;

      try {
        values.notificacionesVencimiento = notificacionesVencimiento.value;

        let contratoUrl = "";
        if (contratoFile.value) {
          contratoUrl = await uploadFile(contratoFile.value);
        }

        const newContrato: IContratos = {
          id: contratosStore.contracts.length + 1,
          prestatario: values.prestatario,
          correo: values.correo,
          fechaI: values.fechaI,
          fechaF: values.fechaF,
          serviciosOfrecidos: values.serviciosOfrecidos,
          tarifasAcordadas: values.tarifasAcordadas,
          condicionesContractuales: values.condicionesContractuales,
          notificacionesVencimiento: values.notificacionesVencimiento,
          contrato: contratoUrl,
        };
        await new Promise((resolve) => setTimeout(resolve, 2000));
        contratosStore.addContrato(newContrato);
        console.log("Contrato agregado:", newContrato);

        Swal.fire({
          text: "Contrato guardado exitosamente!",
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "Ok, entendido",
          heightAuto: false,
          customClass: {
            confirmButton: "btn btn-primary",
          },
        }).then(() => {
          resetForm();
          contratoFile.value = null;
          notificacionesVencimiento.value = false;
          const fileInput = document.querySelector(
            'input[name="contrato"]',
          ) as HTMLInputElement;
          if (fileInput) fileInput.value = "";
        });
      } catch (error) {
        console.error("Error al agregar el contrato a la lista:", error);
        Swal.fire({
          text: "Hubo un error al guardar el contrato. Por favor, inténtalo de nuevo.",
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

    const uploadFile = async (file: File): Promise<string> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const fakeUrl = URL.createObjectURL(file);
          resolve(fakeUrl);
        }, 1000);
      });
    };

    return {
      schema,
      handleSubmit,
      handleFileChange,
      loading,
      contratoFile,
      notificacionesVencimiento,
    };
  },
});
</script>
