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
          placeholder="Buscar Orden de Carga"
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
            @click="deleteFewOrdenes()"
          >
            Eliminar Seleccionados
          </button>
        </div>
      </div>
    </div>
    <div class="card-body">
      <KTDatatable
        :header="tableHeader"
        :data="ordenesCarga"
        @on-sort="sort"
        :checkbox-enabled="true"
        @on-items-select="onItemSelect"
        @on-items-per-page-change="onItemsPerPageChange"
      >
        <template v-slot:id="{ row: data }">
          {{ data.id }}
        </template>
        <template v-slot:fechaEmision="{ row: data }">
          {{ formatDate(data.fechaEmision) }}
        </template>
        <template v-slot:numeroDocumento="{ row: data }">
          {{ data.numeroDocumento }}
        </template>
        <template v-slot:nombreComprador="{ row: data }">
          {{ data.nombreComprador }}
        </template>
        <template v-slot:terminalPortuaria="{ row: data }">
          {{ data.terminalPortuaria }}
        </template>
        <template v-slot:fechaAutorizacion="{ row: data }">
          {{ formatDate(data.fechaAutorizacion) }}
        </template>
        <template v-slot:tipoProducto="{ row: data }">
          {{ data.tipoProducto }}
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
                <a @click="deleteOrden(data.id)" class="menu-link px-3"
                  >Eliminar</a
                >
              </div>
              <div class="menu-item px-3">
                <a @click="exportToPdf(data)" class="menu-link px-3"
                  >Exportar PDF</a
                >
              </div>
            </div>
          </div>
        </template>
      </KTDatatable>

      <div class="modal fade" tabindex="-1" id="kt_modal_1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title">Editar Orden de Carga</h3>
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
                <el-form :model="selectedOrden" ref="formRef">
                  <div class="row">
                    <div class="col-md-6 mb-5">
                      <label class="fs-5 fw-semibold form-label mb-3"
                        >Fecha de Emisión:</label
                      >
                      <el-form-item prop="fechaEmision">
                        <el-input
                          v-model="selectedOrden.fechaEmision"
                          class="form-control-solid w-100"
                        />
                      </el-form-item>
                    </div>
                    <div class="col-md-6 mb-5">
                      <label class="fs-5 fw-semibold form-label mb-3"
                        >Número de Documento:</label
                      >
                      <el-form-item prop="numeroDocumento">
                        <el-input
                          v-model="selectedOrden.numeroDocumento"
                          class="form-control-solid w-100"
                        />
                      </el-form-item>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-6 mb-5">
                      <label class="fs-5 fw-semibold form-label mb-3"
                        >Nombre del Comprador:</label
                      >
                      <el-form-item prop="nombreComprador">
                        <el-input
                          v-model="selectedOrden.nombreComprador"
                          class="form-control-solid w-100"
                        />
                      </el-form-item>
                    </div>
                    <div class="col-md-6 mb-5">
                      <label class="fs-5 fw-semibold form-label mb-3"
                        >Terminal Portuaria:</label
                      >
                      <el-form-item prop="terminalPortuaria">
                        <el-input
                          v-model="selectedOrden.terminalPortuaria"
                          class="form-control-solid w-100"
                        />
                      </el-form-item>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-6 mb-5">
                      <label class="fs-5 fw-semibold form-label mb-3"
                        >Fecha de Autorización:</label
                      >
                      <el-form-item prop="fechaAutorizacion">
                        <el-input
                          v-model="selectedOrden.fechaAutorizacion"
                          class="form-control-solid w-100"
                        />
                      </el-form-item>
                    </div>
                    <div class="col-md-6 mb-5">
                      <label class="fs-5 fw-semibold form-label mb-3"
                        >Tipo de Producto:</label
                      >
                      <el-form-item prop="tipoProducto">
                        <el-input
                          v-model="selectedOrden.tipoProducto"
                          class="form-control-solid w-100"
                        />
                      </el-form-item>
                    </div>
                  </div>
                </el-form>
              </div>
              <div v-else>
                <p>ID: {{ selectedOrden.id }}</p>
                <p>
                  Fecha de Emisión: {{ formatDate(selectedOrden.fechaEmision) }}
                </p>
                <p>Número de Documento: {{ selectedOrden.numeroDocumento }}</p>
                <p>Nombre del Comprador: {{ selectedOrden.nombreComprador }}</p>
                <p>Terminal Portuaria: {{ selectedOrden.terminalPortuaria }}</p>
                <p>
                  Fecha de Autorización:
                  {{ formatDate(selectedOrden.fechaAutorizacion) }}
                </p>
                <p>Tipo de Producto: {{ selectedOrden.tipoProducto }}</p>
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
import { useOrdenesCargaStore } from "@/stores/ordenesCarga";
import type { IOrdenCarga } from "@/core/data/ordenesCarga";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import arraySort from "array-sort";
import { Modal } from "bootstrap";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { MenuComponent } from "@/assets/ts/components";
import jsPDF from "jspdf";

export default defineComponent({
  name: "ListOrdenesCarga",
  components: {
    KTDatatable,
  },
  setup() {
    const ordenesCargaStore = useOrdenesCargaStore();
    const ordenesCarga = computed(() =>
      ordenesCargaStore.obtenerOrdenesCarga(),
    );
    const loading = ref<boolean>(false);
    const initOrdenesCarga = ref<Array<IOrdenCarga>>([]);
    const search = ref<string>("");
    const selectedIds = ref<Array<number>>([]);
    const selectedOrden = ref<IOrdenCarga>({
      id: 0,
      fechaEmision: "",
      numeroDocumento: "",
      nombreComprador: "",
      domicilioComprador: "",
      terminalPortuaria: "",
      domicilioTerminal: "",
      fechaAutorizacion: "",
      tipoProducto: "",
      claseProducto: "",
      cantidadProducto: 0,
      siglasContenedor: "",
      numeroContenedor: "",
      cantidadBultos: 0,
      pesoBruto: 0,
      nombreBuque: "",
      numeroConocimientoEmbarque: "",
      numeroManifiesto: "",
      numeroDeclaracionMercancias: "",
      entidadPropietaria: "",
      matriculaVehiculo: "",
      licenciaOperacion: "",
      hojaRuta: "",
      cartaPorte: "",
      lugarVinculacion: "",
      nombreConductor: "",
      numeroIdentidadConductor: "",
      nombreResponsable: "",
      cargoResponsable: "",
      numeroIdentidadResponsable: "",
      firmaResponsable: "",
    });
    const isEditable = ref(false);

    onMounted(() => {
      initOrdenesCarga.value.splice(
        0,
        ordenesCarga.value.length,
        ...ordenesCarga.value,
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
        columnName: "Fecha de Emisión",
        columnLabel: "fechaEmision",
        sortEnabled: true,
        columnWidth: 150,
      },
      {
        columnName: "Número de Documento",
        columnLabel: "numeroDocumento",
        sortEnabled: true,
        columnWidth: 150,
      },
      {
        columnName: "Nombre del Comprador",
        columnLabel: "nombreComprador",
        sortEnabled: true,
        columnWidth: 200,
      },
      {
        columnName: "Terminal Portuaria",
        columnLabel: "terminalPortuaria",
        sortEnabled: true,
        columnWidth: 200,
      },
      {
        columnName: "Fecha de Autorización",
        columnLabel: "fechaAutorizacion",
        sortEnabled: true,
        columnWidth: 150,
      },
      {
        columnName: "Tipo de Producto",
        columnLabel: "tipoProducto",
        sortEnabled: true,
        columnWidth: 150,
      },
      { columnName: "Acciones", columnLabel: "actions", columnWidth: 120 },
    ]);

    const sort = (sort: Sort) => {
      const reverse: boolean = sort.order === "asc";
      if (sort.label) {
        arraySort(ordenesCarga.value, sort.label, { reverse });
      }
    };

    const deleteOrden = (id: number) => {
      ordenesCargaStore.eliminarOrdenCarga(id);
    };

    const deleteFewOrdenes = () => {
      selectedIds.value.forEach((id) => deleteOrden(id));
      selectedIds.value = [];
    };

    const onItemSelect = (selectedItems: Array<number>) => {
      selectedIds.value = selectedItems;
    };

    const openModal = (orden: IOrdenCarga) => {
      selectedOrden.value = { ...orden };
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
          ordenesCargaStore.updateOrdenCarga(selectedOrden.value);
          Swal.fire({
            text: "Orden de carga actualizada exitosamente!",
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
            text: "Hubo un error al actualizar la orden de carga.",
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
      ordenesCarga.value.splice(
        0,
        ordenesCarga.value.length,
        ...initOrdenesCarga.value,
      );
      if (search.value !== "") {
        const results = ordenesCarga.value.filter((orden) =>
          Object.values(orden).some((val) =>
            String(val).toLowerCase().includes(search.value.toLowerCase()),
          ),
        );
        ordenesCarga.value.splice(0, ordenesCarga.value.length, ...results);
      }
      MenuComponent.reinitialization();
    };

    const onItemsPerPageChange = () => {
      setTimeout(() => {
        MenuComponent.reinitialization();
      }, 0);
    };

    const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getUTCDate()).padStart(2, "0");
      return `${day}/${month}/${year}`;
    };

    // Método para exportar la orden de carga en PDF
    const exportToPdf = (orden: IOrdenCarga) => {
      const doc = new jsPDF();

      // Título del PDF
      doc.setFontSize(18);
      doc.text("Detalles de la Orden de Carga", 10, 10);

      // Datos de la orden de carga
      doc.setFontSize(12);
      let y = 20; // Posición vertical inicial
      const lineHeight = 10; // Espacio entre líneas

      // Función para agregar texto al PDF
      const addText = (label: string, value: string | number) => {
        doc.text(`${label}: ${value}`, 10, y);
        y += lineHeight;
      };

      // Agregar todos los campos de la orden de carga
      addText("ID", orden.id);
      addText("Fecha de Emisión", formatDate(orden.fechaEmision));
      addText("Número de Documento", orden.numeroDocumento);
      addText("Nombre del Comprador", orden.nombreComprador);
      addText("Domicilio del Comprador", orden.domicilioComprador);
      addText("Terminal Portuaria", orden.terminalPortuaria);
      addText("Domicilio de la Terminal", orden.domicilioTerminal);
      addText("Fecha de Autorización", formatDate(orden.fechaAutorizacion));
      addText("Tipo de Producto", orden.tipoProducto);
      addText("Clase de Producto", orden.claseProducto);
      addText("Cantidad de Producto", orden.cantidadProducto);
      addText("Siglas del Contenedor", orden.siglasContenedor);
      addText("Número del Contenedor", orden.numeroContenedor);
      addText("Cantidad de Bultos", orden.cantidadBultos);
      addText("Peso Bruto", orden.pesoBruto);
      addText("Nombre del Buque", orden.nombreBuque);
      addText(
        "Número de Conocimiento de Embarque",
        orden.numeroConocimientoEmbarque,
      );
      addText("Número de Manifiesto", orden.numeroManifiesto);
      addText(
        "Número de Declaración de Mercancías",
        orden.numeroDeclaracionMercancias,
      );
      addText("Entidad Propietaria", orden.entidadPropietaria);
      addText("Matrícula del Vehículo", orden.matriculaVehiculo);
      addText("Licencia de Operación", orden.licenciaOperacion);
      addText("Hoja de Ruta", orden.hojaRuta);
      addText("Carta Porte", orden.cartaPorte);
      addText("Lugar de Vinculación", orden.lugarVinculacion);
      addText("Nombre del Conductor", orden.nombreConductor);
      addText(
        "Número de Identidad del Conductor",
        orden.numeroIdentidadConductor,
      );
      addText("Nombre del Responsable", orden.nombreResponsable);
      addText("Cargo del Responsable", orden.cargoResponsable);
      addText(
        "Número de Identidad del Responsable",
        orden.numeroIdentidadResponsable,
      );
      addText("Firma del Responsable", orden.firmaResponsable);

      // Guardar el PDF
      doc.save(`orden_carga_${orden.id}.pdf`);
    };

    return {
      formatDate,
      onItemsPerPageChange,
      tableHeader,
      ordenesCarga,
      sort,
      deleteOrden,
      deleteFewOrdenes,
      selectedIds,
      onItemSelect,
      selectedOrden,
      openModal,
      toggleEditMode,
      isEditable,
      loading,
      search,
      searchItems,
      exportToPdf, // Exportar el método para usarlo en el template
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
