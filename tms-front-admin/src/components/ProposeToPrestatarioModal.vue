<template>
  <div ref="root" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-md modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Proponer — {{ title }}</h5>
          <button type="button" class="btn-close" @click="hide" />
        </div>

        <form @submit.prevent="onSubmit">
          <div class="modal-body">
            <div class="mb-2">
              <strong>Prestatario:</strong>
              <div>{{ prestatarioName }}</div>
            </div>

            <div class="mb-3">
              <label class="form-label">Servicio</label>
              <select v-model="serviceType" class="form-select">
                <option value="alojamiento">Alojamiento</option>
                <option value="gps">GPS</option>
                <option value="talleres">Talleres</option>
                <option value="alquiler">Alquiler</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label"
                >Mensaje / Observaciones (opcional)</label
              >
              <textarea v-model="message" class="form-control" rows="3" />
            </div>

            <div v-if="solicitud">
              <div class="small text-muted">
                Enviando propuesta relacionada a la solicitud:
                <strong>{{ solicitud.id }}</strong>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-light"
              @click="hide"
              :disabled="sending"
            >
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary" :disabled="sending">
              <span
                v-if="sending"
                class="spinner-border spinner-border-sm me-2"
                role="status"
              ></span>
              Enviar propuesta
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  computed,
} from "vue";
import { Modal } from "bootstrap";
import Swal from "sweetalert2";
import * as api from "@/services/proposalsServicesApi";

export default defineComponent({
  name: "ProposeToPrestatarioModal",
  props: {
    prestatario: { type: Object, required: true },
    solicitud: { type: Object, required: false },
    defaultServiceType: { type: String, default: "alquiler" },
    title: { type: String, default: "Propuesta" },
  },
  emits: ["sent", "cancel"],
  setup(props, { emit }) {
    const root = ref<HTMLElement | null>(null);
    let bsModal: Modal | null = null;
    const message = ref("");
    const sending = ref(false);
    const serviceType = ref(props.defaultServiceType);

    watch(
      () => props.defaultServiceType,
      (v) => (serviceType.value = v),
    );

    const prestatarioName = computed(() => {
      return (
        props.prestatario?.companyName ||
        props.prestatario?.name ||
        props.prestatario?.user?.username ||
        props.prestatario?.id
      );
    });

    onMounted(() => {
      if (root.value) {
        bsModal = new Modal(root.value, { backdrop: "static" });
      }
    });

    onBeforeUnmount(() => {
      try {
        bsModal?.dispose();
      } catch (e) {}
    });

    function show() {
      bsModal?.show();
    }
    function hide() {
      bsModal?.hide();
      emit("cancel");
    }

    async function onSubmit() {
      sending.value = true;
      try {
        const payload: any = {
          prestatarioTargetId: props.prestatario.id,
          serviceType: serviceType.value,
          message: message.value || null,
        };
        let res;
        if (props.solicitud && props.solicitud.id) {
          res = await api.createProposalFromSolicitud(
            props.solicitud.id,
            payload,
          );
        } else {
          res = await api.createProposalDirect(payload);
        }
        Swal.fire({ icon: "success", text: "Propuesta enviada" });
        emit("sent", res.data?.data ?? res.data ?? res);
        hide();
      } catch (err: any) {
        console.error("Error proponiendo prestatario", err);
        Swal.fire({
          icon: "error",
          text:
            err?.response?.data?.message ??
            err?.message ??
            "Error al enviar propuesta",
        });
      } finally {
        sending.value = false;
      }
    }

    return {
      root,
      show,
      hide,
      message,
      sending,
      serviceType,
      prestatarioName,
      onSubmit,
    };
  },
});
</script>

<style scoped>
.modal-body .form-label {
  font-weight: 600;
}
</style>
