<template>
  <div>
    <BannerDinamico :title="bannerTitle" :breadcrumbItems="breadcrumb" />
    <v-container>
      <v-card class="mx-auto d-flex flex-column cursor-pointer" max-width="800" height="100%">
        <v-img class="white--text align-end" height="400" :src="service.picture" cover> </v-img>
        <v-card-title>{{ service.name }}</v-card-title>
        <div class="icon-container">
          <v-icon class="category-icon">{{ service.icon }}</v-icon>
        </div>
        <v-card-text>
          <p>{{ service.description }}</p>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quia voluptates, atque in,
            facere voluptatibus, commodi accusantium rem sunt voluptatem facilis sed eos minus
            quibusdam ducimus doloribus quod dicta culpa fugit.
          </p>
          <br />
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi veritatis inventore iure
            omnis tenetur ad consequuntur repellat sunt minima? Consequuntur ullam aperiam omnis
            impedit deleniti pariatur sint, eveniet tenetur nihil!
          </p>
        </v-card-text>
        <v-container>
          <v-row>
            <v-col cols="6">
              <v-img
                class="white--text align-end"
                height="300"
                width="400"
                :src="service.picture"
                cover
              >
              </v-img>
            </v-col>
            <v-col cols="6">
              <v-card-text>
                <h2>{{ service.description }}</h2>
                <br />
                <div class="text-item">
                  <span class="marker"></span>
                  <p>Customer engagement matters</p>
                </div>
                <div class="text-item">
                  <span class="marker"></span>
                  <p>The love boat promise</p>
                </div>
                <div class="text-item">
                  <span class="marker"></span>
                  <p>Research beyond business plan</p>
                </div>
                <div class="text-item">
                  <span class="marker"></span>
                  <p>Logistics ground in South America</p>
                </div>
              </v-card-text>
            </v-col>
          </v-row>
        </v-container>
        <h2 class="mx-5">Como funciona</h2>
        <v-divider class="mx-4 mb-1"></v-divider>
        <p class="mx-5">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi veritatis inventore iure
          omnis tenetur ad consequuntur repellat sunt minima? Consequuntur ullam aperiam omnis
          impedit deleniti pariatur sint, eveniet tenetur nihil!
        </p>
        <br />
        <v-img class="white--text align-end" height="400" :src="service.picture" cover></v-img>
        <p class="mx-5 my-5">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi veritatis inventore iure
          omnis tenetur ad consequuntur repellat sunt minima? Consequuntur ullam aperiam omnis
          impedit deleniti pariatur sint, eveniet tenetur nihil!
        </p>
        <br />
        <v-card-actions>
          <v-btn @click="$router.go(-1)" color="primary">Regresar</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTransportStore } from '@/stores/servicesStore'
import BannerDinamico from '@/components/BannerDinamico.vue'

export default defineComponent({
  components: { BannerDinamico },
  setup() {
    const route = useRoute()
    const store = useTransportStore()
    const services = store.transportCategories
    const bannerTitle = 'Servicio Detalles'
    const breadcrumb = [
      { title: 'Home', disabled: false, href: '/' },
      { title: 'Servicio Detalles', disabled: true },
    ]
    const service = computed(() => {
      const serviceId = Number(route.params.serviceId)
      return services[serviceId]
    })

    return { service, bannerTitle, breadcrumb }
  },
})
</script>

<style scoped>
.icon-container {
  position: absolute;
  top: 370px;
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
}

.text-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.marker {
  width: 10px;
  height: 10px;
  background-color: transparent;
  border: 2px solid orange;
  margin-right: 10px;
}

.category-icon {
  font-size: 40px;
  color: #1976d2;
}
</style>
