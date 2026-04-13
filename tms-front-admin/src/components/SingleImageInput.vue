<template>
  <div class="card card-flush py-3">
    <div class="card-body text-center pt-0">
      <div class="d-flex justify-content-center mb-3">
        <div
          class="image-input position-relative"
          @click="triggerFileInput"
          @dragover.prevent
          @dragenter.prevent
          @drop.prevent="handleImageDrop"
          :title="title"
        >
          <div
            v-if="imageUrl"
            class="image-input-wrapper w-150px h-150px"
            :style="`background-image: url(${imageUrl})`"
          ></div>

          <div
            v-else
            class="image-input-wrapper w-150px h-150px d-flex justify-content-center align-items-center"
          >
            <i class="bi bi-plus-lg fs-2 text-muted"></i>
          </div>

          <span v-if="imageUrl" class="btn-delete" @click.stop="removeImage">
            <i class="bi bi-trash text-white"></i>
          </span>
        </div>
      </div>

      <input
        type="file"
        class="hidden-input"
        accept="image/png, image/jpg, image/jpeg"
        @change="handleImageUpload"
        ref="imageInput"
      />

      <div class="text-muted fs-7">{{ hint }}</div>
      <div v-if="errorMessage" class="text-danger mt-2">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, nextTick } from "vue";
import imageCompression from "browser-image-compression";

export default defineComponent({
  name: "SingleImageInput",
  props: {
    modelValue: { type: String, default: null },
    maxSizeMB: { type: Number, default: 1.5 },
    title: {
      type: String,
      default: "Click para seleccionar o arrastrar imagen",
    },
    hint: {
      type: String,
      default:
        "Formatos soportados: PNG, JPG. Se convertirá a WebP para optimizar.",
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const imageInput = ref<HTMLInputElement | null>(null);
    const imageUrl = ref<string | null>(props.modelValue ?? null);
    const errorMessage = ref<string | null>(null);

    watch(
      () => props.modelValue,
      (v) => {
        imageUrl.value = v ?? null;
      },
      { immediate: true },
    );

    const triggerFileInput = () => {
      nextTick(() => imageInput.value?.click());
    };

    const handleImageUpload = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0] ?? null;
      if (file) processFile(file);
      (e.target as HTMLInputElement).value = "";
    };

    const handleImageDrop = (e: DragEvent) => {
      const file = e.dataTransfer?.files?.[0] ?? null;
      if (file) processFile(file);
    };

    async function processFile(file: File) {
      errorMessage.value = null;
      if (!file.type.match(/image\/(png|jpe?g)/)) {
        errorMessage.value = "Solo PNG o JPG permitidos";
        return;
      }

      try {
        const options = {
          maxSizeMB: props.maxSizeMB,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          fileType: "image/webp",
        } as any;

        const compressed = await imageCompression(file, options);
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          imageUrl.value = result;
          emit("update:modelValue", result);
        };
        reader.onerror = (err) => {
          console.error("FileReader error", err);
          errorMessage.value = "Error leyendo la imagen";
        };
        reader.readAsDataURL(compressed);
      } catch (err) {
        console.error("Error procesando imagen:", err);
        errorMessage.value = "No se pudo procesar la imagen.";
      }
    }

    function removeImage() {
      imageUrl.value = null;
      emit("update:modelValue", null);
    }

    return {
      imageInput,
      imageUrl,
      errorMessage,
      triggerFileInput,
      handleImageUpload,
      handleImageDrop,
      removeImage,
    };
  },
});
</script>

<style scoped>
.image-input {
  position: relative;
  display: inline-block;
  border-radius: 10px;
  border: 2px dashed #ccc;
  cursor: pointer;
  transition: 0.15s;
  padding: 6px;
}
.image-input:hover {
  border-color: #0d6efd;
  background: rgba(13, 110, 253, 0.03);
}
.image-input-wrapper {
  width: 150px;
  height: 150px;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  background-color: #f8f9fa;
}
.hidden-input {
  display: none;
}
.btn-delete {
  position: absolute;
  top: -10px;
  right: -10px;
  background: #dc3545;
  color: white;
  border-radius: 50%;
  width: 34px;
  height: 34px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
}
.btn-delete:hover {
  background: #bd2130;
}
</style>
