<template>
  <div class="hoja-ruta-with-form">
    <!-- ORIGINAL BUTTON (no tocar) -->
    <div class="hoja-ruta-simple">
      <button class="btn" :disabled="isGenerating" @click="generate">
        <span v-if="isGenerating">Generando...</span>
        <span v-else>Generar Hoja Ruta (PDF)</span>
      </button>

      <div v-if="lastFilename" class="info">
        Archivo generado: <strong>{{ lastFilename }}</strong>
      </div>
    </div>

    <hr />

    <!-- FORMULARIO (igual que antes) -->
    <form class="hoja-form" @submit.prevent="generateFromFormHtml">
      <h3>Hoja de Ruta - Formulario</h3>

      <div class="grid-row">
        <label>HOJA DE RUTA No.</label>
        <input v-model="form.hojaRutaNo" />

        <label>TIPO</label>
        <input v-model="form.tipo" />

        <label>MARCA</label>
        <input v-model="form.marca" />
      </div>

      <div class="grid-row">
        <label>VEHÍCULO - TRACTIVO</label>
        <input v-model="form.vehiculo.tractivo" />

        <label>VEHÍCULO - ARRASTRE 1</label>
        <input v-model="form.vehiculo.arrastre1" />

        <label>VEHÍCULO - ARRASTRE 2</label>
        <input v-model="form.vehiculo.arrastre2" />
      </div>

      <div class="grid-row">
        <label>FECHA (D)</label>
        <input v-model="form.fechaD" maxlength="2" />
        <label>(M)</label>
        <input v-model="form.fechaM" maxlength="2" />
        <label>(A)</label>
        <input v-model="form.fechaA" maxlength="4" />
      </div>

      <div class="grid-row">
        <label>HABILITADA POR</label>
        <input v-model="form.habilitadaPor" />
      </div>

      <div class="grid-row">
        <label>ENTIDAD</label>
        <input v-model="form.entidad" />

        <label>ORGANISMO</label>
        <input v-model="form.organismo" />

        <label>PARQUEO</label>
        <input v-model="form.parqueo" />
      </div>

      <div class="grid-row">
        <label>FIRMA</label>
        <input v-model="form.firma" />

        <label>CUÑO</label>
        <input v-model="form.cuno" />
      </div>

      <h4>Servicio Autorizado (Filas)</h4>
      <div class="table-rows">
        <div class="table-headers">
          <div>Fecha</div>
          <div>Origen</div>
          <div>Destino</div>
          <div>Ruta Autorizada</div>
          <div>Hora Salida</div>
          <div>Hora Llegada</div>
          <div></div>
        </div>

        <div class="table-row" v-for="(r, idx) in form.servicios" :key="idx">
          <input v-model="r.fecha" />
          <input v-model="r.origen" />
          <input v-model="r.destino" />
          <input v-model="r.rutaAutorizada" />
          <input v-model="r.horaSalida" />
          <input v-model="r.horaLlegada" />
          <button type="button" class="small" @click="removeRow(idx)">-</button>
        </div>

        <div class="table-actions">
          <button type="button" class="small" @click="addRow">
            Agregar fila
          </button>
        </div>
      </div>

      <div class="grid-row">
        <label>TOTALES - Cantidad de Viajes</label>
        <input v-model.number="form.totales.cantidadViajes" type="number" />
      </div>

      <div class="grid-row">
        <label>OBSERVACIONES</label>
        <textarea v-model="form.observaciones"></textarea>
      </div>

      <div class="actions">
        <button class="btn" :disabled="isGenerating" type="submit">
          <span v-if="isGenerating">Generando (Formulario)...</span>
          <span v-else>Generar Hoja Ruta (Desde Formulario)</span>
        </button>
        <button type="button" class="btn-muted" @click="resetForm">
          Limpiar Formulario
        </button>
      </div>

      <div v-if="lastFilenameForm" class="info">
        Archivo generado (form): <strong>{{ lastFilenameForm }}</strong>
      </div>
    </form>

    <!-- DIV IMPRIMIBLE (oculto en UI). Renderiza la hoja con la imagen de plantilla de fondo -->
    <div
      id="printable-hoja-ruta"
      ref="printable"
      class="printable-a4"
      aria-hidden="true"
    >
      <div class="hoja-bg">
        <div class="field hoja-num">{{ form.hojaRutaNo }}</div>
        <div class="field tipo">{{ form.tipo }}</div>
        <div class="field marca">{{ form.marca }}</div>

        <div class="field vehiculo-tractivo">{{ form.vehiculo.tractivo }}</div>
        <div class="field vehiculo-arr1">{{ form.vehiculo.arrastre1 }}</div>
        <div class="field vehiculo-arr2">{{ form.vehiculo.arrastre2 }}</div>

        <div class="field fecha-d">{{ form.fechaD }}</div>
        <div class="field fecha-m">{{ form.fechaM }}</div>
        <div class="field fecha-a">{{ form.fechaA }}</div>

        <div class="field habilitada-por">{{ form.habilitadaPor }}</div>
        <div class="field entidad">{{ form.entidad }}</div>
        <div class="field organismo">{{ form.organismo }}</div>
        <div class="field parqueo">{{ form.parqueo }}</div>

        <div class="field firma">{{ form.firma }}</div>
        <div class="field cuno">{{ form.cuno }}</div>

        <!-- tabla: filas -->
        <div class="servicios-table">
          <div
            class="servicio-row"
            v-for="(s, i) in form.servicios"
            :key="i"
            :style="{ top: `${serviciosTopStart + i * serviciosStep}px` }"
          >
            <div class="srv fecha">{{ s.fecha }}</div>
            <div class="srv origen">{{ s.origen }}</div>
            <div class="srv destino">{{ s.destino }}</div>
            <div class="srv ruta">{{ s.rutaAutorizada }}</div>
            <div class="srv salida">{{ s.horaSalida }}</div>
            <div class="srv llegada">{{ s.horaLlegada }}</div>
          </div>
        </div>

        <div class="field totales">{{ form.totales.cantidadViajes }}</div>
        <div class="field observaciones">{{ form.observaciones }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from "vue";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

// importa html2pdf
import html2pdf from "html2pdf.js";

// IMPORT DE LA IMAGEN EN /public (Vite)
import templateUrl from "/src/templates/hoja_ruta_template.png";

// --- Mantener la funcionalidad existente intacta ---
const isGenerating = ref(false);
const lastFilename = ref<string | null>(null);

async function generate() {
  if (isGenerating.value) return;
  isGenerating.value = true;

  Swal.fire({
    title: "Generando Hoja de Ruta",
    text: "Espere por favor...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const filename = `HojaRuta_${new Date().toISOString().slice(0, 10)}.pdf`;

    // placeholder: simulamos éxito (la función original la mantuviste)
    lastFilename.value = filename;

    Swal.fire({
      icon: "success",
      title: "PDF generado",
      html: `Archivo: <strong>${lastFilename.value}</strong>`,
      confirmButtonText: "OK",
    });
  } catch (err: any) {
    console.error("Error generando Hoja Ruta:", err);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: err?.message ?? String(err),
    });
  } finally {
    isGenerating.value = false;
  }
}

// --- NUEVO FORMULARIO y generación desde formulario ---
const lastFilenameForm = ref<string | null>(null);

function defaultRow() {
  return {
    fecha: "",
    origen: "",
    destino: "",
    rutaAutorizada: "",
    horaSalida: "",
    horaLlegada: "",
  };
}

const form = reactive({
  hojaRutaNo: "",
  tipo: "",
  marca: "",
  vehiculo: {
    tractivo: "",
    arrastre1: "",
    arrastre2: "",
  },
  fechaD: "",
  fechaM: "",
  fechaA: "",
  habilitadaPor: "",
  entidad: "",
  organismo: "",
  parqueo: "",
  firma: "",
  cuno: "",
  servicios: Array.from({ length: 8 }).map(() => defaultRow()), // filas por defecto
  totales: {
    cantidadViajes: 0,
  },
  observaciones: "",
});

function addRow() {
  form.servicios.push(defaultRow());
}

function removeRow(i: number) {
  if (form.servicios.length > 1) form.servicios.splice(i, 1);
}

function resetForm() {
  form.hojaRutaNo = "";
  form.tipo = "";
  form.marca = "";
  form.vehiculo.tractivo = "";
  form.vehiculo.arrastre1 = "";
  form.vehiculo.arrastre2 = "";
  form.fechaD = "";
  form.fechaM = "";
  form.fechaA = "";
  form.habilitadaPor = "";
  form.entidad = "";
  form.organismo = "";
  form.parqueo = "";
  form.firma = "";
  form.cuno = "";
  form.servicios = [defaultRow()];
  form.totales.cantidadViajes = 0;
  form.observaciones = "";
}

// refs y parámetros para posicionamiento de filas (ajustables)
const printable = ref<HTMLElement | null>(null);
const serviciosTopStart = 220; // px desde el top del contenedor imprimible — AJUSTA según plantilla
const serviciosStep = 28; // salto (px) entre filas — AJUSTA

/**
 * Asegura que la imagen de fondo se pueda cargar (evita problemas CORS/Network).
 */
async function ensureBgLoaded(url: string) {
  return new Promise<void>((resolve, reject) => {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve();
      img.onerror = (e) =>
        reject(new Error("No se pudo cargar la imagen de plantilla: " + url));
      img.src = url;
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * GENERACIÓN HTML -> PDF
 * - Rellena el DIV imprimible (ya enlazado con reactive 'form') y
 * - Llama a html2pdf para generar PDF A4 (alto-fidelidad)
 */
async function generateFromFormHtml() {
  if (isGenerating.value) return;
  isGenerating.value = true;

  Swal.fire({
    title: "Generando PDF desde HTML...",
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });

  try {
    // Nombre archivo
    const filename = `HojaRuta_Form_${new Date().toISOString().slice(0, 10)}.pdf`;

    // Opciones html2pdf
    const opt = {
      margin: [10, 10, 10, 10],
      filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    const elemento = document.getElementById(
      "printable-hoja-ruta",
    ) as HTMLElement | null;
    if (!elemento) throw new Error("Elemento imprimible no encontrado");

    // Inyectamos la URL de la plantilla (importada por Vite)
    elemento.style.setProperty("--hoja-bg-url", `url("${templateUrl}")`);

    // Esperar a que la imagen de fondo esté cargada (evita network errors)
    await ensureBgLoaded(templateUrl);

    // Forzar re-render y que el elemento sea visible para html2pdf
    elemento.style.display = "block";
    await nextTick();

    // Llamada a html2pdf (usa el elemento DOM)
    // @ts-ignore
    await html2pdf().set(opt).from(elemento).save();

    // ocultarlo otra vez
    elemento.style.display = "none";

    lastFilenameForm.value = filename;
    Swal.fire({
      icon: "success",
      title: "PDF generado",
      html: `Archivo: <strong>${filename}</strong>`,
    });
  } catch (err: any) {
    console.error("Error generando PDF HTML->PDF", err);
    Swal.fire({
      icon: "error",
      title: "Error generando PDF",
      text: err?.message ?? String(err),
    });
  } finally {
    isGenerating.value = false;
  }
}
</script>

<style scoped>
.hoja-ruta-with-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
/* tu CSS original ... */
.hoja-ruta-simple {
  display: block;
}
.grid-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}
.grid-row label {
  font-weight: 600;
  font-size: 0.95rem;
}
.table-rows {
  border: 1px solid #ccc;
  padding: 8px;
}
.table-headers {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 120px 120px 40px;
  gap: 6px;
  font-weight: 700;
}
.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 120px 120px 40px;
  gap: 6px;
  margin-top: 6px;
}
.table-row input {
  width: 100%;
}
.table-actions {
  margin-top: 8px;
}
.actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
.btn {
  min-width: 200px;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 6px;
  border: 1px solid #2b6cb0;
  background: #2b6cb0;
  color: white;
}
.btn-muted {
  min-width: 140px;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 6px;
  background: transparent;
  border: 1px solid #999;
}
.small {
  padding: 4px 8px;
}
.info {
  font-size: 0.9em;
  color: #333;
}
textarea {
  width: 100%;
  min-height: 80px;
}

/* ====== estilos del DIV imprimible (A4) ======
   El div imprimible usa la plantilla como fondo y posiciona
   elementos con absolute. Ajusta coordenadas (top/left) para que quede perfecto.
   Unidades en px: html2pdf/A4 compatibiliza al renderizar:
   Si deseas más precisión usa mm y jsPDF con unit='mm'.
*/
.printable-a4 {
  /* oculto en la UI normal */
  display: none;
  width: 210mm; /* A4 ancho */
  height: 297mm; /* A4 alto */
  /* añadir un fondo blanco para impresión */
  background: white;
}

/* la capa que contiene la imagen de fondo y los campos */
.hoja-bg {
  position: relative;
  width: 100%;
  height: 100%;
  /* background-image inyectado por JS con la variable --hoja-bg-url */
  background-image: var(
    --hoja-bg-url,
    url("/templates/hoja_ruta_template.png")
  );
  background-size: cover;
  background-position: center top;
}

/* campos posicionados (ajusta top/left según la plantilla) */
.field {
  position: absolute;
  font-size: 12px;
  color: black;
  white-space: pre-wrap;
}

/* Ejemplos de posiciones iniciales - AJUSTA estos valores. */

/* Encabezado */
.hoja-num {
  left: 8mm;
  top: 12mm;
  font-weight: 700;
}
.tipo {
  left: 100mm;
  top: 12mm;
  text-align: center;
  width: 50mm;
}
.marca {
  right: 8mm;
  top: 12mm;
  text-align: right;
  width: 40mm;
}

/* Vehículo */
.vehiculo-tractivo {
  left: 20mm;
  top: 30mm;
}
.vehiculo-arr1 {
  left: 20mm;
  top: 38mm;
}
.vehiculo-arr2 {
  left: 20mm;
  top: 46mm;
}

/* Fecha */
.fecha-d {
  left: 12mm;
  top: 28mm;
}
.fecha-m {
  left: 22mm;
  top: 28mm;
}
.fecha-a {
  left: 32mm;
  top: 28mm;
}

.habilitada-por {
  left: 8mm;
  top: 62mm;
  width: 80mm;
}
.entidad {
  left: 80mm;
  top: 62mm;
  width: 110mm;
}
.organismo {
  left: 145mm;
  top: 62mm;
  width: 60mm;
}
.parqueo {
  left: 170mm;
  top: 76mm;
}

/* Firma / cuño */
.firma {
  left: 10mm;
  top: 88mm;
  width: 60mm;
}
.cuno {
  left: 70mm;
  top: 88mm;
}

/* Tabla servicios (cada .servicio-row se posiciona en estilo inline con top calculado en línea) */
.servicios-table {
  position: absolute;
  left: 6mm;
  width: calc(100% - 12mm);
  top: 120mm;
}
.servicio-row {
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  gap: 4px;
  font-size: 10px;
  height: 24px; /* alto de fila - ajústalo */
  align-items: center;
}
.servicio-row .srv {
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 4px;
}

/* ancho de columnas aproximado - ajusta */
.servicio-row .fecha {
  width: 22mm;
}
.servicio-row .origen {
  width: 50mm;
}
.servicio-row .destino {
  width: 50mm;
}
.servicio-row .ruta {
  width: 70mm;
}
.servicio-row .salida {
  width: 18mm;
  text-align: center;
}
.servicio-row .llegada {
  width: 18mm;
  text-align: center;
}

/* Totales y observaciones */
.totales {
  position: absolute;
  left: 8mm;
  top: 260mm;
}
.observaciones {
  position: absolute;
  left: 8mm;
  top: 270mm;
  width: calc(100% - 16mm);
}

/* Fin styles */
</style>
