<template>
  <div class="card">
    <div class="card-header d-flex justify-content-between">
      <h5>Proposal {{ item?.id }}</h5>
      <div>
        <button
          v-if="canAccept"
          class="btn btn-success btn-sm me-2"
          @click="setStatus('accepted')"
        >
          Aceptar
        </button>
        <button
          v-if="canReject"
          class="btn btn-danger btn-sm me-2"
          @click="setStatus('rejected')"
        >
          Rechazar
        </button>
        <button
          v-if="canCancel"
          class="btn btn-warning btn-sm"
          @click="setStatus('cancelled')"
        >
          Cancelar
        </button>
      </div>
    </div>

    <div class="card-body" v-if="item">
      <dl class="row">
        <dt class="col-sm-3">Proposer</dt>
        <dd class="col-sm-9">{{ item.proposer?.name }}</dd>
        <dt class="col-sm-3">Target</dt>
        <dd class="col-sm-9">{{ item.prestatarioTarget?.name }}</dd>
        <dt class="col-sm-3">Servicio</dt>
        <dd class="col-sm-9">{{ item.serviceType }}</dd>
        <dt class="col-sm-3">Mensaje</dt>
        <dd class="col-sm-9">{{ item.message || "-" }}</dd>
        <dt class="col-sm-3">Estado</dt>
        <dd class="col-sm-9">{{ item.status }}</dd>
      </dl>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getProposal,
  updateProposalStatus,
  confirmProposal,
} from "@/services/proposalsServicesApi";
import Swal from "sweetalert2";

const route = useRoute();
const router = useRouter();
const id = String(route.params.id || "");
const item = ref<any>(null);

async function load() {
  const res = await getProposal(id);
  item.value = res.data?.data ?? res.data;
}
onMounted(load);

function canAccept() {
  // reglas simples: si eres prestatario target y estado = pending -> puede aceptar
  // la validación real en backend
  return item.value?.status === "pending";
}
const canReject = () => {
  return ["pending"].includes(item.value.status);
};

const canCancel = () => {
  return ["pending", "accepted"].includes(item.value.status);
};

async function setStatus(newStatus) {
  try {
    await updateProposalStatus(id, { status: newStatus });
    Swal.fire({ icon: "success", text: `Status cambiado a ${newStatus}` });
    await load();
  } catch (err) {
    Swal.fire({ icon: "error", text: err?.response?.data?.message ?? "Error" });
  }
}
</script>
