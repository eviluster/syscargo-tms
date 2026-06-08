<template>
  <div class="py-12">
    <v-container class="py-10" max-width="1220">
      <v-row justify="center">
        <v-col cols="12" align="center">
          <v-img src="/planout.png" max-width="184" max-height="50" class="d-flex align-center">
            <h2
              class=""
              style="
                font-size: 16px;
                line-height: 26px;
                font-weight: 600;
                font-family: 'Public Sans';
                color: #ea950e;
                text-align: center;
                display: inline-block;
                width: 100%;
              "
            >
              CLIENTES FELICES
            </h2>
          </v-img>

          <h2 class="py-5 title">RECOMENDADO POR 365,000 CLIENTES SATISFECHOS</h2>

          <p class="caption" style="max-width: 600px">
            Mejora drásticamente las métricas interactivas para servicios confiables. Libera
            proactivamente el potencial del comercio electrónico con soluciones totalmente
            investigadas.
          </p>
        </v-col>
      </v-row>

      <v-row class="pt-12" align="center" justify="space-around">
        <v-col cols="6" sm="2" align="center" v-for="(logo, index) in logos" :key="index">
          <v-img
            :src="logo.src"
            :alt="`Logo de la compañía ${index + 1}`"
            max-width="70"
            height="73"
            contain
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const logos = ref([
  { src: '/Group(1).png' },
  { src: '/Group(2).png' },
  { src: '/Group(3).png' },
  { src: '/Group(4).png' },
  { src: '/Group(5).png' },
  { src: '/Group.png' },
])
</script>

<style scoped>
.title {
  color: var(--00235-a, #080c24);
  text-align: center;
  font-family: Yantramanav;
  font-size: 44px;
  font-style: normal;
  font-weight: 700;
  line-height: 54px; /* 122.727% */
}
.caption {
  color: var(--565969, #565969);
  text-align: center;
  font-family: 'Public Sans';
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 26px; /* 162.5% */
}
</style>
