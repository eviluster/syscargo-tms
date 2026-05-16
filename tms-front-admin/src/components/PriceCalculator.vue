<template>
  <div class="price-calculator card p-4">
    <h5 class="fw-bold mb-4">Calculadora de Precios</h5>

    <!-- Selector de Servicios -->
    <div class="mb-4">
      <label class="form-label fw-semibold">Servicios Solicitados</label>
      <div class="selected-services mb-3">
        <div v-if="serviciosSeleccionados.length === 0" class="alert alert-light-info">
          Selecciona servicios para calcular el precio
        </div>
        <div v-else>
          <div v-for="servicio in serviciosSeleccionados" :key="servicio.id" class="service-item">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <p class="mb-1 fw-semibold">{{ servicio.nombre }}</p>
                <small class="text-muted">{{ servicio.descripcion }}</small>
              </div>
              <button
                type="button"
                class="btn btn-sm btn-danger"
                @click="removerServicio(servicio.id)"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="d-flex justify-content-between mt-2">
              <span>Cantidad:</span>
              <input
                v-model.number="servicio.cantidad"
                type="number"
                min="1"
                class="form-control form-control-sm"
                style="width: 80px"
                @change="recalcular"
              />
            </div>
            <div class="mt-2 border-top pt-2">
              <strong>{{ formatMoney(servicio.precio * servicio.cantidad) }}</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Selector de Servicios Disponibles -->
      <el-select
        v-model="servicioSeleccionado"
        placeholder="Agregar servicio..."
        clearable
        filterable
        @change="agregarServicio"
      >
        <el-option-group label="Disponibles">
          <el-option
            v-for="servicio in serviciosDisponibles"
            :key="servicio.id"
            :label="`${servicio.nombre} - ${formatMoney(servicio.precio)}`"
            :value="servicio.id"
          />
        </el-option-group>
      </el-select>
    </div>

    <!-- Resumen de Cálculo -->
    <div class="summary border-top pt-4">
      <div class="d-flex justify-content-between mb-3">
        <span>Subtotal:</span>
        <strong>{{ formatMoney(calculo.subtotal) }}</strong>
      </div>

      <div class="d-flex justify-content-between mb-3 text-info">
        <span>Comisión ({{ calculo.comision_porcentaje }}%):</span>
        <strong>{{ formatMoney(calculo.comision_monto) }}</strong>
      </div>

      <div class="d-flex justify-content-between border-top pt-3">
        <span class="fw-bold">TOTAL:</span>
        <strong class="text-success" style="font-size: 1.25rem">
          {{ formatMoney(calculo.total) }}
        </strong>
      </div>

      <div class="alert alert-light-info mt-3 mb-0">
        <small>
          <i class="fas fa-info-circle me-2"></i>
          El total incluye una comisión del {{ calculo.comision_porcentaje }}% 
          por el uso de la plataforma.
        </small>
      </div>
    </div>

    <!-- Botones de Acción -->
    <div class="d-flex gap-2 mt-4">
      <button
        type="button"
        class="btn btn-primary flex-grow-1"
        :disabled="serviciosSeleccionados.length === 0"
        @click="confirmarCotizacion"
      >
        <i class="fas fa-check me-2"></i>Confirmar Cotización
      </button>
      <button
        type="button"
        class="btn btn-secondary flex-grow-1"
        @click="limpiar"
      >
        <i class="fas fa-times me-2"></i>Limpiar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';

interface ServicioDisponible {
  id: string;
  nombre: string;
  precio: number;
  descripcion?: string;
}

interface ServicioSeleccionado extends ServicioDisponible {
  cantidad: number;
}

// Props
const props = defineProps({
  prestatarioId: {
    type: String,
    required: true,
  },
});

// Emits
const emit = defineEmits<{
  cotizacionConfirmada: [calculo: any];
}>();

// State
const serviciosDisponibles = ref<ServicioDisponible[]>([]);
const serviciosSeleccionados = ref<ServicioSeleccionado[]>([]);
const servicioSeleccionado = ref('');
const loading = ref(false);

// Computed
const calculo = computed(() => {
  const subtotal = serviciosSeleccionados.value.reduce(
    (sum, s) => sum + s.precio * s.cantidad,
    0
  );

  const comision_porcentaje = 5;
  const comision_monto = Number((subtotal * (comision_porcentaje / 100)).toFixed(2));
  const total = Number((subtotal + comision_monto).toFixed(2));

  return {
    servicios: serviciosSeleccionados.value,
    subtotal: Number(subtotal.toFixed(2)),
    comision_porcentaje,
    comision_monto,
    total,
  };
});

// Métodos
const cargarServicios = async () => {
  loading.value = true;
  try {
    const response = await axios.get(
      `/api/prestatarioserv/prestatario/${props.prestatarioId}`
    );
    
    serviciosDisponibles.value = response.data.map((item: any) => ({
      id: item.id,
      nombre: item.servicio?.name || 'Servicio',
      precio: item.precio,
      descripcion: item.descripcion,
    }));
  } catch (error: any) {
    ElMessage.error(
      error.response?.data?.message || 'Error al cargar servicios'
    );
  } finally {
    loading.value = false;
  }
};

const agregarServicio = (servicioId: string) => {
  const servicio = serviciosDisponibles.value.find((s) => s.id === servicioId);
  if (!servicio) return;

  // Verificar si ya está agregado
  if (serviciosSeleccionados.value.some((s) => s.id === servicioId)) {
    ElMessage.warning('Este servicio ya está agregado');
    servicioSeleccionado.value = '';
    return;
  }

  serviciosSeleccionados.value.push({
    ...servicio,
    cantidad: 1,
  });

  servicioSeleccionado.value = '';
};

const removerServicio = (servicioId: string) => {
  serviciosSeleccionados.value = serviciosSeleccionados.value.filter(
    (s) => s.id !== servicioId
  );
};

const recalcular = () => {
  // Se actualiza automáticamente mediante computed
};

const limpiar = () => {
  serviciosSeleccionados.value = [];
};

const confirmarCotizacion = () => {
  emit('cotizacionConfirmada', calculo.value);
  ElMessage.success('Cotización confirmada');
};

const formatMoney = (valor: number) => {
  return new Intl.NumberFormat('es-CU', {
    style: 'currency',
    currency: 'CUP',
  }).format(valor);
};

// Lifecycle
onMounted(() => {
  cargarServicios();
});
</script>

<style scoped lang="scss">
.price-calculator {
  background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  .service-item {
    background: white;
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 12px;
    border-left: 4px solid #3498db;
  }

  .summary {
    background: white;
    padding: 16px;
    border-radius: 6px;

    .text-info {
      color: #3498db;
    }
  }
}

.selected-services {
  .alert {
    margin-bottom: 0;
  }
}
</style>
