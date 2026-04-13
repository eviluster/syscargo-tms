<template>
  <div class="container">
    <h1>Carousel</h1>
    <div
      id="kt_carousel_2_carousel"
      class="carousel carousel-custom slide"
      data-bs-ride="carousel"
      data-bs-interval="8000"
    >
      <!--begin::Heading-->
      <div class="d-flex align-items-center justify-content-between flex-wrap">
        <!--begin::Label-->
        <span class="fs-4 fw-bold pe-2"></span>
        <!--end::Label-->
      </div>
      <!--end::Heading-->

      <!--begin::Carousel-->
      <div class="carousel-inner pt-8">
        <div
          v-for="(slide, index) in slides"
          :key="slide.id"
          class="carousel-item"
          :class="{ active: index === 0 }"
        >
          <img :src="slide.image" class="d-block w-100" alt="Slide image" />
          <div class="carousel-caption d-none d-md-block">
            <h5>{{ slide.caption }}</h5>
            <button
              class="btn btn-primary btn-sm"
              @click="startEditing(slide.id)"
            >
              Editar
            </button>
          </div>
        </div>
      </div>
      <!--end::Carousel-->
      <!--begin::Carousel Indicators-->
      <ol class="p-0 m-0 carousel-indicators carousel-indicators-bullet">
        <li
          v-for="(slide, index) in slides"
          :key="slide.id"
          data-bs-target="#kt_carousel_2_carousel"
          :data-bs-slide-to="index"
          :class="{ 'ms-1': true, active: index === 0 }"
        ></li>
      </ol>
      <!--end::Carousel Indicators-->
    </div>
    <div
      class="modal"
      :class="{ 'd-block': editingSlide !== null }"
      tabindex="-1"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Editar Slide</h5>
            <button
              type="button"
              class="btn-close"
              @click="cancelEditing"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Subir imagen ( solo JPG)</label>
              <input
                type="file"
                class="form-control"
                accept=".jpg,.jpeg"
                @change="handleImageUpload"
              />
              <div class="mt-2" v-if="tempImage">
                <img :src="tempImage" class="img-preview w-100" />
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Texto</label>
              <input type="text" class="form-control" v-model="tempCaption" />
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="cancelEditing"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="saveEdits(editingSlide!)"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" v-if="editingSlide !== null"></div>
  </div>
  <div class="container mt-4">
    <h1>Promociones</h1>
    <Banneroferta></Banneroferta>
  </div>
  <div class="container mt-4">
    <h1>Marcas</h1>
    <MarcasSlide></MarcasSlide>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import Banneroferta from "./Banneroferta.vue";
import MarcasSlide from "./MarcasSlide.vue";
interface Slide {
  id: number;
  image: string;
  caption: string;
}
export default defineComponent({
  name: "EditarBanner",
  components: {
    Banneroferta,
    MarcasSlide,
  },
  setup() {
    const slides = ref<Slide[]>([
      {
        id: 1,
        image: "https://picsum.photos/800/400?random=1",
        caption: "Primer slide",
      },
      {
        id: 2,
        image: "https://picsum.photos/800/400?random=2",
        caption: "Segundo slide",
      },
      {
        id: 3,
        image: "https://picsum.photos/800/400?random=3",
        caption: "Tercero slide",
      },
    ]);

    const editingSlide = ref<number | null>(null);
    const tempCaption = ref("");
    const tempImage = ref("");

    const startEditing = (slideId: number) => {
      const slide = slides.value.find((s) => s.id === slideId);
      if (slide) {
        editingSlide.value = slideId;
        tempCaption.value = slide.caption;
        tempImage.value = slide.image;
      }
    };

    const handleImageUpload = (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files[0]) {
        const file = input.files[0];

        if (!file.type.match("image/jpeg")) {
          alert("Por favor solo formato JPG");
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            tempImage.value = e.target.result as string;
          }
        };
        reader.readAsDataURL(file);
      }
    };

    const saveEdits = (slideId: number) => {
      const slideIndex = slides.value.findIndex((s) => s.id === slideId);
      if (slideIndex !== -1) {
        slides.value[slideIndex] = {
          ...slides.value[slideIndex],
          caption: tempCaption.value,
          image: tempImage.value,
        };
        editingSlide.value = null;
      }
    };

    const cancelEditing = () => {
      editingSlide.value = null;
    };
    return {
      editingSlide,
      tempCaption,
      tempImage,
      slides,
      startEditing,
      handleImageUpload,
      saveEdits,
      cancelEditing,
    };
  },
});
</script>
