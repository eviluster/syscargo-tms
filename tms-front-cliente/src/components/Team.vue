<template>
  <div>
    <v-container class="py-12" max-width="1220">
      <v-row justify="center">
        <v-col cols="12" align="center">
          <v-img src="/planout.png" height="54" max-width="195" class="d-flex align-center">
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
              MIEMBROS DEL EQUIPO
            </h2>
          </v-img>

          <h2 class="py-5 title">NUESTRO EQUIPO PROFESIONAL</h2>

          <!-- <p class="caption" style="max-width: 600px">
            Dramatically enhance interactive metrics for reliable services. Proactively unleash
            fully researched e-commerce.
          </p> -->
        </v-col>
      </v-row>

      <!-- Tarjetas  -->
      <v-row class="slide-group-container pt-10" style="position: relative">
        <v-slide-group
          elevation="8"
          max-width="800"
          v-model="model"
          prev-icon="mdi-chevron-left"
          next-icon="mdi-chevron-right"
          class="custom-slide-group"
          center-active="true"
        >
          <v-slide-group-item v-for="(item, index) in slides" :key="index">
            <v-card
              class="testimonio-card me-6 d-flex flex-column mb-2"
              height="470"
              width="390"
              elevation="2"
            >
              <v-img :src="item.image" cover height="350"> </v-img>

              <div
                class="d-flex flex-column text-center align-center pa-8 customback"
                style="position: relative"
              >
                <div class="contenedor">
                  <div class="elipse1"></div>
                  <div class="elipse2"></div>
                </div>

                <h3 class="text-h6 font-weight-bold mb-4 TITLE">{{ item.name }}</h3>
                <span class="customrole">
                  {{ item.role }}
                </span>
              </div>

              <div class="circle-group">
                <!-- Cada círculo con su ícono oculto inicialmente -->
                <div class="circle">
                  <router-link to="/"
                    ><v-icon class="icon" color="blue">mdi-facebook</v-icon></router-link
                  >
                </div>
                <div class="circle">
                  <router-link to="/"
                    ><v-icon class="icon" color="light-blue">mdi-twitter</v-icon></router-link
                  >
                </div>
                <div class="circle">
                  <router-link to="/"
                    ><v-icon class="icon" color="green">mdi-whatsapp</v-icon></router-link
                  >
                </div>
                <div class="circle">
                  <router-link to="/">
                    <v-icon class="icon" color="indigo darken-1">mdi-linkedin</v-icon></router-link
                  >
                </div>
              </div>
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
    image: 'https://cdn.vuetifyjs.com/images/john.jpg',
    name: 'ANJELINA MATHEUS',
    role: 'Co-Founder',
  },
  {
    image: 'https://randomuser.me/api/portraits/women/85.jpg',

    name: 'MONISH POUL',
    role: 'Co-Founder',
  },
  {
    image: 'https://cdn.vuetifyjs.com/images/john.jpg',
    name: 'ANJELINA MATHEUS',
    role: 'Co-Founder',
  },
  {
    image: 'https://randomuser.me/api/portraits/women/85.jpg',
    name: 'MONISH POUL',
    role: 'Co-Founder',
  },
  {
    image: 'https://picsum.photos/350/165?random',
    name: 'ANJELINA MATHEUS',
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
  line-height: 54px; /* 122.727% */
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
  color: #080c24;
  text-align: center;
  font-family: 'Be Vietnam';
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
.customrole {
  color: #565969;
  text-align: center;
  font-family: 'Public Sans';
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}
.customback {
  background-color: #fff;
}

.testimonio-card:hover .customback {
  background-color: #ea950e;
}

.testimonio-card:hover .TITLE {
  color: white;
}

.testimonio-card:hover .customrole {
  color: white;
}

.contenedor {
  position: relative;
  width: 0px;
  height: 0px;
}

.elipse1 {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #ea950e;
  opacity: 0.4;
  position: absolute;
  left: 7rem;
  bottom: 0.2rem;
}

.elipse2 {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ea950e;
  position: absolute;
  left: 122px;
  bottom: 13px;
}

.testimonio-card:hover .elipse1 {
  background-color: white;
}

.testimonio-card:hover .elipse2 {
  background-color: white;
}

/* Contenedor de los círculos blancos */
.circle-group {
  position: absolute;
  top: 46%;
  right: 31px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Cada círculo blanco */
.circle {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}

/* Ícono que “sale” del círculo */
.icon {
  position: absolute;
  top: 100%; /* Inicia por debajo del círculo */
  left: 50%;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  transform: translate(-50%, 0);
  opacity: 0; /* Ícono invisible al inicio */
  transition: all 0.3s ease;
}
.int {
  top: 20px;
  right: 10px;
}

/* Al hacer hover en la card, mover el ícono al centro del círculo */
.testimonio-card:hover .circle .icon {
  top: 50%;
  transform: translate(-50%, -50%);
  opacity: 1;
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
