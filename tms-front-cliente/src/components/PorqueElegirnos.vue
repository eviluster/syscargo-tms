<template>
  <div class="customposition">
    <v-container fluid style="background-color: #080c24" class="px-0">
      <v-row>
        <v-col cols="12" align="start">
          <v-img src="/image.svg" max-width="250" height="250"></v-img>
        </v-col>
      </v-row>
      <v-row>
        <v-container max-width="1100">
          <v-row>
            <v-col cols="12" md="6">
              <v-img
                src="/planout.png"
                max-width="196"
                max-height="46"
                class="d-flex text-center align-center"
              >
                <img src="/porque.png" alt="" />
              </v-img>

              <h2 class="py-5 title">¿POR QUÉ ELEGIRNOS?</h2>

              <p class="caption">
                Mejora drásticamente las métricas interactivas para servicios confiables. Libera
                proactivamente el potencial del comercio electrónico con soluciones totalmente
                investigadas.
              </p>
              <div class="pt-6">
                <div class="elemento d-flex pb-4">
                  <div class="contenedor">
                    <div class="elipse1"></div>
                    <div class="elipse2">
                      <img src="/delivery.png" alt="" style="width: 40px; height: 30px" />
                    </div>
                  </div>
                  <div class="d-flex flex-column">
                    <h5 class="elTitle">SERVIDIO DE TRANSPORTACIÓN RÁPIDA</h5>
                    <p class="elCaption">
                      Potencie sus métricas de interacción con servicios 100% confiables. Active
                      proactivamente estrategias respaldadas por análisis profundos.
                    </p>
                  </div>
                </div>
                <div class="elemento d-flex pb-4">
                  <div class="contenedor">
                    <div class="elipse1"></div>
                    <div class="elipse2">
                      <img src="/customer-service.png" alt="" style="width: 40px; height: 30px" />
                    </div>
                  </div>
                  <div class="d-flex flex-column">
                    <h5 class="elTitle">SERVIDIO DE TRANSPORTACIÓN RÁPIDA</h5>
                    <p class="elCaption">
                      Enhance interactive metrics for reliable services. Proactively unleash fully
                      researched.
                    </p>
                  </div>
                </div>
                <div class="elemento d-flex pb-4">
                  <div class="contenedor">
                    <div class="elipse1"></div>
                    <div class="elipse2">
                      <img src="/value.png" alt="" style="width: 40px; height: 30px" />
                    </div>
                  </div>
                  <div class="d-flex flex-column">
                    <h5 class="elTitle">SERVIDIO DE TRANSPORTACIÓN RÁPIDA</h5>
                    <p class="elCaption">
                      Enhance interactive metrics for reliable services. Proactively unleash fully
                      researched.
                    </p>
                  </div>
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="6" class="d-flex justify-center" align-self="center">
              <v-img src="/03390-icon-service-Content-Safety 1.png" max-width="413" height="413">
              </v-img>
            </v-col>
          </v-row>
        </v-container>
      </v-row>
      <v-row>
        <v-col cols="12" class="d-flex justify-end">
          <v-img src="/iamge.svg" max-width="250" height="250"></v-img>
        </v-col>
      </v-row>
    </v-container>
    <Estadisticas />
  </div>
</template>

<script setup>
import Estadisticas from './Estadisticas.vue'
</script>

<style scoped>
.title {
  color: #fff;
  font-family: Yantramanav;
  font-size: 40px;
  font-style: normal;
  font-weight: 900;
  line-height: normal;
}

.caption {
  color: var(--d-6-d-6-d-6, #d6d6d6);
  font-family: 'Public Sans';
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 26px;
}

.elTitle {
  color: #fff;
  font-family: Yantramanav;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.elCaption {
  color: var(--d-6-d-6-d-6, #d6d6d6);
  font-family: 'Public Sans';
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 26px;
  /* 162.5% */
}

.contenedor {
  position: relative;
  width: 100px;
  height: 100px;
}

.elipse1 {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #fff;
  opacity: 0.4;
}

.elipse2 {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #fff;
  position: absolute;
  left: 5px;
  bottom: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.customposition {
  position: relative;
  width: 100%;
  z-index: 1;
  top: -7rem;
}
</style>
