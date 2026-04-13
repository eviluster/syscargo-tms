<template>
  <div class="page-wrap">
    <main class="hoja-ruta-full">
      <form
        class="hoja-form"
        id="cartaPorteForm"
        @submit.prevent="submitForm"
        novalidate
      >
        <div class="form-header">
          <h1>Carta de Porte — Terrestre</h1>
          <div class="meta">Emitir / Crear documento</div>
        </div>

        <!-- REMITENTE / LUGAR DE CARGA -->
        <section class="card-block">
          <h4 class="block-title">Remitente y Lugar de Carga</h4>
          <div class="grid-3">
            <div class="field-box">
              <div class="f-label">Remitente (Nombre)</div>
              <div class="f-value">
                <input v-model="form.remitente_nombre" type="text" />
              </div>
            </div>

            <div class="field-box">
              <div class="f-label">Remitente (C.I. / Tax ID)</div>
              <div class="f-value">
                <input v-model="form.remitente_dni" type="text" />
              </div>
            </div>

            <div class="field-box wide">
              <div class="f-label">Lugar de carga / Dirección</div>
              <div class="f-value">
                <input v-model="form.lugar_carga" type="text" />
              </div>
            </div>
          </div>
        </section>

        <!-- DESTINATARIO / LUGAR DE DESCARGA -->
        <section class="card-block">
          <h4 class="block-title">Destinatario y Lugar de Descarga</h4>
          <div class="grid-3">
            <div class="field-box">
              <div class="f-label">Destinatario (Nombre)</div>
              <div class="f-value">
                <input v-model="form.destinatario_nombre" type="text" />
              </div>
            </div>

            <div class="field-box">
              <div class="f-label">Destinatario (C.I.)</div>
              <div class="f-value">
                <input v-model="form.destinatario_dni" type="text" />
              </div>
            </div>

            <div class="field-box wide">
              <div class="f-label">Lugar de descarga / Dirección</div>
              <div class="f-value">
                <input v-model="form.lugar_descarga" type="text" />
              </div>
            </div>
          </div>
        </section>

        <!-- PORTEADOR / DATOS TÉCNICOS -->
        <section class="card-block">
          <h4 class="block-title">Porteador / Datos técnicos</h4>
          <div class="grid-3">
            <div class="field-box">
              <div class="f-label">Porteador / Conductor</div>
              <div class="f-value">
                <input v-model="form.porteador" type="text" />
              </div>
            </div>

            <div class="field-box">
              <div class="f-label">Domicilio Porteador</div>
              <div class="f-value">
                <input v-model="form.porteador_domicilio" type="text" />
              </div>
            </div>

            <div class="field-box">
              <div class="f-label">Lugar de Emisión</div>
              <div class="f-value">
                <input v-model="form.lugar_emision" type="text" />
              </div>
            </div>

            <div class="field-box">
              <div class="f-label">Fecha de Emisión</div>
              <div class="f-value">
                <input v-model="form.fecha_emision" type="date" />
              </div>
            </div>

            <div class="field-box">
              <div class="f-label">Chapa Tractivo Nº</div>
              <div class="f-value">
                <input v-model="form.chapa_tractivo" type="text" />
              </div>
            </div>

            <div class="field-box">
              <div class="f-label">Capacidad de Peso</div>
              <div class="f-value">
                <input v-model="form.capacidad_peso" type="text" />
              </div>
            </div>

            <div class="field-box">
              <div class="f-label">Hoja de Ruta Nº</div>
              <div class="f-value">
                <input v-model="form.hoja_ruta" type="text" />
              </div>
            </div>

            <div class="field-box">
              <div class="f-label">Cargador (Nombre)</div>
              <div class="f-value">
                <input v-model="form.cargador_nombre" type="text" />
              </div>
            </div>

            <div class="field-box">
              <div class="f-label">Cargador (Domicilio)</div>
              <div class="f-value">
                <input v-model="form.cargador_domicilio" type="text" />
              </div>
            </div>

            <div class="field-box">
              <div class="f-label">Chapa Arrastre Nº</div>
              <div class="f-value">
                <input v-model="form.chapa_arrastre" type="text" />
              </div>
            </div>

            <div class="field-box">
              <div class="f-label">Basificado en</div>
              <div class="f-value">
                <input v-model="form.basificado_en" type="text" />
              </div>
            </div>

            <div class="field-box count-box">
              <div class="f-label">Bultos (cantidad filas)</div>
              <div class="f-value">
                <input :value="form.bultos.length" readonly />
              </div>
            </div>
          </div>
        </section>

        <!-- TABLA BULTOS -->
        <section class="card-block">
          <h4 class="block-title">Detalle de Bultos / Mercancías</h4>
          <div class="table-actions">
            <button
              type="button"
              class="btn btn-sm btn-success"
              @click="addRow"
            >
              + Añadir bulto
            </button>
          </div>

          <div class="table-wrap">
            <table class="table bultos-table">
              <thead>
                <tr>
                  <th style="width: 80px; color: #6b7280">Cantidad</th>
                  <th style="color: #6b7280">Marcas / Números / Productos</th>
                  <th style="width: 120px; color: #6b7280">Valor declarado</th>
                  <th style="width: 120px; color: #6b7280">Peso bruto (kg)</th>
                  <th style="width: 120px; color: #6b7280">Volumen</th>
                  <th style="width: 120px; color: #6b7280">Tarifa unidad</th>
                  <th style="width: 120px; color: #6b7280">Flete</th>
                  <th style="width: 60px">—</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(r, idx) in form.bultos" :key="r.id">
                  <td>
                    <input
                      v-model.number="r.cantidad"
                      @input="recalculateRow(idx)"
                      type="number"
                      min="1"
                    />
                  </td>
                  <td><input v-model="r.descripcion" type="text" /></td>
                  <td>
                    <input
                      v-model.number="r.valor_declarado"
                      @input="recalculateRow(idx)"
                      type="number"
                      step="0.01"
                    />
                  </td>
                  <td>
                    <input
                      v-model.number="r.peso_bruto"
                      @input="recalculateRow(idx)"
                      type="number"
                      step="0.01"
                    />
                  </td>
                  <td><input v-model="r.volumen" type="text" /></td>
                  <td>
                    <input
                      v-model.number="r.tarifa_unidad"
                      @input="recalculateRow(idx)"
                      type="number"
                      step="0.01"
                    />
                  </td>
                  <td>
                    <input
                      v-model.number="r.flete"
                      readonly
                      type="number"
                      step="0.01"
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
                  <td colspan="8" class="text-center text-muted">
                    No hay bultos añadidos
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="totals-right">
            <div class="small muted">Subtotal Fletes</div>
            <div class="bold">{{ subtotalFletes.toFixed(2) }} CUP</div>
          </div>
        </section>

        <!-- RECARGOS / DESCUENTOS / IMPUESTOS -->
        <section class="card-block">
          <h4 class="block-title">Recargos / Descuentos / Importe</h4>
          <div class="grid-3">
            <div class="field-box">
              <div class="f-label">Recargos</div>
              <div class="f-value">
                <input
                  v-model.number="form.recargos"
                  @input="recalculateTotals"
                  type="number"
                  step="0.01"
                />
              </div>
            </div>

            <div class="field-box">
              <div class="f-label">Descuentos</div>
              <div class="f-value">
                <input
                  v-model.number="form.descuentos"
                  @input="recalculateTotals"
                  type="number"
                  step="0.01"
                />
              </div>
            </div>

            <div class="field-box">
              <div class="f-label">Impuestos</div>
              <div class="f-value">
                <input
                  v-model.number="form.impuestos"
                  @input="recalculateTotals"
                  type="number"
                  step="0.01"
                />
              </div>
            </div>

            <div class="field-box">
              <div class="f-label">Importe Total</div>
              <div class="f-value">
                <input :value="importeTotal.toFixed(2)" readonly />
              </div>
            </div>

            <div class="field-box wide">
              <div class="f-label">Importe Total (en letras)</div>
              <div class="f-value">
                <input v-model="form.importe_letras" type="text" />
              </div>
            </div>
          </div>
        </section>

        <!-- OPERACIÓN: más separación entre campos -->
        <section class="card-block">
          <h4 class="block-title">Operación — Carga / Descarga</h4>
          <div class="grid-op">
            <div class="field-box op-field">
              <div class="f-label">Llegada (fecha/hora)</div>
              <div class="f-value">
                <input v-model="form.op_llegada" type="datetime-local" />
              </div>
            </div>
            <div class="field-box op-field">
              <div class="f-label">Inicio (fecha/hora)</div>
              <div class="f-value">
                <input v-model="form.op_inicio" type="datetime-local" />
              </div>
            </div>
            <div class="field-box op-field">
              <div class="f-label">Terminación (fecha/hora)</div>
              <div class="f-value">
                <input v-model="form.op_terminacion" type="datetime-local" />
              </div>
            </div>
            <div class="field-box op-field">
              <div class="f-label">Salida (fecha/hora)</div>
              <div class="f-value">
                <input v-model="form.op_salida" type="datetime-local" />
              </div>
            </div>

            <div class="field-box">
              <div class="f-label">Distancia (km)</div>
              <div class="f-value">
                <input
                  v-model.number="form.distancia_km"
                  type="number"
                  min="0"
                />
              </div>
            </div>

            <div class="field-box">
              <div class="f-label">Tiempo estimado (horas)</div>
              <div class="f-value">
                <input
                  v-model.number="form.tiempo_horas"
                  type="number"
                  min="0"
                />
              </div>
            </div>

            <div class="field-box wide">
              <div class="f-label">Recorrido (breve)</div>
              <div class="f-value">
                <input v-model="form.recorrido" type="text" />
              </div>
            </div>
          </div>
        </section>

        <!-- INSTRUCCIONES -->
        <section class="card-block">
          <h4 class="block-title">Instrucciones y Observaciones</h4>
          <div class="field-box wide">
            <div class="f-label">Instrucciones</div>
            <div class="f-value">
              <textarea v-model="form.instrucciones" rows="4"></textarea>
            </div>
          </div>
        </section>

        <!-- FIRMAS -->
        <section class="card-block">
          <h4 class="block-title">Firmas</h4>
          <div class="grid-3">
            <div class="field-box">
              <div class="f-label">Remitente — C.I.</div>
              <div class="f-value">
                <input v-model="form.firma_remitente_ci" type="text" />
              </div>
              <div class="f-label mt">Fecha y Hora Despacho</div>
              <div class="f-value">
                <input
                  v-model="form.firma_remitente_fecha"
                  type="datetime-local"
                />
              </div>
            </div>

            <div class="field-box">
              <div class="f-label">Porteador — C.I.</div>
              <div class="f-value">
                <input v-model="form.firma_porteador_ci" type="text" />
              </div>
              <div class="f-label mt">Licencia Nº</div>
              <div class="f-value">
                <input v-model="form.firma_porteador_licencia" type="text" />
              </div>
            </div>

            <div class="field-box">
              <div class="f-label">Destinatario — C.I.</div>
              <div class="f-value">
                <input v-model="form.firma_destinatario_ci" type="text" />
              </div>
              <div class="f-label mt">Fecha y Hora Recepción</div>
              <div class="f-value">
                <input
                  v-model="form.firma_destinatario_fecha"
                  type="datetime-local"
                />
              </div>
            </div>
          </div>
        </section>

        <!-- BOTONES -->
        <div class="actions">
          <button type="button" class="btn-muted" @click="resetForm">
            Cancelar
          </button>
          <button type="submit" class="btn" :disabled="loading">
            <span v-if="!loading">Generar Carta Porte (PDF)</span>
            <span v-else>Generando... <span class="spinner" /></span>
          </button>
        </div>
      </form>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import html2pdf from "html2pdf.js";
import { v4 as uuidv4 } from "uuid";
// Si quieres hacer fetch por cargaId, descomenta la siguiente línea
// import api from "@/services/api";

type Bulto = {
  id: string;
  cantidad: number;
  descripcion: string;
  valor_declarado: number;
  peso_bruto: number;
  volumen: string;
  tarifa_unidad: number;
  flete: number;
};

const loading = ref(false);
const form = reactive({
  remitente_nombre: "",
  remitente_dni: "",
  lugar_carga: "",
  destinatario_nombre: "",
  destinatario_dni: "",
  lugar_descarga: "",
  porteador: "",
  porteador_domicilio: "",
  lugar_emision: "",
  fecha_emision: "" as string | null,
  chapa_tractivo: "",
  capacidad_peso: "",
  hoja_ruta: "",
  cargador_nombre: "",
  cargador_domicilio: "",
  chapa_arrastre: "",
  basificado_en: "",
  bultos: [] as Bulto[],
  recargos: 0,
  descuentos: 0,
  impuestos: 0,
  importe_letras: "",
  op_llegada: "" as string | null,
  op_inicio: "" as string | null,
  op_terminacion: "" as string | null,
  op_salida: "" as string | null,
  distancia_km: 0,
  tiempo_horas: 0,
  recorrido: "",
  instrucciones: "",
  firma_remitente_ci: "",
  firma_remitente_fecha: "" as string | null,
  firma_porteador_ci: "",
  firma_porteador_licencia: "",
  firma_destinatario_ci: "",
  firma_destinatario_fecha: "" as string | null,
});

function addRow() {
  form.bultos.push({
    id: uuidv4(),
    cantidad: 1,
    descripcion: "",
    valor_declarado: 0,
    peso_bruto: 0,
    volumen: "",
    tarifa_unidad: 0,
    flete: 0,
  });
}
function removeRow(idx: number) {
  form.bultos.splice(idx, 1);
}
function recalculateRow(idx: number) {
  const r = form.bultos[idx];
  if (!r) return;
  r.flete = Number((r.cantidad * (Number(r.tarifa_unidad) || 0)).toFixed(2));
  // trigger totals
  recalculateTotals();
}

const subtotalFletes = computed(() =>
  form.bultos.reduce((s, b) => s + Number(b.flete || 0), 0),
);
const importeTotal = computed(() => {
  const base = subtotalFletes.value;
  const rec = Number(form.recargos || 0);
  const desc = Number(form.descuentos || 0);
  const imp = Number(form.impuestos || 0);
  return Number((base + rec - desc + imp).toFixed(2));
});
function recalculateTotals() {
  // placeholder if you want extra logic later
}

function resetForm() {
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
}

function validateForm() {
  const errors: string[] = [];
  if (!form.remitente_nombre || !String(form.remitente_nombre).trim())
    errors.push("Remitente (nombre) es obligatorio.");
  if (!form.destinatario_nombre || !String(form.destinatario_nombre).trim())
    errors.push("Destinatario (nombre) es obligatorio.");
  if (!form.lugar_carga || !String(form.lugar_carga).trim())
    errors.push("Lugar de carga es obligatorio.");
  if (form.bultos.length === 0) errors.push("Debes añadir al menos un bulto.");
  form.bultos.forEach((b, i) => {
    if (!b.descripcion) errors.push(`Bulto ${i + 1}: descripción requerida.`);
    if (!b.cantidad || b.cantidad <= 0)
      errors.push(`Bulto ${i + 1}: cantidad inválida.`);
  });
  return errors;
}

function escapeHtml(str: any = "") {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildPrintableHtml() {
  const fechaEmision = form.fecha_emision || "";
  const bultosRows = form.bultos
    .map(
      (b) => `
      <tr>
        <td style="padding:6px;border:1px solid #000;">${escapeHtml(String(b.cantidad))}</td>
        <td style="padding:6px;border:1px solid #000;">${escapeHtml(b.descripcion)}</td>
        <td style="padding:6px;border:1px solid #000;">${escapeHtml(String(b.valor_declarado || ""))}</td>
        <td style="padding:6px;border:1px solid #000;">${escapeHtml(String(b.peso_bruto || ""))}</td>
        <td style="padding:6px;border:1px solid #000;">${escapeHtml(b.volumen || "")}</td>
        <td style="padding:6px;border:1px solid #000;">${escapeHtml(String(b.tarifa_unidad || ""))}</td>
        <td style="padding:6px;border:1px solid #000;">${escapeHtml(String(b.flete || ""))}</td>
      </tr>`,
    )
    .join("");

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; color:#000; box-sizing:border-box; padding:12mm;">
      <div style="width:190mm; margin:0 auto; border:1px solid #000; padding:12mm; background:#fff;">
        <header style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <h1 style="margin:0;font-size:20px;color:#000;">CARTA DE PORTE</h1>
          <div style="font-size:13px;">Emitido: ${escapeHtml(fechaEmision)}</div>
        </header>

        <section style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:12px;">
          <div style="border:1px solid #000;padding:8px;"><div style="font-weight:700;font-size:11px;">Remitente</div><div style="font-size:13px;">${escapeHtml(form.remitente_nombre)}</div><div style="font-size:12px;color:#333;">CI: ${escapeHtml(form.remitente_dni)}</div></div>
          <div style="border:1px solid #000;padding:8px;"><div style="font-weight:700;font-size:11px;">Lugar de Carga</div><div style="font-size:13px;">${escapeHtml(form.lugar_carga)}</div></div>
          <div style="border:1px solid #000;padding:8px;"><div style="font-weight:700;font-size:11px;">Destinatario</div><div style="font-size:13px;">${escapeHtml(form.destinatario_nombre)}</div><div style="font-size:12px;color:#333;">CI: ${escapeHtml(form.destinatario_dni)}</div></div>

          <div style="border:1px solid #000;padding:8px;"><div style="font-weight:700;font-size:11px;">Lugar de Descarga</div><div style="font-size:13px;">${escapeHtml(form.lugar_descarga)}</div></div>
          <div style="border:1px solid #000;padding:8px;"><div style="font-weight:700;font-size:11px;">Porteador</div><div style="font-size:13px;">${escapeHtml(form.porteador)}</div><div style="font-size:12px;">${escapeHtml(form.porteador_domicilio)}</div></div>
          <div style="border:1px solid #000;padding:8px;"><div style="font-weight:700;font-size:11px;">Vehículo</div><div style="font-size:13px;">Tractivo: ${escapeHtml(form.chapa_tractivo)}</div><div style="font-size:13px;">Arrastre: ${escapeHtml(form.chapa_arrastre)}</div><div style="font-size:13px;">Hoja Ruta: ${escapeHtml(form.hoja_ruta)}</div></div>
        </section>

        <section style="border:1px solid #000;padding:8px;margin-bottom:12px;">
          <div style="font-weight:700;margin-bottom:6px;">Detalle de Bultos / Mercancías</div>
          <table style="width:100%;border-collapse:collapse;font-size:12px;">
            <thead><tr><th style="border:1px solid #000;padding:6px;">Cantidad</th><th style="border:1px solid #000;padding:6px;">Marcas / Productos</th><th style="border:1px solid #000;padding:6px;">Valor</th><th style="border:1px solid #000;padding:6px;">Peso</th><th style="border:1px solid #000;padding:6px;">Volumen</th><th style="border:1px solid #000;padding:6px;">Tarifa</th><th style="border:1px solid #000;padding:6px;">Flete</th></tr></thead>
            <tbody>${bultosRows || '<tr><td colspan="7" style="padding:8px;text-align:center;">No hay bultos</td></tr>'}</tbody>
          </table>
          <div style="text-align:right;margin-top:8px;font-weight:700;">Subtotal Fletes: ${escapeHtml(subtotalFletes.value.toFixed(2))} CUP</div>
        </section>

        <section style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
          <div style="border:1px solid #000;padding:8px;">
            <div style="font-weight:700;margin-bottom:6px;">Recargos / Descuentos / Impuestos</div>
            <div>Recargos: ${escapeHtml(String(form.recargos))} &nbsp; Descuentos: ${escapeHtml(String(form.descuentos))} &nbsp; Impuestos: ${escapeHtml(String(form.impuestos))}</div>
            <div style="margin-top:6px;font-weight:700;">Importe Total: ${escapeHtml(importeTotal.value.toFixed(2))} CUP</div>
            <div style="margin-top:6px;">(${escapeHtml(form.importe_letras || "")})</div>
          </div>

          <div style="border:1px solid #000;padding:8px;">
            <div style="font-weight:700;margin-bottom:6px;">Operación y Recorrido</div>
            <div>Llegada: ${escapeHtml(form.op_llegada || "")}</div>
            <div>Inicio: ${escapeHtml(form.op_inicio || "")}</div>
            <div>Terminación: ${escapeHtml(form.op_terminacion || "")}</div>
            <div>Salida: ${escapeHtml(form.op_salida || "")}</div>
            <div style="margin-top:6px;">Distancia: ${escapeHtml(String(form.distancia_km))} km — Tiempo: ${escapeHtml(String(form.tiempo_horas))} h</div>
            <div style="margin-top:6px;">Recorrido: ${escapeHtml(form.recorrido)}</div>
          </div>
        </section>

        <section style="border:1px solid #000;padding:8px;margin-bottom:12px;">
          <div style="font-weight:700;">Instrucciones / Observaciones</div>
          <div style="white-space:pre-wrap;margin-top:6px;">${escapeHtml(form.instrucciones || "")}</div>
        </section>

        <section style="display:flex;gap:8px;">
          <div style="flex:1;border:1px solid #000;padding:8px;">
            <div style="font-weight:700;">Remitente — C.I.</div>
            <div>${escapeHtml(form.firma_remitente_ci)}</div>
            <div style="margin-top:6px;">Fecha y Hora Despacho: ${escapeHtml(form.firma_remitente_fecha || "")}</div>
          </div>
          <div style="flex:1;border:1px solid #000;padding:8px;">
            <div style="font-weight:700;">Porteador — C.I.</div>
            <div>${escapeHtml(form.firma_porteador_ci)}</div>
            <div style="margin-top:6px;">Licencia: ${escapeHtml(form.firma_porteador_licencia)}</div>
          </div>
          <div style="flex:1;border:1px solid #000;padding:8px;">
            <div style="font-weight:700;">Destinatario — C.I.</div>
            <div>${escapeHtml(form.firma_destinatario_ci)}</div>
            <div style="margin-top:6px;">Fecha y Hora Recepción: ${escapeHtml(form.firma_destinatario_fecha || "")}</div>
          </div>
        </section>
      </div>
    </div>
  `;

  return html;
}

async function generatePdfFromForm() {
  const errors = validateForm();
  if (errors.length) {
    console.warn("[carta] Errores de validación:", errors);
    await alert("Corrige:\n" + errors.join("\n"));
    return;
  }

  loading.value = true;
  try {
    console.log("[carta] Inicio generación PDF");
    console.log("[carta] snapshot form:", JSON.parse(JSON.stringify(form)));

    const printableHtml = buildPrintableHtml();
    console.log("[carta] HTML generado (chars):", printableHtml.length);

    const iframe = document.createElement("iframe");
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
    console.log("[carta] iframe temporal agregado al DOM.");

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) throw new Error("No se pudo obtener document del iframe.");

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

    const body = iframe.contentWindow?.document.body;
    if (!body) throw new Error("No se pudo medir contenido del iframe.");
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
    console.log("[carta] content px:", { contentWidthPx, contentHeightPx });

    const pxToMm = (px: number) => px * 0.264583;
    let widthMm = Math.round(pxToMm(contentWidthPx) * 100) / 100;
    let heightMm = Math.round(pxToMm(contentHeightPx) * 100) / 100;

    const marginTopMm = 10,
      marginBottomMm = 10,
      marginLeftMm = 10,
      marginRightMm = 10;
    if (!isFinite(widthMm) || widthMm <= 0) widthMm = 190;
    if (!isFinite(heightMm) || heightMm <= 0) heightMm = 140;

    const pageWidthMm =
      Math.round((widthMm + marginLeftMm + marginRightMm) * 100) / 100;
    const pageHeightMm =
      Math.round((heightMm + marginTopMm + marginBottomMm) * 100) / 100;

    console.log("[carta] tamaño contenido mm (W x H):", widthMm, "x", heightMm);
    console.log(
      "[carta] tamaño final página mm con márgenes (W x H):",
      pageWidthMm,
      pageHeightMm,
    );

    const now = new Date();
    const fname = `CartaPorte_${form.hoja_ruta || "sin_num"}_${now.toISOString().slice(0, 19).replace(/[:T]/g, "-")}.pdf`;

    const opt = {
      margin: [marginTopMm, marginLeftMm, marginBottomMm, marginRightMm],
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
        format: [pageWidthMm, pageHeightMm],
        orientation: "portrait" as const,
      },
    };
    console.log("[carta] opciones html2pdf:", opt);

    await html2pdf().set(opt).from(iframe.contentWindow!.document.body).save();
    console.log("[carta] PDF generado:", fname);

    document.body.removeChild(iframe);
    console.log("[carta] iframe temporal removido.");
    alert("PDF generado: " + fname);
  } catch (err: any) {
    console.error("[carta] Error generando PDF:", err);
    alert("Error generando PDF: " + (err?.message || String(err)));
  } finally {
    loading.value = false;
  }
}

async function submitForm() {
  await generatePdfFromForm();
}

/**
 * --- PREFILL desde query params (Opción A)
 * Lee: emisor_nombre -> form.remitente_nombre
 *      emisor_dni    -> form.remitente_dni (y firma_remitente_ci si está vacío)
 *      nombre_destinatario -> form.destinatario_nombre
 * También soporta keys alternativas: remitente_nombre, remitente_dni, destinatario_nombre, cargaId / carga_id
 */
const route = useRoute();

onMounted(async () => {
  try {
    const q = route.query ?? {};

    // helpers para obtener string seguros
    const qStr = (k: string) => {
      const v = q[k as keyof typeof q];
      if (Array.isArray(v)) return String(v[0] ?? "");
      return String(v ?? "");
    };

    // Mapear emisor -> remitente
    const emisorNombre = (
      qStr("emisor_nombre") ||
      qStr("remitente_nombre") ||
      qStr("remitenteName") ||
      ""
    ).trim();
    const emisorDni = (
      qStr("emisor_dni") ||
      qStr("remitente_dni") ||
      qStr("remitenteDni") ||
      ""
    ).trim();
    const nombreDest = (
      qStr("nombre_destinatario") ||
      qStr("destinatario_nombre") ||
      qStr("destinatarioName") ||
      ""
    ).trim();

    if (emisorNombre && !String(form.remitente_nombre).trim()) {
      form.remitente_nombre = emisorNombre;
    }
    if (emisorDni && !String(form.remitente_dni).trim()) {
      form.remitente_dni = emisorDni;
    }
    // Si el campo de firma_remitente_ci está vacío, podemos copiar ahí también (opcional)
    if (emisorDni && !String(form.firma_remitente_ci).trim()) {
      form.firma_remitente_ci = emisorDni;
    }
    if (nombreDest && !String(form.destinatario_nombre).trim()) {
      form.destinatario_nombre = nombreDest;
    }

    // cargaId fallback: si existiera y faltan datos, se puede hacer un fetch al backend para completar.
    const cargaId = (
      qStr("cargaId") ||
      qStr("carga_id") ||
      qStr("cargaId") ||
      ""
    ).trim();
    if (cargaId) {
      const needFetch =
        !emisorNombre &&
        !emisorDni &&
        !nombreDest &&
        (!form.remitente_nombre ||
          !form.remitente_dni ||
          !form.destinatario_nombre);

      if (needFetch) {
        try {
          // Opcional: si quieres que traiga los datos desde el backend usando cargaId,
          // descomenta la importación de `api` más arriba y la siguiente sección.
          //
          // const resp = await api.get(`/carga/${cargaId}`);
          // const data = resp.data?.data ?? resp.data;
          // if (data) {
          //   if (data.emisor_nombre && !form.remitente_nombre) form.remitente_nombre = data.emisor_nombre;
          //   if (data.emisor_dni && !form.remitente_dni) {
          //     form.remitente_dni = data.emisor_dni;
          //     if (!form.firma_remitente_ci) form.firma_remitente_ci = data.emisor_dni;
          //   }
          //   if (data.nombre_destinatario && !form.destinatario_nombre) form.destinatario_nombre = data.nombre_destinatario;
          //   // puedes mapear más campos según la respuesta del backend
          // }
        } catch (err) {
          // no romper la carga del formulario si falla el fetch
          // console.warn("No se pudo obtener carga por cargaId:", err);
        }
      }
    }
  } catch (err) {
    console.error("Error prefill CartaP desde query:", err);
  }
});
</script>

<style scoped>
/* Page layout like the Hoja de Ruta style */
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

.hoja-ruta-full {
  width: 100%;
  max-width: 1100px;
  box-sizing: border-box;
  padding: 18px;
}

/* Form container */
.hoja-form {
  width: 100%;
  padding: 18px;
  border-radius: 10px;
  background: #ffffff; /* white form background */
  box-shadow: 0 6px 18px rgba(16, 24, 40, 0.06);
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-sizing: border-box;
}

/* Header */
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}
.form-header h1 {
  margin: 0;
  font-size: 20px;
  color: #000;
  font-weight: 700;
}
.form-header .meta {
  font-size: 13px;
  color: #374151;
}

/* Card block */
.card-block {
  margin-bottom: 14px;
}
.block-title {
  margin: 0 0 8px 0;
  font-size: 15px;
  color: #0f172a;
  font-weight: 700;
}

/* Grid helpers */
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.grid-op {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
} /* more separation for op fields */
.grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

/* Field box (recuadro) */
.field-box {
  border: 1px solid rgba(2, 6, 23, 0.12);
  border-radius: 8px;
  padding: 10px;
  background: #fff;
  box-sizing: border-box;
  min-height: 56px;
}
.field-box.wide {
  grid-column: span 1;
} /* wide handled by layout, but keep consistent */
.field-box.count-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

/* labels & values */
.f-label {
  font-weight: 700;
  font-size: 12px;
  color: #0f172a;
  margin-bottom: 6px;
}
.f-value input,
.f-value textarea {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  font-size: 13px;
  color: #0f172a;
  box-sizing: border-box;
  background: transparent;
}
.f-value textarea {
  min-height: 80px;
}

/* Table */
.table-wrap {
  overflow: auto;
  max-height: 360px;
  margin-top: 6px;
}
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.table thead th {
  background: #fafafa;
  padding: 8px;
  text-align: left;
  border-bottom: 2px solid rgba(0, 0, 0, 0.06);
}
.table tbody td {
  border: 1px solid rgba(0, 0, 0, 0.08);
  padding: 6px;
  vertical-align: middle;
}
.bultos-table input {
  width: 100%;
  padding: 6px;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

/* Actions and small helpers */
.table-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}
.totals-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
  margin-bottom: 4px;
}
.small {
  font-size: 12px;
  color: #6b7280;
}
.muted {
  color: #6b7280;
}
.bold {
  font-weight: 700;
  color: #0f172a;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 18px;
  margin-bottom: 24px;
}
.btn-muted {
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid rgba(15, 23, 42, 0.06);
  background: transparent;
  cursor: pointer;
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

.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid #fff;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  vertical-align: middle;
  margin-left: 6px;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 900px) {
  .grid-3,
  .grid-op,
  .grid-4 {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .table-wrap {
    max-height: none;
  }
}
</style>
