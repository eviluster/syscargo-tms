<template>
  <!--begin::Menu-->
  <div
    class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold py-4 fs-6 w-275px"
    data-kt-menu="true"
  >
    <!--begin::Menu item-->
    <div class="menu-item px-3">
      <div class="menu-content d-flex align-items-center px-3">
        <!--begin::Avatar-->
        <div class="symbol symbol-50px me-5">
          <img alt="Logo" :src="getAssetPath('media/avatars/300-3.jpg')" />
        </div>
        <!--end::Avatar-->

        <!--begin::Username-->
        <div class="d-flex flex-column">
          <div class="fw-bold d-flex align-items-center fs-5">
            <span v-if="userData">
              {{ userData.name }}
            </span>

            <span class="badge badge-light-success fw-bold fs-8 px-2 py-1 ms-2"
              >Pro</span
            >
          </div>
          <span
            class="fw-semibold text-muted text-hover-primary fs-7"
            v-if="userData"
          >
            {{ userData.email }}
          </span>
        </div>
        <!--end::Username-->
      </div>
    </div>
    <!--end::Menu item-->

    <!--begin::Menu separator-->
    <div class="separator my-2"></div>
    <!--end::Menu separator-->

    <!--begin::Menu item-->
    <div class="menu-item px-5">
      <router-link to="/crafted/account/overview" class="menu-link px-5">
        Mi Perfil
      </router-link>
    </div>
    <!--end::Menu item-->

    <!--begin::Menu item-->
    <div class="menu-item px-5 my-1">
      <!-- <router-link to="/pages/profile/overview" class="menu-link px-5">
        Account Settings
      </router-link> -->
    </div>
    <!--end::Menu item-->

    <!--begin::Menu item-->
    <div class="menu-item px-5">
      <a @click="signOut(userData.userID)" class="menu-link px-5">
        Cerrar sesión
      </a>
    </div>
    <!--end::Menu item-->
  </div>
  <!--end::Menu-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { computed, defineComponent, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { useCookies } from "vue3-cookies";
import api from "@/services/api";

export default defineComponent({
  name: "kt-user-menu",
  components: {},
  setup() {
    const router = useRouter();
    const i18n = useI18n();
    const auth = useAuthStore();
    const { cookies } = useCookies();
    const userData = ref();
    i18n.locale.value = localStorage.getItem("lang")
      ? (localStorage.getItem("lang") as string)
      : "en";

    const countries = {
      en: {
        flag: getAssetPath("media/flags/united-states.svg"),
        name: "English",
      },
      es: {
        flag: getAssetPath("media/flags/spain.svg"),
        name: "Spanish",
      },
      de: {
        flag: getAssetPath("media/flags/germany.svg"),
        name: "German",
      },
      ja: {
        flag: getAssetPath("media/flags/japan.svg"),
        name: "Japanese",
      },
      fr: {
        flag: getAssetPath("media/flags/france.svg"),
        name: "French",
      },
    };
    onMounted(() => {
      userData.value = cookies.get("userData");
    });

    const signOut = async (id: string) => {
      console.log("ID del usuario a desloguear", id);

      await api.post("/auth/log-out", { id: id });
      cookies.remove("refresh_token", "/", "");
      router.push({ name: "sign-in" });
    };

    const setLang = (lang: string) => {
      localStorage.setItem("lang", lang);
      i18n.locale.value = lang;
    };

    const currentLanguage = computed(() => {
      return i18n.locale.value;
    });

    const currentLangugeLocale = computed(() => {
      return countries[i18n.locale.value as keyof typeof countries];
    });

    return {
      signOut,
      setLang,
      currentLanguage,
      currentLangugeLocale,
      countries,
      userData,
      getAssetPath,
    };
  },
});
</script>
