<template>
  <div class="card">
    <div class="card-header">
      <div class="d-flex align-items-center position-relative my-1">
        <KTIcon
          icon-name="magnifier"
          icon-class="fs-1 position-absolute ms-6"
        />
        <input
          type="text"
          v-model="search"
          @input="searchItems()"
          class="form-control form-control-solid w-250px ps-15"
          placeholder="Buscar Chofer"
        />
      </div>
      <div class="card-toolbar">
        <div
          v-if="selectedIds.length === 0"
          class="d-flex justify-content-end"
          data-kt-subscription-table-toolbar="base"
        ></div>
        <div v-else class="d-flex justify-content-end align-items-center">
          <div class="fw-bold me-5">
            <span class="me-2">{{ selectedIds.length }}</span
            >Selected
          </div>
          <button
            type="button"
            class="btn btn-danger"
            @click="deleteFewChoferes()"
          >
            Delete Selected
          </button>
        </div>
      </div>
    </div>
    <div class="card-body">
      <KTDatatable
        :header="tableHeader"
        :data="choferes"
        @on-sort="sort"
        :checkbox-enabled="true"
        @on-items-select="onItemSelect"
        @on-items-per-page-change="onItemsPerPageChange"
      >
        <template v-slot:nombre="{ row: data }">
          <div class="d-flex align-items-center">
            <!-- Avatar con foto redonda -->
            <div class="symbol symbol-50px symbol-circle me-3">
              <img :src="data.foto" alt="Avatar" class="symbol-label" />
            </div>
            <!-- Nombre del chofer -->
            <div class="d-flex flex-column">
              <span>{{ data.nombre }}</span>
            </div>
          </div>
        </template>
        <template v-slot:ci="{ row: data }">
          {{ data.ci }}
        </template>
        <template v-slot:licencia="{ row: data }">
          {{ data.licencia }}
        </template>
        <template v-slot:telefono="{ row: data }">
          {{ data.telefono }}
        </template>
        <template v-slot:experiencia="{ row: data }">
          {{ data.experiencia }} años
        </template>
        <template v-slot:actions="{ row: data }">
          <div>
            <a
              href="#"
              class="btn btn-sm btn-light btn-active-light-primary"
              data-kt-menu-trigger="click"
              data-kt-menu-placement="bottom-end"
              data-kt-menu-flip="top-end"
            >
              Acciones
              <KTIcon icon-name="down" icon-class="fs-5 m-0" />
            </a>
            <div
              class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-125px py-4"
              data-kt-menu="true"
            >
              <div class="menu-item px-3">
                <a @click="openModal(data)" class="menu-link px-3">Editar</a>
              </div>
              <div class="menu-item px-3">
                <a @click="deleteChoferes(data.id)" class="menu-link px-3"
                  >Eliminar</a
                >
              </div>
            </div>
          </div>
        </template>
      </KTDatatable>
      <!--Modal-->
      <div class="modal fade" tabindex="-1" id="kt_modal_1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title">Detalles de Chofer</h3>
              <div
                class="btn btn-icon btn-sm btn-active-light-primary ms-2"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i class="ki-duotone ki-cross fs-1"
                  ><span class="path1"></span><span class="path2"></span
                ></i>
              </div>
            </div>
            <div class="modal-body">
              <div>
                <div v-if="isEditable">
                  <el-form :model="selectedChofer" ref="formRef">
                    <label class="fs-5 fw-semibold form-label mb-5"
                      >Foto:</label
                    >
                    <div class="fv-row mb-5">
                      <el-form-item prop="foto">
                        <input
                          type="file"
                          accept="image/*"
                          @change="handleFileUpload"
                          class="form-control"
                        />
                      </el-form-item>
                    </div>

                    <label class="fs-5 fw-semibold form-label mb-5"
                      >Nombre:</label
                    >
                    <div class="fv-row mb-5">
                      <el-form-item prop="nombre">
                        <el-input
                          v-model="selectedChofer.nombre"
                          class="form-control-solid w-250px"
                          aria-label="Edit customer name"
                        />
                      </el-form-item>
                    </div>

                    <label class="fs-5 fw-semibold form-label mb-5">CI:</label>
                    <div class="fv-row mb-5">
                      <el-form-item prop="ci">
                        <el-input
                          v-model="selectedChofer.ci"
                          class="form-control-solid w-250px"
                          aria-label="Editar carnet de identidad"
                        />
                      </el-form-item>
                    </div>

                    <label class="fs-5 fw-semibold form-label mb-5"
                      >Licencia:</label
                    >
                    <div class="fv-row mb-5">
                      <el-form-item prop="licencia">
                        <el-input
                          v-model="selectedChofer.licencia"
                          class="form-control-solid w-250px"
                          aria-label="Editar licencia"
                        />
                      </el-form-item>
                    </div>

                    <label class="fs-5 fw-semibold form-label mb-5"
                      >Teléfono:</label
                    >
                    <div class="fv-row mb-5">
                      <el-form-item prop="telefono">
                        <el-input
                          v-model="selectedChofer.telefono"
                          class="form-control-solid w-250px"
                          aria-label="Editar telefono"
                        />
                      </el-form-item>
                    </div>

                    <label class="fs-5 fw-semibold form-label mb-5"
                      >Años de experiencia:</label
                    >
                    <div class="fv-row mb-5">
                      <el-form-item prop="experiencia">
                        <el-input
                          v-model="selectedChofer.experiencia"
                          class="form-control-solid w-250px"
                          aria-label="Editar experiencia"
                        />
                      </el-form-item>
                    </div>
                  </el-form>
                </div>
                <div v-else>
                  <div class="symbol symbol-50px symbol-circle mt-3">
                    <img
                      :src="selectedChofer.foto"
                      alt="Avatar"
                      class="symbol-label"
                    />
                  </div>
                  <p>ID: {{ selectedChofer.id }}</p>
                  <p>Nombre: {{ selectedChofer.nombre }}</p>
                  <p>CI: {{ selectedChofer.ci }}</p>
                  <p>Licencia: {{ selectedChofer.licencia }}</p>
                  <p>Telefono: {{ selectedChofer.telefono }}</p>
                  <p>Años de Experiencia: {{ selectedChofer.experiencia }}</p>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                :data-kt-indicator="loading ? 'on' : null"
                class="btn btn-lg btn-primary"
                type="submit"
                @click="toggleEditMode"
              >
                <span v-if="!loading" class="indicator-label">
                  {{ isEditable ? "Guardar cambios" : "Actualizar" }}
                </span>
                <span v-if="loading" class="indicator-progress">
                  Please wait...
                  <span
                    class="spinner-border spinner-border-sm align-middle ms-2"
                  ></span>
                </span>
              </button>
              <button
                type="button"
                class="btn btn-light"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <!--End Modal-->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from "vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import arraySort from "array-sort";
import { useChoferesStore } from "@/stores/choferes";
import { type IChoferes } from "@/core/data/choferes";
import { Modal } from "bootstrap";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { MenuComponent } from "@/assets/ts/components";
export default defineComponent({
  name: "ListChofer",
  components: {
    KTDatatable,
  },
  setup() {
    const choferesStore = useChoferesStore();
    const choferes = computed(() => choferesStore.getProducts);
    const loading = ref<boolean>(false);
    const initCustomers = ref<Array<IChoferes>>([]);
    console.log("Choferes:", choferes.value);
    onMounted(() => {
      initCustomers.value.splice(0, choferes.value.length, ...choferes.value);
    });
    const tableHeader = ref([
      {
        columnName: "Nombre",
        columnLabel: "nombre",
        sortEnabled: true,
        columnWidth: 100,
      },
      {
        columnName: "CI",
        columnLabel: "ci",
        sortEnabled: true,
        columnWidth: 100,
      },
      {
        columnName: "Licencia",
        columnLabel: "licencia",
        sortEnabled: true,
        columnWidth: 100,
      },
      {
        columnName: "Telefono",
        columnLabel: "telefono",
        sortEnabled: true,
        columnWidth: 100,
      },
      {
        columnName: "Experiencia",
        columnLabel: "experiencia",
        sortEnabled: true,
        columnWidth: 100,
      },
      {
        columnName: "Acciones",
        columnLabel: "actions",
        columnWidth: 120,
      },
    ]);

    const sort = (sort: Sort) => {
      const reverse: boolean = sort.order === "asc";
      if (sort.label) {
        arraySort(choferes.value, sort.label, { reverse });
      }
    };
    const deleteChoferes = (id: number) => {
      for (let i = 0; i < choferes.value.length; i++) {
        if (choferes.value[i].id === id) {
          choferes.value.splice(i, 1);
        }
      }
    };
    const selectedIds = ref<Array<number>>([]);
    const deleteFewChoferes = () => {
      selectedIds.value.forEach((item) => {
        deleteChoferes(item);
      });
      selectedIds.value.length = 0;
    };
    const onItemSelect = (selectedItems: Array<number>) => {
      selectedIds.value = selectedItems;
    };

    const selectedChofer = ref<IChoferes>({
      id: 0,
      nombre: "",
      ci: 0,
      licencia: 0,
      telefono: "",
      experiencia: 0,
      foto: "",
    });
    const openModal = (order: IChoferes) => {
      selectedChofer.value = order;
      const modalElement = document.getElementById("kt_modal_1");
      if (modalElement) {
        const modal = new Modal(modalElement);
        modal.show();
      }
    };

    const closeModal = () => {
      const modalElement = document.getElementById("kt_modal_1");
      if (modalElement) {
        const modal = new Modal(modalElement);
        modal.hide();
      }
    };
    const isEditable = ref(false);

    const toggleEditMode = async () => {
      if (isEditable.value) {
        loading.value = true;
        try {
          choferesStore.updateChofer(selectedChofer.value);

          Swal.fire({
            text: "¡Oferta actualizada exitosamente!",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Ok",
            customClass: {
              confirmButton: "btn btn-primary",
            },
          }).then(() => {
            const modalElement = document.getElementById("kt_modal_1");
            if (modalElement) {
              const modal =
                Modal.getInstance(modalElement) || new Modal(modalElement);
              modal.hide();
            }
          });
        } catch (error) {
          Swal.fire({
            text: "Hubo un error al actualizar la oferta.",
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Ok",
            customClass: {
              confirmButton: "btn btn-primary",
            },
          });
        } finally {
          loading.value = false;
        }
      }
      isEditable.value = !isEditable.value;
    };
    const search = ref<string>("");
    const searchItems = () => {
      choferes.value.splice(0, choferes.value.length, ...initCustomers.value);
      if (search.value !== "") {
        let results: Array<IChoferes> = [];
        for (let j = 0; j < choferes.value.length; j++) {
          if (searchingFunc(choferes.value[j], search.value)) {
            results.push(choferes.value[j]);
          }
        }
        choferes.value.splice(0, choferes.value.length, ...results);
      }
      MenuComponent.reinitialization();
    };
    const searchingFunc = (obj: any, value: string): boolean => {
      for (let key in obj) {
        if (!Number.isInteger(obj[key]) && !(typeof obj[key] === "object")) {
          if (obj[key].indexOf(value) != -1) {
            return true;
          }
        }
      }
      return false;
    };
    const handleFileUpload = (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
          selectedChofer.value.foto = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    };
    const onItemsPerPageChange = () => {
      setTimeout(() => {
        MenuComponent.reinitialization();
      }, 0);
    };
    return {
      onItemsPerPageChange,
      tableHeader,
      choferes,
      sort,
      deleteChoferes,
      deleteFewChoferes,
      selectedIds,
      onItemSelect,
      selectedChofer,
      openModal,
      closeModal,
      toggleEditMode,
      isEditable,
      loading,
      search,
      searchItems,
      handleFileUpload,
    };
  },
});
</script>
