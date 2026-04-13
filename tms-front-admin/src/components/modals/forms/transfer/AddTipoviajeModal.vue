<template>
  <div
    class="modal fade"
    id="kt_modal_add_tipoviaje"
    ref="addTipoviajeModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px miModal">
      <!--begin::Modal content-->
      <div class="modal-content">
        <!--begin::Modal header-->
        <div class="modal-header" id="kt_modal_add_provincia_header">
          <!--begin::Modal title-->
          <h2 class="fw-bold">Añadir un Tipoviaje</h2>
          <!--end::Modal title-->

          <!--begin::Close-->
          <div
            id="kt_modal_add_provincia_close"
            data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
          >
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </div>
          <!--end::Close-->
        </div>

        <Form
          @submit="handleSubmit"
          :validation-schema="schema"
          ref="formRef"
          class="my-6"
        >
          <div class="card shadow-sm">
            <!-- Campo: Nombre del tipoviaje -->
            <div class="mb-4 px-4 py-4 col-11 mx-6">
              <label class="required form-label">Nombre del tipoviaje</label>
              <Field
                name="name"
                as="input"
                type="text"
                class="form-control"
                placeholder="Ponga el nombre del tipoviaje"
              />
              <ErrorMessage name="name" class="text-danger" />
            </div>

            <!-- Campo: Descripción -->
            <div class="mb-4 px-4 py-4 col-11 mx-6">
              <label class="form-label">Descripción</label>
              <Field
                name="description"
                as="textarea"
                class="form-control"
                placeholder="Ponga la descripción"
              />
              <ErrorMessage name="description" class="text-danger" />
            </div>
          </div>

          <!-- Footer del formulario -->
          <div class="card-footer my-8 d-flex justify-content-end">
            <a href="#" class="btn btn-bg-secondary" data-bs-dismiss="modal"
              >Cancelar</a
            >
            <button type="submit" class="btn btn-bg-primary mx-3">
              Guardar
            </button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import * as yup from "yup";
import { Form, Field, ErrorMessage, useForm } from "vee-validate";
import { hideModal } from "@/core/helpers/modal";
import { useTipoviajeStore } from "@/stores/tipoviaje";
import Swal from "sweetalert2/dist/sweetalert2.js";
interface AddTipoviajeFormFields {
  name: string;
  description: string;
}
export default defineComponent({
  name: "AddTipoviaje",
  components: {
    Form,
    Field,
    ErrorMessage,
  },

  setup() {
    const tipoviajeStore = useTipoviajeStore();
    const formRef = ref<HTMLFormElement | null>(null);
    const addTipoviajeModalRef = ref<HTMLElement | null>(null);

    const schema = yup.object({
      name: yup.string().required("El nombre es obligatorio"),
      description: yup.string(),
    });

    const { errors } = useForm<AddTipoviajeFormFields>({
      validationSchema: schema,
    });
    const selectedOption = ref(null);

    const handleSubmit = async (
      values: any,
      { resetForm }: { resetForm: () => void },
    ) => {
      const newTipoviaje = {
        name: values.name,
        description: values.description,
      };

      try {
        const response = await tipoviajeStore.addTipoviaje(newTipoviaje);
        console.log("Tipoviaje agregada:", response.data);
        const datos = await tipoviajeStore.fetchTipoviajes();
        await console.log("Datos:", datos);

        Swal.fire({
          text: "Tipoviaje agregada correctamente",
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "Ok",
          heightAuto: false,
          customClass: {
            confirmButton: "btn btn-primary",
          },
        });
      } catch (error: any) {
        console.error("Error al agregar tipoviaje:", error);

        Swal.fire({
          text: "Error al crear la tipoviaje",
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "Ok",
          heightAuto: false,
          customClass: {
            confirmButton: "btn btn-primary",
          },
        });
      } finally {
        hideModal(addTipoviajeModalRef.value);
        resetForm();
      }
    };

    return {
      schema,
      handleSubmit,
      formRef,
      addTipoviajeModalRef,
      errors,
      selectedOption,
    };
  },
});
</script>

<style scoped></style>
