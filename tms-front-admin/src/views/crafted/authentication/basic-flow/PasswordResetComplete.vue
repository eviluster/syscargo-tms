<template>
  <!--begin::Wrapper-->
  <div class="w-lg-500px p-10">
    <!--begin::Form-->
    <VForm
      class="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
      @submit="onSubmitResetPassword"
      id="kt_login_password_reset_complete_form"
      :validation-schema="resetPasswordSchema"
    >
      <!--begin::Heading-->
      <div class="text-center mb-10">
        <!--begin::Title-->
        <h1 class="text-gray-900 mb-3">Restablecer contraseña</h1>
        <!--end::Title-->

        <!--begin::Link-->
        <div class="text-gray-500 fw-semibold fs-4">
          Ingresa tu nueva contraseña.
        </div>
        <!--end::Link-->
      </div>
      <!--begin::Heading-->

      <!--begin::Input group-->
      <div class="fv-row mb-10">
        <label class="form-label fw-bold text-gray-900 fs-6">Nueva contraseña</label>
        <Field
          class="form-control form-control-solid"
          type="password"
          placeholder=""
          name="password"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="password" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="fv-row mb-10">
        <label class="form-label fw-bold text-gray-900 fs-6">Confirmar contraseña</label>
        <Field
          class="form-control form-control-solid"
          type="password"
          placeholder=""
          name="password_confirmation"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="password_confirmation" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Actions-->
      <div class="d-flex flex-wrap justify-content-center pb-lg-0">
        <button
          type="submit"
          ref="submitButton"
          id="kt_password_reset_complete_submit"
          class="btn btn-lg btn-primary fw-bold me-4"
        >
          <span class="indicator-label">Restablecer</span>
          <span class="indicator-progress">
            Por favor espere...
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>

        <router-link :to="{ name: 'sign-in' }" class="btn btn-lg btn-light-primary fw-bold"
          >Cancelar</router-link
        >
      </div>
      <!--end::Actions-->
    </VForm>
    <!--end::Form-->
  </div>
  <!--end::Wrapper-->
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
import { useAuthStore } from "@/stores/auth";
import * as Yup from "yup";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  name: "password-reset-complete",
  components: {
    Field,
    VForm,
    ErrorMessage,
  },
  setup() {
    const store = useAuthStore();
    const route = useRoute();
    const router = useRouter();

    const submitButton = ref<HTMLButtonElement | null>(null);

    // Get token and email from query params
    const token = route.query.token as string;
    const email = route.query.email as string;

    // Create form validation object
    const resetPasswordSchema = Yup.object().shape({
      password: Yup.string().required().min(6).label("Contraseña"),
      password_confirmation: Yup.string()
        .oneOf([Yup.ref("password")], "Las contraseñas deben coincidir")
        .required()
        .label("Confirmar contraseña"),
    });

    // Form submit function
    const onSubmitResetPassword = async (values: any) => {
      values = values as { password: string; password_confirmation: string };

      // eslint-disable-next-line
      submitButton.value!.disabled = true;
      // Activate loading indicator
      submitButton.value?.setAttribute("data-kt-indicator", "on");

      // Send reset password request
      await store.resetPassword(token, email, values.password, values.password_confirmation);

      const error = Object.values(store.errors);

      if (!error || error.length === 0) {
        Swal.fire({
          text: "¡Contraseña restablecida exitosamente!",
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "Ir a iniciar sesión",
          heightAuto: false,
          customClass: {
            confirmButton: "btn fw-semibold btn-light-primary",
          },
        }).then(() => {
          router.push({ name: "sign-in" });
        });
      } else {
        Swal.fire({
          text: error[0] as string,
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "Intentar de nuevo!",
          heightAuto: false,
          customClass: {
            confirmButton: "btn fw-semibold btn-light-danger",
          },
        });
      }

      submitButton.value?.removeAttribute("data-kt-indicator");
      // eslint-disable-next-line
      submitButton.value!.disabled = false;
    };

    return {
      onSubmitResetPassword,
      resetPasswordSchema,
      submitButton,
    };
  },
});
</script>
