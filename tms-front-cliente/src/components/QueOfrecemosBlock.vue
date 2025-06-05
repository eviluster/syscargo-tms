<template>
  <v-container class="pt-10 pb-2" max-width="1220">
    <div class="out">
      <v-card class="pa-10 rounded-xl" elevation="3">
        <v-row class="pb-8">
          <v-col cols="12" class="text-center">
            <div class="feature-title">
              <div class="d-flex flex-column">
                <v-img src="/src/assets/rect2.png" height="46" max-width="142"></v-img>

                <h2 class="text-h4 font-weight-bold QO pt-6">¿QUE OFRECEMOS?</h2>
              </div>
              <v-divider
                :thickness="4"
                class="border-opacity-75 pl-5"
                color="#ea950e"
                vertical
              ></v-divider>
              <div style="width: 478px">
                <p class="text-muted QOS">
                  Collaboratively customize front-end materials with standardized infomediaries.
                  Holistically engineer performance based value. Assertively benchmark turnkey
                  web-readiness rather than long.
                </p>
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- Tarjetas  -->
        <v-row class="slide-group-container">
          <v-slide-group
            elevation="8"
            max-width="800"
            v-model="model"
            prev-icon="mdi-chevron-left"
            next-icon="mdi-chevron-right"
            class="custom-slide-group"
          >
            <v-slide-group-item v-for="(item, index) in slides" :key="index">
              <v-card class="service-card me-6" :class="item.bg" height="270" width="350">
                <v-card-text>
                  <v-avatar class="icon-circle">
                    <v-icon size="30">{{ item.icon }}</v-icon>
                  </v-avatar>
                  <div>
                    <h3 class="text-h6 font-weight-bold mt-4 TITLE">{{ item.title }}</h3>
                    <p class="text-medium-emphasis CAPTION">
                      {{ item.subtitle }}
                    </p>
                  </div>
                </v-card-text>
              </v-card>
            </v-slide-group-item>
          </v-slide-group>
        </v-row>
      </v-card>
    </div>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
const model = null
const slides = ref([
  {
    icon: 'mdi-currency-usd',
    title: 'EXCELENTES PRECIOS',
    subtitle: ' Acceda a los mejores planes de envíos y las mejores cuotas del mercado.',
    bg: 'bg-light-orange',
  },
  {
    icon: 'mdi-map-marker-radius',
    title: 'SERVICIO DE TRACKING',
    subtitle: 'Manténgase al tanto del estado de su envío a través del rastreo en tiempo real.',
    bg: 'bg-light-gray',
  },
  {
    icon: 'mdi-warehouse',
    title: 'ALMACENAMIENTO SEGURO',
    subtitle:
      'Garantizamos la seguridad de su cargamento en nuestros almacenes hasta el momento de su entrega.',
    bg: 'bg-light-blue',
  },
  {
    icon: 'mdi-currency-usd',
    title: 'EXCELENTES PRECIOS',
    subtitle: ' Acceda a los mejores planes de envíos y las mejores cuotas del mercado.',
    bg: 'bg-light-orange',
  },
  {
    icon: 'mdi-map-marker-radius',
    title: 'SERVICIO DE TRACKING',
    subtitle: 'Manténgase al tanto del estado de su envío a través del rastreo en tiempo real.',
    bg: 'bg-light-gray',
  },
  {
    icon: 'mdi-warehouse',
    title: 'ALMACENAMIENTO SEGURO',
    subtitle:
      'Garantizamos la seguridad de su cargamento en nuestros almacenes hasta el momento de su entrega.',
    bg: 'bg-light-blue',
  },
])
</script>

<style scoped>
.out {
  position: relative;
  z-index: 2;
  top: -7rem;
}

.feature-title {
  display: flex;
  align-items: center;
}

.feature-label {
  background: white;
  color: orange;
  border: 2px solid orange;
  border-radius: 10px;
  padding: 5px 10px;
  font-weight: bold;
}

.service-card {
  text-align: center;
  padding: 20px;
  border-radius: 10px;
}

.icon-circle {
  background: orange;
  color: white;
  padding: 10px;
  width: 70px;
  height: 70px;
}
.bg-light-orange {
  background-color: #ea960e32;
  color: black;
}
.bg-light-gray {
  background-color: #080c241d;
  color: black;
}
.bg-light-blue {
  background-color: #0083ef1a !important;
  color: black !important;
}
.TITLE {
  font-size: 24px;
  line-height: 34px;
  display: inline-block;
  font-family: Yantramanav;
  color: #080c24;
  text-align: left;
}
.CAPTION {
  font-size: 16px;
  line-height: 26px;
  font-family: 'Public Sans';
  text-align: left;
  display: inline-block;
  height: 78px;
}

.FEAT {
  font-size: 16px;
  line-height: 26px;
  font-weight: 600;
  font-family: 'Public Sans';
  color: #ea950e;
  text-align: center;
  display: inline-block;
  width: 335px;
}

.QO {
  font-size: 40px;
  font-weight: 900;
  font-family: Yantramanav;
  color: #080c24;
  text-align: left;
  display: inline-block;
}
.QOS {
  line-height: 26px;
  font-family: 'Public Sans';
  color: #565969;
}
.slide-group-container {
  position: relative;
}

/* Reposiciona los arrows predeterminados usando selectores profundos (deep selectors) */
.custom-slide-group::v-deep(.v-slide-group__prev),
.custom-slide-group::v-deep(.v-slide-group__next) {
  position: absolute;
  width: 60px;
  border-radius: 50%;
  background-color: #ea950e;
  height: 60px;
  transform: rotate(180deg);
  transform-origin: 0 0;
  top: -4rem;
}

/* Ubica ambos íconos juntos en la parte superior derecha */
.custom-slide-group::v-deep(.v-slide-group__prev) {
  right: 3rem;
}

.custom-slide-group::v-deep(.v-slide-group__next) {
  right: 7rem;
}
</style>
