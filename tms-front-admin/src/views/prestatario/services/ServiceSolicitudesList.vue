<template>
  <div class="card" ref="rootEl" data-component="service-solicitudes-list">
    <div class="card-header d-flex align-items-center justify-content-between">
      <div class="d-flex align-items-center position-relative my-1">
        <KTIcon
          icon-name="magnifier"
          icon-class="fs-1 position-absolute ms-6"
        />
        <input
          type="text"
          v-model="search"
          @input="searchItems"
          class="form-control form-control-solid w-250px ps-15"
          :placeholder="`Buscar ${serviceTitle} solicitudes`"
        />
      </div>

      <div class="d-flex gap-2">
        <button
          v-if="canCreate"
          class="btn btn-primary btn-sm"
          @click="openCreateSolicitudModal"
        >
          Crear solicitud
        </button>
      </div>
    </div>

    <div class="card-body">
      <KTDatatable
        :header="tableHeaderComputed"
        :data="solicitudes"
        @on-sort="sort"
        row-key="id"
        :row-class-name="getRowClass"
        :checkbox-enabled="true"
        v-model:selectedItems="selectedIds"
        @update:selectedItems="onItemSelect"
        @on-select="onItemSelect"
        class="h-10"
      >
        <!-- slots: cubren la mayoría de campos comunes + los específicos (alojamiento) -->
        <template v-slot:solicitante="{ row }">{{
          castRow(row).solicitante
        }}</template>
        <template v-slot:telefono="{ row }">{{
          castRow(row).telefono
        }}</template>
        <template v-slot:email="{ row }">{{ castRow(row).email }}</template>
        <template v-slot:empresa="{ row }">{{
          castRow(row).empresa || "-"
        }}</template>

        <template v-slot:metros_requeridos="{ row }"
          >{{ castRow(row).metros_requeridos }} m²</template
        >
        <template v-slot:tipo_uso="{ row }">{{
          castRow(row).tipo_uso
        }}</template>
        <template v-slot:altura_m="{ row }"
          >{{ castRow(row).altura_m ?? "-" }} m</template
        >
        <template v-slot:fecha_inicio="{ row }">{{
          castRow(row).fecha_inicio
        }}</template>
        <template v-slot:fecha_fin="{ row }">{{
          castRow(row).fecha_fin ?? "-"
        }}</template>
        <template v-slot:duracion="{ row }">{{
          castRow(row).duracion
        }}</template>
        <template v-slot:acceso_horario="{ row }">{{
          castRow(row).acceso_horario
        }}</template>
        <template v-slot:control_temperatura="{ row }">{{
          castRow(row).control_temperatura || "-"
        }}</template>

        <template v-slot:servicios="{ row }">
          {{
            Array.isArray(castRow(row).servicios)
              ? castRow(row).servicios.length
                ? castRow(row).servicios.join(", ")
                : "-"
              : (castRow(row).servicios ?? "-")
          }}
        </template>

        <template v-slot:personas="{ row }">{{
          castRow(row).personas ?? "-"
        }}</template>

        <template v-slot:vehiculo_marca="{ row }">{{
          castRow(row).vehiculo_marca ?? "-"
        }}</template>
        <template v-slot:vehiculo_placa="{ row }">{{
          castRow(row).vehiculo_placa ?? "-"
        }}</template>

        <template v-slot:device_count="{ row }">{{
          castRow(row).device_count ?? "-"
        }}</template>
        <template v-slot:plan="{ row }">{{
          castRow(row).plan ?? "-"
        }}</template>

        <template v-slot:frecuencia="{ row }">{{
          castRow(row).frecuencia || "-"
        }}</template>
        <template v-slot:clasificacion_mercancia="{ row }">{{
          castRow(row).clasificacion_mercancia || "-"
        }}</template>

        <!-- Alojamiento específicos -->
        <template v-slot:habitaciones_requeridas="{ row }">{{
          castRow(row).habitaciones_requeridas ?? "-"
        }}</template>

        <template v-slot:comentarios="{ row }">
          <small class="text-muted">
            {{
              (castRow(row).comentarios || "").slice(0, 80) +
                ((castRow(row).comentarios || "").length > 80 ? "…" : "") || "-"
            }}
          </small>
        </template>

        <template v-slot:status="{ row }">
          <span :class="getStatusBadgeClass(castRow(row).status)">{{
            castRow(row).status || "pending"
          }}</span>
        </template>

        <template v-slot:created_at="{ row }">{{
          castRow(row).created_at
        }}</template>

        <!-- Acciones -->
        <template v-slot:actions="{ row: data }">
          <div>
            <button
              class="btn btn-sm btn-light btn-active-light-primary"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Acciones
              <KTIcon icon-name="down" icon-class="fs-5 m-0" />
            </button>

            <ul class="dropdown-menu">
              <li>
                <a
                  class="dropdown-item cursor-pointer"
                  @click="openEditSolicitudModal(data)"
                >
                  <KTIcon icon-name="pencil" icon-class="fs-4 me-2" /> Editar
                </a>
              </li>

              <li>
                <a
                  class="dropdown-item cursor-pointer"
                  @click="deleteSolicitud(castRow(data).id)"
                >
                  <KTIcon
                    icon-name="trash"
                    icon-class="fs-4 me-2 text-danger"
                  />
                  Eliminar
                </a>
              </li>

              <li>
                <a
                  class="dropdown-item cursor-pointer"
                  @click="openPrestatariosModal(data)"
                >
                  <KTIcon icon-name="truck" icon-class="fs-4 me-2" /> Ver
                  prestatarios compatibles
                </a>
              </li>

              <li v-if="hasComprobantes(data)">
                <a
                  class="dropdown-item cursor-pointer"
                  @click="openComprobantesModal(data)"
                >
                  <KTIcon icon-name="eye" icon-class="fs-4 me-2" /> Revisar
                  comprobantes
                </a>
              </li>
            </ul>
          </div>
        </template>
      </KTDatatable>

      <!-- Crear / Editar (form dinámico) -->
      <div
        class="modal fade"
        id="createSolicitudModal"
        tabindex="-1"
        aria-hidden="true"
        ref="createModalEl"
      >
        <div class="modal-dialog modal-xl modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                {{ isEdit ? "Editar solicitud" : "Crear solicitud" }}
              </h5>
              <button
                type="button"
                class="btn-close"
                @click="hideCreateSolicitudModal"
                aria-label="Cerrar"
              ></button>
            </div>
            <div class="modal-body">
              <ServiceSolicitudForm
                v-if="formModelReady"
                :key="formKey"
                :service-key="serviceKeyValue"
                :initial-data="selectedSolicitudForEditRaw"
                :creator-prestatario-id="prestatarioId"
                @saved="onCreateEditSaved"
                @cancel="onCreateEditCancel"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Prestatarios modal -->
      <div
        class="modal fade"
        id="prestatariosModal"
        tabindex="-1"
        aria-hidden="true"
        ref="prestatariosModalEl"
      >
        <div class="modal-dialog modal-dialog-scrollable modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Prestatarios compatibles</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
              />
            </div>
            <div class="modal-body">
              <div v-if="prestatariosLoading" class="text-center py-4">
                <div class="spinner-border" role="status"></div>
                <div class="mt-2">Cargando prestatarios...</div>
              </div>
              <div v-else>
                <div v-if="prestatarios.length === 0" class="text-muted">
                  No se encontraron prestatarios para estos filtros.
                </div>
                <div v-else class="list-group">
                  <div
                    v-for="p in prestatarios"
                    :key="p.id"
                    class="list-group-item list-group-item-action d-flex justify-content-between align-items-start"
                  >
                    <div class="ms-2 me-auto">
                      <div class="fw-bold">
                        {{ p.companyName || p.name || p.user?.username || "-" }}
                      </div>
                      <div class="small text-muted mb-1">
                        Rating: {{ p.rating ?? "-" }}
                      </div>

                      <div class="small mt-2">
                        Correo: {{ p.user?.email ?? "-" }} <br />
                        Teléfono: {{ p.user?.phone ?? "-" }} <br />
                      </div>
                    </div>
                    <div class="text-end">
                      <button
                        class="btn btn-sm btn-primary mb-1"
                        @click="selectPrestatarioForSolicitud(p)"
                      >
                        Seleccionar (proponer)
                      </button>
                      <div>
                        <button
                          class="btn btn-sm btn-light"
                          @click="viewPrestatarioProfile(p)"
                        >
                          Ver perfil
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Comprobantes modal -->
      <div
        class="modal fade"
        id="comprobantesModal"
        tabindex="-1"
        aria-hidden="true"
        ref="comprobantesModalRef"
      >
        <div class="modal-dialog modal-lg modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Comprobantes</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" />
            </div>
            <div class="modal-body">
              <div v-if="comprobantesLoading" class="text-center py-4">
                <div class="spinner-border" role="status"></div>
              </div>
              <div v-else>
                <div v-if="!comprobantes.length" class="text-muted">
                  No se encontraron comprobantes.
                </div>
                <div v-else class="d-flex flex-wrap gap-3">
                  <div
                    v-for="(img, idx) in comprobantes"
                    :key="idx"
                    class="card border-0 shadow-sm"
                    style="width: 180px"
                  >
                    <div style="height: 120px; overflow: hidden">
                      <img
                        :src="img"
                        alt="comprobante"
                        class="img-fluid w-100 h-100"
                        style="object-fit: cover"
                      />
                    </div>
                    <div class="card-body p-2 text-center">
                      <small class="text-muted"
                        >Comprobante {{ idx + 1 }}</small
                      >
                      <div class="mt-2 d-flex justify-content-center gap-2">
                        <button
                          class="btn btn-sm btn-outline-primary"
                          @click="
                            downloadImage(img, `comprobante-${idx + 1}.jpg`)
                          "
                        >
                          Descargar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-light"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ref,
  onMounted,
  onBeforeUnmount,
  nextTick,
  computed,
  watch,
} from "vue";
import { useRoute } from "vue-router";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
// @ts-ignore
import ServiceSolicitudForm from "./ServiceSolicitudForm.vue";
import { Modal } from "bootstrap";
import Swal from "sweetalert2";
import api from "@/services/api";
import { useCookies } from "vue3-cookies";
import {
  SERVICES,
  type ServiceConfig,
} from "@/views/prestatario/services/config/services.config";

/* ---------- tipos ---------- */
interface Solicitud {
  id: string;
  [k: string]: any;
}
interface PrestatarioMin {
  id: string;
  [k: string]: any;
}

/* ---------- estado ---------- */
const route = useRoute();
const { cookies } = useCookies();

/* serviceKey reactivo */
const serviceKey = computed(() =>
  String(route.params.serviceKey ?? route.query.service ?? "alquiler"),
);
const serviceKeyValue = computed(() => serviceKey.value);
const serviceTitle = computed(() =>
  serviceKey.value
    ? serviceKey.value[0].toUpperCase() + serviceKey.value.slice(1)
    : "Servicio",
);

const solicitudes = ref<Solicitud[]>([]);
const initSolicitudes = ref<Solicitud[]>([]);
const loading = ref(false);
const search = ref("");
const selectedIds = ref<string[]>([]);

const selectedSolicitudForEditRaw = ref<any | null>(null);
const isEdit = ref(false);
const formKey = ref(0);
const formModelReady = ref(false);

/* modals */
const createModalEl = ref<HTMLElement | null>(null);
let createModalInstance: Modal | null = null;

const prestatariosModalEl = ref<HTMLElement | null>(null);
let prestatariosModalInstance: Modal | null = null;

const comprobantesModalRef = ref<HTMLElement | null>(null);
let comprobantesModalInstance: Modal | null = null;

/* prestatarios state */
const prestatarios = ref<PrestatarioMin[]>([]);
const prestatariosLoading = ref(false);
const selectedSolicitudForPrestatarios = ref<Solicitud | null>(null);

/* comprobantes */
const comprobantes = ref<string[]>([]);
const comprobantesLoading = ref(false);

/* prestatario id resolved */
const prestatarioId = ref<string | null>(null);
const canCreate = computed(() => !!prestatarioId.value);

/* header computado desde config */
const tableHeaderComputed = computed(() => {
  const cfg: ServiceConfig | undefined = (SERVICES as any)[serviceKey.value];
  if (!cfg) {
    return [
      {
        columnName: "Solicitante",
        columnLabel: "solicitante",
        sortEnabled: true,
        columnWidth: 180,
      },
      {
        columnName: "Estado",
        columnLabel: "status",
        sortEnabled: true,
        columnWidth: 110,
      },
      {
        columnName: "Creado",
        columnLabel: "created_at",
        sortEnabled: true,
        columnWidth: 160,
      },
      { columnName: "Acciones", columnLabel: "actions", columnWidth: 110 },
    ];
  }

  const cols = cfg.listColumns.map((c) => ({
    columnName: c.columnLabel,
    columnLabel: c.columnName,
    sortEnabled: true,
    columnWidth: c.width ?? 140,
  }));

  const ensure = (name: string, label: string, width = 140) => {
    if (!cols.find((x) => x.columnLabel === label)) {
      cols.push({
        columnName: name,
        columnLabel: label,
        sortEnabled: true,
        columnWidth: width,
      });
    }
  };
  ensure("Estado", "status", 110);
  ensure("Creado", "created_at", 160);
  ensure("Acciones", "actions", 110);

  return cols;
});

/* ---------- utilidades ---------- */

/**
 * Escapa texto para insertar en HTML
 */
function escapeHtml(str: any) {
  if (str === null || str === undefined) return "-";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/**
 * Devuelve array con los nombres de los servicios (alquiler, gps, taller, alojamiento)
 * que el prestatario ofrece según sus campos.
 */
function getOfferedServices(p: any): string[] {
  const services: string[] = [];

  // ALQUILER: si tiene metrosDisponiblesAlquiler / serviciosPrestAlquiler
  if (
    (p.metrosDisponiblesAlquiler ?? p.metros_disponibles_alquiler) ||
    (Array.isArray(p.serviciosPrestAlquiler) &&
      p.serviciosPrestAlquiler.length) ||
    (Array.isArray(p.servicios_prest_alquiler) &&
      p.servicios_prest_alquiler.length)
  ) {
    services.push("Alquiler");
  }

  // GPS: providers, devices available, plans, or integration flag
  if (
    (Array.isArray(p.gpsProviders) && p.gpsProviders.length) ||
    (p.gpsDevicesAvailable ?? p.gps_devices_available) ||
    (p.gpsPlans ?? p.gps_plans) ||
    p.gpsIntegrationApi === true ||
    p.gps_integration_api === true
  ) {
    services.push("GPS");
  }

  // TALLER: talleresServicios / talleres_servicios / talleresNumTecnicos / capacidad
  if (
    (Array.isArray(p.talleresServicios) && p.talleresServicios.length) ||
    (Array.isArray(p.talleres_servicios) && p.talleres_servicios.length) ||
    (p.talleresNumTecnicos ?? p.talleres_num_tecnicos) ||
    (p.talleresCapacidadVehiculos ?? p.talleres_capacidad_vehiculos)
  ) {
    services.push("Taller");
  }

  // ALOJAMIENTO: habitacionesDisponibles / capacidadPersonas / tipoHabitaciones
  if (
    (p.habitacionesDisponibles ?? p.habitaciones_disponibles) ||
    (p.capacidadPersonas ?? p.capacidad_personas) ||
    (Array.isArray(p.tipoHabitaciones) && p.tipoHabitaciones.length) ||
    (Array.isArray(p.tipo_habitaciones) && p.tipo_habitaciones.length)
  ) {
    services.push("Alojamiento");
  }

  return services;
}

/**
 * Renderiza un bloque HTML con los detalles por servicio para mostrar en "Ver perfil".
 * Retorna string HTML.
 */
function renderServiceDetailsHtml(p: any): string {
  const lines: string[] = [];

  // Cabecera
  lines.push(
    `<h5>${escapeHtml(p.companyName || p.name || p.user?.username || "Prestatario")}</h5>`,
  );
  lines.push(
    `<div class="small text-muted">Rating: ${escapeHtml(p.rating ?? "-")}</div>`,
  );
  lines.push("<hr/>");

  // Servicios ofrecidos (badges)
  const offered = getOfferedServices(p);
  lines.push("<div><strong>Servicios:</strong> ");
  if (offered.length) {
    lines.push(
      offered
        .map(
          (s) =>
            `<span style="display:inline-block;margin:3px;padding:4px 8px;border-radius:8px;background:#f1f1f1;color:#333;font-size:12px">${escapeHtml(s)}</span>`,
        )
        .join(" "),
    );
  } else {
    lines.push("- ");
  }
  lines.push("</div><hr/>");

  // Detalles por servicio (solo los que aplica el prestatario)
  // ALQUILER
  if (offered.includes("Alquiler")) {
    lines.push("<h6>Alquiler</h6>");
    lines.push("<ul>");
    lines.push(
      `<li>Metros disponibles: ${escapeHtml(p.metrosDisponiblesAlquiler ?? p.metros_disponibles_alquiler ?? "-")}</li>`,
    );
    lines.push(
      `<li>Altura disponible: ${escapeHtml(p.alturaMAlquiler ?? p.altura_m_alquiler ?? "-")}</li>`,
    );
    const servAlq =
      p.serviciosPrestAlquiler ?? p.servicios_prest_alquiler ?? [];
    lines.push(
      `<li>Servicios: ${escapeHtml(Array.isArray(servAlq) ? servAlq.join(", ") : servAlq || "-")}</li>`,
    );
    lines.push("</ul>");
  }

  // GPS
  if (offered.includes("GPS")) {
    lines.push("<h6>GPS</h6>");
    lines.push("<ul>");
    lines.push(
      `<li>Providers: ${escapeHtml(Array.isArray(p.gpsProviders) ? p.gpsProviders.join(", ") : (p.gpsProviders ?? "-"))}</li>`,
    );
    lines.push(
      `<li>Dispositivos disponibles: ${escapeHtml(p.gpsDevicesAvailable ?? p.gps_devices_available ?? "-")}</li>`,
    );
    lines.push(
      `<li>Planes: ${escapeHtml(p.gpsPlans ?? p.gps_plans ?? "-")}</li>`,
    );
    lines.push(
      `<li>Integración API: ${escapeHtml(p.gpsIntegrationApi ? "Sí" : p.gps_integration_api ? "Sí" : "No")}</li>`,
    );
    lines.push("</ul>");
  }

  // TALLER
  if (offered.includes("Taller")) {
    lines.push("<h6>Taller</h6>");
    lines.push("<ul>");
    const talleresServicios = p.talleresServicios ?? p.talleres_servicios ?? [];
    lines.push(
      `<li>Servicios: ${escapeHtml(Array.isArray(talleresServicios) ? talleresServicios.join(", ") : talleresServicios || "-")}</li>`,
    );
    lines.push(
      `<li>Número técnicos: ${escapeHtml(p.talleresNumTecnicos ?? p.talleres_num_tecnicos ?? "-")}</li>`,
    );
    lines.push(
      `<li>Capacidad vehículos: ${escapeHtml(p.talleresCapacidadVehiculos ?? p.talleres_capacidad_vehiculos ?? "-")}</li>`,
    );
    lines.push(
      `<li>Horario: ${escapeHtml(p.talleresHorario ?? p.talleres_horario ?? "-")}</li>`,
    );
    lines.push("</ul>");
  }

  // ALOJAMIENTO
  if (offered.includes("Alojamiento")) {
    lines.push("<h6>Alojamiento</h6>");
    lines.push("<ul>");
    lines.push(
      `<li>Habitaciones disponibles: ${escapeHtml(p.habitacionesDisponibles ?? p.habitaciones_disponibles ?? "-")}</li>`,
    );
    lines.push(
      `<li>Capacidad personas: ${escapeHtml(p.capacidadPersonas ?? p.capacidad_personas ?? "-")}</li>`,
    );
    lines.push(
      `<li>Precio por noche (prom): ${escapeHtml(p.precioNochePromedio ?? p.precio_noche_promedio ?? "-")}</li>`,
    );
    const tipos = p.tipoHabitaciones ?? p.tipo_habitaciones ?? [];
    lines.push(
      `<li>Tipo habitaciones: ${escapeHtml(Array.isArray(tipos) ? tipos.join(", ") : tipos || "-")}</li>`,
    );
    const servAloj =
      p.serviciosIncluidosAlojamiento ??
      p.servicios_incluidos_alojamiento ??
      [];
    lines.push(
      `<li>Servicios incluidos: ${escapeHtml(Array.isArray(servAloj) ? servAloj.join(", ") : servAloj || "-")}</li>`,
    );
    lines.push("</ul>");
  }

  // Transportes / ayudantes / cargas especiales — info general
  lines.push("<hr/>");
  if (Array.isArray(p.transportes) && p.transportes.length) {
    lines.push("<h6>Transportes</h6>");
    lines.push("<ul>");
    for (const t of p.transportes) {
      lines.push(
        `<li>${escapeHtml(t.nombreChofer ?? (t.nombre || "-"))} — chapa: ${escapeHtml(t.chapa ?? "-")} — tipo: ${escapeHtml(t.tipoTransporte ?? "-")}</li>`,
      );
    }
    lines.push("</ul>");
  }

  if (Array.isArray(p.ayudantes) && p.ayudantes.length) {
    lines.push("<h6>Ayudantes</h6>");
    lines.push("<ul>");
    for (const a of p.ayudantes) {
      lines.push(
        `<li>${escapeHtml(a.nombre ?? "-")} ${escapeHtml(a.apellidos ?? "")} — CI: ${escapeHtml(a.ci ?? "-")}</li>`,
      );
    }
    lines.push("</ul>");
  }

  if (Array.isArray(p.cargasEspeciales) && p.cargasEspeciales.length) {
    lines.push("<h6>Cargas especiales</h6>");
    lines.push(`<div>${escapeHtml(p.cargasEspeciales.join(", "))}</div>`);
  }

  return lines.join("");
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString();
  } catch {
    return dateStr ?? "-";
  }
}
function formatDateTime(dateStr: string | null) {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return d.toLocaleString();
  } catch {
    return dateStr ?? "-";
  }
}
function getStatusBadgeClass(status: string | undefined) {
  return {
    badge: true,
    "badge-light-warning": status === "pending" || status === "PENDING",
    "badge-light-success": status === "approved" || status === "APPROVED",
    "badge-light-danger": status === "rejected" || status === "REJECTED",
  };
}
function getRowClass(row: any) {
  return "";
}
function hasComprobantes(row: any) {
  return (
    Array.isArray((row as any).comprobantes) &&
    !!(row as any).comprobantes?.length
  );
}
function castRow(r: unknown): Solicitud {
  return r as Solicitud;
}

function normalizeRow(row: any) {
  const original = row || {};
  const r: any = { ...original };

  // preserve raw object for edit-mode (ISO dates, original keys)
  r.__raw = original;

  const reprPerson = (obj: any) => {
    if (!obj) return "-";
    if (typeof obj === "string") return obj;
    if (obj.companyName) return obj.companyName;
    if (obj.name) return obj.name;
    if (obj.user && (obj.user.username || obj.user.email))
      return obj.user.username || obj.user.email;
    if (obj.id) return obj.id;
    try {
      return JSON.stringify(obj).slice(0, 200);
    } catch {
      return String(obj);
    }
  };

  r.cliente =
    typeof r.cliente === "object" ? reprPerson(r.cliente) : (r.cliente ?? "-");
  r.assignedPrestatario =
    typeof r.assignedPrestatario === "object"
      ? reprPerson(r.assignedPrestatario)
      : (r.assignedPrestatario ?? "-");
  r.createdByPrestatario =
    typeof r.createdByPrestatario === "object"
      ? reprPerson(r.createdByPrestatario)
      : (r.createdByPrestatario ?? "-");

  if (Array.isArray(r.servicios))
    r.servicios = r.servicios.length ? r.servicios.join(", ") : "-";
  else if (r.servicios == null || r.servicios === "") r.servicios = "-";
  else if (typeof r.servicios === "object") {
    try {
      r.servicios = JSON.stringify(r.servicios);
    } catch {
      r.servicios = String(r.servicios);
    }
  } else r.servicios = String(r.servicios);

  const ensurePrimitive = (k: string) => {
    if (Array.isArray(r[k])) r[k] = r[k].length ? r[k].join(", ") : "-";
    else if (r[k] === null || r[k] === undefined || r[k] === "") r[k] = "-";
    else if (typeof r[k] === "object") {
      try {
        r[k] = JSON.stringify(r[k]);
      } catch {
        r[k] = String(r[k]);
      }
    }
  };

  [
    "tipo_trabajo",
    "vehiculo_marca",
    "vehiculo_placa",
    "habitaciones_requeridas",
    "personas",
    "device_count",
    "plan",
    "fecha_fin",
  ].forEach(ensurePrimitive);

  r.fecha_inicio = formatDate(original.fecha_inicio ?? r.fecha_inicio ?? null);
  r.fecha_fin = original.fecha_fin
    ? formatDate(original.fecha_fin)
    : (r.fecha_fin ?? null);
  r.created_at = formatDateTime(original.created_at ?? r.created_at ?? null);

  if (r.comentarios) {
    const txt = String(r.comentarios);
    r.comentarios = txt.length > 120 ? txt.slice(0, 120) + "…" : txt;
  } else r.comentarios = r.comentarios ?? "-";

  r.metros_requeridos = r.metros_requeridos ?? "-";
  r.altura_m = r.altura_m ?? "-";

  r.serviceRequested =
    r.serviceRequested ?? r.service_type ?? r.tipo_servicio ?? null;

  return r;
}

/* -------------------------
   API / Lógica principal
   ------------------------- */
async function resolvePrestatarioFromCookieOrApi() {
  try {
    const raw = cookies.get("userData");
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    const userId =
      parsed?.userID ?? parsed?.userId ?? parsed?.id ?? parsed?.user?.id;
    if (!userId) return null;

    const res = await api.get(
      `/prestatario/user/${encodeURIComponent(String(userId))}`,
    );
    const payload = res?.data ?? res;
    const p = payload?.data ?? payload ?? null;
    if (p?.id) prestatarioId.value = p.id;
    return p;
  } catch (e) {
    console.warn(
      "[ServiceSolicitudesList] fallo al resolver prestatario:",
      e?.message ?? e,
    );
    return null;
  }
}

const loadSolicitudes = async () => {
  try {
    loading.value = true;
    if (!prestatarioId.value) await resolvePrestatarioFromCookieOrApi();

    const cfg: ServiceConfig | undefined = (SERVICES as any)[serviceKey.value];
    const endpoint = cfg?.endpoints?.listSolicitudes ?? "/solicitudes";
    const params: any = { serviceRequested: serviceKey.value };
    if (prestatarioId.value)
      params.createdByPrestatarioId = prestatarioId.value;

    const res = await api.get(endpoint, { params });
    const data = Array.isArray(res.data)
      ? res.data
      : (res.data?.data ?? res.data);
    const normalized = (data || []).map((r: any) => normalizeRow(r));
    solicitudes.value = normalized;
    initSolicitudes.value = [...normalized];
  } catch (err: any) {
    console.error("Error cargando solicitudes:", err);
    Swal.fire({
      text:
        err?.response?.data?.message ??
        err?.message ??
        "Error al cargar solicitudes",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

/* búsqueda: usa campos configurados para el servicio + campos comunes */
function searchItems() {
  const q = (search.value || "").toLowerCase().trim();
  if (!q) {
    solicitudes.value = [...initSolicitudes.value];
    return;
  }
  const cfg: ServiceConfig | undefined = (SERVICES as any)[serviceKey.value];
  const searchFields = new Set<string>([
    "solicitante",
    "email",
    "telefono",
    "comentarios",
    "tipo_uso",
    "status",
  ]);
  if (cfg) cfg.listColumns.forEach((c) => searchFields.add(c.columnName));
  solicitudes.value = initSolicitudes.value.filter((s) => {
    return Array.from(searchFields).some((field) => {
      try {
        return String((s as any)[field] ?? "")
          .toLowerCase()
          .includes(q);
      } catch {
        return false;
      }
    });
  });
}

function onItemSelect(items: any[]) {
  selectedIds.value = Array.isArray(items)
    ? items.map((i) => (i as Solicitud).id)
    : [];
}

/* eliminar */
async function deleteSolicitud(id: string) {
  const r = await Swal.fire({
    title: "Eliminar solicitud",
    text: "¿Estás seguro? Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    buttonsStyling: false,
    customClass: {
      confirmButton: "btn btn-danger me-3",
      cancelButton: "btn btn-light",
    },
    reverseButtons: true,
  });
  if (!r.isConfirmed) return;
  try {
    Swal.fire({
      title: "Eliminando...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
    await api.delete(`/solicitudes/${id}`);
    Swal.close();
    await Swal.fire({ text: "Solicitud eliminada", icon: "success" });
    await loadSolicitudes();
  } catch (err: any) {
    Swal.close();
    console.error("Error eliminando solicitud:", err);
    Swal.fire({
      text:
        err?.response?.data?.message ??
        err?.message ??
        "Error eliminando solicitud",
      icon: "error",
    });
  }
}

/* editar / crear */
function openCreateSolicitudModal() {
  isEdit.value = false;
  selectedSolicitudForEditRaw.value = null;
  formKey.value++;
  formModelReady.value = true;
  nextTick(() => {
    const el = document.getElementById("createSolicitudModal");
    if (el) {
      if (!createModalInstance)
        createModalInstance = new Modal(el, { backdrop: "static" });
      createModalInstance.show();
    }
  });
}
function openEditSolicitudModal(row: any) {
  isEdit.value = true;
  // preferir objeto raw si KTDatatable lo adjunta
  selectedSolicitudForEditRaw.value = (row && (row.__raw ?? row)) ?? row;
  formKey.value++;
  formModelReady.value = true;
  nextTick(() => {
    const el = document.getElementById("createSolicitudModal");
    if (el) {
      if (!createModalInstance)
        createModalInstance = new Modal(el, { backdrop: "static" });
      createModalInstance.show();
    }
  });
}
function hideCreateSolicitudModal() {
  if (createModalInstance) createModalInstance.hide();
}
async function onCreateEditSaved(payload: any) {
  hideCreateSolicitudModal();
  await loadSolicitudes();
}
function onCreateEditCancel() {
  hideCreateSolicitudModal();
}

/* ---------- Prestatarios (match / seleccionar para proponer) ---------- */
function buildPrestatariosParamsFromSolicitud(solicitud: any) {
  const service = solicitud.serviceRequested ?? serviceKey.value;
  // default
  let params: any = { service, limit: 50 };

  switch (String(service).toLowerCase()) {
    case "alquiler":
      params.metros = Number(solicitud.metros_requeridos || 0);
      params.altura = Number(solicitud.altura_m || 0);
      break;
    case "alojamiento":
      params.habitaciones = Number(
        solicitud.habitaciones_requeridas || solicitud.habitaciones || 0,
      );
      params.personas = Number(solicitud.personas || 0);
      // si tienes fecha_inicio/fecha_fin, pásalas para filtrar disponibilidad
      if (solicitud.fecha_inicio && solicitud.__raw?.fecha_inicio)
        params.fecha_inicio = solicitud.__raw.fecha_inicio;
      if (solicitud.fecha_fin && solicitud.__raw?.fecha_fin)
        params.fecha_fin = solicitud.__raw.fecha_fin;
      break;
    case "taller":
      // tipo_trabajo puede ser array (multi-select) o string
      if (Array.isArray(solicitud.tipo_uso) && solicitud.tipo_uso.length) {
        params.tipo_trabajo = solicitud.tipo_uso; // será enviado como param[] por axios
      } else if (solicitud.tipo_uso && typeof solicitud.tipo_uso === "string") {
        params.tipo_trabajo = solicitud.tipo_uso; // CSV o single string; el service lo normaliza
      }
      break;

    case "gps":
      params.device_count = Number(solicitud.device_count || 0);
      if (solicitud.plan) params.plan = solicitud.plan;
      break;
    default:
      // try meters/altura as fallback
      params.metros = Number(solicitud.metros_requeridos || 0);
      params.altura = Number(solicitud.altura_m || 0);
  }
  return params;
}

async function openPrestatariosModal(solicitud: any) {
  try {
    selectedSolicitudForPrestatarios.value = solicitud;
    prestatariosLoading.value = true;
    prestatarios.value = [];

    const params = buildPrestatariosParamsFromSolicitud(solicitud);
    // allow per-service match endpoint if provided
    const cfg: ServiceConfig | undefined = (SERVICES as any)[serviceKey.value];
    const matchEndpoint =
      cfg?.endpoints?.matchPrestatarios ?? "/prestatario/match-space";

    const res = await api.get(matchEndpoint, { params });
    const data = Array.isArray(res.data)
      ? res.data
      : (res.data?.data ?? res.data);
    prestatarios.value = Array.isArray(data) ? data : [];

    const el = document.getElementById("prestatariosModal");
    if (el) {
      if (!prestatariosModalInstance) prestatariosModalInstance = new Modal(el);
      prestatariosModalInstance.show();
    }
  } catch (err: any) {
    console.error("Error buscando prestatarios (match-space):", err);
    Swal.fire({
      text:
        err?.response?.data?.message ??
        err?.message ??
        "Error al buscar prestatarios",
      icon: "error",
    });
  } finally {
    prestatariosLoading.value = false;
  }
}

/* seleccionar prestatario -> crear proposal para services */
async function selectPrestatarioForSolicitud(p: any) {
  try {
    const s = selectedSolicitudForPrestatarios.value;
    if (!s || !p) throw new Error("Faltan datos");

    const ok = await Swal.fire({
      title: "Confirmar",
      text: `Proponer la solicitud a ${p.companyName || p.name || p.user?.username || p.id}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, proponer",
    });
    if (!ok.isConfirmed) return;

    Swal.fire({
      title: "Proponiendo prestatario...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    await api.post(`/solicitudes/${s.id}/proposals_services`, {
      prestatarioId: p.id,
      serviceType: s.serviceRequested ?? serviceKey.value,
      message: "Propuesta enviada vía UI",
    });

    Swal.close();
    await Swal.fire({
      text: "Propuesta enviada correctamente",
      icon: "success",
    });

    const el = document.getElementById("prestatariosModal");
    if (el) (Modal as any).getInstance?.(el)?.hide();

    await loadSolicitudes();
  } catch (err: any) {
    Swal.close();
    console.error("Error proponiendo prestatario:", err);
    Swal.fire({
      text:
        err?.response?.data?.message ??
        err?.message ??
        "Error proponiendo prestatario",
      icon: "error",
    });
  }
}

/* ver perfil */
async function viewPrestatarioProfile(p: any) {
  try {
    let profile = p;
    if (!p.transportes && p.id) {
      const res = await api.get(`/prestatario/${p.id}`);
      profile = res.data?.data ?? res.data;
    }
    const html = renderServiceDetailsHtml(profile);
    await Swal.fire({
      title: escapeHtml(
        profile.companyName ??
          profile.name ??
          profile.user?.username ??
          "Prestatario",
      ),
      html,
      width: "720px",
      showCloseButton: true,
      showCancelButton: false,
      customClass: {
        title: "text-white fs-1 fw-bold", // usa la clase de bootstrap
      },
      focusConfirm: true,
      confirmButtonText: "Cerrar",
    });
  } catch (err: any) {
    console.error("Error cargando perfil del prestatario:", err);
    Swal.fire({
      text:
        err?.response?.data?.message ??
        err?.message ??
        "Error al cargar perfil",
      icon: "error",
    });
  }
}

/* comprobantes */
async function openComprobantesModal(solicitud: any) {
  try {
    comprobantesLoading.value = true;
    comprobantes.value = [];
    if (
      Array.isArray(solicitud.comprobantes) &&
      solicitud.comprobantes.length
    ) {
      comprobantes.value = solicitud.comprobantes;
    } else {
      const res = await api.get(`/solicitudes/${solicitud.id}/comprobantes`);
      const data = Array.isArray(res.data)
        ? res.data
        : (res.data?.data ?? res.data);
      comprobantes.value = data || [];
    }
    const el = document.getElementById("comprobantesModal");
    if (el) {
      if (!comprobantesModalInstance) comprobantesModalInstance = new Modal(el);
      comprobantesModalInstance.show();
    }
  } catch (err: any) {
    console.error("Error cargando comprobantes:", err);
    Swal.fire({
      text:
        err?.response?.data?.message ??
        err?.message ??
        "Error al cargar comprobantes",
      icon: "error",
    });
  } finally {
    comprobantesLoading.value = false;
  }
}

function downloadImage(url: string, filename = "image.jpg") {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/* lifecycle: recargar cuando cambie serviceKey */
watch(
  serviceKey,
  async (newVal, oldVal) => {
    if (newVal === oldVal) return;
    await resolvePrestatarioFromCookieOrApi();
    await loadSolicitudes();
  },
  { immediate: false },
);

onMounted(async () => {
  await resolvePrestatarioFromCookieOrApi();
  await loadSolicitudes();
});

onBeforeUnmount(() => {
  try {
    if (createModalInstance) createModalInstance.hide();
    if (prestatariosModalInstance) prestatariosModalInstance.hide();
    if (comprobantesModalInstance) comprobantesModalInstance.hide();
  } catch (e) {}
});
</script>

<style scoped>
.card .form-control[placeholder] {
  padding-left: 2.5rem;
}
</style>
