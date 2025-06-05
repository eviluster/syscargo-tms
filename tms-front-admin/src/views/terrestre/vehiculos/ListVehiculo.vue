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
          placeholder="Buscar Vehículo"
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
            @click="deleteFewVehiculos()"
          >
            Delete Selected
          </button>
        </div>
      </div>
    </div>
    <div class="card-body">
      <KTDatatable
        @on-sort="sort"
        @on-items-select="onItemSelect"
        @on-items-per-page-change="onItemsPerPageChange"
        :data="vehiculos"
        :header="tableHeader"
        :checkbox-enabled="true"
        :items-per-page="10"
      >
        <template v-slot:id="{ row: data }">
          {{ data.id }}
        </template>
        <template v-slot:nombre="{ row: data }">
          {{ data.nombre }}
        </template>
        <template v-slot:modelo="{ row: data }">
          {{ data.modelo }}
        </template>
        <template v-slot:matricula="{ row: data }">
          {{ data.matricula }}
        </template>
        <template v-slot:conductor="{ row: data }">
          {{ data.conductor }}
        </template>
        <template v-slot:estado="{ row: data }">
          {{ data.estado }}
        </template>
        <template v-slot:ultimoViajeKm="{ row: data }">
          {{ data.ultimoViajeKm }}
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
                <a @click="deleteVehiculo(data.id)" class="menu-link px-3"
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
              <h3 class="modal-title">Detalles del Vehículo</h3>
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
                  <el-form :model="selectedVehiculo" ref="formRef">
                    <label class="fs-5 fw-semibold form-label mb-5"
                      >Nombre:</label
                    >
                    <div class="fv-row mb-5">
                      <el-form-item prop="nombre">
                        <el-input
                          v-model="selectedVehiculo.nombre"
                          class="form-control-solid w-250px"
                          aria-label="Editar nombre"
                        />
                      </el-form-item>
                    </div>

                    <label class="fs-5 fw-semibold form-label mb-5"
                      >Modelo:</label
                    >
                    <div class="fv-row mb-5">
                      <el-form-item prop="modelo">
                        <el-input
                          v-model="selectedVehiculo.modelo"
                          class="form-control-solid w-250px"
                          aria-label="Editar modelo"
                        />
                      </el-form-item>
                    </div>

                    <label class="fs-5 fw-semibold form-label mb-5"
                      >Matrícula:</label
                    >
                    <div class="fv-row mb-5">
                      <el-form-item prop="matricula">
                        <el-input
                          v-model="selectedVehiculo.matricula"
                          class="form-control-solid w-250px"
                          aria-label="Editar matrícula"
                        />
                      </el-form-item>
                    </div>

                    <label class="fs-5 fw-semibold form-label mb-5"
                      >Conductor:</label
                    >
                    <div class="fv-row mb-5">
                      <el-form-item prop="conductor">
                        <el-input
                          v-model="selectedVehiculo.conductor"
                          class="form-control-solid w-250px"
                          aria-label="Editar conductor"
                        />
                      </el-form-item>
                    </div>

                    <label class="fs-5 fw-semibold form-label mb-5"
                      >Estado:</label
                    >
                    <div class="fv-row mb-5">
                      <el-form-item prop="estado">
                        <el-select
                          v-model="selectedVehiculo.estado"
                          class="form-control-solid w-250px"
                          placeholder="Seleccione el estado"
                        >
                          <el-option label="Activo" value="Activo" />
                          <el-option
                            label="En mantenimiento"
                            value="En mantenimiento"
                          />
                        </el-select>
                      </el-form-item>
                    </div>

                    <label class="fs-5 fw-semibold form-label mb-5"
                      >Último viaje con km:</label
                    >
                    <div class="fv-row mb-5">
                      <el-form-item prop="ultimoViajeKm">
                        <el-input
                          v-model="selectedVehiculo.ultimoViajeKm"
                          class="form-control-solid w-250px"
                          aria-label="Editar último viaje con km"
                        />
                      </el-form-item>
                    </div>
                  </el-form>
                </div>
                <div v-else>
                  <p>ID: {{ selectedVehiculo.id }}</p>
                  <p>Nombre: {{ selectedVehiculo.nombre }}</p>
                  <p>Modelo: {{ selectedVehiculo.modelo }}</p>
                  <p>Matrícula: {{ selectedVehiculo.matricula }}</p>
                  <p>Conductor: {{ selectedVehiculo.conductor }}</p>
                  <p>Estado: {{ selectedVehiculo.estado }}</p>
                  <p>
                    Último viaje con km: {{ selectedVehiculo.ultimoViajeKm }}
                  </p>
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
      <!--End Modal-->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from "vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import arraySort from "array-sort";
import { useVehiculosStore } from "@/stores/vehiculos";
import { type IVehiculos } from "@/core/data/vehiculos";
import { Modal } from "bootstrap";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { MenuComponent } from "@/assets/ts/components";

export default defineComponent({
  name: "ListVehiculo",
  components: {
    KTDatatable,
  },
  setup() {
    const vehiculosStore = useVehiculosStore();
    const vehiculos = computed(() => vehiculosStore.getVehiculos);
    const initVehiculos = ref<Array<IVehiculos>>([]);
    const loading = ref<boolean>(false);
    onMounted(() => {
      initVehiculos.value.splice(0, vehiculos.value.length, ...vehiculos.value);
    });

    const tableHeader = ref([
      {
        columnName: "Nombre",
        columnLabel: "nombre",
        sortEnabled: true,
        columnWidth: 150,
      },
      {
        columnName: "Modelo",
        columnLabel: "modelo",
        sortEnabled: true,
        columnWidth: 120,
      },
      {
        columnName: "Matrícula",
        columnLabel: "matricula",
        sortEnabled: true,
        columnWidth: 100,
      },
      {
        columnName: "Conductor",
        columnLabel: "conductor",
        sortEnabled: true,
        columnWidth: 150,
      },
      {
        columnName: "Estado",
        columnLabel: "estado",
        sortEnabled: true,
        columnWidth: 150,
      },
      {
        columnName: "Último viaje con km",
        columnLabel: "ultimoViajeKm",
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
        arraySort(vehiculos.value, sort.label, { reverse });
      }
    };

    const deleteVehiculo = (id: number) => {
      for (let i = 0; i < vehiculos.value.length; i++) {
        if (vehiculos.value[i].id === id) {
          vehiculos.value.splice(i, 1);
        }
      }
    };

    const selectedIds = ref<Array<number>>([]);
    const deleteFewVehiculos = () => {
      selectedIds.value.forEach((id) => {
        deleteVehiculo(id);
      });
      selectedIds.value.length = 0;
    };

    const onItemSelect = (selectedItems: Array<number>) => {
      selectedIds.value = selectedItems;
    };

    const selectedVehiculo = ref<IVehiculos>({
      id: 0,
      nombre: "",
      modelo: "",
      matricula: "",
      conductor: "",
      estado: "",
      ultimoViajeKm: 0,
    });

    const openModal = (vehiculo: IVehiculos) => {
      selectedVehiculo.value = vehiculo;
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
          vehiculosStore.updateVehiculo(selectedVehiculo.value);

          await Swal.fire({
            text: "¡Vehículo actualizado exitosamente!",
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
            text: "Hubo un error al actualizar el vehículo.",
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
      vehiculos.value.splice(0, vehiculos.value.length, ...initVehiculos.value);
      if (search.value !== "") {
        let results: Array<IVehiculos> = [];
        for (let j = 0; j < vehiculos.value.length; j++) {
          if (searchingFunc(vehiculos.value[j], search.value)) {
            results.push(vehiculos.value[j]);
          }
        }
        vehiculos.value.splice(0, vehiculos.value.length, ...results);
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
    const onItemsPerPageChange = () => {
      setTimeout(() => {
        MenuComponent.reinitialization();
      }, 0);
    };
    return {
      tableHeader,
      vehiculos,
      sort,
      deleteVehiculo,
      deleteFewVehiculos,
      selectedIds,
      onItemSelect,
      selectedVehiculo,
      openModal,
      closeModal,
      toggleEditMode,
      isEditable,
      search,
      searchItems,
      loading,
      onItemsPerPageChange,
    };
  },
});
</script>
