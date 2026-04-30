<template>
  <form @submit.prevent="submit">
    <div class="row">
      <div class="col-md-6 mb-3">
        <label class="form-label required">Nombre o Entidad</label>
        <input v-model="form.nombreEntidad" class="form-control" required />
      </div>

      <div class="col-md-6 mb-3">
        <label class="form-label required">Nombre de la carga</label>
        <input v-model="form.nombreCarga" class="form-control" required />
      </div>
    </div>

    <div class="row">
      <div class="col-md-3 mb-3">
        <label class="form-label required">Peso (kg)</label>
        <input
          type="number"
          step="0.01"
          v-model.number="form.peso"
          class="form-control"
          required
        />
      </div>

      <div class="col-md-3 mb-3">
        <label class="form-label">Volumen (m³)</label>
        <input
          type="number"
          step="0.01"
          v-model.number="form.volumen"
          class="form-control"
        />
      </div>

      <div class="col-md-6 mb-3">
        <label class="form-label required">Tipo de carga</label>
        <select v-model="form.tipoCarga" class="form-select" required>
          <option value="">Seleccione tipo de carga</option>
          <option value="Seco">Seco</option>
          <option value="Refrigerado">Refrigerado</option>
          <option value="Carga general">Carga general</option>
        </select>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6 mb-3">
        <label class="form-label required">Modalidad de transporte</label>
        <select v-model="form.via" class="form-select" required>
          <option value="">Seleccione modalidad</option>
          <option value="aerea">Aérea</option>
          <option value="terrestre">Terrestre</option>
          <option value="maritima">Marítima</option>
          <option value="ferroviaria">Ferroviaria</option>
          <option value="multimodal">Multimodal</option>
        </select>
      </div>

      <div class="col-md-6 mb-3">
        <label class="form-label required">Origen</label>
        <select v-model="form.origen" class="form-select" required>
          <option value="">Seleccione un origen</option>
          <option v-for="o in origenes" :key="o.id" :value="o.name">
            {{ o.name }}
          </option>
        </select>
      </div>

      <div class="col-md-6 mb-3">
        <label class="form-label required">Dirección completa de origen</label>
        <textarea
          v-model="form.origenDireccion"
          class="form-control"
          rows="2"
          placeholder="Calle, número, entre calles, municipio, provincia"
          required
        />
      </div>

      <div class="col-md-6 mb-3">
        <label class="form-label required">Destino</label>
        <select v-model="form.destino" class="form-select" required>
          <option value="">Seleccione un destino</option>
          <option v-for="d in destinos" :key="d.id" :value="d.name">
            {{ d.name }}
          </option>
        </select>
      </div>

      <div class="col-md-6 mb-3">
        <label class="form-label required">Dirección completa de destino</label>
        <textarea
          v-model="form.destinoDireccion"
          class="form-control"
          rows="2"
          placeholder="Calle, número, entre calles, municipio, provincia"
          required
        />
      </div>

      <div class="col-md-12 mb-3" v-if="form.via === 'terrestre'">
        <label class="form-label required">Transportista disponible</label>
        <select v-model="form.transportistaId" class="form-select" required>
          <option value="">Seleccione un transportista</option>
          <option
            v-for="transportista in transportistasDisponibles"
            :key="transportista.id"
            :value="String(transportista.id)"
          >
            {{ transportista.nombre }} - {{ transportista.tipoServicio }}
          </option>
        </select>
      </div>
    </div>

    <div class="d-flex justify-content-end mt-3">
      <button type="button" class="btn btn-secondary me-2" @click="cancel">
        Cancelar
      </button>
      <button type="submit" class="btn btn-primary" :disabled="submitting">
        <span
          v-if="submitting"
          class="spinner-border spinner-border-sm me-2"
          role="status"
          aria-hidden="true"
        ></span>
        Crear petición
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import Swal from "sweetalert2";
import { useOrigenStore } from "@/stores/origen";
import { useDestinoStore } from "@/stores/destino";
import { useTransportistasStore } from "@/stores/transportistas";
import api from "@/services/api";

const router = useRouter();
const route = useRoute();
const origenStore = useOrigenStore();
const destinoStore = useDestinoStore();
const transportistasStore = useTransportistasStore();

const origenes = computed(() => origenStore.origenes || []);
const destinos = computed(() => destinoStore.destinoes || []);
const transportistasDisponibles = computed(() =>
  (transportistasStore.getTransportistas || []).filter(
    (t) =>
      t.estado?.toLowerCase() === "activo" &&
      (t.tipoServicio?.toLowerCase().includes("carga") ||
        t.tipoServicio?.toLowerCase().includes("terrestre")),
  ),
);

const submitting = ref(false);
const form = reactive({
  nombreEntidad: "",
  nombreCarga: "",
  peso: null,
  volumen: null,
  origen: "",
  origenDireccion: "",
  destino: "",
  destinoDireccion: "",
  tipoCarga: "",
  via: "",
  transportistaId: "",
});

onMounted(async () => {
  // cargar nomencladores si no están en memoria
  if (!origenStore.origenes || origenStore.origenes.length === 0) {
    // asume que estos métodos existen en tu store; si no, llama a la API directamente
    if (typeof origenStore.fetchOrigens === "function")
      await origenStore.fetchOrigens();
  }
  if (!destinoStore.destinoes || destinoStore.destinoes.length === 0) {
    if (typeof destinoStore.fetchDestinos === "function")
      await destinoStore.fetchDestinos();
  }

  const viaFromQuery = String(route.query.via || "").toLowerCase();
  const viasPermitidas = ["aerea", "terrestre", "maritima", "ferroviaria", "multimodal"];
  if (viasPermitidas.includes(viaFromQuery)) {
    form.via = viaFromQuery;
  }
});

/* Validación cliente mínima */
function validate() {
  if (
    !form.nombreEntidad ||
    !form.nombreCarga ||
    !form.peso ||
    !form.origen ||
    !form.origenDireccion ||
    !form.destino ||
    !form.destinoDireccion ||
    !form.tipoCarga ||
    !form.via
  ) {
    Swal.fire({
      icon: "warning",
      title: "Validación",
      text: "Completa los campos requeridos",
    });
    return false;
  }
  if (form.via === "terrestre" && !form.transportistaId) {
    Swal.fire({
      icon: "warning",
      title: "Validación",
      text: "Debe seleccionar un transportista para la modalidad terrestre",
    });
    return false;
  }
  return true;
}

async function submit() {
  if (!validate()) return;
  submitting.value = true;

  const payload = {
    nombreEntidad: form.nombreEntidad,
    nombreCarga: form.nombreCarga,
    peso: form.peso,
    volumen: form.volumen,
    origen: form.origen,
    origenDireccion: form.origenDireccion,
    destino: form.destino,
    destinoDireccion: form.destinoDireccion,
    tipoCarga: form.tipoCarga,
    via: form.via,
    transportistaId:
      form.via === "terrestre" ? form.transportistaId || null : null,
    transportistaNombre:
      form.via === "terrestre"
        ? transportistasDisponibles.value.find(
            (t) => String(t.id) === String(form.transportistaId),
          )?.nombre || null
        : null,
  };

  try {
    const res = await api.post("/petitions", payload);

    await Swal.fire({
      icon: "success",
      title: "Petición creada",
      text: "La petición se creó correctamente.",
      timer: 1400,
      showConfirmButton: false,
    });

    // redirigir a la lista de peticiones del cliente
    await router.push("/comercializacion/peticion/listpeticionesCliente");

    // NOTA: NO disparamos aquí ninguna llamada a "compatible-prestatarios".
    // Si necesitas que el listado se refresque, la vista destino debe ejecutar su propio fetchItems().
    return res.data ?? res;
  } catch (err) {
    console.error(err);
    const text = err?.response?.data?.message ?? "Error creando la petición";
    Swal.fire({ icon: "error", title: "Error", text });
    throw err;
  } finally {
    submitting.value = false;
  }
}

function cancel() {
  // simplemente volver hacia atrás. Si el formulario está en modal, el parent se encargará de cerrarlo.
  router.back();
}
</script>

<style scoped>
.form-label.required::after {
  content: "*";
  color: var(--bs-danger, #dc3545);
  margin-left: 0.25rem;
  font-weight: 600;
}
</style>
