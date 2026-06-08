<template>
  <div class="card">
    <div class="card-header d-flex justify-content-between">
      <h5>Propuestas entre prestatarios</h5>
      <input v-model="q" class="form-control w-250px" placeholder="Buscar..." />
    </div>
    <div class="card-body">
      <KTDatatable :header="headers" :data="items" row-key="id">
        <template v-slot:prestatarioTarget="{ row }">
          {{
            row.prestatarioTarget?.name ||
            row.prestatarioTarget?.user?.username ||
            "-"
          }}
        </template>
        <template v-slot:proposer="{ row }">
          {{ row.proposer?.name || row.proposer?.username || "-" }}
        </template>
        <template v-slot:serviceType="{ row }">{{ row.serviceType }}</template>
        <template v-slot:status="{ row }">
          <span :class="getStatusBadgeClass(row.status)">{{ row.status }}</span>
        </template>
        <template v-slot:actions="{ row }">
          <router-link
            :to="{ name: 'proposals-services-detail', params: { id: row.id } }"
            class="btn btn-sm btn-light"
            >Ver</router-link
          >
        </template>
      </KTDatatable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { listProposals } from "@/services/proposalsServicesApi";

const q = ref("");
const items = ref<any[]>([]);
const headers = ref([
  { columnName: "Prestatario", columnLabel: "prestatarioTarget" },
  { columnName: "Proposer", columnLabel: "proposer" },
  { columnName: "Servicio", columnLabel: "serviceType" },
  { columnName: "Estado", columnLabel: "status" },
  { columnName: "Creado", columnLabel: "createdAt" },
  { columnName: "Acciones", columnLabel: "actions" },
]);

async function load() {
  try {
    const res = await listProposals();
    items.value = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
  } catch (e) {
    console.error(e);
    items.value = [];
  }
}

onMounted(load);

function getStatusBadgeClass(status) {
  return {
    badge: true,
    "badge-light-warning": status === "pending",
    "badge-light-success": status === "accepted",
    "badge-light-danger": status === "rejected",
  };
}
</script>
