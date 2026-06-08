<template>
  <div class="page-wrap">
    <main class="hoja-ruta-full">
      <form class="hoja-form" @submit.prevent="generateFromFormHtml" novalidate>
        <h2>Hoja de Ruta — Formulario</h2>

        <!-- HOJA DE RUTA: campo oculto (valor generado automáticamente) -->
        <input type="hidden" v-model="form.hojaRutaNo" />

        <div class="field-row">
          <label>Tipo <span class="required">*</span></label>
          <input v-model="form.tipo" type="text" required />
        </div>

        <div class="field-row">
          <label>Marca</label>
          <input v-model="form.marca" type="text" />
        </div>

        <div class="field-row">
          <label>Vehículo — Tractivo</label>
          <input v-model="form.vehiculo.tractivo" type="text" />
        </div>

        <div class="field-row">
          <label>Vehículo — Arrastre 1</label>
          <input v-model="form.vehiculo.arrastre1" type="text" />
        </div>

        <div class="field-row">
          <label>Vehículo — Arrastre 2</label>
          <input v-model="form.vehiculo.arrastre2" type="text" />
        </div>

        <div class="field-row">
          <label>Fecha</label>
          <input v-model="form.fecha" type="date" />
        </div>

        <div class="field-row">
          <label>Habilitada por</label>
          <input v-model="form.habilitadaPor" type="text" />
        </div>

        <div class="field-row">
          <label>Entidad</label>
          <input v-model="form.entidad" type="text" />
        </div>

        <div class="field-row">
          <label>Organismo</label>
          <input v-model="form.organismo" type="text" />
        </div>

        <div class="field-row">
          <label>Parqueo</label>
          <input v-model="form.parqueo" type="text" />
        </div>

        <div class="field-row">
          <label>Firma</label>
          <input v-model="form.firma" type="text" />
        </div>

        <div class="field-row">
          <label>Cuño</label>
          <input v-model="form.cuno" type="text" />
        </div>

        <h3 class="section-title">Servicio Autorizado (Filas)</h3>
        <div class="servicios-list">
          <div
            class="servicio-card"
            v-for="(r, idx) in form.servicios"
            :key="idx"
          >
            <div class="servicio-fields">
              <div class="field-row small">
                <label>Fecha</label>
                <input v-model="r.fecha" type="date" />
              </div>
              <div class="field-row small">
                <label>Origen</label>
                <input v-model="r.origen" type="text" />
              </div>
              <div class="field-row small">
                <label>Destino</label>
                <input v-model="r.destino" type="text" />
              </div>
              <div class="field-row small">
                <label>Ruta Autorizada</label>
                <input v-model="r.rutaAutorizada" type="text" />
              </div>
              <div class="field-row small">
                <label>Hora Salida</label>
                <input v-model="r.horaSalida" type="time" />
              </div>
              <div class="field-row small">
                <label>Hora Llegada</label>
                <input v-model="r.horaLlegada" type="time" />
              </div>
            </div>

            <div class="servicio-actions">
              <button type="button" class="btn-small" @click="removeRow(idx)">
                Eliminar
              </button>
            </div>
          </div>

          <div class="servicio-add">
            <button type="button" class="btn" @click="addRow">
              Agregar fila
            </button>
          </div>
        </div>

        <div class="field-row">
          <label>TOTALES — Cantidad de Viajes</label>
          <input
            v-model.number="form.totales.cantidadViajes"
            type="number"
            min="0"
          />
        </div>

        <div class="field-row">
          <label>Observaciones</label>
          <textarea v-model="form.observaciones" rows="4"></textarea>
        </div>

        <div v-if="errors.length" class="errors">
          <strong>Corrige lo siguiente:</strong>
          <ul>
            <li v-for="(e, i) in errors" :key="i">{{ e }}</li>
          </ul>
        </div>

        <div class="actions">
          <button class="btn" :disabled="isGenerating" type="submit">
            <span v-if="isGenerating">Generando PDF...</span>
            <span v-else>Generar Hoja Ruta (PDF)</span>
          </button>
          <button type="button" class="btn-muted" @click="resetForm">
            Limpiar Formulario
          </button>
        </div>

        <p v-if="lastFilenameForm" class="info">
          Archivo generado: <strong>{{ lastFilenameForm }}</strong>
        </p>
      </form>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import html2pdf from "html2pdf.js";
import { useRouter } from "vue-router";

const isGenerating = ref(false);
const lastFilenameForm = ref("");
const errors = ref([]);
const router = useRouter();

/**
 * Genera un número aleatorio de 5 dígitos (10000..99999)
 * Devuelve string.
 */
function generateRandom5Digits() {
  return String(Math.floor(10000 + Math.random() * 90000));
}

const form = reactive({
  hojaRutaNo: "", // ahora oculto, será generado automáticamente
  tipo: "",
  marca: "",
  vehiculo: { tractivo: "", arrastre1: "", arrastre2: "" },
  fecha: "",
  habilitadaPor: "",
  entidad: "",
  organismo: "",
  parqueo: "",
  firma: "",
  cuno: "",
  servicios: [
    {
      fecha: "",
      origen: "",
      destino: "",
      rutaAutorizada: "",
      horaSalida: "",
      horaLlegada: "",
    },
  ],
  totales: { cantidadViajes: 0 },
  observaciones: "",
});

// Inicializar número de hoja al montar
onMounted(() => {
  if (!form.hojaRutaNo) {
    form.hojaRutaNo = generateRandom5Digits();
  }
});

function addRow() {
  form.servicios.push({
    fecha: "",
    origen: "",
    destino: "",
    rutaAutorizada: "",
    horaSalida: "",
    horaLlegada: "",
  });
}
function removeRow(idx) {
  if (form.servicios.length <= 1) {
    form.servicios[0] = {
      fecha: "",
      origen: "",
      destino: "",
      rutaAutorizada: "",
      horaSalida: "",
      horaLlegada: "",
    };
  } else {
    form.servicios.splice(idx, 1);
  }
}
function resetForm() {
  // resetear todos los campos y generar nuevo número
  form.hojaRutaNo = generateRandom5Digits();
  form.tipo = "";
  form.marca = "";
  form.vehiculo.tractivo = "";
  form.vehiculo.arrastre1 = "";
  form.vehiculo.arrastre2 = "";
  form.fecha = "";
  form.habilitadaPor = "";
  form.entidad = "";
  form.organismo = "";
  form.parqueo = "";
  form.firma = "";
  form.cuno = "";
  form.servicios = [
    {
      fecha: "",
      origen: "",
      destino: "",
      rutaAutorizada: "",
      horaSalida: "",
      horaLlegada: "",
    },
  ];
  form.totales.cantidadViajes = 0;
  form.observaciones = "";
  errors.value = [];
  lastFilenameForm.value = "";
}

function validateForm() {
  const e = [];
  // ya no validamos hojaRutaNo (se genera automáticamente)
  if (!form.tipo || !String(form.tipo).trim())
    e.push("El campo 'Tipo' es obligatorio.");
  const hasAnyRowWithData = form.servicios.some(
    (r) => r.origen || r.destino || r.fecha || r.rutaAutorizada,
  );
  if (!hasAnyRowWithData)
    e.push(
      "Añade al menos una fila de 'Servicio Autorizado' con origen y destino.",
    );
  form.servicios.forEach((r, idx) => {
    const any =
      r.origen ||
      r.destino ||
      r.fecha ||
      r.horaSalida ||
      r.horaLlegada ||
      r.rutaAutorizada;
    if (any) {
      if (!r.fecha)
        e.push(
          `Fila ${idx + 1}: la fecha es requerida si la fila contiene datos.`,
        );
      if (!r.origen) e.push(`Fila ${idx + 1}: origen es requerido.`);
      if (!r.destino) e.push(`Fila ${idx + 1}: destino es requerido.`);
    }
  });
  if (form.totales.cantidadViajes < 0)
    e.push("Cantidad de viajes no puede ser negativa.");
  errors.value = e;
  return e.length === 0;
}

// -----------------------------
// buildPrintableHtml (igual que antes, pero usa form.hojaRutaNo)
// -----------------------------
function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildPrintableHtml() {
  function fieldBox(label, value) {
    return `
      <div class="field-box">
        <div class="f-label">${escapeHtml(label)}</div>
        <div class="f-value">${escapeHtml(value || "")}</div>
      </div>
    `;
  }

  let serviciosRows = "";
  form.servicios.forEach((s) => {
    serviciosRows += `
      <tr>
        <td>${escapeHtml(s.fecha || "")}</td>
        <td>${escapeHtml(s.origen || "")}</td>
        <td>${escapeHtml(s.destino || "")}</td>
        <td>${escapeHtml(s.rutaAutorizada || "")}</td>
        <td>${escapeHtml(s.horaSalida || "")}</td>
        <td>${escapeHtml(s.horaLlegada || "")}</td>
      </tr>
    `;
  });

  // desglosar fecha en D M A
  const fecha = form.fecha || "";
  let d = "",
    m = "",
    a = "";
  if (fecha) {
    const dt = new Date(fecha);
    if (!isNaN(dt)) {
      d = String(dt.getDate()).padStart(2, "0");
      m = String(dt.getMonth() + 1).padStart(2, "0");
      a = String(dt.getFullYear());
    }
  }

  return `
    <div class="print-root">
      <header class="pr-head">
        <h1>HOJA DE RUTA</h1>
        <div class="pr-num">Nº: ${escapeHtml(form.hojaRutaNo || "")}</div>
      </header>

      <section class="pr-grid">
        ${fieldBox("Tipo", form.tipo)}
        ${fieldBox("Marca", form.marca)}
        ${fieldBox("Vehículo - Tractivo", form.vehiculo.tractivo)}
        ${fieldBox("Vehículo - Arrastre 1", form.vehiculo.arrastre1)}
        ${fieldBox("Vehículo - Arrastre 2", form.vehiculo.arrastre2)}
        ${fieldBox("Entidad", form.entidad)}
        ${fieldBox("Organismo", form.organismo)}
        ${fieldBox("Parqueo", form.parqueo)}
        ${fieldBox("Totales (viajes)", String(form.totales.cantidadViajes || 0))}
      </section>

      <section class="pr-date-block">
        <div class="date-box">
          <div class="date-label">FECHA</div>
          <div class="date-grid">
            <div class="date-cell"><div class="small-label">D</div><div class="small-value">${escapeHtml(d)}</div></div>
            <div class="date-cell"><div class="small-label">M</div><div class="small-value">${escapeHtml(m)}</div></div>
            <div class="date-cell"><div class="small-label">A</div><div class="small-value">${escapeHtml(a)}</div></div>
          </div>
        </div>

        <div class="habilitada-box">
          <div class="f-label">HABILITADA POR</div>
          <div class="f-value">${escapeHtml(form.habilitadaPor || "")}</div>
        </div>

        <div class="sign-row">
          <div class="sign-left"><div class="f-label">FIRMA</div><div class="f-value">${escapeHtml(form.firma || "")}</div></div>
          <div class="sign-right"><div class="f-label">CUÑO</div><div class="f-value">${escapeHtml(form.cuno || "")}</div></div>
        </div>
      </section>

      <section class="pr-services">
        <h3>Servicios</h3>
        <div class="services-box">
          <table class="services-table">
            <thead>
              <tr><th>Fecha</th><th>Origen</th><th>Destino</th><th>Ruta</th><th>Salida</th><th>Llegada</th></tr>
            </thead>
            <tbody>${serviciosRows}</tbody>
          </table>
        </div>
      </section>

      <section class="pr-final">
        <div class="obs-box">
          <div class="f-label">Observaciones</div>
          <div class="f-value pre">${escapeHtml(form.observaciones || "")}</div>
        </div>
      </section>
    </div>

    <style>
      :root { --border: #000; --bg: #fff; --text: #000; --gap: 8px; }
      html,body { margin:0; padding:0; background:var(--bg); color:var(--text); font-family: Arial, Helvetica, sans-serif; -webkit-print-color-adjust: exact; }
      body { display:flex; justify-content:center; align-items:flex-start; padding:12mm; box-sizing:border-box; }
      .print-root { box-sizing: border-box; padding: 12mm; width: 190mm; max-width: 100%; border:1px solid var(--border); background:#fff; color:#000; margin: 0 auto 8mm auto; }
      .pr-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
      .pr-head h1 { margin:0; font-size:18px; letter-spacing:0.5px; color:#000; font-weight:700; }
      .pr-num { font-size:12px; }
      .pr-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap: var(--gap); margin-bottom: 10px; }
      .field-box { border:1px solid var(--border); padding:8px; border-radius:4px; background:#fff; box-sizing:border-box; }
      .f-label { font-weight:700; font-size:11px; margin-bottom:6px; color:var(--text); }
      .f-value { font-size:13px; color:var(--text); }
      .pr-date-block { display:flex; flex-direction:column; gap:8px; margin-bottom:12px; }
      .date-box { border:1px solid var(--border); padding:8px; border-radius:4px; display:flex; flex-direction:column; width:320px; margin-bottom:8px; }
      .date-label { font-weight:700; font-size:11px; margin-bottom:6px; }
      .date-grid { display:flex; gap:6px; }
      .date-cell { border:1px solid var(--border); padding:6px; border-radius:3px; width:60px; text-align:center; background:#fff; }
      .small-label { font-weight:700; font-size:11px; margin-bottom:4px; }
      .small-value { font-size:13px; }
      .habilitada-box { border:1px solid var(--border); padding:8px; border-radius:4px; }
      .sign-row { display:flex; justify-content:space-between; gap:12px; margin-top:8px; }
      .sign-left, .sign-right { flex:1 1 0; border:1px solid var(--border); padding:8px; border-radius:4px; }
      .pr-services { margin-top:8px; margin-bottom:10px; }
      .services-box { border:1px solid var(--border); padding:6px; border-radius:4px; background:#fff; }
      .services-table { width:100%; border-collapse:collapse; font-size:12px; }
      .services-table th, .services-table td { border:1px solid var(--border); padding:6px; vertical-align:top; text-align:left; }
      .pr-final { margin-top:10px; }
      .obs-box { border:1px solid var(--border); padding:8px; border-radius:4px; background:#fff; }
      .f-value.pre { white-space: pre-wrap; }
      body, .print-root { height: auto !important; min-height: 0 !important; }
    </style>
  `;
}

// ------------------------
// generateFromFormHtml (igual lógica, se asegura hojaRutaNo existe)
// ------------------------
async function generateFromFormHtml() {
  errors.value = [];
  // asegurar que exista hojaRutaNo (por si algo la borró)
  if (!form.hojaRutaNo) {
    form.hojaRutaNo = generateRandom5Digits();
  }

  if (!validateForm()) return;

  if (isGenerating.value) {
    console.log("[pdf] ya se está generando, ignoro petición.");
    return;
  }

  isGenerating.value = true;
  let iframe;
  try {
    console.log("[pdf] Inicio generación PDF (hojaRutaNo):", form.hojaRutaNo);
    console.log("[pdf] snapshot form:", JSON.parse(JSON.stringify(form)));

    const printableHtml = buildPrintableHtml();

    iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.left = "0";
    iframe.style.top = "0";
    iframe.style.width = "210mm";
    iframe.style.height = "auto";
    iframe.style.border = "0";
    iframe.style.opacity = "0";
    iframe.style.pointerEvents = "none";
    iframe.style.zIndex = "2147483647";
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(
      `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head><body>${printableHtml}</body></html>`,
    );
    doc.close();

    await new Promise((resolve) => {
      if (doc.readyState === "complete" || doc.readyState === "interactive") {
        setTimeout(resolve, 180);
      } else {
        iframe.onload = () => setTimeout(resolve, 180);
        setTimeout(resolve, 2500);
      }
    });

    const body = iframe.contentWindow.document.body;
    const contentRect = body.getBoundingClientRect();
    const contentHeightPx = Math.max(
      contentRect.height,
      body.scrollHeight,
      body.offsetHeight,
    );
    const contentWidthPx = Math.max(
      contentRect.width,
      body.scrollWidth,
      body.offsetWidth,
    );

    const pxToMm = (px) => px * 0.264583;
    let widthMm = Math.round(pxToMm(contentWidthPx) * 100) / 100;
    let heightMm = Math.round(pxToMm(contentHeightPx) * 100) / 100;

    const marginTopMm = 10;
    const marginBottomMm = 10;
    const marginLeftMm = 10;
    const marginRightMm = 10;

    if (!isFinite(widthMm) || widthMm <= 0) widthMm = 190;
    if (!isFinite(heightMm) || heightMm <= 0) heightMm = 140;

    const pageWidthMm =
      Math.round((widthMm + marginLeftMm + marginRightMm) * 100) / 100;
    const pageHeightMm =
      Math.round((heightMm + marginTopMm + marginBottomMm) * 100) / 100;

    const now = new Date();
    const fname = `hoja_ruta_${form.hojaRutaNo || "sin-num"}_${now.toISOString().slice(0, 19).replace(/[:T]/g, "-")}.pdf`;
    lastFilenameForm.value = fname;

    // Tupla para margin y formato (evita error de tipos en TS)
    const marginTuple = [
      marginTopMm,
      marginLeftMm,
      marginBottomMm,
      marginRightMm,
    ];
    const pageFormatTuple = [pageWidthMm, pageHeightMm];

    const opt = {
      margin: marginTuple,
      filename: fname,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        width: contentWidthPx,
        height: contentHeightPx,
      },
      jsPDF: {
        unit: "mm",
        format: pageFormatTuple,
        orientation: "portrait",
      },
    };

    await html2pdf().set(opt).from(iframe.contentWindow.document.body).save();

    document.body.removeChild(iframe);
    iframe = undefined;
  } catch (err) {
    console.error("[pdf] Error generando PDF:", err);
    errors.value = [
      "Error al generar el PDF. Revisa la consola para más detalles.",
    ];
    try {
      if (iframe && document.body.contains(iframe))
        document.body.removeChild(iframe);
    } catch (e) {}
  } finally {
    isGenerating.value = false;
    // Si quieres redirigir después de generar, lo dejo como estaba; comenta la siguiente línea si no la quieres.
    router.push("/comercializacion/ordenes/listrordenesPrestatario");
  }
}
</script>

<style scoped>
/* Página: cubrir pantalla */
.page-wrap {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(180deg, #f3f4f6 0%, #e6eef5 100%);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 24px;
  box-sizing: border-box;
}

/* Contenedor principal: ocupa todo el ancho disponible (no recortado) */
.hoja-ruta-full {
  width: 100%;
  max-width: 1100px;
  box-sizing: border-box;
  padding: 18px;
}

/* Formulario: sin fondo blanco sólido (más integrado con el fondo de la página) */
.hoja-form {
  width: 100%;
  padding: 18px;
  border-radius: 10px;
  background: transparent;
  box-shadow: 0 6px 18px rgba(16, 24, 40, 0.06);
  border: 1px solid rgba(15, 23, 42, 0.06);
}

.hoja-form h2 {
  margin: 0 0 12px 0;
  font-size: 20px;
  color: #0f172a;
}
.section-title {
  margin-top: 16px;
  margin-bottom: 8px;
  font-size: 16px;
  color: #0f172a;
}

.field-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}
.field-row.small {
  max-width: 320px;
}
.field-row label {
  font-size: 13px;
  color: #0f172a;
  font-weight: 600;
}
.field-row input,
.field-row textarea {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.02);
  outline: none;
  box-sizing: border-box;
  font-size: 14px;
  color: #0f172a;
}
.field-row input:focus,
.field-row textarea:focus {
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.06);
  border-color: rgba(37, 99, 235, 0.6);
}

.servicios-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;
}
.servicio-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(15, 23, 42, 0.04);
  background: rgba(255, 255, 255, 0.01);
  box-shadow: 0 3px 8px rgba(2, 6, 23, 0.02);
}
.servicio-fields {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  flex: 1 1 auto;
}
.servicio-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn {
  padding: 10px 14px;
  border-radius: 8px;
  background: #2563eb;
  color: white;
  border: none;
  cursor: pointer;
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-muted {
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: transparent;
  cursor: pointer;
}
.btn-small {
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 0, 0, 0.632);
  cursor: pointer;
  margin-top: 20px;
}

.errors {
  background: rgba(255, 235, 238, 0.9);
  color: #7f1d1d;
  padding: 10px;
  border-radius: 8px;
  margin-top: 6px;
}
.info {
  margin-top: 10px;
  color: #065f46;
}

@media (max-width: 900px) {
  .hoja-ruta-full {
    padding: 12px;
  }
  .servicio-fields {
    flex-direction: column;
  }
  .field-row.small {
    max-width: 100%;
  }
}
</style>
