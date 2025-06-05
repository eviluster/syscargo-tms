<template>
  <div>
    <BannerDinamico :title="bannerTitle" :breadcrumbItems="breadcrumb" />
    <v-container max-width="1200" class="pt-12">
      <FormReserva />
      <v-card class="mt-5" elevation="3" height="280">
        <v-row no-gutters style="height: 100%">
          <!-- Sección izquierda (ícono o imagen de avión) -->
          <v-col
            cols="2"
            class="d-flex flex-column align-center justify-center"
            style="background-color: #ffa726"
          >
            <img
              src="/public//formReserva/truck-front.svg"
              alt=""
              style="width: 77px; height: 94px"
            />
          </v-col>

          <!-- Sección derecha (contenido principal) -->
          <v-col cols="10">
            <v-row class="py-6 px-4" style="height: 100%" no-gutters>
              <!-- Columna izquierda -->
              <v-col cols="6">
                <div class="py-2" style="display: flex; flex-direction: column; gap: 26px">
                  <div class="text-body-2 font-weight-medium mb-2 caption">Destino:</div>
                  <div class="text-body-2 font-weight-medium mb-2 caption">Tipo de Transporte:</div>
                  <div class="text-body-2 font-weight-medium mb-2 caption">Precio Estimado:</div>
                  <v-btn variant="text" class="py-3 px-0 leer">Leer Más... </v-btn>
                </div>
              </v-col>

              <!-- Columna derecha -->
              <v-col cols="6">
                <div class="py-2" style="display: flex; flex-direction: column; gap: 23px">
                  <div class="text-body-2 font-weight-medium mb-2 caption">Origen:</div>
                  <div class="text-body-2 font-weight-medium mb-2 caption">
                    Distancia a recorrer:
                  </div>
                  <div class="text-body-2 font-weight-medium mb-2 caption">Características:</div>
                  <div class="text-end px-6">
                    <v-btn class="colorcustom px-5" size="x-large" rounded="0">
                      Reservar
                      <img
                        src="/public/formReserva/file-pen.svg"
                        alt=""
                        style="width: 24px; height: 24px; padding-left: 6px"
                      />
                    </v-btn>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </div>
</template>

<script setup>
import BannerDinamico from '@/components/BannerDinamico.vue'
import FormReserva from '@/components/FormReserva.vue'

const bannerTitle = 'RESERVAR ENVÍO'
const breadcrumb = [
  { title: 'Home', disabled: false, href: '/' },
  { title: 'Reservar envío', disabled: true },
]
</script>

<style scoped>
.caption {
  color: #565969;
  font-family: Yantramanav;
  font-size: 24px !important;
  font-style: normal;
  font-weight: 400 !important;
  line-height: normal;
}
.leer {
  color: #ea950e;
  font-family: Yantramanav;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  text-transform: capitalize;
}
.colorcustom {
  background-color: #ea950e;
  color: white;
  color: var(--Style, #fff);
  font-family: 'Public Sans';
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
</style>
