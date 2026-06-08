<script setup>
import Contacto from './Contacto.vue'
import Formulario from './Formulario.vue'
import BannerDinamico from '@/components/BannerDinamico.vue'
import Mapa from './Mapa.vue'
const bannerTitle = 'CONTÁCTENOS'
const breadcrumb = [
  { title: 'Inicio', disabled: false, href: '/' },
  { title: 'Contáctenos', disabled: true },
]
</script>

<template>
  <BannerDinamico :title="bannerTitle" :breadcrumbItems="breadcrumb" />
  <v-container style="margin-top: 10%">
    <v-row justify="center">
      <!-- Card 1: Formulario -->
      <v-col cols="12" md="6" class="d-flex justify-center">
        <v-card width="100%">
          <v-card-item>
            <v-card-title class="d-flex justify-center"> </v-card-title>
          </v-card-item>
          <v-card-item>
            <Formulario />
          </v-card-item>
        </v-card>
      </v-col>
      <!-- Card 2: Contacto -->
      <v-col cols="12" md="6" class="d-flex justify-center" style="margin-left: -2%">
        <v-card width="100%">
          <v-card-item style="background-color: orange">
            <Contacto />
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
    <Mapa address="Avenida 27 y  76,Buenavista,Playa, La Habana, Cuba" style="margin-top: 50px" />
  </v-container>
</template>
