<template>
  <div>
    <form
      class="row g-3"
      @submit.prevent="safeSubmit"
      novalidate
      :class="{ 'was-validated': submitted }"
    >
      <!-- Datos contacto -->
      <div class="col-md-6">
        <label class="form-label">Solicitante *</label>
        <input
          v-model.trim="form.solicitante"
          type="text"
          class="form-control"
          required
        />
        <div class="invalid-feedback">
          El nombre del solicitante es obligatorio.
        </div>
      </div>

      <div class="col-md-6">
        <label class="form-label">Teléfono *</label>
        <input
          v-model.trim="form.telefono"
          type="tel"
          class="form-control"
          required
          :pattern="phonePattern"
        />
        <div class="invalid-feedback">Introduce un teléfono válido.</div>
      </div>

      <div class="col-md-6">
        <label class="form-label">Email *</label>
        <input
          v-model.trim="form.email"
          type="email"
          class="form-control"
          required
        />
        <div class="invalid-feedback">Introduce un correo válido.</div>
      </div>

      <div class="col-md-6">
        <label class="form-label">Empresa</label>
        <input v-model.trim="form.empresa" type="text" class="form-control" />
      </div>

      <!-- Especificaciones -->
      <div class="col-md-4">
        <label class="form-label">Metros requeridos (m²) *</label>
        <input
          v-model.number="form.metros_requeridos"
          type="number"
          min="0.1"
          step="0.1"
          class="form-control"
          required
        />
        <div class="invalid-feedback">
          Indica los metros requeridos (mayor que 0).
        </div>
      </div>

      <div class="col-md-4">
        <label class="form-label">Tipo de uso *</label>
        <select v-model="form.tipo_uso" class="form-select" required>
          <option value="" disabled>Selecciona...</option>
          <option v-for="opt in tipoUsoOptions" :key="opt" :value="opt">
            {{ opt }}
          </option>
        </select>
        <div class="invalid-feedback">Selecciona el tipo de uso.</div>
      </div>

      <div class="col-md-4">
        <label class="form-label">Altura (m)</label>
        <input
          v-model.number="form.altura_m"
          type="number"
          step="0.1"
          min="0"
          class="form-control"
        />
      </div>

      <div class="col-md-4">
        <label class="form-label">Fecha inicio *</label>
        <input
          v-model="form.fecha_inicio"
          type="date"
          class="form-control"
          required
        />
        <div class="invalid-feedback">Indica la fecha de inicio.</div>
      </div>

      <div class="col-md-4">
        <label class="form-label">Duración *</label>
        <select v-model="form.duracion" class="form-select" required>
          <option value="" disabled>Selecciona...</option>
          <option v-for="d in duracionOptions" :key="d" :value="d">
            {{ d }}
          </option>
        </select>
        <div class="invalid-feedback">Selecciona la duración.</div>
      </div>

      <div class="col-md-4">
        <label class="form-label">Acceso / Horario *</label>
        <select v-model="form.acceso_horario" class="form-select" required>
          <option value="" disabled>Selecciona...</option>
          <option v-for="h in accesoHorarioOptions" :key="h" :value="h">
            {{ h }}
          </option>
        </select>
        <div class="invalid-feedback">Selecciona el horario de acceso.</div>
      </div>

      <div class="col-md-4">
        <label class="form-label">Control de temperatura</label>
        <select v-model="form.control_temperatura" class="form-select">
          <option value="">Ninguno</option>
          <option v-for="t in temperaturaOptions" :key="t" :value="t">
            {{ t }}
          </option>
        </select>
      </div>

      <!-- Servicios -->
      <div class="col-12">
        <label class="form-label d-block">Servicios adicionales</label>
        <div class="d-flex flex-wrap gap-2">
          <div v-for="srv in serviciosOptions" :key="srv" class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              :id="'srv_' + srv"
              :value="srv"
              v-model="form.servicios"
            />
            <label class="form-check-label" :for="'srv_' + srv">{{
              srv
            }}</label>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <label class="form-label">Frecuencia de entrada/salida</label>
        <select v-model="form.frecuencia" class="form-select">
          <option value="">(no especificado)</option>
          <option v-for="f in frecuenciaOptions" :key="f" :value="f">
            {{ f }}
          </option>
        </select>
      </div>

      <!-- Mercancía peligrosa -->
      <div class="col-12">
        <div class="form-check form-switch">
          <input
            class="form-check-input"
            id="dangerSwitch"
            type="checkbox"
            v-model="mercanciaPeligrosa"
          />
          <label class="form-check-label" for="dangerSwitch"
            >La mercancía es peligrosa</label
          >
        </div>
      </div>

      <div class="col-md-6" v-if="mercanciaPeligrosa">
        <label class="form-label">Clasificación de mercancía *</label>
        <select
          v-model="form.clasificacion_mercancia"
          class="form-select"
          :required="mercanciaPeligrosa"
        >
          <option value="" disabled>Selecciona clasificación...</option>
          <option v-for="c in clasificacionOptions" :key="c" :value="c">
            {{ c }}
          </option>
        </select>
        <div class="invalid-feedback">
          Selecciona la clasificación de la mercancía.
        </div>
      </div>

      <div class="col-12">
        <label class="form-label">Comentarios</label>
        <textarea
          v-model.trim="form.comentarios"
          rows="3"
          class="form-control"
        ></textarea>
      </div>

      <!-- Botones -->
      <div class="col-12 d-flex gap-2 justify-content-end">
        <button
          type="button"
          class="btn btn-light"
          @click="onCancel"
          :disabled="isSubmitting"
        >
          Cancelar
        </button>
        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
          <span
            v-if="isSubmitting"
            class="spinner-border spinner-border-sm me-2"
            role="status"
          />
          {{ isEdit ? "Guardar cambios" : "Crear solicitud" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  watch,
  computed,
  onMounted,
  onBeforeUnmount,
} from "vue";
import Swal from "sweetalert2";
import api from "@/services/api";
import { useCookies } from "vue3-cookies";

/** cookies */
const { cookies } = useCookies();
const cookieUser = ref<any>(null);
const isAdmin = ref(false);
const selectedClientId = ref<string | null>(null);

// Props / emits
interface Props {
  solicitud?: any | null;
}
const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "saved", payload: any): void;
  (e: "cancel"): void;
}>();

/** Interfaz local - ajusta si quieres importar una global */
interface CreateUpdateSolicitudPayload {
  id?: string;
  solicitante: string;
  telefono: string;
  email: string;
  empresa?: string | null;
  metros_requeridos: number | null;
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
  // cliente_id y assigned_prestatario_id no forman parte del form local,
  // se agregan dinámicamente al payload al enviar
}

// Opciones
const tipoUsoOptions = [
  "Almacén general",
  "Perecederos",
  "Peligroso / Químicos",
  "Archivo / Documentación",
  "Cross-docking",
];

const duracionOptions = [
  "1 mes",
  "3 meses",
  "6 meses",
  "12 meses",
  "Indefinido",
];
const accesoHorarioOptions = [
  "24/7",
  "Horario comercial",
  "Fines de semana",
  "Turnos",
];
const temperaturaOptions = ["Refrigerado", "Congelado"];
const serviciosOptions = [
  "Pick & Pack",
  "Etiquetado",
  "Inspección",
  "Control de calidad",
  "Preparación de pedidos",
  "Transporte",
];
const frecuenciaOptions = ["Diaria", "Semanal", "Varias veces al día"];
const clasificacionOptions = [
  "No peligrosa",
  "Peligrosa - Clase 1",
  "Peligrosa - Clase 2",
  "Peligrosa - Clase 3",
  "Peligrosa - Clase 4",
];

// Form state
const defaultForm = (): CreateUpdateSolicitudPayload => ({
  solicitante: "",
  telefono: "",
  email: "",
  empresa: null,
  metros_requeridos: null,
  tipo_uso: "",
  altura_m: null,
  fecha_inicio: "",
  duracion: "",
  acceso_horario: "",
  control_temperatura: null,
  servicios: [],
  frecuencia: null,
  clasificacion_mercancia: null,
  comentarios: null,
});

const form = reactive<CreateUpdateSolicitudPayload>(defaultForm());
// flagged state
const submitted = ref(false);
const isSubmitting = ref(false);
const mercanciaPeligrosa = ref(false);

const phonePattern = "^\\+?[0-9\\s\\-]{6,20}$";

// Si cambia la prop solicitud, rellenar el form
watch(
  () => props.solicitud,
  (s) => {
    if (s) {
      form.solicitante = s.solicitante ?? "";
      form.telefono = s.telefono ?? "";
      form.email = s.email ?? "";
      form.empresa = s.empresa ?? null;
      form.metros_requeridos = s.metros_requeridos ?? null;
      form.tipo_uso = s.tipo_uso ?? "";
      form.altura_m = s.altura_m ?? null;
      form.fecha_inicio = s.fecha_inicio
        ? (s.fecha_inicio as string).slice(0, 10)
        : "";
      form.duracion = s.duracion ?? "";
      form.acceso_horario = s.acceso_horario ?? "";
      form.control_temperatura = s.control_temperatura ?? null;
      form.servicios = Array.isArray(s.servicios) ? [...s.servicios] : [];
      form.frecuencia = s.frecuencia ?? null;
      form.clasificacion_mercancia = s.clasificacion_mercancia ?? null;
      form.comentarios = s.comentarios ?? null;

      mercanciaPeligrosa.value = !!(
        form.clasificacion_mercancia &&
        form.clasificacion_mercancia !== "No peligrosa"
      );
    } else {
      Object.assign(form, defaultForm());
      mercanciaPeligrosa.value = false;
    }
  },
  { immediate: true },
);

const isEdit = computed(
  () => !!props.solicitud && !!(props.solicitud as any).id,
);

// VALIDATE function
function validate(): { ok: boolean; message?: string } {
  if (!form.solicitante || !form.solicitante.trim())
    return { ok: false, message: "Solicitante obligatorio" };
  if (!form.telefono || !new RegExp(phonePattern).test(form.telefono))
    return { ok: false, message: "Teléfono inválido" };
  if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email))
    return { ok: false, message: "Email inválido" };
  if (!form.metros_requeridos || Number(form.metros_requeridos) <= 0)
    return { ok: false, message: "Metros requeridos inválidos" };
  if (!form.tipo_uso) return { ok: false, message: "Tipo de uso obligatorio" };
  if (!form.fecha_inicio)
    return { ok: false, message: "Fecha inicio obligatoria" };
  if (!form.duracion) return { ok: false, message: "Duración obligatoria" };
  if (!form.acceso_horario)
    return { ok: false, message: "Acceso / Horario obligatorio" };
  if (
    mercanciaPeligrosa.value &&
    (!form.clasificacion_mercancia || form.clasificacion_mercancia === "")
  )
    return { ok: false, message: "Clasificación de mercancía obligatoria" };
  return { ok: true };
}

// onSubmit con logging y manejo de errores
async function onSubmit() {
  submitted.value = true;
  console.log("[onSubmit] start - form snapshot:", JSON.stringify(form));
  const v = validate();
  if (!v.ok) {
    await Swal.fire({ icon: "warning", text: v.message });
    isSubmitting.value = false;
    return;
  }

  isSubmitting.value = true;

  const payload: any = {
    solicitante: form.solicitante,
    telefono: form.telefono,
    email: form.email,
    empresa: form.empresa || null,
    metros_requeridos: Number(form.metros_requeridos),
    tipo_uso: form.tipo_uso,
    altura_m: form.altura_m !== null ? Number(form.altura_m) : null,
    fecha_inicio: form.fecha_inicio,
    duracion: form.duracion,
    acceso_horario: form.acceso_horario,
    control_temperatura: form.control_temperatura || null,
    servicios: form.servicios || [],
    frecuencia: form.frecuencia || null,
    clasificacion_mercancia: mercanciaPeligrosa.value
      ? form.clasificacion_mercancia
      : null,
    comentarios: form.comentarios || null,
    // cliente_id se asigna automáticamente desde la cookie cuando corresponde
    cliente_id: !isAdmin.value ? selectedClientId.value : null,
    // assigned_prestatario_id no es obligatorio ahora
    assigned_prestatario_id: null,
  };

  console.log("Enviando payload ->", payload);

  try {
    let res;
    if (isEdit.value) {
      const id = (props.solicitud as any).id;
      console.log(`PATCH /solicitudes/${id}`);
      res = await api.patch(`/solicitudes/${id}`, payload);
    } else {
      console.log("POST /solicitudes");
      res = await api.post("/solicitudes", payload);
    }

    console.log("Respuesta del servidor:", res);
    const data = res.data?.data ?? res.data;
    console.log("Objeto creado/actualizado:", data);

    await Swal.fire({
      icon: "success",
      text: `Solicitud ${isEdit.value ? "actualizada" : "creada"} correctamente`,
    });
    emit("saved", data);
  } catch (err: any) {
    console.error("[onSubmit] CATCH ->", err);

    if (err?.response) {
      console.error("err.response.data:", err.response.data);
      console.error("err.response.status:", err.response.status);
      console.error("err.response.headers:", err.response.headers);

      const serverData = err.response.data;
      if (serverData?.errors) {
        const messages: string[] = [];
        if (Array.isArray(serverData.errors)) {
          serverData.errors.forEach((e: any) => messages.push(String(e)));
        } else {
          for (const k of Object.keys(serverData.errors)) {
            const v = serverData.errors[k];
            messages.push(`${k}: ${Array.isArray(v) ? v.join(", ") : v}`);
          }
        }
        await Swal.fire({
          icon: "error",
          title: "Errores de validación",
          html: `<pre style="text-align:left">${messages.join("<br/>")}</pre>`,
        });
      } else if (serverData?.message) {
        await Swal.fire({ icon: "error", text: String(serverData.message) });
      } else {
        await Swal.fire({
          icon: "error",
          text: "Error desconocido en el servidor. Revisa la consola (err.response.data).",
        });
      }
    } else if (err?.request) {
      console.error("No response received:", err.request);
      await Swal.fire({
        icon: "error",
        text: "No se recibió respuesta del servidor. Revisa la consola / network (posible CORS o server caído).",
      });
    } else {
      await Swal.fire({
        icon: "error",
        text: err.message || "Error en el cliente",
      });
    }
  } finally {
    isSubmitting.value = false;
    console.log("[onSubmit] finished");
  }
}

// safeSubmit wrapper para capturar excepciones que Vue podría relanzar
async function safeSubmit(evt?: Event) {
  try {
    if (evt && typeof evt.preventDefault === "function") evt.preventDefault();
    await onSubmit();
  } catch (err) {
    console.error("[safeSubmit] Captured error ->", err);
    await Swal.fire({
      title: "Error al enviar el formulario",
      text: String(err?.message ?? err ?? "Error desconocido — ver consola"),
      icon: "error",
    });
  }
}

function onCancel() {
  emit("cancel");
}

// debug global listeners (temporales) y carga cookieUser
onMounted(() => {
  // cargar user desde cookie (si existe)
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

  // determinar rol simple
  const roleName =
    cookieUser.value?.role?.name?.toString?.().toLowerCase?.() ||
    cookieUser.value?.role?.toString?.().toLowerCase?.() ||
    "";

  isAdmin.value = roleName === "administrador" || roleName === "admin";

  // si es cliente, asignamos selectedClientId automáticamente
  if (!isAdmin.value && cookieUser.value?.id) {
    selectedClientId.value = cookieUser.value.id;
  }

  window.addEventListener("error", (ev) => {
    console.error("[global error event]", ev.error ?? ev.message, ev);
  });
  window.addEventListener("unhandledrejection", (ev) => {
    console.error("[unhandledrejection]", ev.reason ?? ev.detail ?? ev);
  });
});

onBeforeUnmount(() => {
  // opcional: puedes remover listeners si lo deseas
});
</script>

<style scoped>
.form-check {
  margin-right: 1rem;
}
</style>
