<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref } from "vue";
import { hideModal } from "@/core/helpers/modal";
import { countries } from "@/core/data/countries";
import Swal from "sweetalert2/dist/sweetalert2.js";

export default defineComponent({
  name: "add-customer-modal",
  components: {},
  setup() {
    const formRef = ref<null | HTMLFormElement>(null);
    const addCustomerModalRef = ref<null | HTMLElement>(null);
    const loading = ref<boolean>(false);
    const formData = ref({
      name: "",
      email: "",
      telefono: "",
      fechasolicitud: "",
      tiposervicio: "",
      country: "US",
    });

    const rules = ref({
      name: [
        {
          required: true,
          message: "Customer name is required",
          trigger: "change",
        },
      ],
      email: [
        {
          required: true,
          message: "Customer email is required",
          trigger: "change",
        },
      ],
      fechasolicitud: [
        {
          required: true,
          message: "Address 1 is required",
          trigger: "change",
        },
      ],
    });

    const submit = () => {
      if (!formRef.value) {
        return;
      }

      formRef.value.validate((valid: boolean) => {
        if (valid) {
          loading.value = true;

          setTimeout(() => {
            loading.value = false;

            Swal.fire({
              text: "Form has been successfully submitted!",
              icon: "success",
              buttonsStyling: false,
              confirmButtonText: "Ok, got it!",
              heightAuto: false,
              customClass: {
                confirmButton: "btn btn-primary",
              },
            }).then(() => {
              hideModal(addCustomerModalRef.value);
            });
          }, 2000);
        } else {
          Swal.fire({
            text: "Sorry, looks like there are some errors detected, please try again.",
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            heightAuto: false,
            customClass: {
              confirmButton: "btn btn-primary",
            },
          });
          return false;
        }
      });
    };

    return {
      formData,
      rules,
      submit,
      formRef,
      loading,
      addCustomerModalRef,
      getAssetPath,
      countries,
    };
  },
});
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-4">
        <!--begin::Label-->
        <label class="required fs-6 fw-semibold mb-2">Nombre</label>
        <!--end::Label-->

        <!--begin::Input-->
        <el-form-item prop="name">
          <el-input v-model="formData.name" type="text" placeholder="" />
        </el-form-item>
        <!--end::Input-->
      </div>
      <div class="col-4">
        <label class="fs-6 fw-semibold mb-2">
          <span class="required">Correo</span>

          <i
            class="fas fa-exclamation-circle ms-1 fs-7"
            data-bs-toggle="tooltip"
            title="Email address must be active"
          ></i>
        </label>
        <!--end::Label-->

        <!--begin::Input-->
        <el-form-item prop="email">
          <el-input v-model="formData.email" />
        </el-form-item>
        <!--end::Input-->
      </div>
      <div class="col-4">
        <!--begin::Label-->
        <label class="required fs-6 fw-semibold mb-2">Teléfono</label>
        <!--end::Label-->

        <!--begin::Input-->
        <el-form-item prop="name">
          <el-input v-model="formData.name" type="text" placeholder="" />
        </el-form-item>
        <!--end::Input-->
      </div>
    </div>
    <div class="row">
      <div class="col-4">
        <label class="fs-6 fw-semibold mb-2">
          <span class="required">Fecha de solicitud</span>
        </label>
        <!--end::Label-->

        <!--begin::Input-->
        <el-form-item prop="email">
          <!-- <el-input v-model="formData.email" /> -->
          <el-input type="date" id="fecha" name="fecha" />
        </el-form-item>
        <!--end::Input-->
      </div>
      <div class="d-flex flex-column mb-7 col-4">
        <!--begin::Label-->
        <label class="fs-6 fw-semibold mb-2">
          <span class="required">Tipo de servicio</span>

          <i
            class="fas fa-exclamation-circle ms-1 fs-7"
            data-bs-toggle="tooltip"
            title="Country of origination"
          ></i>
        </label>
        <!--end::Label-->

        <!--begin::Input-->
        <el-select v-model="formData.country">
          <el-option value="">Select a Country...</el-option>
          <el-option
            v-for="(item, i) in countries"
            :key="`countries-select-option-${i}`"
            :value="item.code"
          >
            {{ item.name }}
          </el-option>
        </el-select>
        <!--end::Input-->
      </div>
      <div class="col-4 d-flex flex-column justify-content-center">
        <button
          :data-kt-indicator="loading ? 'on' : null"
          class="btn btn-primary"
          type="submit"
        >
          <span class="indicator-label"> Buscar </span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
