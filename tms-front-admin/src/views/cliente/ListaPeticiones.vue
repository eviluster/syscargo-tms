<template>
  <div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
      <div>
        <h4 class="mb-0">Mis Peticiones</h4>
        <small class="text-muted d-block"
          >Listado de peticiones creadas por el cliente</small
        >
      </div>

      <div class="d-flex gap-2 align-items-center">
        <button class="btn btn-primary" @click="goCreate">
          Crear petición
        </button>
        <input
          v-model="q"
          @input="debouncedFetch"
          placeholder="Buscar por tipo/entidad..."
          class="form-control"
          style="width: 260px"
        />
      </div>
    </div>

    <div class="card-body">
      <div v-if="loading" class="text-center py-4">
        <div class="spinner-border" role="status"></div>
        <div class="mt-2">Cargando peticiones...</div>
      </div>

      <!-- Tabla responsive propia (no KTDatatable) -->
      <div v-else class="table-responsive">
        <table class="table table-hover table-sm align-middle">
          <thead class="table-dark">
            <tr>
              <th>Entidad</th>
              <th>Carga</th>
              <th class="text-end">Peso</th>
              <th class="text-end">Volumen</th>
              <th>Origen</th>
              <th>Destino</th>
              <th>Tipo</th>
              <th>Status</th>
              <th style="width: 220px">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in itemsPlain" :key="r.id">
              <td class="text-truncate" style="max-width: 220px">
                {{ r.nombreEntidad || "-" }}
              </td>
              <td class="text-truncate" style="max-width: 220px">
                {{ r.nombreCarga || "-" }}
              </td>
              <td class="text-end">{{ formatNumber(r.peso) }}</td>
              <td class="text-end">{{ formatNumber(r.volumen) }}</td>
              <td>{{ r.origen || "-" }}</td>
              <td>{{ r.destino || "-" }}</td>
              <td>
                <span class="badge bg-light text-white">{{
                  r.tipoCarga || "-"
                }}</span>
              </td>
              <td>
                <span :class="statusBadgeClass(r.status)">{{
                  r.status || "-"
                }}</span>
              </td>

              <td>
                <div class="d-flex gap-1 justify-content-end">
                  <div class="dropdown">
                    <button
                      class="btn btn-sm btn-light dropdown-toggle "
                      type="button"
                      data-bs-toggle="dropdown"
                    >
                      Acciones
                    </button>

                    <ul class="dropdown-menu dropdown-menu-end p-0">
                      <li>
                        <a
                          class="dropdown-item"
                          @click.prevent="openPrestatariosModal(r)"
                        >
                          <i class="bi bi-truck me-2"></i> Ver prestatarios
                          compatibles
                        </a>
                      </li>

                      <li v-if="r.status === 'asignada' || r.assignedProposal">
                        <a
                          class="dropdown-item"
                          @click.prevent="openVehicleModal(r)"
                        >
                          <i class="bi bi-truck-front me-2"></i> Ver datos del
                          vehículo
                        </a>
                      </li>

                      <!-- EDITAR: solo mostrar si la petición NO está en su último estado -->
                      <li v-if="canEdit(r)">
                        <a
                          class="dropdown-item"
                          @click.prevent="openEditPeticionModal(r)"
                        >
                          <i class="bi bi-pencil-square me-2"></i> Editar
                        </a>
                      </li>

                      <li><hr class="dropdown-divider" /></li>

                      <li>
                        <a
                          class="dropdown-item text-danger"
                          @click.prevent="deletePeticion(r.id)"
                        >
                          <i class="bi bi-trash me-2"></i> Eliminar
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </td>
            </tr>

            <tr v-if="itemsPlain.length === 0">
              <td colspan="9" class="text-center py-4 text-muted">
                No hay peticiones
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Modal: Prestatarios compatibles -->
  <div
    class="modal fade"
    id="prestatariosModal"
    tabindex="-1"
    aria-hidden="true"
    ref="prestatariosModalRef"
  >
    <div
      class="modal-dialog modal-dialog-scrollable modal-lg modal-dialog-centered"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Prestatarios compatibles</h5>
          <button
            type="button"
            class="btn-close"
            @click="hidePrestatariosModal"
          ></button>
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
                class="list-group-item d-flex justify-content-between align-items-start"
              >
                <div class="me-3">
                  <div class="fw-bold">
                    {{ p.company || p.name || p.username || "-" }}
                  </div>
                  <div class="small text-muted">
                    TipoCarga: {{ p.tipoCarga || "-" }} · Rating:
                    {{ p.rating ?? "-" }}
                  </div>
                  <div class="small text-muted">
                    MaxWeight: {{ p.maxWeight ?? p.max_weight ?? "-" }} kg ·
                    MaxVolume: {{ p.maxVolume ?? p.max_volume ?? "-" }} m³
                  </div>
                </div>

                <div class="d-flex flex-column align-items-end">
                  <button
                    class="btn btn-sm btn-primary mb-1"
                    @click="selectPrestatarioForProposal(p)"
                  >
                    Seleccionar (proponer)
                  </button>
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
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="hidePrestatariosModal">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Perfil prestatario modal -->
  <div
    class="modal fade"
    id="prestatarioProfileModal"
    tabindex="-1"
    aria-hidden="true"
    ref="prestatarioProfileModalRef"
  >
    <div
      class="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Perfil del prestatario</h5>
          <button
            class="btn-close"
            @click="hidePrestatarioProfileModal"
          ></button>
        </div>
        <div class="modal-body">
          <div v-if="profileLoading" class="text-center py-4">
            <div class="spinner-border" role="status"></div>
            <div class="mt-2">Cargando perfil...</div>
          </div>

          <div v-else>
            <div v-if="!prestatarioProfile" class="text-muted">
              No hay datos del prestatario.
            </div>

            <div v-else>
              <h4>
                {{
                  prestatarioProfile.company ||
                  prestatarioProfile.name ||
                  prestatarioProfile.username
                }}
              </h4>
              <div class="small text-muted mb-3">
                Rating: {{ prestatarioProfile.rating ?? "-" }}
              </div>

              <div class="row mb-3">
                <div class="col-md-6">
                  <strong>Tipo de carga:</strong>
                  {{ prestatarioProfile.tipoCarga || "-" }}
                </div>
                <div class="col-md-6">
                  <strong>Contenedor:</strong>
                  {{ prestatarioProfile.contenedor || "-" }}
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-6">
                  <strong>Peso Máximo:</strong>
                  {{
                    prestatarioProfile.maxWeight ??
                    prestatarioProfile.max_weight ??
                    "-"
                  }}
                  kg
                </div>
                <div class="col-md-6">
                  <strong>Volumen Máximo:</strong>
                  {{
                    prestatarioProfile.maxVolume ??
                    prestatarioProfile.max_volume ??
                    "-"
                  }}
                  m³
                </div>
              </div>

              <div class="mb-3">
                <strong>Contacto:</strong>
                <div>Email: {{ prestatarioProfile.user?.username || "-" }}</div>
                <div>Tel: {{ prestatarioProfile.user?.phone || "-" }}</div>
              </div>

              <div class="mb-3">
                <strong>Condiciones / Reglas:</strong>
                <div v-if="prestatarioProfile.conditions">
                  {{ prestatarioProfile.conditions }}
                </div>
                <div v-else>-</div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-light" @click="hidePrestatarioProfileModal">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Vehicle modal -->
  <div
    ref="vehicleModalRef"
    class="modal fade"
    tabindex="-1"
    aria-hidden="true"
  >
    <div
      class="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ vehicleModalTitle }}</h5>
          <button class="btn-close" @click="hideVehicleModal"></button>
        </div>
        <div class="modal-body">
          <div v-if="vehicleLoading" class="text-center py-4">
            <div class="spinner-border" role="status"></div>
          </div>

          <div v-else-if="selectedPet && !selectedPet.assignedProposal">
            <div class="alert alert-warning">
              No hay proposal asignada a esta petición.
            </div>
          </div>

          <div v-else-if="selectedPet && selectedPet.assignedProposal">
            <h6>
              Vehículo asignado por:
              {{
                selectedPet.assignedProposal.prestatario?.name ||
                selectedPet.assignedProposal.prestatario?.id
              }}
            </h6>
            <table class="table table-sm">
              <tbody>
                <tr>
                  <th>Vehículo perteneciente a</th>
                  <td>{{ vehicleField("vehiculo_pertenece_a") }}</td>
                </tr>
                <!-- ... resto campos ... -->
              </tbody>
            </table>

            <div class="d-flex justify-content-end mt-2">
              <button
                class="btn btn-outline-secondary me-2"
                @click="rejectAgreement"
              >
                Rechazar
              </button>
              <button class="btn btn-success" @click="acceptAgreement">
                Aceptar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ========== EDIT PETICION MODAL ========== -->
  <div
    class="modal fade"
    id="editPeticionModal"
    tabindex="-1"
    aria-hidden="true"
    ref="editPeticionModalRef"
  >
    <div
      class="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered"
    >
      <div class="modal-content">
        <form @submit.prevent="submitEdit">
          <div class="modal-header">
            <h5 class="modal-title">Editar Petición</h5>
            <button
              type="button"
              class="btn-close"
              @click="hideEditPeticionModal"
            ></button>
          </div>

          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label required">Nombre o Entidad</label>
                <input
                  v-model="editForm.nombreEntidad"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label required">Nombre de la carga</label>
                <input
                  v-model="editForm.nombreCarga"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-md-3">
                <label class="form-label required">Peso (kg)</label>
                <input
                  type="number"
                  step="0.01"
                  v-model.number="editForm.peso"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-md-3">
                <label class="form-label">Volumen (m³)</label>
                <input
                  type="number"
                  step="0.01"
                  v-model.number="editForm.volumen"
                  class="form-control"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label required">Tipo de carga</label>
                <select
                  v-model="editForm.tipoCarga"
                  class="form-select"
                  required
                >
                  <option value="">Seleccione tipo de carga</option>
                  <option value="Seco">Seco</option>
                  <option value="Refrigerado">Refrigerado</option>
                  <option value="Carga general">Carga general</option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label required">Origen</label>
                <select v-model="editForm.origen" class="form-select" required>
                  <option value="">Seleccione un origen</option>
                  <option v-for="o in origenes" :key="o.id" :value="o.name">
                    {{ o.name }}
                  </option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label required">Destino</label>
                <select v-model="editForm.destino" class="form-select" required>
                  <option value="">Seleccione un destino</option>
                  <option v-for="d in destinos" :key="d.id" :value="d.name">
                    {{ d.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="hideEditPeticionModal"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="editSubmitting"
            >
              <span v-if="editSubmitting" role="status"></span>
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
/* Composition API + script setup */
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import api from "@/services/api";
import { useOrigenStore } from "@/stores/origen";
import { useDestinoStore } from "@/stores/destino";

/* ---------- estado ---------- */
const router = useRouter();
const items = ref([]);
const loading = ref(false);
const q = ref("");

const prestatarios = ref([]);
const prestatariosLoading = ref(false);
const prestatariosModalRef = ref(null);

const prestatarioProfile = ref(null);
const profileLoading = ref(false);
const prestatarioProfileModalRef = ref(null);

const selectedPet = ref(null);
const vehicleLoading = ref(false);
const vehicleModalRef = ref(null);

const proposalMessage = reactive({});
const currentPetForCompat = ref(null);

/* EDIT PETICION */
const editPeticionModalRef = ref(null);
const editSubmitting = ref(false);
const currentEditId = ref(null);
const editForm = reactive({
  nombreEntidad: "",
  nombreCarga: "",
  peso: null,
  volumen: null,
  origen: "",
  destino: "",
  tipoCarga: "",
});

/* origen/destino stores for selects */
const origenStore = useOrigenStore();
const destinoStore = useDestinoStore();
const origenes = computed(() => origenStore.origenes || []);
const destinos = computed(() => destinoStore.destinoes || []);

/* itemsPlain: snapshot para evitar proxies */
const itemsPlain = computed(() => {
  try {
    return JSON.parse(JSON.stringify(items.value || []));
  } catch (e) {
    return (items.value || []).slice();
  }
});

/* helpers UI */
function formatNumber(v) {
  if (v === null || v === undefined) return "-";
  return Number(v).toLocaleString();
}
function statusBadgeClass(status) {
  if (!status) return "badge bg-secondary";
  switch (status) {
    case "abierta":
      return "badge bg-info";
    case "asignada":
      return "badge bg-success";
    case "cancelada":
      return "badge bg-danger";
    case "usada":
      return "badge bg-secondary";
    default:
      return "badge bg-secondary";
  }
}
function canEdit(r) {
  const final = ["asignada", "usada"];
  return !final.includes(String(r.status || "").toLowerCase());
}

/* debounce */
function _debounce(fn, wait = 300) {
  let t = null;
  return (...args) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}
const debouncedFetch = _debounce(() => fetchItems(), 300);

/* fetch list */
async function fetchItems() {
  loading.value = true;
  try {
    const params = (q.value || "").trim() ? { q: (q.value || "").trim() } : {};
    const res = await api.get("/petitions", { params });
    items.value = res.data ?? res;
    console.debug(
      "Peticiones snapshot:",
      JSON.parse(JSON.stringify(items.value || [])),
    );
  } catch (err) {
    console.error("Error fetching petitions", err);
    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        err?.response?.data?.message ??
        err?.message ??
        "Error cargando peticiones",
    });
  } finally {
    loading.value = false;
  }
}

/* navigation */
function goCreate() {
  router.push("/comercializacion/peticion/addpeticion").catch(() => {});
}

/* ---------- PRESTATARIOS ---------- */
function buildPrestatariosParamsFromPet(pet) {
  return {
    tipoCarga: pet.tipoCarga || pet.tipo_carga || undefined,
    weight: pet.peso ?? pet.weight ?? undefined,
    volume: pet.volumen ?? pet.volume ?? undefined,
    limit: 50,
  };
}

function getModalInstance(refEl) {
  if (!refEl || !refEl.value) return null;
  const el = refEl.value;
  const bs = window?.bootstrap;
  if (bs && typeof bs.Modal === "function")
    return bs.Modal.getOrCreateInstance(el, { backdrop: true, keyboard: true });
  // simple fallback
  return {
    show() {
      el.classList.add("show");
      el.style.display = "block";
      document.body.classList.add("modal-open");
      let bg = document.querySelector(".modal-backdrop.custom-backdrop");
      if (!bg) {
        bg = document.createElement("div");
        bg.className = "modal-backdrop fade show custom-backdrop";
        document.body.appendChild(bg);
      }
    },
    hide() {
      el.classList.remove("show");
      el.style.display = "none";
      document.body.classList.remove("modal-open");
      const bg = document.querySelector(".modal-backdrop.custom-backdrop");
      if (bg) bg.remove();
    },
  };
}

let prestatariosModalInstance = null;
async function openPrestatariosModal(pet) {
  prestatarios.value = [];
  prestatariosLoading.value = true;
  currentPetForCompat.value = pet;
  try {
    const params = buildPrestatariosParamsFromPet(pet);
    const res = await api.get("/prestatario/search", { params });
    const data = Array.isArray(res.data)
      ? res.data
      : (res.data?.data ?? res.data);
    prestatarios.value = data || [];
    (prestatarios.value || []).forEach(
      (p) => (proposalMessage[p.id] = proposalMessage[p.id] ?? ""),
    );
    prestatariosModalInstance = getModalInstance(prestatariosModalRef);
    prestatariosModalInstance?.show();
  } catch (err) {
    console.error("Error obteniendo prestatarios", err);
    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        err?.response?.data?.message ??
        err?.message ??
        "Error al buscar prestatarios",
    });
  } finally {
    prestatariosLoading.value = false;
  }
}
function hidePrestatariosModal() {
  getModalInstance(prestatariosModalRef)?.hide();
}

async function selectPrestatarioForProposal(prestatario) {
  const pet = currentPetForCompat.value;
  if (!pet) return;
  const { value: message } = await Swal.fire({
    title: "Mensaje opcional",
    input: "textarea",
    inputLabel: "Mensaje para el prestatario (opcional)",
    showCancelButton: true,
  });
  if (message === undefined) return;
  try {
    await api.post("/proposals", {
      peticionId: pet.id,
      prestatarioId: prestatario.id,
      message: message || undefined,
    });
    Swal.fire({
      icon: "success",
      title: "OK",
      text: "Propuesta enviada",
      timer: 1200,
      showConfirmButton: false,
    });
    hidePrestatariosModal();
    await fetchItems();
  } catch (err) {
    console.error("Error enviando propuesta", err);
    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        err?.response?.data?.message ??
        err?.message ??
        "Error enviando propuesta",
    });
  }
}

/* ---------- PERFIL PRESTATARIO ---------- */
async function viewPrestatarioProfile(p) {
  try {
    profileLoading.value = true;
    prestatarioProfile.value = null;
    const hasFullInfo =
      p && (p.transportes || p.ayudantes || p.cargasEspeciales || p.licencia);
    if (hasFullInfo && p.id && !p._needsFetch) {
      prestatarioProfile.value = p;
    } else {
      const id = p.id || p.prestatarioId;
      if (!id) throw new Error("No se encontró id del prestatario");
      const res = await api.get(`/prestatario/${id}`);
      prestatarioProfile.value = res.data?.data ?? res.data;
    }
    getModalInstance(prestatarioProfileModalRef)?.show();
  } catch (err) {
    console.error("Error cargando perfil del prestatario:", err);
    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        err?.response?.data?.message ??
        err?.message ??
        "Error al cargar perfil",
    });
  } finally {
    profileLoading.value = false;
  }
}
function hidePrestatarioProfileModal() {
  getModalInstance(prestatarioProfileModalRef)?.hide();
}

/* ---------- VEHICLE ---------- */
function openVehicleModal(pet) {
  selectedPet.value = pet;
  vehicleLoading.value = false;
  getModalInstance(vehicleModalRef)?.show();
}
function hideVehicleModal() {
  getModalInstance(vehicleModalRef)?.hide();
}
function vehicleField(key) {
  if (!selectedPet.value || !selectedPet.value.assignedProposal) return "-";
  const v = selectedPet.value.assignedProposal.assignedVehicle || {};
  return (
    v[key] ?? v[key.replace(/[A-Z]/g, (m) => "_" + m.toLowerCase())] ?? "-"
  );
}
async function acceptAgreement() {
  if (!selectedPet.value || !selectedPet.value.assignedProposal) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No hay proposal asignada",
    });
    return;
  }
  const proposalId = selectedPet.value.assignedProposal.id;
  try {
    await api.post(`/petitions/${selectedPet.value.id}/assign`, { proposalId });
    Swal.fire({
      icon: "success",
      title: "OK",
      text: "Asignación aceptada",
      timer: 1200,
      showConfirmButton: false,
    });
    hideVehicleModal();
    await fetchItems();
  } catch (err) {
    console.error("Error aceptando asignación", err);
    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        err?.response?.data?.message ??
        err?.message ??
        "Error aceptando asignación",
    });
  }
}
function rejectAgreement() {
  Swal.fire({ icon: "info", title: "Info", text: "Asignación rechazada" });
  hideVehicleModal();
}

/* ---------- DELETE PETICION ---------- */
async function deletePeticion(id) {
  const res = await Swal.fire({
    title: "Eliminar petición",
    text: "¿Estás seguro que deseas eliminar esta petición? Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
  });
  if (!res.isConfirmed) return;
  try {
    await api.delete(`/petitions/${id}`);
    Swal.fire({
      icon: "success",
      title: "OK",
      text: "Petición eliminada",
      timer: 1200,
      showConfirmButton: false,
    });
    await fetchItems();
  } catch (err) {
    console.error("Error eliminando petición", err);
    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        err?.response?.data?.message ??
        err?.message ??
        "Error eliminando petición",
    });
  }
}

/* ========== EDIT PETICION ========= */
function openEditPeticionModal(pet) {
  currentEditId.value = pet.id;
  editForm.nombreEntidad = pet.nombreEntidad ?? "";
  editForm.nombreCarga = pet.nombreCarga ?? "";
  editForm.peso = pet.peso != null ? Number(pet.peso) : null;
  editForm.volumen = pet.volumen != null ? Number(pet.volumen) : null;
  editForm.origen = pet.origen ?? pet.origen_string ?? "";
  editForm.destino = pet.destino ?? pet.destino_string ?? "";
  editForm.tipoCarga = pet.tipoCarga ?? pet.tipo_carga ?? "";

  Promise.all([
    origenStore.fetchOrigens?.() ?? Promise.resolve(),
    destinoStore.fetchDestinos?.() ?? Promise.resolve(),
  ])
    .then(() => getModalInstance(editPeticionModalRef)?.show())
    .catch(() => getModalInstance(editPeticionModalRef)?.show());
}

function hideEditPeticionModal() {
  getModalInstance(editPeticionModalRef)?.hide();
  currentEditId.value = null;
  editSubmitting.value = false;
}

function validateEdit() {
  if (
    !editForm.nombreEntidad ||
    !editForm.nombreCarga ||
    !editForm.peso ||
    !editForm.origen ||
    !editForm.destino ||
    !editForm.tipoCarga
  ) {
    Swal.fire({
      icon: "warning",
      title: "Validación",
      text: "Por favor completa los campos requeridos",
    });
    return false;
  }
  return true;
}

/* small helper: promise race with timeout (ms) */
function withTimeout(promise, ms = 25000) {
  return Promise.race([
    promise,
    new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms)),
  ]);
}

async function submitEdit() {
  if (!validateEdit()) return;
  if (!currentEditId.value) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "ID de petición no disponible",
    });
    return;
  }

  editSubmitting.value = true;
  try {
    const payload = {
      nombreEntidad: editForm.nombreEntidad,
      nombreCarga: editForm.nombreCarga,
      peso: editForm.peso,
      volumen: editForm.volumen,
      origen: editForm.origen,
      destino: editForm.destino,
      tipoCarga: editForm.tipoCarga,
    };

    console.log("Payload enviado:", payload);
    // hacemos PATCH y le aplicamos timeout para evitar spinner bloqueado
    console.log(
      "Iniciando solicitud PATCH currentEditId:",
      currentEditId.value,
    );

    const req = api.patch(`/petitions/${currentEditId.value}`, payload);
    console.log("req", req);

    await withTimeout(req, 25000);

    Swal.fire({
      icon: "success",
      title: "OK",
      text: "Petición actualizada",
      timer: 1200,
      showConfirmButton: false,
    });
    hideEditPeticionModal();
    await fetchItems();
  } catch (err) {
    console.error("Error actualizando petición", err);
    const text =
      err?.response?.data?.message ??
      err?.message ??
      (err?.message === "timeout"
        ? "Tiempo de espera agotado"
        : "Error actualizando petición");
    Swal.fire({
      icon: "error",
      title: "Error",
      text,
    });
  } finally {
    // garantizar limpieza del spinner siempre
    editSubmitting.value = false;
  }
}

/* lifecycle */
onMounted(async () => {
  try {
    await origenStore.fetchOrigens?.();
  } catch {}
  try {
    await destinoStore.fetchDestinos?.();
  } catch {}
  fetchItems();
});
</script>

<style scoped>
.card {
  margin-bottom: 1rem;
}

/* forzar pointer en botones/acciones */
.dropdown-item,
.dropdown-toggle,
.btn.btn-sm,
.btn {
  cursor: pointer;
}

/* modal vertical centering fallback (helps when theme overrides bootstrap) */
.modal-dialog-centered {
  display: flex;
  align-items: center;
  min-height: calc(100% - 1rem);
}

/* keep modal body reasonably constrained */
.modal .modal-body {
  max-height: 60vh;
  overflow: auto;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.form-label.required::after {
  content: "*";
  color: #dc3545;
  margin-left: 0.25rem;
  font-weight: 600;
}
</style>
