<script setup lang="ts">
import Services from '@/components/Services.vue'
import BannerDinamico from '@/components/BannerDinamico.vue'
const bannerTitle = 'Servicios'
const breadcrumb = [
  { title: 'Home', disabled: false, href: '/' },
  { title: 'Servicios', disabled: true },
]
</script>

<template>
  <BannerDinamico :title="bannerTitle" :breadcrumbItems="breadcrumb" />
  <Services />
</template>
