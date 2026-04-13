<template>
  <div>
    <v-system-bar style="height: auto" absolute>
      <v-row no-gutters style="align-items: stretch">
        <v-col cols="12" md="3" sm="4" class="pa-0 banner-col">
        </v-col>
        <v-col cols="12" md="9" sm="8">
          <v-row>
            <v-col cols="12">
              <v-row class="pt-3 up-header" style="background-color: #080c24">
                <v-col cols="12" sm="6" md="4" align="center">
                  <span class="adresstime">
                    <v-icon class="me-2 text-warning">mdi-map-marker-outline</v-icon>
                    Calle 76, #2707, entre 29 y 27, Playa</span
                  >
                </v-col>
                <v-col cols="12" sm="6" md="4" class="d-flex justify-center justify-sm-start">
                  <span class="adresstime">
                    <i class="far fa-clock me-2 text-warning"></i> LUN - SAB: 8 am - 5 pm, DOMINGO:
                    CERRADO</span
                  >
                </v-col>
                <v-spacer class="d-none d-md-flex"></v-spacer>
                <v-col cols="12" md="4" align="center" class="d-none d-md-flex">
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
                    <v-spacer />
                    <div class="d-flex align-center d-sm-none d-md-flex">
                      <router-link to="/" color="black" class="link"> Inicio </router-link>
                      <router-link to="/reservar" color="black" class="link">
                        Reservar
                      </router-link>
                      <router-link to="/services" color="black" class="link">
                        Servicios
                      </router-link>
                      <router-link to="/plans" color="orange" class="link"> Planes </router-link>
                      <router-link to="/contact" color="black" class="link">
                        Contáctenos
                      </router-link>
                    </div>

                    <v-spacer />

                    <v-btn
                      class="text-none text-subtitle-1 mr-4"
                      color="#ea950e"
                      variant="flat"
                      size="large"
                    >
                      PEDIR COTIZACIÓN
                    </v-btn>
                    <v-spacer />
                    <v-btn icon class="d-md-none" @click="drawer = !drawer">
                      <v-icon>mdi-menu</v-icon>
                    </v-btn>
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

const drawer = ref(false)
</script>

<style scoped>
/* La imagen como background evita cualquier distorsión */
.banner-col {
  background-image: url('/left.png');
  /* background-size: 100% 100%;   ocupa todo el espacio exacto del contenedor  */
  background-size: cover;
  background-repeat: no-repeat;
  /* background-position: left center; */
  background-position: center center;
  min-height: 123px;
}

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
.social a:hover {
  color: #ea950e !important;
}

/**RESPONSIVE**/
@media screen and (max-width: 960px) {
  .adresstime {
    font-size: 12px;
    text-align: center;
  }

  .banner-col {
    min-height: 80px !important;
  }
}

@media screen and (max-width: 600px) {
  .adresstime {
    font-size: 11px;
  }
}
</style>
