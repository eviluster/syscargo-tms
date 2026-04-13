<template>
  <!--begin::Wrapper-->
  <div class="w-lg-500px p-10">
    <!--begin::Form-->
    <VForm
      class="form w-100"
      id="kt_login_signin_form"
      @submit="onSubmitLogin"
      :validation-schema="login"
    >
      <div class="text-center mb-10">
        <h1 class="text-gray-900 mb-3">Iniciar sesión</h1>
      </div>

      <!--begin::Input group-->
      <div class="fv-row mb-10">
        <!--begin::Label-->
        <label class="form-label fs-6 fw-bold text-gray-900">Usuario</label>
        <!--end::Label-->

        <!--begin::Input-->
        <Field
          tabindex="1"
          class="form-control form-control-lg form-control-solid"
          type="text"
          name="username"
          autocomplete="off"
        />
        <!--end::Input-->
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="username" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="fv-row mb-10">
        <!--begin::Wrapper-->
        <div class="d-flex flex-stack mb-2">
          <!--begin::Label-->
          <label class="form-label fw-bold text-gray-900 fs-6 mb-0"
            >Contraseña</label
          >
          <!--end::Label-->
        </div>
        <!--end::Wrapper-->

        <!--begin::Input-->
        <Field
          tabindex="2"
          class="form-control form-control-lg form-control-solid"
          type="password"
          name="password"
          autocomplete="off"
        />
        <!--end::Input-->
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="password" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Actions-->
      <div class="text-center">
        <!--begin::Submit button-->
        <button
          tabindex="3"
          type="submit"
          ref="submitButton"
          id="kt_sign_in_submit"
          class="btn btn-lg btn-primary w-100 mb-2"
        >
          <span class="indicator-label"> Iniciar </span>

          <span class="indicator-progress">
            Por favor espere...
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>

        <!-- Enlace a SignUp -->
        <div class="text-muted fs-7 mt-5">
          ¿No tienes cuenta?
          <router-link
            :to="{ name: 'sign-up' }"
            class="ms-1 fw-bold text-primary"
            >Crear una cuenta</router-link
          >
        </div>
      </div>
      <!--end::Actions-->
    </VForm>
    <!--end::Form-->
  </div>
  <!--end::Wrapper-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref } from "vue";
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
import { useAuthStore, type User } from "@/stores/auth";
import { useRouter } from "vue-router";
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as Yup from "yup";

export default defineComponent({
  name: "sign-in",
  components: {
    Field,
    VForm,
    ErrorMessage,
  },
  setup() {
    const store = useAuthStore();
    const router = useRouter();

    const submitButton = ref<HTMLButtonElement | null>(null);

    Yup.setLocale({
      mixed: {
        required: ({ path }) => `El campo ${path} es obligatorio`,
      },
      string: {
        email: ({ path }) => `El campo ${path} debe ser un correo válido`,
        min: ({ path, min }) =>
          `El campo ${path} debe tener al menos ${min} caracteres`,
      },
    });

    const login = Yup.object().shape({
      username: Yup.string().email().required().label("Usuario"),
      password: Yup.string().min(8).required().label("Contraseña"),
    });

    //Form submit function
    const onSubmitLogin = async (values: any) => {
      const { password, username } = values as User;

      if (submitButton.value) {
        // eslint-disable-next-line
        submitButton.value!.disabled = true;
        // Activate indicator
        submitButton.value.setAttribute("data-kt-indicator", "on");
      }

      // Send login request
      const result = await store.login({ username, password });
      if (result === true) {
        Swal.fire({
          text: "¡Has iniciado sesión exitosamente!",
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "Ok, perfecto!",
          heightAuto: false,
          customClass: {
            confirmButton: "btn fw-semibold btn-light-primary",
          },
        }).then(() => {
          // Go to page after successfully login
          router.push({ path: "/" });
        });
      } else {
        Swal.fire({
          text: "Error al iniciar sesión",
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "Intentar de nuevo!",
          heightAuto: false,
          customClass: {
            confirmButton: "btn fw-semibold btn-light-danger",
          },
        }).then(() => {
          store.errors = {};
        });
      } //Deactivate indicator
      submitButton.value?.removeAttribute("data-kt-indicator");
      // eslint-disable-next-line
      if (submitButton.value) {
        submitButton.value!.disabled = false;
      }
    };

    return {
      onSubmitLogin,
      login,
      submitButton,
      getAssetPath,
    };
  },
});
</script>
