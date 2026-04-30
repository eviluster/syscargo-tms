<template>
  <Form
    v-if="schema"
    @submit="handleSubmit"
    :validation-schema="schema"
    :initial-values="initialValues"
    v-slot="{ resetForm, values }"
  >
    <div class="row my-6">
      <!-- Encabezado: Fecha / Nº Orden -->
      <div class="col-12 mb-3">
        <div class="d-flex gap-3 align-items-center">
          <div class="flex-grow-1">
            <label class="form-label">Fecha de Emisión</label>
            <Field
              name="fecha_emision"
              type="date"
              class="form-control form-control-solid"
            />
            <ErrorMessage name="fecha_emision" class="text-danger" />
          </div>

          <!-- <div style="width: 220px">
            <label class="form-label">No. de Orden</label>
            <Field
              name="no_orden"
              type="text"
              class="form-control form-control-solid"
              placeholder="ORD123456"
            />
            <ErrorMessage name="no_orden" class="text-danger" />
          </div> -->

          <div style="width: 650px">
            <label class="form-label">Nombre del Comprador Interno</label>
            <Field
              name="comprador_interno"
              type="text"
              class="form-control form-control-solid"
              placeholder="Comprador interno"
            />
            <ErrorMessage name="comprador_interno" class="text-danger" />
          </div>
        </div>
      </div>

      <!-- Sección Remitente -->
      <div class="col-md-6">
        <div class="card shadow-sm mb-6">
          <div class="card-body">
            <h3 class="card-title mb-4">Remitente</h3>

            <div class="mb-3">
              <label class="required form-label">Carnet de Identidad</label>
              <Field
                name="remitente_dni"
                type="text"
                class="form-control form-control-solid"
                placeholder="Número de carnet"
              />
              <ErrorMessage name="remitente_dni" class="text-danger" />
            </div>

            <div class="mb-3">
              <label class="required form-label">Nombre Completo</label>
              <Field
                name="remitente_nombre"
                type="text"
                class="form-control form-control-solid"
                placeholder="Nombre del remitente"
              />
              <ErrorMessage name="remitente_nombre" class="text-danger" />
            </div>

            <div class="mb-3">
              <label class="required form-label">Domicilio / Dirección</label>
              <Field
                name="direccion"
                as="textarea"
                rows="3"
                class="form-control form-control-solid"
                placeholder="Dirección completa"
              />
              <ErrorMessage name="direccion" class="text-danger" />
            </div>

            <div class="mb-2">
              <label class="form-label">Se autoriza carga en (lugar)</label>
              <Field
                name="autorizado_lugar"
                type="text"
                class="form-control form-control-solid"
                placeholder="Lugar autorizado"
              />
            </div>
            <div class="mb-2">
              <label class="form-label">Fecha autorizada</label>
              <Field
                name="fecha_autorizada"
                type="date"
                class="form-control form-control-solid"
              />
            </div>
          </div>
        </div>

        <!-- Sección Emisor -->
        <div class="card shadow-sm mb-6">
          <div class="card-body">
            <h3 class="card-title mb-4">
              Emisor / Comprador Interno (Representante)
            </h3>

            <div class="mb-3">
              <label class="required form-label"
                >Nombre completo representante</label
              >
              <Field
                name="emisor_nombre"
                type="text"
                class="form-control form-control-solid"
                placeholder="Nombre y apellidos"
              />
              <ErrorMessage name="emisor_nombre" class="text-danger" />
            </div>

            <div class="row g-2">
              <div class="col-6">
                <label class="form-label">Carné Identidad No.</label>
                <Field
                  name="emisor_dni"
                  type="text"
                  class="form-control form-control-solid"
                />
                <ErrorMessage name="emisor_dni" class="text-danger" />
              </div>
              <div class="col-6">
                <label class="form-label">Cargo</label>
                <Field
                  name="representante_cargo"
                  type="text"
                  class="form-control form-control-solid"
                />
                <ErrorMessage name="representante_cargo" class="text-danger" />
              </div>
            </div>

            <div class="mt-3">
              <label class="form-label">Firma / Cuño oficial</label>
              <Field
                name="firma"
                type="text"
                class="form-control form-control-solid"
                placeholder="Nombre quien firma / cuño"
              />
              <ErrorMessage name="firma" class="text-danger" />
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
                <label class="required form-label">Tipo de Producto</label>
                <Field
                  name="tipo_producto"
                  type="text"
                  class="form-control form-control-solid"
                  placeholder="Ej: Mercancía X"
                />
                <ErrorMessage name="tipo_producto" class="text-danger" />
              </div>

              <div class="col-md-6 mb-4">
                <label class="form-label">Siglas y Nº del Contenedor</label>
                <Field
                  name="contenedor_siglas"
                  type="text"
                  class="form-control form-control-solid"
                  placeholder="Ej: ABCU 1234567"
                />
                <ErrorMessage name="contenedor_siglas" class="text-danger" />
              </div>

              <div class="col-md-4 mb-4">
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
              <div class="col-md-4 mb-4">
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
              <div class="col-md-4 mb-4">
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
                <label class="required form-label">Dirección completa de origen</label>
                <Field
                  name="origen_direccion"
                  as="textarea"
                  rows="2"
                  class="form-control form-control-solid"
                  placeholder="Calle, número, entre calles, municipio, provincia"
                />
                <ErrorMessage name="origen_direccion" class="text-danger" />
              </div>

              <div class="col-md-6 mb-4">
                <label class="required form-label"
                  >Destino / Con destino a</label
                >
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
              <div class="col-md-6 mb-4">
                <label class="required form-label">Dirección completa de destino</label>
                <Field
                  name="destino_direccion"
                  as="textarea"
                  rows="2"
                  class="form-control form-control-solid"
                  placeholder="Calle, número, entre calles, municipio, provincia"
                />
                <ErrorMessage name="destino_direccion" class="text-danger" />
              </div>

              <div class="col-md-12 mb-4">
                <label class="form-label">Nombre del Destinatario</label>
                <Field
                  name="nombre_destinatario"
                  type="text"
                  class="form-control form-control-solid"
                />
                <ErrorMessage name="nombre_destinatario" class="text-danger" />
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

              <div class="col-md-6 mb-4">
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

              <!-- Vía -->
              <div class="col-md-6 mb-4">
                <label class="required form-label">Vía</label>
                <Field
                  name="via"
                  as="select"
                  class="form-select form-select-solid"
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

              <div class="col-md-12 mb-4" v-if="values.via === 'terrestre'">
                <label class="required form-label">Transportista disponible</label>
                <Field
                  name="transportista_id"
                  as="select"
                  class="form-select form-select-solid"
                >
                  <option value="">Seleccione un transportista</option>
                  <option
                    v-for="transportista in transportistasDisponibles"
                    :key="transportista.id"
                    :value="String(transportista.id)"
                  >
                    {{ transportista.nombre }} - {{ transportista.tipoServicio }}
                  </option>
                </Field>
                <ErrorMessage name="transportista_id" class="text-danger" />
              </div>

              <!-- Campos MARÍTIMA -->

              <div class="col-md-12 mb-3">
                <h6 class="mb-2">Datos del Buque</h6>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Nombre del Buque</label>
                <Field name="nombre_buque" type="text" class="form-control" />
                <ErrorMessage name="nombre_buque" class="text-danger" />
              </div>
              <div class="col-md-2 mb-3">
                <label class="form-label">Mfto. No.</label>
                <Field name="mfto_no" type="text" class="form-control" />
              </div>
              <div class="col-md-2 mb-3">
                <label class="form-label">B/L No.</label>
                <Field name="bl_no" type="text" class="form-control" />
              </div>
              <div class="col-md-2 mb-3">
                <label class="form-label">D/M No.</label>
                <Field name="dm_no" type="text" class="form-control" />
              </div>

              <!-- Campos TERRESTRE -->

              <div class="col-md-12 mb-3">
                <h6 class="mb-2">Datos del Vehículo</h6>
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Vehículo perteneciente a</label>
                <Field
                  name="vehiculo_pertenece_a"
                  type="text"
                  class="form-control"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Conducido por</label>
                <Field name="conducido_por" type="text" class="form-control" />
              </div>

              <div class="col-md-4 mb-3">
                <label class="form-label">Chapa No.</label>
                <Field name="chapa_no" type="text" class="form-control" />
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">LOT No.</label>
                <Field name="lot_no" type="text" class="form-control" />
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Hoja Ruta No.</label>
                <Field name="hoja_ruta_no" type="text" class="form-control" />
              </div>

              <div class="col-md-4 mb-3">
                <label class="form-label">Chapa Tractivo No.</label>
                <Field
                  name="chapa_tractivo_no"
                  type="text"
                  class="form-control"
                />
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Remolque No.</label>
                <Field name="remolque_no" type="text" class="form-control" />
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Carta Porte No.</label>
                <Field name="carta_porte_no" type="text" class="form-control" />
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Carné Identidad Conductor</label>
                <Field
                  name="conductor_carnet_no"
                  type="text"
                  class="form-control"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Licencia de Conducción No.</label>
                <Field
                  name="licencia_conduccion_no"
                  type="text"
                  class="form-control"
                />
              </div>

              <div class="col-md-12 mb-4">
                <label class="form-label">Basificado en</label>
                <Field name="basificado_en" type="text" class="form-control" />
              </div>

              <!-- Cálculos resumen -->
              <div class="col-md-12 mb-4">
                <label class="form-label">Detalles del Cálculo</label>
                <div class="card bg-light p-3">
                  <div class="d-flex justify-content-between">
                    <span>Tarifa base (70/kg):</span>
                    <span>{{ tarifaBase.toFixed(0) }} CUP</span>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span
                      >Volumen ({{ volumenTotal.toFixed(2) }} m³ × 100
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
import { defineComponent, ref, onMounted, computed, reactive } from "vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import Swal from "sweetalert2/dist/sweetalert2.js";
import api from "@/services/api";
import CargaApi from "@/axios/axios";
import { useOrigenStore } from "@/stores/origen";
import { useDestinoStore } from "@/stores/destino";
import { useTransportistasStore } from "@/stores/transportistas";
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
    const transportistasStore = useTransportistasStore();
    const transportistasDisponibles = computed(() =>
      transportistasStore.getTransportistas.filter(
        (t) =>
          t.estado?.toLowerCase() === "activo" &&
          (t.tipoServicio?.toLowerCase().includes("carga") ||
            t.tipoServicio?.toLowerCase().includes("terrestre")),
      ),
    );

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

    // helper: fecha hoy para input type="date" (YYYY-MM-DD) en zona local
    function todayForDateInput(d = new Date()): string {
      const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
      return local.toISOString().slice(0, 10);
    }

    // initialValues (todos los campos del schema)
    const initialValues = reactive({
      fecha_emision: todayForDateInput(),
      no_orden: "",
      comprador_interno: "",
      remitente_dni: "",
      remitente_nombre: "",
      direccion: "",
      autorizado_lugar: "",
      fecha_autorizada: null,
      representante_nombre: "",
      representante_carnet: "",
      representante_cargo: "",
      firma: "",
      emisor_dni: "",
      emisor_nombre: "",
      // emisor_direccion: "",
      tipo_producto: "",
      contenedor_siglas: "",
      // cant_bultos: 1, // numérico: pon valor por defecto válido
      // peso_total: 0.1, // numérico: valor por defecto válido
      // vol_bulto: 0.001, // numérico: valor por defecto válido
      origen_string: "", // si tienes origenes, lo fijaremos luego
      destino_string: "", // si tienes destinos, lo fijaremos luego
      origen_direccion: "",
      destino_direccion: "",
      nombre_destinatario: "",
      autorizado_recoger: "",
      tipo_carga: "",
      via: "",
      transportista_id: "",
      nombre_buque: "",
      mfto_no: "",
      bl_no: "",
      dm_no: "",
      vehiculo_pertenece_a: "",
      conducido_por: "",
      chapa_no: "",
      lot_no: "",
      hoja_ruta_no: "",
      carta_porte_no: "",
      chapa_tractivo_no: "",
      remolque_no: "",
      conductor_carnet_no: "",
      licencia_conduccion_no: "",
      basificado_en: "",
    });

    const calcularTotales = (event: Event) => {
      const form = (event.target as HTMLInputElement).form;
      if (!form) return;

      const formData = new FormData(form);

      const peso = Math.max(
        0,
        parseFloat(String(formData.get("peso_total") || "0")) || 0,
      );
      const cantidadBultos = Math.max(
        1,
        parseInt(String(formData.get("cant_bultos") || "1")) || 1,
      );
      const volumenBulto = Math.max(
        0,
        parseFloat(String(formData.get("vol_bulto") || "0")) || 0,
      );

      volumenTotal.value = Number((cantidadBultos * volumenBulto).toFixed(2));
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

    const resetCalculos = () => {
      tarifaBase.value = 0;
      volumenTotal.value = 0;
      costoVolumen.value = 0;
      impuestoAeroportuario.value = 0;
      comisionServicio.value = 0;
      precioTotal.value = 0;
    };

    const toNumberOrUndefined = (value: any, original: any) => {
      if (original === "" || original == null) return undefined;
      const n = Number(original);
      return Number.isNaN(n) ? undefined : n;
    };

    const toDateOrNull = (value: any, original: any) => {
      if (original === "" || original == null) return null;
      // original viene como 'YYYY-MM-DD' desde <input type="date">
      const d = new Date(original);
      return isNaN(d.getTime()) ? null : d;
    };

    const schema = yup.object({
      // fecha_emision: yup
      //   .date()
      //   .transform(toDateOrNull)
      //   .typeError("Fecha inválida")
      //   .required("La fecha de emisión es requerida"),

      // no_orden: yup.string().optional(),
      comprador_interno: yup.string().optional(),

      // remitente_dni: yup
      //   .string()
      //   .transform((v) => (typeof v === "string" ? v.trim() : v))
      //   .required("El carnet de identidad es requerido")
      //   .matches(/^[0-9]+$/, "Debe contener solo números"),

      // remitente_nombre: yup
      //   .string()
      //   .transform((v) => (typeof v === "string" ? v.trim() : v))
      //   .required("El nombre del remitente es obligatorio")
      //   .min(3, "Mínimo 3 caracteres"),

      // direccion: yup
      //   .string()
      //   .transform((v) => (typeof v === "string" ? v.trim() : v))
      //   .required("La dirección es obligatoria")
      //   .min(5, "La dirección debe ser más específica"),

      autorizado_lugar: yup.string().optional(),
      fecha_autorizada: yup
        .date()
        .transform(toDateOrNull)
        .nullable()
        .optional(),

      representante_nombre: yup.string().optional(),
      representante_carnet: yup.string().optional(),
      representante_cargo: yup.string().optional(),
      firma: yup.string().optional(),

      // emisor_dni: yup
      //   .string()
      //   .transform((v) => (typeof v === "string" ? v.trim() : v))
      //   .required("El carnet de identidad del emisor es requerido")
      //   .matches(/^[0-9]+$/, "Debe contener solo números"),

      // emisor_nombre: yup
      //   .string()
      //   .transform((v) => (typeof v === "string" ? v.trim() : v))
      //   .required("El nombre del emisor es obligatorio")
      //   .min(3, "Mínimo 3 caracteres"),

      // emisor_direccion: yup
      //   .string()
      //   .transform((v) => (typeof v === "string" ? v.trim() : v))
      //   .required("La dirección del emisor es obligatoria")
      //   .min(5, "La dirección debe ser más específica"),

      tipo_producto: yup.string().optional(),
      contenedor_siglas: yup.string().optional(),

      cant_bultos: yup
        .number()
        .transform(toNumberOrUndefined)
        .required("La cantidad de bultos es requerida")
        .min(1, "Mínimo 1 bulto")
        .integer("Debe ser un número entero"),

      peso_total: yup
        .number()
        .transform(toNumberOrUndefined)
        .required("El peso es requerido")
        .min(0.1, "El peso mínimo es 0.1"),

      vol_bulto: yup
        .number()
        .transform(toNumberOrUndefined)
        .required("El volumen por bulto es requerido")
        .min(0.001, "Volumen mínimo 0.001"),

      // origen_string: yup.string().required("El origen es requerido"),
      // destino_string: yup.string().required("El destino es requerido"),
      origen_direccion: yup
        .string()
        .required("La dirección de origen es requerida")
        .min(10, "La dirección de origen debe ser más específica"),
      destino_direccion: yup
        .string()
        .required("La dirección de destino es requerida")
        .min(10, "La dirección de destino debe ser más específica"),
      nombre_destinatario: yup.string().optional(),

      autorizado_recoger: yup
        .string()
        .transform((v) => (typeof v === "string" ? v.trim() : v))
        .required("El nombre de la persona autorizada es obligatorio"),

      tipo_carga: yup.string().required("El tipo de carga es requerido"),
      via: yup.string().required("La vía es requerida"),
      transportista_id: yup.string().when("via", {
        is: (via: string) => via === "terrestre",
        then: (rule) => rule.required("Debe seleccionar un transportista"),
        otherwise: (rule) => rule.optional(),
      }),

      // campos opcionales marítima/terrestre...
      nombre_buque: yup.string().optional(),
      mfto_no: yup.string().optional(),
      bl_no: yup.string().optional(),
      dm_no: yup.string().optional(),
      vehiculo_pertenece_a: yup.string().optional(),
      conducido_por: yup.string().optional(),
      chapa_no: yup.string().optional(),
      lot_no: yup.string().optional(),
      hoja_ruta_no: yup.string().optional(),
      carta_porte_no: yup.string().optional(),
      chapa_tractivo_no: yup.string().optional(),
      remolque_no: yup.string().optional(),
      conductor_carnet_no: yup.string().optional(),
      licencia_conduccion_no: yup.string().optional(),
      basificado_en: yup.string().optional(),
    });

    onMounted(async () => {
      console.log(schema);
      await origenStore.fetchOrigens();
      await destinoStore.fetchDestinos();

      // recalcular fecha de emisión por si la página se abrió antes de medianoche
      initialValues.fecha_emision = todayForDateInput();

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

      // si es cliente, asignamos selectedClientId automáticamente (suponiendo cookieUser contiene clientId)
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

    const isMaritima = computed(() => {
      const el = document.querySelector<HTMLInputElement>('select[name="via"]');
      return el ? el.value.toLowerCase() === "maritima" : false;
    });

    const isTerrestre = computed(() => {
      const el = document.querySelector<HTMLInputElement>('select[name="via"]');
      return el ? el.value.toLowerCase() === "terrestre" : false;
    });

    interface OrdenAerea {
      order_id: string;
      fecha_emision: string;
      no_orden?: string;
      comprador_interno?: string;
      remitente_dni: string;
      remitente_nombre: string;
      direccion: string;
      autorizado_lugar?: string;
      fecha_autorizada?: string;
      representante_nombre?: string;
      representante_carnet?: string;
      representante_cargo?: string;
      firma?: string;
      emisor_dni: string;
      emisor_nombre: string;
      // emisor_direccion: string;
      tipo_producto?: string;
      contenedor_siglas?: string;
      cant_bultos: number;
      peso_total: number;
      vol_bulto: number;
      autorizado_recoger: string;
      tipo_carga: string;
      origen_string: string;
      destino_string: string;
      origen_direccion: string;
      destino_direccion: string;
      transportista_id?: string;
      transportista_nombre?: string;
      nombre_destinatario?: string;
      via?: string;
      nombre_buque?: string;
      mfto_no?: string;
      bl_no?: string;
      dm_no?: string;
      vehiculo_pertenece_a?: string;
      conducido_por?: string;
      chapa_no?: string;
      lot_no?: string;
      hoja_ruta_no?: string;
      carta_porte_no?: string;
      chapa_tractivo_no?: string;
      remolque_no?: string;
      conductor_carnet_no?: string;
      licencia_conduccion_no?: string;
      basificado_en?: string;
      tarifabase: number;
      volumen: number;
      impuesto: number;
      comision: number;
      precio: number;
      clientId?: string;
    }

    const handleSubmit = async (
      values: any,
      { resetForm }: { resetForm: (opts?: any) => void },
    ) => {
      console.log("Iniciando");
      try {
        await schema.validate(values, { abortEarly: false });
      } catch (e: any) {
        console.log("Errores yup:", e.inner || e);
        throw e; // para que veevalidate no continue
      }

      loading.value = true;

      try {
        // Re-check calculations
        if (
          tarifaBase.value === 0 &&
          volumenTotal.value === 0 &&
          precioTotal.value === 0
        ) {
          throw new Error(
            "Los cálculos de precio son inválidos o están incompletos.",
          );
        }

        const order_id = `ORD${Date.now()}`;

        const ordenCompleta: OrdenAerea = {
          order_id,
          fecha_emision: todayForDateInput(),
          no_orden: values.no_orden,
          comprador_interno: values.comprador_interno,
          remitente_dni: values.remitente_dni,
          remitente_nombre: values.remitente_nombre,
          direccion: values.direccion,
          autorizado_lugar: values.autorizado_lugar,
          fecha_autorizada: values.fecha_autorizada,
          representante_nombre: values.representante_nombre,
          representante_carnet: values.representante_carnet,
          representante_cargo: values.representante_cargo,
          firma: values.firma,
          emisor_dni: values.emisor_dni,
          emisor_nombre: values.emisor_nombre,
          // emisor_direccion: values.emisor_direccion,
          tipo_producto: values.tipo_producto,
          contenedor_siglas: values.contenedor_siglas,
          cant_bultos: Number(values.cant_bultos),
          peso_total: Number(values.peso_total),
          vol_bulto: Number(values.vol_bulto),
          autorizado_recoger: values.autorizado_recoger,
          tipo_carga: values.tipo_carga,
          origen_string: values.origen_string,
          destino_string: values.destino_string,
          origen_direccion: values.origen_direccion,
          destino_direccion: values.destino_direccion,
          nombre_destinatario: values.nombre_destinatario,
          via: values.via,
          transportista_id: values.transportista_id || undefined,
          transportista_nombre:
            transportistasDisponibles.value.find(
              (t) => String(t.id) === String(values.transportista_id),
            )?.nombre || undefined,
          nombre_buque: values.nombre_buque,
          mfto_no: values.mfto_no,
          bl_no: values.bl_no,
          dm_no: values.dm_no,
          vehiculo_pertenece_a: values.vehiculo_pertenece_a,
          conducido_por: values.conducido_por,
          chapa_no: values.chapa_no,
          lot_no: values.lot_no,
          hoja_ruta_no: values.hoja_ruta_no,
          carta_porte_no: values.carta_porte_no,
          chapa_tractivo_no: values.chapa_tractivo_no,
          remolque_no: values.remolque_no,
          conductor_carnet_no: values.conductor_carnet_no,
          licencia_conduccion_no: values.licencia_conduccion_no,
          basificado_en: values.basificado_en,
          tarifabase: Number(tarifaBase.value),
          volumen: Number(volumenTotal.value),
          impuesto: Number(impuestoAeroportuario.value),
          comision: Number(comisionServicio.value),
          precio: Number(precioTotal.value),
          clientId: selectedClientId.value || undefined,
        };

        // Llamada real al backend (ajusta endpoint si es necesario)
        const res = await CargaApi.createOrdenTerrestre(ordenCompleta);

        await Swal.fire({
          title: "Éxito",
          text: "Orden registrada correctamente",
          icon: "success",
          confirmButtonText: "Aceptar",
        });

        // resetear el form a los initialValues (fecha_emision volverá a la fecha de hoy)
        resetForm({ values: initialValues });
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

    // en setup()
    const doDebugValidate = async () => {
      try {
        // validate() viene del slot en el template; aquí lo llamamos vía $refs como alternativa
        // Pero vamos a validar manualmente con el schema:
        console.log(
          "DEBUG: valores actuales (antes validación):",
          JSON.parse(JSON.stringify(initialValues)),
        ); // si quieres
        // si tienes accesso a values del slot, la función consoleLogValues lo imprimirá
        await schema.validate(initialValues, { abortEarly: false });
        console.log("DEBUG: schema.validate pasó OK con initialValues");
      } catch (e: any) {
        console.error(
          "DEBUG: Errores de validación (schema.validate):",
          e.inner || e,
        );
      }
    };

    const consoleLogValues = () => {
      // intenta leer los valores a través del DOM (temporal) o imprime initialValues
      console.log("DEBUG: initialValues (de referencia):", initialValues);
      // si quieres valores reales del slot, usa el botón Ver valores en plantilla
    };

    const safeCalcularTotales = (ev) => {
      try {
        calcularTotales(ev);
      } catch (e) {
        console.error("ERROR en calcularTotales:", e);
      }
    };

    const onSubmitNoValidate = async () => {
      console.log("SUBMIT NO VALIDATE fired!");
      // Aquí puedes llamar a la lógica de envío que tenías (pero ojo: estás saltando la validación)
    };

    const onInvalid = (errors) => {
      console.warn("onInvalid called - errores de validación:", errors);
      // Si quieres, mostrar en consola también el schema.validate para más detalle:
      // schema.validate(valuesFromSlot, { abortEarly: false }).catch(e => console.error(e.inner));
    };

    return {
      doDebugValidate,
      onInvalid,
      onSubmitNoValidate,
      safeCalcularTotales,
      consoleLogValues,
      schema,
      calcularTotales,
      handleSubmit,
      todayForDateInput,
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
      transportistasDisponibles,
      selectedClientId,
      isAdmin,
      clientDisplayName,
      resetCalculos,
      isMaritima,
      isTerrestre,
      initialValues, //
    };
  },
});
</script>

<style scoped>
/* ajustes visuales */
.card-title {
  font-size: 1.05rem;
}
</style>
