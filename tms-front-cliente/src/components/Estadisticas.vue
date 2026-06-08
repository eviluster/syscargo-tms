<template>
  <div class="custompositionE">
    <v-container max-width="1200" style="background-color: #080c24; border-top: 7px solid #ea950e">
      <v-row class="pa-5">
        <v-col cols="12" md="3">
          <div class="d-flex">
            <div class="d-flex flex-column">
              <span class="number">2000+</span>
              <h5 class="title">ORDENES COMPLETADAS</h5>
              <!-- <p class="caption">Conveniently impact front-end niches via maintainable.</p> -->
            </div>
            <v-divider
              :thickness="5"
              class="border-opacity-75"
              color="#EA950E"
              vertical
              style="height: 140px"
            ></v-divider>
          </div>
        </v-col>
        <v-col cols="12" md="3">
          <div class="d-flex">
            <div class="d-flex flex-column">
              <span class="number">100+</span>
              <h5 class="title mx-4">MEJORES TRABAJADORES</h5>
              <!-- <p class="caption">Conveniently impact front-end niches via maintainable.</p> -->
            </div>
            <v-divider
              :thickness="5"
              class="border-opacity-75"
              color="#EA950E"
              vertical
              style="height: 140px"
            ></v-divider>
          </div> </v-col
        ><v-col cols="12" md="3">
          <div class="d-flex">
            <div class="d-flex flex-column">
              <span class="number">450+</span>
              <h5 class="title">CLIENTES MUNDIALES</h5>
              <!-- <p class="caption">Conveniently impact front-end niches via maintainable.</p> -->
            </div>
            <v-divider
              :thickness="5"
              class="border-opacity-75"
              color="#EA950E"
              vertical
              style="height: 140px"
            ></v-divider>
          </div> </v-col
        ><v-col cols="12" md="3">
          <div class="d-flex">
            <div class="d-flex flex-column">
              <span class="number">80+</span>
              <h5 class="title">PREMIOS MUNDIALES</h5>
              <!-- <p class="caption">Conveniently impact front-end niches via maintainable.</p> -->
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup></script>

<style scoped>
.number {
  color: var(--Style, #ea950e);
  font-family: Yantramanav;
  font-size: 44px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
.title {
  color: var(--Style, #fff);
  font-family: Yantramanav;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
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
.custompositionE {
  position: absolute;
  width: 100%;
  z-index: 4;
  bottom: -6rem;
}
</style>
