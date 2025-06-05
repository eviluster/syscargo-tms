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
          placeholder="Buscar orden"
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
            <span class="me-2">{{ selectedIds.length }}</span> Elementos
            Selecionados
          </div>
          <button
            type="button"
            class="btn btn-danger"
            @click="deleteFewordenes()"
          >
            Borrar Selecionados
          </button>
        </div>
      </div>
    </div>
    <div class="card-body">
      <KTDatatable
        :header="tableHeader"
        :data="ordenes"
        @on-sort="sort"
        :checkbox-enabled="true"
        @on-items-select="onItemSelect"
        @on-items-per-page-change="onItemsPerPageChange"
      >
        <template v-slot:id="{ row: data }">
          {{ data.id }}
        </template>
        <template v-slot:codigoOrden="{ row: data }">
          {{ data.codigoOrden }}
        </template>
        <template v-slot:carnetIdentidad="{ row: data }">
          {{ data.carnetIdentidad }}
        </template>
        <template v-slot:nombreRemitente="{ row: data }">
          {{ data.nombreRemitente }}
        </template>
        <template v-slot:estado="{ row: data }">
          <span :class="getEstadoBadgeClass(data.estado)">
            {{ data.estado || "Pendiente" }}
          </span>
        </template>
        <template v-slot:autorizadoRecoger="{ row: data }">
          {{ data.autorizadoRecoger || "No especificado" }}
        </template>
        <template v-slot:fechaRegistro="{ row: data }">
          {{ formatDate(data.fechaRegistro) }}
        </template>
        <template v-slot:cantidadBultos="{ row: data }">
          {{ data.cantidadBultos }}
        </template>
        <template v-slot:volumenBulto="{ row: data }">
          {{ data.volumenBulto?.toFixed(2) || "0.00" }} m³
        </template>
        <template v-slot:peso="{ row: data }"> {{ data.peso }} kg </template>
        <template v-slot:tipoCarga="{ row: data }">
          <span
            :class="{
              'badge badge-light-primary': data.tipoCarga === 'Misceláneas',
              'badge badge-light-success': data.tipoCarga === 'Carga General',
            }"
          >
            {{ data.tipoCarga }}
          </span>
        </template>
        <template v-slot:precioTotal="{ row: data }">
          <span> {{ data.precioTotal.toFixed(2) }} CUP </span>
        </template>
        <template v-slot:actions="{ row: data }">
          <div>
            <a
              href="#"
              class="btn btn-sm btn-light btn-active-light-primary"
              data-kt-menu-trigger="click"
              data-kt-menu-placement="bottom-end"
              data-kt-menu-flip="top-end"
              >Acciones
              <KTIcon icon-name="down" icon-class="fs-5 m-0" />
            </a>
            <div
              class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-150px py-4"
              data-kt-menu="true"
            >
              <div class="menu-item px-3">
                <a @click="openModal(data)" class="menu-link px-3">Editar</a>
              </div>
              <div class="menu-item px-3">
                <a @click="deleteOrden(data.id)" class="menu-link px-3"
                  >Borrar</a
                >
              </div>
              <div class="menu-item">
                <a @click="downloadInvoice(data)" class="menu-link px-4"
                  >Descargar Factura</a
                >
              </div>
              <div class="menu-item">
                <a @click="generateQR(data)" class="menu-link px-4"
                  >Generar QR</a
                >
              </div>
            </div>
          </div>
        </template>
      </KTDatatable>

      <!-- Modal del QR -->
      <div class="modal fade" tabindex="-1" id="qrModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title">
                Código QR de la Orden - Orden #{{ currentQRData.id }}
              </h3>
              <div
                class="btn btn-icon btn-sm btn-active-light-primary ms-2"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <KTIcon icon-name="cross" icon-class="fs-1" />
              </div>
            </div>
            <div class="modal-body text-center">
              <img
                :src="qrCodeImage"
                alt="Código QR"
                class="img-fluid mb-3"
                style="max-width: 300px"
              />
              <div class="d-flex justify-content-center gap-2">
                <button @click="downloadQR()" class="btn btn-primary">
                  <KTIcon icon-name="download" icon-class="fs-2 me-2" />
                  Descargar QR
                </button>
                <button @click="printQR()" class="btn btn-secondary">
                  <KTIcon icon-name="printer" icon-class="fs-2 me-2" />
                  Imprimir
                </button>
              </div>
            </div>
            <div class="modal-footer">
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

      <!-- Modal -->
      <div class="modal fade" tabindex="-1" id="kt_modal_1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title">Detalles de la orden</h3>
              <div
                class="btn btn-icon btn-sm btn-active-light-primary ms-2"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <KTIcon icon-name="cross" icon-class="fs-1" />
              </div>
            </div>
            <div class="modal-body">
              <div>
                <el-form v-if="isEditable" :model="selectedOrden" ref="formRef">
                  <!-- Carnet de Identidad -->
                  <label class="fs-5 fw-semibold form-label mb-5"
                    >Carnet de Identidad:</label
                  >
                  <div class="fv-row mb-5">
                    <el-form-item prop="carnetIdentidad">
                      <el-input
                        v-model="selectedOrden.carnetIdentidad"
                        class="form-control-solid w-250px"
                      />
                    </el-form-item>
                  </div>
                  <!-- Nombre del Emisor -->
                  <label class="fs-5 fw-semibold form-label mb-5"
                    >Nombre del Emisor:</label
                  >
                  <div class="fv-row mb-5">
                    <el-form-item prop="nombreEmisor">
                      <el-input
                        v-model="selectedOrden.nombreEmisor"
                        class="form-control-solid w-450px"
                      />
                    </el-form-item>
                  </div>
                  <!-- Nombre del Remitente -->
                  <label class="fs-5 fw-semibold form-label mb-5"
                    >Nombre del Remitente:</label
                  >
                  <div class="fv-row mb-5">
                    <el-form-item prop="nombreRemitente">
                      <el-input
                        v-model="selectedOrden.nombreRemitente"
                        class="form-control-solid w-450px"
                      />
                    </el-form-item>
                  </div>

                  <!-- Autorizado a Recoger -->
                  <label class="fs-5 fw-semibold form-label mb-5"
                    >Autorizado a Recoger:</label
                  >
                  <div class="fv-row mb-5">
                    <el-form-item prop="autorizadoRecoger">
                      <el-input
                        v-model="selectedOrden.autorizadoRecoger"
                        class="form-control-solid w-450px"
                        placeholder="Nombre de la persona autorizada"
                      />
                    </el-form-item>
                  </div>

                  <!-- Dirección del Remitente -->
                  <label class="fs-5 fw-semibold form-label mb-5"
                    >Dirección del Remitente:</label
                  >
                  <div class="fv-row mb-5">
                    <el-form-item prop="direccionRemitente">
                      <el-input
                        v-model="selectedOrden.direccionRemitente"
                        class="form-control-solid w-450px"
                      />
                    </el-form-item>
                  </div>
                  <!-- Dirección del Emisor -->
                  <label class="fs-5 fw-semibold form-label mb-5"
                    >Dirección del Emisor:</label
                  >
                  <div class="fv-row mb-5">
                    <el-form-item prop="direccionEmisor">
                      <el-input
                        v-model="selectedOrden.direccionEmisor"
                        class="form-control-solid w-450px"
                      />
                    </el-form-item>
                  </div>

                  <!-- Estado -->
                  <label class="fs-5 fw-semibold form-label mb-5"
                    >Estado:</label
                  >
                  <div class="fv-row mb-5">
                    <el-form-item prop="estado">
                      <el-select
                        v-model="selectedOrden.estado"
                        class="form-control-solid w-250px"
                      >
                        <el-option label="Pendiente" value="Pendiente" />
                        <el-option
                          label="Transportista"
                          value="Transportista"
                        />
                        <el-option label="Confirmado" value="Confirmado" />
                        <el-option
                          label="Centro de Distribución"
                          value="Centro de Distribución"
                        />
                        <el-option label="En Tránsito" value="En Tránsito" />
                        <el-option label="Cancelado" value="Cancelado" />
                        <el-option label="Reprogramado" value="Reprogramado" />
                      </el-select>
                    </el-form-item>
                  </div>

                  <!-- Cantidad de Bultos -->
                  <label class="fs-5 fw-semibold form-label mb-5"
                    >Cantidad de Bultos:</label
                  >
                  <div class="fv-row mb-5">
                    <el-form-item prop="cantidadBultos">
                      <el-input-number
                        v-model="selectedOrden.cantidadBultos"
                        :min="1"
                        class="form-control-solid w-250px"
                        @change="actualizarPrecio"
                      />
                    </el-form-item>
                  </div>

                  <!-- Volumen por Bulto -->
                  <label class="fs-5 fw-semibold form-label mb-5"
                    >Volumen por Bulto (m³):</label
                  >
                  <div class="fv-row mb-5">
                    <el-form-item prop="volumenBulto">
                      <el-input-number
                        v-model="selectedOrden.volumenBulto"
                        :min="0.01"
                        :step="0.01"
                        class="form-control-solid w-250px"
                        @change="actualizarPrecio"
                      />
                    </el-form-item>
                  </div>

                  <!-- Peso -->
                  <label class="fs-5 fw-semibold form-label mb-5"
                    >Peso (kg):</label
                  >
                  <div class="fv-row mb-5">
                    <el-form-item prop="peso">
                      <el-input-number
                        v-model="selectedOrden.peso"
                        :min="0.1"
                        :step="0.1"
                        class="form-control-solid w-250px"
                        @change="actualizarPrecio"
                      />
                    </el-form-item>
                  </div>

                  <!-- Tipo de Carga -->
                  <label class="fs-5 fw-semibold form-label mb-5"
                    >Tipo de Carga:</label
                  >
                  <div class="fv-row mb-5">
                    <el-form-item prop="tipoCarga">
                      <el-select
                        v-model="selectedOrden.tipoCarga"
                        class="form-control-solid w-250px"
                      >
                        <el-option label="Misceláneas" value="Misceláneas" />
                        <el-option
                          label="Carga General"
                          value="Carga General"
                        />
                      </el-select>
                    </el-form-item>
                  </div>

                  <!-- Precio Total -->
                  <label class="fs-5 fw-semibold form-label mb-5"
                    >Precio Total:</label
                  >
                  <div class="fv-row mb-5">
                    <el-form-item>
                      <el-input
                        v-model="selectedOrden.precioTotal"
                        class="form-control-solid w-250px"
                        readonly
                      >
                        <template #append>CUP</template>
                      </el-input>
                    </el-form-item>
                  </div>

                  <!-- Fecha de Registro -->
                  <label class="fs-5 fw-semibold form-label mb-5"
                    >Fecha de Registro:</label
                  >
                  <div class="fv-row mb-5">
                    <el-form-item prop="fechaRegistro">
                      <el-input
                        v-model="selectedOrden.fechaRegistro"
                        class="form-control-solid w-250px"
                        disabled
                      />
                    </el-form-item>
                  </div>
                </el-form>
                <div v-else>
                  <p>
                    Carnet de Identidad: {{ selectedOrden.carnetIdentidad }}
                  </p>
                  <p>Nombre del Emisor: {{ selectedOrden.nombreEmisor }}</p>
                  <p>
                    Nombre del Remitente: {{ selectedOrden.nombreRemitente }}
                  </p>
                  <p>
                    Autorizado a recoger:
                    {{ selectedOrden.autorizadoRecoger || "No especificado" }}
                  </p>
                  <p>
                    Estado:
                    <span :class="getEstadoBadgeClass(selectedOrden.estado)">
                      {{ selectedOrden.estado || "Pendiente" }}
                    </span>
                  </p>
                  <p>
                    Fecha registro:
                    {{ formatDate(selectedOrden.fechaRegistro) }}
                  </p>
                  <p>Dirección del Remitente: {{ selectedOrden.direccionRemitente }}</p>
                  <p>Dirección del Emisor: {{ selectedOrden.direccionEmisor }}</p>
                  <p>Bultos: {{ selectedOrden.cantidadBultos }}</p>
                  <p>
                    Volumen por bulto:
                    {{ selectedOrden.volumenBulto?.toFixed(2) || "0.00" }} m³
                  </p>
                  <p>Peso: {{ selectedOrden.peso }} kg</p>
                  <p>Tipo de Carga: {{ selectedOrden.tipoCarga }}</p>
                  <p>
                    Precio Total: {{ selectedOrden.precioTotal.toFixed(2) }} CUP
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

      <!-- Advertencia de artículos prohibidos -->
      <div class="alert alert-warning mt-5">
        <div class="d-flex align-items-center">
          <KTIcon icon-name="information-5" icon-class="fs-2 me-4" />
          <div>
            <h4 class="fw-bold">Artículos Prohibidos</h4>
            <p class="mb-0">
              No se permite el transporte de sustancias peligrosas, armas de
              fuego, explosivos, drogas ilegales o cualquier artículo que pueda
              poner en riesgo la seguridad del transporte.
            </p>
          </div>
        </div>
      </div>
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
import { useordenesStore } from "@/stores/ordenesDecarga";
import { type IOrdenesC } from "@/core/data/ordenesDecarga";
import { MenuComponent } from "@/assets/ts/components";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import JsBarcode from "jsbarcode";

export default defineComponent({
  name: "list-ordenesA",
  components: {
    KTDatatable,
  },
  setup() {
    const ordenesStore = useordenesStore();
    const ordenes = computed(() => ordenesStore.getProducts);
    const initOrdenes = ref<Array<IOrdenesC>>([]);
    const loading = ref<boolean>(false);
    const qrCodeImage = ref<string>("");
    const currentQRData = ref<any>({});
    const formatDate = (dateString?: string) => {
      if (!dateString) return "No registrada";
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    };

    const formatOrderDataForQR = (order: IOrdenesC) => {
      return {
        id: order.id,
        remitente: order.nombreRemitente,
        carnet: order.carnetIdentidad,
        direccion: order.direccionRemitente,
        bultos: order.cantidadBultos,
        peso: order.peso,
        volumen: order.volumenBulto,
        origen: order.origen,
        autorizado: order.autorizadoRecoger,
        tipoCarga: order.tipoCarga,
        total: order.precioTotal,
        fecha: formatDate(order.fechaRegistro),
        estado: order.estado,
      };
    };

    const getEstadoBadgeClass = (estado?: string) => {
      switch (estado) {
        case "Pendiente":
          return "badge badge-light-warning";
        case "Transportista":
          return "badge badge-light-info";
        case "Confirmado":
          return "badge badge-light-success";
        case "Centro de Distribución":
          return "badge badge-light-secondary";
        case "En Tránsito":
          return "badge badge-light-primary";
        case "Cancelado":
          return "badge badge-light-danger";
        case "Reprogramado":
          return "badge badge-light-purple";
        default:
          return "badge badge-light-warning";
      }
    };

    onMounted(() => {
      initOrdenes.value = [...ordenes.value];
      MenuComponent.reinitialization();
    });

    const actualizarPrecio = () => {
      if (selectedOrden.value.peso && selectedOrden.value.volumenBulto) {
        // Calcular tarifa base (70 CUP por kg)
        const tarifaBase = selectedOrden.value.peso * 70;

        // Calcular costo por volumen (100 CUP por m³)
        const costoVolumen = selectedOrden.value.volumenBulto * 100;

        // Calcular impuesto aeroportuario (7.70 CUP por kg)
        const impuestoAeroportuario = selectedOrden.value.peso * 7.7;

        // Seleccionar el mayor entre costo por volumen y tarifa base
        const baseParaCalculos = Math.max(tarifaBase, costoVolumen);

        // Calcular subtotal (base seleccionada + impuesto)
        const subtotal = baseParaCalculos + impuestoAeroportuario;

        // Calcular comisión del servicio (5% del subtotal)
        const comisionServicio = subtotal * 0.05;

        // Actualizar los valores en el objeto
        selectedOrden.value.tarifaBase = tarifaBase;
        selectedOrden.value.costoVolumen = costoVolumen;
        selectedOrden.value.impuestoAeroportuario = impuestoAeroportuario;
        selectedOrden.value.comisionServicio = comisionServicio;
        selectedOrden.value.precioTotal = subtotal + comisionServicio;
      }
    };

    const tableHeader = ref([
      {
        columnName: "",
        columnLabel: "id",
        sortEnabled: true,
        columnWidth: 20,
      },
      {
        columnName: "Código",
        columnLabel: "codigoOrden",
        sortEnabled: true,
        columnWidth: 100,
      },
      {
        columnName: "Carnet Identidad",
        columnLabel: "carnetIdentidad",
        sortEnabled: true,
        columnWidth: 150,
      },
      {
        columnName: "Nombre Remitente",
        columnLabel: "nombreRemitente",
        sortEnabled: true,
        columnWidth: 180,
      },
      {
        columnName: "Estado",
        columnLabel: "estado",
        sortEnabled: true,
        columnWidth: 120,
      },
      {
        columnName: "Autorizado a Recoger",
        columnLabel: "autorizadoRecoger",
        sortEnabled: true,
        columnWidth: 180,
      },
      {
        columnName: "Fecha Registro",
        columnLabel: "fechaRegistro",
        sortEnabled: true,
        columnWidth: 130,
      },
      {
        columnName: "Bultos",
        columnLabel: "cantidadBultos",
        sortEnabled: true,
        columnWidth: 80,
      },
      {
        columnName: "Volumen (m³)",
        columnLabel: "volumenBulto",
        sortEnabled: true,
        columnWidth: 100,
      },
      {
        columnName: "Peso (kg)",
        columnLabel: "peso",
        sortEnabled: true,
        columnWidth: 90,
      },
      {
        columnName: "Tipo de Carga",
        columnLabel: "tipoCarga",
        sortEnabled: true,
        columnWidth: 140,
      },
      {
        columnName: "Precio Total",
        columnLabel: "precioTotal",
        sortEnabled: true,
        columnWidth: 120,
      },
      {
        columnName: "Acciones",
        columnLabel: "actions",
        columnWidth: 110,
      },
    ]);

    const sort = (sort: Sort) => {
      const reverse = sort.order === "asc";
      if (sort.label) {
        arraySort(ordenes.value, sort.label, { reverse });
      }
      MenuComponent.reinitialization();
    };

    const deleteOrden = (id: number) => {
      for (let i = 0; i < ordenes.value.length; i++) {
        if (ordenes.value[i].id === id) {
          ordenes.value.splice(i, 1);
        }
      }
    };

    const selectedIds = ref<Array<number>>([]);
    const deleteFewordenes = () => {
      selectedIds.value.forEach((item) => {
        deleteOrden(item);
      });
      selectedIds.value.length = 0;
    };

    const onItemSelect = (selectedItems: Array<number>) => {
      selectedIds.value = selectedItems;
    };

    const selectedOrden = ref<IOrdenesC>({
      id: 0,
      carnetIdentidad: "",
      direccionRemitente: "",
      nombreRemitente: "",
      cantidadBultos: 0,
      volumenBulto: 0,
      peso: 0,
      precioTotal: 0,
      tipoCarga: "Misceláneas",
      autorizadoRecoger: "",
      fechaRegistro: new Date().toISOString(),
      estado: "Pendiente",
    });

    const openModal = (orden: IOrdenesC) => {
      selectedOrden.value = {
        ...orden,
        estado: orden.estado || "Pendiente",
        fechaRegistro: orden.fechaRegistro || new Date().toISOString(),
      };
      const modalElement = document.getElementById("kt_modal_1");
      if (modalElement) {
        new Modal(modalElement).show();
      }
    };

    const isEditable = ref(false);

    const toggleEditMode = async () => {
      if (isEditable.value) {
        loading.value = true;
        try {
          await ordenesStore.updateOrden(selectedOrden.value);
          Swal.fire({
            text: "¡Orden actualizada exitosamente!",
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
            text: "Hubo un error al actualizar la orden.",
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
      ordenes.value.splice(0, ordenes.value.length, ...initOrdenes.value);
      if (search.value !== "") {
        let results: Array<IOrdenesC> = [];
        for (let j = 0; j < ordenes.value.length; j++) {
          if (searchingFunc(ordenes.value[j], search.value)) {
            results.push(ordenes.value[j]);
          }
        }
        ordenes.value.splice(0, ordenes.value.length, ...results);
      }
      MenuComponent.reinitialization();
    };

    const searchingFunc = (obj: any, value: string): boolean => {
      for (let key in obj) {
        if (!Number.isInteger(obj[key]) && !(typeof obj[key] === "object")) {
          if (
            obj[key]?.toString().toLowerCase().includes(value.toLowerCase())
          ) {
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

    const downloadInvoice = (orden: IOrdenesC) => {
      const doc = new jsPDF();
      const orderCode =
        orden.codigoOrden || `ORD${orden.id.toString().padStart(6, "0")}`;

      // Configuración inicial
      doc.setProperties({
        title: `Factura Orden ${orden.id}`,
        subject: "Factura de transporte",
        author: "SysCargo",
        keywords: "factura, transporte, orden",
        creator: "SysCargo",
      });

      // Logo y encabezado
      doc.setFontSize(18);
      doc.setTextColor(40, 53, 147);
      doc.setFont("helvetica", "bold");
      doc.text("SysCargo - Factura de Transporte", 105, 20, {
        align: "center",
      });

      // Información de la empresa
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.text("Empresa de Transporte SysCargo", 105, 30, { align: "center" });
      doc.text("Tel: +53 123 456 7890", 105, 35, { align: "center" });
      doc.text("Email: contacto@syscargo.cu", 105, 40, { align: "center" });

      // Línea divisoria
      doc.setDrawColor(200, 200, 200);
      doc.line(15, 45, 195, 45);

      // Detalles de la orden
      doc.setFontSize(14);
      doc.setTextColor(40, 53, 147);
      doc.text("Detalles de la Orden", 14, 55);

      autoTable(doc, {
        startY: 60,
        head: [["Información del Emisor", ""]],
        body: [
          ["Nombre del Remitente", orden.nombreEmisor],
          ["Carnet de Identidad", orden.carnetIdentidadEmisor],
          ["Direccion", orden.direccionEmisor],
          ["Fecha de registro", formatDate(orden.fechaRegistro)],
          ["Estado", orden.estado || "Pendiente"],
        ],
        theme: "plain",
        headStyles: {
          fillColor: [245, 245, 245],
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
        columnStyles: {
          0: { fontStyle: "bold", cellWidth: 60 },
          1: { cellWidth: "auto" },
        },
        margin: { top: 5 },
      });

      // Información del cliente (primera tabla)
      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 5,
        head: [["Información del Remitente", ""]],
        body: [
          ["Nombre del Remitente", orden.nombreRemitente],
          ["Carnet de Identidad", orden.carnetIdentidad],
          ["Direccion", orden.direccionRemitente],
          [
            "Autorizado a recoger",
            orden.autorizadoRecoger || "No especificado",
          ],
        ],
        theme: "plain",
        headStyles: {
          fillColor: [245, 245, 245],
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
        columnStyles: {
          0: { fontStyle: "bold", cellWidth: 60 },
          1: { cellWidth: "auto" },
        },
        margin: { top: 5 },
      });

      // Generar código de barras antes de la tabla de detalles del envío
      const barcodeText = orderCode;
      const canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 50;

      JsBarcode(canvas, barcodeText, {
        format: "CODE128",
        lineColor: "#000000",
        width: 1.5,
        height: 30,
        displayValue: true,
        margin: 0,
        fontSize: 12,
      });

      const imgData = canvas.toDataURL("image/png");
      const barcodeY = (doc as any).lastAutoTable.finalY + 5;

      // Detalles del envío (segunda tabla) - Ajustada para dejar espacio al código de barras
      autoTable(doc, {
        startY: barcodeY,
        tableWidth: 120, // Ancho reducido para dejar espacio al código
        head: [["Detalles del Envío", ""]],
        body: [
          ["Identificador", orderCode], // Acortado para ahorrar espacio
          ["Origen", orden.origen],
          ["Destino", orden.destino],
          ["Bultos", orden.cantidadBultos.toString()],
          ["Volumen", `${orden.volumenBulto?.toFixed(2) || "0.00"} m³`],
          ["Peso Total", `${orden.peso} kg`],
          ["Tipo de Carga", orden.tipoCarga],
        ],
        theme: "plain",
        headStyles: {
          fillColor: [245, 245, 245],
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
        columnStyles: {
          0: { fontStyle: "bold", cellWidth: 40 }, // Más estrecho
          1: { cellWidth: 80 }, // Más estrecho
        },
      });

      // Añadir el código de barras al lado derecho de la tabla
      doc.addImage(imgData, "PNG", 130, barcodeY + 5, 70, 20);

      // Desglose de precios (tercera tabla)
      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 10,
        head: [["Concepto", "Valor (CUP)"]],
        body: [
          ["Tarifa Base (70 CUP/kg)", orden.tarifaBase?.toFixed(2) || "0.00"],
          [
            "Costo por Volumen (100 CUP/m³)",
            orden.costoVolumen?.toFixed(2) || "0.00",
          ],
          [
            "Impuesto Aeroportuario (7.70 CUP/kg)",
            orden.impuestoAeroportuario?.toFixed(2) || "0.00",
          ],
          [
            "Comisión del Servicio (5%)",
            orden.comisionServicio?.toFixed(2) || "0.00",
          ],
          ["TOTAL A PAGAR", orden.precioTotal.toFixed(2)],
        ],
        theme: "grid",
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
        },
        columnStyles: {
          0: { fontStyle: "bold" },
          1: { halign: "right" },
        },
        didDrawCell: (data) => {
          // Resaltar la fila de TOTAL
          if (data.section === "body" && data.row.index === 4) {
            doc.setFillColor(41, 128, 185);
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
          }
        },
      });

      // Pie de página
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "italic");
      doc.text(
        "Gracias por confiar en SysCargo para sus envíos",
        105,
        pageHeight - 20,
        { align: "center" },
      );
      doc.text(
        "Este documento es válido como factura oficial",
        105,
        pageHeight - 15,
        { align: "center" },
      );
      doc.text(
        `Generado el ${new Date().toLocaleDateString()}`,
        105,
        pageHeight - 10,
        { align: "center" },
      );

      // Guardar el PDF
      doc.save(
        `Factura_SysCargo_${orden.codigoOrden || `ORD${orden.id.toString().padStart(6, "0")}`}.pdf`,
      );
    };

    //Codigo QR
    const generateQR = async (order: IOrdenesC) => {
      try {
        const orderData = formatOrderDataForQR(order);
        currentQRData.value = orderData;

        const url = await QRCode.toDataURL(JSON.stringify(orderData, null, 2), {
          errorCorrectionLevel: "H",
          width: 300,
          margin: 1,
        });

        qrCodeImage.value = url;

        const modalElement = document.getElementById("qrModal");
        if (modalElement) {
          new Modal(modalElement).show();
        }
      } catch (err) {
        console.error("Error generando QR:", err);
        Swal.fire({
          text: "Error al generar el código QR",
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "Ok",
          customClass: {
            confirmButton: "btn btn-primary",
          },
        });
      }
    };

    const downloadQR = () => {
      const link = document.createElement("a");
      link.href = qrCodeImage.value;
      link.download = `QR_Orden_${currentQRData.value.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const printQR = () => {
      const printWindow = window.open("", "", "width=600,height=600");
      printWindow?.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>QR Orden ${currentQRData.value.id}</title>
            <style>
              body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
              .qr-container { text-align: center; }
              .qr-title { font-size: 18px; margin-bottom: 10px; }
              .qr-image { max-width: 400px; height: auto; }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <div class="qr-title">Código QR - Orden ${currentQRData.value.id}</div>
              <img class="qr-image" src="${qrCodeImage.value}" />
            </div>
            <script>
              setTimeout(() => {
                window.print();
                window.close();
              }, 200);
            <\/script>
          </body>
        </html>
      `);
      printWindow?.document.close();
    };

    return {
      tableHeader,
      ordenes,
      search,
      selectedOrden,
      loading,
      isEditable,
      selectedIds,
      sort,
      deleteOrden,
      deleteFewordenes,
      openModal,
      toggleEditMode,
      searchItems,
      onItemSelect,
      onItemsPerPageChange,
      actualizarPrecio,
      downloadInvoice,
      formatDate,
      getEstadoBadgeClass,
      generateQR,
      qrCodeImage,
      currentQRData,
      downloadQR,
      printQR,
    };
  },
});
</script>
