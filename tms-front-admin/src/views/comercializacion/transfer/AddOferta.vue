<template>
  <Form
    @submit="handleSubmit"
    :validation-schema="schema"
    :initial-values="initialValues"
    v-slot="{ resetForm }"
  >
    <div class="row my-6">
      <div class="col-md-1 py-4"></div>
      <div class="col-md-9 py-4 my-5">
        <div class="card shadow-sm">
          <div class="row d-flex justify-content-center">
            <!-- Producto -->
            <div class="mb-4 px-4 py-4 col-5 mx-6">
              <label class="fs-5 fw-semibold form-label mb-5">Producto:</label>
              <Field name="producto" v-slot="{ field, errors }">
                <el-form-item :error="errors[0]">
                  <el-input
                    v-model="field.value"
                    @input="field.onChange"
                    class="form-control-solid w-250px"
                    aria-label="Producto"
                  />
                </el-form-item>
              </Field>
            </div>

            <!-- Idioma -->
            <div class="mb-4 px-4 py-4 col-5 mx-6">
              <label class="fs-5 fw-semibold form-label mb-5">Idioma:</label>
              <Field name="idioma" v-slot="{ field, errors }">
                <el-form-item :error="errors[0]">
                  <el-select
                    v-model="field.value"
                    @change="field.onChange"
                    class="form-control-solid w-250px"
                    aria-label="Idioma"
                  >
                    <el-option label="Español" value="Español"
                      >Español</el-option
                    >
                    <el-option label="Inglés" value="Inglés">Ingles</el-option>
                  </el-select>
                </el-form-item>
              </Field>
            </div>
          </div>
          <div class="row d-flex justify-content-center">
            <!-- Nombre -->
            <div class="mb-4 px-4 py-4 col-5 mx-6">
              <label class="fs-5 fw-semibold form-label mb-5">Nombre:</label>
              <Field name="nombre" v-slot="{ field, errors }">
                <el-form-item :error="errors[0]">
                  <el-input
                    v-model="field.value"
                    @input="field.onChange"
                    class="form-control-solid w-250px"
                    aria-label="Nombre"
                  />
                </el-form-item>
              </Field>
            </div>

            <!-- Periodo de Venta -->
            <div class="mb-4 px-4 py-4 col-5 mx-6">
              <label class="fs-5 fw-semibold form-label mb-5"
                >Periodo de Venta:</label
              >
              <Field name="periodo" v-slot="{ field, errors }">
                <el-form-item :error="errors[0]">
                  <el-date-picker
                    v-model="field.value"
                    @update:modelValue="field.onChange"
                    format="DD/MM/YYYY"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="Fecha inicio"
                    end-placeholder="Fecha fin"
                    class="form-control-solid w-450px"
                  />
                </el-form-item>
              </Field>
            </div>
          </div>

          <!-- Descripción -->
          <div class="mb-4 px-4 py-4 col-12 mx-6">
            <div class="text-start mb-3">
              <label class="fs-5 fw-semibold form-label mx-6"
                >Descripción:</label
              >
            </div>
            <Field name="descripcion" v-slot="{ field, errors }">
              <el-form-item :error="errors[0]">
                <div class="col-md-11 mx-4">
                  <el-input
                    v-model="field.value"
                    @input="field.onChange"
                    type="textarea"
                    :rows="3"
                    class="form-control-solid wide-textarea"
                    aria-label="Descripción"
                  />
                </div>
              </el-form-item>
            </Field>
          </div>

          <!-- Días de la oferta -->
          <div class="mb-4 px-4 py-4 col-11 mx-6">
            <Field name="diasVentaSemana" v-slot="{ field, errors }">
              <el-form-item :error="errors[0]">
                <div
                  class="d-flex justify-content-between align-items-center mb-3"
                >
                  <label class="fs-5 fw-semibold form-label mb-0 mx-5 py-4 px-5"
                    >Días de la oferta:</label
                  >
                  <div class="form-check form-switch me-5">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="selectAllDays"
                      :checked="selectAll"
                      @change="toggleSelectAll(field)"
                    />
                    <label class="form-check-label" for="selectAllDays"
                      >Seleccionar todos</label
                    >
                  </div>
                </div>
                <div class="d-flex flex-wrap gap-3 ps-5">
                  <div
                    class="form-check form-check-custom"
                    v-for="day in diasSemana"
                    :key="day"
                  >
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :value="day"
                      :checked="field.value.includes(day)"
                      @change="handleCheckboxChange(field, day)"
                      :id="`checkbox-${day}`"
                    />
                    <label
                      class="form-check-label me-3 text-white"
                      :for="`checkbox-${day}`"
                    >
                      {{ day }}
                    </label>
                  </div>
                </div>
              </el-form-item>
            </Field>
          </div>
        </div>
        <div class="card-footer my-8 py-4 d-flex justify-content-end">
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
import { Form, Field, ErrorMessage } from "vee-validate";
import { ElFormItem, ElInput, ElDatePicker } from "element-plus";
import * as yup from "yup";
import { useOfertastore } from "@/stores/ofertas";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { type IOfertasT } from "@/core/data/ofertasTransfer";

export default defineComponent({
  name: "AddOferta",
  components: {
    Form,
    Field,
    ErrorMessage,
    ElFormItem,
    ElInput,
    ElDatePicker,
  },
  setup() {
    const ofertasStore = useOfertastore();
    const loading = ref(false);
    const diasSemana = ref([
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
      "Domingo",
    ]);

    const initialValues = ref({
      producto: "",
      idioma: "",
      nombre: "",
      periodo: [],
      descripcion: "",
      diasVentaSemana: [],
    });

    const schema = yup.object({
      producto: yup.string().required("El producto es requerido"),
      idioma: yup.string().required("El idioma es requerido"),
      nombre: yup.string().required("El nombre es requerido"),
      periodo: yup
        .array()
        .of(yup.date().required("El periodo es requerido"))
        .length(2, "Debe seleccionar un rango de fechas válido")
        .required("El periodo es requerido"),
      descripcion: yup.string().required("La descripción es requerida"),
      diasVentaSemana: yup
        .array()
        .min(1, "Seleccione al menos un día")
        .required("Los días de venta son requeridos"),
    });

    const handleSubmit = (
      values: any,
      { resetForm }: { resetForm: () => void },
    ) => {
      loading.value = true;
      setTimeout(() => {
        loading.value = false;

        try {
          const newOferta: IOfertasT = {
            id: ofertasStore.ofertas.length + 1,
            producto: values.producto,
            idioma: values.idioma,
            nombre: values.nombre,
            periodo: values.periodo,
            descripcion: values.descripcion,
            diasVentaSemana: values.diasVentaSemana,
          };

          ofertasStore.AddOferta(newOferta);
          console.log("Oferta agregada:", newOferta);

          Swal.fire({
            text: "Oferta guardada exitosamente!",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            heightAuto: false,
            customClass: {
              confirmButton: "btn btn-primary",
            },
          }).then(() => resetForm());
        } catch (error) {
          Swal.fire({
            text: "Hubo un error al guardar la oferta. Por favor, inténtalo de nuevo.",
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            heightAuto: false,
            customClass: {
              confirmButton: "btn btn-primary",
            },
          });
        }
      }, 1500);
    };

    const selectAll = ref(false);

    // Nuevas funciones
    const toggleSelectAll = (field: any) => {
      selectAll.value = !selectAll.value;
      if (selectAll.value) {
        field.onChange([...diasSemana.value]);
      } else {
        field.onChange([]);
      }
    };

    const handleCheckboxChange = (field: any, day: string) => {
      const newValue = field.value.includes(day)
        ? field.value.filter((d: string) => d !== day)
        : [...field.value, day];
      field.onChange(newValue);
      selectAll.value = newValue.length === diasSemana.value.length;
    };
    return {
      schema,
      initialValues,
      handleSubmit,
      loading,
      diasSemana,
      selectAll,
      toggleSelectAll,
      handleCheckboxChange,
    };
  },
});
</script>
