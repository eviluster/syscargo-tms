<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="d-flex justify-center my-4">
        <div style="width: 605px" class="text-center">
          <h2 class="title">Nuestros Servicios</h2>
          <p class="caption">
            Optimice rápidamente modelos cooperativos para obtener un ROI de alto impacto a largo plazo.
            Impulse de manera dinámica el comercio electrónico innovador y paradigmas distribuidos
          </p>
        </div>
      </v-col>
    </v-row>
    <v-row class="py-4 my-6">
      <v-col v-for="(category, index) in transportCategories" :key="index" cols="12" md="4">
        <v-card
          class="mx-auto d-flex justify-center hover-effect flex-column align-center"
          height="auto"
          elevation="0"
          width="auto"
          style="background: transparent"
        >
          <v-img
            class="align-end text-white flex-shrink-0 topimg"
            height="236"
            width="308"
            :src="category.picture"
            cover
          >
          </v-img>
          <div class="icon-container">
            <v-icon class="category-icon">{{ category.icon }}</v-icon>
          </div>
          <v-img
            class="align-center text-white bottomimg"
            width="391"
            height="254"
            src="/mark.png"
            cover
          >
            <v-container max-width="331">
              <div class="d-flex flex-column px-4 cursor-pointer">
                <h2 class="nameC pt-10">{{ category.name }}</h2>
                <p class="captionC">{{ category.description }}</p>
                <v-divider
                  :thickness="3"
                  class="my-4 divider border-opacity-100"
                  color="black"
                ></v-divider>
                <div class="d-flex" style="justify-content: space-between">
                  <router-link
                    :to="{ name: 'ServiceDetail', params: { serviceId: index } }"
                    class="link"
                    >LEER MÁS</router-link
                  >
                  <router-link
                    :to="{ name: 'ServiceDetail', params: { serviceId: index } }"
                    class="link icon-link"
                  >
                    <v-icon color="#EA950E" icon="mdi-arrow-right-circle" size="x-large"></v-icon>
                  </router-link>
                </div>
              </div>
            </v-container>
          </v-img>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.topimg {
  width: 308px;
  height: 236px;
  position: relative;
  top: 4rem;
}

.nameC {
  font-size: 20px;
  display: inline-block;
  font-family: Yantramanav;
  color: #080c24;
  text-align: left;
  transition: color 0.3s ease;
}

.captionC {
  font-size: 16px;
  line-height: 26px;
  font-family: 'Public Sans';
  color: #565969;
  text-align: left;
  display: inline-block;
  height: 52px;
  transition: color 0.3s ease;
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
  margin-bottom: 5%;
  transition: color 0.3s ease;
}

.icon-container {
  position: absolute;
  top: 235px;
  right: 2rem;
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
  z-index: 2;
}

.category-icon {
  font-size: 30px;
  color: #1976d2;
}

.hover-effect {
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;
  z-index: 1;
}

.hover-effect:hover .nameC,
.hover-effect:hover .captionC,
.hover-effect:hover .link,
.hover-effect:hover .divider,
.hover-effect:hover .icon-link .v-icon {
  color: black;
}
.divider {
  margin-left: 0;
}

.hover-effect:hover .bottomimg {
  filter: brightness(0.8) sepia(0.5) saturate(5) hue-rotate(-10deg);
}

.icon-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

.icon-link:hover {
  background-color: aliceblue;
}

.icon-link:hover .v-icon {
  color: black !important;
}


@media (max-width: 1200px) {
  .icon-container {
    right: 2rem; /* Ajusta la posición en pantallas más pequeñas */
  }
}

@media (max-width: 992px) {
  .icon-container {
    right: 18rem; /* Ajusta la posición en pantallas medianas */
  }
}

@media (max-width: 768px) {
  .icon-container {
    right: 0.5rem; /* Ajusta la posición en tablets */
  }
}

@media (max-width: 600px) {
  .icon-container {
    width: 50px;
    height: 50px;
    top: 180px; /* Ajusta la posición en móviles */
    right: 10px;
  }

  .category-icon {
    font-size: 25px; /* Ajusta el tamaño del ícono en móviles */
  }
}

@media (max-width: 480px) {
  .icon-container {
    top: 250px; /* Ajusta la posición en móviles pequeños */
    right: 70px;
  }
}
</style>

<script lang="ts">
import { useTransportStore } from '@/stores/servicesStore'
import { defineComponent } from 'vue'
import { storeToRefs } from 'pinia'

export default defineComponent({
  setup() {
    const store = useTransportStore()
    const { transportCategories } = storeToRefs(store)

    return { transportCategories }
  },
})
</script>
