<script setup lang="ts">
import Services from '@/components/Services.vue'
import BannerDinamico from '@/components/BannerDinamico.vue'
const bannerTitle = 'SERVICIOS'
const breadcrumb = [
  { title: 'Inicio', disabled: false, href: '/' },
  { title: 'Servicios', disabled: true },
]
</script>

<template>
  <BannerDinamico :title="bannerTitle" :breadcrumbItems="breadcrumb" />
  <Services />
</template>
