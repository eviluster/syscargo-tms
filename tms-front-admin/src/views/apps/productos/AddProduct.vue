<template>
  <Form
    @submit="handleSubmit"
    :validation-schema="schema"
    v-slot="{ resetForm }"
  >
    <div class="row my-6">
      <div class="col-md-4 my-5">
        <div class="card shadow-sm">
          <div class="card-body">
            <h3 class="card-title">Categorias</h3>
            <Field
              as="select"
              name="category"
              class="form-select form-select-solid"
            >
              <option disabled value="">Seleccione una categoría</option>
              <option value="hoteles">Hoteles</option>
              <option value="experiencias">Experiencias</option>
              <option value="transfer">Transfer</option>
              <option value="tiendas">Tiendas</option>
            </Field>
            <ErrorMessage name="category" class="text-danger" />
          </div>
        </div>
        <div class="card shadow-sm px-1 my-6">
          <div class="card-body">
            <h3 class="my-5">Módulos</h3>
            <Field
              as="select"
              name="module"
              class="form-select form-select-solid"
            >
              <option disabled value="">Seleccione un módulo</option>
              <option value="marina">Marina</option>
              <option value="aérea">Aérea</option>
              <option value="terrestre">Terrestre</option>
            </Field>
            <ErrorMessage name="module" class="text-danger" />
          </div>
        </div>
      </div>
      <div class="col-md-8">
        <div class="card shadow-sm">
          <div class="mb-4 px-4 py-4 col-11 mx-6">
            <label class="required form-label">Nombre del producto</label>
            <Field
              name="productName"
              as="input"
              type="text"
              class="form-control"
              placeholder="Ponga el nombre del producto"
            />
            <ErrorMessage name="productName" class="text-danger" />
          </div>
          <div class="mb-4 px-4 py-4 col-11 mx-6">
            <label class="required form-label">Descripcion</label>
            <Field
              name="description"
              as="textarea"
              class="form-control"
              placeholder="Ponga la descripcion"
            />
            <ErrorMessage name="description" class="text-danger" />
          </div>
          <div class="mb-4 px-4 py-4 col-11 mx-6">
            <label class="required form-label">Nombre</label>
            <Field
              name="firstName"
              as="input"
              type="text"
              class="form-control"
              placeholder="Ponga su nombre"
            />
            <ErrorMessage name="firstName" class="text-danger" />
          </div>
          <div class="mb-4 px-4 py-3 col-11 mx-6">
            <label class="required form-label">Apellidos</label>
            <Field
              name="lastName"
              as="input"
              type="text"
              class="form-control"
              placeholder="Ponga sus apellidos"
            />
            <ErrorMessage name="lastName" class="text-danger" />
          </div>
          <div class="mb-4 px-4 py-3 col-11 mx-6">
            <label class="required form-label">CI</label>
            <Field
              name="ci"
              as="input"
              type="text"
              class="form-control"
              placeholder="Ponga su CI"
            />
            <ErrorMessage name="ci" class="text-danger" />
          </div>
          <div class="mb-4 px-4 py-3 col-11 mx-6">
            <label class="required form-label">Correo</label>
            <Field
              name="email"
              as="input"
              type="email"
              class="form-control"
              placeholder="Ponga su correo"
            />
            <ErrorMessage name="email" class="text-danger" />
          </div>
          <div class="mb-4 px-4 py-3 col-11 mx-6">
            <label class="required form-label">Telefono</label>
            <Field
              name="phone"
              as="input"
              type="tel"
              class="form-control"
              placeholder="Ponga su telefono"
            />
            <ErrorMessage name="phone" class="text-danger" />
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
import { useProductStore } from "@/stores/products";
import { type IProducts } from "@/core/data/productos";
import Swal from "sweetalert2/dist/sweetalert2.js";
export default defineComponent({
  name: "AddProduct",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  setup() {
    const productStore = useProductStore();

    const schema = yup.object({
      category: yup.string().required("Seleccione una categoría"),
      module: yup.string().required("Seleccione un módulo"),
      productName: yup.string().required("El nombre del producto es requerido"),
      description: yup.string().required("La descripción es requerida"),
      firstName: yup.string().required("El nombre es requerido"),
      lastName: yup.string().required("Los apellidos son requeridos"),
      ci: yup
        .string()
        .required("El CI es requerido")
        .matches(/^\d+$/, "El CI solo debe contener números"),
      email: yup
        .string()
        .email("Correo inválido")
        .required("El correo es requerido"),
      phone: yup
        .string()
        .required("El teléfono es requerido")
        .matches(/^\d+$/, "El teléfono solo debe contener números"),
    });

    const loading = ref(false);

    const handleSubmit = async (
      values: any,
      { resetForm }: { resetForm: () => void },
    ) => {
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
        const saveSuccess = true;
        if (saveSuccess) {
          const newProduct: IProducts = {
            id: productStore.products.length + 1,
            nombredelproducto: values.productName,
            descripion: values.description,
            categoria: values.category,
            módulo: values.module,
            nombre: values.firstName,
            apellidos: values.lastName,
            correo: values.email,
            teléfono: values.phone,
          };
          productStore.addProduct(newProduct);
          console.log("Producto agregado:", newProduct);
          Swal.fire({
            text: "Producto guardado exitosamente!",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            heightAuto: false,
            customClass: {
              confirmButton: "btn btn-primary",
            },
          }).then(() => {
            resetForm();
          });
        } else {
          Swal.fire({
            text: "Hubo un error al guardar el producto. Por favor, inténtalo de nuevo.",
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            heightAuto: false,
            customClass: {
              confirmButton: "btn btn-primary",
            },
          });
        }
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
