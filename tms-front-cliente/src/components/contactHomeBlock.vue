<template>
  <div class="py-12">
    <v-container fluid class="px-0">
      <v-row>
        <v-col cols="7" class="pr-0">
          <img
            src="/contacthome.png"
            alt=""
            style="height: 100%; object-fit: fill !important ; width: 100%"
          />
        </v-col>
        <v-col cols="5" class="pl-0">
          <div class="d-flex flex-column pa-7 ga-7" style="background-color: #080c24; height: 100%">
            <v-img
              src="/planout.png"
              max-width="149"
              max-height="46"
              class="d-flex align-center text-center"
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
                HABLEMOS
              </h2>
            </v-img>
            <span class="title">¿NESECITA AYUDA? ESTAMOS PARA AYUDARLE</span>
            <div class="d-flex">
              <div class="mr-4" style="height: 76px">
                <div class="elipse1"></div>
                <div class="elipse2">
                  <v-icon aria-hidden="false" color="white"> mdi-phone </v-icon>
                </div>
              </div>

              <div>
                <h3 class="text-h6 font-weight-bold mb-1 TITLE">Tiene Alguna pregunta</h3>
                <span class="phone"> +5363402860 </span>
              </div>
            </div>
            <div>
              <v-btn
                class="text-none text-subtitle-1"
                color="#ea950e"
                variant="flat"
                size="x-large"
                rounded="0"
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
  font-size: 43px;
  font-style: normal;
  font-weight: 700;
  line-height: 54px;
}
.TITLE {
  color: var(--Style, #fff);
  font-family: Yantramanav;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
.phone {
  color: #ea950e;
  font-family: Yantramanav;
  font-size: 30px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
.elipse1 {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background-color: #ea950e;
  opacity: 0.4;
}

.elipse2 {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #ea950e;
  position: relative;
  left: 13.3px;
  bottom: 62.9px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
