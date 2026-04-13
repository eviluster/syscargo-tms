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
            <!-- Campo para el nombre del chofer -->
            <div class="mb-4 px-4 py-4 col-5 mx-6">
              <label class="required form-label">Nombre</label>
              <Field
                name="nombre"
                as="input"
                type="text"
                class="form-control"
                placeholder="Nombre del chofer"
              />
              <ErrorMessage name="nombre" class="text-danger" />
            </div>

            <!-- Campo para el CI del chofer -->
            <div class="mb-4 px-4 py-4 col-5 mx-6">
              <label class="required form-label">Carnet de Identidad</label>
              <Field
                name="ci"
                as="input"
                type="number"
                class="form-control"
                placeholder="Carnet de identidad"
              />
              <ErrorMessage name="ci" class="text-danger" />
            </div>

            <!-- Campo para la licencia del chofer -->
            <div class="mb-4 px-4 py-4 col-5 mx-6">
              <label class="required form-label">Número de Licencia</label>
              <Field
                name="licencia"
                as="input"
                type="number"
                class="form-control"
                placeholder="Número de licencia"
              />
              <ErrorMessage name="licencia" class="text-danger" />
            </div>

            <!-- Campo para el teléfono del chofer -->
            <div class="mb-4 px-4 py-4 col-5 mx-6">
              <label class="required form-label">Teléfono</label>
              <Field
                name="telefono"
                as="input"
                type="text"
                class="form-control"
                placeholder="Número de teléfono"
              />
              <ErrorMessage name="telefono" class="text-danger" />
            </div>

            <!-- Campo para los años de experiencia -->
            <div class="mb-4 px-4 py-4 col-4 mx-6">
              <label class="required form-label">Años de Experiencia</label>
              <Field
                name="experiencia"
                as="input"
                type="number"
                class="form-control"
                placeholder="Años de experiencia"
              />
              <ErrorMessage name="experiencia" class="text-danger" />
            </div>
            <!-- Campo para subir la foto del chofer -->
            <div class="mb-4 px-4 py-4 col-6 mx-6">
              <label class="form-label">Foto del Chofer</label>
              <input
                name="foto"
                type="file"
                @change="handleFileChange"
                class="form-control"
                accept="image/*"
              />
              <small v-if="fotoFile" class="text-muted"
                >Archivo seleccionado: {{ fotoFile.name }}</small
              >
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
import { type IChoferes } from "@/core/data/choferes";
import { useChoferesStore } from "@/stores/choferes";
import Swal from "sweetalert2/dist/sweetalert2.js";

// Interfaz para los valores del formulario
interface FormValues {
  nombre: string;
  ci: number;
  licencia: number;
  telefono: string;
  experiencia: number;
}

export default defineComponent({
  name: "AddChoferes",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  setup() {
    const choferesStore = useChoferesStore();
    const loading = ref(false);
    const fotoFile = ref<File | null>(null);

    // Esquema de validación con Yup
    const schema = yup.object({
      nombre: yup.string().required("El nombre es requerido"),
      ci: yup.number().required("El carnet de identidad es requerido"),
      licencia: yup.number().required("El número de licencia es requerido"),
      telefono: yup.string().required("El teléfono es requerido"),
      experiencia: yup
        .number()
        .required("Los años de experiencia son requeridos"),
    });

    // Manejar el cambio de archivo (foto)
    const handleFileChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        if (!file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
          Swal.fire({
            text: "Formato de archivo no válido. Solo se permiten imágenes.",
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
        fotoFile.value = file;
      } else {
        fotoFile.value = null; // Limpiar el archivo seleccionado si no hay archivo
      }
    };

    // Función para subir el archivo (simulada o real)
    const uploadFile = async (file: File): Promise<string> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const fakeUrl = URL.createObjectURL(file); // Simular una URL
          resolve(fakeUrl);
        }, 1000);
      });
    };

    // Función para manejar el envío del formulario
    const handleSubmit = async (
      values: FormValues,
      { resetForm }: { resetForm: () => void },
    ) => {
      loading.value = true;

      try {
        let fotoUrl = ""; // Valor por defecto: cadena vacía
        if (fotoFile.value) {
          fotoUrl = await uploadFile(fotoFile.value); // Subir el archivo y obtener la URL
        }

        const newChofer: IChoferes = {
          id: choferesStore.choferes.length + 1, // Generar un ID único
          nombre: values.nombre,
          ci: values.ci,
          licencia: values.licencia,
          telefono: values.telefono,
          experiencia: values.experiencia,
          foto: fotoUrl, // Almacenar la URL de la foto
        };
        await new Promise((resolve) => setTimeout(resolve, 2000));
        // Agregar el chofer al store
        choferesStore.addChofer(newChofer);
        console.log("Chofer agregado:", newChofer);

        Swal.fire({
          text: "Chofer guardado exitosamente!",
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "Ok, entendido",
          heightAuto: false,
          customClass: {
            confirmButton: "btn btn-primary",
          },
        }).then(() => {
          resetForm();
          fotoFile.value = null;
          const fileInput = document.querySelector(
            'input[name="foto"]',
          ) as HTMLInputElement;
          if (fileInput) fileInput.value = "";
        });
      } catch (error) {
        console.error("Error al agregar el chofer:", error);
        Swal.fire({
          text: "Hubo un error al guardar el chofer. Por favor, inténtalo de nuevo.",
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
      handleFileChange,
      loading,
      fotoFile,
    };
  },
});
</script>
