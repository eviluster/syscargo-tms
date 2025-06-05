<template>
  <div class="container py-5">
    <h1 class="mb-4 text-center">Selector de Rango de Edad</h1>

    <!-- Contenedor de sliders en la misma línea -->
    <div class="d-flex align-items-center gap-3">
      <!-- Mostrar edad mínima -->
      <div>
        <label for="min-age-slider" class="form-label">Edad mínima:</label>
        <div class="input-value">{{ minAge }}</div>
        <input
          id="min-age-slider"
          type="range"
          class="form-range"
          v-model="minAge"
          :min="minValue"
          :max="maxValue"
          :step="step"
          @input="adjustRange('min')"
        />
      </div>

      <!-- Mostrar edad máxima -->
      <div>
        <label for="max-age-slider" class="form-label">Edad máxima:</label>
        <div class="input-value">{{ maxAge }}</div>
        <input
          id="max-age-slider"
          type="range"
          class="form-range"
          v-model="maxAge"
          :min="minValue"
          :max="maxValue"
          :step="step"
          @input="adjustRange('max')"
        />
      </div>
    </div>

    <!-- Mostrar la información de los rangos -->
    <div class="alert alert-primary text-center mt-4">
      <p><strong>Adultos:</strong> Mayores de {{ maxAge }}</p>
      <p><strong>Niños:</strong> Desde {{ minAge }} hasta {{ maxAge }}</p>
      <p><strong>Infantes:</strong> Menores de {{ minAge }}</p>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    // Valores iniciales
    const minValue = 0;
    const maxValue = 100;
    const step = 1;

    // Estado reactivo para las edades
    const minAge = ref(2);
    const maxAge = ref(6);

    // Función para ajustar los rangos y evitar solapamiento
    const adjustRange = (type) => {
      if (type === "min" && minAge.value > maxAge.value) {
        minAge.value = maxAge.value;
      }
      if (type === "max" && maxAge.value < minAge.value) {
        maxAge.value = minAge.value;
      }
    };

    return {
      minValue,
      maxValue,
      step,
      minAge,
      maxAge,
      adjustRange,
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
}

.d-flex {
  justify-content: space-between;
}

.input-value {
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-align: center;
}

.form-range {
  cursor: pointer;
  max-width: 300px; /* Ajusta el ancho del slider */
}
</style>
