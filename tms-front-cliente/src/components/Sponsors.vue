<template>
  <div class="py-12">
    <v-container class="py-10" max-width="1220">
      <v-row justify="center">
        <v-col cols="12" align="center">
          <v-img
            src="/public/planout.png"
            max-width="174"
            max-height="46"
            class="d-flex align-center"
          >
            <img src="/public/happy.png" alt="" />
          </v-img>

          <h2 class="py-5 title">TRUSTED BY OUR 365,000 CLIENTS</h2>

          <p class="caption" style="max-width: 600px">
            Dramatically enhance interactive metrics for reliable services. Proactively unleash
            fully researched e-commerce.
          </p>
        </v-col>
      </v-row>

      <v-row class="pt-12" align="center" justify="space-around">
        <v-col cols="6" sm="2" align="center" v-for="(logo, index) in logos" :key="index">
          <v-img
            :src="logo.src"
            :alt="`Logo de la compañía ${index + 1}`"
            max-width="70"
            height="73"
            contain
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const logos = ref([
  { src: '/public/Group(1).png' },
  { src: '/public/Group(2).png' },
  { src: '/public/Group(3).png' },
  { src: '/public/Group(4).png' },
  { src: '/public/Group(5).png' },
  { src: '/public/Group.png' },
])
</script>

<style scoped>
.title {
  color: var(--00235-a, #080c24);
  text-align: center;
  font-family: Yantramanav;
  font-size: 44px;
  font-style: normal;
  font-weight: 700;
  line-height: 54px; /* 122.727% */
}
.caption {
  color: var(--565969, #565969);
  text-align: center;
  font-family: 'Public Sans';
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 26px; /* 162.5% */
}
</style>
