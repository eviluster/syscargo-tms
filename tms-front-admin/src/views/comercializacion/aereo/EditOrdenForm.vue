<template>
  <Form
    @submit="handleSubmit"
    :validation-schema="schema"
    :initial-values="initialValues"
    v-slot="{ resetForm, values }"
  >
    <div class="row my-6">
      <!-- Sección Remitente -->
      <div class="col-md-6">
        <div class="card shadow-sm mb-6">
          <div class="card-body">
            <h3 class="card-title mb-4">Información del Remitente</h3>
            <div class="mb-4">
              <label class="required form-label">Carnet de Identidad</label>
              <Field
                name="remitente_dni"
                type="text"
                class="form-control form-control-solid"
                placeholder="Número de carnet"
                @change="() => calcularTotales(values)"
              />
              <ErrorMessage name="remitente_dni" class="text-danger" />
            </div>
            <div class="mb-4">
              <label class="required form-label">Nombre Completo</label>
              <Field
                name="remitente_nombre"
                type="text"
                class="form-control form-control-solid"
                placeholder="Nombre del remitente"
                @change="() => calcularTotales(values)"
              />
              <ErrorMessage name="remitente_nombre" class="text-danger" />
            </div>
            <div class="mb-4">
              <label class="required form-label">Dirección</label>
              <Field
                name="direccion"
                as="textarea"
                class="form-control form-control-solid"
                placeholder="Dirección completa"
                rows="3"
                @change="() => calcularTotales(values)"
              />
              <ErrorMessage name="direccion" class="text-danger" />
            </div>
          </div>
        </div>

        <!-- Sección Emisor -->
        <div class="card shadow-sm mb-6">
          <div class="card-body">
            <h3 class="card-title mb-4">Información del Emisor</h3>
            <div class="mb-4">
              <label class="required form-label">Carnet de Identidad</label>
              <Field
                name="emisor_dni"
                type="text"
                class="form-control form-control-solid"
                placeholder="Número de carnet"
                @change="() => calcularTotales(values)"
              />
              <ErrorMessage name="emisor_dni" class="text-danger" />
            </div>
            <div class="mb-4">
              <label class="required form-label">Nombre Completo</label>
              <Field
                name="emisor_nombre"
                type="text"
                class="form-control form-control-solid"
                placeholder="Nombre del emisor"
                @change="() => calcularTotales(values)"
              />
              <ErrorMessage name="emisor_nombre" class="text-danger" />
            </div>
            <div class="mb-4">
              <label class="required form-label">Dirección</label>
              <Field
                name="emisor_direccion"
                as="textarea"
                class="form-control form-control-solid"
                placeholder="Dirección completa"
                rows="3"
                @change="() => calcularTotales(values)"
              />
              <ErrorMessage name="emisor_direccion" class="text-danger" />
            </div>
          </div>
        </div>
      </div>

      <!-- Sección Detalles del Envío -->
      <div class="col-md-6">
        <div class="card shadow-sm mb-6">
          <div class="card-body">
            <h3 class="card-title mb-4">Detalles del Envío</h3>
            <div class="row">
              <div class="col-md-6 mb-4">
                <label class="required form-label">Cantidad de Bultos</label>
                <Field
                  name="cant_bultos"
                  type="number"
                  min="1"
                  class="form-control form-control-solid"
                  placeholder="Ej: 2"
                  @change="() => calcularTotales(values)"
                />
                <ErrorMessage name="cant_bultos" class="text-danger" />
              </div>
              <div class="col-md-6 mb-4">
                <label class="required form-label">Peso Total (kg)</label>
                <Field
                  name="peso_total"
                  type="number"
                  step="0.1"
                  min="0.1"
                  class="form-control form-control-solid"
                  placeholder="Ej: 5.5"
                  @change="() => calcularTotales(values)"
                />
                <ErrorMessage name="peso_total" class="text-danger" />
              </div>
              <div class="col-md-6 mb-4">
                <label class="required form-label"
                  >Volumen (m³ por bulto)</label
                >
                <Field
                  name="vol_bulto"
                  type="number"
                  step="0.01"
                  min="0.01"
                  class="form-control form-control-solid"
                  placeholder="Ej: 0.5"
                  @change="() => calcularTotales(values)"
                />
                <ErrorMessage name="vol_bulto" class="text-danger" />
              </div>

              <div class="col-md-6 mb-4">
                <label class="required form-label">Origen</label>
                <Field
                  name="origen_string"
                  as="select"
                  class="form-select form-select-solid"
                  @change="() => calcularTotales(values)"
                >
                  <option value="">Seleccione un origen</option>
                  <option
                    v-for="item in origenes"
                    :key="item.id"
                    :value="item.name"
                  >
                    {{ item.name }}
                  </option>
                </Field>
                <ErrorMessage name="origen_string" class="text-danger" />
              </div>
              <div class="col-md-6 mb-4">
                <label class="required form-label">Destino</label>
                <Field
                  name="destino_string"
                  as="select"
                  class="form-select form-select-solid"
                  @change="() => calcularTotales(values)"
                >
                  <option value="">Seleccione un destino</option>
                  <option
                    v-for="item in destinos"
                    :key="item.id"
                    :value="item.name"
                  >
                    {{ item.name }}
                  </option>
                </Field>
                <ErrorMessage name="destino_string" class="text-danger" />
              </div>

              <div class="col-md-12 mb-4">
                <label class="required form-label">Autorizado a Recoger</label>
                <Field
                  name="autorizado_recoger"
                  type="text"
                  class="form-control form-control-solid"
                  placeholder="Nombre de la persona autorizada"
                  @change="() => calcularTotales(values)"
                />
                <ErrorMessage name="autorizado_recoger" class="text-danger" />
              </div>

              <div class="col-md-12 mb-4">
                <label class="required form-label">Tipo de Carga</label>
                <Field
                  name="tipo_carga"
                  as="select"
                  class="form-select form-select-solid"
                  @change="() => calcularTotales(values)"
                >
                  <option value="">Seleccione un tipo</option>
                  <option value="Seco">Seco</option>
                  <option value="Refrigerado">Refrigerado</option>
                  <option value="Carga general">Carga general</option>
                </Field>
                <ErrorMessage name="tipo_carga" class="text-danger" />
              </div>

              <!-- NUEVO: Vía (marítima / aérea / terrestre / ferroviaria / multimodal) -->
              <div class="col-md-12 mb-4">
                <label class="required form-label">Vía</label>
                <Field
                  name="via"
                  as="select"
                  class="form-select form-select-solid"
                  @change="() => calcularTotales(values)"
                >
                  <option value="">Seleccione vía</option>
                  <option value="maritima">Marítima</option>
                  <option value="aerea">Aérea</option>
                  <option value="terrestre">Terrestre</option>
                  <option value="ferroviaria">Ferroviaria</option>
                  <option value="multimodal">Multimodal</option>
                </Field>
                <ErrorMessage name="via" class="text-danger" />
              </div>

              <!-- SELECT para cliente (solo si es admin) o display si es cliente -->
              <div class="col-md-12 mb-4" v-if="isAdmin">
                <label class="form-label">Asignar Cliente (opcional)</label>
                <select
                  v-model="selectedClientId"
                  class="form-select form-select-solid"
                >
                  <option value="">-- Seleccione Cliente --</option>
                  <option v-for="c in clients" :key="c.id" :value="c.id">
                    {{ c.name || c.username || c.email }}
                  </option>
                </select>
              </div>
              <div class="col-md-12 mb-4" v-else>
                <label class="form-label">Cliente</label>
                <input
                  type="text"
                  class="form-control form-control-solid"
                  :value="clientDisplayName"
                  readonly
                />
              </div>

              <div class="col-md-12 mb-4">
                <label class="form-label">Detalles del Cálculo</label>
                <div class="card bg-light p-3">
                  <div class="d-flex justify-content-between">
                    <span>Tarifa base (70/kg):</span>
                    <span>{{ tarifaBase.toFixed(0) }} CUP</span>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span
                      >Volumen ({{ volumenTotal.toFixed(0) }} m³ × 100
                      CUP):</span
                    >
                    <span>{{ costoVolumen.toFixed(0) }} CUP</span>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span>Impuesto aeroportuario (7.70/kg):</span>
                    <span>{{ impuestoAeroportuario.toFixed(0) }} CUP</span>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span>Comisión del servicio (5%):</span>
                    <span>{{ comisionServicio.toFixed(0) }} CUP</span>
                  </div>
                  <div class="d-flex justify-content-between fw-bold mt-2">
                    <span>Total a pagar:</span>
                    <span>{{ precioTotal.toFixed(0) }} CUP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- /col-md-6 -->

      <div class="col-12">
        <div class="card-footer d-flex justify-content-end">
          <button
            type="button"
            class="btn btn-light me-3"
            @click="onCancel(resetForm)"
          >
            Cancelar
          </button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="!loading">Guardar cambios</span>
            <span v-else>
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
import { defineComponent, ref, onMounted, computed, watch, toRefs } from "vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import Swal from "sweetalert2/dist/sweetalert2.js";
import api from "@/services/api";
import { useOrigenStore } from "@/stores/origen";
import { useDestinoStore } from "@/stores/destino";
import { useCookies } from "vue3-cookies";

export default defineComponent({
  name: "EditOrdenForm",
  components: { Form, Field, ErrorMessage },
  props: {
    orden: {
      type: Object,
      required: true,
    },
  },
  emits: ["saved", "cancel"],
  setup(props, { emit }) {
    // stores
    const origenStore = useOrigenStore();
    const destinoStore = useDestinoStore();

    const origenes = computed(() => origenStore.origenes);
    const destinos = computed(() => destinoStore.destinoes);

    // UI state
    const loading = ref(false);
    const tarifaBase = ref(0);
    const volumenTotal = ref(0);
    const costoVolumen = ref(0);
    const impuestoAeroportuario = ref(0);
    const comisionServicio = ref(0);
    const precioTotal = ref(0);

    // cookie user
    const { cookies } = useCookies();
    const cookieUser = ref<any>(null);
    const clients = ref<any[]>([]);
    const selectedClientId = ref<string | null>(null);
    const isAdmin = ref(false);

    // initial values used by vee-validate Form
    const initialValues = ref<any>({
      // defaults - overwritten on mount by props.orden
      order_id: "",
      remitente_dni: "",
      remitente_nombre: "",
      direccion: "",
      emisor_dni: "",
      emisor_nombre: "",
      emisor_direccion: "",
      cant_bultos: 1,
      peso_total: 0,
      vol_bulto: 0,
      autorizado_recoger: "",
      tipo_carga: "",
      origen_string: "",
      destino_string: "",
      via: "",
    });

    // validation schema (same que antes)
    const schema = yup.object({
      remitente_dni: yup
        .string()
        .required("El carnet de identidad es requerido")
        .matches(/^[0-9]+$/, "Debe contener solo números"),
      remitente_nombre: yup
        .string()
        .required("El nombre del remitente es obligatorio")
        .min(3, "Mínimo 3 caracteres"),
      direccion: yup
        .string()
        .required("La dirección es obligatoria")
        .min(10, "La dirección debe ser más específica"),
      emisor_dni: yup
        .string()
        .required("El carnet de identidad del emisor es requerido")
        .matches(/^[0-9]+$/, "Debe contener solo números"),
      emisor_nombre: yup
        .string()
        .required("El nombre del emisor es obligatorio")
        .min(3, "Mínimo 3 caracteres"),
      emisor_direccion: yup
        .string()
        .required("La dirección del emisor es obligatoria")
        .min(10, "La dirección debe ser más específica"),
      cant_bultos: yup
        .number()
        .required("La cantidad de bultos es requerida")
        .min(1, "Mínimo 1 bulto")
        .integer("Debe ser un número entero"),
      peso_total: yup.number().required("El peso es requerido"),
      vol_bulto: yup.number().required("El volumen por bulto es requerido"),
      origen_string: yup.string().required("El origen es requerido"),
      destino_string: yup.string().required("El destino es requerido"),
      autorizado_recoger: yup
        .string()
        .required("El nombre de la persona autorizada es obligatorio"),
      tipo_carga: yup.string().required("El tipo de carga es requerido"),
      via: yup.string().required("La vía es requerida"),
    });

    // helpers para display nombre cliente
    const clientDisplayName = computed(() => {
      if (!cookieUser.value) return "";
      return (
        cookieUser.value.name ||
        cookieUser.value.username ||
        cookieUser.value.email ||
        ""
      );
    });

    // load stores / client list / cookie user
    onMounted(async () => {
      await origenStore.fetchOrigens();
      await destinoStore.fetchDestinos();

      // cookie user
      const raw = cookies.get("userData");
      try {
        cookieUser.value = raw
          ? typeof raw === "string"
            ? JSON.parse(raw)
            : raw
          : null;
      } catch (e) {
        cookieUser.value = raw;
      }

      const roleName =
        cookieUser.value?.role?.name?.toString?.().toLowerCase?.() ||
        cookieUser.value?.role?.toString?.().toLowerCase?.() ||
        "";
      isAdmin.value = roleName === "administrador" || roleName === "admin";

      // assign client id if not admin
      if (!isAdmin.value && cookieUser.value?.id) {
        selectedClientId.value = cookieUser.value.id;
      }

      if (isAdmin.value) {
        try {
          const res = await api.get("/cliente/all");
          clients.value = res.data || [];
        } catch (err) {
          clients.value = [];
        }
      }

      // populate initialValues from prop orden
      populateInitialValuesFromProp();
    });

    // Re-populate if prop orden changes
    watch(
      () => props.orden,
      () => {
        populateInitialValuesFromProp();
      },
      { immediate: true },
    );

    function populateInitialValuesFromProp() {
      const o = props.orden || {};
      initialValues.value = {
        order_id: o.order_id ?? o.id ?? "",
        remitente_dni: o.remitente_dni ?? "",
        remitente_nombre: o.remitente_nombre ?? "",
        direccion: o.direccion ?? "",
        emisor_dni: o.emisor_dni ?? "",
        emisor_nombre: o.emisor_nombre ?? "",
        emisor_direccion: o.emisor_direccion ?? "",
        cant_bultos: o.cant_bultos ?? 1,
        peso_total: o.peso_total ?? 0,
        vol_bulto: o.vol_bulto ?? 0,
        autorizado_recoger: o.autorizado_recoger ?? "",
        tipo_carga: o.tipo_carga ?? "",
        origen_string: o.origen_string ?? "",
        destino_string: o.destino_string ?? "",
        via: o.via ?? "",
      };

      // client
      selectedClientId.value =
        o.clientId ?? o.client_id ?? o.cliente?.id ?? selectedClientId.value;

      // recalc totals from these initial values
      recalcFromValues(initialValues.value);
    }

    // Recalc helper that accepts values object (from form or initialValues)
    function recalcFromValues(vals: any) {
      const peso = Math.max(0, Number(vals.peso_total || 0));
      const cantidadBultos = Math.max(1, Number(vals.cant_bultos || 1));
      const volumenBulto = Math.max(0, Number(vals.vol_bulto || 0));

      volumenTotal.value = Math.round(cantidadBultos * volumenBulto);
      costoVolumen.value = Math.round(volumenTotal.value * 100);
      tarifaBase.value = Math.round(peso * 70);
      impuestoAeroportuario.value = Math.round(peso * 7.7);

      const baseParaCalculos = Math.max(costoVolumen.value, tarifaBase.value);
      const subtotal = baseParaCalculos + impuestoAeroportuario.value;
      comisionServicio.value = Math.round(subtotal * 0.05);
      precioTotal.value = Math.round(subtotal + comisionServicio.value);

      if (
        [
          volumenTotal.value,
          costoVolumen.value,
          tarifaBase.value,
          impuestoAeroportuario.value,
          comisionServicio.value,
          precioTotal.value,
        ].some((val) => val < 0)
      ) {
        // prevenir valores raros
        tarifaBase.value = 0;
        volumenTotal.value = 0;
        costoVolumen.value = 0;
        impuestoAeroportuario.value = 0;
        comisionServicio.value = 0;
        precioTotal.value = 0;
      }
    }

    // llamada desde inputs: recibe current form values
    function calcularTotales(values: any) {
      if (!values) {
        // si no vienen values, usar initialValues
        recalcFromValues(initialValues.value);
        return;
      }
      recalcFromValues(values);
    }

    // handle submit: PUT /carga/:id
    const handleSubmit = async (values: any, { resetForm }: any) => {
      if (!props.orden || !props.orden.id) {
        await Swal.fire({
          icon: "error",
          text: "No se encontró la orden a editar.",
        });
        return;
      }

      loading.value = true;
      try {
        // actualizar cálculos por seguridad
        recalcFromValues(values);

        const payload: any = {
          remitente_dni: values.remitente_dni,
          remitente_nombre: values.remitente_nombre,
          direccion: values.direccion,
          emisor_dni: values.emisor_dni,
          emisor_nombre: values.emisor_nombre,
          emisor_direccion: values.emisor_direccion,
          cant_bultos: Number(values.cant_bultos),
          peso_total: Number(values.peso_total),
          vol_bulto: Number(values.vol_bulto),
          autorizado_recoger: values.autorizado_recoger,
          tipo_carga: values.tipo_carga,
          origen_string: values.origen_string,
          destino_string: values.destino_string,
          tarifabase: tarifaBase.value,
          volumen: volumenTotal.value,
          impuesto: impuestoAeroportuario.value,
          comision: comisionServicio.value,
          precio: precioTotal.value,
          via: values.via || undefined,
          // si admin eligió cliente
          clientId: selectedClientId.value || undefined,
        };

        // PUT al backend
        const res = await api.put(`/carga/${props.orden.id}`, payload);

        await Swal.fire({
          icon: "success",
          title: "Orden actualizada",
          text: "Los cambios se guardaron correctamente",
        });

        // emit saved con la data actualizada
        emit("saved", res.data || payload);

        // opcional: resetForm si quieres
        // resetForm(); // no reseteamos para edición
      } catch (err: any) {
        console.error("Error actualizando orden:", err);
        await Swal.fire({
          icon: "error",
          title: "Error",
          text:
            err?.response?.data?.message ||
            err?.message ||
            "Error al actualizar la orden",
        });
      } finally {
        loading.value = false;
      }
    };

    function onCancel(resetForm: Function) {
      // resetForm to initial values
      if (typeof resetForm === "function")
        resetForm({ values: initialValues.value });
      emit("cancel");
    }

    return {
      schema,
      initialValues,
      calcularTotales,
      handleSubmit,
      loading,
      origenes,
      destinos,
      tarifaBase,
      volumenTotal,
      costoVolumen,
      impuestoAeroportuario,
      comisionServicio,
      precioTotal,
      clients,
      selectedClientId,
      isAdmin,
      clientDisplayName,
      onCancel,
    };
  },
});
</script>

<style scoped>
/* ajustar cosas si quieres */
</style>
