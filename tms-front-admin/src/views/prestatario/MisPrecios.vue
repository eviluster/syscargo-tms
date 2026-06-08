<template>
  <div class="container py-4">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold">Mis Precios por Servicio</h2>
      <button class="btn btn-primary" @click="showAddModal = true">
        <i class="fas fa-plus me-2"></i>Agregar Precio
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="sr-only">Cargando...</span>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="precios.length === 0" class="alert alert-info">
      No has definido precios aún. Haz clic en "Agregar Precio" para comenzar.
    </div>

    <!-- Table -->
    <div v-else class="card">
      <div class="table-responsive">
        <table class="table table-hover">
          <thead class="table-light">
            <tr>
              <th>Servicio</th>
              <th>Precio</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="precio in precios" :key="precio.id">
              <td class="fw-semibold">{{ precio.servicio?.name || 'N/A' }}</td>
              <td>{{ formatMoney(precio.precio) }}</td>
              <td class="text-muted">{{ precio.descripcion || '-' }}</td>
              <td>
                <span v-if="precio.isActive" class="badge bg-success">Activo</span>
                <span v-else class="badge bg-secondary">Inactivo</span>
              </td>
              <td>
                <button
                  class="btn btn-sm btn-info me-2"
                  @click="editarPrecio(precio)"
                  title="Editar"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  v-if="precio.isActive"
                  class="btn btn-sm btn-danger"
                  @click="eliminarPrecio(precio.id)"
                  title="Eliminar"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Agregar/Editar -->
    <div
      v-if="showAddModal"
      class="modal show d-block"
      role="dialog"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <!-- Header -->
          <div class="modal-header">
            <h5 class="modal-title">
              {{ modoEdicion ? 'Editar Precio' : 'Agregar Nuevo Precio' }}
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="cerrarModal"
            ></button>
          </div>

          <!-- Body -->
          <div class="modal-body">
            <el-form
              :model="formulario"
              :rules="reglas"
              ref="formRef"
              @submit.prevent="guardarPrecio"
            >
              <!-- Servicio -->
              <div class="mb-3">
                <label class="form-label">
                  <span class="text-danger">*</span> Servicio
                </label>
                <el-form-item prop="servicio">
                  <el-select
                    v-model="formulario.servicio"
                    placeholder="Selecciona un servicio"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="servicio in servicios"
                      :key="servicio.id"
                      :label="servicio.name"
                      :value="servicio.id"
                    />
                  </el-select>
                </el-form-item>
              </div>

              <!-- Precio -->
              <div class="mb-3">
                <label class="form-label">
                  <span class="text-danger">*</span> Precio
                </label>
                <el-form-item prop="precio">
                  <el-input
                    v-model.number="formulario.precio"
                    type="number"
                    placeholder="Ej: 100.00"
                    step="0.01"
                    min="0.01"
                  />
                </el-form-item>
              </div>

              <!-- Descripción -->
              <div class="mb-3">
                <label class="form-label">Descripción (opcional)</label>
                <el-form-item prop="descripcion">
                  <el-input
                    v-model="formulario.descripcion"
                    type="textarea"
                    rows="3"
                    placeholder="Ej: Tarifa por km, Almacenamiento, etc"
                  />
                </el-form-item>
              </div>
            </el-form>
          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="cerrarModal"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="guardarPrecio"
              :disabled="guardando"
            >
              <span v-if="guardando" class="spinner-border spinner-border-sm me-2"></span>
              {{ modoEdicion ? 'Actualizar' : 'Crear' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tooltip para calculadora -->
    <div class="mt-5 alert alert-light-info">
      <h6 class="fw-bold mb-3">💡 Cálculo de Precios</h6>
      <p class="small mb-0">
        Cuando el cliente solicita múltiples servicios, el sistema sumará todos los precios
        que has definido y agregará automáticamente una comisión del 5%.
      </p>
      <p class="small mb-0 mt-2">
        <strong>Ejemplo:</strong> Si defines Transporte: $100 y Almacén: $200, 
        el cliente verá: Subtotal $300 + Comisión 5% ($15) = <strong>Total $315</strong>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import axios from 'axios';

interface Precio {
  id: string;
  servicio: { id: string; name: string };
  precio: number;
  descripcion?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Servicio {
  id: string;
  name: string;
}

// State
const loading = ref(false);
const guardando = ref(false);
const showAddModal = ref(false);
const modoEdicion = ref(false);
const precios = ref<Precio[]>([]);
const servicios = ref<Servicio[]>([]);
const formRef = ref();
const prestatarioId = ref('');

// Formulario
const formulario = ref({
  servicio: '',
  precio: null as number | null,
  descripcion: '',
});

// Reglas de validación
const reglas = {
  servicio: [
    { required: true, message: 'Selecciona un servicio', trigger: 'change' },
  ],
  precio: [
    { required: true, message: 'El precio es obligatorio', trigger: 'blur' },
    {
      type: 'number',
      min: 0.01,
      message: 'El precio debe ser mayor a 0',
      trigger: 'blur',
    },
  ],
};

// Métodos
const cargarDatos = async () => {
  loading.value = true;
  try {
    // Obtener prestatario actual (desde localStorage o API)
    const usuario = localStorage.getItem('user');
    if (usuario) {
      const user = JSON.parse(usuario);
      prestatarioId.value = user.prestatario_id || user.id;
    }

    // Cargar precios
    const respuestaPrecios = await axios.get(
      `/api/prestatarioserv/prestatario/${prestatarioId.value}`
    );
    precios.value = respuestaPrecios.data;

    // Cargar servicios disponibles
    const respuestaServicios = await axios.get('/api/servicio');
    servicios.value = respuestaServicios.data;
  } catch (error: any) {
    ElMessage.error(
      error.response?.data?.message || 'Error al cargar datos'
    );
  } finally {
    loading.value = false;
  }
};

const guardarPrecio = async () => {
  if (!formRef.value) return;

  const valido = await formRef.value.validate().catch(() => false);
  if (!valido) return;

  guardando.value = true;
  try {
    const payload = {
      prestatario: prestatarioId.value,
      servicio: formulario.value.servicio,
      precio: formulario.value.precio,
      descripcion: formulario.value.descripcion,
    };

    if (modoEdicion.value) {
      // Editar
      await axios.patch(
        `/api/prestatarioserv/${formulario.value.servicio}`,
        payload
      );
      ElMessage.success('Precio actualizado correctamente');
    } else {
      // Crear
      await axios.post('/api/prestatarioserv', payload);
      ElMessage.success('Precio creado correctamente');
    }

    cerrarModal();
    await cargarDatos();
  } catch (error: any) {
    ElMessage.error(
      error.response?.data?.message || 'Error al guardar precio'
    );
  } finally {
    guardando.value = false;
  }
};

const editarPrecio = (precio: Precio) => {
  modoEdicion.value = true;
  formulario.value = {
    servicio: precio.servicio.id,
    precio: precio.precio,
    descripcion: precio.descripcion || '',
  };
  showAddModal.value = true;
};

const eliminarPrecio = async (id: string) => {
  ElMessageBox.confirm(
    '¿Estás seguro de que deseas eliminar este precio?',
    'Confirmación',
    { confirmButtonText: 'Sí', cancelButtonText: 'No' }
  )
    .then(async () => {
      try {
        await axios.delete(`/api/prestatarioserv/${id}`);
        ElMessage.success('Precio eliminado correctamente');
        await cargarDatos();
      } catch (error: any) {
        ElMessage.error(
          error.response?.data?.message || 'Error al eliminar precio'
        );
      }
    })
    .catch(() => {});
};

const cerrarModal = () => {
  showAddModal.value = false;
  modoEdicion.value = false;
  formulario.value = { servicio: '', precio: null, descripcion: '' };
  if (formRef.value) {
    formRef.value.clearValidate();
  }
};

const formatMoney = (valor: number) => {
  return new Intl.NumberFormat('es-CU', {
    style: 'currency',
    currency: 'CUP',
  }).format(valor);
};

// Lifecycle
onMounted(() => {
  cargarDatos();
});
</script>

<style scoped lang="scss">
.modal.show {
  backdrop-filter: blur(5px);
}

.badge {
  font-size: 0.75rem;
  padding: 0.35rem 0.65rem;
}

.table-hover tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}
</style>
