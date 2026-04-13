<!-- AddUserModal.vue (modificado) -->
<template>
  <div
    class="modal fade"
    id="kt_modal_add_usuario"
    ref="addUsuarioModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-850px">
      <div class="modal-content">
        <div class="modal-header" id="kt_modal_add_usuario_header">
          <h2 class="fw-bold">Añadir un Usuario</h2>
          <div
            id="kt_modal_add_usuario_close"
            data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
          >
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </div>
        </div>

        <form @submit.prevent="onSubmit" class="modal-body py-6 px-lg-8">
          <!-- Basic fields (sin cambios) -->
          <div class="fv-row mb-4">
            <label class="fs-6 fw-semibold mb-2 required">Name</label>
            <el-input v-model="formData.name" placeholder="Ingrese nombre" />
            <div class="text-danger fs-7 mt-1" v-if="errors.name">
              {{ errors.name }}
            </div>
          </div>

          <div class="fv-row mb-4">
            <label class="fs-6 fw-semibold mb-2 required">Last Name</label>
            <el-input
              v-model="formData.lastname"
              placeholder="Ingrese apellido"
            />
            <div class="text-danger fs-7 mt-1" v-if="errors.lastname">
              {{ errors.lastname }}
            </div>
          </div>

          <div class="fv-row mb-4">
            <label class="fs-6 fw-semibold mb-2 required">Phone</label>
            <el-input v-model="formData.phone" placeholder="Ingrese teléfono" />
            <div class="text-danger fs-7 mt-1" v-if="errors.phone">
              {{ errors.phone }}
            </div>
          </div>

          <div class="fv-row mb-4">
            <label class="fs-6 fw-semibold mb-2 required">Username</label>
            <el-input
              v-model="formData.username"
              placeholder="Ingrese usuario"
            />
            <div class="text-danger fs-7 mt-1" v-if="errors.username">
              {{ errors.username }}
            </div>
          </div>

          <div class="fv-row mb-4">
            <label class="fs-6 fw-semibold mb-2 required">Email</label>
            <el-input
              v-model="formData.email"
              type="email"
              placeholder="Ingrese email"
            />
            <div class="text-danger fs-7 mt-1" v-if="errors.email">
              {{ errors.email }}
            </div>
          </div>

          <div class="fv-row mb-4">
            <label class="fs-6 fw-semibold mb-2 required">Password</label>
            <el-input
              v-model="formData.password"
              type="password"
              placeholder="Ingrese contraseña"
            />
            <div class="text-danger fs-7 mt-1" v-if="errors.password">
              {{ errors.password }}
            </div>
          </div>

          <!-- Role select -->
          <div class="fv-row mb-4">
            <label class="fs-6 fw-semibold mb-2 required">Role</label>
            <el-select v-model="formData.role" placeholder="Seleccione un rol">
              <el-option
                v-for="r in roles"
                :key="r.id"
                :label="r.name"
                :value="r.id"
              />
            </el-select>
            <div class="text-danger fs-7 mt-1" v-if="errors.role">
              {{ errors.role }}
            </div>
          </div>

          <!-- --- Campos extra sólo si es Cliente --- -->
          <div v-if="isCliente" class="border rounded p-3 mb-4">
            <h5 class="mb-3">
              Datos para rol <span class="fw-bold">Cliente</span>
            </h5>

            <div class="mb-3">
              <label class="fs-6 fw-semibold mb-2"
                >Empresa / Razón social</label
              >
              <el-input
                v-model="formData.company"
                placeholder="Empresa (opcional)"
              />
              <div class="text-danger fs-7 mt-1" v-if="errors.company">
                {{ errors.company }}
              </div>
            </div>

            <div class="row g-2">
              <div class="col-6 mb-3">
                <label class="fs-6 fw-semibold mb-2">Contacto</label>
                <el-input
                  v-model="formData.contact_name"
                  placeholder="Nombre de contacto"
                />
                <div class="text-danger fs-7 mt-1" v-if="errors.contact_name">
                  {{ errors.contact_name }}
                </div>
              </div>
              <div class="col-6 mb-3">
                <label class="fs-6 fw-semibold mb-2">Teléfono contacto</label>
                <el-input
                  v-model="formData.contact_phone"
                  placeholder="+56..."
                />
                <div class="text-danger fs-7 mt-1" v-if="errors.contact_phone">
                  {{ errors.contact_phone }}
                </div>
              </div>
            </div>

            <div class="mb-3">
              <label class="fs-6 fw-semibold mb-2">Documento (RUT / DNI)</label>
              <el-input
                v-model="formData.tax_id"
                placeholder="RUC / DNI (opcional)"
              />
              <div class="text-danger fs-7 mt-1" v-if="errors.tax_id">
                {{ errors.tax_id }}
              </div>
            </div>

            <div class="mb-3">
              <label class="fs-6 fw-semibold mb-2">Dirección</label>
              <el-input
                v-model="formData.address"
                placeholder="Dirección (opcional)"
              />
              <div class="text-danger fs-7 mt-1" v-if="errors.address">
                {{ errors.address }}
              </div>
            </div>

            <!-- === NUEVO: Modalidad === -->
            <div class="mb-3">
              <label class="fs-6 fw-semibold mb-2">Modalidad</label>
              <el-select
                v-model="formData.modalidad"
                placeholder="Seleccione modalidad (opcional)"
                clearable
              >
                <el-option label="Aérea" value="aerea" />
                <el-option label="Marítima" value="maritima" />
                <el-option label="Terrestre" value="terrestre" />
                <el-option label="Ferroviaria" value="ferroviaria" />
                <el-option label="Multimodal" value="multimodal" />
              </el-select>
              <div class="text-danger fs-7 mt-1" v-if="errors.modalidad">
                {{ errors.modalidad }}
              </div>
            </div>
            <!-- === fin Modalidad === -->
          </div>
          <!-- --- fin cliente --- -->

          <!-- --- Campos extra sólo si es Prestatario --- -->
          <div v-if="isPrestatario" class="border rounded p-3 mb-4">
            <h5 class="mb-3">
              Datos para rol <span class="fw-bold">Prestatario</span>
            </h5>

            <!-- Servicios (nuevo) -->
            <div class="mb-3">
              <label class="fs-6 fw-semibold mb-2">Servicios (Vías)</label>
              <el-select
                v-model="formData.servicios"
                placeholder="Seleccione las vías que presta"
                multiple
                collapse-tags
              >
                <el-option
                  v-for="opt in viaOptions"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </el-select>
              <div class="text-muted fs-7 mt-1">
                Seleccione una o varias. Ej: Aérea, Terrestre...
              </div>
              <div class="text-danger fs-7 mt-1" v-if="errors.servicios">
                {{ errors.servicios }}
              </div>
            </div>
            <br />
            <!-- Transportes (repeatable) -->
            <div class="border rounded mb-3 p-3">
              <label class="fs-6 fw-semibold mb-2"
                >Transportes registrados</label
              >
              <div
                v-if="formData.transportes.length === 0"
                class="text-muted mb-2"
              >
                - sin transportes -
              </div>

              <div
                v-for="(t, idx) in formData.transportes"
                :key="'t-' + idx"
                class="border rounded p-2 mb-2 position-relative"
              >
                <div class="row g-2">
                  <div class="col-4">
                    <el-input
                      v-model="t.nombreChofer"
                      placeholder="Nombre chófer"
                    />
                    <div
                      class="text-danger fs-7"
                      v-if="errors[`transportes[${idx}].nombreChofer`]"
                    >
                      {{ errors[`transportes[${idx}].nombreChofer`] }}
                    </div>
                  </div>
                  <div class="col-3">
                    <el-input v-model="t.chapa" placeholder="Chapa" />
                    <div
                      class="text-danger fs-7"
                      v-if="errors[`transportes[${idx}].chapa`]"
                    >
                      {{ errors[`transportes[${idx}].chapa`] }}
                    </div>
                  </div>
                  <div class="col-4">
                    <el-select
                      v-model="t.tipoTransporte"
                      placeholder="Tipo transporte"
                    >
                      <el-option label="Camión" value="Camión" />
                      <el-option label="Camioneta" value="Camioneta" />
                      <el-option label="Tráiler" value="Tráiler" />
                      <el-option label="Otro" value="Otro" />
                    </el-select>
                    <div
                      class="text-danger fs-7"
                      v-if="errors[`transportes[${idx}].tipoTransporte`]"
                    >
                      {{ errors[`transportes[${idx}].tipoTransporte`] }}
                    </div>
                  </div>
                  <div class="col-1 d-flex align-items-start">
                    <button
                      type="button"
                      class="btn btn-sm btn-link text-danger"
                      @click="removeTransport(idx)"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                class="btn btn-sm btn-outline-success"
                @click="addTransport"
              >
                + Añadir transporte
              </button>
              <div class="text-danger fs-7 mt-1" v-if="errors.transportes">
                {{ errors.transportes }}
              </div>
            </div>
            <br />
            <!-- Tipo de carga (enum) -->
            <div class="mb-3">
              <label class="fs-6 fw-semibold mb-2">Tipo de carga</label>
              <el-select
                v-model="formData.tipoCarga"
                placeholder="Seleccione tipo de carga"
              >
                <el-option
                  v-for="opt in cargaOptions"
                  :key="opt"
                  :label="opt"
                  :value="opt"
                />
              </el-select>
              <div class="text-danger fs-7 mt-1" v-if="errors.tipoCarga">
                {{ errors.tipoCarga }}
              </div>
            </div>

            <!-- Contenedor (enum 20/40) -->
            <div class="mb-3">
              <label class="fs-6 fw-semibold mb-2">Contenedor</label>
              <el-select
                v-model="formData.contenedor"
                placeholder="Seleccione contenedor"
              >
                <el-option label="20" value="20" />
                <el-option label="40" value="40" />
              </el-select>
              <div class="text-danger fs-7 mt-1" v-if="errors.contenedor">
                {{ errors.contenedor }}
              </div>
            </div>

            <!-- MAX WEIGHT / MAX VOLUME -->
            <div class="mb-3">
              <label class="fs-6 fw-semibold mb-2">Capacidad máxima</label>
              <div class="row g-2">
                <div class="col-6">
                  <el-input
                    v-model.number="formData.maxWeight"
                    type="number"
                    placeholder="Peso máximo (kg)"
                    min="0"
                  />
                  <div class="text-muted fs-7">Unidad: kilogramos (kg)</div>
                  <div class="text-danger fs-7 mt-1" v-if="errors.maxWeight">
                    {{ errors.maxWeight }}
                  </div>
                </div>
                <div class="col-6">
                  <el-input
                    v-model.number="formData.maxVolume"
                    type="number"
                    placeholder="Volumen máximo (m³)"
                    min="0"
                  />
                  <div class="text-muted fs-7">Unidad: metros cúbicos (m³)</div>
                  <div class="text-danger fs-7 mt-1" v-if="errors.maxVolume">
                    {{ errors.maxVolume }}
                  </div>
                </div>
              </div>
            </div>

            <!-- NUEVO: checkbox y campos de Alquiler -->
            <div class="mt-3 form-check">
              <el-checkbox v-model="formData.providesAlquiler">
                Prestas servicios de Alquiler de almacenes
              </el-checkbox>
            </div>

            <div
              v-if="formData.providesAlquiler"
              class="mt-3 border rounded p-3"
            >
              <h6 class="mb-2">Alquiler de almacenes</h6>

              <div class="row g-2">
                <div class="col-md-6">
                  <label class="fs-6 fw-semibold mb-2"
                    >Metros disponibles (m²)</label
                  >
                  <el-input
                    v-model.number="formData.metros_disponibles_alquiler"
                    type="number"
                    placeholder="Metros disponibles"
                  />
                  <div
                    class="text-danger fs-7 mt-1"
                    v-if="errors.metros_disponibles_alquiler"
                  >
                    {{ errors.metros_disponibles_alquiler }}
                  </div>
                </div>

                <div class="col-md-6">
                  <label class="fs-6 fw-semibold mb-2">Altura máxima (m)</label>
                  <el-input
                    v-model.number="formData.altura_m_alquiler"
                    type="number"
                    placeholder="Altura máxima"
                  />
                  <div
                    class="text-danger fs-7 mt-1"
                    v-if="errors.altura_m_alquiler"
                  >
                    {{ errors.altura_m_alquiler }}
                  </div>
                </div>
              </div>

              <div class="mt-3">
                <label class="fs-6 fw-semibold mb-2"
                  >Servicios de alquiler</label
                >
                <el-select
                  v-model="formData.servicios_prest_alquiler"
                  multiple
                  collapse-tags
                  placeholder="Seleccione servicios de alquiler"
                >
                  <el-option
                    v-for="opt in alquilerOptions"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                  />
                </el-select>
                <div class="text-muted fs-7 mt-1">
                  Seleccione los servicios que ofrece para alquiler (opcional).
                </div>
                <div
                  class="text-danger fs-7 mt-1"
                  v-if="errors.servicios_prest_alquiler"
                >
                  {{ errors.servicios_prest_alquiler }}
                </div>
              </div>
            </div>
            <!-- FIN campos de Alquiler -->

            <br />
            <!-- Cargas especiales -->
            <div class="mb-3">
              <label class="fs-6 fw-semibold mb-2">Cargas especiales</label>
              <div
                v-for="(c, i) in formData.cargasEspeciales"
                :key="'ce-' + i"
                class="input-group mb-2"
              >
                <el-input v-model="formData.cargasEspeciales[i]" />
                <button
                  type="button"
                  class="btn btn-outline-danger"
                  @click="removeCargaEspecial(i)"
                >
                  Eliminar
                </button>
              </div>
              <div class="d-flex gap-2 mb-2">
                <el-input
                  v-model="newCargaEspecial"
                  placeholder="Nueva carga especial"
                />
                <button
                  type="button"
                  class="btn btn-outline-success"
                  @click="addCargaEspecial"
                >
                  Agregar
                </button>
              </div>
              <div class="text-danger fs-7" v-if="errors.cargasEspeciales">
                {{ errors.cargasEspeciales }}
              </div>
            </div>

            <!-- Rating -->
            <div class="mb-3">
              <label class="fs-6 fw-semibold mb-2">Rating de compañía</label>
              <el-input
                v-model.number="formData.rating"
                type="number"
                placeholder="0 - 5"
              />
              <div class="text-danger fs-7 mt-1" v-if="errors.rating">
                {{ errors.rating }}
              </div>
            </div>

            <!-- Licencia -->
            <div class="mb-3">
              <label class="fs-6 fw-semibold mb-2"
                >Licencia de conducción</label
              >
              <div class="row g-2">
                <div class="col-4">
                  <el-input
                    v-model="formData.licencia.numero"
                    placeholder="Número"
                  />
                </div>
                <div class="col-4">
                  <el-input
                    v-model="formData.licencia.categoria"
                    placeholder="Categoría"
                  />
                </div>
                <div class="col-4">
                  <input
                    v-model="formData.licencia.vence"
                    type="date"
                    class="form-control"
                  />
                </div>
              </div>
              <div
                class="text-danger fs-7 mt-1"
                v-if="errors['licencia.numero']"
              >
                {{ errors["licencia.numero"] }}
              </div>
              <div
                class="text-danger fs-7 mt-1"
                v-if="errors['licencia.categoria']"
              >
                {{ errors["licencia.categoria"] }}
              </div>
            </div>

            <br />

            <!-- Ayudantes (repeatable) -->
            <div class="border rounded mb-3 p-3">
              <label class="fs-6 fw-semibold mb-2">Ayudantes</label>

              <div
                v-for="(h, i) in formData.ayudantes"
                :key="'h-' + i"
                class="input-group mb-2"
              >
                <el-input v-model="h.nombre" placeholder="Nombre" />
                <el-input v-model="h.apellidos" placeholder="Apellidos" />
                <el-input v-model="h.ci" placeholder="CI" />
                <button
                  type="button"
                  class="btn btn-outline-danger"
                  @click="removeAyudante(i)"
                >
                  Eliminar
                </button>
              </div>

              <button
                type="button"
                class="btn btn-sm btn-outline-success"
                @click="addAyudante"
              >
                + Añadir ayudante
              </button>
              <div class="text-danger fs-7 mt-1" v-if="errors.ayudantes">
                {{ errors.ayudantes }}
              </div>
            </div>
            <br />
          </div>

          <!-- --- fin prestatario --- -->

          <!-- Footer (sin cambios) -->
          <div class="modal-footer flex-center">
            <button
              type="button"
              id="kt_modal_add_usuario_cancel"
              class="btn btn-light me-3"
              @click="resetForm()"
            >
              Cancelar
            </button>
            <button
              :data-kt-indicator="loading ? 'on' : null"
              class="btn btn-lg btn-primary"
              type="submit"
            >
              <span v-if="!loading" class="indicator-label">
                Crear usuario
                <KTIcon icon-name="arrow-right" icon-class="fs-2 me-2 me-0" />
              </span>
              <span v-else class="indicator-progress">
                Please wait...
                <span
                  class="spinner-border spinner-border-sm align-middle ms-2"
                ></span>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, computed } from "vue";
import { toRaw } from "vue";
import * as yup from "yup";
import type { ValidationError } from "yup";
import Swal from "sweetalert2";
import api from "@/services/api";
import { hideModal } from "@/core/helpers/modal";

type Transporte = {
  nombreChofer: string;
  chapa: string;
  tipoTransporte: string;
};
type Ayudante = { nombre: string; apellidos: string; ci: string };

type FormValues = {
  name: string;
  lastname: string;
  phone: string;
  username: string;
  email: string;
  password: string;
  role: string;
  // prestatario fields
  transportes: Transporte[];
  tipoCarga: string;
  contenedor: string;
  maxWeight?: number | null;
  maxVolume?: number | null;
  cargasEspeciales: string[];
  rating: number | null;
  licencia: { numero: string; categoria: string; vence: string };
  ayudantes: Ayudante[];
  servicios: string[]; // <-- nuevo
  // alquiler fields (nuevos)
  providesAlquiler?: boolean;
  metros_disponibles_alquiler?: number | null;
  altura_m_alquiler?: number | null;
  servicios_prest_alquiler: string[];
  // cliente fields
  company?: string;
  contact_name?: string;
  contact_phone?: string;
  tax_id?: string;
  address?: string;
  modalidad?: string;
};

export default defineComponent({
  name: "add-customer-modal",
  setup(_, { emit }) {
    const addUsuarioModalRef = ref<HTMLElement | null>(null);
    const loading = ref(false);
    const roles = ref<any[]>([]);

    const cargaOptions = ["Seco", "Refrigerado", "Carga general"];

    // Via options (asegúrate que coincidan con tu backend ViaMode)
    const viaOptions = [
      { value: "maritima", label: "Marítima" },
      { value: "aerea", label: "Aérea" },
      { value: "terrestre", label: "Terrestre" },
      { value: "ferroviaria", label: "Ferroviaria" },
      { value: "multimodal", label: "Multimodal" },
    ];

    // Opciones de servicios de alquiler (copiado de SignUp)
    const alquilerOptions = [
      { value: "pick_and_pack", label: "Pick and Pack" },
      { value: "etiquetado", label: "Etiquetado" },
      { value: "inspeccion", label: "Inspección" },
      { value: "control_de_calidad", label: "Control de calidad" },
      { value: "preparacion_de_pedidos", label: "Preparación de pedidos" },
      { value: "transporte", label: "Transporte" },
    ];

    const formData = reactive<FormValues>({
      name: "",
      lastname: "",
      phone: "",
      username: "",
      email: "",
      password: "",
      role: "",
      transportes: [],
      tipoCarga: "",
      contenedor: "",
      maxWeight: null,
      maxVolume: null,
      cargasEspeciales: [],
      rating: null,
      licencia: { numero: "", categoria: "", vence: "" },
      ayudantes: [],
      servicios: [], // inicial
      // alquiler defaults
      providesAlquiler: false,
      metros_disponibles_alquiler: null,
      altura_m_alquiler: null,
      servicios_prest_alquiler: [],
      // cliente fields
      company: "",
      contact_name: "",
      contact_phone: "",
      tax_id: "",
      address: "",
      modalidad: "",
    });

    const newCargaEspecial = ref("");
    const errors = reactive<Record<string, string>>({});

    const baseSchema = yup.object({
      name: yup.string().required("El nombre es obligatorio"),
      lastname: yup.string().required("El apellido es obligatorio"),
      phone: yup
        .string()
        .required("El teléfono es obligatorio")
        .matches(
          /^\+\d{7,15}$/,
          "Formato inválido, debe incluir + y código de país",
        ),
      username: yup.string().required("El usuario es obligatorio"),
      email: yup
        .string()
        .email("Email inválido")
        .required("El email es obligatorio"),
      password: yup
        .string()
        .required("La contraseña es obligatoria")
        .min(8, "Mínimo 8 caracteres")
        .matches(/[A-Z]/, "Debe incluir una mayúscula")
        .matches(/[a-z]/, "Debe incluir una minúscula")
        .matches(/\d/, "Debe incluir un número")
        .matches(/[\W_]/, "Debe incluir un símbolo"),
      role: yup.string().required("El rol es obligatorio"),
    });

    const prestatarioSchema = yup.object({
      transportes: yup.array().of(
        yup.object({
          nombreChofer: yup.string().required("Nombre del chófer obligatorio"),
          chapa: yup.string().required("Chapa obligatoria"),
          tipoTransporte: yup
            .string()
            .required("Tipo de transporte obligatorio"),
        }),
      ),
      tipoCarga: yup.string().required("Tipo de carga es obligatorio"),
      contenedor: yup
        .string()
        .oneOf(["20", "40"], "Contenedor inválido")
        .required("Contenedor es obligatorio"),
      maxWeight: yup.number().nullable().min(0, "Max weight debe ser >= 0"),
      maxVolume: yup.number().nullable().min(0, "Max volume debe ser >= 0"),
      cargasEspeciales: yup.array().of(yup.string()).nullable(),
      rating: yup.number().nullable().min(0).max(5),
      licencia: yup.object({
        numero: yup.string().required(),
        categoria: yup.string().required(),
        vence: yup.string().required(),
      }),
      ayudantes: yup.array().of(
        yup.object({
          nombre: yup.string().required(),
          apellidos: yup.string().required(),
          ci: yup.string().required(),
        }),
      ),
      servicios: yup.array().min(1, "Seleccione al menos un servicio"),
      // alquiler validations (condicionales)
      providesAlquiler: yup.boolean(),
      metros_disponibles_alquiler: yup
        .number()
        .nullable()
        .when("providesAlquiler", {
          is: true,
          then: (schema) =>
            schema
              .required("Indica metros disponibles")
              .min(0.1, "Debe ser mayor que 0"),
          otherwise: (schema) => schema.nullable(),
        }),
      altura_m_alquiler: yup
        .number()
        .nullable()
        .when("providesAlquiler", {
          is: true,
          then: (schema) =>
            schema.required("Indica altura mínima").min(0, "Altura >= 0"),
          otherwise: (schema) => schema.nullable(),
        }),
      servicios_prest_alquiler: yup
        .array()
        .of(yup.string())
        .when("providesAlquiler", {
          is: true,
          then: (schema) =>
            schema.min(1, "Seleccione al menos un servicio de alquiler"),
          otherwise: (schema) => schema.nullable(),
        }),
    });

    const clienteSchema = yup.object({
      company: yup.string().optional(),
      contact_name: yup.string().optional(),
      contact_phone: yup
        .string()
        .optional()
        .matches(/^\+\d{7,15}$/, "Formato inválido")
        .nullable(),
      tax_id: yup.string().optional(),
      address: yup.string().optional(),
      modalidad: yup.string().optional(),
    });

    const fetchRoles = async () => {
      try {
        const res = await api.get("/roles");
        roles.value = res.data;
      } catch (e) {
        console.error("Error al cargar roles:", e);
      }
    };
    onMounted(fetchRoles);

    const isPrestatario = computed(() => {
      if (!formData.role) return false;
      const roleObj = roles.value.find(
        (r: any) => r.id === formData.role || r.id === String(formData.role),
      );
      if (roleObj && roleObj.name) {
        return String(roleObj.name).toLowerCase() === "prestatario";
      }
      return String(formData.role).toLowerCase() === "prestatario";
    });

    const isCliente = computed(() => {
      if (!formData.role) return false;
      const roleObj = roles.value.find(
        (r: any) => r.id === formData.role || r.id === String(formData.role),
      );
      if (roleObj && roleObj.name) {
        return String(roleObj.name).toLowerCase() === "cliente";
      }
      return String(formData.role).toLowerCase() === "cliente";
    });

    function resetForm() {
      Object.assign(formData, {
        name: "",
        lastname: "",
        phone: "",
        username: "",
        email: "",
        password: "",
        role: "",
        transportes: [],
        tipoCarga: "",
        contenedor: "",
        maxWeight: null,
        maxVolume: null,
        cargasEspeciales: [],
        rating: null,
        licencia: { numero: "", categoria: "", vence: "" },
        ayudantes: [],
        servicios: [],
        // alquiler defaults
        providesAlquiler: false,
        metros_disponibles_alquiler: null,
        altura_m_alquiler: null,
        servicios_prest_alquiler: [],
        company: "",
        contact_name: "",
        contact_phone: "",
        tax_id: "",
        address: "",
        modalidad: "",
      });
      newCargaEspecial.value = "";
      Object.keys(errors).forEach((k) => delete errors[k]);
    }

    function addTransport() {
      formData.transportes.push({
        nombreChofer: "",
        chapa: "",
        tipoTransporte: "",
      });
    }
    function removeTransport(i: number) {
      formData.transportes.splice(i, 1);
    }
    function addAyudante() {
      formData.ayudantes.push({ nombre: "", apellidos: "", ci: "" });
    }
    function removeAyudante(i: number) {
      formData.ayudantes.splice(i, 1);
    }
    function addCargaEspecial() {
      const v = newCargaEspecial.value && newCargaEspecial.value.trim();
      if (!v) return;
      formData.cargasEspeciales.push(v);
      newCargaEspecial.value = "";
    }
    function removeCargaEspecial(i: number) {
      formData.cargasEspeciales.splice(i, 1);
    }

    function mapYupErrors(err: ValidationError) {
      if (err.inner && err.inner.length) {
        err.inner.forEach((e) => {
          if (e.path) errors[e.path] = e.message;
        });
      } else if (err.path) {
        errors[err.path] = err.message;
      }
    }

    async function onSubmit() {
      Object.keys(errors).forEach((k) => delete errors[k]);

      try {
        await baseSchema.validate(formData, { abortEarly: false });
      } catch (err) {
        mapYupErrors(err as ValidationError);
        return;
      }

      if (isPrestatario.value) {
        try {
          await prestatarioSchema.validate(formData as any, {
            abortEarly: false,
          });
        } catch (err) {
          mapYupErrors(err as ValidationError);
          return;
        }
      }

      if (isCliente.value) {
        try {
          await clienteSchema.validate(formData as any, { abortEarly: false });
        } catch (err) {
          mapYupErrors(err as ValidationError);
          return;
        }
      }

      Swal.fire({
        title: "Creando usuario...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        showConfirmButton: false,
        heightAuto: false,
      });
      loading.value = true;
      try {
        const payload: any = {
          name: formData.name,
          lastname: formData.lastname,
          phone: formData.phone,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        };

        if (isPrestatario.value) {
          payload.transportes = formData.transportes;
          payload.tipoCarga = formData.tipoCarga;
          payload.contenedor = formData.contenedor;
          payload.maxWeight = formData.maxWeight;
          payload.max_volume = formData.maxVolume;
          payload.maxVolume = formData.maxVolume;
          payload.cargasEspeciales = formData.cargasEspeciales;
          payload.rating = formData.rating;
          payload.licencia = formData.licencia;
          payload.ayudantes = formData.ayudantes;
          payload.servicios = formData.servicios;

          // campos nuevos de alquiler: solo añadimos si providesAlquiler === true
          payload.providesAlquiler = !!formData.providesAlquiler;
          if (formData.providesAlquiler) {
            payload.metros_disponibles_alquiler =
              formData.metros_disponibles_alquiler ?? null;
            payload.altura_m_alquiler = formData.altura_m_alquiler ?? null;
            payload.servicios_prest_alquiler = Array.isArray(
              formData.servicios_prest_alquiler,
            )
              ? formData.servicios_prest_alquiler
              : formData.servicios_prest_alquiler
                ? [formData.servicios_prest_alquiler]
                : [];
          } else {
            payload.metros_disponibles_alquiler = null;
            payload.altura_m_alquiler = null;
            payload.servicios_prest_alquiler = [];
          }
        }
 
        if (isCliente.value) {
          const clientObj = {
            company: formData.company,
            contact_name: formData.contact_name,
            contact_phone: formData.contact_phone,
            tax_id: formData.tax_id,
            address: formData.address,
            modalidad: formData.modalidad,
          };
          payload.client = clientObj;
          payload.company = formData.company;
          payload.contact_name = formData.contact_name;
          payload.contact_phone = formData.contact_phone;
          payload.tax_id = formData.tax_id;
          payload.address = formData.address;
          payload.modalidad = formData.modalidad;
        }

        await api.post("/users/adduser", payload);

        await Swal.fire({
          text: "Usuario creado con éxito",
          icon: "success",
          confirmButtonText: "Ok, genial",
          customClass: { confirmButton: "btn btn-primary" },
        });

        hideModal(addUsuarioModalRef.value);
        resetForm();
        emit("created");
      } catch (e) {
        console.error("Error creating user", e);
        await Swal.fire({
          text: "Error al crear el usuario",
          icon: "error",
          confirmButtonText: "Entendido",
          customClass: { confirmButton: "btn btn-primary" },
        });
      } finally {
        loading.value = false;
      }
    }

    return {
      addUsuarioModalRef,
      loading,
      roles,
      formData,
      errors,
      onSubmit,
      resetForm,
      isPrestatario,
      isCliente,
      // prestatario helpers
      addTransport,
      removeTransport,
      addAyudante,
      removeAyudante,
      addCargaEspecial,
      removeCargaEspecial,
      newCargaEspecial,
      cargaOptions,
      viaOptions, // exportado para template
      // alquiler
      alquilerOptions,
    };
  },
});
</script>
