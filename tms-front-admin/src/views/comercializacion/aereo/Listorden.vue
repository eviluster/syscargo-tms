<template>
  <div class="card" ref="rootEl">
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
      <div class="d-flex justify-content-end align-items-center">
        <div class="fw-bold me-5">
          <span class="me-2">{{ selectedIds.length }}</span> Elementos
          Selecionados
        </div>

        <button
          type="button"
          class="btn btn-danger"
          :disabled="selectedIds.length === 0"
          @click="confirmDeleteSelected"
        >
          Eliminar Elementos
        </button>
      </div>
    </div>
    <div class="card-body">
      <!-- Mostrar peso total actual -->
      <div class="mb-3">
        <strong>Peso Total:</strong> {{ totalWeight.toFixed(2) }} kg
      </div>
      <KTDatatable
        :header="tableHeader"
        :data="ordenes"
        @on-sort="sort"
        row-key="id"
        :row-class-name="getRowClass"
        :checkbox-enabled="true"
        v-model:selectedItems="selectedIds"
        @update:selectedItems="onItemSelect"
        @selected-items-change="onItemSelect"
        @on-select="onItemSelect"
        @on-items-per-page-change="onItemsPerPageChange"
        class="h-10"
      >
        <template v-slot:order_id="{ row: data }">
          {{ data.order_id }}
        </template>
        <template v-slot:carga_serie="{ row: data }">
          {{ data.carga_serie }}
        </template>
        <template v-slot:remitente_dni="{ row: data }">
          {{ data.remitente_dni }}
        </template>
        <template v-slot:remitente_nombre="{ row: data }">
          {{ data.remitente_nombre }}
        </template>
        <template v-slot:estado="{ row: data }">
          <i
            v-if="data.estado === 'entregado'"
            class="bi bi-check-circle-fill me-1"
          ></i>
          <span :class="getEstadoBadgeClass(data.estado)">
            {{ data.estado || "Pendiente" }}
          </span>
        </template>
        <template v-slot:autorizado_recoger="{ row: data }">
          {{ data.autorizado_recoger || "No especificado" }}
        </template>
        <template v-slot:fechaRegistro="{ row: data }">
          {{ formatDate(data.fechaRegistro) }}
        </template>
        <template v-slot:cant_bultos="{ row: data }">
          {{ data.cant_bultos }}
        </template>
        <template v-slot:vol_bulto="{ row: data }">
          {{ data.vol_bulto?.toFixed(2) || "0.00" }} m³
        </template>
        <template v-slot:peso_total="{ row: data }">
          {{ data.peso_total }} kg
        </template>
        <template v-slot:tipo_carga="{ row: data }">
          <span
            :class="{
              'badge badge-light-primary': data.tipo_carga === 'Misceláneas',
              'badge badge-light-success': data.tipo_carga === 'Carga General',
            }"
          >
            {{ data.tipo_carga }}
          </span>
        </template>
        <template v-slot:precio="{ row: data }">
          <span> {{ data.precio.toFixed(2) }} CUP </span>
        </template>
        <template v-slot:actions="{ row: data }">
          <div>
            <button
              class="btn btn-sm btn-light btn-active-light-primary"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              ref="actionButton"
            >
              Acciones
              <KTIcon icon-name="down" icon-class="fs-5 m-0" />
            </button>
            <ul
              class="dropdown-menu"
              aria-labelledby="dropdownMenuButton"
              ref="actionMenu"
            >
              <li>
                <a
                  class="dropdown-item cursor-pointer"
                  @click="openEditOrdenModal(data)"
                >
                  <KTIcon icon-name="pencil" icon-class="fs-4 me-2" />
                  Editar
                </a>
              </li>
              <li>
                <a
                  class="dropdown-item cursor-pointer"
                  @click="deleteOrden(data.id)"
                >
                  <KTIcon
                    icon-name="trash"
                    icon-class="fs-4 me-2 text-danger"
                  />
                  Eliminar
                </a>
              </li>
              <li>
                <a
                  class="dropdown-item cursor-pointer"
                  @click="downloadInvoice(data)"
                >
                  <KTIcon icon-name="file-download" icon-class="fs-4 me-2" />
                  Descargar Factura
                </a>
              </li>
              <li>
                <a
                  class="dropdown-item cursor-pointer"
                  @click="generateQR(data)"
                >
                  <KTIcon icon-name="qr" icon-class="fs-4 me-2" />
                  Generar QR
                </a>
              </li>

              <!-- NUEVA ACCIÓN: Ver Prestatarios compatibles -->
              <li v-if="data.estado !== 'asignado'">
                <a
                  class="dropdown-item cursor-pointer"
                  @click="openPrestatariosModal(data)"
                >
                  <KTIcon icon-name="truck" icon-class="fs-4 me-2" />
                  Ver prestatarios compatibles
                </a>
              </li>

              <!-- opción Revisar comprobantes (solo cuando estado === 'entregado') -->
              <li v-if="data.estado === 'entregado'">
                <a
                  class="dropdown-item cursor-pointer"
                  @click="openComprobantesModal(data)"
                >
                  <KTIcon icon-name="eye" icon-class="fs-4 me-2" />
                  Revisar comprobantes
                </a>
              </li>
            </ul>
          </div>
        </template>
      </KTDatatable>

      <!-- Modal que contiene el EditOrdenForm -->
      <div
        class="modal fade"
        id="editOrdenModal"
        tabindex="-1"
        aria-hidden="true"
        ref="editOrdenModalEl"
      >
        <div class="modal-dialog modal-xl modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Editar Orden</h5>
              <button
                type="button"
                class="btn-close"
                @click="hideEditOrdenModal"
                aria-label="Cerrar"
              ></button>
            </div>
            <div class="modal-body">
              <!-- Renderizamos el formulario solo si hay una orden seleccionada -->
              <EditOrdenForm
                v-if="selectedOrdenForEdit"
                :key="formKey"
                :orden="selectedOrdenForEdit"
                @saved="onEditSaved"
                @cancel="onEditCancel"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para mostrar prestatarios -->
      <div
        class="modal fade"
        id="prestatariosModal"
        tabindex="-1"
        aria-labelledby="prestatariosModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-scrollable modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="prestatariosModalLabel">
                Prestatarios compatibles
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
              ></button>
            </div>

            <div class="modal-body">
              <div v-if="prestatariosLoading" class="text-center py-4">
                <div class="spinner-border" role="status"></div>
                <div class="mt-2">Cargando prestatarios...</div>
              </div>

              <div v-else>
                <div v-if="prestatarios.length === 0" class="text-muted">
                  No se encontraron prestatarios para estos filtros.
                </div>

                <div v-else class="list-group">
                  <div
                    v-for="p in prestatarios"
                    :key="p.id"
                    class="list-group-item list-group-item-action d-flex justify-content-between align-items-start"
                  >
                    <div class="ms-2 me-auto">
                      <div class="fw-bold">
                        {{ p.companyName || p.name || p.username || "-" }}
                      </div>
                      <div class="small text-muted">
                        TipoCarga: {{ p.tipoCarga || "-" }} · Rating:
                        {{ p.rating ?? "-" }}
                      </div>
                      <div class="small text-muted">
                        MaxWeight: {{ p.max_weight ?? p.maxWeight ?? "-" }} kg ·
                        MaxVolume: {{ p.max_volume ?? p.maxVolume ?? "-" }} m³
                      </div>
                      <div class="small mt-1">
                        Cargas especiales:
                        <span v-if="(p.cargasEspeciales || []).length">
                          {{ (p.cargasEspeciales || []).join(", ") }}
                        </span>
                        <span v-else>-</span>
                      </div>
                      <div class="small mt-1">
                        Transportes:
                        <span v-if="(p.transportes || []).length">
                          {{
                            (p.transportes || [])
                              .map((t) => t.tipoTransporte || t.tipo || t)
                              .join(", ")
                          }}
                        </span>
                        <span v-else>-</span>
                      </div>
                    </div>
                    <div class="text-end">
                      <button
                        class="btn btn-sm btn-primary mb-1"
                        @click="selectPrestatarioForOrder(p)"
                      >
                        Seleccionar (proponer)
                      </button>
                      <div>
                        <!-- Abrir perfil en modal -->
                        <button
                          class="btn btn-sm btn-light"
                          @click="viewPrestatarioProfile(p)"
                        >
                          Ver perfil
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal: Comprobantes (POD) -->
      <div
        class="modal fade"
        id="comprobantesModal"
        tabindex="-1"
        aria-hidden="true"
        ref="comprobantesModalRef"
      >
        <div class="modal-dialog modal-lg modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Comprobantes de entrega</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" />
            </div>
            <div class="modal-body">
              <div v-if="comprobantesLoading" class="text-center py-4">
                <div class="spinner-border" role="status"></div>
              </div>

              <div v-else>
                <div v-if="!comprobantes.length" class="text-muted">
                  No se encontraron comprobantes para esta carga.
                </div>

                <div v-else class="d-flex flex-wrap gap-3">
                  <div
                    v-for="(img, idx) in comprobantes"
                    :key="idx"
                    class="card border-0 shadow-sm"
                    style="width: 180px"
                  >
                    <div style="height: 120px; overflow: hidden">
                      <img
                        :src="img"
                        alt="comprobante"
                        class="img-fluid w-100 h-100"
                        style="object-fit: cover"
                      />
                    </div>
                    <div class="card-body p-2 text-center">
                      <small class="text-muted"
                        >Comprobante {{ idx + 1 }}</small
                      >
                      <div class="mt-2 d-flex justify-content-center gap-2">
                        <button
                          class="btn btn-sm btn-outline-primary"
                          @click="
                            downloadImage(img, `comprobante-${idx + 1}.jpg`)
                          "
                        >
                          Descargar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
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

      <!-- Modal para mostrar PERFIL del prestatario (nuevo) -->
      <div
        class="modal fade"
        id="prestatarioProfileModal"
        tabindex="-1"
        aria-labelledby="prestatarioProfileModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="prestatarioProfileModalLabel">
                Perfil del prestatario
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
              ></button>
            </div>

            <div class="modal-body">
              <div v-if="profileLoading" class="text-center py-4">
                <div class="spinner-border" role="status"></div>
                <div class="mt-2">Cargando perfil...</div>
              </div>

              <div v-else>
                <div v-if="!prestatarioProfile" class="text-muted">
                  No hay datos del prestatario.
                </div>

                <div v-else>
                  <h4 class="mb-2">
                    {{
                      prestatarioProfile.companyName ||
                      prestatarioProfile.name ||
                      prestatarioProfile.username
                    }}
                  </h4>
                  <div class="small text-muted mb-3">
                    Rating: {{ prestatarioProfile.rating ?? "-" }}
                  </div>

                  <div class="row mb-3">
                    <div class="col-md-6">
                      <strong>Tipo de carga: </strong>
                      {{ prestatarioProfile.tipoCarga || "-" }}
                    </div>
                    <div class="col-md-6">
                      <strong>Contenedor:</strong>
                      {{ prestatarioProfile.contenedor || "-" }}
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-md-6">
                      <strong>Peso Máximo:</strong>
                      {{
                        prestatarioProfile.maxWeight ??
                        prestatarioProfile.max_weight ??
                        "-"
                      }}
                      kg
                    </div>
                    <div class="col-md-6">
                      <strong>Volumen Máximo:</strong>
                      {{
                        prestatarioProfile.maxVolume ??
                        prestatarioProfile.max_volume ??
                        "-"
                      }}
                      m³
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-md-6">
                      <strong>Transportes:</strong>
                      <ul>
                        <li
                          v-for="(t, i) in prestatarioProfile.transportes || []"
                          :key="i"
                        >
                          {{ t.nombreChofer || t.driverName || "-" }} —
                          {{ t.chapa || "-" }} —
                          {{ t.tipoTransporte || t.tipo || "-" }}
                        </li>
                      </ul>
                    </div>
                    <div class="col-md-6">
                      <strong>Cargas especiales:</strong>
                      <div
                        v-if="
                          (prestatarioProfile.cargasEspeciales || []).length
                        "
                      >
                        {{
                          (prestatarioProfile.cargasEspeciales || []).join(", ")
                        }}
                      </div>
                      <div v-else>-</div>
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-md-6">
                      <strong>Licencia:</strong>
                      <div v-if="prestatarioProfile.licencia">
                        Número:
                        {{ prestatarioProfile.licencia.numero || "-" }} ·
                        Categoría:
                        {{ prestatarioProfile.licencia.categoria || "-" }} ·
                        Vence: {{ prestatarioProfile.licencia.vence || "-" }}
                      </div>
                      <div v-else>-</div>
                    </div>
                    <div class="col-md-6">
                      <strong>Ayudantes:</strong>
                      <ul>
                        <li
                          v-for="(h, i) in prestatarioProfile.ayudantes || []"
                          :key="i"
                        >
                          {{ h.nombre }} {{ h.apellidos }} — CI: {{ h.ci }}
                        </li>
                      </ul>
                      <div v-if="!(prestatarioProfile.ayudantes || []).length">
                        -
                      </div>
                    </div>
                  </div>

                  <div class="mb-3">
                    <strong>Contacto:</strong>
                    <div>
                      Email: {{ prestatarioProfile.user.username || "-" }}
                    </div>
                    <div>Tel: {{ prestatarioProfile.user.phone || "-" }}</div>
                  </div>

                  <div class="mb-3">
                    <strong>Condiciones / Reglas:</strong>
                    <div v-if="prestatarioProfile?.conditions">
                      <!-- Si guardaste HTML/Markdown en backend y decides permitir renderizado -->
                      <!-- usa v-html pero SANITIZA el contenido en backend o usa una librería cliente para sanitizar -->
                      <!-- <div v-html="prestatarioProfile.conditions"></div>  -->
                      {{ prestatarioProfile.conditions }}
                    </div>
                    <div v-else>-</div>
                  </div>
                </div>
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

      <!-- Advertencia de artículos prohibidos -->
      <div class="alert alert-warning mt-5">
        <div class="d-flex align-items-center">
          <KTIcon icon-name="information-5" icon-class="fs-2 me-4" />
          <div>
            <h4 class="fw-bold">Artículos Prohibidos</h4>
            <div v-if="items?.type === 'html'" v-html="items.value"></div>
            <div
              v-else-if="items?.type === 'markdown'"
              v-html="items.value.html"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  ref,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from "vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import arraySort from "array-sort";
import { Modal } from "bootstrap";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { MenuComponent } from "@/assets/ts/components";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import JsBarcode from "jsbarcode";
import CargaApi from "@/axios/axios";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import EditOrdenForm from "../aereo/EditOrdenForm.vue";
import api from "@/services/api";
import { useAuthStore } from "@/stores/auth";

interface IOrdenesC {
  id: string;
  order_id: string; // Cambiado a string porque la API usa UUID
  carga_serie: string;
  remitente_dni: string;
  remitente_nombre: string;
  direccion: string;
  emisor_dni: string;
  emisor_nombre: string;
  emisor_direccion: string;
  estado: string;
  cant_bultos: number;
  vol_bulto: number;
  peso_total: number;
  tipo_carga: string;
  autorizado_recoger: string;
  origen_string: string;
  destino_string: string;
  fechaRegistro: string;
  tarifabase: number;
  volumen: number;
  impuesto: number;
  comision: number;
  precio: number;
}

export default defineComponent({
  name: "list-ordenesA",
  components: {
    KTDatatable,
    Datatable,
    EditOrdenForm,
  },
  setup() {
    const ordenes = ref<IOrdenesC[]>([]);
    const initOrdenes = ref<IOrdenesC[]>([]);
    const loading = ref<boolean>(false);
    const qrCodeImage = ref<string>("");
    const currentQRData = ref<any>({});

    const actionButton = ref<HTMLElement | null>(null);
    const actionMenu = ref<HTMLElement | null>(null);
    const selectedIds = ref<Array<string>>([]);
    let dropdownInstance: Dropdown | null = null;
    let confirmModal: Modal | null = null;
    const selectedState = ref<string | null>(null);
    const items = ref([]);

    // prestatarios modal state
    const prestatarios = ref<any[]>([]);
    const prestatariosLoading = ref(false);
    const selectedOrderForPrestatarios = ref<any | null>(null);
    let prestatariosModalInstance: Modal | null = null;

    //Edit modal
    const editOrdenModalEl = ref<HTMLElement | null>(null);
    let editModalInstance: Modal | null = null;

    // orden que vamos a editar (se pasa por prop al form)
    const selectedOrdenForEdit = ref<any | null>(null);

    // key para forzar recrear el formulario al cambiar la orden
    const formKey = ref<number>(Date.now());

    // prestatario profile modal
    const prestatarioProfile = ref<any | null>(null);
    const profileLoading = ref(false);
    let prestatarioProfileModalInstance: Modal | null = null;

    //Comprobantes
    const comprobantes = ref<string[]>([]);
    const comprobantesLoading = ref(false);
    const comprobantesModalRef = ref<HTMLElement | null>(null);
    let comprobantesModalInstance: Modal | null = null;

    function openEditOrdenModal(orden: any) {
      // setear la orden y cambiar key para forzar re-init del Form
      selectedOrdenForEdit.value = { ...orden }; // clonar por seguridad
      formKey.value = Date.now();
      // show modal
      if (!editModalInstance && editOrdenModalEl.value) {
        editModalInstance = new Modal(editOrdenModalEl.value);
      }
      editModalInstance?.show();
    }

    function hideEditOrdenModal() {
      editModalInstance?.hide();
      // limpiamos
      selectedOrdenForEdit.value = null;
    }

    // Evento recibido cuando EditOrdenForm emitió 'saved'
    async function onEditSaved(updatedData: any) {
      hideEditOrdenModal();

      // refrescar lista de ordenes desde backend
      try {
        await loadOrdenes(); // si tienes esa función en este scope
      } catch (err) {
        console.warn("No se pudo refrescar la lista automáticamente", err);
      }
    }

    function onEditCancel() {
      hideEditOrdenModal();
    }

    function normalizeImageSrc(src: string | null | undefined): string | null {
      if (!src) return null;
      const s = String(src);
      // si viene base64 ya completo (data:...), usar tal cual
      if (s.startsWith("data:")) return s;
      // si es una ruta relativa tipo /uploads/..., preprendemos origen
      if (s.startsWith("/")) {
        try {
          return `${window.location.origin}${s}`;
        } catch {
          return s;
        }
      }
      // si es una URL completa o ya usable, devolvemos tal cual
      return s;
    }

    async function openComprobantesModal(order: any) {
      comprobantesLoading.value = true;
      comprobantes.value = [];

      try {
        // posibles campos donde tu backend guardó comprobantes:
        // pod_dni_front_url, pod_dni_back_url, pod_dni_front_base64, pod_dni_back_base64, pod_files, pod_others...
        const possible = [
          order.pod_dni_front_url ?? order.pod_dni_front_base64 ?? null,
          order.pod_dni_back_url ??
            order.pod_dni_back_base64 ??
            order.pod_dni_back_base64 ??
            null,
          // si guardas un array en order.pod_files u order.pod_attachments:
          ...(Array.isArray(order.pod_files) ? order.pod_files : []),
          ...(Array.isArray(order.pod_attachments)
            ? order.pod_attachments
            : []),
        ];

        // filtrar y normalizar
        const imgs = possible
          .filter(Boolean)
          .map((x) => normalizeImageSrc(x))
          .filter(Boolean) as string[];

        // si no vino nada en la carga completa, intenta pedir detalles frescos al backend:
        if (!imgs.length) {
          try {
            const res = await api.get(`/carga/${order.id}`);
            const data = res.data?.data ?? res.data;
            const fromApi = [
              data.pod_dni_front_url ?? data.pod_dni_front_base64 ?? null,
              data.pod_dni_back_url ?? data.pod_dni_back_base64 ?? null,
              ...(Array.isArray(data.pod_files) ? data.pod_files : []),
              ...(Array.isArray(data.pod_attachments)
                ? data.pod_attachments
                : []),
            ];
            imgs.push(
              ...(fromApi
                .filter(Boolean)
                .map((x) => normalizeImageSrc(x))
                .filter(Boolean) as string[]),
            );
          } catch (e) {
            // si falla el fetch, no rompemos; sólo dejamos imgs vacíos
            console.warn("No se pudieron obtener comprobantes desde API", e);
          }
        }

        comprobantes.value = imgs;
      } finally {
        comprobantesLoading.value = false;

        // abrir modal bootstrap
        await nextTick();
        const el =
          comprobantesModalRef.value ??
          document.getElementById("comprobantesModal");
        if (el) {
          try {
            comprobantesModalInstance = Modal.getInstance(el) ?? new Modal(el);
          } catch {
            comprobantesModalInstance = new Modal(el);
          }
          comprobantesModalInstance.show();
        }
      }
    }

    function downloadImage(src: string, filename = "comprobante.jpg") {
      try {
        // Si es base64
        if (src.startsWith("data:")) {
          const link = document.createElement("a");
          link.href = src;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          return;
        }
        // URL normal
        const link = document.createElement("a");
        link.href = src;
        link.target = "_blank";
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (e) {
        console.error("Error descargando imagen", e);
        Swal.fire("Error", "No se pudo descargar la imagen", "error");
      }
    }

    // // Computed para sumar pesos
    const totalWeight = computed(() =>
      ordenes.value.reduce((sum, o) => sum + (o.peso_total || 0), 0),
    );

    const getRowClass = (row: any) => {
      // console.log(row);
      return selectedIds.value.includes(row.id) ? "selected-row" : "";
    };

    async function load() {
      try {
        const res = await api.get("/settings/prohibited_products");
        // console.log(res.data);

        items.value = res.data?.data ?? res.data ?? [];
      } catch (e) {
        console.error(e);
      }
    }

    // Función para cargar las órdenes
    const loadOrdenes = async () => {
      try {
        loading.value = true;
        const auth = useAuthStore();

        if (auth.accessToken) {
          // console.log("Hay token, se puede hacer la llamada");

          const data = await api.get("/carga/all");
          console.log("Datos recibidos de la API:", data);

          ordenes.value = data.data;
          initOrdenes.value = [...data.data];
        } else {
          console.warn("No hay token, no se puede hacer la llamada");
        }
      } catch (error) {
        console.error("Error en loadOrdenes:", error);
        Swal.fire({
          text: "Error al cargar las órdenes",
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
    };

    onMounted(async () => {
      if (actionButton.value && actionMenu.value) {
        dropdownInstance = new Dropdown(actionButton.value);
      }
      loadOrdenes();
      MenuComponent.reinitialization();
      const el = document.getElementById("confirmStateModal");
      if (el) confirmModal = new Modal(el);

      // inicializamos modal de prestatarios "dinámicamente" para controlarlo
      const pres = document.getElementById("prestatariosModal");
      if (pres) prestatariosModalInstance = new Modal(pres);

      const profileEl = document.getElementById("prestatarioProfileModal");
      if (profileEl) prestatarioProfileModalInstance = new Modal(profileEl);

      load();

      if (editOrdenModalEl.value) {
        editModalInstance = new Modal(editOrdenModalEl.value, {
          backdrop: "static",
        });
      }
      window.addEventListener("carga-confirmada", onCargaConfirmada);

      //-------------------------------APARTADO DE EL DELETE MULTIPLE ------------------------------------//
      // espera a que el DOM esté listo
      await nextTick();

      // attach listeners a document (captura) para garantizar que atrapamos clicks / cambios
      document.addEventListener("change", docHandler, true);
      document.addEventListener("click", docHandler, true);
      document.addEventListener("keyup", docHandler, true); // por si el toggle es por teclado (space/enter)
      // log para confirmar attach
      // eslint-disable-next-line no-console
      // console.log(
      //   "[list-ordenesA] document listeners attached (change/click/keyup)",
      // );

      // MutationObserver para detectar inyecciones/rehydration del datatable
      try {
        const observeTarget =
          rootEl.value ??
          document.querySelector('[data-component="list-ordenesA"]') ??
          document.body;
        mutationObserver = new MutationObserver((mutations) => {
          // si hay mutaciones, intentar reconstruir selección
          gatherSelectedFromDOM();
          // eslint-disable-next-line no-console
          // console.log("[MutationObserver] mutations:", mutations.length);
        });

        mutationObserver.observe(observeTarget, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["aria-checked", "checked", "data-id", "data-row"],
        });

        // log observer
        // eslint-disable-next-line no-console
        // console.log("[list-ordenesA] MutationObserver attached");
      } catch (err) {
        // eslint-disable-next-line no-console
        // console.warn("[list-ordenesA] MutationObserver failed to attach", err);
      }

      // forzar una primera lectura por si ya hay checkboxes pre-seleccionados
      gatherSelectedFromDOM();

      // arrancar polling cada 1000ms (1s). Cámbialo a 2000 para 2s si lo deseas.
      pollIntervalId = window.setInterval(() => {
        try {
          gatherSelectedFromDOM();
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error("[poll] gatherSelectedFromDOM error", e);
        }
      }, 1000);

      // log para confirmar
      // eslint-disable-next-line no-console
      // console.log("[list-ordenesA] polling started (interval 1000ms)");

      //------------------------END---------------------------//
    });

    onBeforeUnmount(() => {
      window.removeEventListener("carga-confirmada", onCargaConfirmada);

      //-------------------------------APARTADO DE EL DELETE MULTIPLE ------------------------------------//
      try {
        document.removeEventListener("change", docHandler, true);
        document.removeEventListener("click", docHandler, true);
        document.removeEventListener("keyup", docHandler, true);
        // eslint-disable-next-line no-console
        // console.log("[list-ordenesA] document listeners removed");
      } catch (err) {
        // ignore
      }
      try {
        if (mutationObserver) {
          mutationObserver.disconnect();
          mutationObserver = null;
          // eslint-disable-next-line no-console
          // console.log("[list-ordenesA] MutationObserver disconnected");
        }
      } catch (err) {
        // ignore
      }
      if (pollIntervalId) {
        clearInterval(pollIntervalId);
        pollIntervalId = null;
        // eslint-disable-next-line no-console
        // console.log("[list-ordenesA] polling stopped");
      }
      //------------------------END---------------------------//
    });

    function onCargaConfirmada(e: any) {
      loadOrdenes();
    }

    // --- NUEVAS FUNCIONES PARA ELIMINACIÓN MULTIPLE ---
    const confirmDeleteSelected = async () => {
      if (!selectedIds.value || selectedIds.value.length === 0) return;

      const result = await Swal.fire({
        title: `Eliminar ${selectedIds.value.length} elemento(s)`,
        text: "¿Estás seguro? Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        buttonsStyling: false,
        customClass: {
          confirmButton: "btn btn-danger me-3",
          cancelButton: "btn btn-light",
        },
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        await deleteSelectedItems();
      }
    };

    const deleteSelectedItems = async () => {
      if (!selectedIds.value || selectedIds.value.length === 0) return;

      // mostrar loading
      Swal.fire({
        title: "Eliminando elementos...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const idsToDelete = [...selectedIds.value];

        // Intentar eliminar en paralelo cada orden (ajusta si tu API soporta eliminación bulk)
        await Promise.all(idsToDelete.map((id) => api.delete(`/carga/${id}`)));

        Swal.close();

        await Swal.fire({
          text: "Elementos eliminados correctamente",
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "Ok",
          customClass: { confirmButton: "btn btn-primary" },
        });

        // limpiar selección y recargar
        selectedIds.value = [];
        await loadOrdenes();
      } catch (err: any) {
        Swal.close();
        console.error("Error eliminando elementos:", err);
        await Swal.fire({
          text:
            err?.response?.data?.message ||
            err?.message ||
            "Error al eliminar elementos",
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "Ok",
          customClass: { confirmButton: "btn btn-primary" },
        });
      }
    };

    // --- NUEVAS FUNCIONES: abrir modal y pedir prestatarios ---
    function buildPrestatariosParamsFromOrder(order: any) {
      // mapear tipoCarga a lo que espera tu API si es necesario
      const tipoCarga = order.tipo_carga;
      const weight = Number(order.peso_total || order.peso || 0);
      const volume = Number(order.vol_bulto || order.volumen || 0);
      return { tipoCarga, weight, volume };
    }

    async function openPrestatariosModal(order: any) {
      try {
        selectedOrderForPrestatarios.value = order;
        prestatariosLoading.value = true;
        prestatarios.value = [];

        const params = buildPrestatariosParamsFromOrder(order);
        console.log("Parametros de la busqueda", params);

        // Llamada: ajusta path si tu backend usa otro
        const res = await api.get("/prestatario/search", { params });

        console.log("Prestatarios del filtro", res.data);

        // manejar respuesta flexible
        const data = Array.isArray(res.data)
          ? res.data
          : (res.data?.data ?? res.data);
        prestatarios.value = data || [];

        // abrir modal (bootstrap)
        const el = document.getElementById("prestatariosModal");
        if (el) {
          prestatariosModalInstance = new Modal(el);
          prestatariosModalInstance.show();
        }
      } catch (err: any) {
        console.error("Error buscando prestatarios:", err);
        Swal.fire({
          text:
            err?.response?.data?.message ||
            err.message ||
            "Error al buscar prestatarios",
          icon: "error",
        });
      } finally {
        prestatariosLoading.value = false;
      }
    }

    // ejemplo de handler cuando el usuario quiere "seleccionar" un prestatario para proponerle la carga
    // aquí solo mostramos un toast. Si quieres crear una propuesta en backend, invocar un endpoint.
    async function selectPrestatarioForOrder(prestatario: any) {
      try {
        console.log("PRESTATARIO COMPONENTE", prestatario);
        const ok = await Swal.fire({
          title: "Confirmar",
          text: `Proponer la orden a ${prestatario.username || prestatario.name}?`,
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Sí, proponer",
        });
        if (!ok.isConfirmed) return;

        // ejemplo de request: POST /assignments/propose { cargaId, prestatarioId, price? }
        // Ajusta según tu API
        console.log(
          "selectedOrderForPrestatarios",
          selectedOrderForPrestatarios.value,
        );

        await api.post("/proposals", {
          cargaId: selectedOrderForPrestatarios.value.id,
          prestatarioId: prestatario.id,
          message: "...optional",
        });

        await Swal.fire({
          text: "Propuesta enviada correctamente",
          icon: "success",
          confirmButtonText: "Ok",
        });

        // opcional: cerrar modal
        const el = document.getElementById("prestatariosModal");
        if (el) Modal.getInstance(el)?.hide();
      } catch (err: any) {
        console.error("Error proponiendo prestatario:", err);
        Swal.fire({
          text:
            err?.response?.data?.message ||
            err.message ||
            "Error proponiendo prestatario",
          icon: "error",
        });
      }
    }

    // abrir modal con perfil del prestatario (no navega fuera)
    async function viewPrestatarioProfile(p: any) {
      try {
        profileLoading.value = true;
        prestatarioProfile.value = null;

        // si el objeto p ya trae info completa (por ejemplo transportes, ayudantes, etc) úsalo directamente
        const hasFullInfo =
          p &&
          (p.transportes || p.ayudantes || p.cargasEspeciales || p.licencia);
        if (hasFullInfo && p.id && !p._needsFetch) {
          prestatarioProfile.value = p;
        } else {
          // fetch al backend por id
          const id = p.id || p.prestatarioId;
          if (!id) throw new Error("No se encontró id del prestatario");
          const res = await api.get(`/prestatario/${id}`);
          // adaptar respuesta según tu API
          prestatarioProfile.value = res.data?.data ?? res.data;
        }

        const el = document.getElementById("prestatarioProfileModal");
        if (el) {
          if (!prestatarioProfileModalInstance)
            prestatarioProfileModalInstance = new Modal(el);
          prestatarioProfileModalInstance.show();
        }
      } catch (err: any) {
        console.error("Error cargando perfil del prestatario:", err);
        Swal.fire({
          text:
            err?.response?.data?.message ||
            err.message ||
            "Error al cargar perfil",
          icon: "error",
        });
      } finally {
        profileLoading.value = false;
      }
    }

    const onItemSelect = (ids: Array<string>) => {
      console.log(ids);
      selectedIds.value = ids;
    };

    const formatDate = (fechaRegistro?: string) => {
      if (!fechaRegistro) return "No registrada";
      const date = new Date(fechaRegistro);
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    };

    const formatOrderDataForQR = (order: IOrdenesC) => {
      return {
        id: order.order_id,
        remitente: order.remitente_nombre,
        carnet: order.remitente_dni,
        direccion: order.direccion,
        bultos: order.cant_bultos,
        peso: order.peso_total,
        volumen: order.vol_bulto,
        origen: order.origen_string,
        autorizado: order.autorizado_recoger,
        tipoCarga: order.tipo_carga,
        total: order.precio,
        fecha: formatDate(order.fechaRegistro),
        estado: order.estado,
      };
    };

    const getEstadoBadgeClass = (estado?: string) => {
      switch (estado) {
        case "propuestas_pendientes":
          return "badge badge-light-warning";
        case "listo_para_recoger":
          return "badge badge-light-info";
        case "recogido":
          return "badge badge-light-info";
        case "en_transito":
          return "badge badge-light-secondary";
        case "llegado_al_destino":
          return "badge badge-light-primary";
        case "entregado":
          return "badge badge-light-success";
        case "cancelado":
          return "badge badge-light-danger";
        case "'en_reparto_final":
          return "badge badge-light-purple";
        default:
          return "badge badge-light-warning";
      }
    };

    const actualizarPrecio = () => {
      if (selectedOrden.value.peso_total && selectedOrden.value.vol_bulto) {
        // Calcular tarifa base (70 CUP por kg)
        const tarifabase = selectedOrden.value.peso_total * 70;

        // Calcular costo por volumen (100 CUP por m³)
        const volumen = selectedOrden.value.vol_bulto * 100;

        // Calcular impuesto aeroportuario (7.70 CUP por kg)
        const impuesto = selectedOrden.value.peso_total * 7.7;

        // Seleccionar el mayor entre costo por volumen y tarifa base
        const baseParaCalculos = Math.max(tarifabase, volumen);

        // Calcular subtotal (base seleccionada + impuesto)
        const subtotal = baseParaCalculos + impuesto;

        // Calcular comisión del servicio (5% del subtotal)
        const comision = subtotal * 0.05;

        // Actualizar los valores en el objeto
        selectedOrden.value.tarifabase = tarifabase;
        selectedOrden.value.volumen = volumen;
        selectedOrden.value.impuesto = impuesto;
        selectedOrden.value.comision = comision;
        selectedOrden.value.precio = subtotal + comision;
      }
    };

    const tableHeader = ref([
      {
        columnName: "Orden ID",
        columnLabel: "order_id",
        sortEnabled: true,
        columnWidth: 20,
      },

      {
        columnName: "Carnet Identidad",
        columnLabel: "remitente_dni",
        sortEnabled: true,
        columnWidth: 150,
      },
      {
        columnName: "Nombre Remitente",
        columnLabel: "remitente_nombre",
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
        columnLabel: "autorizado_recoger",
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
        columnLabel: "cant_bultos",
        sortEnabled: true,
        columnWidth: 80,
      },
      {
        columnName: "Volumen (m³)",
        columnLabel: "vol_bulto",
        sortEnabled: true,
        columnWidth: 100,
      },
      {
        columnName: "Peso (kg)",
        columnLabel: "peso_total",
        sortEnabled: true,
        columnWidth: 90,
      },
      {
        columnName: "Tipo de Carga",
        columnLabel: "tipo_carga",
        sortEnabled: true,
        columnWidth: 140,
      },
      {
        columnName: "Precio Total",
        columnLabel: "precio",
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

    const deleteOrden = async (id: string) => {
      try {
        // Mostrar confirmación antes de eliminar
        const result = await Swal.fire({
          title: "¿Estás seguro?",
          text: "¡No podrás revertir esta acción!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "Cancelar",
          buttonsStyling: false,
          customClass: {
            confirmButton: "btn btn-danger me-3",
            cancelButton: "btn btn-light",
          },
          reverseButtons: true,
        });

        if (result.isConfirmed) {
          // Lógica para eliminar la orden
          await api.delete(`/carga/${id}`);
          // ordenes.value = ordenes.value.filter(
          //   (orden) => orden.order_id !== id,
          // );

          // Mostrar confirmación de eliminación exitosa
          await Swal.fire({
            text: "¡Orden eliminada exitosamente!",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Ok",
            customClass: {
              confirmButton: "btn btn-primary",
            },
          });

          loadOrdenes();
        }
      } catch (error) {
        // Mostrar error si falla la eliminación
        await Swal.fire({
          text: error.message || "Error al eliminar la orden",
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "Entendido",
          customClass: {
            confirmButton: "btn btn-primary",
          },
        });
      }
    };

    const deleteFewordenes = async () => {
      try {
        // Confirmación para múltiples eliminaciones
        const result = await Swal.fire({
          title: `¿Eliminar ${selectedIds.value.length} órdenes?`,
          text: "Esta acción no se puede deshacer",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "Cancelar",
          buttonsStyling: false,
          customClass: {
            confirmButton: "btn btn-danger me-3",
            cancelButton: "btn btn-light",
          },
          reverseButtons: true,
        });

        if (result.isConfirmed) {
          // Eliminar múltiples órdenes
          await Promise.all(
            selectedIds.value.map((id) => CargaApi.deleteOrden(id)),
          );
          ordenes.value = ordenes.value.filter(
            (orden) => !selectedIds.value.includes(orden.id),
          );
          selectedIds.value = [];

          // Confirmación de éxito
          await Swal.fire({
            text: `¡${selectedIds.value.length} órdenes eliminadas exitosamente!`,
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Ok",
            customClass: {
              confirmButton: "btn btn-primary",
            },
          });
        }
      } catch (error) {
        await Swal.fire({
          text: "Error al eliminar las órdenes seleccionadas",
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "Entendido",
          customClass: {
            confirmButton: "btn btn-primary",
          },
        });
      }
    };

    const selectedOrden = ref<IOrdenesC>({
      id: "",
      order_id: "",
      carga_serie: "",
      remitente_dni: "",
      remitente_nombre: "",
      direccion: "",
      emisor_dni: "",
      emisor_nombre: "",
      emisor_direccion: "",
      estado: "",
      cant_bultos: 0,
      vol_bulto: 0,
      peso_total: 0,
      tipo_carga: "",
      autorizado_recoger: "",
      origen_string: "",
      destino_string: "",
      fechaRegistro: "",
      tarifabase: 0,
      volumen: 0,
      impuesto: 0,
      comision: 0,
      precio: 0,
    });

    const openModal = (orden: IOrdenesC) => {
      selectedOrden.value = {
        ...orden,
        // estado: orden.estado,
        // fechaRegistro: orden.fechaRegistro,
      };
      const modalElement = document.getElementById("kt_modal_1");
      if (modalElement) {
        new Modal(modalElement).show();
      }
    };

    const isEditable = ref(false);

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
        orden.carga_serie || `ORD${orden.order_id.toString().padStart(6, "0")}`;

      // Configuración inicial
      doc.setProperties({
        title: `Factura Orden ${orden.order_id}`,
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
          ["Nombre del Emisor", orden.emisor_nombre],
          ["Carnet de Identidad", orden.emisor_dni],
          ["Direccion", orden.emisor_direccion],
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
          ["Nombre del Remitente", orden.remitente_nombre],
          ["Carnet de Identidad", orden.remitente_dni],
          ["Direccion", orden.direccion],
          [
            "Autorizado a recoger",
            orden.autorizado_recoger || "No especificado",
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
          ["Origen", orden.origen_string],
          ["Destino", orden.destino_string],
          ["Bultos", orden.cant_bultos],
          ["Volumen", `${orden.vol_bulto?.toFixed(2) || "0.00"} m³`],
          ["Peso Total", `${orden.peso_total} kg`],
          ["Tipo de Carga", orden.tipo_carga],
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
          ["Tarifa Base (70 CUP/kg)", orden.tarifabase?.toFixed(2) || "0.00"],
          [
            "Costo por Volumen (100 CUP/m³)",
            orden.volumen?.toFixed(2) || "0.00",
          ],
          [
            "Impuesto Aeroportuario (7.70 CUP/kg)",
            orden.impuesto?.toFixed(2) || "0.00",
          ],
          ["Comisión del Servicio (5%)", orden.comision?.toFixed(2) || "0.00"],
          ["TOTAL A PAGAR", orden.precio.toFixed(2)],
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
        `Factura_SysCargo_${orden.carga_serie || `ORD${orden.order_id.toString().padStart(6, "0")}`}.pdf`,
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

    //-----------------------APARTADO DE EL DELETE MULTIPLE --------------//
    // --- colocarlo junto a otros refs en setup() ---
    const rootEl = ref<HTMLElement | null>(null);
    let docHandler: (e: Event) => void;
    let mutationObserver: MutationObserver | null = null;
    // junto a: const rootEl = ref<HTMLElement | null>(null);
    let pollIntervalId: number | null = null;

    // función que intenta reconstruir selectedIds leyendo el DOM (robusta)
    // Reemplaza tu gatherSelectedFromDOM actual por esta versión
    const gatherSelectedFromDOM = () => {
      try {
        const compSelector = '[data-component="list-ordenesA"]';
        const container =
          rootEl.value ?? document.querySelector(compSelector) ?? document.body;

        // Buscar el contenedor del datatable dentro del componente (fallbacks)
        const datatable =
          container.querySelector(".kt-datatable") ||
          container.querySelector("[data-kt-datatable]") ||
          container.querySelector("table") ||
          container.querySelector(".datatable") ||
          container;

        // seleccionar solo los checkboxes/toggles marcados dentro del datatable
        const checkedNodes = Array.from(
          datatable.querySelectorAll<HTMLInputElement | Element>(
            "input[type='checkbox']:checked, [role='checkbox'][aria-checked='true'], [aria-checked='true']",
          ),
        );

        const collectedIds: string[] = [];

        checkedNodes.forEach((node) => {
          // ignorar los que estén dentro de thead (checkbox de "select all" generalmente)
          if (node.closest && node.closest("thead")) {
            return;
          }

          // tratar node como input cuando sea posible
          const input = node as HTMLInputElement;

          // 1) si el input tiene value útil (no 'on') -> usarlo
          if ((input as any).value && (input as any).value !== "on") {
            collectedIds.push(String((input as any).value));
            return;
          }

          // 2) data-id / dataset.id
          if ((input as any).dataset && (input as any).dataset.id) {
            collectedIds.push(String((input as any).dataset.id));
            return;
          }
          if (input.getAttribute && input.getAttribute("data-id")) {
            collectedIds.push(String(input.getAttribute("data-id")));
            return;
          }

          // 3) buscar tr padre con atributos que contengan id
          const tr = input.closest ? input.closest("tr") : null;
          if (tr) {
            // revisar varios atributos comunes
            const attrCandidates = [
              tr.getAttribute("data-id"),
              tr.getAttribute("data-row-id"),
              tr.getAttribute("data-row"),
              tr.getAttribute("id"),
              (tr as any).dataset?.id,
            ].filter(Boolean);

            // si data-row existe y es JSON, intentar parsear id de ahí
            const dataRowAttr = tr.getAttribute("data-row");
            if (dataRowAttr) {
              try {
                const parsed = JSON.parse(dataRowAttr);
                if (parsed?.id) {
                  collectedIds.push(String(parsed.id));
                  return;
                }
              } catch {
                // no JSON, continuar con attrs encontrados
              }
            }

            if (attrCandidates.length) {
              collectedIds.push(String(attrCandidates[0]));
              return;
            }
          }

          // 4) fallback: buscar cerca algún elemento con data-row-id/data-id
          const nearestWithId =
            input.closest?.("[data-row-id]") ??
            input.closest?.("[data-id]") ??
            input.closest?.("[data-row]");
          if (nearestWithId) {
            const val =
              (nearestWithId as HTMLElement).getAttribute("data-row-id") ??
              (nearestWithId as HTMLElement).getAttribute("data-id") ??
              (nearestWithId as HTMLElement).getAttribute("data-row");
            if (val) {
              // si es JSON en data-row, parsear:
              if (val.trim().startsWith("{")) {
                try {
                  const parsed = JSON.parse(val);
                  if (parsed?.id) {
                    collectedIds.push(String(parsed.id));
                    return;
                  }
                } catch {}
              } else {
                collectedIds.push(String(val));
                return;
              }
            }
          }
        });

        // dedupe y asignar
        const unique = Array.from(new Set(collectedIds))
          .filter(Boolean)
          .map(String);
        selectedIds.value = unique;
      } catch (err) {}
    };

    // handler que se registra globalmente (captura)
    docHandler = (e: Event) => {
      try {
        const target = e.target as Element | null;
        if (!target) return;

        // filtrar: sólo si el target está dentro de nuestro componente marcado
        if (
          !target.closest ||
          !target.closest('[data-component="list-ordenesA"]')
        )
          return;

        // si es un checkbox, role=checkbox o tiene aria-checked -> reconstruir selección
        const isInputCheckbox =
          target instanceof HTMLInputElement && target.type === "checkbox";
        const isRoleCheckbox =
          target.getAttribute && target.getAttribute("role") === "checkbox";
        const hasAriaChecked =
          target.getAttribute && target.getAttribute("aria-checked") !== null;

        if (isInputCheckbox || isRoleCheckbox || hasAriaChecked) {
          // small debounce: si necesitas, puedes acumular; aquí llamamos directo
          gatherSelectedFromDOM();
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("[docHandler] error", err);
      }
    };
    //------------------END---------------//

    return {
      tableHeader,
      ordenes,
      search,
      selectedOrden,
      loading,
      isEditable,
      selectedIds,
      totalWeight,
      selectedState,
      onItemSelect,
      sort,
      deleteOrden,
      deleteFewordenes,
      openModal,

      searchItems,
      getRowClass,
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
      actionButton,
      actionMenu,
      openPrestatariosModal,
      selectPrestatarioForOrder,
      viewPrestatarioProfile,
      prestatarioProfile,
      profileLoading,
      prestatarios,
      prestatariosLoading,
      items,
      comprobantes,
      comprobantesLoading,
      comprobantesModalRef,
      openComprobantesModal,
      downloadImage,

      //
      editOrdenModalEl,
      selectedOrdenForEdit,
      openEditOrdenModal,
      hideEditOrdenModal,
      onEditSaved,
      onEditCancel,
      formKey,

      confirmDeleteSelected,
      deleteSelectedItems,
    };
  },
});
</script>

<style scoped>
.selected-row {
  /*background-color: rgba(13, 110, 253, 0.1) !important;  azul claro */
  transition: background-color 0.3s ease;
  display: none !important;
}

/* visual accent: "cinquillo" verde en la izquierda */
.delivered-border,
tbody > tr.delivered-border,
.kt-datatable tr.delivered-border {
  box-shadow: inset 6px 0 0 0 #198754; /* cinta verde izquierda */
  background-color: #f6fff7; /* fondo suave verde */
  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.delivered-border {
  box-shadow: inset 6px 0 0 0 #198754 !important; /* cinta verde izquierda */
  background-color: #f6fff7; /* fondo suave verde */
  display: none;
  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

/* caso donde KTDatatable ponga la clase en un wrapper .datatable-row o .row */
.datatable-row.delivered-border,
.row.delivered-border,
.k-table-row.delivered-border {
  box-shadow: inset 6px 0 0 0 #198754;
  background-color: #f6fff7;
}

/* Badge extra (opcional) */
.badge-delivered {
  background-color: #198754 !important;
  color: #fff !important;
}
</style>
