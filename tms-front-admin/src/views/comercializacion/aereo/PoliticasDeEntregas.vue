<template>
  <main class="page">
    <div class="container">
      <header class="header">
        <h1>Políticas de entregas</h1>
        <p class="lead">
          Condiciones, procedimientos y responsabilidades relacionadas con las
          entregas.
        </p>
      </header>

      <section class="card">
        <p>
          Realizamos hasta <strong>{{ intentos }}</strong> intentos de entrega.
          Para marcar como entregado se solicita <strong>firma</strong> y/o
          <strong>foto del DNI</strong> según el servicio. Reclamos por
          daño/pérdida deben reportarse dentro de
          <strong>48 horas</strong> desde la entrega.
        </p>
      </section>

      <section class="card">
        <h2>Ventana y compromiso de entrega</h2>
        <p>
          Las entregas se realizarán en el rango horario acordado al momento de
          la programación. Los tiempos indicados son estimados y pueden verse
          afectados por condiciones externas.
        </p>
      </section>

      <section class="card">
        <h2>Intentos de entrega</h2>
        <p>
          Se realizarán hasta <strong>{{ intentos }}</strong> intentos de
          entrega sin coste adicional. Si el destinatario no se encuentra, la
          entrega podrá reprogramarse; puede aplicarse una tarifa por reentrega
          según la política vigente.
        </p>
      </section>

      <section class="card">
        <h2>Prueba de entrega (POD)</h2>
        <p>
          Para completar la entrega se requiere una de las siguientes pruebas
          según el servicio contratado:
        </p>
        <ul class="list">
          <li>Firma del destinatario en dispositivo móvil.</li>
          <li>
            Fotografía del DNI (frente y dorso) y foto del receptor firmando.
          </li>
          <li>Foto del paquete entregado en el lugar acordado.</li>
        </ul>
        <p>
          El transportista subirá el POD a la Plataforma. La ausencia de POD
          válido puede retrasar la confirmación de entrega y la resolución de
          reclamos.
        </p>
      </section>

      <section class="card">
        <h2>Entregas condicionadas</h2>
        <p>
          Si la entrega requiere autorización de un tercero o documento
          específico, el cliente debe proporcionarlo; de lo contrario la entrega
          podrá ser reprogramada.
        </p>
      </section>

      <section class="card">
        <h2>Responsabilidad por daños y pérdidas</h2>
        <p>
          El cliente debe inspeccionar la mercancía al recibirla y reportar
          daños o faltantes dentro de las <strong>48 horas</strong>
          posteriores a la entrega.
        </p>
        <p>Reclamos válidos deberán incluir:</p>
        <ul class="list">
          <li>Fotos del embalaje y del daño.</li>
          <li>Estado del sello (si aplica).</li>
          <li>Documento de entrega y reporte detallado.</li>
        </ul>
        <p>
          La responsabilidad de la Plataforma puede estar sujeta a límites (por
          ejemplo: valor declarado o cobertura contratada). Consulte opciones de
          seguro y tarifas adicionales.
        </p>
      </section>

      <section class="card">
        <h2>Reprogramaciones</h2>
        <p>
          Reprogramar una entrega puede implicar cargos según la antelación y la
          intervención necesaria; reprogramaciones con ≥ 24 horas de antelación
          no tendrán cargo, salvo indicación contraria en la orden.
        </p>
      </section>

      <section class="card">
        <h2>Retrasos</h2>
        <p>
          Retrasos causados por condiciones externas (clima, aduanas, incidentes
          viales) no son responsabilidad directa del transportista; la
          Plataforma informará y propondrá opciones al cliente.
        </p>
      </section>

      <section class="card">
        <h2>Procedimiento de reclamo</h2>
        <p>
          Abrir reclamo en la Plataforma o contactar soporte indicando número de
          orden, descripción, fotos y documentos. Tiempo de respuesta inicial:
          <strong>48–72 horas hábiles</strong>.
        </p>
      </section>

      <footer class="footer">
        <p></p>
      </footer>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";

const intentos = ref(2);
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
  /* usar color de borde coherente con tema oscuro */
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
