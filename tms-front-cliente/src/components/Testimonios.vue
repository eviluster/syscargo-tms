<template>
  <div>
    <v-container class="py-10" max-width="1220">
      <v-row justify="center">
        <v-col cols="12" align="center">
          <v-img src="/planout.png" max-width="174" max-height="46" class="d-flex align-center">
            <img src="/TESTIMONIOS.png" alt="" />
          </v-img>

          <h2 class="py-5 title">NUESTROS CLIENTES OPINAN</h2>

          <p class="caption" style="max-width: 600px">
            Potencia tus métricas de interacción con servicios confiables. Desarrolla estrategias de e-commerce basadas
            en datos para un crecimiento proactivo.
          </p>
        </v-col>
      </v-row>

      <!-- Tarjetas  -->
      <v-row class="slide-group-container pt-10" style="position: relative">
        <v-slide-group elevation="8" max-width="800" v-model="model" prev-icon="mdi-chevron-left"
          next-icon="mdi-chevron-right" class="custom-slide-group" center-active="true">
          <v-slide-group-item v-for="(item, index) in slides" :key="index">
            <v-card class="testimonio-card me-6 d-flex align-center" height="auto" width="390">
              <v-card-text class="d-flex flex-column justify-space-evenly ga-5 px-8" style="height: 100%">
                <v-img src="/romboout.png" max-width="70" max-height="100" class="d-flex align-center text-center out">
                  <img src="/romboin.png" alt="" style="width: 50px; height: 70px" />
                </v-img>
                <div class="d-flex">
                  <v-divider :thickness="3" class="border-opacity-100 mr-3" color="#EA950E" vertical></v-divider>
                  <p class="text-medium-emphasis CAPTION">
                    {{ item.coment }}
                  </p>
                </div>

                <div class="d-flex justify-center">
                  <v-img :src="item.image" max-width="60" height="60" class="rounded-circle mr-3"></v-img>
                  <div>
                    <h3 class="text-h6 font-weight-bold mt-4 TITLE">{{ item.name }}</h3>
                    <span class="text-medium-emphasis customrole">
                      {{ item.role }}
                    </span>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-slide-group-item>
        </v-slide-group>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const model = null
const slides = ref([
  {
    image: 'https://randomuser.me/api/portraits/women/85.jpg',
    name: 'ANJELINA MATHEUS',
    coment:
      '“Desarrollan estrategias progresivas para productos manufacturados intermandatados basados en fuentes multidisciplinarias. Itere eficientemente sistemas de valor añadido con componentes modulares.”',
    role: 'Co-Founder',
  },
  {
    image: 'https://randomuser.me/api/portraits/women/85.jpg',
    name: 'MONISH POUL',
    coment:
    '“Desarrollan estrategias progresivas para productos manufacturados intermandatados basados en fuentes multidisciplinarias. Itere eficientemente sistemas de valor añadido con componentes modulares.”',
    role: 'Co-Founder',
  },
  {
    image: 'https://randomuser.me/api/portraits/women/85.jpg',
    name: 'MICHEL CLACRK',
    coment:
    '“Desarrollan estrategias progresivas para productos manufacturados intermandatados basados en fuentes multidisciplinarias. Itere eficientemente sistemas de valor añadido con componentes modulares.”',
    role: 'Co-Founder',
  },
  {
    image: 'https://randomuser.me/api/portraits/women/85.jpg',
    name: 'ANJELINA MATHEUS',
    coment:
    '“Desarrollan estrategias progresivas para productos manufacturados intermandatados basados en fuentes multidisciplinarias. Itere eficientemente sistemas de valor añadido con componentes modulares.”',
    role: 'Co-Founder',
  },
  {
    image: 'https://randomuser.me/api/portraits/women/85.jpg',
    name: 'MONISH POUL',
    coment:
    '“Desarrollan estrategias progresivas para productos manufacturados intermandatados basados en fuentes multidisciplinarias. Itere eficientemente sistemas de valor añadido con componentes modulares.”',
    role: 'Co-Founder',
  },
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
  line-height: 54px;
  /* 122.727% */
}

.caption {
  color: var(--565969, #565969);
  text-align: center;
  font-family: 'Public Sans';
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 26px;
}

.CAPTION {
  color: #4d5765 !important;
  font-family: 'Public Sans';
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 26px;
}

.TITLE {
  font-family: Yantramanav;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.customrole {
  color: #4d5765;
  font-family: 'Public Sans';
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.testimonio-card {
  border-radius: 5px;
  background-color: #f1f1f3;
}

.custom-slide-group::v-deep(.v-slide-group__prev),
.custom-slide-group::v-deep(.v-slide-group__next) {
  position: absolute;
  width: 60px;
  border-radius: 50%;
  background-color: #ea950e;
  height: 60px;
  top: 50%;
  padding: 10px;
  z-index: 123123;
}

.custom-slide-group::v-deep(.v-slide-group__prev) {
  left: -5rem;
}

.custom-slide-group::v-deep(.v-slide-group__next) {
  right: -5rem;
}
</style>
