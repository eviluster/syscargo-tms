<template>
  <div>
    <BannerDinamico :title="bannerTitle" :breadcrumbItems="breadcrumb" />
    <v-container max-width="1220" class="py-12 mb-10">
      <v-row class="py-12">
        <v-col cols="12" align="center">
          <v-img
            src="/public/planout.png"
            max-width="174"
            max-height="46"
            class="d-flex align-center"
          >
            <img src="/public/planin.png" alt="" />
          </v-img>
          <h2 class="title py-6">OUR FLEXIBLE PRICE</h2>
          <p class="caption" style="max-width: 556px">
            Dramatically enhance interactive metrics for reliable services. Proactively unleash
            fully researched e-commerce.
          </p>
        </v-col>
      </v-row>
      <v-row class="text-center" style="padding-bottom: 5rem">
        <!-- Recorremos la lista de planes con v-for -->
        <v-col v-for="(plan, index) in plans" :key="index" cols="12" sm="4" class="d-flex">
          <v-card class="py-8 px-12 cardcustom" width="391" elevation="4">
            <div class="mb-4 text-start d-flex flex-column justify-start">
              <h2 class="nameplan pb-2">{{ plan.name }} Plan</h2>
              <v-divider
                class="border-opacity-100"
                :thickness="4"
                color="#EA950E"
                length="104"
              ></v-divider>
            </div>

            <div class="text-h5 mb-2 d-flex">
              <span class="customprice">{{ plan.price }}</span>
              <div class="d-flex flex-column">
                <span class="moneda text-start">$</span>
                <span class="month">/Per Month</span>
              </div>
            </div>
            <v-divider :thickness="2" class="border-opacity-25"></v-divider>

            <div
              class="d-flex flex-row py-4"
              :class="{ 'feature-disabled': !feature.enabled }"
              v-for="(feature, i) in plan.features"
              :key="i"
            >
              <v-icon class="iconcheck mr-4">mdi-check-circle-outline</v-icon>
              <span class="sublist">{{ feature.name }}</span>
            </div>

            <v-card-actions class="justify-start mt-5">
              <v-btn class="colorcustom px-5" size="x-large" rounded="0" @click="choosePlan(plan)">
                CHOOSE PLAN
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BannerDinamico from '@/components/BannerDinamico.vue'
const bannerTitle = 'PLANES Y PRECIOS'
const breadcrumb = [
  { title: 'Home', disabled: false, href: '/' },
  { title: 'Planes', disabled: true },
]

const plans = ref([
  {
    name: 'Basic',
    price: 60,

    features: [
      { name: '1 warehouse', enabled: true },
      { name: 'Custom business rules', enabled: true },
      { name: 'Real-time rate shopping', enabled: true },
      { name: '100 freight shipments', enabled: false },
      { name: 'Any time 24/7 hour support', enabled: false },
    ],
  },
  {
    name: 'Standard',
    price: 100,

    features: [
      { name: '1 warehouse', enabled: true },
      { name: 'Custom business rules', enabled: true },
      { name: 'Real-time rate shopping', enabled: true },
      { name: '100 freight shipments', enabled: true },
      { name: 'Any time 24/7 hour support', enabled: false },
    ],
  },
  {
    name: 'Premium',
    price: 160,

    features: [
      { name: '1 warehouse', enabled: true },
      { name: 'Custom business rules', enabled: true },
      { name: 'Real-time rate shopping', enabled: true },
      { name: '100 freight shipments', enabled: true },
      { name: 'Any time 24/7 hour support', enabled: true },
    ],
  },
])

const choosePlan = (plan) => {
  console.log('Plan elegido:', plan.name)
}
</script>

<style scoped>
.title {
  color: #080c24;
  text-align: center;
  font-family: Yantramanav;
  font-size: 44px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
.caption {
  color: var(--565969, #565969);
  text-align: center;
  font-family: 'Public Sans';
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 26px;
}

.nameplan {
  color: var(--00235-a, #080c24);
  font-family: Yantramanav;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
.customprice {
  color: var(--Style, #ff4c13);
  font-family: Yantramanav;
  font-size: 65px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
.moneda {
  color: var(--Style, #ff4c13);
  font-family: Yantramanav;
  font-size: 36px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
.month {
  color: var(--Style, #000f57);
  font-family: 'Public Sans';
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}
.iconcheck {
  color: var(--Style, #ea950e);
  font-family: 'Font Awesome 5 Free';
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.sublist {
  color: var(--Style, #4d5765);
  font-family: 'Public Sans';
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.colorcustom {
  background-color: #080c24;
  color: white;
}

.cardcustom:hover .colorcustom {
  background-color: #ea950e;
}
.cardcustom:hover .nameplan {
  color: #ea950e !important;
}

.feature-disabled {
  opacity: 0.4;
  pointer-events: none;
}
</style>
