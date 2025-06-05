<template>
  <div style="padding-bottom: 3rem" class="pt-12">
    <v-container max-width="1220" style="background-color: #080c24" height="600">
      <h2 class="title text-center pt-4">COMENTARIOS</h2>
      <!-- Sección principal con formulario e información -->
      <v-row justify="center" class="mt-5">
        <!-- Formulario -->
        <v-col cols="12" md="8" class="px-10" style="border-radius: 5px; color: white !important">
          <h2 class="custominfo">Personal Information :</h2>
          <v-form>
            <v-row>
              <v-col cols="12" md="4"
                ><!-- Nombre y Apellidos -->
                <v-text-field
                  label="Nombre y Apellidos"
                  variant="outlined"
                  dense
                  class="my-3"
                  rounded="0"
                  color="white"
              /></v-col>
              <v-col cols="12" md="4">
                <!-- Correo -->
                <v-text-field
                  label="Your Email"
                  variant="outlined"
                  rounded="0"
                  dense
                  class="my-3"
                  color="white"
                />
              </v-col>

              <v-col cols="12" md="4">
                <!-- Teléfono -->
                <v-text-field
                  label="Phone Number"
                  rounded="0"
                  variant="outlined"
                  dense
                  class="my-3"
                  color="white"
              /></v-col>
            </v-row>
            <h2 class="custominfo">Comentarios</h2>
            <!-- Comentarios -->
            <v-textarea variant="outlined" dense rounded="0" rows="5" class="my-5" color="white" />
            <!-- Botón -->
            <v-btn class="mt-7" color="#EA950E" block size="x-large"> REQUEST A QUOTE </v-btn>
          </v-form>
        </v-col>

        <!-- Sección lateral de información -->
        <v-col cols="12" md="4" class="px-6 py-8">
          <div
            class="py-7 px-6 text-white text-center d-flex flex-column justify-space-around"
            style="background-color: #ea950e; height: 415px"
          >
            <h2 class="infotitle">Su opinión importa</h2>
            <p class="infosubtitle">
              Mejorar para garantizar su satisfacción es nuestra prioridad, por lo que su opinión es
              valiosa para nosotros.
            </p>
            <div class="d-flex justify-center">
              <v-btn
                outlined
                color="#EA950E"
                variant="outlined"
                rounded="0"
                class="text-white infobtn"
                size="large"
                width="170"
              >
                CONTÁCTENOS
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup></script>

<style scoped>
.title {
  color: #fff;
  font-family: Yantramanav;
  font-size: 44px;
  font-style: normal;
  font-weight: 700;
  line-height: 54px;
}
.custominfo {
  color: #fff;
  font-family: Yantramanav;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
.infotitle {
  color: #fff;
  font-family: Yantramanav;
  font-size: 30px;
  font-style: normal;
  font-weight: 700;
  line-height: 40px;
}
.infosubtitle {
  color: #fff;
  font-family: 'Public Sans';
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 26px;
}
.infobtn {
  color: #fff;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  font-family: 'Public Sans';
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 40px; /* 250% */
  text-transform: uppercase;
}
</style>
