<template>
  <div class="container py-4">
    <h1 class="mb-4">Configuración del Sistema</h1>

    <!-- Botón agregar -->
    <div class="d-flex justify-content-end mb-3">
      <button class="btn btn-success btn-sm" @click="addingNew = true">
        Agregar configuración
      </button>
    </div>

    <div v-if="loading" class="alert alert-info mb-4">
      Cargando configuraciones…
    </div>
    <div v-if="error" class="alert alert-danger mb-4">
      {{ error }}
    </div>

    <div v-else>
      <!-- Formulario para nueva configuración -->
      <div v-if="addingNew" class="card mb-3 shadow-sm border-success">
        <div class="card-header">
          <strong>Nueva configuración</strong>
        </div>
        <div class="card-body">
          <div class="mb-2">
            <!-- Nota: usamos newSetting.key / .type / .value (reactive) -->
            <input
              v-model="newSetting.key"
              type="text"
              class="form-control mb-2"
              placeholder="Clave de configuración (única)"
            />
            <select v-model="newSetting.type" class="form-select mb-2 w-auto">
              <option value="string">string</option>
              <option value="markdown">markdown</option>
              <option value="html">html</option>
              <option value="json">json</option>
            </select>

            <!-- si es markdown mostramos el ToastEditor -->
            <div v-if="newSetting.type === 'markdown'">
              <ToastEditor
                v-model="newSetting.value"
                initialEditType="markdown"
                height="300px"
              />
            </div>

            <div
              v-else-if="
                newSetting.type === 'html' || newSetting.type === 'markdown'
              "
            >
              <textarea
                v-model="newSetting.value"
                rows="4"
                class="form-control"
                :placeholder="placeholderFor(newSetting.key, newSetting.type)"
              ></textarea>
            </div>

            <div v-else-if="newSetting.type === 'json'">
              <textarea
                v-model="newSetting.value"
                rows="4"
                class="form-control font-monospace"
                :class="{ 'is-invalid': !isValidJson(newSetting.value) }"
                placeholder='Ej: {"clave":"valor"}'
              ></textarea>
            </div>

            <div v-else>
              <textarea
                v-model="newSetting.value"
                rows="4"
                class="form-control"
                :placeholder="placeholderFor(newSetting.key, newSetting.type)"
              ></textarea>
            </div>
          </div>

          <div class="d-flex gap-2">
            <button
              class="btn btn-primary btn-sm"
              :disabled="
                newSetting.type === 'json' && !isValidJson(newSetting.value)
              "
              @click="createSetting()"
            >
              Guardar
            </button>
            <button
              class="btn btn-outline-secondary btn-sm"
              @click="cancelNew()"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>

      <!-- Cards existentes -->
      <div v-if="settings.length === 0" class="alert alert-warning">
        No hay configuraciones cargadas.
      </div>

      <div
        v-for="s in visibleSettings"
        :key="s.key"
        class="card mb-3 shadow-sm"
      >
        <div
          class="card-header d-flex flex-wrap gap-2 justify-content-between align-items-center"
        >
          <div>
            <strong class="me-2">{{ labelFor(s.key) }}</strong>
            <span class="badge bg-secondary">{{ s.key }}</span>
          </div>

          <div class="d-flex align-items-center gap-2">
            <label class="form-label m-0 small">Tipo</label>
            <select
              v-model="s.type"
              class="form-select form-select-sm w-auto"
              @change="onTypeChanged(s)"
            >
              <option value="string">string</option>
              <option value="markdown">markdown</option>
              <option value="html">html</option>
              <option value="json">json</option>
            </select>
          </div>
        </div>

        <div class="card-body">
          <div class="mb-2">
            <!-- string -->
            <input
              v-if="s.type === 'string'"
              v-model="s.value"
              type="text"
              class="form-control"
              :placeholder="placeholderFor(s.key, s.type)"
            />

            <!-- markdown: ToastEditor -->
            <div v-else-if="s.type === 'markdown'">
              <ToastEditor
                v-model="s.value"
                initialEditType="markdown"
                height="300px"
              />
            </div>

            <!-- html or markdown fallback textarea (if not using Toast for new items) -->
            <textarea
              v-else-if="s.type === 'html'"
              v-model="s.value"
              rows="6"
              class="form-control"
              :placeholder="placeholderFor(s.key, s.type)"
              style="background-color: white !important"
            ></textarea>

            <!-- json -->
            <div v-else-if="s.type === 'json'">
              <textarea
                v-model="s.value"
                rows="10"
                class="form-control font-monospace"
                :class="{ 'is-invalid': !isValidJson(s.value) }"
                placeholder='Ej: {"clave":"valor"}'
              ></textarea>
              <div class="form-text" v-if="isValidJson(s.value)">
                JSON válido ✓
              </div>
              <div class="invalid-feedback">
                JSON inválido. Revise la sintaxis.
              </div>
            </div>

            <!-- fallback -->
            <textarea
              v-else
              v-model="s.value"
              rows="6"
              class="form-control"
              placeholder="Contenido"
            ></textarea>
          </div>

          <div class="form-text mb-3">
            {{ helpFor(s.key) }}
          </div>

          <div class="d-flex gap-2">
            <button
              class="btn btn-primary btn-sm"
              :disabled="s.type === 'json' && !isValidJson(s.value)"
              @click="saveSetting(s)"
            >
              Guardar
            </button>

            <button
              class="btn btn-outline-secondary btn-sm"
              @click="clearSetting(s)"
            >
              Vaciar
            </button>

            <button @click="deleteSetting(s)" class="btn btn-danger">
              Eliminar
            </button>
          </div>
        </div>
      </div>

      <!-- Botón global de refrescar todas las configuraciones -->
      <div v-if="settings.length > 0" class="mt-3">
        <button class="btn btn-outline-info btn-sm" @click="fetchSettings">
          Refrescar todas
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import api from "@/services/api";
import ToastEditor from "@/components/ToastEditor.vue";

type SettingType = "string" | "json" | "html" | "markdown";

interface Setting {
  id?: string;
  key: string;
  value: string;
  type: SettingType;
}

const loading = ref(true);
const error = ref<string | null>(null);
const settings = ref<Setting[]>([]);

/** Nueva configuración: usamos reactive para evitar confusiones con .value */
const addingNew = ref(false);
const newSetting = reactive<Setting>({ key: "", value: "", type: "string" });

const labelsMap: Record<string, string> = {
  prohibited_goods: "Productos y servicios prohibidos",
  pricing_rules: "Precios sobre destinos",
  delivery_policies: "Políticas de entregas",
  cancellation_policy: "Política de cancelaciones",
  emergency_info: "Emergencias",
};

const helpMap: Record<string, string> = {
  prohibited_goods: "Se mostrará en un recuadro amarillo para el cliente.",
  pricing_rules:
    "Estructura JSON con reglas de precios (por zona, peso, volumen, etc.).",
  delivery_policies: "Texto en Markdown/HTML para la página de políticas.",
  cancellation_policy: "Texto en Markdown/HTML para cancelaciones.",
  emergency_info:
    "Información y teléfonos de emergencia. Puede ser texto o JSON simple.",
};

const labelFor = (key: string) => labelsMap[key] || key;
const helpFor = (key: string) => helpMap[key] || "";

const visibleSettings = computed(() =>
  settings.value.filter(
    (s) => typeof s.key === "string" && s.key.trim() !== "",
  ),
);

const placeholderFor = (key: string, type: SettingType) => {
  if (type === "markdown") return "Escribe contenido en Markdown…";
  if (type === "html") return "<p>Contenido HTML</p>";
  return "Valor…";
};

const isValidJson = (text: string) => {
  try {
    JSON.parse(String(text));
    return true;
  } catch {
    return false;
  }
};

function normalizeFromApi(it: any): Setting {
  let t: SettingType =
    it?.type && ["string", "json", "html", "markdown"].includes(it.type)
      ? it.type
      : "string";
  let v = it?.value;
  if (t === "json" && typeof v !== "string") {
    try {
      v = JSON.stringify(v ?? {}, null, 2);
    } catch {
      v = String(v ?? "");
    }
  } else if (typeof v !== "string") {
    v = v != null ? String(v) : "";
  }
  return { id: it?.id, key: String(it?.key ?? ""), value: v, type: t };
}

function toApiPayload(s: Setting) {
  // enviamos tal cual; el backend hará sanitizado si type==='html'
  return {
    key: s.key,
    value: s.value,
    type: s.type,
  };
}

async function fetchSettings() {
  loading.value = true;
  error.value = null;
  try {
    const res = await api.get("/settings");
    const list = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
    settings.value = list.map(normalizeFromApi);
  } catch (e: any) {
    console.error(e);
    error.value =
      e?.response?.data?.message ||
      e?.message ||
      "No se pudieron cargar las configuraciones.";
    settings.value = [];
  } finally {
    loading.value = false;
  }
}

// Reemplaza o parchea saveSetting para validar s.key antes de PUT
async function saveSetting(s: Setting) {
  try {
    if (!s.key || String(s.key).trim() === "") {
      alert(
        "La clave (key) no puede estar vacía. Refresque la lista para sincronizar.",
      );
      await fetchSettings();
      return;
    }

    await api.put(`/settings/${encodeURIComponent(s.key)}`, toApiPayload(s));

    // Intentamos obtener la versión actualizada del servidor
    try {
      const res = await api.get(`/settings/${encodeURIComponent(s.key)}`);
      const fresh = normalizeFromApi(res.data?.data ?? res.data);
      const idx = settings.value.findIndex((x) => x.key === s.key);
      if (idx >= 0) settings.value[idx] = fresh;
      fetchSettings();
    } catch (getErr) {
      // Si el GET falla, al menos actualizamos localmente con lo que enviamos
      console.warn(
        "No se pudo obtener el recurso tras PUT, actualizando localmente.",
        getErr,
      );
      const idx = settings.value.findIndex((x) => x.key === s.key);
      if (idx >= 0)
        settings.value[idx] = normalizeFromApi({
          key: s.key,
          value: s.value,
          type: s.type,
        });
    }
  } catch (e: any) {
    console.error("saveSetting error:", e);
    const msg = e?.response?.data?.message;
    if (Array.isArray(msg)) {
      alert(msg.join("\n"));
    } else {
      alert(msg || e?.message || "No se pudo guardar la configuración.");
    }

    if (e?.response?.status === 404) {
      await fetchSettings();
    }
  }
}

async function deleteSetting(setting: Setting) {
  if (!setting?.id) {
    alert("Configuración inválida. No se puede eliminar.");
    return;
  }
  if (
    !confirm(`¿Seguro que deseas eliminar la configuración "${setting.key}"?`)
  ) {
    return;
  }
  try {
    await api.delete(`/settings/${setting.id}`);
    console.log(`[deleteSetting] "${setting.key}" eliminado correctamente.`);
    await fetchSettings(); // refresca la lista
  } catch (e: any) {
    console.error(e);
    alert(
      e?.response?.data?.message ||
        e?.message ||
        `No se pudo eliminar la configuración "${setting.key}".`,
    );
  }
}

async function clearSetting(s: Setting) {
  if (
    !confirm(
      `¿Vaciar el valor de "${s.key}" en el servidor? Esto no se puede deshacer fácilmente.`,
    )
  )
    return;
  try {
    // enviamos explicitamente value: null para vaciar en DB
    await api.put(`/settings/${encodeURIComponent(s.key)}`, {
      key: s.key,
      value: null,
      type: s.type,
    } as any);

    // refrescamos esa key localmente (o fetchSettings)
    try {
      const getRes = await api.get(`/settings/${encodeURIComponent(s.key)}`);
      const payload = getRes.data?.data ?? getRes.data;
      if (!payload) {
        await fetchSettings();
      } else {
        const fresh = normalizeFromApi(payload);
        const idx = settings.value.findIndex((x) => x.key === s.key);
        if (idx >= 0) settings.value.splice(idx, 1, fresh);
        else settings.value.unshift(fresh);
      }
    } catch {
      const idx = settings.value.findIndex((x) => x.key === s.key);
      if (idx >= 0)
        settings.value.splice(idx, 1, { ...settings.value[idx], value: "" });
    }

    alert(`La configuración "${s.key}" fue vaciada.`);
    fetchSettings();
  } catch (err: any) {
    console.error("clearSetting error:", err);
    alert(
      err?.response?.data?.message ||
        err?.message ||
        "Error al vaciar la configuración.",
    );
  }
}

function onTypeChanged(s: Setting) {
  if (s.type === "json" && !isValidJson(s.value)) {
    try {
      s.value = JSON.stringify({ value: s.value }, null, 2);
    } catch {
      s.value = "{}";
    }
  }
}

function cancelNew() {
  addingNew.value = false;
  newSetting.key = "";
  newSetting.value = "";
  newSetting.type = "string";
}

/** Crear nueva configuración */
async function createSetting() {
  const payloadSetting: Setting = {
    key: newSetting.key,
    value: newSetting.value,
    type: newSetting.type,
  };
  if (!payloadSetting.key || payloadSetting.key.trim() === "") {
    alert("La clave ('key') es obligatoria.");
    return;
  }
  if (settings.value.some((s) => s.key === payloadSetting.key)) {
    alert("Ya existe una configuración con esa clave.");
    return;
  }
  if (payloadSetting.type === "json" && !isValidJson(payloadSetting.value)) {
    alert("JSON inválido. Corrige antes de guardar.");
    return;
  }

  try {
    await api.post("/settings", toApiPayload(payloadSetting));
    await fetchSettings();
    addingNew.value = false;
    newSetting.key = "";
    newSetting.value = "";
    newSetting.type = "string";
  } catch (e: any) {
    console.error(e);
    const msg = e?.response?.data?.message;
    if (Array.isArray(msg)) {
      alert(msg.join("\n"));
    } else {
      alert(msg || e?.message || "No se pudo crear la configuración.");
    }
  }
}

onMounted(fetchSettings);
</script>

<style scoped>
/* pequeños ajustes si quieres */
.form-control.font-monospace {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Courier New",
    monospace;
  background-color: white !important;
}
.toastui-editor-md-container.toastui-editor-md-vertical-style {
  background-color: white !important;
}
</style>
