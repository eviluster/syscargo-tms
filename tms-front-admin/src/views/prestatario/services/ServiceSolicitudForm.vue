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
            v-for="field in visibleFormFields"
            :key="field.name"
            :class="fieldColClass"
          >
            <label class="form-label">
              {{ field.label }}
              <span v-if="field.required" class="text-danger">*</span>
            </label>

            <!-- Checkbox para tipo boolean -->
            <div v-if="field.type === 'boolean'" class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                :id="field.name"
                v-model="form[field.name]"
                :required="field.required ?? false"
              />
              <label class="form-check-label" :for="field.name">
                {{ form[field.name] ? 'Activado' : 'Desactivado' }}
              </label>
            </div>

            <input
              v-else-if="field.type === 'text'"
              type="text"
              class="form-control"
              v-model="form[field.name]"
              :placeholder="field.placeholder"
              :readonly="field.name === 'direccion_taller_fija'"
              :disabled="field.name === 'direccion_taller_fija'"
            />

            <div v-else-if="field.type === 'number'" class="input-group">
              <span class="input-group-text">$</span>
              <input
                type="number"
                class="form-control"
                v-model.number="form[field.name]"
                :placeholder="field.placeholder"
                step="0.01"
                min="0"
              />
            </div>

            <select
              v-else-if="field.type === 'select'"
              class="form-select"
              v-model="form[field.name]"
              :multiple="field.multiple ?? false"
              @change="onTipoTrabajoChange(field)"
            >
              <option v-if="!field.multiple" value="" disabled>
                Selecciona...
              </option>
              <option
                v-for="opt in getOpcionesConPrecio(field)"
                :key="typeof opt === 'string' ? opt : opt.value"
                :value="typeof opt === 'string' ? opt : opt.value"
              >
                {{ typeof opt === 'string' ? opt : opt.label }} 
                <span v-if="typeof opt !== 'string' && opt.precio">(${{ Number(opt.precio).toFixed(2) }})</span>
              </option>
            </select>

            <input
              v-else-if="field.type === 'date'"
              type="datetime-local"
              class="form-control"
              v-model="form[field.name]"
            />

            <textarea
              v-else-if="field.type === 'textarea'"
              class="form-control"
              v-model="form[field.name]"
            ></textarea>

            <div v-if="field.helpText" class="form-text text-muted">
              {{ field.helpText }}
            </div>

            <div
              class="invalid-feedback d-block"
              v-if="submitted && field.required && !hasValue(form[field.name])"
            >
              Requerido
            </div>
          </div>

          <!-- Sección de precios configurados -->
          <div v-if="serviceKey === 'taller' && preciosTaller.length > 0" class="col-12">
            <div class="card bg-light">
              <div class="card-header">
                <h6 class="mb-0">Precios configurados para servicios del taller</h6>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-sm table-bordered">
                    <thead>
                      <tr>
                        <th>Servicio</th>
                        <th>Tipo</th>
                        <th>Precio Base</th>
                        <th>Tiempo Estimado</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="precio in preciosTaller" :key="precio.id">
                        <td>{{ precio.nombre_personalizado }}</td>
                        <td>{{ precio.tipo_servicio || 'N/A' }}</td>
                        <td>${{ Number(precio.precio_base).toFixed(2) }}</td>
                        <td>{{ precio.tiempo_estimado_minutos }} min</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
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

// Estado para precios del taller
const preciosTaller = ref<any[]>([]);
const prestatarioId = ref<string | null>(null);
const precioEstimado = ref<number>(0);

/**
 * Obtiene las opciones de un campo con precios actualizados desde el backend
 */
function getOpcionesConPrecio(field: any) {
  if (serviceKey.value !== 'taller' || field.name !== 'tipo_uso') {
    return field.options || [];
  }
  
  // Si hay precios del taller, mapear las opciones con sus precios
  if (preciosTaller.value.length > 0) {
    return (field.options || []).map((opt: any) => {
      const valorOpt = typeof opt === 'string' ? opt : opt.value;
      // Buscar si existe un servicio del taller que coincida con el tipo de trabajo
      const servicioTaller = preciosTaller.value.find(
        s => s.tipo_servicio?.toLowerCase() === valorOpt.toLowerCase() ||
             s.nombre_personalizado?.toLowerCase() === valorOpt.toLowerCase()
      );
      
      if (servicioTaller) {
        return {
          ...opt,
          label: typeof opt === 'string' ? opt : (opt.label || opt.value),
          precio: servicioTaller.precio_base
        };
      }
      
      return {
        ...opt,
        label: typeof opt === 'string' ? opt : (opt.label || opt.value),
        precio: opt.price || 0
      };
    });
  }
  
  return field.options || [];
}

/**
 * Maneja el cambio en el campo tipo_uso para actualizar el precio estimado
 */
function onTipoTrabajoChange(field: any) {
  if (field.name !== 'tipo_uso' || serviceKey.value !== 'taller') {
    return;
  }
  
  const valorSeleccionado = form.value[field.name];
  if (!valorSeleccionado) {
    precioEstimado.value = 0;
    return;
  }
  
  // Buscar el precio en los servicios del taller
  const servicioEncontrado = preciosTaller.value.find(
    s => s.tipo_servicio?.toLowerCase() === valorSeleccionado.toLowerCase() ||
         s.nombre_personalizado?.toLowerCase() === valorSeleccionado.toLowerCase()
  );
  
  if (servicioEncontrado) {
    precioEstimado.value = Number(servicioEncontrado.precio_base) || 0;
  } else {
    // Fallback a la opción original si no se encuentra en el backend
    const opcionOriginal = (field.options || []).find(
      (opt: any) => (typeof opt === 'string' ? opt : opt.value) === valorSeleccionado
    );
    precioEstimado.value = typeof opcionOriginal === 'object' ? (opcionOriginal.price || 0) : 0;
  }
}

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

// Campos visibles según si escatolina está activado
const visibleFormFields = computed(() => {
  const isEscatolina = form.value.es_servicio_escatolina === true;
  
  if (serviceKey.value !== 'taller') {
    return combinedFormFields.value;
  }
  
  // Para taller, filtrar campos condicionales de escatolina
  return combinedFormFields.value.filter((field: any) => {
    // Campos que siempre se muestran
    const alwaysVisible = [
      'tipo_uso', 'es_servicio_escatolina', 'fecha_hora_inicio',
      'direccion_taller_fija', 'vehiculo_marca', 'vehiculo_placa', 'comentarios'
    ];
    
    if (alwaysVisible.includes(field.name)) {
      return true;
    }
    
    // Campos de escatolina solo se muestran si está activado
    const escatolinaFields = [
      'origen_id', 'destino_id', 'tipo_carga_id', 'peso_kg',
      'volumen_m3', 'tipo_transporte_id', 'fecha_estimada_viaje', 'licencia_operativa'
    ];
    
    if (escatolinaFields.includes(field.name)) {
      return isEscatolina;
    }
    
    return true;
  });
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
    const prestatario = (res?.data?.data ?? res?.data ?? res);
    prestatarioId.value = prestatario?.id ?? null;
    return prestatarioId.value;
  } catch (e) {
    return null;
  }
}

// Cargar precios del taller
async function loadPreciosTaller() {
  if (serviceKey.value !== 'taller' || !prestatarioId.value) {
    return;
  }
  
  try {
    const res = await api.get(`/taller-servicios/prestatario/${prestatarioId.value}`);
    preciosTaller.value = (res?.data?.data ?? res?.data ?? []) || [];
  } catch (e) {
    console.error('Error cargando precios del taller:', e);
    preciosTaller.value = [];
  }
}

// Cargar dirección fija del taller
async function loadDireccionTaller() {
  if (serviceKey.value !== 'taller' || !prestatarioId.value) {
    return;
  }
  
  try {
    const res = await api.get(`/prestatario/${prestatarioId.value}`);
    const prestatario = res?.data?.data ?? res?.data ?? res;
    if (prestatario?.taller_direccion?.direccion_completa) {
      form.value.direccion_taller_fija = prestatario.taller_direccion.direccion_completa;
    }
  } catch (e) {
    console.error('Error cargando dirección del taller:', e);
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
  
  // Agregar precio estimado para taller
  if (serviceKey.value === 'taller' && precioEstimado.value > 0) {
    p.precio_total = precioEstimado.value;
  }
  
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
  async () => {
    initFormFromConfig();
    if (props.initialData) populateFormFromInitialData();
    // Recargar datos del taller cuando cambia el serviceKey
    if (prestatarioId.value) {
      await loadPreciosTaller();
      await loadDireccionTaller();
    }
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

// Watch para prestatarioId - cargar datos cuando esté disponible
watch(
  () => prestatarioId.value,
  async (newId) => {
    if (newId && serviceKey.value === 'taller') {
      await loadPreciosTaller();
      await loadDireccionTaller();
    }
  },
  { immediate: false },
);

onMounted(async () => {
  initFormFromConfig();
  if (props.initialData) populateFormFromInitialData();
  // Obtener prestatario ID y cargar datos
  const pId = await getPrestatarioIdFromCookie();
  if (pId && serviceKey.value === 'taller') {
    await loadPreciosTaller();
    await loadDireccionTaller();
  }
});
</script>

<style scoped>
.card {
  margin-top: 1rem;
}
</style>
