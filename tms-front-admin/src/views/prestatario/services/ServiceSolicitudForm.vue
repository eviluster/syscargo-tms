<template>
  <div class="card">
    <div class="card-header">
      <h5 class="mb-0">
        {{
          isEditMode
            ? `Editar ${config.title} - Solicitud`
            : `Crear ${config.title} - Solicitud`
        }}
      </h5>
    </div>
    <div class="card-body">
      <form @submit.prevent="onSubmit">
        <div class="row g-3">
          <!-- Renderizamos campos (comunes + específicos) -->
          <div
            v-for="field in combinedFormFields"
            :key="field.name"
            :class="fieldColClass"
          >
            <label class="form-label">
              {{ field.label }}
              <span v-if="field.required" class="text-danger">*</span>
            </label>

            <input
              v-if="field.type === 'text'"
              type="text"
              class="form-control"
              v-model="form[field.name]"
              :placeholder="field.placeholder"
            />

            <input
              v-else-if="field.type === 'number'"
              type="number"
              class="form-control"
              v-model.number="form[field.name]"
              :placeholder="field.placeholder"
            />

            <select
              v-else-if="field.type === 'select'"
              class="form-select"
              v-model="form[field.name]"
              :multiple="field.multiple ?? false"
            >
              <option v-if="!field.multiple" value="" disabled>
                Selecciona...
              </option>
              <option
                v-for="opt in field.options || []"
                :key="opt"
                :value="opt"
              >
                {{ opt }}
              </option>
            </select>

            <input
              v-else-if="field.type === 'date'"
              type="date"
              class="form-control"
              v-model="form[field.name]"
            />

            <textarea
              v-else-if="field.type === 'textarea'"
              class="form-control"
              v-model="form[field.name]"
            ></textarea>

            <div
              class="invalid-feedback d-block"
              v-if="submitted && field.required && !hasValue(form[field.name])"
            >
              Requerido
            </div>
          </div>

          <div class="col-12 d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-light" @click="cancel">
              Cancelar
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isSubmitting"
            >
              {{ isEditMode ? "Guardar" : "Crear" }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/api";
import { useCookies } from "vue3-cookies";
import Swal from "sweetalert2";
import { SERVICES } from "./config/services.config";

const props = defineProps<{
  serviceKey: string;
  mode?: "create" | "edit";
  initialData?: Record<string, any> | null;
  creatorPrestatarioId?: string | null;
}>();

const router = useRouter();
const { cookies } = useCookies();

const serviceKey = computed(() => (props.serviceKey ?? "alquiler").toString());
const config = computed(
  () => SERVICES[serviceKey.value] ?? SERVICES["alquiler"],
);

/**
 * Campos comunes
 */
const COMMON_FIELDS = [
  { name: "solicitante", label: "Solicitante", type: "text", required: true },
  { name: "telefono", label: "Teléfono", type: "text", required: true },
  {
    name: "email",
    label: "Email",
    type: "text",
    required: true,
    placeholder: "correo@ejemplo.com",
  },
  { name: "empresa", label: "Empresa", type: "text", required: false },
];

const combinedFormFields = computed(() => {
  const cfgNames = new Set(
    (config.value.formFields || []).map((f: any) => f.name),
  );
  const merged = [
    ...COMMON_FIELDS.filter((f) => !cfgNames.has(f.name)),
    ...(config.value.formFields || []),
  ];
  // si no existe campo fecha_fin y el servicio define fechas, se asegura en config
  return merged;
});

const form = ref<Record<string, any>>({});
const submitted = ref(false);
const isSubmitting = ref(false);

const fieldColClass = "col-md-6";
const isEditMode = computed(() => props.mode === "edit" || !!props.initialData);

/* helpers */
function hasValue(v: any) {
  if (v === null || v === undefined) return false;
  if (typeof v === "string" && v.trim() === "") return false;
  return true;
}

function isoDateFromValue(v: any) {
  if (!v && v !== 0) return "";
  if (typeof v === "string") {
    // si viene 'YYYY-MM-DDTHH:..' o 'YYYY-MM-DD' o '9/2/2026, 10:31:21' -> intentar normalizar
    // preferimos formato ISO date 'YYYY-MM-DD' para input[type=date]
    // si tiene 'T' -> toma substring
    if (v.includes("T")) return v.split("T")[0];
    // si es ISO con espacio/time -> intentar Date parse
    const d = new Date(v);
    if (!isNaN(d.getTime())) return d.toISOString().split("T")[0];
    // si viene en local '9/2/2026, ...' Date parse también
    const d2 = new Date(v);
    if (!isNaN(d2.getTime())) return d2.toISOString().split("T")[0];
    // fallback: if it's already 'YYYY-MM-DD' return
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
    return v;
  } else if (v instanceof Date) {
    return v.toISOString().split("T")[0];
  } else {
    return String(v);
  }
}

function initFormFromConfig() {
  const f: Record<string, any> = {};
  (combinedFormFields.value || []).forEach((fld: any) => {
    if (fld.type === "number") f[fld.name] = null;
    else f[fld.name] = "";
  });
  // campos adicionales comunes
  [
    "duracion",
    "acceso_horario",
    "comentarios",
    "serviceRequested",
    "fecha_inicio",
    "fecha_fin",
  ].forEach((k) => {
    if (!(k in f)) f[k] = "";
  });
  form.value = f;
}

function populateFormFromInitialData() {
  if (!props.initialData) return;
  // preferir el objeto crudo si existe (normalizeRow guarda __raw)
  const src = (props.initialData as any).__raw ?? props.initialData ?? {};
  for (const fld of combinedFormFields.value) {
    const name = fld.name;
    if (Object.prototype.hasOwnProperty.call(src, name)) {
      const val = src[name];
      if (fld.type === "number") {
        const n = Number(val);
        form.value[name] = Number.isNaN(n) ? null : n;
      } else if (fld.type === "date") {
        form.value[name] = isoDateFromValue(val);
      } else {
        form.value[name] = val ?? "";
      }
    }
  }

  // extras
  const extras = [
    "solicitante",
    "telefono",
    "email",
    "empresa",
    "fecha_inicio",
    "fecha_fin",
    "duracion",
    "acceso_horario",
    "comentarios",
    "serviceRequested",
    "habitaciones_requeridas",
    "personas",
    "device_count",
    "plan",
    "vehiculo_marca",
    "vehiculo_placa",
  ];
  for (const k of extras) {
    if (k in src) {
      const v = src[k];
      if (k.includes("fecha")) form.value[k] = isoDateFromValue(v);
      else form.value[k] = v ?? form.value[k];
    }
  }
}

async function getPrestatarioIdFromCookie() {
  const raw = cookies.get("userData");
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
    return (res?.data?.data ?? res?.data ?? res)?.id ?? null;
  } catch (e) {
    return null;
  }
}

function cleanPayload(raw: Record<string, any>) {
  const p: Record<string, any> = {};
  for (const k of Object.keys(raw)) {
    const v = raw[k];
    if (v === "" || v === null || v === undefined) continue;
    // fecha normalization: keep 'YYYY-MM-DD'
    const isDateField =
      k.toLowerCase().includes("fecha") ||
      combinedFormFields.value.find((f: any) => f.name === k)?.type === "date";
    if (isDateField) {
      if (typeof v === "string" && v.includes("T")) p[k] = v.split("T")[0];
      else if (v instanceof Date) p[k] = v.toISOString().split("T")[0];
      else p[k] = String(v);
      continue;
    }
    p[k] = v;
  }
  if (!p.serviceRequested) p.serviceRequested = serviceKey.value;
  return p;
}

async function onSubmit() {
  submitted.value = true;
  for (const fld of combinedFormFields.value) {
    if (fld.required && !hasValue(form.value[fld.name])) {
      Swal.fire("Atención", `Campo ${fld.label} requerido`, "warning");
      return;
    }
  }

  try {
    isSubmitting.value = true;
    const prestatarioId =
      props.creatorPrestatarioId ?? (await getPrestatarioIdFromCookie());
    const rawPayload: any = { ...form.value };
    const payload = cleanPayload(rawPayload);
    if (prestatarioId) payload.createdByPrestatarioId = prestatarioId;

    if (!payload.solicitante || !payload.telefono || !payload.email) {
      Swal.fire(
        "Atención",
        "Faltan campos obligatorios: solicitante, telefono o email",
        "warning",
      );
      return;
    }

    console.log("Creating solicitud with payload: ", payload);

    if (isEditMode.value && props.initialData?.id) {
      await api.put(`/solicitudes/${props.initialData.id}`, payload);
      await Swal.fire({ text: "Solicitud actualizada", icon: "success" });
    } else {
      await api.post(config.value.endpoints.createSolicitud, payload);
      await Swal.fire({ text: "Solicitud creada", icon: "success" });
    }

    router.push({
      name: "PrestatarioServiceSolicitudes",
      params: { serviceKey: serviceKey.value },
    });
  } catch (e: any) {
    console.error("create/update solicitud", e);
    let msg: string | null = null;
    const apiMsg =
      e?.response?.data?.message ?? e?.response?.data ?? e?.message ?? null;
    if (Array.isArray(apiMsg)) msg = apiMsg.join("<br/>");
    else if (typeof apiMsg === "string") msg = apiMsg;
    else if (typeof apiMsg === "object" && apiMsg !== null) {
      if (apiMsg.message && Array.isArray(apiMsg.message))
        msg = apiMsg.message.join("<br/>");
      else msg = JSON.stringify(apiMsg);
    } else msg = "Error desconocido";

    await Swal.fire({ title: "Error", html: msg, icon: "error" });
  } finally {
    isSubmitting.value = false;
  }
}

function cancel() {
  router.back();
}

/* watchers */
watch(
  () => props.serviceKey,
  () => {
    initFormFromConfig();
    if (props.initialData) populateFormFromInitialData();
  },
  { immediate: true },
);

watch(
  () => props.initialData,
  (n) => {
    if (n) populateFormFromInitialData();
  },
  { immediate: true },
);

onMounted(() => {
  initFormFromConfig();
  if (props.initialData) populateFormFromInitialData();
});
</script>

<style scoped>
.card {
  margin-top: 1rem;
}
</style>
