<template>
  <!--begin::Authentication Layout -->
  <div class="d-flex flex-column flex-lg-row flex-column-fluid">
    <!--begin::Body-->
    <div
      class="d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 order-2 order-lg-1"
    >
      <!--begin::Form-->
      <div class="d-flex flex-center flex-column flex-lg-row-fluid">
        <!--begin::Wrapper-->
        <div class="w-lg-100 p-10 d-flex flex-center flex-column">
          <!-- Logo (colócalo aquí) -->
          <div class="logo-wrapper d-flex justify-content-center mb-4">
            <img :src="logo" alt="SysCargo TMS" class="auth-logo" />
          </div>

          <!-- Aquí se renderizan SignIn / SignUp -->
          <div class="w-100 d-flex flex-center">
            <router-view></router-view>
          </div>
        </div>
        <!--end::Wrapper-->
      </div>
      <!--end::Form-->
    </div>
    <!--end::Body-->
  </div>
  <!--end::Authentication Layout -->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, onMounted } from "vue";
import LayoutService from "@/core/services/LayoutService";
import { useBodyStore } from "@/stores/body";

export default defineComponent({
  name: "auth-layout",
  components: {},
  setup() {
    const store = useBodyStore();

    onMounted(() => {
      LayoutService.emptyElementClassesAndAttributes(document.body);

      store.addBodyClassname("app-blank");
      store.addBodyClassname("bg-body");
    });

    return {
      getAssetPath,
      logo,
    };
  },
});
import logo from "@/assets/logo-tms.jpeg";
</script>
<style scoped>
/* Ajustes del logo */
.logo-wrapper {
  /* pequeño espacio extra para separar del formulario */
  padding-top: 6px;
  padding-bottom: 6px;
}

/* dimensiones responsivas del logo */
.auth-logo {
  max-width: 260px; /* límite en pantallas grandes */
  width: 45%; /* tamaño relativo en móviles */
  height: auto;
  object-fit: contain;
  display: block;
}

/* Media queries para afinar tamaño */
@media (min-width: 992px) {
  .auth-logo {
    width: auto;
    max-width: 320px;
  }
}
</style>
