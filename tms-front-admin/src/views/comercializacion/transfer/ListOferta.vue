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
          placeholder="Buscar Oferta"
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
            @click="deleteFewofertas()"
          >
            Delete Selected
          </button>
        </div>
      </div>
    </div>
    <div class="card-body">
      <KTDatatable
        :header="tableHeader"
        :data="ofertas"
        @on-sort="sort"
        :checkbox-enabled="true"
        @on-items-select="onItemSelect"
      >
        <template v-slot:id="{ row: data }">
          {{ data.id }}
        </template>
        <template v-slot:producto="{ row: data }">
          {{ data.producto }}
        </template>
        <template v-slot:idioma="{ row: data }">
          {{ data.idioma }}
        </template>
        <template v-slot:nombre="{ row: data }">
          {{ data.nombre }}
        </template>
        <template v-slot:periodo="{ row: data }">
          {{ formatDateRange(data.periodo) }}
        </template>
        <template v-slot:descripcion="{ row: data }">
          {{ data.descripcion }}
        </template>
        <template v-slot:diasVentaSemana="{ row: data }">
          {{ formatDiasVentaSemana(data.diasVentaSemana) }}
        </template>
        <template v-slot:actions="{ row: data }">
          <div>
            <a
              href="#"
              class="btn btn-sm btn-light btn-active-light-primary"
              data-kt-menu-trigger="click"
              data-kt-menu-placement="bottom-end"
              data-kt-menu-flip="top-end"
              >Actions
              <KTIcon icon-name="down" icon-class="fs-5 m-0" />
            </a>
            <!--begin::Menu-->
            <div
              class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-125px py-4"
              data-kt-menu="true"
            >
              <!--begin::Menu item-->
              <div class="menu-item px-3">
                <a @click="openModal(data)" class="menu-link px-3">Editar</a>
              </div>
              <!--end::Menu item-->
              <!--begin::Menu item-->
              <div class="menu-item px-3">
                <a @click="deleteOferta(data.id)" class="menu-link px-3"
                  >Delete</a
                >
              </div>
              <!--end::Menu item-->
            </div>
            <!--end::Menu-->
          </div>
        </template>
      </KTDatatable>
      <!--Modal-->
      <div class="modal fade" tabindex="-1" id="kt_modal_1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title">Detalles de la oferta</h3>
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
                <el-form
                  v-if="isEditable"
                  :model="selectedOferta"
                  ref="formRef"
                >
                  <!-- Producto -->
                  <label class="fs-5 fw-semibold form-label mb-5"
                    >Producto:</label
                  >
                  <div class="fv-row mb-5">
                    <el-form-item prop="producto">
                      <el-input
                        v-model="selectedOferta.producto"
                        class="form-control-solid w-250px"
                        aria-label="Edit producto"
                      />
                    </el-form-item>
                  </div>

                  <!-- Idioma -->
                  <label class="fs-5 fw-semibold form-label mb-5"
                    >Idioma:</label
                  >
                  <div class="fv-row mb-5">
                    <el-form-item prop="idioma">
                      <el-select
                        v-model="selectedOferta.idioma"
                        class="form-control-solid w-250px"
                        aria-label=" Edit Idioma"
                      >
                        <el-option label="Español" value="Español"
                          >Español</el-option
                        >
                        <el-option label="Inglés" value="Inglés"
                          >Ingles</el-option
                        >
                      </el-select>
                    </el-form-item>
                  </div>

                  <!-- Nombre -->
                  <label class="fs-5 fw-semibold form-label mb-5"
                    >Nombre:</label
                  >
                  <div class="fv-row mb-5">
                    <el-form-item prop="nombre">
                      <el-input
                        v-model="selectedOferta.nombre"
                        class="form-control-solid w-250px"
                        aria-label="Edit nombre"
                      />
                    </el-form-item>
                  </div>

                  <!-- Periodo de Venta -->
                  <label class="fs-5 fw-semibold form-label mb-5"
                    >Periodo de Venta:</label
                  >
                  <div class="fv-row mb-5">
                    <el-form-item prop="periodo">
                      <el-date-picker
                        v-model="selectedOferta.periodo"
                        format="DD/MM/YYYY"
                        type="daterange"
                        class="form-control-solid w-450px"
                        aria-label="Edit periodo"
                      />
                    </el-form-item>
                  </div>

                  <!-- Descripción -->
                  <label class="fs-5 fw-semibold form-label mb-5"
                    >Descripción:</label
                  >
                  <div class="fv-row mb-5">
                    <el-form-item prop="descripcion">
                      <el-input
                        v-model="selectedOferta.descripcion"
                        type="textarea"
                        class="form-control-solid w-450px"
                        aria-label="Edit descripcion"
                      />
                    </el-form-item>
                  </div>

                  <!-- Días de la oferta -->
                  <label class="fs-5 fw-semibold form-label mb-5"
                    >Días de la oferta:</label
                  >
                  <div class="fv-row mb-5">
                    <el-form-item prop="diasVentaSemana">
                      <div
                        class="form-check form-check-custom"
                        v-for="day in diasSemana"
                        :key="day"
                      >
                        <input
                          class="form-check-input"
                          type="checkbox"
                          :value="day"
                          v-model="selectedOferta.diasVentaSemana"
                          :id="`checkbox-${day}`"
                        />
                        <label
                          class="form-check-label me-3 text-white"
                          :for="`checkbox-${day}`"
                        >
                          {{ day }}
                        </label>
                      </div>
                    </el-form-item>
                  </div>
                </el-form>
                <div v-else>
                  <!-- Vista de solo lectura -->
                  <p>ID: {{ selectedOferta.id }}</p>
                  <p>Producto: {{ selectedOferta.producto }}</p>
                  <p>Idioma: {{ selectedOferta.idioma }}</p>
                  <p>Nombre: {{ selectedOferta.nombre }}</p>
                  <p>
                    Periodo de Venta:
                    {{ formatDateRange(selectedOferta.periodo) }}
                  </p>
                  <p>Descripcion: {{ selectedOferta.descripcion }}</p>
                  <p>
                    Días de la oferta:{{
                      formatDiasVentaSemana(selectedOferta.diasVentaSemana)
                    }}
                  </p>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                :data-kt-indicator="loading ? 'on' : null"
                class="btn btn-lg btn-primary"
                type="submit"
                @click="toggleEditMode()"
              >
                <span v-if="!loading" class="indicator-label">
                  {{ isEditable ? "Guardar cambios" : "Actualizar" }}
                </span>
                <span v-if="loading" class="indicator-progress">
                  Procesando...
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
import { Modal } from "bootstrap";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useOfertastore } from "@/stores/ofertas";
import { type IOfertasT } from "@/core/data/ofertasTransfer";
import { MenuComponent } from "@/assets/ts/components";
export default defineComponent({
  name: "ListOfertas",
  components: {
    KTDatatable,
  },
  setup() {
    const ofertasStore = useOfertastore();
    const ofertas = computed(() => ofertasStore.getProducts);
    console.log("Ofertas en el store:", ofertas.value);
    const loading = ref<boolean>(false);
    const diasSemana = ref([
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
      "Domingo",
    ]);
    const initCustomers = ref<Array<IOfertasT>>([]);
    onMounted(() => {
      initCustomers.value.splice(0, ofertas.value.length, ...ofertas.value);
    });
    const tableHeader = ref([
      {
        columnName: "",
        columnLabel: "id",
        sortEnabled: true,
        columnWidth: 20,
      },
      {
        columnName: "Producto",
        columnLabel: "producto",
        sortEnabled: true,
        columnWidth: 100,
      },
      {
        columnName: "Idioma",
        columnLabel: "idioma",
        sortEnabled: true,
        columnWidth: 100,
      },
      {
        columnName: "Nombre",
        columnLabel: "nombre",
        sortEnabled: true,
        columnWidth: 150,
      },
      {
        columnName: "Periodo de venta",
        columnLabel: "periodo",
        sortEnabled: true,
        columnWidth: 200,
      },
      {
        columnName: "Descripcion",
        columnLabel: "descripcion",
        sortEnabled: true,
        columnWidth: 300,
      },
      {
        columnName: "Días de la oferta",
        columnLabel: "diasVentaSemana",
        sortEnabled: true,
        columnWidth: 300,
      },
      {
        columnName: "",
        columnLabel: "actions",
        columnWidth: 120,
      },
    ]);

    const sort = (sort: Sort) => {
      const reverse: boolean = sort.order === "asc";
      if (sort.label) {
        arraySort(ofertas.value, sort.label, { reverse });
      }
    };

    const deleteOferta = (id: number) => {
      for (let i = 0; i < ofertas.value.length; i++) {
        if (ofertas.value[i].id === id) {
          ofertas.value.splice(i, 1);
        }
      }
    };

    const selectedIds = ref<Array<number>>([]);
    const deleteFewofertas = () => {
      selectedIds.value.forEach((item) => {
        deleteOferta(item);
      });
      selectedIds.value.length = 0;
    };

    const onItemSelect = (selectedItems: Array<number>) => {
      selectedIds.value = selectedItems;
    };

    const selectedOferta = ref<IOfertasT>({
      id: 0,
      producto: "",
      idioma: "",
      nombre: "",
      periodo: [new Date(), new Date()], // Initialize with two Date objects
      descripcion: "",
      diasVentaSemana: [],
    });

    const openModal = (oferta: IOfertasT) => {
      selectedOferta.value = { ...oferta };
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
          ofertasStore.updateOferta(selectedOferta.value);

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

    const formatDiasVentaSemana = (dias: string[] | undefined) => {
      if (!dias || !Array.isArray(dias)) return "";
      return dias.join(", ");
    };
    function formatDateRange(dateRange: [Date, Date]): string {
      const startDate = dateRange[0].toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const endDate = dateRange[1].toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      return `${startDate} - ${endDate}`;
    }
    const search = ref<string>("");
    const searchItems = () => {
      ofertas.value.splice(0, ofertas.value.length, ...initCustomers.value);
      if (search.value !== "") {
        let results: Array<IOfertasT> = [];
        for (let j = 0; j < ofertas.value.length; j++) {
          if (searchingFunc(ofertas.value[j], search.value)) {
            results.push(ofertas.value[j]);
          }
        }
        ofertas.value.splice(0, ofertas.value.length, ...results);
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
    return {
      tableHeader,
      ofertas,
      sort,
      deleteOferta,
      deleteFewofertas,
      selectedIds,
      onItemSelect,
      selectedOferta,
      openModal,
      closeModal,
      toggleEditMode,
      isEditable,
      formatDiasVentaSemana,
      diasSemana,
      loading,
      formatDateRange,
      search,
      searchItems,
    };
  },
});
</script>
