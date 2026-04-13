<script setup>
import Slider from '@/components/Slider.vue'
import QueOfrecemosBlock from '@/components/QueOfrecemosBlock.vue'
import AboutBlock from '@/components/AboutBlock.vue'
import OurServicesBlock from '@/components/OurServicesBlock.vue'
import Comentarios from '@/components/Comentarios.vue'
import Sponsors from '@/components/Sponsors.vue'
import Testimonios from '@/components/Testimonios.vue'
import Team from '@/components/Team.vue'
import contactHomeBlock from '@/components/contactHomeBlock.vue'
import PorqueElegirnos from '@/components/PorqueElegirnos.vue'
// import Estadisticas from '@/components/Estadisticas.vue'
</script>

<template>
  <div>
    <Slider />
    <QueOfrecemosBlock />
    <AboutBlock />
    <OurServicesBlock />
    <PorqueElegirnos />
    <!-- <Estadisticas />  -->
    <Team />
    <contactHomeBlock />
    <Testimonios />
    <Sponsors />
    <Comentarios />
  </div>
</template>
