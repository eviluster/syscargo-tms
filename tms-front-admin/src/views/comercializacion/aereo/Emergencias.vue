<template>
  <main class="page">
    <div class="container">
      <header class="header">
        <h1>Emergencias</h1>
        <p class="lead">
          Servicio exprés para envíos que requieren atención prioritaria y
          gestión inmediata.
        </p>
      </header>

      <section class="card">
        <h2>¿Qué es el servicio de emergencias?</h2>
        <p>
          El servicio de <strong>Emergencias</strong> está diseñado para envíos
          que necesitan tramitación y entrega urgente por motivos operativos o
          comerciales (documentos críticos, repuestos, material médico, etc.).
          Se prioriza la reserva, recogida y entrega frente a servicios
          estándar.
        </p>
      </section>

      <section class="card">
        <h2>Cuándo usarlo</h2>
        <ul class="list">
          <li>Envíos que no pueden esperar al ciclo logístico normal.</li>
          <li>
            Material con impacto operativo inmediato (repuestos, piezas
            críticas, documentos legales).
          </li>
          <li>
            Situaciones donde el cliente requiere un seguimiento especial y
            respuesta rápida.
          </li>
        </ul>
      </section>

      <section class="card">
        <h2>Cómo solicitar el servicio</h2>
        <p>
          Solicítalo desde la pantalla de creación de órdenes seleccionando la
          opción <strong>Emergencia / Prioritario</strong>
          o contactando a soporte para gestión manual. Para solicitudes
          telefónicas facilita número de pedido, dirección de recogida y
          contacto del receptor.
        </p>
      </section>

      <section class="card">
        <h2>Tarifas y criterios</h2>
        <p>
          Las tarifas de emergencias se calculan sobre la tarifa estándar (peso
          o volumen) y aplican un <strong>recargo por prioridad</strong>.
          También se suman impuestos y comisiones según corresponda. Ejemplo de
          factores considerados:
        </p>
        <ul class="list">
          <li>Tarifa base por kg o cargo por volumen.</li>
          <li>Recargo por prioridad (porcentaje o tarifa fija).</li>
          <li>Recargos por zona o acceso complicado.</li>
          <li>
            Servicios adicionales (embalaje urgente, escolta, seguros
            especiales).
          </li>
        </ul>
      </section>

      <section class="card">
        <h2>Tiempos de respuesta (estimados)</h2>
        <p>
          Los tiempos dependen de la disponibilidad operativa y la distancia.
          Ejemplos orientativos:
        </p>
        <ul class="list">
          <li>
            Recogida urbana prioritaria: <strong>1–4 horas</strong> desde la
            confirmación.
          </li>
          <li>
            Entregas interprovinciales prioritarias:
            <strong>4–12 horas</strong> (según ruta).
          </li>
          <li>
            Envíos internacionales: tiempos sujetos a aduanas y transportistas
            asociados.
          </li>
        </ul>
      </section>

      <section class="card">
        <h2>Cobertura y limitaciones</h2>
        <p>
          El servicio cubrirá la mayoría de rutas nacionales; sin embargo, puede
          haber restricciones por tamaño, peso, tipo de mercancía (peligrosas,
          prohibidas) o acceso. Consulta las condiciones específicas por tipo de
          carga.
        </p>
      </section>

      <section class="card">
        <h2>Procedimiento y requisitos</h2>
        <ul class="list">
          <li>
            Documentación completa y, si aplica, autorizaciones especiales.
          </li>
          <li>Prueba de entrega (firma, foto o POD) como comprobante.</li>
          <li>
            Contacto telefónico del destinatario para coordinar la entrega
            urgente.
          </li>
        </ul>
      </section>

      <section class="card">
        <h2>Contacto y soporte</h2>
        <p>
          Para solicitudes urgentes llama a <strong>{{ telefono }}</strong> o
          escribe a <strong>{{ email }}</strong> indicando el número de orden y
          la descripción de la emergencia.
        </p>
      </section>

      <footer class="footer">
        <p class="note"></p>
      </footer>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";

const telefono = ref("+53 5X-XXXXXXX");
const email = ref("soporte@tuservicio.tld");
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
