<template>
  <v-carousel hide-delimiters cycle height="800" v-model="currentSlide">
    <!-- Botón Anterior -->
    <template v-slot:prev="{ props }">
      <div class="ellipse-container">
        <v-btn
          icon
          @click="props.onClick"
          class="carousel-arrow prev"
          :class="{ 'active-arrow': currentSlide !== 0 }"
        >
          <v-icon size="32"></v-icon>
        </v-btn>
      </div>
    </template>

    <!-- Botón Siguiente -->
    <template v-slot:next="{ props }">
      <div class="ellipse-container">
        <v-btn
          icon
          @click="props.onClick"
          class="carousel-arrow next"
          :class="{ 'active-arrow': currentSlide !== slides.length - 1 }"
        >
          <v-icon size="32"></v-icon>
        </v-btn>
      </div>
    </template>

    <v-carousel-item
      v-for="(item, index) in slides"
      :key="index"
      :src="item.image"
      cover
      class="carousel-item"
    >
      <v-container max-width="1055" class="customPA">
        <h2 class="customT pb-5">
          {{ item.title }}
        </h2>
        <p class="customS pb-5">
          {{ item.subtitle }}
        </p>
        <div class="pt-5">
          <v-btn class="text-none text-subtitle-1 mr-4" color="#ea950e" variant="flat" size="large">
            Nuestros Servicios
          </v-btn>

          <v-btn class="text-none text-subtitle-1" color="white" variant="flat" size="large"
            >Contáctenos
          </v-btn>
        </div>
      </v-container>
    </v-carousel-item>
  </v-carousel>
</template>

<script setup>
import { ref } from 'vue'
const currentSlide = ref(0)
const slides = ref([
  {
    image: '/src/assets/sliderback.png', // Reemplaza con tu imagen
    title: 'ÚNICA DE SU TIPO EN CUBA & EL MEJOR SERVICIO DE TRANSPORTE DE CARGA',
    subtitle:
      'Servicio de transporte de carga hacia Cuba tanto aéreo como marítimo con calidad, rapidez y profesionalismo.',
  },
  {
    image: '/src/assets/sliderback.png', // Reemplaza con tu imagen
    title: 'ÚNICA DE SU TIPO EN CUBA & EL MEJOR SERVICIO DE TRANSPORTE DE CARGA',
    subtitle:
      'Servicio de transporte de carga hacia Cuba tanto aéreo como marítimo con calidad, rapidez y profesionalismo.',
  },
])
</script>

<style scoped>
.customPA {
  padding: 70px 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.bg {
  background: linear-gradient(
    90deg,
    #080c24 14.27%,
    rgba(8, 12, 36, 0.97) 29.06%,
    rgba(8, 12, 36, 0.91) 41.25%,
    rgba(8, 12, 36, 0.83) 51.56%,
    rgba(8, 12, 36, 0.71) 57.4%,
    rgba(8, 12, 36, 0) 82.4%
  );
}
.customT {
  font-size: 64px;
  line-height: 90px;
  font-weight: 900;
  font-family: Yantramanav;
  color: #fff;
  text-align: left;
  display: inline-block;
}
.customS {
  width: 555px;
  font-size: 16px;
  line-height: 28px;
  font-family: 'Public Sans';
  color: #fff;
  text-align: left;
  display: inline-block;
  height: 56px;
}

.carousel-item {
  position: relative;
  display: flex !important;
  align-items: center !important;
  justify-content: center;
  text-align: left;
  color: white;
}

.carousel-content {
  position: absolute;
  left: 10%;
  max-width: 600px;
}

/* Flechas en el lado izquierdo, una encima de la otra */
.carousel-arrow {
  position: absolute;
  left: 10px;
  z-index: 10;
  background-color: white;
  color: white;
}
.active-arrow {
  background-color: #ea950e !important;
  color: white;
}
.prev {
  top: 1rem;
  left: 2rem;
}

.next {
  top: 4.5rem;
  left: 2rem;
}

/* --- Contenedor con elipses (uno por flecha) --- */
.ellipse-container {
  position: absolute;
  width: 60px;
  height: 60px;
}

/* Pseudo-elementos para círculos superpuestos */
.ellipse-container::before,
.ellipse-container::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  opacity: 0.2; /* Ajusta opacidad */
}

/* Primer círculo (más pequeño, encima) */
.ellipse-container::before {
  width: 300px;
  height: 300px;
  top: -5rem;
  left: -9rem;
  background: #1c1f36;
}

/* Segundo círculo (más grande, debajo) */
.ellipse-container::after {
  width: 300px;
  height: 300px;
  top: -7rem; /* Ajusta según tu preferencia */
  left: -9rem;
  background: #1a1c33;
}
</style>
