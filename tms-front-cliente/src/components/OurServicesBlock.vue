<template>
  <div style="background-color: #5659690f" class="custompositiontop">
    <v-container class="pt-10 pb-2" max-width="1220">
      <v-row>
        <v-col cols="12" class="d-flex justify-center">
          <div style="width: 605px" class="text-center">
            <h2 class="title">Nuestros Servicios</h2>
            <p class="caption">
              En SysCargo, impulsamos soluciones logísticas inteligentes que transforman cadenas de suministro.
              Combinamos innovación en comercio electrónico con paradigmas distribuidos para ofrecer
            </p>
          </div>
        </v-col>
      </v-row>
      <v-row style="position: relative">
        <v-slide-group elevation="8" max-width="800" v-model="model" prev-icon="mdi-chevron-left"
          next-icon="mdi-chevron-right" class="custom-slide-group" center-active="true">
          <v-slide-group-item v-for="(category, index) in transportCategories" :key="index">
            <v-card class="mx-auto d-flex justify-center flex-column hover-effect align-center" height="auto"
              elevation="0" width="auto" style="background: transparent">
              <v-img class="align-end text-white flex-shrink-0 topimg" height="236" width="308" :src="category.picture"
                cover>
              </v-img>
              <v-img class="align-center text-white bottomimg" width="391" height="254" src="/mark.png" cover>
                <div class="icon-container">
                  <v-icon class="category-icon">{{ category.icon }}</v-icon>
                </div>
                <v-container max-width="331">
                  <div class="d-flex flex-column px-4">
                    <h2 class="nameC pt-10">{{ category.name }}</h2>
                    <p class="captionC">{{ category.description }}</p>
                    <v-divider :thickness="4" class="my-4"></v-divider>
                    <div class="d-flex" style="justify-content: space-between">
                      <router-link to="/services" class="link">READ MORE</router-link>
                      <router-link to="/services" class="link">
                        <v-icon color="#EA950E" icon="mdi-arrow-right-circle" size="x-large"></v-icon></router-link>
                    </div>
                  </div>
                </v-container>
              </v-img>
            </v-card>
          </v-slide-group-item>
        </v-slide-group>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { useTransportStore } from '@/stores/servicesStore'
import { storeToRefs } from 'pinia'

const store = useTransportStore()
const { transportCategories } = storeToRefs(store)
const model = null
</script>

<style scoped>
.title {
  font-size: 40px;
  font-weight: 900;
  font-family: Yantramanav;
  color: #080c24;
  text-align: center;
  display: inline-block;
}

.caption {
  font-size: 16px;
  line-height: 26px;
  font-family: 'Public Sans';
  color: #565969;
  text-align: center;
  display: inline-block;
  height: 52px;
}

.topimg {
  width: 308px;
  height: 236px;
  position: relative;
  top: 4rem;
}

.nameC {
  font-size: 24px;
  display: inline-block;
  font-family: Yantramanav;
  color: #080c24;
  text-align: left;
}

.captionC {
  font-size: 16px;
  line-height: 26px;
  font-family: 'Public Sans';
  color: #565969;
  text-align: left;
  display: inline-block;
  height: 52px;
}

.link {
  font-size: 14px;
  line-height: 26px;
  font-weight: 600;
  font-family: 'Public Sans';
  color: #080c24;
  text-align: left;
  display: inline-block;
  text-decoration: none;
}

.icon-container {
  position: absolute;
  top: 0;
  right: 4rem;
  background: white;
  border-radius: 50%;
  padding: 10px;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 5px solid orange;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.category-icon {
  font-size: 30px;
  color: #1976d2;
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

.custompositiontop {
  position: relative;
  z-index: 2;
}
</style>
