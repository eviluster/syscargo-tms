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
          placeholder="Buscar Transportista"
        />
      </div>
      <div class="card-toolbar">
        <div
          v-if="selectedIds.length === 0"
          class="d-flex justify-content-end"
        ></div>
        <div v-else class="d-flex justify-content-end align-items-center">
          <div class="fw-bold me-5">
            <span class="me-2">{{ selectedIds.length }}</span
            >Seleccionados
          </div>
          <button
            type="button"
            class="btn btn-danger"
            @click="deleteFewTransportistas()"
          >
            Eliminar Seleccionados
          </button>
        </div>
      </div>
    </div>
    <div class="card-body">
      <KTDatatable
        :header="tableHeader"
        :data="transportistas"
        @on-sort="sort"
        :checkbox-enabled="true"
        @on-items-select="onItemSelect"
        @on-items-per-page-change="onItemsPerPageChange"
      >
        <template v-slot:id="{ row: data }">
          {{ data.id }}
        </template>
        <template v-slot:nombre="{ row: data }">
          {{ data.nombre }}
        </template>
        <template v-slot:direccion="{ row: data }">
          {{ data.direccion }}
        </template>
        <template v-slot:telefono="{ row: data }">
          {{ data.telefono }}
        </template>
        <template v-slot:correo="{ row: data }">
          {{ data.correo }}
        </template>
        <template v-slot:razonSocial="{ row: data }">
          {{ data.razonSocial }}
        </template>
        <template v-slot:tipoServicio="{ row: data }">
          {{ data.tipoServicio }}
        </template>
        <template v-slot:estado="{ row: data }">
          <span :class="`badge badge-${getEstadoClass(data.estado)}`">
            {{ data.estado }}
          </span>
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
                <a @click="deleteTransportista(data.id)" class="menu-link px-3"
                  >Eliminar</a
                >
              </div>
            </div>
          </div>
        </template>
      </KTDatatable>

      <!-- Modal de Edición -->
      <div class="modal fade" tabindex="-1" id="kt_modal_1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title">Editar Transportista</h3>
              <div
                class="btn btn-icon btn-sm btn-active-light-primary ms-2"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i class="ki-duotone ki-cross fs-1">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
              </div>
            </div>
            <div class="modal-body">
              <div v-if="isEditable">
                <el-form :model="selectedTransportista" ref="formRef">
                  <div class="row">
                    <!-- Nombre y Dirección -->
                    <div class="col-md-6 mb-5">
                      <label class="fs-5 fw-semibold form-label mb-3"
                        >Nombre:</label
                      >
                      <el-form-item prop="nombre">
                        <el-input
                          v-model="selectedTransportista.nombre"
                          class="form-control-solid w-100"
                        />
                      </el-form-item>
                    </div>
                    <div class="col-md-6 mb-5">
                      <label class="fs-5 fw-semibold form-label mb-3"
                        >Dirección:</label
                      >
                      <el-form-item prop="direccion">
                        <el-input
                          v-model="selectedTransportista.direccion"
                          class="form-control-solid w-100"
                        />
                      </el-form-item>
                    </div>
                  </div>

                  <div class="row">
                    <!-- Teléfono y Correo -->
                    <div class="col-md-6 mb-5">
                      <label class="fs-5 fw-semibold form-label mb-3"
                        >Teléfono:</label
                      >
                      <el-form-item prop="telefono">
                        <el-input
                          v-model="selectedTransportista.telefono"
                          class="form-control-solid w-100"
                        />
                      </el-form-item>
                    </div>
                    <div class="col-md-6 mb-5">
                      <label class="fs-5 fw-semibold form-label mb-3"
                        >Correo:</label
                      >
                      <el-form-item prop="correo">
                        <el-input
                          v-model="selectedTransportista.correo"
                          class="form-control-solid w-100"
                        />
                      </el-form-item>
                    </div>
                  </div>

                  <div class="row">
                    <!-- Razón Social y Tipo de Servicio -->
                    <div class="col-md-6 mb-5">
                      <label class="fs-5 fw-semibold form-label mb-3"
                        >Razón Social:</label
                      >
                      <el-form-item prop="razonSocial">
                        <el-select
                          v-model="selectedTransportista.razonSocial"
                          class="form-control-solid w-100"
                        >
                          <el-option value="Empresa" label="Empresa" />
                          <el-option value="Autónomo" label="Autónomo" />
                          <el-option value="Otro" label="Otro" />
                        </el-select>
                      </el-form-item>
                    </div>
                    <div class="col-md-6 mb-5">
                      <label class="fs-5 fw-semibold form-label mb-3"
                        >Tipo de Servicio:</label
                      >
                      <el-form-item prop="tipoServicio">
                        <el-select
                          v-model="selectedTransportista.tipoServicio"
                          class="form-control-solid w-100"
                        >
                          <el-option value="Carga" label="Carga" />
                          <el-option value="Pasajeros" label="Pasajeros" />
                          <el-option value="Mudanzas" label="Mudanzas" />
                          <el-option value="Otro" label="Otro" />
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>

                  <div class="row">
                    <!-- Estado -->
                    <div class="col-md-6 mb-5">
                      <label class="fs-5 fw-semibold form-label mb-3"
                        >Estado:</label
                      >
                      <el-form-item prop="estado">
                        <el-select
                          v-model="selectedTransportista.estado"
                          class="form-control-solid w-100"
                        >
                          <el-option value="Activo" label="Activo" />
                          <el-option value="Inactivo" label="Inactivo" />
                          <el-option value="Suspendido" label="Suspendido" />
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                </el-form>
              </div>
              <div v-else>
                <p>ID: {{ selectedTransportista.id }}</p>
                <p>Nombre: {{ selectedTransportista.nombre }}</p>
                <p>Dirección: {{ selectedTransportista.direccion }}</p>
                <p>Teléfono: {{ selectedTransportista.telefono }}</p>
                <p>Correo: {{ selectedTransportista.correo }}</p>
                <p>Razón Social: {{ selectedTransportista.razonSocial }}</p>
                <p>
                  Tipo de Servicio: {{ selectedTransportista.tipoServicio }}
                </p>
                <p>Estado: {{ selectedTransportista.estado }}</p>
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
                  {{ isEditable ? "Guardar cambios" : "Editar" }}
                </span>
                <span v-if="loading" class="indicator-progress">
                  Guardando...
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
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from "vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import { useTransportistasStore } from "@/stores/transportistas";
import transportistas, {
  type ITransportistas,
} from "@/core/data/transportistas";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import arraySort from "array-sort";
import { Modal } from "bootstrap";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { MenuComponent } from "@/assets/ts/components";

export default defineComponent({
  name: "ListTransportistas",
  components: {
    KTDatatable,
  },
  setup() {
    const transportistasStore = useTransportistasStore();
    const transportistas = computed(
      () => transportistasStore.getTransportistas,
    );
    const loading = ref<boolean>(false);
    const initTransportistas = ref<Array<ITransportistas>>([]);
    const search = ref<string>("");
    const selectedIds = ref<Array<number>>([]);
    const selectedTransportista = ref<ITransportistas>({
      id: 0,
      nombre: "",
      direccion: "",
      telefono: "",
      correo: "",
      razonSocial: "",
      tipoServicio: "",
      estado: "",
    });
    const isEditable = ref(false);

    onMounted(() => {
      initTransportistas.value.splice(
        0,
        transportistas.value.length,
        ...transportistas.value,
      );
    });

    const tableHeader = ref([
      {
        columnName: "",
        columnLabel: "id",
        sortEnabled: true,
        columnWidth: 50,
      },
      {
        columnName: "Nombre",
        columnLabel: "nombre",
        sortEnabled: true,
        columnWidth: 150,
      },
      {
        columnName: "Dirección",
        columnLabel: "direccion",
        sortEnabled: true,
        columnWidth: 200,
      },
      {
        columnName: "Teléfono",
        columnLabel: "telefono",
        sortEnabled: true,
        columnWidth: 120,
      },
      {
        columnName: "Correo",
        columnLabel: "correo",
        sortEnabled: true,
        columnWidth: 150,
      },
      {
        columnName: "Razón Social",
        columnLabel: "razonSocial",
        sortEnabled: true,
        columnWidth: 150,
      },
      {
        columnName: "Tipo de Servicio",
        columnLabel: "tipoServicio",
        sortEnabled: true,
        columnWidth: 150,
      },
      {
        columnName: "Estado",
        columnLabel: "estado",
        sortEnabled: true,
        columnWidth: 120,
      },
      { columnName: "Acciones", columnLabel: "actions", columnWidth: 120 },
    ]);

    const getEstadoClass = (estado: string) => {
      switch (estado) {
        case "Activo":
          return "success";
        case "Inactivo":
          return "warning";
        case "Suspendido":
          return "danger";
        default:
          return "secondary";
      }
    };

    const sort = (sort: Sort) => {
      const reverse: boolean = sort.order === "asc";
      if (sort.label) {
        arraySort(transportistas.value, sort.label, { reverse });
      }
    };

    const deleteTransportista = (id: number) => {
      transportistasStore.transportistas =
        transportistasStore.transportistas.filter((t) => t.id !== id);
    };

    const deleteFewTransportistas = () => {
      selectedIds.value.forEach((id) => deleteTransportista(id));
      selectedIds.value = [];
    };

    const onItemSelect = (selectedItems: Array<number>) => {
      selectedIds.value = selectedItems;
    };

    const openModal = (transportista: ITransportistas) => {
      selectedTransportista.value = { ...transportista };
      const modalElement = document.getElementById("kt_modal_1");
      if (modalElement) {
        const modal = new Modal(modalElement);
        modal.show();
      }
    };

    const toggleEditMode = async () => {
      if (isEditable.value) {
        loading.value = true;
        try {
          transportistasStore.updateTransportista(selectedTransportista.value);
          Swal.fire({
            text: "Transportista actualizado exitosamente!",
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
            text: "Hubo un error al actualizar el transportista.",
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

    const searchItems = () => {
      transportistas.value.splice(
        0,
        transportistas.value.length,
        ...initTransportistas.value,
      );
      if (search.value !== "") {
        const results = transportistas.value.filter((t) =>
          Object.values(t).some((val) =>
            String(val).toLowerCase().includes(search.value.toLowerCase()),
          ),
        );
        transportistas.value.splice(0, transportistas.value.length, ...results);
      }
      MenuComponent.reinitialization();
    };
    const onItemsPerPageChange = () => {
      setTimeout(() => {
        MenuComponent.reinitialization();
      }, 0);
    };
    return {
      onItemsPerPageChange,
      tableHeader,
      transportistas,
      sort,
      deleteTransportista,
      deleteFewTransportistas,
      selectedIds,
      onItemSelect,
      selectedTransportista,
      openModal,
      toggleEditMode,
      isEditable,
      loading,
      search,
      searchItems,
      getEstadoClass,
    };
  },
});
</script>

<style scoped>
.badge-success {
  background-color: #28a745;
  color: white;
}

.badge-warning {
  background-color: #ffc107;
  color: black;
}

.badge-danger {
  background-color: #dc3545;
  color: white;
}

.badge-secondary {
  background-color: #6c757d;
  color: white;
}
</style>
