<template>
  <main class="page">
    <div class="container">
      <header class="header">
        <h1>Precio sobre destinos</h1>
        <p class="lead">
          Cómo se calculan las tarifas según peso, volumen, recargos y servicios
          adicionales.
        </p>
      </header>

      <section class="card">
        <h2>Resumen</h2>
        <p>
          Las tarifas se calculan en función de la
          <strong>tarifa base por kg</strong>,
          <strong>cargo por volumen</strong>, y
          <strong>recargos por zona o servicios especiales</strong>. Se aplican
          impuestos y comisiones según corresponda.
        </p>
      </section>

      <section class="card">
        <h2>Política completa</h2>
        <p>El precio final de cada envío se compone de varios conceptos:</p>
        <ul class="list">
          <li>
            <strong>Tarifa base:</strong> calculada por kilogramo facturable
            (ej.: 70 CUP/kg).
          </li>
          <li>
            <strong>Cargo por volumen:</strong> si el volumen facturable supera
            la tarifa por peso, se aplica el cargo por volumen (ej.: 100 CUP por
            m³).
          </li>
          <li>
            <strong>Impuestos y tasas:</strong> cargos fiscales o aeroportuarios
            aplicables según origen/destino.
          </li>
          <li>
            <strong>Comisión de la plataforma:</strong> porcentaje aplicado
            sobre el subtotal (ej.: 5%).
          </li>
          <li>
            <strong>Recargos por zona:</strong> zonas remotas o de difícil
            acceso pueden llevar un recargo fijo o porcentual.
          </li>
          <li>
            <strong>Servicios adicionales:</strong> manipulación especial,
            embalaje, seguro, entrega urgente, etc., se cobran por separado.
          </li>
        </ul>
        <p>
          Los montos serán redondeados a la unidad monetaria local y se
          presentará un desglose claro en la confirmación de la reserva (tarifa
          base, volumen, impuestos, comisión, total). Si una cotización se
          realiza manualmente por atención al cliente, cualquier excepción
          deberá quedar registrada en la orden.
        </p>
      </section>

      <section class="card">
        <h2>Reglas / ejemplos (valores de ejemplo)</h2>
        <table class="table">
          <thead>
            <tr>
              <th>Concepto</th>
              <th>Valor de ejemplo</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Tarifa base (por kg)</td>
              <td>{{ formatCUP(tarifaBasePerKg) }}</td>
            </tr>
            <tr>
              <td>Cargo por volumen (por m³)</td>
              <td>{{ formatCUP(cargoVolPorM3) }}</td>
            </tr>
            <tr>
              <td>Impuesto aeroportuario (por kg)</td>
              <td>{{ formatCUP(impuestoAeroPorKg) }}</td>
            </tr>
            <tr>
              <td>Comisión</td>
              <td>{{ (commissionRate * 100).toFixed(2) }}%</td>
            </tr>
          </tbody>
        </table>

        <div class="example">
          <h3>Ejemplo de cálculo</h3>
          <p>
            Datos de ejemplo: <strong>Peso</strong> = {{ pesoEjemplo }} kg ·
            <strong>Volumen</strong> = {{ volumenEjemplo }} m³
          </p>

          <ul class="calc-list">
            <li>Tarifa base = {{ formatCUP(tarifaBase) }}</li>
            <li>Cargo volumen = {{ formatCUP(cargoVolAplicado) }}</li>
            <li>Base de cálculo = {{ formatCUP(baseCalculo) }}</li>
            <li>Impuesto = {{ formatCUP(impuestoAplicado) }}</li>
            <li>Comisión = {{ formatCUP(commission) }}</li>
            <li class="total">Total ≈ {{ formatCUP(total) }}</li>
          </ul>

          <p class="note">
            *Los valores mostrados son de ejemplo y deben redondearse según la
            moneda local en la cotización final.
          </p>
        </div>
      </section>

      <footer class="footer">
        <p>
          ¿Quieres que convierta estos valores de ejemplo en configurables desde
          el panel de administración o que lo añada como ruta en el menú
          lateral?
        </p>
      </footer>
    </div>
  </main>
</template>

<script setup>
import { computed, ref } from "vue";

// Valores de ejemplo
const tarifaBasePerKg = 70;
const cargoVolPorM3 = 100;
const impuestoAeroPorKg = 7.7;
const commissionRate = 0.05;

const pesoEjemplo = 10;
const volumenEjemplo = 0.5;

const tarifaBase = computed(() => tarifaBasePerKg * pesoEjemplo);
const cargoVolAplicado = computed(() => cargoVolPorM3 * volumenEjemplo);
const baseCalculo = computed(() => tarifaBase.value);
const impuestoAplicado = computed(() => impuestoAeroPorKg * pesoEjemplo);
const commission = computed(
  () => (baseCalculo.value + impuestoAplicado.value) * commissionRate,
);
const total = computed(
  () =>
    tarifaBase.value +
    cargoVolAplicado.value +
    impuestoAplicado.value +
    commission.value,
);

function formatCUP(value) {
  if (value == null || isNaN(value)) return "-";
  return `${Number(value).toFixed(2)} CUP`;
}
</script>

<style scoped>
:root {
  --card-bg: rgba(255, 255, 255, 0.03);
  --card-border: rgba(255, 255, 255, 0.06);
  --text: #e6eef8;
  --muted: #9aa4b2;
  --accent: #60a5fa;
}

.page {
  font-family:
    system-ui,
    -apple-system,
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    Arial;
  color: var(--text);
  padding: 2rem 1rem;
  background: transparent;
}
.container {
  max-width: 1104px;
  margin: 0 auto;
  border-radius: 50px;
  border: 1px solid;
  padding: 30px;
  border-color: var(--card-border, gray);
}
.header h1 {
  margin: 0 0 0.25rem 0;
  font-size: 1.9rem;
  color: var(--text);
}
.lead {
  margin: 0 0 1rem 0;
  color: var(--muted);
}
.card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  padding: 1.25rem;
  border-radius: 12px;
  margin-bottom: 1rem;
}
.list {
  padding-left: 1.1rem;
  color: var(--text);
}
.table {
  width: 100%;
  border-collapse: collapse;
  margin: 0.5rem 0 1rem 0;
}
.table th,
.table td {
  text-align: left;
  padding: 10px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  color: var(--text);
}
.table thead th {
  color: var(--muted);
  font-weight: 600;
  font-size: 0.95rem;
}
.example {
  margin-top: 0.75rem;
}
.calc-list {
  list-style: none;
  padding-left: 0;
}
.calc-list li {
  padding: 6px 0;
  color: var(--text);
}
.total {
  font-weight: 700;
  margin-top: 0.5rem;
  color: var(--accent);
}
.note {
  color: var(--muted);
  font-size: 0.9rem;
}
.footer p {
  color: var(--muted);
  font-size: 0.95rem;
}

@media (prefers-color-scheme: light) {
  :root {
    --card-bg: #ffffff;
    --card-border: #e6e9ee;
    --text: #0f172a;
    --muted: #475569;
    --accent: #1e40af;
  }
}
</style>
