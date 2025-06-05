<template>
  <div class="container">
    <div
      id="kt_carousel_3_carousel"
      class="carousel carousel-custom slide"
      data-bs-ride="carousel"
      data-bs-interval="6000"
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
          class="carousel-item bg-secondary text-dark"
          :class="{ active: index === 0 }"
        >
          <div class="row">
            <!-- Texto (a la izquierda en pantallas grandes, arriba en pantallas pequeñas) -->
            <div
              class="carousel-caption d-block col-10 col-md-6 d-flex flex-column justify-content-center align-items-start"
              style="margin-left: -10%; margin-bottom: 10%"
            >
              <h2 class="text-center">{{ slide.caption }}</h2>
              <h6 class="text-center">{{ slide.caption2 }}</h6>
              <h5 class="text-center" style="color: coral">
                ${{ slide.precio }} CUP
              </h5>
              <div>
                <button
                  class="btn btn-sm mt-3 mx-2"
                  href="#"
                  style="background-color: coral"
                >
                  Ver ofertas
                </button>
                <button
                  href="#"
                  class="btn btn-icon btn-sm mt-3 btn-secondary"
                  style="border-radius: 50%"
                >
                  <i class="bi bi-share-fill" style="color: coral"></i>
                </button>
              </div>
              <button
                class="btn btn-primary btn-sm mt-3 mx-2"
                @click="startEditing(slide.id)"
              >
                Editar oferta
              </button>
            </div>
          </div>
          <div class="row">
            <!-- Imagen (a la izquierda en pantallas grandes, abajo en pantallas pequeñas) -->
            <div
              class="col-12 col-md-12 d-flex flex-column justify-content-end align-items-end"
              style="margin-left: 43%"
            >
              <img
                :src="slide.image"
                class="d-block min-w-50px min-h-50px mw-100 mh-100 mx-auto"
                alt="Slide image"
              />
            </div>
          </div>
        </div>
      </div>
      <!--end::Carousel-->

      <!--begin::Carousel Indicators-->
      <ol class="p-0 m-0 carousel-indicators carousel-indicators-bullet">
        <li
          v-for="(slide, index) in slides"
          :key="slide.id"
          data-bs-target="#kt_carousel_3_carousel"
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
            <div class="mb-3">
              <label class="form-label">Texto #2</label>
              <input type="text" class="form-control" v-model="tempCaption2" />
            </div>
            <div class="mb-3">
              <label class="form-label">Precio</label>
              <input type="text" class="form-control" v-model="tempPrecio" />
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
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
interface Slide {
  id: number;
  image: string;
  precio?: number;
  caption: string;
  caption2: string;
}
export default defineComponent({
  name: "banner-oferta",
  components: {},
  setup() {
    const slides = ref<Slide[]>([
      {
        id: 1,
        image: "https://picsum.photos/800/400?random=1",
        caption: "No desperdicie esta oferta",
        caption2: "¡Oferta de la semana!",
        precio: 3500,
      },
      {
        id: 2,
        image: "https://picsum.photos/800/400?random=2",
        caption: "No desperdicie esta oferta",
        caption2: "¡Oferta de la semana!",
        precio: 4050,
      },
      {
        id: 3,
        image: "https://picsum.photos/800/400?random=3",
        caption: "No desperdicie esta oferta",
        caption2: "¡Oferta de la semana!",
        precio: 1800,
      },
    ]);

    const editingSlide = ref<number | null>(null);
    const tempCaption = ref("");
    const tempCaption2 = ref("");
    const tempPrecio = ref<number>();
    const tempImage = ref("");

    const startEditing = (slideId: number) => {
      const slide = slides.value.find((s) => s.id === slideId);
      if (slide) {
        editingSlide.value = slideId;
        tempCaption.value = slide.caption;
        tempCaption2.value = slide.caption2;
        tempImage.value = slide.image;
        tempPrecio.value = slide.precio;
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
          caption2: tempCaption2.value,
          precio: tempPrecio.value,
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
      tempCaption2,
      tempPrecio,
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
