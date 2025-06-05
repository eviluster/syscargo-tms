<template>
  <div>
    <v-system-bar style="height: auto" absolute>
      <v-row>
        <v-col cols="12" md="3" class="px-0" style="padding-bottom: 9px">
          <v-img src="/public/left.png" height="123" cover class="custom"></v-img>
        </v-col>
        <v-col cols="12" md="9" class="">
          <v-row>
            <v-col cols="12">
              <v-row class="pt-3" style="background-color: #080c24">
                <v-col cols="12" md="4" align="center">
                  <span class="adresstime">
                    <!-- <i class="fas fa-map-marker-alt me-2 text-warning"></i> -->
                    <v-icon class="me-2 text-warning">mdi-map-marker-outline</v-icon>
                    2500 Southbranch Blvd A, United States</span
                  >
                </v-col>
                <v-col cols="12" md="4" class="d-flex">
                  <span class="adresstime">
                    <i class="far fa-clock me-2 text-warning"></i> Mon - Sat: 8 am - 5 pm, Sunday:
                    CLOSED</span
                  >
                </v-col>
                <v-col cols="12" md="4" align="center">
                  <div class="d-flex align-center social">
                    <a href="#" class="text-white me-5"><i class="fa-brands fa-facebook-f"></i></a>
                    <a href="#" class="text-white me-5"><i class="fa-brands fa-twitter"></i></a>
                    <a href="#" class="text-white me-5"><i class="fa-brands fa-linkedin"></i></a>
                    <a href="#" class="text-white"><i class="fa-brands fa-instagram"></i></a>
                  </div>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" class="pa-0">
                  <v-sheet elevation="0" color="white" height="73" class="d-flex align-center">
                    <v-btn icon class="d-md-none" @click="drawer = !drawer">
                      <v-icon>mdi-menu</v-icon>
                    </v-btn>

                    <div class="d-none d-md-flex align-center">
                      <router-link to="/" color="black" class="link">
                        Gestión Logística
                      </router-link>
                      <router-link to="/" color="black" class="link">
                        Planificación y Transporte de Mercancía
                      </router-link>
                      <router-link to="/reservar" color="black" class="link">
                        Reservar
                      </router-link>
                      <router-link to="/plans" color="orange" class="link"> Planes </router-link>
                      <router-link to="/" color="black" class="link"> Socios </router-link>
                      <router-link to="/" color="black" class="link"> Sobre Nosotros </router-link>
                    </div>

                    <v-spacer />

                    <v-btn
                      class="text-none text-subtitle-1 mr-4"
                      color="#ea950e"
                      variant="flat"
                      size="large"
                    >
                      Get A Quote
                    </v-btn>
                    <v-spacer />
                  </v-sheet>

                  <v-navigation-drawer v-model="drawer" temporary class="d-md-none">
                    <v-list>
                      <v-list-item> Gestión Logística </v-list-item>
                      <v-list-item> Planificación y Transporte de Mercancía </v-list-item>
                      <v-list-item> Reservar </v-list-item>
                      <v-list-item> Planes </v-list-item>
                      <v-list-item> Socios </v-list-item>
                      <v-list-item> Sobre Nosotros </v-list-item>
                    </v-list>
                  </v-navigation-drawer>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-system-bar>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Maneja el estado del drawer (abierto/cerrado)
const drawer = ref(false)
</script>

<style scoped>
.adresstime {
  font-family: 'Public Sans';
  color: #fff;
  font-size: 14px;
  text-align: left;
  display: inline-block;
}

.link {
  font-size: 16px;
  line-height: 26px;
  font-weight: 500;
  font-family: 'Public Sans';
  color: #080c24;
  white-space: pre-wrap;
  text-align: left;
  padding: 0 0.8rem;
  text-decoration: none;
}
.link:hover {
  color: #ea950e !important;
}
.social a :hover {
  color: #ea950e !important;
}
:deep(.v-img__img--cover) {
  object-fit: fill !important;
}
</style>
