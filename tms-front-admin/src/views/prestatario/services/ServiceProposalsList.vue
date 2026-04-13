<template>
  <div class="container-fluid">
    <div class="card">
      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
        <h5 class="mb-0">
          {{ activeConfig.title ?? "Propuestas" }} - Propuestas para mí
        </h5>
      </div>

      <div class="card-body">
        <div v-if="loading" class="text-center p-4">
          <div class="spinner-border"></div>
        </div>

        <div v-else>
          <KTDatatable
            :key="datatableKey"
            :header="proposalHeader"
            :data="rows"
            row-key="id"
            v-model:selectedItems="selectedIds"
          >
            <template v-slot:estado="{ row }">
              <span :class="badgeClass(row.status)">{{ row.status }}</span>
            </template>

            <template v-slot:createdAt="{ row }">{{
              formatDate(row.createdAt)
            }}</template>

            <template v-slot:actions="{ row }">
              <div class="d-flex gap-2 justify-content-end">
                <button class="btn btn-sm btn-light" @click="openDetail(row)">
                  Ver
                </button>
                <button
                  v-if="row.status === 'pending'"
                  class="btn btn-sm btn-success"
                  @click="setStatus(row, 'accepted')"
                >
                  Aceptar
                </button>
                <button
                  v-if="row.status === 'pending'"
                  class="btn btn-sm btn-danger"
                  @click="setStatus(row, 'rejected')"
                >
                  Rechazar
                </button>
              </div>
            </template>
          </KTDatatable>

          <div
            v-if="!rows.length && !loading"
            class="text-center text-muted mt-3"
          >
            No hay propuestas para este servicio.
          </div>
        </div>
      </div>
    </div>

    <!-- detail modal simple -->
    <div
      class="modal fade"
      id="proposalDetail"
      tabindex="-1"
      aria-hidden="true"
      ref="detailEl"
    >
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Detalle propuesta</h5>
            <button class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" v-if="selected">
            <pre>{{ selected }}</pre>
          </div>
          <div class="modal-footer">
            <button class="btn btn-light" data-bs-dismiss="modal">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, toRef } from "vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import api from "@/services/api";
import { useCookies } from "vue3-cookies";
import Swal from "sweetalert2";
import { SERVICES } from "./config/services.config";

const props = defineProps<{ serviceKey?: string }>();
const propServiceKey = toRef(props, "serviceKey");

const loading = ref(false);
const rows = ref<any[]>([]);
const selected = ref<any | null>(null);
const selectedIds = ref<string[]>([]);

// computed config (reactive to prop changes)
const activeConfig = computed(() => {
  const key = propServiceKey.value ?? "";
  return (
    SERVICES[key] ?? {
      title: key || "Servicio",
      endpoints: { listProposals: "/proposals_services" },
      serviceType: key || undefined,
    }
  );
});

// key to force-destroy / recreate datatable when service changes
const datatableKey = computed(
  () => `proposals-dt-${propServiceKey.value ?? "default"}`,
);

const proposalHeader = computed(() => [
  { columnName: "Fecha", columnLabel: "createdAt" },
  { columnName: "Estado", columnLabel: "estado" },
  { columnName: "Acciones", columnLabel: "actions" },
]);

function formatDate(s?: string) {
  if (!s) return "-";
  return new Date(s).toLocaleString();
}
function badgeClass(status?: string) {
  switch (status) {
    case "pending":
      return "badge bg-warning text-dark";
    case "accepted":
      return "badge bg-info";
    case "confirmed":
      return "badge bg-primary text-white";
    case "rejected":
      return "badge bg-danger";
    default:
      return "badge bg-light text-dark";
  }
}

async function loadPrestatarioByCookie() {
  const raw = useCookies().cookies.get("userData");
  let parsed: any = raw;
  try {
    if (typeof parsed === "string") parsed = JSON.parse(parsed);
  } catch (e) {}
  const userId = parsed?.userID ?? parsed?.id ?? parsed?.user?.id ?? null;
  if (!userId) return null;
  try {
    const res = await api.get(
      `/prestatario/user/${encodeURIComponent(String(userId))}`,
    );
    return (res?.data?.data ?? res?.data ?? res) || null;
  } catch (e) {
    return null;
  }
}

async function fetchProposals() {
  try {
    loading.value = true;
    rows.value = []; // limpiar antes de cargar
    selected.value = null;
    selectedIds.value = [];

    const p = await loadPrestatarioByCookie();
    const prestatarioId = p?.id ?? null;

    // endpoint definido en config o fallback al generic 'proposals_services'
    const endpoint =
      activeConfig.value.endpoints?.listProposals ?? "/proposals_services";

    // use serviceType param name expected by backend
    const serviceType = activeConfig.value.serviceType ?? propServiceKey.value;
    const params: any = {};
    if (serviceType) params.serviceType = serviceType;
    if (prestatarioId) params.prestatarioId = prestatarioId;

    const res = await api.get(endpoint, { params });
    const data = Array.isArray(res.data)
      ? res.data
      : (res.data?.data ?? res.data);
    console.log("fetchProposals response:", data);
    rows.value = Array.isArray(data) ? data : [];
    console.log("fetchProposals rows.value:", rows.value);
  } catch (e: any) {
    console.error("fetchProposals", e);
    Swal.fire(
      "Error al cargar propuestas",
      e?.response?.data?.message ?? e?.message ?? "",
    );
  } finally {
    loading.value = false;
  }
}

function openDetail(row: any) {
  selected.value = row;
  const el = document.getElementById("proposalDetail");
  if (el) (window as any).bootstrap.Modal.getOrCreateInstance(el).show();
}

async function setStatus(row: any, status: "accepted" | "rejected") {
  try {
    // usar la ruta que implementa el backend
    await api.put(`/proposals_services/${row.id}/status`, { status });
    await fetchProposals();
    Swal.fire("Ok", "Estado actualizado", "success");
  } catch (e: any) {
    Swal.fire("Error", e?.response?.data?.message ?? e?.message ?? "");
  }
}

// recarga inicial y cuando cambie serviceKey
onMounted(fetchProposals);
watch(propServiceKey, async () => {
  // cuando cambia serviceKey forzamos recarga y reset
  rows.value = [];
  selected.value = null;
  selectedIds.value = [];
  await fetchProposals();
});
</script>

<style scoped>
.card {
  margin-top: 1rem;
}
</style>
