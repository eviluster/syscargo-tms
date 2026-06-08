<template>
  <div class="invoice-section">
    <!-- Header -->
    <div class="invoice-header mb-4">
      <h5 class="fw-bold">Desglose de Costos</h5>
    </div>

    <!-- Tabla de Servicios -->
    <div class="table-responsive mb-4">
      <table class="table table-hover">
        <thead class="table-light">
          <tr>
            <th>Servicio</th>
            <th class="text-end">Cantidad</th>
            <th class="text-end">Precio Unitario</th>
            <th class="text-end">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="servicio in servicios" :key="servicio.id">
            <td class="fw-semibold">{{ servicio.nombre }}</td>
            <td class="text-end">{{ servicio.cantidad }}</td>
            <td class="text-end">{{ formatMoney(servicio.precio) }}</td>
            <td class="text-end fw-semibold">
              {{ formatMoney(servicio.precio * servicio.cantidad) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Resumen de Costos -->
    <div class="cost-summary card p-4">
      <!-- Subtotal -->
      <div class="row mb-3">
        <div class="col-8">
          <span class="text-muted">Subtotal de Servicios:</span>
        </div>
        <div class="col-4 text-end">
          <strong>{{ formatMoney(subtotal) }}</strong>
        </div>
      </div>

      <!-- Desglose de Comisión -->
      <div class="row mb-3 border-top pt-3">
        <div class="col-8">
          <span class="text-info">
            <i class="fas fa-percent me-2"></i>Comisión de Plataforma ({{ comisionPorcentaje }}%):
          </span>
        </div>
        <div class="col-4 text-end">
          <strong class="text-info">{{ formatMoney(comisionMonto) }}</strong>
        </div>
      </div>

      <!-- Total -->
      <div class="row border-top pt-3">
        <div class="col-8">
          <span class="fw-bold fs-5">TOTAL A PAGAR:</span>
        </div>
        <div class="col-4 text-end">
          <strong class="fs-5 text-success">{{ formatMoney(total) }}</strong>
        </div>
      </div>

      <!-- Nota de Comisión -->
      <div class="alert alert-light-info mt-3 mb-0">
        <small class="text-muted">
          <i class="fas fa-info-circle me-2"></i>
          La comisión del {{ comisionPorcentaje }}% es aplicada por el uso de la plataforma de gestión.
          Este monto es incluido en el total a pagar.
        </small>
      </div>
    </div>

    <!-- Información Prestatario -->
    <div v-if="prestatario" class="alert alert-light-primary mt-4">
      <h6 class="fw-bold mb-2">Prestatario Asignado</h6>
      <p class="mb-1">
        <strong>{{ prestatario.name || prestatario.user?.name }}</strong>
      </p>
      <p class="mb-0 text-muted small">
        {{ prestatario.user?.email }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Servicio {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
}

interface Prestatario {
  id: string;
  name?: string;
  user?: {
    name?: string;
    email?: string;
  };
}

// Props
const props = defineProps<{
  servicios: Servicio[];
  prestatario?: Prestatario;
  comisionPorcentaje?: number;
}>();

// Default values
const comisionPorcentaje = computed(() => props.comisionPorcentaje || 5);

// Computed
const subtotal = computed(() => {
  return props.servicios.reduce(
    (sum, s) => sum + s.precio * s.cantidad,
    0
  );
});

const comisionMonto = computed(() => {
  return Number((subtotal.value * (comisionPorcentaje.value / 100)).toFixed(2));
});

const total = computed(() => {
  return Number((subtotal.value + comisionMonto.value).toFixed(2));
});

// Methods
const formatMoney = (valor: number) => {
  return new Intl.NumberFormat('es-CU', {
    style: 'currency',
    currency: 'CUP',
  }).format(valor);
};
</script>

<style scoped lang="scss">
.invoice-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;

  .invoice-header {
    border-bottom: 2px solid #dee2e6;
    padding-bottom: 12px;
  }

  .cost-summary {
    background: white;
    border-left: 4px solid #3498db;

    .table-light {
      background: #f8f9fa;
    }
  }

  .alert {
    background: #e7f3ff;
    border-color: #b3d9ff;
    color: #003d66;
  }
}

.text-info {
  color: #3498db;
}

.text-success {
  color: #27ae60;
}

.alert-light-info {
  background-color: #e7f3ff;
  border-color: #b3d9ff;
  color: #003d66;
}

.alert-light-primary {
  background-color: #e7f3ff;
  border-color: #b3d9ff;
  color: #003d66;
}
</style>
