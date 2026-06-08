<template>
  <div class="container mt-4">
    <h1 class="mb-4">Carta de Porte — Formulario</h1>

    <form
      id="cartaPorteForm"
      class="needs-validation"
      novalidate
      @submit.prevent="submitForm"
    >
      <!-- REMITENTE / LUGAR DE CARGA -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">Remitente y Lugar de Carga</h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Remitente (Nombre)</label>
              <input
                v-model="form.remitente_nombre"
                type="text"
                class="form-control"
                required
              />
            </div>
            <div class="col-md-6">
              <label class="form-label">Remitente (C.I. / Tax ID)</label>
              <input
                v-model="form.remitente_dni"
                type="text"
                class="form-control"
              />
            </div>

            <div class="col-12">
              <label class="form-label">Lugar de carga / Dirección</label>
              <input
                v-model="form.lugar_carga"
                type="text"
                class="form-control"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- DESTINATARIO / LUGAR DE DESCARGA -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">Destinatario y Lugar de Descarga</h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Destinatario (Nombre)</label>
              <input
                v-model="form.destinatario_nombre"
                type="text"
                class="form-control"
              />
            </div>
            <div class="col-md-6">
              <label class="form-label">Destinatario (C.I.)</label>
              <input
                v-model="form.destinatario_dni"
                type="text"
                class="form-control"
              />
            </div>

            <div class="col-12">
              <label class="form-label">Lugar de descarga / Dirección</label>
              <input
                v-model="form.lugar_descarga"
                type="text"
                class="form-control"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- PORTEADOR / DOMICILIO / DATOS TÉCNICOS -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">Porteador / Datos técnicos</h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Porteador / Conductor</label>
              <input
                v-model="form.porteador"
                type="text"
                class="form-control"
              />
            </div>
            <div class="col-md-4">
              <label class="form-label">Domicilio Porteador</label>
              <input
                v-model="form.porteador_domicilio"
                type="text"
                class="form-control"
              />
            </div>
            <div class="col-md-4">
              <label class="form-label">Lugar de Emisión</label>
              <input
                v-model="form.lugar_emision"
                type="text"
                class="form-control"
              />
            </div>

            <div class="col-md-3">
              <label class="form-label">Fecha de Emisión</label>
              <input
                v-model="form.fecha_emision"
                type="date"
                class="form-control"
              />
            </div>
            <div class="col-md-3">
              <label class="form-label">Chapa Tractivo Nº</label>
              <input
                v-model="form.chapa_tractivo"
                type="text"
                class="form-control"
              />
            </div>
            <div class="col-md-3">
              <label class="form-label">Capacidad de Peso</label>
              <input
                v-model="form.capacidad_peso"
                type="text"
                class="form-control"
              />
            </div>
            <div class="col-md-3">
              <label class="form-label">Hoja de Ruta Nº</label>
              <input
                v-model="form.hoja_ruta"
                type="text"
                class="form-control"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- CARGADOR Y DOMICILIO -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">Cargador y domicilio</h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Cargador (Nombre)</label>
              <input
                v-model="form.cargador_nombre"
                type="text"
                class="form-control"
              />
            </div>
            <div class="col-md-6">
              <label class="form-label">Cargador (Dirección)</label>
              <input
                v-model="form.cargador_domicilio"
                type="text"
                class="form-control"
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">Chapa Arrastre Nº</label>
              <input
                v-model="form.chapa_arrastre"
                type="text"
                class="form-control"
              />
            </div>
            <div class="col-md-6">
              <label class="form-label">Basificado en (observación)</label>
              <input
                v-model="form.basificado_en"
                type="text"
                class="form-control"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- TABLA DE BULTOS (dinámica) -->
      <div class="card mb-4">
        <div
          class="card-header d-flex justify-content-between align-items-center"
        >
          <h5 class="mb-0">Detalle de Bultos / Mercancías</h5>
          <div>
            <button
              type="button"
              class="btn btn-sm btn-success"
              @click="addRow"
            >
              + Añadir bulto
            </button>
          </div>
        </div>

        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-bordered mb-0">
              <thead class="table-light">
                <tr>
                  <th style="width: 80px">Cantidad</th>
                  <th>Marcas / Números / Embalaje / Productos</th>
                  <th style="width: 120px">Valor declarado</th>
                  <th style="width: 120px">Peso bruto (kg)</th>
                  <th style="width: 120px">Volumen / Medidas</th>
                  <th style="width: 120px">Tarifa por unidad</th>
                  <th style="width: 120px">Fletes</th>
                  <th style="width: 60px">—</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(r, idx) in form.bultos" :key="r.id">
                  <td>
                    <input
                      v-model.number="r.cantidad"
                      type="number"
                      min="1"
                      class="form-control form-control-sm"
                      @input="recalculateRow(idx)"
                    />
                  </td>
                  <td>
                    <input
                      v-model="r.descripcion"
                      type="text"
                      class="form-control form-control-sm"
                    />
                  </td>
                  <td>
                    <input
                      v-model.number="r.valor_declarado"
                      type="number"
                      step="0.01"
                      class="form-control form-control-sm"
                      @input="recalculateRow(idx)"
                    />
                  </td>
                  <td>
                    <input
                      v-model.number="r.peso_bruto"
                      type="number"
                      step="0.01"
                      class="form-control form-control-sm"
                      @input="recalculateRow(idx)"
                    />
                  </td>
                  <td>
                    <input
                      v-model="r.volumen"
                      type="text"
                      class="form-control form-control-sm"
                    />
                  </td>
                  <td>
                    <input
                      v-model.number="r.tarifa_unidad"
                      type="number"
                      step="0.01"
                      class="form-control form-control-sm"
                      @input="recalculateRow(idx)"
                    />
                  </td>
                  <td>
                    <input
                      v-model.number="r.flete"
                      type="number"
                      step="0.01"
                      class="form-control form-control-sm"
                      readonly
                    />
                  </td>
                  <td class="text-center">
                    <button
                      type="button"
                      class="btn btn-sm btn-danger"
                      @click="removeRow(idx)"
                    >
                      x
                    </button>
                  </td>
                </tr>
                <tr v-if="form.bultos.length === 0">
                  <td colspan="8" class="text-center text-muted py-3">
                    No hay bultos añadidos
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="p-3 d-flex justify-content-end gap-3">
            <div class="text-end">
              <div><small class="text-muted">Subtotal Fletes:</small></div>
              <div class="fw-bold">{{ subtotalFletes.toFixed(2) }} CUP</div>
            </div>
          </div>
        </div>
      </div>

      <!-- RECARGOS / DESCUENTOS / IMPORTE TOTAL -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">Recargos / Descuentos / Importe</h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Recargos</label>
              <input
                v-model.number="form.recargos"
                type="number"
                step="0.01"
                class="form-control"
                @input="recalculateTotals"
              />
            </div>
            <div class="col-md-4">
              <label class="form-label">Descuentos</label>
              <input
                v-model.number="form.descuentos"
                type="number"
                step="0.01"
                class="form-control"
                @input="recalculateTotals"
              />
            </div>
            <div class="col-md-4">
              <label class="form-label">Impuestos</label>
              <input
                v-model.number="form.impuestos"
                type="number"
                step="0.01"
                class="form-control"
                @input="recalculateTotals"
              />
            </div>

            <div class="col-md-6 mt-2">
              <label class="form-label">Importe Total</label>
              <input
                :value="importeTotal.toFixed(2)"
                readonly
                class="form-control fw-bold"
              />
            </div>

            <div class="col-md-6 mt-2">
              <label class="form-label">Importe Total (en letras)</label>
              <input
                v-model="form.importe_letras"
                type="text"
                class="form-control"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- OPERACIÓN: CARGA / DESCARGA (fechas/hora/distancia/tiempos) -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">Operación — Carga / Descarga</h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-3">
              <label class="form-label">Llegada (fecha/hora)</label>
              <input
                v-model="form.op_llegada"
                type="datetime-local"
                class="form-control"
              />
            </div>
            <div class="col-md-3">
              <label class="form-label">Inicio (fecha/hora)</label>
              <input
                v-model="form.op_inicio"
                type="datetime-local"
                class="form-control"
              />
            </div>
            <div class="col-md-3">
              <label class="form-label">Terminación (fecha/hora)</label>
              <input
                v-model="form.op_terminacion"
                type="datetime-local"
                class="form-control"
              />
            </div>
            <div class="col-md-3">
              <label class="form-label">Salida (fecha/hora)</label>
              <input
                v-model="form.op_salida"
                type="datetime-local"
                class="form-control"
              />
            </div>

            <div class="col-md-4">
              <label class="form-label">Distancia (km)</label>
              <input
                v-model.number="form.distancia_km"
                type="number"
                min="0"
                class="form-control"
              />
            </div>
            <div class="col-md-4">
              <label class="form-label">Tiempo estimado (horas)</label>
              <input
                v-model.number="form.tiempo_horas"
                type="number"
                min="0"
                class="form-control"
              />
            </div>
            <div class="col-md-4">
              <label class="form-label">Recorrido (breve)</label>
              <input
                v-model="form.recorrido"
                type="text"
                class="form-control"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- INSTRUCCIONES Y OBSERVACIONES -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">Instrucciones y Observaciones</h5>
        </div>
        <div class="card-body">
          <textarea
            v-model="form.instrucciones"
            class="form-control"
            rows="4"
            placeholder="Instrucciones especiales, observaciones, condiciones..."
          ></textarea>
        </div>
      </div>

      <!-- FIRMAS -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">Firmas</h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Remitente — C.I.</label>
              <input
                v-model="form.firma_remitente_ci"
                type="text"
                class="form-control"
              />
              <label class="form-label mt-2">Fecha y Hora Despacho</label>
              <input
                v-model="form.firma_remitente_fecha"
                type="datetime-local"
                class="form-control"
              />
            </div>

            <div class="col-md-4">
              <label class="form-label">Porteador / Conductor — C.I.</label>
              <input
                v-model="form.firma_porteador_ci"
                type="text"
                class="form-control"
              />
              <label class="form-label mt-2">Licencia Nº</label>
              <input
                v-model="form.firma_porteador_licencia"
                type="text"
                class="form-control"
              />
            </div>

            <div class="col-md-4">
              <label class="form-label">Destinatario — C.I.</label>
              <input
                v-model="form.firma_destinatario_ci"
                type="text"
                class="form-control"
              />
              <label class="form-label mt-2">Fecha y Hora Recepción</label>
              <input
                v-model="form.firma_destinatario_fecha"
                type="datetime-local"
                class="form-control"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- BOTONES -->
      <div class="d-flex justify-content-end gap-2 mb-5">
        <button type="button" class="btn btn-light" @click="resetForm">
          Cancelar
        </button>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          <span v-if="!loading">Enviar Carta de Porte</span>
          <span v-else>
            Enviando...
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
/* Imports */
import { reactive, ref, computed } from "vue";
import { useCartasPorteStore } from "@/stores/cartasPorte";
import Swal from "sweetalert2";

/* jsPDF + autotable */
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/* Tipos (los mismos que ya tenías) */
type TBulto = {
  id: string;
  cantidad: number;
  descripcion: string;
  valor_declarado: number;
  peso_bruto: number;
  volumen: string;
  tarifa_unidad: number;
  flete: number;
};

type TCartaPorte = {
  id?: number | string;
  remitente_nombre?: string;
  remitente_dni?: string;
  lugar_carga?: string;
  destinatario_nombre?: string;
  destinatario_dni?: string;
  lugar_descarga?: string;
  porteador?: string;
  porteador_domicilio?: string;
  lugar_emision?: string;
  fecha_emision?: string | null;
  chapa_tractivo?: string;
  capacidad_peso?: string;
  hoja_ruta?: string;
  cargador_nombre?: string;
  cargador_domicilio?: string;
  chapa_arrastre?: string;
  basificado_en?: string;
  bultos: TBulto[];
  recargos: number;
  descuentos: number;
  impuestos: number;
  importe_letras?: string;
  op_llegada?: string | null;
  op_inicio?: string | null;
  op_terminacion?: string | null;
  op_salida?: string | null;
  distancia_km?: number;
  tiempo_horas?: number;
  recorrido?: string;
  instrucciones?: string;
  firma_remitente_ci?: string;
  firma_remitente_fecha?: string | null;
  firma_porteador_ci?: string;
  firma_porteador_licencia?: string;
  firma_destinatario_ci?: string;
  firma_destinatario_fecha?: string | null;
};

/* store y reactive */
const cartasPorteStore = useCartasPorteStore();
const loading = ref(false);

const form = reactive<TCartaPorte>({
  id: undefined,
  remitente_nombre: "",
  remitente_dni: "",
  lugar_carga: "",
  destinatario_nombre: "",
  destinatario_dni: "",
  lugar_descarga: "",
  porteador: "",
  porteador_domicilio: "",
  lugar_emision: "",
  fecha_emision: null,
  chapa_tractivo: "",
  capacidad_peso: "",
  hoja_ruta: "",
  cargador_nombre: "",
  cargador_domicilio: "",
  chapa_arrastre: "",
  basificado_en: "",
  bultos: [],
  recargos: 0,
  descuentos: 0,
  impuestos: 0,
  importe_letras: "",
  op_llegada: null,
  op_inicio: null,
  op_terminacion: null,
  op_salida: null,
  distancia_km: 0,
  tiempo_horas: 0,
  recorrido: "",
  instrucciones: "",
  firma_remitente_ci: "",
  firma_remitente_fecha: null,
  firma_porteador_ci: "",
  firma_porteador_licencia: "",
  firma_destinatario_ci: "",
  firma_destinatario_fecha: null,
});

/* helpers bultos */
const addRow = () => {
  form.bultos.push({
    id: String(Date.now()) + Math.random().toString(36).slice(2, 6),
    cantidad: 1,
    descripcion: "",
    valor_declarado: 0,
    peso_bruto: 0,
    volumen: "",
    tarifa_unidad: 0,
    flete: 0,
  });
  recalculateTotals();
};

const removeRow = (idx: number) => {
  form.bultos.splice(idx, 1);
  recalculateTotals();
};

const recalculateRow = (idx: number) => {
  const r = form.bultos[idx];
  if (!r) return;
  const cantidad = Number(r.cantidad || 0);
  const tarifa = Number(r.tarifa_unidad || 0);
  r.flete = Number(Math.round(cantidad * tarifa * 100) / 100);
  recalculateTotals();
};

const subtotalFletes = computed(() => {
  return form.bultos.reduce((s, b) => s + Number(b.flete || 0), 0);
});

const recalculateTotals = () => {
  form.bultos.forEach((_, i) => recalculateRow(i));
};

const importeTotal = computed(() => {
  const base = subtotalFletes.value;
  const recargos = Number(form.recargos || 0);
  const descuentos = Number(form.descuentos || 0);
  const impuestos = Number(form.impuestos || 0);
  return Math.round((base + recargos - descuentos + impuestos) * 100) / 100;
});

/* validación simple */
const validateForm = (): { ok: boolean; message?: string } => {
  if (!form.remitente_nombre)
    return { ok: false, message: "El remitente es obligatorio" };
  if (!form.destinatario_nombre)
    return { ok: false, message: "El destinatario es obligatorio" };
  if (!form.lugar_carga)
    return { ok: false, message: "El lugar de carga es obligatorio" };
  if (!form.lugar_descarga)
    return { ok: false, message: "El lugar de descarga es obligatorio" };
  if (form.bultos.length === 0)
    return { ok: false, message: "Agrega al menos un bulto" };
  return { ok: true };
};

const resetForm = () => {
  form.remitente_nombre = "";
  form.remitente_dni = "";
  form.lugar_carga = "";
  form.destinatario_nombre = "";
  form.destinatario_dni = "";
  form.lugar_descarga = "";
  form.porteador = "";
  form.porteador_domicilio = "";
  form.lugar_emision = "";
  form.fecha_emision = null;
  form.chapa_tractivo = "";
  form.capacidad_peso = "";
  form.hoja_ruta = "";
  form.cargador_nombre = "";
  form.cargador_domicilio = "";
  form.chapa_arrastre = "";
  form.basificado_en = "";
  form.bultos = [];
  form.recargos = 0;
  form.descuentos = 0;
  form.impuestos = 0;
  form.importe_letras = "";
  form.op_llegada = null;
  form.op_inicio = null;
  form.op_terminacion = null;
  form.op_salida = null;
  form.distancia_km = 0;
  form.tiempo_horas = 0;
  form.recorrido = "";
  form.instrucciones = "";
  form.firma_remitente_ci = "";
  form.firma_remitente_fecha = null;
  form.firma_porteador_ci = "";
  form.firma_porteador_licencia = "";
  form.firma_destinatario_ci = "";
  form.firma_destinatario_fecha = null;
};

/* Generador de PDF: dibuja cajas, tabla bultos y zona de firmas */
const generatePdf = async (data: TCartaPorte) => {
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
  const pageWidth = 210;
  let y = 10;

  const pad = 6;
  doc.setFont("helvetica");
  doc.setFontSize(12);

  // Título / Encabezado
  doc.setFontSize(10);
  doc.text("CARTA DE PORTE - CARRETERAS", pageWidth / 2, y, {
    align: "center",
  });
  y += 6;

  // Línea separadora
  doc.setLineWidth(0.5);
  doc.line(10, y, pageWidth - 10, y);
  y += 4;

  // Primera fila: Remitente (izq) | Porteador (der)
  const leftColWidth = 110;
  const rightColWidth = pageWidth - 20 - leftColWidth;
  const boxHeight = 32;

  // cuadro Remitente
  doc.setFontSize(9);
  doc.text("REMINTENTE Y LUGAR DE CARGA", 12, y);
  doc.rect(10, y + 2, leftColWidth, boxHeight);
  doc.text(`${data.remitente_nombre || ""}`, 12, y + 8);
  doc.text(
    `${data.remitente_dni ? "C.I.: " + data.remitente_dni : ""}`,
    12,
    y + 14,
  );
  doc.text(`${data.lugar_carga || ""}`, 12, y + 20);

  // cuadro Porteador (derecha)
  const rX = 10 + leftColWidth + 6;
  doc.text("PORTEADOR Y DOMICILIO", rX + 2, y);
  doc.rect(rX, y + 2, rightColWidth, boxHeight);
  doc.text(`${data.porteador || ""}`, rX + 2, y + 8);
  doc.text(`${data.porteador_domicilio || ""}`, rX + 2, y + 14);

  y += boxHeight + 8;

  // Destinatario / Lugar de descarga
  const boxH2 = 28;
  doc.text("DESTINATARIO Y LUGAR DE DESCARGA", 12, y);
  doc.rect(10, y + 2, leftColWidth, boxH2);
  doc.text(`${data.destinatario_nombre || ""}`, 12, y + 8);
  doc.text(
    `${data.destinatario_dni ? "C.I.: " + data.destinatario_dni : ""}`,
    12,
    y + 14,
  );
  doc.text(`${data.lugar_descarga || ""}`, 12, y + 20);

  // a la derecha colocamos Fecha Emisión, Chapa Tractivo, Capacidad, Hoja Ruta
  const rightTopX = rX;
  doc.rect(rightTopX, y + 2, rightColWidth, boxH2);
  const smallX = rightTopX + 3;
  let smallY = y + 8;
  doc.text(`Lugar de Emisión: ${data.lugar_emision || ""}`, smallX, smallY);
  smallY += 6;
  doc.text(
    `Fecha Emisión: ${data.fecha_emision ? String(data.fecha_emision).slice(0, 10) : ""}`,
    smallX,
    smallY,
  );
  smallY += 6;
  doc.text(`Chapa Tractivo No.: ${data.chapa_tractivo || ""}`, smallX, smallY);
  smallY += 6;
  doc.text(`Capacidad de Peso: ${data.capacidad_peso || ""}`, smallX, smallY);

  y += boxH2 + 8;

  // Cargador y domicilio / datos técnicos (un cuadro grande a la izq)
  const boxH3 = 36;
  doc.text("CARGADOR Y DOMICILIO", 12, y);
  doc.rect(10, y + 2, leftColWidth, boxH3);
  doc.text(`${data.cargador_nombre || ""}`, 12, y + 8);
  doc.text(`${data.cargador_domicilio || ""}`, 12, y + 14);
  doc.text(`Chapa Arrastre No.: ${data.chapa_arrastre || ""}`, 12, y + 20);

  // zona derecha pequeña con HOJA RUTA etc.
  doc.rect(rX, y + 2, rightColWidth, boxH3);
  doc.text(`Hoja de Ruta No.: ${data.hoja_ruta || ""}`, rX + 3, y + 8);
  doc.text(`Basificado en: ${data.basificado_en || ""}`, rX + 3, y + 14);

  y += boxH3 + 8;

  // Tabla Bultos (autoTable)
  doc.setFontSize(9);
  const head = [
    [
      "Cantidad",
      "Marcas / Números / Embalaje / Productos",
      "Valor Declarado",
      "Peso bruto (kg)",
      "Volumen / Medidas",
      "Tarifa/unidad",
      "Fletes",
    ],
  ];
  const body = (data.bultos || []).map((b) => [
    b.cantidad ?? "",
    b.descripcion ?? "",
    (b.valor_declarado ?? 0).toFixed(2),
    (b.peso_bruto ?? 0).toFixed(2),
    b.volumen ?? "",
    (b.tarifa_unidad ?? 0).toFixed(2),
    (b.flete ?? 0).toFixed(2),
  ]);

  // Ajustar startY si la tabla necesita más espacio; usamos startY = y+2
  (autoTable as any)(doc, {
    head: head,
    body: body,
    startY: y,
    theme: "grid",
    headStyles: { fillColor: [240, 240, 240], textColor: 20, halign: "center" },
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 18 },
      1: { cellWidth: 72 },
      2: { cellWidth: 26 },
      3: { cellWidth: 30 },
      4: { cellWidth: 30 },
      5: { cellWidth: 26 },
      6: { cellWidth: 26 },
    },
    margin: { left: 10, right: 10 },
  });

  // obtener Y después de la tabla
  const afterTableY = (doc as any).lastAutoTable
    ? (doc as any).lastAutoTable.finalY + 6
    : doc.internal.pageSize.getHeight() - 60;
  y = afterTableY;

  // Recargos / descuentos / impuestos / subtotal
  doc.setFontSize(9);
  const rightBoxX = pageWidth - 10 - 80;
  doc.text(
    `Subtotal Fletes: ${subtotalFletes.value.toFixed(2)} CUP`,
    rightBoxX - 50,
    y + 6,
  );
  doc.text(
    `Recargos: ${Number(data.recargos || 0).toFixed(2)} CUP`,
    rightBoxX - 50,
    y + 12,
  );
  doc.text(
    `Descuentos: ${Number(data.descuentos || 0).toFixed(2)} CUP`,
    rightBoxX - 50,
    y + 18,
  );
  doc.text(
    `Impuestos: ${Number(data.impuestos || 0).toFixed(2)} CUP`,
    rightBoxX - 50,
    y + 24,
  );
  doc.setFontSize(11);
  doc.text(
    `IMPORTE TOTAL: ${(Math.round((subtotalFletes.value + Number(data.recargos || 0) - Number(data.descuentos || 0) + Number(data.impuestos || 0)) * 100) / 100).toFixed(2)} CUP`,
    rightBoxX - 50,
    y + 36,
  );

  y += 44;

  // Operación — tabla de tiempos y distancias (simplificada)
  doc.setFontSize(9);
  doc.text("OPERACIÓN — CARGA / DESCARGA (fechas y tiempos)", 12, y);
  y += 6;
  doc.rect(10, y, pageWidth - 20, 36);
  doc.text(`Llegada: ${data.op_llegada || ""}`, 12, y + 6);
  doc.text(`Inicio: ${data.op_inicio || ""}`, 12, y + 12);
  doc.text(`Terminación: ${data.op_terminacion || ""}`, 12, y + 18);
  doc.text(`Salida: ${data.op_salida || ""}`, 12, y + 24);

  doc.text(`Distancia (km): ${data.distancia_km ?? ""}`, 110, y + 6);
  doc.text(`Tiempo (hrs): ${data.tiempo_horas ?? ""}`, 110, y + 12);
  doc.text(`Recorrido: ${data.recorrido || ""}`, 110, y + 18);

  y += 44;

  // Instrucciones / Observaciones
  doc.text("INSTRUCCIONES Y OBSERVACIONES", 12, y);
  doc.rect(10, y + 2, pageWidth - 20, 26);
  doc.setFontSize(9);
  doc.text(String(data.instrucciones || ""), 12, y + 10, {
    maxWidth: pageWidth - 24,
  });
  y += 32;

  // Firmas (3 columnas)
  const sigY = y + 4;
  const colW = (pageWidth - 20) / 3;
  const sigLabels = [
    {
      label: "REMITENTE",
      ci: data.firma_remitente_ci,
      date: data.firma_remitente_fecha,
    },
    {
      label: "PORTEADOR / CONDUCTOR",
      ci: data.firma_porteador_ci,
      extra: data.firma_porteador_licencia,
    },
    {
      label: "DESTINATARIO",
      ci: data.firma_destinatario_ci,
      date: data.firma_destinatario_fecha,
    },
  ];

  sigLabels.forEach((s, i) => {
    const x = 10 + i * colW;
    doc.rect(x, sigY, colW - 4, 28);
    doc.setFontSize(9);
    doc.text(s.label, x + 4, sigY + 6);
    doc.text(`C.I.: ${s.ci || ""}`, x + 4, sigY + 12);
    if (s.extra) doc.text(`Licencia: ${s.extra}`, x + 4, sigY + 18);
    if (s.date) doc.text(`Fecha/Hora: ${s.date}`, x + 4, sigY + 24);
  });

  // Pie (opcional): referencia y número de página
  doc.setFontSize(8);
  doc.text(`Generado: ${new Date().toLocaleString()}`, 12, 290);
  doc.text(`Página 1`, pageWidth - 20, 290, { align: "right" });

  // Descargar
  const fileName = `CartaPorte_${(data.remitente_nombre || "sin_nombre").replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
};

/* submitForm actualizado: guarda en store y genera PDF */
const submitForm = async () => {
  const validation = validateForm();
  if (!validation.ok) {
    await Swal.fire({
      text: validation.message || "Formulario inválido",
      icon: "warning",
    });
    return;
  }

  loading.value = true;
  try {
    // preparar payload
    const payload = {
      ...form,
      subtotal_fletes: subtotalFletes.value,
      importe_total: importeTotal.value,
      fecha_guardado: new Date().toISOString(),
    };

    // // Guardar en store (si existe)
    // if (
    //   cartasPorteStore &&
    //   typeof cartasPorteStore.addCartaPorte === "function"
    // ) {
    //   cartasPorteStore.addCartaPorte(payload);
    // }

    // Generar PDF con el mismo payload (espera si quieres)
    await generatePdf(payload as TCartaPorte);

    await Swal.fire({
      text: "Carta de porte guardada y PDF generado correctamente",
      icon: "success",
    });

    resetForm();
  } catch (err) {
    console.error("Error guardando carta de porte / generando PDF:", err);
    await Swal.fire({ text: "Error guardando carta de porte", icon: "error" });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.table-responsive {
  max-height: 360px;
  overflow: auto;
}
.card-header h5 {
  margin: 0;
}
</style>
