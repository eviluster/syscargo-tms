<template>
  <div
    style="
      background: linear-gradient(
        90deg,
        #080c24 14.27%,
        rgba(8, 12, 36, 0.97) 29.06%,
        rgba(8, 12, 36, 0.91) 41.25%,
        rgba(8, 12, 36, 0.83) 51.56%,
        rgba(8, 12, 36, 0.71) 57.4%,
        rgba(8, 12, 36, 0) 82.4%
      );
      height: 400px;
    "
  >
    <!-- Botón Anterior -->

    <div class="ellipse-container"></div>

    <!-- Botón Siguiente -->

    <div class="ellipse-container"></div>

    <v-container max-width="1055" class="customPA">
      <h2 class="customT">
        {{ title }}
      </h2>

      <v-breadcrumbs :items="breadcrumbItems" color="white" item-class="breadcrumb-item">
        <template v-slot:divider>
          <v-icon icon="mdi-arrow-right-thin" class="text-white"></v-icon>
        </template>
      </v-breadcrumbs>
    </v-container>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Título del Banner',
  },
  breadcrumbItems: {
    type: Array,
    default: () => [],
  },
})
</script>

<style scoped>
.banner-container {
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

.customPA {
  padding: 70px 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
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

.banner-title {
  margin: 0;
}

.breadcrumb-item {
  color: #fff;
  font-family: Yantramanav;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px;
}
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
  width: 225px;
  height: 225px;
  top: 7rem;
  left: -8rem;
  background: #ffffff21;
}

/* Segundo círculo (más grande, debajo) */
.ellipse-container::after {
  width: 225px;
  height: 225px;
  top: 5rem;
  left: -8rem;
  background: #ffffff21;
}
</style>

<!-- 
import BannerDinamico from '@/components/BannerDinamico.vue'
const bannerTitle = 'Servicios'
const breadcrumb = [
  { title: 'Home', disabled: false, href: '/' },
  { title: 'Servicios', disabled: true },
]

  <BannerDinamico :title="bannerTitle" :breadcrumbItems="breadcrumb" /> -->
