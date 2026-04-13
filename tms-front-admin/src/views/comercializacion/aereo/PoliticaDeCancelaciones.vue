<template>
  <main class="page">
    <div class="container">
      <header class="header">
        <h1>Política de cancelaciones</h1>
        <p class="lead">
          Condiciones, plazos y procedimientos relacionados con cancelaciones y
          reembolsos.
        </p>
      </header>

      <section class="card">
        <p>
          Cancelaciones gratuitas si se realizan con al menos
          <strong>24 horas</strong> de antelación. Cancelaciones dentro de las
          <strong>24 horas</strong> previas al retiro tienen una comisión. Las
          cargas ya recogidas o en tránsito no son reembolsables; para
          devoluciones contactar soporte.
        </p>
      </section>

      <section class="card">
        <h2>Alcance</h2>
        <p>
          Esta política aplica a todas las órdenes gestionadas a través de la
          plataforma TMS (en adelante “la Plataforma”).
        </p>
      </section>

      <section class="card">
        <h2>Cancelación por parte del remitente/cliente</h2>
        <ul class="list">
          <li>
            <strong>Cancelación con ≥ 24 horas de antelación</strong> al horario
            de retiro programado: sin cargos. Se reembolsa cualquier importe ya
            pagado (si aplica).
          </li>
          <li>
            <strong
              >Cancelación dentro de las 24 horas previas al retiro:</strong
            >
            comisión de cancelación equivalente al <strong>20%</strong> del
            valor de la orden o una tarifa mínima de <strong>[MONTO]</strong>,
            lo que resulte mayor.
          </li>
          <li>
            <strong>Cancelación después de la recogida:</strong> no
            reembolsable. Si la devolución es posible, se aplicarán cargos de
            retorno y gestión.
          </li>
        </ul>
      </section>

      <section class="card">
        <h2>Cancelación por parte del transportista o la empresa</h2>
        <p>
          La Plataforma o el prestatario podrán cancelar por causa justificada
          (avería, imposibilidad operativa, fuerza mayor). En dichos casos se
          ofrecerá al cliente la opción de reprogramar o recibir reembolso
          completo si no se reprograma en <strong>48 horas</strong>.
        </p>
      </section>

      <section class="card">
        <h2>Reembolsos</h2>
        <p>
          Las solicitudes de reembolso serán procesadas una vez confirmada la
          cancelación. Los reembolsos se emitirán al método de pago original en
          un plazo estimado de <strong>7–14 días hábiles</strong>. Gastos
          administrativos, comisiones de pasarela o cargos de terceros pueden
          deducirse si están especificados en la orden.
        </p>
      </section>

      <section class="card">
        <h2>Solicitud de cancelación</h2>
        <p>
          El cliente debe solicitar la cancelación mediante la sección
          <strong>“Mis órdenes”</strong> en la Plataforma o contactando a
          soporte con: número de orden, motivo y datos de contacto. Las
          cancelaciones solicitadas por canales distintos a la Plataforma podrán
          requerir verificación adicional.
        </p>
      </section>

      <section class="card">
        <h2>Excepciones y fuerza mayor</h2>
        <p>
          Eventos de fuerza mayor (clima extremo, huelgas, restricciones
          gubernamentales) pueden modificar los plazos y condiciones; la
          Plataforma se compromete a notificar y ofrecer alternativas
          razonables.
        </p>
      </section>

      <section class="card">
        <h2>Disputas</h2>
        <p>
          Cualquier disputa relativa a cargos por cancelación deberá notificarse
          en un plazo de <strong>14 días</strong> desde la fecha del cargo.
        </p>
      </section>

      <footer class="footer">
        <p></p>
      </footer>
    </div>
  </main>
</template>

<script setup>
// Valores estáticos — si quieres que algunos sean configurables por la plataforma, puedo exponerlos como props o
// enlazarlos a una configuración global.
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
