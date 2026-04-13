<template>
  <Form
    @submit="handleSubmit"
    :validation-schema="schema"
    v-slot="{ resetForm }"
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
                  @change="calcularTotales"
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
                  @change="calcularTotales"
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
                  @change="calcularTotales"
                />
                <ErrorMessage name="vol_bulto" class="text-danger" />
              </div>

              <div class="col-md-6 mb-4">
                <label class="required form-label">Origen</label>
                <Field
                  name="origen_string"
                  as="select"
                  class="form-select form-select-solid"
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
                />
                <ErrorMessage name="autorizado_recoger" class="text-danger" />
              </div>

              <div class="col-md-12 mb-4">
                <label class="required form-label">Tipo de Carga</label>
                <Field
                  name="tipo_carga"
                  as="select"
                  class="form-select form-select-solid"
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
                >
                  <option value="">Seleccione vía</option>
                  <!-- Ajusta values para que coincidan con tu enum ViaMode en backend -->
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
import { defineComponent, ref, onMounted, computed } from "vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import Swal from "sweetalert2/dist/sweetalert2.js";
import api from "@/services/api";
import CargaApi from "@/axios/axios";
import { useOrigenStore } from "@/stores/origen";
import { useDestinoStore } from "@/stores/destino";
import { useCookies } from "vue3-cookies";

export default defineComponent({
  name: "AddOrdenForm",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  setup() {
    const loading = ref(false);
    const tarifaBase = ref(0);
    const volumenTotal = ref(0);
    const costoVolumen = ref(0);
    const impuestoAeroportuario = ref(0);
    const comisionServicio = ref(0);
    const precioTotal = ref(0);

    const destinoStore = useDestinoStore();
    const destinos = computed(() => destinoStore.destinoes);
    const origenStore = useOrigenStore();
    const origenes = computed(() => origenStore.origenes);

    const { cookies } = useCookies();
    const cookieUser = ref<any>(null);
    const selectedClientId = ref<string | null>(null);
    const clients = ref<any[]>([]);

    const isAdmin = ref(false);
    const clientDisplayName = computed(() => {
      if (!cookieUser.value) return "";
      return (
        cookieUser.value.name ||
        cookieUser.value.username ||
        cookieUser.value.email ||
        ""
      );
    });

    const calcularTotales = (event: Event) => {
      const form = (event.target as HTMLInputElement).form;
      if (!form) return;

      const formData = new FormData(form);

      const peso = Math.max(
        0,
        parseFloat(formData.get("peso_total") as string) || 0,
      );
      const cantidadBultos = Math.max(
        1,
        parseInt(formData.get("cant_bultos") as string) || 1,
      );
      const volumenBulto = Math.max(
        0,
        parseFloat(formData.get("vol_bulto") as string) || 0,
      );

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
        console.error("Error: Valores negativos detectados en cálculos");
        resetCalculos();
      }
    };

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

    const resetCalculos = () => {
      tarifaBase.value = 0;
      volumenTotal.value = 0;
      costoVolumen.value = 0;
      impuestoAeroportuario.value = 0;
      comisionServicio.value = 0;
      precioTotal.value = 0;
    };

    onMounted(async () => {
      await origenStore.fetchOrigens();
      await destinoStore.fetchDestinos();

      // cargar user desde cookie (si existe)
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

      // determinar rol simple
      const roleName =
        cookieUser.value?.role?.name?.toString?.().toLowerCase?.() ||
        cookieUser.value?.role?.toString?.().toLowerCase?.() ||
        "";

      isAdmin.value = roleName === "administrador" || roleName === "admin";

      // si es cliente, asignamos selectedClientId automáticamente
      if (!isAdmin.value && cookieUser.value?.id) {
        selectedClientId.value = cookieUser.value.id;
      }

      // Si es admin intentamos cargar lista de clientes (para select)
      if (isAdmin.value) {
        try {
          const res = await api.get("/cliente/all");
          clients.value = res.data || [];
        } catch (err) {
          console.warn("No se pudieron cargar clientes:", err);
          clients.value = [];
        }
      }
    });

    // Interfaz ligera para la orden
    interface OrdenAerea {
      order_id: string;
      remitente_dni: string;
      remitente_nombre: string;
      direccion: string;
      emisor_dni: string;
      emisor_nombre: string;
      emisor_direccion: string;
      cant_bultos: number;
      peso_total: number;
      vol_bulto: number;
      autorizado_recoger: string;
      tipo_carga: string;
      origen_string: string;
      destino_string: string;
      fechaRegistro: string;
      estado: string;
      tarifabase: number;
      volumen: number;
      impuesto: number;
      comision: number;
      precio: number;
      clientId?: string;
      via?: string;
    }

    const handleSubmit = async (
      values: any,
      { resetForm }: { resetForm: () => void },
    ) => {
      loading.value = true;

      try {
        // Re-check calculations
        if (
          tarifaBase.value === 0 &&
          volumenTotal.value === 0 &&
          precioTotal.value === 0
        ) {
          // permitir si el usuario confía, pero normalmente no debería
          throw new Error(
            "Los cálculos de precio son inválidos o están incompletos.",
          );
        }

        const order_id = `ORD${Date.now()}`;

        const ordenCompleta: OrdenAerea = {
          order_id,
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
          fechaRegistro: new Date().toISOString(),
          estado: "Pendiente",
          tarifabase: Number(tarifaBase.value),
          volumen: Number(volumenTotal.value),
          impuesto: Number(impuestoAeroportuario.value),
          comision: Number(comisionServicio.value),
          precio: Number(precioTotal.value),
          clientId: selectedClientId.value || undefined,
          via: values.via || undefined,
        };

        // Llamada real al backend
        // CargaApi.createOrden debe aceptar el payload completo acorde al DTO
        const res = await CargaApi.createOrden(ordenCompleta);

        await Swal.fire({
          title: "Éxito",
          text: "Orden registrada correctamente",
          icon: "success",
          confirmButtonText: "Aceptar",
        });

        resetForm();
        resetCalculos();
      } catch (error: any) {
        console.error("Error al crear orden:", error);
        await Swal.fire({
          title: "Error",
          text:
            error?.response?.data?.message ||
            error.message ||
            "Error al registrar la orden",
          icon: "error",
          confirmButtonText: "Entendido",
        });
      } finally {
        loading.value = false;
      }
    };

    return {
      schema,
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
      resetForm: () => {},
    };
  },
});
</script>

<style scoped>
/* ajustar cosas si quieres */
</style>
