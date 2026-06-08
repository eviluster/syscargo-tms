<template>
  <div class="card" ref="rootEl" data-component="list-solicitudes">
    <div class="card-header">
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
          placeholder="Buscar solicitud"
        />
      </div>

      <div class="d-flex justify-content-end align-items-center">
        <div class="fw-bold me-5">
          <span class="me-2">{{ selectedIds.length }}</span> Elementos
          Seleccionados
        </div>

        <button
          type="button"
          class="btn btn-danger"
          :disabled="selectedIds.length === 0"
          @click="confirmDeleteSelected"
        >
          Eliminar Elementos
        </button>
      </div>
    </div>

    <div class="card-body">
      <KTDatatable
        :header="tableHeader"
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
        <!-- slots para columnas; usamos castRow(row) para obtener Solicitud con tipado -->
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
          formatDate(castRow(row).fecha_inicio)
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
          <!-- mostrar array como texto o el texto si ya viene así -->
          {{
            Array.isArray(castRow(row).servicios)
              ? castRow(row).servicios.length
                ? castRow(row).servicios.join(", ")
                : "-"
              : (castRow(row).servicios ?? "-")
          }}
        </template>

        <template v-slot:frecuencia="{ row }">{{
          castRow(row).frecuencia || "-"
        }}</template>
        <template v-slot:clasificacion_mercancia="{ row }">{{
          castRow(row).clasificacion_mercancia || "-"
        }}</template>

        <template v-slot:comentarios="{ row }">
          <small class="text-muted">
            {{
              (castRow(row).comentarios || "").slice(0, 80) +
                ((castRow(row).comentarios || "").length > 80 ? "…" : "") || "-"
            }}
          </small>
        </template>

        <template v-slot:cliente="{ row }">
          <small>
            {{
              castRow(row).cliente?.company ||
              castRow(row).cliente?.name ||
              castRow(row).cliente?.user?.username ||
              castRow(row).cliente?.user?.email ||
              "-"
            }}
          </small>
        </template>

        <template v-slot:assignedPrestatario="{ row }">
          <small>
            {{
              castRow(row).assignedPrestatario?.companyName ||
              castRow(row).assignedPrestatario?.name ||
              castRow(row).assignedPrestatario?.user?.username ||
              "-"
            }}
          </small>
        </template>

        <template v-slot:status="{ row }">
          <span :class="getStatusBadgeClass(castRow(row).status)">{{
            castRow(row).status || "pending"
          }}</span>
        </template>

        <template v-slot:created_at="{ row }">{{
          formatDateTime(castRow(row).created_at)
        }}</template>

        <!-- Acciones -->
        <template v-slot:actions="{ row: data }">
          <div>
            <button
              class="btn btn-sm btn-light btn-active-light-primary"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              ref="actionButton"
            >
              Acciones
              <KTIcon icon-name="down" icon-class="fs-5 m-0" />
            </button>

            <ul
              class="dropdown-menu"
              aria-labelledby="dropdownMenuButton"
              ref="actionMenu"
            >
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

      <!-- Modales (sin cambios) -->
      <!-- Editar -->
      <div
        class="modal fade"
        id="editSolicitudModal"
        tabindex="-1"
        aria-hidden="true"
        ref="editSolicitudModalEl"
      >
        <div class="modal-dialog modal-xl modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Editar Solicitud</h5>
              <button
                type="button"
                class="btn-close"
                @click="hideEditSolicitudModal"
                aria-label="Cerrar"
              ></button>
            </div>
            <div class="modal-body">
              <EditSolicitudForm
                v-if="selectedSolicitudForEdit"
                :key="formKey"
                :solicitud="selectedSolicitudForEdit"
                @saved="onEditSaved"
                @cancel="onEditCancel"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Prestatarios -->
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
                      <div class="small text-muted">
                        TipoCarga: {{ p.tipoCarga || "-" }} · Rating:
                        {{ p.rating ?? "-" }}
                      </div>
                      <div class="small text-muted">
                        MaxWeight: {{ p.maxWeight ?? p.max_weight ?? "-" }} kg ·
                        MaxVolume: {{ p.maxVolume ?? p.max_volume ?? "-" }} m³
                      </div>
                      <div class="small mt-1">
                        Cargas especiales:
                        <span v-if="(p.cargasEspeciales || []).length">{{
                          (p.cargasEspeciales || []).join(", ")
                        }}</span
                        ><span v-else>-</span>
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

      <!-- Comprobantes -->
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
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import EditSolicitudForm from "@/views/solicitudes-alquiler/EditSolicitudForm.vue";
import { Modal } from "bootstrap";
import Swal from "sweetalert2";
import api from "@/services/api";
import { useAuthStore } from "@/stores/auth";

/**
 * INTERFAZ Solicitud definida localmente
 */
interface Solicitud {
  id: string;
  solicitante: string;
  telefono: string;
  email: string;
  empresa?: string | null;
  metros_requeridos: number;
  tipo_uso: string;
  altura_m?: number | null;
  fecha_inicio: string;
  duracion: string;
  acceso_horario: string;
  control_temperatura?: string | null;
  servicios?: string[] | null;
  frecuencia?: string | null;
  clasificacion_mercancia?: string | null;
  comentarios?: string | null;
  cliente?: any | null;
  assignedPrestatario?: any | null;
  status?: string | null;
  created_at?: string | null;
  comprobantes?: string[] | null;
}

/* ---------- estado y refs tipados ---------- */
const solicitudes = ref<Solicitud[]>([]);
const initSolicitudes = ref<Solicitud[]>([]);
const loading = ref(false);
const search = ref("");
const selectedIds = ref<string[]>([]);
const selectedSolicitudForEdit = ref<Solicitud | null>(null);
const formKey = ref(0);

/* modals / instances */
const editSolicitudModalEl = ref<HTMLElement | null>(null);
let editModalInstance: Modal | null = null;

const prestatariosModalEl = ref<HTMLElement | null>(null);
let prestatariosModalInstance: Modal | null = null;

const comprobantesModalRef = ref<HTMLElement | null>(null);
let comprobantesModalInstance: Modal | null = null;

/* prestatarios/comprobantes state (sin tipar profundo, puedes mejorar) */
const prestatarios = ref<any[]>([]);
const prestatariosLoading = ref(false);
const selectedSolicitudForPrestatarios = ref<Solicitud | null>(null);

const comprobantes = ref<string[]>([]);
const comprobantesLoading = ref(false);

/* tabla */
const tableHeader = [
  { key: "solicitante", label: "Solicitante" },
  { key: "telefono", label: "Teléfono" },
  { key: "email", label: "Email" },
  { key: "empresa", label: "Empresa" },
  { key: "metros_requeridos", label: "Metros (m²)" },
  { key: "tipo_uso", label: "Tipo uso" },
  { key: "altura_m", label: "Altura (m)" },
  { key: "fecha_inicio", label: "Inicio" },
  { key: "duracion", label: "Duración" },
  { key: "acceso_horario", label: "Acceso" },
  { key: "control_temperatura", label: "Temperatura" },
  { key: "servicios", label: "Servicios" },
  { key: "frecuencia", label: "Frecuencia" },
  { key: "clasificacion_mercancia", label: "Clasificación" },
  { key: "cliente", label: "Cliente" },
  { key: "assignedPrestatario", label: "Prestatario" },
  { key: "status", label: "Estado" },
  { key: "created_at", label: "Creado" },
  { key: "actions", label: "Acciones" },
];

/* utilidades de formato */
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

/**
 * Helper para "tipar" filas en template.
 * Llamar castRow(row) en template es válido y evita usar "as" en el template.
 */
function castRow(r: unknown): Solicitud {
  return r as Solicitud;
}

/* ---------- llamadas API y lógica ---------- */
const loadSolicitudes = async () => {
  try {
    loading.value = true;
    const auth = useAuthStore();
    if (!auth?.accessToken) {
      console.warn("No hay token para cargar solicitudes");
      return;
    }

    const res = await api.get("/solicitudes");
    const data = Array.isArray(res.data)
      ? res.data
      : (res.data?.data ?? res.data);

    // Asignamos directamente igual que en loadOrdenes
    solicitudes.value = data;
    initSolicitudes.value = [...data];
  } catch (err: any) {
    console.error("Error cargando solicitudes:", err);
    Swal.fire({
      text:
        err?.response?.data?.message ||
        err?.message ||
        "Error al cargar solicitudes",
      icon: "error",
      buttonsStyling: false,
      confirmButtonText: "Ok",
      customClass: { confirmButton: "btn btn-primary" },
    });
  } finally {
    loading.value = false;
  }
};

function searchItems() {
  const q = (search.value || "").toLowerCase().trim();
  if (!q) {
    solicitudes.value = [...initSolicitudes.value];
    return;
  }
  solicitudes.value = initSolicitudes.value.filter((s) => {
    return (
      String(s.solicitante || "")
        .toLowerCase()
        .includes(q) ||
      String(s.email || "")
        .toLowerCase()
        .includes(q) ||
      String(s.telefono || "")
        .toLowerCase()
        .includes(q) ||
      String(s.tipo_uso || "")
        .toLowerCase()
        .includes(q) ||
      String(s.clasificacion_mercancia || "")
        .toLowerCase()
        .includes(q)
    );
  });
}

function onItemSelect(items: any[]) {
  selectedIds.value = Array.isArray(items)
    ? items.map((i) => (i as Solicitud).id)
    : [];
}

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
    await Swal.fire({
      text: "Solicitud eliminada",
      icon: "success",
      buttonsStyling: false,
      confirmButtonText: "Ok",
      customClass: { confirmButton: "btn btn-primary" },
    });
    await loadSolicitudes();
  } catch (err: any) {
    Swal.close();
    console.error("Error eliminando solicitud:", err);
    Swal.fire({
      text:
        err?.response?.data?.message ||
        err?.message ||
        "Error eliminando solicitud",
      icon: "error",
    });
  }
}

async function confirmDeleteSelected() {
  if (!selectedIds.value || selectedIds.value.length === 0) return;
  const result = await Swal.fire({
    title: `Eliminar ${selectedIds.value.length} elemento(s)`,
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
  if (!result.isConfirmed) return;

  try {
    Swal.fire({
      title: "Eliminando elementos...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
    await Promise.all(
      selectedIds.value.map((id) => api.delete(`/solicitudes/${id}`)),
    );
    Swal.close();
    await Swal.fire({
      text: "Elementos eliminados correctamente",
      icon: "success",
      buttonsStyling: false,
      confirmButtonText: "Ok",
      customClass: { confirmButton: "btn btn-primary" },
    });
    selectedIds.value = [];
    await loadSolicitudes();
  } catch (err: any) {
    Swal.close();
    console.error("Error eliminando elementos:", err);
    Swal.fire({
      text:
        err?.response?.data?.message ||
        err?.message ||
        "Error al eliminar elementos",
      icon: "error",
    });
  }
}

/* editar */
function openEditSolicitudModal(row: Solicitud) {
  selectedSolicitudForEdit.value = { ...row };
  formKey.value++;
  nextTick(() => {
    const el = document.getElementById("editSolicitudModal");
    if (el) {
      if (!editModalInstance)
        editModalInstance = new Modal(el, { backdrop: "static" });
      editModalInstance.show();
    }
  });
}
function hideEditSolicitudModal() {
  if (editModalInstance) editModalInstance.hide();
}
async function onEditSaved(updated: any) {
  hideEditSolicitudModal();
  await loadSolicitudes();
}
function onEditCancel() {
  hideEditSolicitudModal();
}

/* prestatarios */
function buildPrestatariosParamsFromSolicitud(s: Solicitud) {
  const tipoCarga = s.tipo_uso;
  const weight = Number(s.metros_requeridos || 0);
  const volume = Number(s.altura_m || 0);
  return { tipoCarga, weight, volume };
}

async function openPrestatariosModal(solicitud: Solicitud) {
  try {
    selectedSolicitudForPrestatarios.value = solicitud;
    prestatariosLoading.value = true;
    prestatarios.value = [];
    const params = buildPrestatariosParamsFromSolicitud(solicitud);
    const res = await api.get("/prestatario/search", { params });
    const data = Array.isArray(res.data)
      ? res.data
      : (res.data?.data ?? res.data);
    prestatarios.value = data || [];
    const el = document.getElementById("prestatariosModal");
    if (el) {
      if (!prestatariosModalInstance) prestatariosModalInstance = new Modal(el);
      prestatariosModalInstance.show();
    }
  } catch (err: any) {
    console.error("Error buscando prestatarios:", err);
    Swal.fire({
      text:
        err?.response?.data?.message ||
        err?.message ||
        "Error al buscar prestatarios",
      icon: "error",
    });
  } finally {
    prestatariosLoading.value = false;
  }
}

async function selectPrestatarioForSolicitud(p: any) {
  try {
    const s = selectedSolicitudForPrestatarios.value;
    if (!s || !p) throw new Error("Faltan datos");
    Swal.fire({
      title: "Proponiendo prestatario...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
    await api.patch(`/solicitudes/${s.id}`, { assigned_prestatario_id: p.id });
    Swal.close();
    await Swal.fire({
      text: "Prestatario propuesto correctamente",
      icon: "success",
      buttonsStyling: false,
      confirmButtonText: "Ok",
      customClass: { confirmButton: "btn btn-primary" },
    });
    if (prestatariosModalInstance) prestatariosModalInstance.hide();
    await loadSolicitudes();
  } catch (err: any) {
    Swal.close();
    console.error("Error proponiendo prestatario:", err);
    Swal.fire({
      text:
        err?.response?.data?.message ||
        err?.message ||
        "Error al proponer prestatario",
      icon: "error",
    });
  }
}

async function viewPrestatarioProfile(p: any) {
  try {
    let profile = p;
    if (!p.transportes && p.id) {
      const res = await api.get(`/prestatario/${p.id}`);
      profile = res.data?.data ?? res.data;
    }
    Swal.fire({
      title:
        profile.companyName ||
        profile.name ||
        profile.user?.username ||
        "Prestatario",
      html: `<div>Rating: ${profile.rating ?? "-"}<br/>TipoCarga: ${profile.tipoCarga ?? "-"}<br/>MaxWeight: ${profile.maxWeight ?? "-"} kg</div>`,
    });
  } catch (err: any) {
    console.error("Error cargando perfil del prestatario:", err);
    Swal.fire({
      text:
        err?.response?.data?.message ||
        err?.message ||
        "Error al cargar perfil",
      icon: "error",
    });
  }
}

/* comprobantes */
async function openComprobantesModal(solicitud: Solicitud) {
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
        err?.response?.data?.message ||
        err?.message ||
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

/* lifecycle */
onMounted(async () => {
  loadSolicitudes();
});

onBeforeUnmount(() => {
  try {
    if (editModalInstance) editModalInstance.hide();
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
