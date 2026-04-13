<template>
  <v-container class="py-10" max-width="1220">
    <v-row justify="space-between">
      <!-- Columna Izquierda (Imágenes) -->
      <v-col cols="12" md="6">
        <div class="images-wrapper">
          <!-- Imagen grande -->
          <v-img src="/about1.png" alt="Grupo grande" class="large-image" cover />

          <!-- Imagen pequeña superpuesta abajo a la derecha -->
          <v-img src="/about2.png" alt="Grupo pequeño" class="small-image" cover />

          <!-- Patrón de puntos en la esquina inferior izquierda -->
          <div class="dots-pattern"></div>
        </div>
      </v-col>

      <v-col cols="12" md="5">
        <v-img
          src="/planout.png"
          height="54"
          max-width="195"
          class="d-flex align-center mb-5 justify-center"
        >
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
            SOBRE NOSOTROS
          </h2>
        </v-img>

        <h2 class="font-weight-bold mb-3 TB">
          Bienvenidos a la mejor empresa de transportación en Cuba
        </h2>

        <div style="width: 478px" class="d-flex flex-row pb-7">
          <v-divider :thickness="4" class="border-opacity-75" color="#ea950e" vertical></v-divider>
          <p class="text-muted pl-5 SB">
            Somos una empresa completamente eficiente y dedicados a la satisfacción de nuestros
            clientes.
          </p>
        </div>

        <div class="lista pl-10">
          <div class="d-flex flex-row pb-4">
            <v-img src="/iconAbout.png" height="18" max-width="18"></v-img>
            <span class="sublist">Conozca nuestro equipo</span>
          </div>
          <div class="d-flex flex-row pb-4">
            <v-img src="/iconAbout.png" height="18" max-width="18"></v-img>
            <span class="sublist">Conozca nuestra empresa</span>
          </div>
          <div class="d-flex flex-row pb-4">
            <v-img src="/iconAbout.png" height="18" max-width="18"></v-img>
            <span class="sublist">Contáctenos</span>
          </div>
          <div class="d-flex flex-row pb-2">
            <v-img src="/iconAbout.png" height="18" max-width="18"></v-img>
            <span class="sublist">Equipo profesional</span>
          </div>
          <v-divider class="border-opacity-25"></v-divider>
        </div>

        <div class="text-center pt-6">
          <v-btn class="text-none text-subtitle-1" color="#ea950e" variant="flat" size="large">
            Leer más
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup></script>

<style scoped>
.feature-label {
  background: white;
  color: orange;
  border: 2px solid orange;
  border-radius: 10px;
  padding: 5px 10px;
  font-weight: bold;
}
.ABOUT {
  font-size: 16px;
  line-height: 26px;
  font-weight: 600;
  font-family: 'Public Sans';
  color: #ea950e;
  text-align: center;
  display: inline-block;
  width: 335px;
}
.TB {
  font-size: 40px;
  line-height: 50px;
  font-weight: 900;
  font-family: Yantramanav;
  color: #080c24;
  text-align: left;
  display: inline-block;
}
.SB {
  font-size: 20px;
  line-height: 30px;
  font-weight: 500;
  font-family: 'Public Sans';
  color: #080c24;
  text-align: left;
  display: inline-block;
  height: 60px;
}
.sublist {
  font-size: 16px;
  line-height: 26px;
  font-family: 'Public Sans';
  color: #080c24;
  text-align: left;
  padding-left: 20px;
}

.images-wrapper {
  position: relative;
  height: 500px;
  width: 100%;
}

.large-image {
  width: 462px;
  height: 410px;
  object-fit: cover;
  display: block;
}

.small-image {
  position: absolute;
  width: 287px;
  bottom: 0;
  right: 0;
  border: 1px solid #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  height: 244px;
}

.dots-pattern {
  position: absolute;
  bottom: 0;
  left: -4rem;
  width: 108px;
  height: 93px;
  background: url('/src/assets/shape.png') no-repeat center/cover;
}
</style>
