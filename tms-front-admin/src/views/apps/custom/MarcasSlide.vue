<template>
  <div class="brand-slider bg-dark">
    <div class="slider-container">
      <swiper v-bind="swiperOptions">
        <swiper-slide v-for="(brand, index) in brands" :key="index">
          <img :src="brand.imgSrc" :alt="`Brand ${index + 1}`" />
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import foto1 from "@/assets/metronic-9.png";
import foto2 from "@/assets/metronic-9.png";
import foto3 from "@/assets/metronic-9.png";
import foto4 from "@/assets/metronic-9.png";
import foto5 from "@/assets/metronic-9.png";
import foto6 from "@/assets/metronic-9.png";

interface Brand {
  imgSrc: string;
}

const brands: Brand[] = [
  { imgSrc: foto1 },
  { imgSrc: foto2 },
  { imgSrc: foto3 },
  { imgSrc: foto4 },
  { imgSrc: foto5 },
  { imgSrc: foto6 },
];

const swiperOptions = {
  modules: [Autoplay],
  slidesPerView: 5,
  spaceBetween: 30,
  loop: true,
  speed: 2000,
  autoplay: {
    delay: 0,
    disableOnInteraction: false,
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    500: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 30,
    },
    1280: {
      slidesPerView: 5,
      spaceBetween: 30,
    },
  },
};
</script>
<style scoped>
.brand-slider {
  width: 100%;
  padding: 4rem 0;
}

.slider-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

:deep(.swiper) {
  padding: 1rem 0;
}

:deep(.swiper-slide) {
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.swiper-slide img) {
  max-width: 100%;
  height: auto;
  object-fit: contain;
}
</style>
