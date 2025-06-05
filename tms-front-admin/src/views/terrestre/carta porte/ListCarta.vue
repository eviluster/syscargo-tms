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
          placeholder="Buscar Carta Porte"
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
            @click="deleteFewCartasPorte()"
          >
            Eliminar Seleccionados
          </button>
        </div>
      </div>
    </div>
    <div class="card-body">
      <KTDatatable
        :header="tableHeader"
        :data="filteredCartasPorte"
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
        <template v-slot:fecha="{ row: data }">
          {{ formatDate(data.fecha) }}
        </template>
        <template v-slot:contacto="{ row: data }">
          {{ data.contacto }}
        </template>
        <template v-slot:subtotal="{ row: data }">
          ${{ data.subtotal }}
        </template>
        <template v-slot:impuestos="{ row: data }">
          ${{ data.impuestos }}
        </template>
        <template v-slot:total="{ row: data }"> ${{ data.total }} </template>
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
                <a @click="deleteCartaPorte(data.id)" class="menu-link px-3"
                  >Eliminar</a
                >
              </div>
              <div class="menu-item px-3">
                <a @click="exportToPDF(data)" class="menu-link px-3"
                  >Exportar PDF</a
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
              <h3 class="modal-title">Editar Carta Porte</h3>
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
                <el-form :model="selectedCartaPorte" ref="formRef">
                  <div class="row">
                    <!-- Nombre y Fecha -->
                    <div class="col-md-6 mb-5">
                      <label class="fs-5 fw-semibold form-label mb-3"
                        >Nombre:</label
                      >
                      <el-form-item prop="nombre">
                        <el-input
                          v-model="selectedCartaPorte.nombre"
                          class="form-control-solid w-100"
                        />
                      </el-form-item>
                    </div>
                    <div class="col-md-6 mb-5">
                      <label class="fs-5 fw-semibold form-label mb-3"
                        >Fecha:</label
                      >
                      <el-form-item prop="fecha">
                        <el-input
                          type="date"
                          v-model="selectedCartaPorte.fecha"
                          class="form-control-solid w-100"
                        />
                      </el-form-item>
                    </div>
                  </div>

                  <div class="row">
                    <!-- Contacto y Subtotal -->
                    <div class="col-md-6 mb-5">
                      <label class="fs-5 fw-semibold form-label mb-3"
                        >Contacto:</label
                      >
                      <el-form-item prop="contacto">
                        <el-input
                          v-model="selectedCartaPorte.contacto"
                          class="form-control-solid w-100"
                        />
                      </el-form-item>
                    </div>
                    <div class="col-md-6 mb-5">
                      <label class="fs-5 fw-semibold form-label mb-3"
                        >Subtotal:</label
                      >
                      <el-form-item prop="subtotal">
                        <el-input
                          type="number"
                          v-model="selectedCartaPorte.subtotal"
                          class="form-control-solid w-100"
                        />
                      </el-form-item>
                    </div>
                  </div>

                  <div class="row">
                    <!-- Impuestos y Total -->
                    <div class="col-md-6 mb-5">
                      <label class="fs-5 fw-semibold form-label mb-3"
                        >Impuestos:</label
                      >
                      <el-form-item prop="impuestos">
                        <el-input
                          type="number"
                          v-model="selectedCartaPorte.impuestos"
                          class="form-control-solid w-100"
                        />
                      </el-form-item>
                    </div>
                    <div class="col-md-6 mb-5">
                      <label class="fs-5 fw-semibold form-label mb-3"
                        >Total:</label
                      >
                      <el-form-item prop="total">
                        <el-input
                          type="number"
                          v-model="selectedCartaPorte.total"
                          class="form-control-solid w-100"
                          readonly
                        />
                      </el-form-item>
                    </div>
                  </div>
                </el-form>
              </div>
              <div v-else>
                <p>ID: {{ selectedCartaPorte.id }}</p>
                <p>Nombre: {{ selectedCartaPorte.nombre }}</p>
                <p>Fecha: {{ formatDate(selectedCartaPorte.fecha) }}</p>
                <p>Contacto: {{ selectedCartaPorte.contacto }}</p>
                <p>Subtotal: ${{ selectedCartaPorte.subtotal }}</p>
                <p>Impuestos: ${{ selectedCartaPorte.impuestos }}</p>
                <p>Total: ${{ selectedCartaPorte.total }}</p>
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
import { useCartasPorteStore } from "@/stores/cartasPorte";
import cartasPorte, { type ICartaPorte } from "@/core/data/cartasPorte";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import arraySort from "array-sort";
import { Modal } from "bootstrap";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { MenuComponent } from "@/assets/ts/components";
import jsPDF from "jspdf";

export default defineComponent({
  name: "ListCartasPorte",
  components: {
    KTDatatable,
  },
  setup() {
    const cartasPorteStore = useCartasPorteStore();
    const cartasPorte = computed(() => cartasPorteStore.getCartasPorte);
    const loading = ref<boolean>(false);
    const initCartasPorte = ref<Array<ICartaPorte>>([]);
    const search = ref<string>("");
    const selectedIds = ref<Array<number>>([]);
    const selectedCartaPorte = ref<ICartaPorte>({
      id: 0,
      nombre: "",
      fecha: "",
      contacto: "",
      subtotal: 0,
      impuestos: 0,
      total: 0,
    });
    const isEditable = ref(false);

    onMounted(() => {
      initCartasPorte.value.splice(
        0,
        cartasPorte.value.length,
        ...cartasPorte.value,
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
        columnName: "Fecha",
        columnLabel: "fecha",
        sortEnabled: true,
        columnWidth: 120,
      },
      {
        columnName: "Contacto",
        columnLabel: "contacto",
        sortEnabled: true,
        columnWidth: 150,
      },
      {
        columnName: "Subtotal",
        columnLabel: "subtotal",
        sortEnabled: true,
        columnWidth: 120,
      },
      {
        columnName: "Impuestos",
        columnLabel: "impuestos",
        sortEnabled: true,
        columnWidth: 120,
      },
      {
        columnName: "Total",
        columnLabel: "total",
        sortEnabled: true,
        columnWidth: 120,
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
        arraySort(cartasPorte.value, sort.label, { reverse });
      }
    };

    const deleteCartaPorte = (id: number) => {
      cartasPorteStore.deleteCartaPorte(id);
    };

    const deleteFewCartasPorte = () => {
      selectedIds.value.forEach((id) => deleteCartaPorte(id));
      selectedIds.value = [];
    };

    const onItemSelect = (selectedItems: Array<number>) => {
      selectedIds.value = selectedItems;
    };

    const openModal = (cartaPorte: ICartaPorte) => {
      selectedCartaPorte.value = { ...cartaPorte };
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
          cartasPorteStore.updateCartaPorte(selectedCartaPorte.value);
          Swal.fire({
            text: "Carta Porte actualizada exitosamente!",
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
            text: "Hubo un error al actualizar la Carta Porte.",
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
      cartasPorte.value.splice(
        0,
        cartasPorte.value.length,
        ...initCartasPorte.value,
      );
      if (search.value !== "") {
        const results = cartasPorte.value.filter((c) =>
          Object.values(c).some((val) =>
            String(val).toLowerCase().includes(search.value.toLowerCase()),
          ),
        );
        cartasPorte.value.splice(0, cartasPorte.value.length, ...results);
      }
      MenuComponent.reinitialization();
    };

    const exportToPDF = (cartaPorte: ICartaPorte) => {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("Carta Porte", 10, 10);
      doc.setFontSize(12);
      doc.text(`ID: ${cartaPorte.id}`, 10, 20);
      doc.text(`Nombre: ${cartaPorte.nombre}`, 10, 30);
      doc.text(`Fecha: ${cartaPorte.fecha}`, 10, 40);
      doc.text(`Contacto: ${cartaPorte.contacto}`, 10, 50);
      doc.text(`Subtotal: $${cartaPorte.subtotal}`, 10, 60);
      doc.text(`Impuestos: $${cartaPorte.impuestos}`, 10, 70);
      doc.text(`Total: $${cartaPorte.total}`, 10, 80);
      doc.save(`CartaPorte_${cartaPorte.id}.pdf`);
    };

    const filteredCartasPorte = computed(() => {
      return cartasPorte.value.filter((c) =>
        Object.values(c).some((val) =>
          String(val).toLowerCase().includes(search.value.toLowerCase()),
        ),
      );
    });
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
    const onItemsPerPageChange = () => {
      setTimeout(() => {
        MenuComponent.reinitialization();
      }, 0);
    };
    return {
      onItemsPerPageChange,
      formatDate,
      tableHeader,
      filteredCartasPorte,
      sort,
      deleteCartaPorte,
      deleteFewCartasPorte,
      selectedIds,
      onItemSelect,
      selectedCartaPorte,
      openModal,
      toggleEditMode,
      isEditable,
      loading,
      search,
      searchItems,
      exportToPDF,
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
