<template>
  <Form
    @submit="handleSubmit"
    :validation-schema="schema"
    v-slot="{ resetForm }"
  >
    <div class="row my-6">
      <div class="col-md-6">
        <div class="card shadow-sm mb-6">
          <div class="card-body">
            <h3 class="card-title mb-4">Información del Remitente</h3>

            <div class="mb-4">
              <label class="required form-label">Carnet de Identidad</label>
              <Field
                name="carnetIdentidad"
                type="text"
                class="form-control form-control-solid"
                placeholder="Número de carnet"
              />
              <ErrorMessage name="carnetIdentidad" class="text-danger" />
            </div>

            <div class="mb-4">
              <label class="required form-label">Nombre Completo</label>
              <Field
                name="nombreRemitente"
                type="text"
                class="form-control form-control-solid"
                placeholder="Nombre del remitente"
              />
              <ErrorMessage name="nombreRemitente" class="text-danger" />
            </div>

            <div class="mb-4">
              <label class="required form-label">Dirección</label>
              <Field
                name="direccionRemitente"
                as="textarea"
                class="form-control form-control-solid"
                placeholder="Dirección completa"
                rows="3"
              />
              <ErrorMessage name="direccionRemitente" class="text-danger" />
            </div>
          </div>
        </div>

        <!-- Nueva tarjeta de información del emisor -->
        <div class="card shadow-sm mb-6">
          <div class="card-body">
            <h3 class="card-title mb-4">Información del Emisor</h3>

            <div class="mb-4">
              <label class="required form-label">Carnet de Identidad</label>
              <Field
                name="carnetIdentidadEmisor"
                type="text"
                class="form-control form-control-solid"
                placeholder="Número de carnet"
              />
              <ErrorMessage name="carnetIdentidadEmisor" class="text-danger" />
            </div>

            <div class="mb-4">
              <label class="required form-label">Nombre Completo</label>
              <Field
                name="nombreEmisor"
                type="text"
                class="form-control form-control-solid"
                placeholder="Nombre del emisor"
              />
              <ErrorMessage name="nombreEmisor" class="text-danger" />
            </div>

            <div class="mb-4">
              <label class="required form-label">Dirección</label>
              <Field
                name="direccionEmisor"
                as="textarea"
                class="form-control form-control-solid"
                placeholder="Dirección completa"
                rows="3"
              />
              <ErrorMessage name="direccionEmisor" class="text-danger" />
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card shadow-sm mb-6">
          <div class="card-body">
            <h3 class="card-title mb-4">Detalles del Envío</h3>

            <div class="row">
              <div class="col-md-6 mb-4">
                <label class="required form-label">Cantidad de Bultos</label>
                <Field
                  name="cantidadBultos"
                  type="number"
                  min="1"
                  class="form-control form-control-solid"
                  placeholder="Ej: 2"
                  @change="calcularTotales"
                />
                <ErrorMessage name="cantidadBultos" class="text-danger" />
              </div>

              <div class="col-md-6 mb-4">
                <label class="required form-label">Peso Total (kg)</label>
                <Field
                  name="peso"
                  type="number"
                  step="0.1"
                  min="0.1"
                  class="form-control form-control-solid"
                  placeholder="Ej: 5.5"
                  @change="calcularTotales"
                />
                <ErrorMessage name="peso" class="text-danger" />
              </div>

              <div class="col-md-6 mb-4">
                <label class="required form-label"
                  >Volumen (m³ por bulto)</label
                >
                <Field
                  name="volumenBulto"
                  type="number"
                  step="0.01"
                  min="0.01"
                  class="form-control form-control-solid"
                  placeholder="Ej: 0.5"
                  @change="calcularTotales"
                />
                <ErrorMessage name="volumenBulto" class="text-danger" />
              </div>

              <div class="col-md-6 mb-4">
                <label class="required form-label">Origen</label>
                <Field
                  name="origen"
                  as="select"
                  class="form-select form-select-solid"
                >
                  <option value="">Seleccione origen</option>
                  <option value="La Habana">La Habana</option>
                  <option value="Santiago">Santiago</option>
                  <option value="Camagüey">Camagüey</option>
                  <option value="Holguín">Holguín</option>
                </Field>
                <ErrorMessage name="origen" class="text-danger" />
              </div>

              <div class="col-md-6 mb-4">
                <label class="required form-label">Destino</label>
                <Field
                  name="destino"
                  as="select"
                  class="form-select form-select-solid"
                >
                  <option value="">Seleccione destino</option>
                  <option value="La Habana">La Habana</option>
                  <option value="Santiago">Santiago</option>
                  <option value="Camagüey">Camagüey</option>
                  <option value="Holguín">Holguín</option>
                </Field>
                <ErrorMessage name="destino" class="text-danger" />
              </div>

              <div class="col-md-12 mb-4">
                <label class="required form-label">Autorizado a Recoger</label>
                <Field
                  name="autorizadoRecoger"
                  type="text"
                  class="form-control form-control-solid"
                  placeholder="Nombre de la persona autorizada"
                />
                <ErrorMessage name="autorizadoRecoger" class="text-danger" />
              </div>

              <div class="col-md-12 mb-4">
                <label class="required form-label">Tipo de Carga</label>
                <Field
                  name="tipoCarga"
                  as="select"
                  class="form-select form-select-solid"
                >
                  <option value="">Seleccione un tipo</option>
                  <option value="Misceláneas">Misceláneas</option>
                  <option value="Carga General">Carga General</option>
                </Field>
                <ErrorMessage name="tipoCarga" class="text-danger" />
              </div>

              <div class="col-md-12 mb-4">
                <label class="form-label">Detalles del Cálculo</label>
                <div class="card bg-light p-3">
                  <div class="d-flex justify-content-between">
                    <span>Tarifa base (70/kg):</span>
                    <span>{{ tarifaBase.toFixed(2) }} CUP</span>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span
                      >Volumen ({{ volumenTotal.toFixed(2) }} m³ × 100
                      CUP):</span
                    >
                    <span>{{ costoVolumen.toFixed(2) }} CUP</span>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span>Impuesto aeroportuario (7.70/kg):</span>
                    <span>{{ impuestoAeroportuario.toFixed(2) }} CUP</span>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span>Comisión del servicio (5%):</span>
                    <span>{{ comisionServicio.toFixed(2) }} CUP</span>
                  </div>
                  <div class="d-flex justify-content-between fw-bold mt-2">
                    <span>Total a pagar:</span>
                    <span>{{ precioTotal.toFixed(2) }} CUP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12">
        <div class="alert alert-warning">
          <div class="d-flex align-items-center">
            <KTIcon icon-name="information-5" icon-class="fs-2 me-4" />
            <div>
              <h4 class="fw-bold">Artículos Prohibidos</h4>
              <p class="mb-0">
                No se permite el transporte de sustancias peligrosas, armas de
                fuego, explosivos, drogas ilegales o cualquier artículo que
                pueda poner en riesgo la seguridad del transporte.
              </p>
            </div>
          </div>
        </div>

        <div class="card-footer d-flex justify-content-end">
          <button type="button" class="btn btn-light me-3" @click="resetForm">
            Cancelar
          </button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="!loading">Registrar Orden</span>
            <span v-if="loading">
              Procesando...
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
import * as yup from "yup";
import { useordenesStore } from "@/stores/ordenesDecarga";
import Swal from "sweetalert2/dist/sweetalert2.js";

export default defineComponent({
  name: "AddOrdenForm",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  setup() {
    const ordenesStore = useordenesStore();
    const loading = ref(false);

    // Variables para cálculos
    const tarifaBase = ref(0);
    const volumenTotal = ref(0);
    const costoVolumen = ref(0);
    const impuestoAeroportuario = ref(0);
    const comisionServicio = ref(0);
    const precioTotal = ref(0);

    const calcularTotales = (event: Event) => {
      const form = (event.target as HTMLInputElement).form;
      if (!form) return;

      const formData = new FormData(form);
      const peso = parseFloat(formData.get("peso") as string) || 0;
      const cantidadBultos =
        parseInt(formData.get("cantidadBultos") as string) || 1;
      const volumenBulto =
        parseFloat(formData.get("volumenBulto") as string) || 0;

      // Calcular volumen total (cantidad × volumen por bulto)
      volumenTotal.value = cantidadBultos * volumenBulto;

      // Calcular costo por volumen (100 CUP por m³)
      costoVolumen.value = volumenTotal.value * 100;

      // Calcular tarifa base (70 CUP por kg)
      tarifaBase.value = peso * 70;

      // Calcular impuesto aeroportuario (7.70 CUP por kg)
      impuestoAeroportuario.value = peso * 7.7;

      // Seleccionar el mayor entre costo por volumen y tarifa base
      const baseParaCalculos = Math.max(costoVolumen.value, tarifaBase.value);

      // Calcular subtotal (base seleccionada + impuesto)
      const subtotal = baseParaCalculos + impuestoAeroportuario.value;

      // Calcular comisión del servicio (5% del subtotal)
      comisionServicio.value = subtotal * 0.05;

      // Calcular total (subtotal + comisión)
      precioTotal.value = subtotal + comisionServicio.value;
    };

    // Esquema de validación
    const schema = yup.object({
      carnetIdentidad: yup
        .string()
        .required("El carnet de identidad es requerido")
        .matches(/^[0-9]+$/, "Debe contener solo números"),
      nombreRemitente: yup
        .string()
        .required("El nombre del remitente es obligatorio")
        .min(3, "Mínimo 3 caracteres"),
      direccionRemitente: yup
        .string()
        .required("La dirección es obligatoria")
        .min(10, "La dirección debe ser más específica"),
      carnetIdentidadEmisor: yup
        .string()
        .required("El carnet de identidad del emisor es requerido")
        .matches(/^[0-9]+$/, "Debe contener solo números"),
      nombreEmisor: yup
        .string()
        .required("El nombre del emisor es obligatorio")
        .min(3, "Mínimo 3 caracteres"),
      direccionEmisor: yup
        .string()
        .required("La dirección del emisor es obligatoria")
        .min(10, "La dirección debe ser más específica"),
      cantidadBultos: yup
        .number()
        .required("La cantidad de bultos es requerida")
        .min(1, "Mínimo 1 bulto")
        .integer("Debe ser un número entero"),
      peso: yup
        .number()
        .required("El peso es requerido")
        .min(0.1, "Mínimo 0.1 kg"),
      volumenBulto: yup
        .number()
        .required("El volumen por bulto es requerido")
        .min(0.01, "Mínimo 0.01 m³"),
      origen: yup.string().required("El origen es requerido"),
      destino: yup.string().required("El destino es requerido"),
      autorizadoRecoger: yup
        .string()
        .required("La persona autorizada a recoger es requerida")
        .min(3, "Mínimo 3 caracteres"),
      tipoCarga: yup
        .string()
        .required("El tipo de carga es requerido")
        .oneOf(["Misceláneas", "Carga General"], "Tipo de carga no válido"),
    });

    const handleSubmit = async (
      values: any,
      { resetForm }: { resetForm: () => void },
    ) => {
      loading.value = true;

      try {
        const newOrden = {
          id: ordenesStore.ordenes.length + 1,
          codigoOrden: generateOrderCode(),
          carnetIdentidad: values.carnetIdentidad,
          nombreRemitente: values.nombreRemitente,
          direccionRemitente: values.direccionRemitente,
          carnetIdentidadEmisor: values.carnetIdentidadEmisor,
          nombreEmisor: values.nombreEmisor,
          direccionEmisor: values.direccionEmisor,
          cantidadBultos: values.cantidadBultos,
          peso: values.peso,
          volumenBulto: values.volumenBulto,
          volumenTotal: volumenTotal.value,
          origen: values.origen,
          destino: values.destino,
          autorizadoRecoger: values.autorizadoRecoger,
          tipoCarga: values.tipoCarga,
          tarifaBase: tarifaBase.value,
          costoVolumen: costoVolumen.value,
          impuestoAeroportuario: impuestoAeroportuario.value,
          comisionServicio: comisionServicio.value,
          precioTotal: precioTotal.value,
          fechaRegistro: new Date().toISOString(),
        };

        await ordenesStore.addOrden(newOrden);

        Swal.fire({
          text: "¡Orden registrada exitosamente!",
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "Aceptar",
          customClass: {
            confirmButton: "btn btn-primary",
          },
        }).then(() => {
          resetForm();
          // Resetear valores calculados
          tarifaBase.value = 0;
          volumenTotal.value = 0;
          costoVolumen.value = 0;
          impuestoAeroportuario.value = 0;
          comisionServicio.value = 0;
          precioTotal.value = 0;
        });
      } catch (error) {
        Swal.fire({
          text: "Error al registrar la orden",
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "Entendido",
          customClass: {
            confirmButton: "btn btn-primary",
          },
        });
      } finally {
        loading.value = false;
      }
    };

    // En el setup() del formulario de creación
    const generateOrderCode = (): string => {
      // Prefijo basado en el tipo de carga (primeras letras)
      const prefix = "ORD"; // Podría ser diferente según el tipo de carga

      // Parte aleatoria (4 caracteres alfanuméricos)
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Eliminamos caracteres ambiguos
      let randomPart = "";
      for (let i = 0; i < 4; i++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      // Parte secuencial (basada en timestamp)
      const sequentialPart = Date.now().toString().slice(-4);

      // Combinar todo
      const code = `${prefix}${sequentialPart}${randomPart}`;

      // Verificar unicidad (en un entorno real, verificar contra la base de datos)
      const isUnique = !ordenesStore.ordenes.some(
        (order) => order.codigoOrden === code,
      );

      // Si no es único, generar otro (raro que ocurra con este formato)
      return isUnique ? code : generateOrderCode();
    };

    return {
      schema,
      handleSubmit,
      loading,
      tarifaBase,
      volumenTotal,
      costoVolumen,
      impuestoAeroportuario,
      comisionServicio,
      precioTotal,
      calcularTotales,
    };
  },
});
</script>
