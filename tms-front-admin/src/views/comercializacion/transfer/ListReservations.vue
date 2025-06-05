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
          placeholder="Buscar Reserva"
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
            @click="deleteFewReservas()"
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
        :data="reservas"
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
        <template v-slot:pasaporte="{ row: data }">
          {{ data.pasaporte }}
        </template>
        <template v-slot:telefono="{ row: data }">
          {{ data.telefono }}
        </template>
        <template v-slot:origen="{ row: data }">
          {{ data.origen }}
        </template>
        <template v-slot:destino="{ row: data }">
          {{ data.destino }}
        </template>
        <template v-slot:fecha="{ row: data }">
          {{ formatDate(data.fecha) }}
        </template>
        <template v-slot:hora="{ row: data }">
          {{ data.hora }}
        </template>
        <template v-slot:tipodepago="{ row: data }">
          {{ data.tipodepago }}
        </template>
        <template v-slot:tipodemercado="{ row: data }">
          {{ data.tipodemercado }}
        </template>
        <template v-slot:tipodetrasnporte="{ row: data }">
          {{ data.tipodetrasnporte }}
        </template>
        <template v-slot:condicionesadicionales="{ row: data }">
          {{ data.condicionesadicionales }}
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
                <a @click="deleteReserva(data.id)" class="menu-link px-3"
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
              <h3 class="modal-title">Detalles de la Reserva</h3>
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
                  <el-form :model="selectedReserva" ref="formRef">
                    <label class="fs-5 fw-semibold form-label mb-5"
                      >Nombre:</label
                    >
                    <div class="fv-row mb-5">
                      <el-form-item prop="nombre">
                        <el-input
                          v-model="selectedReserva.nombre"
                          class="form-control-solid w-250px"
                          aria-label="Editar nombre"
                        />
                      </el-form-item>
                    </div>

                    <label class="fs-5 fw-semibold form-label mb-5"
                      >Pasaporte:</label
                    >
                    <div class="fv-row mb-5">
                      <el-form-item prop="pasaporte">
                        <el-input
                          v-model="selectedReserva.pasaporte"
                          class="form-control-solid w-250px"
                          aria-label="Editar pasaporte"
                        />
                      </el-form-item>
                    </div>

                    <label class="fs-5 fw-semibold form-label mb-5"
                      >Teléfono:</label
                    >
                    <div class="fv-row mb-5">
                      <el-form-item prop="telefono">
                        <el-input
                          v-model="selectedReserva.telefono"
                          class="form-control-solid w-250px"
                          aria-label="Editar teléfono"
                        />
                      </el-form-item>
                    </div>

                    <label class="fs-5 fw-semibold form-label mb-5"
                      >Origen:</label
                    >
                    <div class="fv-row mb-5">
                      <el-form-item prop="origen">
                        <el-input
                          v-model="selectedReserva.origen"
                          class="form-control-solid w-250px"
                          aria-label="Editar origen"
                        />
                      </el-form-item>
                    </div>

                    <label class="fs-5 fw-semibold form-label mb-5"
                      >Destino:</label
                    >
                    <div class="fv-row mb-5">
                      <el-form-item prop="destino">
                        <el-input
                          v-model="selectedReserva.destino"
                          class="form-control-solid w-250px"
                          aria-label="Editar destino"
                        />
                      </el-form-item>
                    </div>

                    <label class="fs-5 fw-semibold form-label mb-5"
                      >Fecha:</label
                    >
                    <div class="fv-row mb-5">
                      <el-form-item prop="fecha">
                        <el-date-picker
                          v-model="selectedReserva.fecha"
                          type="date"
                          class="form-control-solid w-250px"
                          aria-label="Editar fecha"
                        />
                      </el-form-item>
                    </div>

                    <label class="fs-5 fw-semibold form-label mb-5"
                      >Hora:</label
                    >
                    <div class="fv-row mb-5">
                      <el-form-item prop="hora">
                        <input
                          type="time"
                          v-model="selectedReserva.hora"
                          class="form-control w-250px"
                          aria-label="Editar hora"
                        />
                      </el-form-item>
                    </div>

                    <label class="fs-5 fw-semibold form-label mb-5"
                      >Tipo de pago:</label
                    >
                    <div class="fv-row mb-5">
                      <el-form-item prop="tipodepago">
                        <el-select
                          v-model="selectedReserva.tipodepago"
                          class="form-control-solid w-250px"
                          placeholder="Seleccione tipo de pago"
                        >
                          <el-option
                            label="Transfermovil"
                            value="Transfermovil"
                          />
                          <el-option label="Enzona" value="Enzona" />
                          <el-option label="Visa" value="Visa" />
                          <el-option label="Mastercard" value="Mastercard" />
                        </el-select>
                      </el-form-item>
                    </div>

                    <label class="fs-5 fw-semibold form-label mb-5"
                      >Tipo de mercado:</label
                    >
                    <div class="fv-row mb-5">
                      <el-form-item prop="tipodemercado">
                        <el-select
                          v-model="selectedReserva.tipodemercado"
                          class="form-control-solid w-250px"
                          placeholder="Seleccione tipo de mercado"
                        >
                          <el-option label="Nacional" value="Nacional" />
                          <el-option
                            label="Internacional"
                            value="Internacional"
                          />
                        </el-select>
                      </el-form-item>
                    </div>

                    <label class="fs-5 fw-semibold form-label mb-5"
                      >Tipo de transporte:</label
                    >
                    <div class="fv-row mb-5">
                      <el-form-item prop="tipodetrasnporte">
                        <el-select
                          v-model="selectedReserva.tipodetrasnporte"
                          class="form-control-solid w-250px"
                          placeholder="Seleccione tipo de transporte"
                        >
                          <el-option label="Bus" value="Bus" />
                          <el-option label="Carro" value="Carro" />
                          <el-option label="Taxi" value="Taxi" />
                          <el-option label="Minibus" value="Minibus" />
                        </el-select>
                      </el-form-item>
                    </div>

                    <label class="fs-5 fw-semibold form-label mb-5"
                      >Condiciones adicionales:</label
                    >
                    <div class="fv-row mb-5">
                      <el-form-item prop="condicionesadicionales">
                        <el-input
                          v-model="selectedReserva.condicionesadicionales"
                          type="textarea"
                          class="form-control-solid w-450px"
                          aria-label="Editar condiciones adicionales"
                        />
                      </el-form-item>
                    </div>
                  </el-form>
                </div>
                <div v-else>
                  <p>ID: {{ selectedReserva.id }}</p>
                  <p>Nombre: {{ selectedReserva.nombre }}</p>
                  <p>Pasaporte: {{ selectedReserva.pasaporte }}</p>
                  <p>Teléfono: {{ selectedReserva.telefono }}</p>
                  <p>Origen: {{ selectedReserva.origen }}</p>
                  <p>Destino: {{ selectedReserva.destino }}</p>
                  <p>Fecha: {{ formatDate(selectedReserva.fecha) }}</p>
                  <p>Hora: {{ selectedReserva.hora }}</p>
                  <p>Tipo de pago: {{ selectedReserva.tipodepago }}</p>
                  <p>Tipo de mercado: {{ selectedReserva.tipodemercado }}</p>
                  <p>
                    Tipo de transporte: {{ selectedReserva.tipodetrasnporte }}
                  </p>
                  <p>
                    Condiciones adicionales:
                    {{ selectedReserva.condicionesadicionales }}
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
import { useReservasStore } from "@/stores/reservas";
import { type IReservaciones } from "@/core/data/reservaciones";
import { Modal } from "bootstrap";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { MenuComponent } from "@/assets/ts/components";

export default defineComponent({
  name: "ListReservations",
  components: {
    KTDatatable,
  },
  setup() {
    const reservasStore = useReservasStore();
    const reservas = computed(() => reservasStore.getProducts);
    const initReservas = ref<Array<IReservaciones>>([]);
    const loading = ref<boolean>(false);

    onMounted(() => {
      initReservas.value.splice(0, reservas.value.length, ...reservas.value);
      MenuComponent.reinitialization();
    });

    const tableHeader = ref([
      {
        columnName: "Nombre",
        columnLabel: "nombre",
        sortEnabled: true,
        columnWidth: 150,
      },
      {
        columnName: "Pasaporte",
        columnLabel: "pasaporte",
        sortEnabled: true,
        columnWidth: 120,
      },
      {
        columnName: "Teléfono",
        columnLabel: "telefono",
        sortEnabled: true,
        columnWidth: 100,
      },
      {
        columnName: "Origen",
        columnLabel: "origen",
        sortEnabled: true,
        columnWidth: 150,
      },
      {
        columnName: "Destino",
        columnLabel: "destino",
        sortEnabled: true,
        columnWidth: 150,
      },
      {
        columnName: "Fecha",
        columnLabel: "fecha",
        sortEnabled: true,
        columnWidth: 100,
      },
      {
        columnName: "Hora",
        columnLabel: "hora",
        sortEnabled: true,
        columnWidth: 100,
      },
      {
        columnName: "Tipo de pago",
        columnLabel: "tipodepago",
        sortEnabled: true,
        columnWidth: 120,
      },
      {
        columnName: "Tipo de mercado",
        columnLabel: "tipodemercado",
        sortEnabled: true,
        columnWidth: 120,
      },
      {
        columnName: "Tipo de transporte",
        columnLabel: "tipodetrasnporte",
        sortEnabled: true,
        columnWidth: 120,
      },
      {
        columnName: "Condiciones adicionales",
        columnLabel: "condicionesadicionales",
        sortEnabled: true,
        columnWidth: 200,
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
        arraySort(reservas.value, sort.label, { reverse });
      }
      MenuComponent.reinitialization();
    };

    const deleteReserva = (id: number) => {
      Swal.fire({
        text: "¿Estás seguro de eliminar esta reserva?",
        icon: "warning",
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "No, cancelar",
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-active-light",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          reservasStore.deleteReserva(id);
          Swal.fire({
            text: "Reserva eliminada correctamente",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Ok",
            customClass: {
              confirmButton: "btn btn-primary",
            },
          });
        }
      });
    };

    const selectedIds = ref<Array<number>>([]);
    const deleteFewReservas = () => {
      Swal.fire({
        text: `¿Estás seguro de eliminar ${selectedIds.value.length} reservas?`,
        icon: "warning",
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "No, cancelar",
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-active-light",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          reservasStore.deleteMultipleReservas(selectedIds.value);
          selectedIds.value = [];
          Swal.fire({
            text: "Reservas eliminadas correctamente",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Ok",
            customClass: {
              confirmButton: "btn btn-primary",
            },
          });
        }
      });
    };

    const onItemSelect = (selectedItems: Array<number>) => {
      selectedIds.value = selectedItems;
    };

    const selectedReserva = ref<IReservaciones>({
      id: 0,
      nombre: "",
      pasaporte: "",
      telefono: "",
      origen: "",
      destino: "",
      fecha: "",
      hora: "",
      tipodepago: "",
      tipodemercado: "",
      tipodetrasnporte: "",
      condicionesadicionales: "",
    });

    const openModal = (reserva: IReservaciones) => {
      selectedReserva.value = { ...reserva };
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
          await reservasStore.updateReserva(selectedReserva.value);

          Swal.fire({
            text: "¡Reserva actualizada exitosamente!",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Ok",
            customClass: {
              confirmButton: "btn btn-primary",
            },
          }).then(() => {
            closeModal();
          });
        } catch (error) {
          Swal.fire({
            text: "Hubo un error al actualizar la reserva.",
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

    const formatDate = (dateString: string) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Fecha inválida";
      }
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const search = ref<string>("");
    const searchItems = () => {
      reservas.value.splice(0, reservas.value.length, ...initReservas.value);
      if (search.value !== "") {
        let results: Array<IReservaciones> = [];
        for (let j = 0; j < reservas.value.length; j++) {
          if (searchingFunc(reservas.value[j], search.value)) {
            results.push(reservas.value[j]);
          }
        }
        reservas.value.splice(0, reservas.value.length, ...results);
      }
      MenuComponent.reinitialization();
    };

    const searchingFunc = (obj: any, value: string): boolean => {
      for (let key in obj) {
        if (!Number.isInteger(obj[key]) && !(typeof obj[key] === "object")) {
          if (obj[key].toString().toLowerCase().includes(value.toLowerCase())) {
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
      reservas,
      sort,
      deleteReserva,
      deleteFewReservas,
      selectedIds,
      onItemSelect,
      selectedReserva,
      openModal,
      closeModal,
      toggleEditMode,
      isEditable,
      search,
      searchItems,
      formatDate,
      loading,
      onItemsPerPageChange,
    };
  },
});
</script>
