<template>
  <div
    class="modal fade"
    id="kt_modal_edit_origen"
    ref="editOrigenModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <!--begin::Modal content-->
      <div class="modal-content">
        <!--begin::Modal header-->
        <div class="modal-header" id="kt_modal_edit_provincia_header">
          <!--begin::Modal title-->
          <h2 class="fw-bold">Editar Origen</h2>
          <!--end::Modal title-->

          <!--begin::Close-->
          <div
            id="kt_modal_edit_provincia_close"
            data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
          >
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </div>
          <!--end::Close-->
        </div>
        <!--end::Modal header-->
        <!--begin::Form-->
        <Form @submit="handleSubmit">
          <!-- Campo: Nombre del origen -->
          <div class="mb-4 px-4 py-4 col-11 mx-6">
            <label class="required form-label">Nombre del origen</label>
            <Field
              name="name"
              v-model="formData.name"
              as="input"
              type="text"
              class="form-control"
              placeholder="Ponga el nombre del origen"
            />
            <ErrorMessage name="name" class="text-danger" />
          </div>

          <!-- Campo: Descripción -->
          <div class="mb-4 px-4 py-4 col-11 mx-6">
            <label class="required form-label">Descripción</label>
            <Field
              name="description"
              v-model="formData.description"
              as="textarea"
              class="form-control"
              placeholder="Ponga la descripción"
            />
            <ErrorMessage name="description" class="text-danger" />
          </div>
          <!-- Footer del formulario -->
          <div class="card-footer my-8 d-flex justify-content-end">
            <a href="#" class="btn btn-bg-secondary" data-bs-dismiss="modal"
              >Cancelar</a
            >
            <button type="submit" class="btn btn-bg-primary mx-3">
              Actualizar
            </button>
          </div>
        </Form>
        <!--end::Form-->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect, computed } from "vue";
import * as yup from "yup";
import { Form, Field, ErrorMessage, useForm } from "vee-validate";
import { hideModal } from "@/core/helpers/modal";
import { useOrigenStore } from "@/stores/origen";

export default defineComponent({
  name: "EditOrigen",
  components: {
    Form,
    Field,
    ErrorMessage,
    // Agrega aquí otros componentes, como ImageInput, si es necesario
  },
  props: {
    origen: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const origenStore = useOrigenStore();
    const editOrigenModalRef = ref<HTMLElement | null>(null);

    // Objeto reactivo para almacenar los datos del formulario
    const formData = ref({
      id: "",
      name: "",
      description: "",
    });

    // Esquema de validación con yup
    const schema = yup.object({
      name: yup.string().required("El nombre en español es obligatorio"),
      description: yup
        .string()
        .required("La descripción en español es obligatoria"),
    });

    const { errors } = useForm({ validationSchema: schema });

    // Sincronizamos los datos de la prop "origen" con el formulario
    watchEffect(() => {
      if (props.origen) {
        formData.value.id = props.origen.id || "";
        formData.value.name = props.origen.name || "";
        formData.value.description = props.origen.description || "";
      }
    });

    // Función de envío del formulario
    const handleSubmit = async (
      values: any,
      { resetForm }: { resetForm: () => void },
    ) => {
      try {
        // Preparamos el objeto con los datos actualizados
        const updatedData = {
          id: formData.value.id,
          name: values.name,
          description: values.description,
        };

        console.log(updatedData);
        // Llamamos a updateOrigen pasando el ID y el objeto con los datos actualizados
        await origenStore.updateOrigen(updatedData);
        await origenStore.fetchOrigens(); // Refrescamos la lista de origens

        hideModal(editOrigenModalRef.value);
        resetForm();
      } catch (error) {
        console.error("Error al actualizar la origen:", error);
      }
    };

    return {
      editOrigenModalRef,
      formData,
      errors,
      schema,
      handleSubmit,
    };
  },
});
</script>
