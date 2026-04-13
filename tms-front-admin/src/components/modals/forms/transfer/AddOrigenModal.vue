<template>
  <div
    class="modal fade"
    id="kt_modal_add_origen"
    ref="addOrigenModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px miModal">
      <!--begin::Modal content-->
      <div class="modal-content">
        <!--begin::Modal header-->
        <div class="modal-header" id="kt_modal_add_provincia_header">
          <!--begin::Modal title-->
          <h2 class="fw-bold">Añadir un Origen</h2>
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
            <!-- Campo: Nombre del origen -->
            <div class="mb-4 px-4 py-4 col-11 mx-6">
              <label class="required form-label">Nombre del origen</label>
              <Field
                name="name"
                as="input"
                type="text"
                class="form-control"
                placeholder="Ponga el nombre del origen"
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
import { useOrigenStore } from "@/stores/origen";
import Swal from "sweetalert2/dist/sweetalert2.js";
interface AddOrigenFormFields {
  name: string;
  description: string;
}
export default defineComponent({
  name: "AddOrigen",
  components: {
    Form,
    Field,
    ErrorMessage,
  },

  setup() {
    const origenStore = useOrigenStore();
    const formRef = ref<HTMLFormElement | null>(null);
    const addOrigenModalRef = ref<HTMLElement | null>(null);

    const schema = yup.object({
      name: yup.string().required("El nombre es obligatorio"),
      description: yup.string(),
    });

    const { errors } = useForm<AddOrigenFormFields>({
      validationSchema: schema,
    });
    const selectedOption = ref(null);

    const handleSubmit = async (
      values: any,
      { resetForm }: { resetForm: () => void },
    ) => {
      const newOrigen = {
        name: values.name,
        description: values.description,
      };

      try {
        const response = await origenStore.addOrigen(newOrigen);
        console.log("Origen agregada:", response.data);
        const datos = await origenStore.fetchOrigens();
        await console.log("Datos:", datos);

        Swal.fire({
          text: "Origen agregada correctamente",
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "Ok",
          heightAuto: false,
          customClass: {
            confirmButton: "btn btn-primary",
          },
        });
      } catch (error: any) {
        console.error("Error al agregar origen:", error);

        Swal.fire({
          text: "Error al crear la origen",
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "Ok",
          heightAuto: false,
          customClass: {
            confirmButton: "btn btn-primary",
          },
        });
      } finally {
        hideModal(addOrigenModalRef.value);
        resetForm();
      }
    };

    return {
      schema,
      handleSubmit,
      formRef,
      addOrigenModalRef,
      errors,
      selectedOption,
    };
  },
});
</script>

<style scoped></style>
