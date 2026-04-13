<template>
  <div class="container-fluid">
    <div class="card">
      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
        <h5 class="mb-0">Solicitudes de alquiler</h5>
        <div class="d-flex gap-2">
          <input
            v-model="search"
            @input="debouncedFetch"
            class="form-control form-control-solid"
            placeholder="Buscar por solicitud id, cliente, estado..."
            style="min-width: 240px"
          />
          <select
            v-model="filters.status"
            @change="fetchProposals"
            class="form-select"
          >
            <option value="">Todos</option>
            <option value="pending">Pendientes</option>
            <option value="accepted">Aceptadas</option>
            <option value="confirmed">Confirmadas</option>
            <option value="rejected">Rechazadas</option>
            <option value="cancelled">Canceladas</option>
          </select>
          <select
            v-model.number="perPage"
            @change="onPerPageChange"
            class="form-select"
          >
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
        </div>
      </div>

      <div class="card-body">
        <div v-if="loading" class="p-4 text-center">
          <div class="spinner-border" role="status"></div>
        </div>

        <div v-else>
          <table class="table table-hover mb-0">
            <thead
              class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0"
            >
              <tr>
                <th @click="sortBy('createdAt')" style="cursor: pointer">
                  Fecha
                </th>
                <th>Solicitud ID</th>
                <th>Cliente</th>
                <th>Metros (m²)</th>
                <th>Tipo uso</th>
                <th>Estado</th>
                <th class="user-actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in proposals" :key="p.id">
                <td>{{ formatDate(p.createdAt) }}</td>
                <td>{{ p.solicitud?.id ?? "-" }}</td>
                <td>
                  {{
                    p.solicitud?.cliente?.user?.name
                      ? `${p.solicitud.cliente.user.name} ${p.solicitud.cliente.user.lastname ?? ""}`.trim()
                      : p.proposer?.name || p.proposer?.username || "-"
                  }}
                </td>
                <td>{{ p.solicitud?.metros_requeridos ?? "-" }} m²</td>
                <td>{{ p.solicitud?.tipo_uso ?? "-" }}</td>
                <td>
                  <span :class="badgeClass(p.status)">{{ p.status }}</span>
                </td>
                <td class="user-actions">
                  <button
                    class="btn btn-sm btn-primary me-1"
                    @click="openDetail(p)"
                  >
                    Ver
                  </button>

                  <!-- Prestatario: Aceptar / Rechazar (si pending) -->
                  <template v-if="isPrestatario() && p.status === 'pending'">
                    <button
                      class="btn btn-sm btn-success me-1"
                      @click="confirmAction(p, 'accepted')"
                    >
                      Aceptar
                    </button>
                    <button
                      class="btn btn-sm btn-danger"
                      @click="confirmAction(p, 'rejected')"
                    >
                      Rechazar
                    </button>
                  </template>

                  <!-- Proposer (cliente) o admin: Confirmar asignación (si accepted) -->
                  <template v-if="canConfirmAssignment(p)">
                    <button
                      class="btn btn-sm btn-primary"
                      @click="confirmAssignmentFromList(p)"
                    >
                      Confirmar asignación
                    </button>
                  </template>
                </td>
              </tr>

              <tr v-if="proposals.length === 0">
                <td colspan="7" class="text-center py-4 text-muted">
                  No hay propuestas para mostrar.
                </td>
              </tr>
            </tbody>
          </table>

          <div
            class="card-footer d-flex justify-content-between align-items-center"
          >
            <div>
              Mostrando {{ offset + 1 }} -
              {{ Math.min(offset + proposals.length, total) }} de {{ total }}
            </div>
            <div class="d-flex gap-2 align-items-center">
              <button
                class="btn btn-sm btn-light"
                :disabled="offset === 0"
                @click="prevPage"
              >
                Anterior
              </button>
              <button
                class="btn btn-sm btn-light"
                :disabled="offset + perPage >= total"
                @click="nextPage"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail modal: ahora muestra TODOS los campos principales de la solicitud -->
    <div
      class="modal fade"
      id="proposalAlqDetailModal"
      tabindex="-1"
      aria-hidden="true"
      ref="detailModalRef"
    >
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Detalle de la propuesta</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" />
          </div>

          <div class="modal-body" v-if="selectedProposal">
            <div>
              <strong>Estado:</strong>
              <span :class="badgeClass(selectedProposal.status)">{{
                selectedProposal.status
              }}</span>
            </div>

            <hr />

            <div v-if="selectedProposal.solicitud" class="mb-3">
              <h6>Solicitud — datos completos</h6>
              <div class="row">
                <div class="col-md-6">
                  <ul class="list-unstyled">
                    <li>
                      <strong>ID:</strong> {{ selectedProposal.solicitud.id }}
                    </li>
                    <li>
                      <strong>Solicitante:</strong>
                      {{ selectedProposal.solicitud.solicitante ?? "-" }}
                    </li>
                    <li>
                      <strong>Teléfono:</strong>
                      {{ selectedProposal.solicitud.telefono ?? "-" }}
                    </li>
                    <li>
                      <strong>Email:</strong>
                      {{ selectedProposal.solicitud.email ?? "-" }}
                    </li>
                    <li>
                      <strong>Empresa:</strong>
                      {{ selectedProposal.solicitud.empresa ?? "-" }}
                    </li>
                    <li>
                      <strong>Metros requeridos:</strong>
                      {{ selectedProposal.solicitud.metros_requeridos ?? "-" }}
                      m²
                    </li>
                    <li>
                      <strong>Altura (m):</strong>
                      {{ selectedProposal.solicitud.altura_m ?? "-" }} m
                    </li>
                    <li>
                      <strong>Tipo de uso:</strong>
                      {{ selectedProposal.solicitud.tipo_uso ?? "-" }}
                    </li>
                  </ul>
                </div>

                <div class="col-md-6">
                  <ul class="list-unstyled">
                    <li>
                      <strong>Fecha inicio:</strong>
                      {{ selectedProposal.solicitud.fecha_inicio ?? "-" }}
                    </li>
                    <li>
                      <strong>Duración:</strong>
                      {{ selectedProposal.solicitud.duracion ?? "-" }}
                    </li>
                    <li>
                      <strong>Acceso/Horario:</strong>
                      {{ selectedProposal.solicitud.acceso_horario ?? "-" }}
                    </li>
                    <li>
                      <strong>Control temperatura:</strong>
                      {{
                        selectedProposal.solicitud.control_temperatura ?? "-"
                      }}
                    </li>
                    <li>
                      <strong>Frecuencia:</strong>
                      {{ selectedProposal.solicitud.frecuencia ?? "-" }}
                    </li>
                    <li>
                      <strong>Clasificación mercancia:</strong>
                      {{
                        selectedProposal.solicitud.clasificacion_mercancia ??
                        "-"
                      }}
                    </li>
                    <li>
                      <strong>Comprobantes:</strong>
                      <span
                        v-if="
                          Array.isArray(
                            selectedProposal.solicitud.comprobantes,
                          ) && selectedProposal.solicitud.comprobantes.length
                        "
                      >
                        <div class="d-flex flex-wrap gap-2 mt-2">
                          <div
                            v-for="(img, idx) in selectedProposal.solicitud
                              .comprobantes"
                            :key="idx"
                            class="card border-0 shadow-sm"
                            style="width: 140px"
                          >
                            <div style="height: 90px; overflow: hidden">
                              <img
                                :src="img"
                                class="img-fluid w-100 h-100"
                                style="object-fit: cover"
                              />
                            </div>
                            <div class="card-body p-2 text-center">
                              <small class="text-muted"
                                >Comprobante {{ idx + 1 }}</small
                              >
                            </div>
                          </div>
                        </div>
                      </span>
                      <span v-else>-</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="mt-3">
                <strong>Servicios:</strong>
                <div class="small text-muted">
                  <span
                    v-if="
                      Array.isArray(selectedProposal.solicitud.servicios) &&
                      selectedProposal.solicitud.servicios.length
                    "
                  >
                    {{ selectedProposal.solicitud.servicios.join(", ") }}
                  </span>
                  <span v-else>{{
                    selectedProposal.solicitud.servicios ?? "-"
                  }}</span>
                </div>
              </div>

              <div class="mt-3">
                <strong>Comentarios / Observaciones:</strong>
                <p class="small">
                  {{ selectedProposal.solicitud.comentarios ?? "-" }}
                </p>
              </div>
            </div>

            <hr />

            <div>
              <h6>Proposer / Cliente</h6>
              <ul class="list-unstyled">
                <li>
                  <strong>Nombre:</strong>
                  {{
                    selectedProposal.proposer?.name ??
                    selectedProposal.proposer?.username ??
                    "-"
                  }}
                </li>
                <li>
                  <strong>Email:</strong>
                  {{ selectedProposal.proposer?.email ?? "-" }}
                </li>
                <li>
                  <strong>Teléfono:</strong>
                  {{ selectedProposal.proposer?.phone ?? "-" }}
                </li>
                <li>
                  <strong>Mensaje / Notas de la propuesta:</strong>
                  <div class="small mt-1">
                    {{ selectedProposal.message ?? "-" }}
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div class="modal-footer">
            <!-- Prestatario: aceptar/rechazar -->
            <template
              v-if="
                selectedProposal &&
                isPrestatario() &&
                selectedProposal.status === 'pending'
              "
            >
              <button
                class="btn btn-success"
                @click="confirmAction(selectedProposal, 'accepted')"
              >
                Aceptar
              </button>
              <button
                class="btn btn-danger"
                @click="confirmAction(selectedProposal, 'rejected')"
              >
                Rechazar
              </button>
            </template>

            <!-- Proposer/Admin: confirmar asignación si está accepted -->
            <template
              v-if="selectedProposal && canConfirmAssignment(selectedProposal)"
            >
              <button
                class="btn btn-primary"
                v-if="selectedProposal.status === 'accepted'"
                @click="confirmAssignmentFromList(selectedProposal)"
              >
                Confirmar asignación
              </button>
            </template>

            <button type="button" class="btn btn-light" data-bs-dismiss="modal">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick } from "vue";
import api from "@/services/api";
import Swal from "sweetalert2";
import debounce from "lodash/debounce";
import { Modal } from "bootstrap";
import { useAuthStore } from "@/stores/auth";
import { useCookies } from "vue3-cookies";

export default defineComponent({
  name: "ListProposalsAlquiler",
  setup() {
    const auth = useAuthStore();
    const { cookies } = useCookies();

    const proposals = ref<any[]>([]);
    const total = ref(0);
    const loading = ref(false);
    const perPage = ref(25);
    const offset = ref(0);
    const search = ref("");
    const sort = ref({ field: "createdAt", order: "desc" as "asc" | "desc" });
    const filters = ref({ status: "" });
    const selectedProposal = ref<any | null>(null);
    const detailModalRef = ref<HTMLElement | null>(null);
    const cookieUser = ref<any>(null);

    // fetch proposals (server should include solicitud relations)
    const fetchProposals = async () => {
      try {
        loading.value = true;
        const params: any = { limit: perPage.value, offset: offset.value };
        if (filters.value.status) params.status = filters.value.status;
        if (search.value) params.search = search.value;
        if (sort.value.field) {
          params.sortField = sort.value.field;
          params.sortOrder = sort.value.order;
        }
        const res = await api.get("/proposals_alquiler", { params });
        const data = Array.isArray(res.data)
          ? res.data
          : (res.data?.data ?? res.data?.items ?? res.data);
        proposals.value = data || [];
        total.value = res.data?.total ?? proposals.value.length;
      } catch (err: any) {
        console.error("Error fetching proposals_alquiler", err);
        Swal.fire(
          "Error",
          err?.response?.data?.message ||
            err.message ||
            "No se pudieron cargar propuestas",
          "error",
        );
      } finally {
        loading.value = false;
      }
    };

    const debouncedFetch = debounce(() => {
      offset.value = 0;
      fetchProposals();
    }, 400);

    onMounted(() => {
      fetchProposals();
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
    });

    function formatDate(s?: string) {
      if (!s) return "-";
      return new Date(s).toLocaleString();
    }

    function badgeClass(status?: string) {
      switch (status) {
        case "pending":
          return "badge bg-warning text-dark";
        case "accepted":
          return "badge bg-info text-dark";
        case "confirmed":
          return "badge bg-primary text-white";
        case "rejected":
          return "badge bg-danger";
        case "cancelled":
          return "badge bg-secondary";
        default:
          return "badge bg-light text-dark";
      }
    }

    function sortBy(field: string) {
      if (sort.value.field === field) {
        sort.value.order = sort.value.order === "asc" ? "desc" : "asc";
      } else {
        sort.value.field = field;
        sort.value.order = "asc";
      }
      fetchProposals();
    }

    // Robust role + id helpers (store + cookie fallback)
    const roleNameFromStoreOrCookie = () => {
      const r =
        auth.user?.role?.name ??
        cookieUser.value?.role?.name ??
        cookieUser.value?.role ??
        "";
      return String(r).toLowerCase();
    };
    const loggedUserId = () =>
      auth.user?.id ??
      cookieUser.value?.id ??
      cookieUser.value?.user?.id ??
      null;

    function isPrestatario() {
      return roleNameFromStoreOrCookie() === "prestatario";
    }

    function canConfirmAssignment(p: any) {
      if (!p) return false;
      if (p.status !== "accepted") return false;
      const rn = roleNameFromStoreOrCookie();
      if (rn === "administrador" || rn === "admin") return true;
      const proposerId =
        p.proposer?.id ?? (p.proposer as any)?.user?.id ?? null;
      const me = loggedUserId();
      return me && proposerId && String(me) === String(proposerId);
    }

    // reemplaza la función confirmAction existente por esta
    async function confirmAction(p: any, action: "accepted" | "rejected") {
      const ok = await Swal.fire({
        title:
          action === "accepted" ? "Aceptar propuesta?" : "Rechazar propuesta?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: action === "accepted" ? "Aceptar" : "Rechazar",
      });
      if (!ok.isConfirmed) return;

      let msg: string | undefined;
      if (action === "rejected") {
        const { value } = await Swal.fire({
          title: "Motivo (opcional)",
          input: "textarea",
          showCancelButton: true,
        });
        msg = value;
      }

      try {
        // mapear action a la ruta real del backend
        const map: Record<string, string> = {
          accepted: "accept",
          rejected: "reject",
        };
        const endpoint = map[action];

        // Si tu backend espera body con message usa { message: msg } (si no, manda {})
        const body = msg ? { message: msg } : {};

        await api.post(`/proposals_alquiler/${p.id}/${endpoint}`, body);

        await fetchProposals();
        await Swal.fire("Ok", `Propuesta ${action}`, "success");

        if (selectedProposal.value?.id === p.id) {
          const el = document.getElementById("proposalAlqDetailModal");
          if (el) Modal.getInstance(el as Element)?.hide();
          selectedProposal.value = null;
        }
      } catch (err: any) {
        console.error("Error updating proposal status", err);
        Swal.fire(
          "Error",
          err?.response?.data?.message ||
            err.message ||
            "No se pudo actualizar",
          "error",
        );
      }
    }

    async function confirmAssignmentFromList(p: any) {
      const confirm = await Swal.fire({
        title: "Confirmar asignación",
        text: "¿Confirmas la asignación de la solicitud al prestatario?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Confirmar",
      });
      if (!confirm.isConfirmed) return;
      try {
        await api.post(`/proposals_alquiler/${p.id}/confirm`);
        await fetchProposals();
        Swal.fire("Ok", "Asignación confirmada", "success");
      } catch (err: any) {
        console.error("Error confirming assignment", err);
        Swal.fire(
          "Error",
          err?.response?.data?.message || err.message || "No se pudo confirmar",
          "error",
        );
      }
    }

    async function openDetail(p: any) {
      // Si el backend devuelve la propuesta con relaciones limitadas,
      // intenta fetch del detalle para garantizar datos completos.
      try {
        if (!p.solicitud || !p.solicitud.id) {
          // fallback: fetch proposal detail
          const res = await api.get(`/proposals_alquiler/${p.id}`);
          selectedProposal.value = res.data?.data ?? res.data;
        } else {
          // prefer fetch as well to ensure full nested relaciones si backend no las incluyó
          try {
            const res = await api.get(`/proposals_alquiler/${p.id}`);
            selectedProposal.value = res.data?.data ?? res.data;
          } catch {
            selectedProposal.value = p;
          }
        }
      } catch (e) {
        selectedProposal.value = p;
      }

      await nextTick();
      const el = document.getElementById(
        "proposalAlqDetailModal",
      ) as HTMLElement | null;
      if (!el) return;
      try {
        let inst = Modal.getInstance(el);
        if (!inst) inst = new Modal(el);
        inst.show();
      } catch (e) {
        new Modal(el).show();
      }
    }

    function prevPage() {
      offset.value = Math.max(0, offset.value - perPage.value);
      fetchProposals();
    }
    function nextPage() {
      if (offset.value + perPage.value < total.value) {
        offset.value += perPage.value;
        fetchProposals();
      }
    }
    function onPerPageChange() {
      offset.value = 0;
      fetchProposals();
    }

    return {
      proposals,
      total,
      loading,
      perPage,
      offset,
      search,
      filters,
      formatDate,
      badgeClass,
      fetchProposals,
      sortBy,
      prevPage,
      nextPage,
      openDetail,
      selectedProposal,
      confirmAction,
      canConfirmAssignment,
      isPrestatario,
      debouncedFetch,
      onPerPageChange,
      confirmAssignmentFromList,
    };
  },
});
</script>

<style scoped>
.user-actions > button {
  margin-bottom: 4px;
}
.card .img-thumb {
  width: 120px;
  height: 90px;
  object-fit: cover;
}
</style>
