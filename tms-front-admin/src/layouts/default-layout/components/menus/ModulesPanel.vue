<script>
import { ref, defineComponent } from "vue";
import { useAppStore } from "@/stores/store";

export default defineComponent({
  name: "kt-theme-switcher",
  component: {},
  setup() {
    const store = useAppStore();
    const modulos = ref([
      // { name: "Terrestre", path: "/comercializacion/reservar" },
      { name: "Aereo", path: "/comercializacion/reservar" },
      // { name: "Marítimo", path: "/comercializacion/reservar" },
      // { name: "Ferroviario", path: "/comercializacion/reservar" },
    ]);

    const setModule = (name) => {
      store.categoriaSeleccionada = name;
    };

    return {
      modulos,
      setModule,
    };
  },
});
</script>

<template>
  <!--begin::Menu-->

  <div
    class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-title-gray-700 menu-icon-muted menu-active-bg menu-state-primary fw-semibold py-4 fs-base w-375px"
    data-kt-menu="true"
    data-kt-element="theme-mode-menu"
  >
    <div class="container">
      <div class="row text-center mb-7 border-bottom">
        <h2>Módulos</h2>
      </div>
      <div class="row row-cols-3">
        <div class="col" v-for="modul in modulos" :key="modul.name">
          <router-link
            :to="modul.path"
            class="d-flex flex-column mb-5 text-center"
            @click="setModule(modul.name)"
          >
            <span class="menu-icon" data-kt-element="icon">
              <KTIcon icon-name="element-11" icon-class="fs-2" />
            </span>
            <span class="menu-title fs-4 text-white">{{ modul.name }}</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
  <!--end::Menu-->
</template>

<style scoped></style>
