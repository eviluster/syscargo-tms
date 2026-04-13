<!-- EditUserModal.vue (modificado) -->
<template>
  <div
    class="modal fade"
    id="kt_modal_edit_usuario"
    ref="addUsuarioModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header" id="kt_modal_edit_usuario_header">
          <h2 class="fw-bold">Editar Usuario</h2>
          <div
            id="kt_modal_edit_usuario_close"
            data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
          >
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </div>
        </div>

        <el-form
          @submit.prevent="submit()"
          :model="formData"
          :rules="rules"
          ref="formRef"
        >
          <div class="modal-body py-10 px-lg-17">
            <div class="scroll-y me-n7 pe-7" id="kt_modal_edit_usuario_scroll">
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">Name</label>
                <el-form-item prop="name">
                  <el-input
                    v-model="formData.name"
                    type="text"
                    placeholder=""
                  />
                </el-form-item>
              </div>

              <div class="fv-row mb-7">
                <label class="fs-6 fw-semibold mb-2"
                  ><span class="required">Email</span></label
                >
                <el-form-item prop="email">
                  <el-input v-model="formData.email" />
                </el-form-item>
              </div>

              <div class="fv-row mb-7">
                <label class="fs-6 fw-semibold mb-2"
                  ><span class="required">Role</span></label
                >
                <el-form-item prop="role">
                  <el-select
                    v-model="formData.role"
                    placeholder="Seleccione rol"
                    @change="onRoleChange"
                  >
                    <el-option
                      v-for="r in roles"
                      :key="r.id"
                      :label="r.name"
                      :value="r.id"
                    />
                  </el-select>
                </el-form-item>
              </div>

              <!-- Si es prestatario mostrar servicios (multi) -->
              <div v-if="isPrestatario" class="fv-row mb-7">
                <label class="fs-6 fw-semibold mb-2">Servicios (Vías)</label>
                <el-form-item prop="servicios">
                  <el-select
                    v-model="formData.servicios"
                    multiple
                    collapse-tags
                  >
                    <el-option
                      v-for="opt in viaOptions"
                      :key="opt.value"
                      :label="opt.label"
                      :value="opt.value"
                    />
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </div>

          <div class="modal-footer flex-center">
            <button
              type="reset"
              id="kt_modal_edit_usuario_cancel"
              class="btn btn-light me-3"
            >
              Discard
            </button>

            <button
              :data-kt-indicator="loading ? 'on' : null"
              class="btn btn-lg btn-primary"
              type="submit"
            >
              <span v-if="!loading" class="indicator-label"
                >Guardar cambios
                <KTIcon icon-name="arrow-right" icon-class="fs-2 me-2 me-0"
              /></span>
              <span v-if="loading" class="indicator-progress"
                >Please wait...
                <span
                  class="spinner-border spinner-border-sm align-middle ms-2"
                ></span>
              </span>
            </button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref, computed, watch, onMounted } from "vue";
import { hideModal } from "@/core/helpers/modal";
import Swal from "sweetalert2";
import api from "@/services/api";

export default defineComponent({
  name: "edit-user-modal",
  props: {
    user: { type: Object, required: true },
  },
  setup(props, { emit }) {
    const formRef = ref<null | any>(null);
    const addUsuarioModalRef = ref<null | HTMLElement>(null);
    const loading = ref<boolean>(false);

    const roles = ref<any[]>([]);
    const viaOptions = [
      { value: "maritima", label: "Marítima" },
      { value: "aerea", label: "Aérea" },
      { value: "terrestre", label: "Terrestre" },
      { value: "ferroviaria", label: "Ferroviaria" },
      { value: "multimodal", label: "Multimodal" },
    ];

    const formData = ref<any>({
      id: null,
      name: "",
      email: "",
      role: "",
      servicios: [] as string[],
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
      role: [
        { required: true, message: "Role is required", trigger: "change" },
      ],
    });

    const fetchRoles = async () => {
      try {
        const res = await api.get("/roles");
        roles.value = res.data || [];
      } catch (e) {
        console.warn("No se pudieron cargar roles", e);
      }
    };

    onMounted(fetchRoles);

    watch(
      () => props.user,
      (newUser) => {
        if (newUser) {
          formData.value.id = newUser.id;
          formData.value.name = newUser.name || "";
          formData.value.email = newUser.email || "";
          // si 'role' viene como objeto o string intentamos normalizar
          formData.value.role =
            newUser.role?.id ?? newUser.role ?? newUser.role?.name ?? "";
          // servicios: puede venir en prestatario.servicios o directamente en user.servicios
          formData.value.servicios =
            newUser.prestatario?.servicios ??
            newUser.servicios ??
            (Array.isArray(newUser.servicios) ? newUser.servicios : []);
        }
      },
      { immediate: true },
    );

    const isPrestatario = computed(() => {
      const r = roles.value.find(
        (x: any) =>
          x.id === formData.value.role || x.name === formData.value.role,
      );
      if (r && r.name) return String(r.name).toLowerCase() === "prestatario";
      return String(formData.value.role).toLowerCase() === "prestatario";
    });

    const onRoleChange = () => {
      // si cambia a otro role y ya no es prestatario, limpiamos servicios
      if (!isPrestatario.value) {
        formData.value.servicios = [];
      }
    };

    const submit = async () => {
      if (!formRef.value) return;
      // validar con el formRef (Element) si es necesario
      (formRef.value as any).validate(async (valid: boolean) => {
        if (!valid) {
          Swal.fire({
            text: "Corrige los errores del formulario",
            icon: "error",
          });
          return;
        }
        loading.value = true;
        try {
          const payload: any = {
            name: formData.value.name,
            email: formData.value.email,
            role: formData.value.role,
          };

          if (isPrestatario.value) {
            payload.servicios = formData.value.servicios;
            // si tu backend espera prestatario.servicios dentro de un objeto prestatario:
            payload.prestatario = payload.prestatario || {};
            payload.prestatario.servicios = formData.value.servicios;
          }

          // Llamada al endpoint de edición (ajusta ruta si tu backend usa otra)
          await api.put(`/users/edit/${formData.value.id}`, payload);

          Swal.fire({
            text: "Usuario actualizado",
            icon: "success",
            confirmButtonText: "Ok",
          });
          hideModal(addUsuarioModalRef.value);
          emit("updated");
        } catch (err: any) {
          console.error("Error updating user", err);
          Swal.fire({
            text: err?.response?.data?.message || "Error actualizando usuario",
            icon: "error",
          });
        } finally {
          loading.value = false;
        }
      });
    };

    return {
      getAssetPath,
      formData,
      rules,
      submit,
      formRef,
      loading,
      addUsuarioModalRef,
      roles,
      viaOptions,
      isPrestatario,
      onRoleChange,
    };
  },
});
</script>
