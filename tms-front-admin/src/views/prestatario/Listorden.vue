<template>
  <div class="container-fluid">
    <div class="card">
      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
        <!-- título para lectores de pantalla, oculto visualmente -->
        <h5 class="mb-0 visually-hidden">Propuestas recibidas</h5>

        <!-- Contenedor principal de controles: ocupa todo el espacio restante -->
        <div class="header-controls d-flex gap-2 align-items-center w-100">
          <!-- input a la izquierda (crece) -->
          <div class="ctrl-search me-2">
            <input
              v-model="search"
              @input="debouncedFetch"
              class="form-control form-control-solid search-input"
              placeholder="Buscar por order id, cliente, estado..."
              aria-label="Buscar propuestas"
            />
          </div>

          <!-- selects a la derecha: empaquetados en un small-controls para alineación -->
          <div class="small-controls d-flex gap-2 align-items-center">
            <select
              v-model="filters.status"
              @change="fetchProposals"
              class="form-select select-control"
              aria-label="Filtrar por estado"
            >
              <option value="">Todos</option>
              <option value="pending">Pendientes</option>
              <option value="accepted">Aceptadas</option>
              <option value="confirmed">Confirmadas</option>
              <option value="rejected">Rechazadas</option>
              <option value="cancelled">Canceladas</option>
            </select>

            <select
              v-model.number="perPage"
              @change="onItemsPerPageChange"
              class="form-select select-control"
              aria-label="Items por página"
            >
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="card-body">
      <div v-if="loading" class="p-4 text-center">
        <div class="spinner-border" role="status"></div>
      </div>

      <div v-else>
        <!-- KTDatatable integration -->
        <KTDatatable
          :header="tableHeader"
          :data="datatableRows"
          @on-sort="onKTSort"
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
          <!-- Ejemplos de slots importantes (añade más según necesites) -->
          <template v-slot:order_id="{ row }">{{ row.order_id }}</template>

          <template v-slot:estado="{ row }">
            <span :class="badgeClass(row.estado)">{{ row.estado }}</span>
            <div v-if="row.carga_estado" class="small text-muted">
              (Carga: {{ humanStatus(row.carga_estado) }})
            </div>
          </template>
          <template v-slot:fechaRegistro="{ row }">{{
            formatDate(row.fechaRegistro)
          }}</template>
          <template v-slot:cliente="{ row }">
            {{ row.cliente }}
          </template>
          <template v-slot:precio="{ row }"
            >{{ Number(row.precio || 0).toFixed(2) }} CUP</template
          >

          <!-- actions: usa row.__raw para llamar a tus handlers con el objeto Proposal completo -->
          <template v-slot:actions="{ row }">
            <div class="dropdown">
              <button
                class="btn btn-sm btn-light dropdown-toggle"
                type="button"
                :id="`dropdown-${row.id}`"
                @click.stop.prevent="openActions($event, row)"
                aria-expanded="false"
              >
                Acciones
              </button>

              <div
                class="dropdown-menu dropdown-menu-end actions-popup"
                :aria-labelledby="`dropdown-${row.id}`"
                ref="menu"
              >
                <!-- Ver -->
                <button
                  class="dropdown-item action-item btn-primary"
                  @click="onDropdownAction('view', row.__raw, $event)"
                >
                  Ver
                </button>

                <!-- PRESTATARIO: Aceptar / Rechazar (si pending) -->
                <button
                  v-if="isPrestatario() && row.__raw?.status === 'pending'"
                  class="dropdown-item action-item btn-success"
                  @click="onDropdownAction('accept', row.__raw, $event)"
                >
                  Aceptar
                </button>
                <button
                  v-if="isPrestatario() && row.__raw?.status === 'pending'"
                  class="dropdown-item action-item btn-danger"
                  @click="onDropdownAction('reject', row.__raw, $event)"
                >
                  Rechazar
                </button>

                <!-- Confirmar asignación (si procede) -->
                <button
                  v-if="canConfirmAssignment(row.__raw)"
                  class="dropdown-item action-item btn-primary"
                  @click="onDropdownAction('confirmAssign', row.__raw, $event)"
                >
                  Confirmar asignación
                </button>

                <!-- Generar documentos (prestatario + confirmed) -->
                <button
                  v-if="
                    isPrestatario() &&
                    row.__raw?.status === 'confirmed' &&
                    row.__raw?.carga
                  "
                  class="dropdown-item action-item btn-secondary"
                  @click="onDropdownAction('generateCarta', row.__raw, $event)"
                >
                  Generar Carta Porte
                </button>
                <button
                  v-if="
                    isPrestatario() &&
                    row.__raw?.status === 'confirmed' &&
                    row.__raw?.carga
                  "
                  class="dropdown-item action-item btn-secondary"
                  @click="onDropdownAction('generateHoja', row.__raw, $event)"
                >
                  Generar Hoja de Ruta
                </button>

                <!-- BOTON: Estado siguiente (solo UNO) -->
                <button
                  v-if="shouldShowNextBtn(row.__raw)"
                  class="dropdown-item action-item btn-success"
                  @click="onDropdownAction('nextState', row.__raw, $event)"
                >
                  {{ nextStateLabel(row.__raw?.carga?.estado) }}
                </button>

                <!-- Reprogramar / Cancelar (si la carga existe y no está finalizada) -->
                <button
                  v-if="
                    row.__raw?.carga &&
                    !isDelivered(row.__raw?.carga) &&
                    !isCanceled(row.__raw?.carga)
                  "
                  class="dropdown-item action-item btn-warning"
                  @click="onDropdownAction('reprogram', row.__raw, $event)"
                >
                  Reprogramar
                </button>

                <button
                  v-if="
                    row.__raw?.carga &&
                    !isDelivered(row.__raw?.carga) &&
                    !isCanceled(row.__raw?.carga)
                  "
                  class="dropdown-item action-item btn-danger"
                  @click="onDropdownAction('cancel', row.__raw, $event)"
                >
                  Cancelar
                </button>

                <!-- Marcar entregada: solo si EL SIGUIENTE ESTADO es "entregado" -->
                <button
                  v-if="
                    row.__raw?.carga &&
                    nextState(row.__raw?.carga?.estado) === 'entregado'
                  "
                  class="dropdown-item action-item btn-success"
                  @click="onDropdownAction('deliver', row.__raw, $event)"
                >
                  Marcar entregada (POD)
                </button>
              </div>
            </div>
          </template>
        </KTDatatable>

        <!-- Footer (información básica de paginado) -->
        <div
          class="card-footer d-flex justify-content-between align-items-center mt-3"
        >
          <div>
            Mostrando {{ offset + 1 }} -
            {{ Math.min(offset + proposals.length, total) }} de {{ total }}
          </div>
          <div class="d-flex gap-2 align-items-center">
            <button
              class="btn btn-sm btn-light"
              :disabled="offset === 0"
              @click="prevPage"
            >
              Anterior
            </button>
            <button
              class="btn btn-sm btn-light"
              :disabled="offset + perPage >= total"
              @click="nextPage"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal detalle proposal (igual que antes) -->
  <div
    class="modal fade"
    id="proposalDetailModal"
    tabindex="-1"
    aria-hidden="true"
    ref="detailModalRef"
  >
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Detalle de la propuesta</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body" v-if="selectedProposal">
          <div class="mb-3">
            <strong>Estado:</strong>
            <span :class="badgeClass(selectedProposal.status)">{{
              selectedProposal.status
            }}</span>
            <div v-if="selectedProposal.carga?.estado" class="small text-muted">
              Estado carga: {{ humanStatus(selectedProposal.carga.status) }}
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <h6>Carga</h6>
              <ul class="list-unstyled">
                <li>
                  <strong>Order ID:</strong>
                  {{ selectedProposal.carga?.order_id }}
                </li>
                <li>
                  <strong>Remitente:</strong>
                  {{ selectedProposal.carga?.remitente_nombre }} ({{
                    selectedProposal.carga?.remitente_dni
                  }})
                </li>
                <li>
                  <strong>Emisor:</strong>
                  {{ selectedProposal.carga?.emisor_nombre }}
                </li>
                <li>
                  <strong>Peso total:</strong>
                  {{ selectedProposal.carga?.peso_total }} kg
                </li>
                <li>
                  <strong>Volumen:</strong>
                  {{
                    selectedProposal.carga?.volumen ??
                    selectedProposal.carga?.vol_bulto
                  }}
                  m³
                </li>
                <li>
                  <strong>Precio:</strong>
                  {{ formatMoney(selectedProposal.carga?.precio ?? 0) }}
                </li>
                <li>
                  <strong>Origen → Destino:</strong>
                  {{ selectedProposal.carga?.origen_string }} →
                  {{ selectedProposal.carga?.destino_string }}
                </li>
              </ul>
            </div>

            <div class="col-md-6">
              <h6>Proposer / Cliente</h6>
              <ul class="list-unstyled">
                <li>
                  <strong>Nombre:</strong>
                  {{
                    selectedProposal.proposer?.name ??
                    selectedProposal.proposer?.username
                  }}
                </li>
                <li>
                  <strong>Teléfono:</strong>
                  {{ selectedProposal.proposer?.phone ?? "-" }}
                </li>
                <li>
                  <strong>Email:</strong>
                  {{ selectedProposal.proposer?.email ?? "-" }}
                </li>
              </ul>
              <hr />
              <div class="mt-3">
                <h6>Mensaje / Notas</h6>
                <p>{{ selectedProposal.message ?? "-" }}</p>
              </div>
            </div>
          </div>

          <!-- Mostrar datos de vehículo si existen -->
          <div v-if="selectedProposal.assignedVehicle" class="mt-3">
            <h6>Vehículo asignado</h6>
            <table class="table table-sm">
              <tbody>
                <tr>
                  <th>Vehículo perteneciente a</th>
                  <td>
                    {{
                      selectedProposal.assignedVehicle.vehiculo_pertenece_a ||
                      "-"
                    }}
                  </td>
                </tr>
                <tr>
                  <th>Conducido por</th>
                  <td>
                    {{ selectedProposal.assignedVehicle.conducido_por || "-" }}
                  </td>
                </tr>
                <tr>
                  <th>Chapa No.</th>
                  <td>
                    {{ selectedProposal.assignedVehicle.chapa_no || "-" }}
                  </td>
                </tr>
                <tr>
                  <th>LOT No.</th>
                  <td>{{ selectedProposal.assignedVehicle.lot_no || "-" }}</td>
                </tr>
                <tr>
                  <th>Hoja Ruta No.</th>
                  <td>
                    {{ selectedProposal.assignedVehicle.hoja_ruta_no || "-" }}
                  </td>
                </tr>
                <tr>
                  <th>Chapa Tractivo No.</th>
                  <td>
                    {{
                      selectedProposal.assignedVehicle.chapa_tractivo_no || "-"
                    }}
                  </td>
                </tr>
                <tr>
                  <th>Remolque No.</th>
                  <td>
                    {{ selectedProposal.assignedVehicle.remolque_no || "-" }}
                  </td>
                </tr>
                <tr>
                  <th>Carta Porte No.</th>
                  <td>
                    {{ selectedProposal.assignedVehicle.carta_porte_no || "-" }}
                  </td>
                </tr>
                <tr>
                  <th>Carné Identidad Conductor</th>
                  <td>
                    {{
                      selectedProposal.assignedVehicle
                        .carne_identidad_conductor || "-"
                    }}
                  </td>
                </tr>
                <tr>
                  <th>Licencia de Conducción No.</th>
                  <td>
                    {{
                      selectedProposal.assignedVehicle.licencia_conduccion_no ||
                      "-"
                    }}
                  </td>
                </tr>
                <tr>
                  <th>Basificado en</th>
                  <td>
                    {{ selectedProposal.assignedVehicle.basificado_en || "-" }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="modal-footer">
          <!-- Prestatario: aceptar/rechazar -->
          <template
            v-if="
              selectedProposal &&
              isPrestatario() &&
              selectedProposal.status === 'pending'
            "
          >
            <!-- ahora abre modal de vehículo -->
            <button
              class="btn btn-success"
              @click="openAcceptModal(selectedProposal)"
            >
              Aceptar
            </button>
            <button
              class="btn btn-danger"
              @click="confirmAction(selectedProposal, 'rejected')"
            >
              Rechazar
            </button>
          </template>

          <!-- Proposer/Admin: confirmar asignación si está accepted -->
          <template
            v-if="selectedProposal && canConfirmAssignment(selectedProposal)"
          >
            <button
              class="btn btn-primary"
              v-if="selectedProposal.status === 'accepted'"
              @click="confirmAssignmentFromList(selectedProposal)"
            >
              Confirmar asignación
            </button>
          </template>

          <button type="button" class="btn btn-light" data-bs-dismiss="modal">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- ========== Modal: Aceptar y especificar vehículo (NEW) ========== -->
  <div
    class="modal fade"
    id="acceptVehicleModal"
    tabindex="-1"
    aria-hidden="true"
    ref="acceptVehicleModalRef"
  >
    <div
      class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable"
    >
      <div class="modal-content">
        <form @submit.prevent="submitAcceptWithVehicle">
          <div class="modal-header">
            <h5 class="modal-title">Aceptar propuesta — Datos del vehículo</h5>
            <button
              type="button"
              class="btn-close"
              @click="hideAcceptModal"
            ></button>
          </div>

          <div class="modal-body">
            <div v-if="acceptLoading" class="text-center py-3">
              <div class="spinner-border" role="status"></div>
            </div>

            <div v-else>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label required"
                    >Vehículo perteneciente a</label
                  >
                  <input
                    v-model="acceptVehicleForm.vehiculo_pertenece_a"
                    class="form-control"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label required">Conducido por</label>
                  <input
                    v-model="acceptVehicleForm.conducido_por"
                    class="form-control"
                    required
                  />
                </div>

                <div class="col-md-4">
                  <label class="form-label">Chapa No.</label>
                  <input
                    v-model="acceptVehicleForm.chapa_no"
                    class="form-control"
                  />
                </div>
                <div class="col-md-4">
                  <label class="form-label">LOT No.</label>
                  <input
                    v-model="acceptVehicleForm.lot_no"
                    class="form-control"
                  />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Hoja Ruta No.</label>
                  <input
                    v-model="acceptVehicleForm.hoja_ruta_no"
                    class="form-control"
                  />
                </div>

                <div class="col-md-4">
                  <label class="form-label">Chapa Tractivo No.</label>
                  <input
                    v-model="acceptVehicleForm.chapa_tractivo_no"
                    class="form-control"
                  />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Remolque No.</label>
                  <input
                    v-model="acceptVehicleForm.remolque_no"
                    class="form-control"
                  />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Carta Porte No.</label>
                  <input
                    v-model="acceptVehicleForm.carta_porte_no"
                    class="form-control"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label">Carné Identidad Conductor</label>
                  <input
                    v-model="acceptVehicleForm.carne_identidad_conductor"
                    class="form-control"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Licencia de Conducción No.</label>
                  <input
                    v-model="acceptVehicleForm.licencia_conduccion_no"
                    class="form-control"
                  />
                </div>

                <div class="col-12">
                  <label class="form-label">Basificado en</label>
                  <input
                    v-model="acceptVehicleForm.basificado_en"
                    class="form-control"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-light"
              @click="hideAcceptModal"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="btn btn-success"
              :disabled="acceptLoading"
            >
              <span
                v-if="acceptLoading"
                class="spinner-border spinner-border-sm me-2"
                role="status"
              ></span>
              Enviar y aceptar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  nextTick,
  onUnmounted,
  reactive,
} from "vue";
import SingleImageInput from "@/components/SingleImageInput.vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import api from "@/services/api";
import Swal from "sweetalert2";
import { Modal, Dropdown } from "bootstrap";
import { useAuthStore } from "@/stores/auth";
import debounce from "lodash/debounce";
import { useCookies } from "vue3-cookies";
import { generateCartaPorteTerrestrePdf } from "@/utils/cartaPorteTerrestrePdf";
import { generateCartaPorteFerroviarioPdf } from "@/utils/cartaPorteFerroviarioPdf";
import { useRouter } from "vue-router";

interface Proposal {
  id: string;
  status: string;
  carga?: {
    id: string;
    estado?: string;
    order_id?: string;
    precio?: number;
    cliente?: any;
    [k: string]: any;
  };
  proposer?: any;
  createdAt?: string;
  message?: string;
  assignedVehicle?: any;
}

export default defineComponent({
  name: "ListProposals",
  components: { SingleImageInput, KTDatatable },
  setup() {
    const auth = useAuthStore();
    const proposals = ref<Proposal[]>([]);
    const total = ref<number>(0);
    const loading = ref(false);
    const { cookies } = useCookies();
    const router = useRouter();

    const cookieUser = ref<any>(null);

    const generatedMap = reactive<Record<string, boolean>>({});
    const generatingId = ref<string | null>(null);
    const perPage = ref<number>(25);
    const offset = ref<number>(0);
    const search = ref<string>("");
    const sort = ref<{ field?: string; order?: "asc" | "desc" }>({
      field: "createdAt",
      order: "desc",
    });
    const filters = ref<{ status?: string }>({ status: "" });

    const selectedProposal = ref<Proposal | null>(null);
    const detailModalRef = ref<HTMLElement | null>(null);
    let detailModalInstance: InstanceType<typeof Modal> | null = null;

    // Accept vehicle modal refs & state
    const acceptVehicleModalRef = ref<HTMLElement | null>(null);
    let acceptVehicleModalInstance: InstanceType<typeof Modal> | null = null;
    const acceptVehicleForm = reactive<any>({
      vehiculo_pertenece_a: "",
      conducido_por: "",
      chapa_no: "",
      lot_no: "",
      hoja_ruta_no: "",
      chapa_tractivo_no: "",
      remolque_no: "",
      carta_porte_no: "",
      carne_identidad_conductor: "",
      licencia_conduccion_no: "",
      basificado_en: "",
    });
    const acceptLoading = ref(false);
    const currentAcceptProposalId = ref<string | null>(null);

    // variable para la instancia abierta actualmente (solo una a la vez)
    let openDropdownInstance: InstanceType<typeof Dropdown> | null = null;
    let openDropdownToggleEl: HTMLElement | null = null;

    function openActions(event: Event, row: any) {
      if (!event || !(event instanceof Event)) return;
      const toggle = (event.currentTarget ??
        event.target) as HTMLElement | null;
      if (!toggle) return;

      // cerrar inst previa si existe y es distinta
      try {
        if (
          openDropdownInstance &&
          openDropdownToggleEl &&
          openDropdownToggleEl !== toggle
        ) {
          openDropdownInstance.hide();
          openDropdownInstance.dispose();
          openDropdownInstance = null;
          openDropdownToggleEl = null;
        }
      } catch (e) {
        // ignore
      }

      // crear nueva instancia Popper/Dropdown con popperConfig y strategy fixed
      try {
        // si ya existe y es la misma toggle -> toggle (si está abierto lo cerrará)
        if (openDropdownInstance && openDropdownToggleEl === toggle) {
          // toggle: si está visible lo oculta, si no lo muestra
          // no usamos toggle() porque queremos forzar posicionamiento; comprobamos aria-expanded
          const expanded = toggle.getAttribute("aria-expanded") === "true";
          if (expanded) {
            openDropdownInstance.hide();
            openDropdownInstance.dispose();
            openDropdownInstance = null;
            openDropdownToggleEl = null;
            return;
          } else {
            // mostrar usando la misma instancia
            openDropdownInstance.show();
            return;
          }
        }

        // Crear nueva instancia con popperConfig
        // Crear nueva instancia con popperConfig (use absolute strategy y adaptive computeStyles)
        const dd = new Dropdown(toggle, {
          popperConfig: {
            placement: "bottom-end",
            strategy: "absolute", // <-- antes usabas "fixed", cambiamos a "absolute"
            modifiers: [
              { name: "offset", options: { offset: [0, 8] } },
              { name: "preventOverflow", options: { boundary: document.body } },
              {
                name: "flip",
                options: {
                  fallbackPlacements: ["top", "bottom", "right", "left"],
                },
              },
              // permitir estilos adaptativos para que Popper ajuste la posición con más precisión
              { name: "computeStyles", options: { adaptive: true } },
            ],
          },
        });

        // guardar instancia y mostrar
        openDropdownInstance = dd as InstanceType<typeof Dropdown>;
        openDropdownToggleEl = toggle;
        openDropdownInstance.show();
      } catch (err) {
        console.warn("openActions err:", err);
      }
    }

    function closeOpenDropdown() {
      try {
        if (openDropdownInstance) {
          openDropdownInstance.hide();
          openDropdownInstance.dispose();
        }
      } catch (e) {}
      openDropdownInstance = null;
      openDropdownToggleEl = null;
    }

    function handleDocumentClick(e: MouseEvent) {
      try {
        const target = e.target as Node | null;
        if (!openDropdownToggleEl || !openDropdownInstance) return;

        // si el click está dentro del toggle o dentro del menú actual, no cerramos
        const dropdownRoot = openDropdownToggleEl.closest(".dropdown");
        if (dropdownRoot && dropdownRoot.contains(target)) return;

        // si click fuera -> cerrar
        closeOpenDropdown();
      } catch (err) {
        // ignore
      }
    }

    /**
     * Acción elegida en el dropdown.
     * Cierra dropdown y delega a tus handlers existentes.
     */
    async function onDropdownAction(action: string, p: any, event?: Event) {
      // cerrar visualmente el dropdown abierto
      try {
        closeOpenDropdown();
      } catch (e) {}

      try {
        switch (action) {
          case "view":
            openDetail(p);
            break;
          case "accept":
            await confirmAction(p, "accepted");
            break;
          case "reject":
            await confirmAction(p, "rejected");
            break;
          case "confirmAssign":
            await confirmAssignmentFromList(p);
            break;
          case "generateCarta":
            await handleGenerateCarta(p);
            break;
          case "generateHoja":
            await handleGenerateHojaRuta(p);
            break;
          case "nextState":
            await handleNextState(p);
            break;
          case "reprogram":
            openReprogramModal(p);
            break;
          case "cancel":
            openCancelModal(p);
            break;
          case "deliver":
            openDeliverModal(p);
            break;
          default:
            console.warn("Acción desconocida:", action);
        }
      } catch (err) {
        console.error("Error ejecutando acción:", action, err);
      }
    }

    /**
     * Cierra el dropdown (Bootstrap) que contiene el elemento evento.
     * Uso: llamarlo al principio de cualquier handler de acción que se dispare desde el dropdown.
     */
    function closeBootstrapDropdown(event?: Event) {
      try {
        const el = (event?.currentTarget ??
          event?.target) as HTMLElement | null;
        if (!el) return;
        // buscamos el toggle dentro del elemento .dropdown más cercano
        const dropdownRoot = el.closest(".dropdown");
        if (!dropdownRoot) return;
        const toggle = dropdownRoot.querySelector(
          ".dropdown-toggle",
        ) as HTMLElement | null;
        if (!toggle) return;
        const inst = (Dropdown as any).getInstance
          ? (Dropdown as any).getInstance(toggle)
          : null;
        if (inst) {
          inst.hide();
        } else {
          // crear instancia temporal y cerrarla
          const tmp = new Dropdown(toggle);
          tmp.hide();
        }
      } catch (err) {
        // no romper si falla
        console.warn("closeBootstrapDropdown error:", err);
      }
    }

    /**
     * Abrir modal de aceptar con vehículo.
     * p puede venir como objeto proposal
     */
    async function openAcceptModal(p: Proposal) {
      if (!p || !p.id) return;
      // rellenar el formulario si ya existe assignedVehicle (edición)
      currentAcceptProposalId.value = p.id;
      const vehicle = (p as any).assignedVehicle ?? (p as any).vehicle ?? null;
      if (vehicle) {
        Object.assign(acceptVehicleForm, vehicle);
      } else {
        // limpiar form
        Object.keys(acceptVehicleForm).forEach(
          (k) => (acceptVehicleForm[k] = ""),
        );
      }

      await nextTick();
      const el =
        acceptVehicleModalRef.value ??
        (document.getElementById("acceptVehicleModal") as HTMLElement | null);
      if (!el) {
        console.warn("No se encontró el elemento modal #acceptVehicleModal");
        return;
      }
      try {
        acceptVehicleModalInstance = Modal.getInstance(el) ?? new Modal(el);
      } catch (e) {
        acceptVehicleModalInstance = new Modal(el);
      }
      acceptVehicleModalInstance.show();
    }

    function hideAcceptModal() {
      try {
        if (acceptVehicleModalInstance) acceptVehicleModalInstance.hide();
        else {
          const el =
            acceptVehicleModalRef.value ??
            document.getElementById("acceptVehicleModal");
          const inst = el ? Modal.getInstance(el as Element) : null;
          inst?.hide();
        }
      } catch (e) {
        // ignore
      } finally {
        currentAcceptProposalId.value = null;
      }
    }

    async function submitAcceptWithVehicle() {
      if (!currentAcceptProposalId.value) {
        Swal.fire("Error", "No se encontró la propuesta seleccionada", "error");
        return;
      }

      // validación mínima: campos requeridos
      if (
        !acceptVehicleForm.vehiculo_pertenece_a ||
        !acceptVehicleForm.conducido_por
      ) {
        Swal.fire(
          "Atención",
          "Completa al menos 'Vehículo perteneciente a' y 'Conducido por'",
          "warning",
        );
        return;
      }

      acceptLoading.value = true;
      try {
        const body: any = {
          status: "accepted",
          vehicle: { ...acceptVehicleForm },
        };

        await api.put(
          `/proposals/${currentAcceptProposalId.value}/status`,
          body,
        );

        hideAcceptModal();

        // refrescar lista y detalle
        await fetchProposals();
        if (
          selectedProposal.value &&
          selectedProposal.value.id === currentAcceptProposalId.value
        ) {
          selectedProposal.value = null;
          const el = document.getElementById("proposalDetailModal");
          const inst = el ? Modal.getInstance(el as Element) : null;
          inst?.hide();
        }

        Swal.fire(
          "Ok",
          "Propuesta aceptada y datos del vehículo enviados",
          "success",
        );
      } catch (err: any) {
        console.error("Error aceptando con vehículo:", err);
        Swal.fire(
          "Error",
          err?.response?.data?.message ||
            err?.message ||
            "No se pudo aceptar la propuesta",
          "error",
        );
      } finally {
        acceptLoading.value = false;
      }
    }

    const ktHeader = computed(() =>
      tableHeader.value.map((c: any) => ({
        key: c.columnLabel,
        title: c.columnName,
        sortable: !!c.sortEnabled,
        width: c.columnWidth,
      })),
    );
    const reprogRef = ref<HTMLElement | null>(null);
    const cancelRef = ref<HTMLElement | null>(null);
    const deliverRef = ref<HTMLElement | null>(null);
    const datatableRows = ref<any[]>([]);

    const modal = ref<any>({
      currentProposalId: null,
      reprogram: { reason: "", date: "" },
      cancel: { reason: "" },
      deliver: { signed: false, dniFrontBase64: null, dniBackBase64: null },
    });

    // KTDatatable helpers
    // nueva definición semántica
    const tableHeader = ref([
      {
        columnName: "Fecha",
        columnLabel: "fechaRegistro",
        sortEnabled: true,
      },
      {
        columnName: "Order ID",
        columnLabel: "order_id",
        sortEnabled: true,
      },
      {
        columnName: "Cliente",
        columnLabel: "cliente",
        sortEnabled: false,
      },
      {
        columnName: "Precio",
        columnLabel: "precio",
        sortEnabled: false,
      },
      {
        columnName: "Estado",
        columnLabel: "estado",
        sortEnabled: false,
      },
      {
        columnName: "Acciones",
        columnLabel: "actions",
        sortEnabled: false,
        columnWidth: 200,
      },
    ]);

    const fetchLock = ref(false);
    const selectedIds = ref<string[]>([]);
    // evita procesar eventos del datatable hasta que la primera carga termine
    const suppressDatatableEvents = ref(true);

    // contador para debug (opcional)
    const fetchCounter = ref(0);

    function getRowClass(row: any) {
      const raw = row?.__raw ?? row;
      if (!raw) return "";
      if (raw.carga?.estado === "entregado") return "custom";
      if (raw.carga?.estado === "cancelado") return "cancelado-row";
      return "";
    }

    function onItemSelect(items: any) {
      // no provocamos fetch aquí; solo sincronizamos selección
      if (suppressDatatableEvents.value) {
        // guardamos selection pero no disparamos fetch
        selectedIds.value = Array.isArray(items)
          ? items.map((i: any) => i.id ?? i)
          : [];
        return;
      }
      selectedIds.value = Array.isArray(items)
        ? items.map((i: any) => i.id ?? i)
        : [];
      // si necesitas que la selección dispare una acción, hazlo explícitamente aquí
    }

    function onItemsPerPageChange(payload: any) {
      if (suppressDatatableEvents.value) return;
      const val =
        typeof payload === "number" ? payload : (payload?.perPage ?? payload);
      if (val) {
        perPage.value = Number(val);
        offset.value = 0;
        fetchProposals();
      }
    }

    // rest of your functions (kept as in tu script)...
    async function handleGenerateHojaRuta(p: Proposal) {
      if (!p) return;
      try {
        generatingId.value = p.id;
        router.push("/comercializacion/hoja-de-ruta-terrestre");
      } catch (err) {
        console.error("Error navegando a Hoja de Ruta:", err);
      } finally {
        generatingId.value = null;
      }
    }

    async function generateCartaTerrestreForProposal(p: Proposal) {
      if (!p?.id || !p.carga) return;
      try {
        generatingId.value = p.id;

        await generateCartaPorteTerrestrePdf({
          filename: `CartaPorte_${p.carga.order_id}.pdf`,
          openPreview: false,
          forceRotate: 270,
        });

        try {
          await api.post(`/proposals/${p.id}/carta-generated`);
        } catch (e) {
          console.warn("No se pudo persistir carta_generated:", e);
          await Swal.fire({
            icon: "warning",
            title: "PDF creado",
            text: "PDF generado, pero no se pudo marcar la proposal como 'carta generada' en el servidor. Revisa la consola.",
          });
        }

        await fetchProposals();

        await Swal.fire({
          icon: "success",
          text: "Carta Porte generada correctamente, espere unos segundos que se realice la descarga.",
        });
      } catch (err: any) {
        console.error("Error generando carta:", err);
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: err?.message || "No se pudo generar la Carta Porte",
        });
      } finally {
        generatingId.value = null;
      }
    }

    async function generateCartaFerroviarioForProposal(p: Proposal) {
      if (!p?.id || !p.carga) return;
      try {
        generatingId.value = p.id;

        await generateCartaPorteFerroviarioPdf({
          filename: `CartaPorte_${p.carga.order_id}.pdf`,
          openPreview: false,
          forceRotate: 270,
        });

        try {
          await api.post(`/proposals/${p.id}/carta-generated`);
        } catch (e) {
          console.warn("No se pudo persistir carta_generated:", e);
          await Swal.fire({
            icon: "warning",
            title: "PDF creado",
            text: "PDF generado, pero no se pudo marcar la proposal como 'carta generada' en el servidor. Revisa la consola.",
          });
        }

        await fetchProposals();

        await Swal.fire({
          icon: "success",
          text: "Carta Porte generada correctamente, espere unos segundos que se realice la descarga.",
        });
      } catch (err: any) {
        console.error("Error generando carta:", err);
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: err?.message || "No se pudo generar la Carta Porte",
        });
      } finally {
        generatingId.value = null;
      }
    }

    const fetchProposals = async () => {
      // DEBUG: contar y si excede un umbral, parar y avisar
      console.trace("[fetchProposals] called", new Date().toISOString(), {
        offset: offset.value,
        perPage: perPage.value,
        suppress: suppressDatatableEvents.value,
      });

      fetchCounter.value++;
      if (fetchCounter.value > 50) {
        console.error(
          "[fetchProposals] abortado: contador excesivo",
          fetchCounter.value,
        );
        return;
      }

      if (fetchLock.value) {
        // si ya hay una petición en curso, ignoramos la nueva
        // console.debug('[fetchProposals] omitida por fetchLock');
        return;
      }
      fetchLock.value = true;

      try {
        loading.value = true;
        const params: any = { limit: perPage.value, offset: offset.value };
        if (filters.value.status) params.status = filters.value.status;
        if (search.value) params.search = search.value;
        if (sort.value.field) {
          params.sortField = sort.value.field;
          params.sortOrder = sort.value.order;
        }

        const res = await api.get("/proposals", { params });
        const data = Array.isArray(res.data)
          ? res.data
          : (res.data?.data ?? res.data?.items ?? res.data);
        proposals.value = data || [];

        // construir rows planos
        // dentro de fetchProposals(), al construir datatableRows:
        datatableRows.value = (proposals.value || []).map((p: any) => {
          const carga = p.carga ?? {};
          const orderId = carga.order_id ?? carga.id ?? "";
          const remitenteDni = carga.remitente_dni ?? carga.remitenteDni ?? "";

          // -- NUEVO: resolver nombre de cliente robustamente --
          let clienteNombre = "-";
          try {
            if (carga.cliente) {
              // caso más completo: carga.cliente.user.{name,lastname}
              if (
                carga.cliente.user &&
                (carga.cliente.user.name || carga.cliente.user.lastname)
              ) {
                clienteNombre =
                  `${carga.cliente.user.name ?? ""} ${carga.cliente.user.lastname ?? ""}`.trim();
              }
              // caso alternativo: carga.cliente.name directo
              else if (carga.cliente.name) {
                clienteNombre = carga.cliente.name;
              }
            }
          } catch (e) {
            // ignore, seguiremos con fallback
          }
          // fallback: usar proposer si no hay cliente en carga
          if (!clienteNombre || clienteNombre === "-") {
            clienteNombre = p.proposer?.name ?? p.proposer?.username ?? "-";
          }
          // ------------------------------------------------------

          const remitenteNombre =
            carga.remitente_nombre ??
            carga.remitenteNombre ??
            p.proposer?.name ??
            p.proposer?.username ??
            "-";
          const autorizadoRecoger =
            carga.autorizado_recoger ?? carga.autorizado_lugar ?? "";
          const fechaRegistro = p.createdAt ?? carga.fechaRegistro ?? "";
          const precio = carga.precio ?? carga.tarifabase ?? 0;
          const estadoProp = p.status ?? p.estado ?? "";
          // marcar generatedMap si procede
          const flag = p.carta_generated ?? p.cartaGenerated ?? false;
          generatedMap[p.id] = !!flag;

          return {
            id: p.id,
            order_id: orderId,
            remitente_dni: remitenteDni,
            remitente_nombre: remitenteNombre,
            cliente: clienteNombre, // <--- aquí el nombre que usará el slot "cliente"
            estado: estadoProp,
            autorizado_recoger: autorizadoRecoger,
            fechaRegistro,
            precio,
            // datos originales
            __raw: p,
          };
        });

        total.value = res.data?.total ?? proposals.value.length;
        total.value = res.data?.total ?? proposals.value.length;
        // NO modificar tableKey aquí para evitar re-render recursivo
      } catch (err: any) {
        console.error("Error fetching proposals", err);
        Swal.fire(
          "Error",
          err?.response?.data?.message ||
            err.message ||
            "No se pudieron cargar proposals",
          "error",
        );
      } finally {
        loading.value = false;
        fetchLock.value = false;
      }
    };

    const debouncedFetch = debounce(() => {
      offset.value = 0;
      fetchProposals();
    }, 400);

    onMounted(async () => {
      // ... tu fetchProposals() ya existente
      await fetchProposals();

      // registrar listener para cerrar on click fuera
      document.addEventListener("click", handleDocumentClick, true);

      // resto de tu onMounted (cookies, suppressDatatableEvents...)
      const raw = cookies.get("userData");
      try {
        cookieUser.value = raw
          ? typeof raw === "string"
            ? JSON.parse(raw)
            : raw
          : null;
      } catch (e) {
        cookieUser.value = raw;
      }

      suppressDatatableEvents.value = false;
    });

    onUnmounted(() => {
      // limpieza: quitar listener y cerrar dropdown si queda abierto
      document.removeEventListener("click", handleDocumentClick, true);
      try {
        closeOpenDropdown();
      } catch (e) {}
    });

    function formatDate(s?: string) {
      if (!s) return "-";
      const d = new Date(s);
      return d.toLocaleString();
    }
    function formatMoney(n?: number) {
      if (n == null) return "0.00";
      return `${Number(n).toFixed(2)} CUP`;
    }

    function badgeClass(status?: string) {
      switch (status) {
        case "pending":
          return "badge bg-warning text-dark";
        case "accepted":
          return "badge bg-info text-dark";
        case "confirmed":
          return "badge bg-primary text-white";
        case "rejected":
          return "badge bg-danger";
        case "cancelled":
          return "badge bg-secondary";
        default:
          return "badge bg-light text-dark";
      }
    }

    function getEstadoBadgeClass(estado?: string) {
      switch (estado) {
        case "entregado":
          return "badge bg-success";
        case "cancelado":
          return "badge bg-danger";
        case "en_transito":
          return "badge bg-info text-dark";
        default:
          return "badge bg-light text-dark";
      }
    }

    function sortBy(field: string) {
      if (sort.value.field === field) {
        sort.value.order = sort.value.order === "asc" ? "desc" : "asc";
      } else {
        sort.value.field = field;
        sort.value.order = "asc";
      }
      fetchProposals();
    }

    function onKTSort(payload: any) {
      if (suppressDatatableEvents.value) return;
      if (!payload) return;
      const field = payload.field ?? payload;
      const order = payload.order ?? payload.dir ?? sort.value.order;
      sort.value.field = field;
      sort.value.order = order === "desc" ? "desc" : "asc";
      fetchProposals();
    }

    function prevPage() {
      offset.value = Math.max(0, offset.value - perPage.value);
      fetchProposals();
    }
    function nextPage() {
      if (offset.value + perPage.value < total.value) {
        offset.value = offset.value + perPage.value;
        fetchProposals();
      }
    }

    async function openDetail(p: Proposal) {
      selectedProposal.value = p;
      await nextTick();

      const el: HTMLElement | null =
        detailModalRef.value ??
        (document.getElementById("proposalDetailModal") as HTMLElement | null);

      if (!el) {
        console.warn("No se encontró el elemento modal #proposalDetailModal");
        return;
      }

      try {
        // @ts-ignore
        detailModalInstance = Modal.getInstance(el) ?? new Modal(el);
      } catch (e) {
        detailModalInstance = new Modal(el);
      }

      detailModalInstance.show();
    }

    function closeDetailModalIfOpen(forProposalId?: string) {
      try {
        if (detailModalInstance) {
          detailModalInstance.hide();
        } else {
          const el =
            detailModalRef.value ??
            document.getElementById("proposalDetailModal");
          if (el) {
            const inst = Modal.getInstance(el as Element) as InstanceType<
              typeof Modal
            > | null;
            inst?.hide();
          }
        }
      } catch (e) {
        // ignore
      } finally {
        if (!forProposalId) {
          selectedProposal.value = null;
        } else if (selectedProposal.value?.id === forProposalId) {
          selectedProposal.value = null;
        }
      }
    }

    const roleNameFromStoreOrCookie = () => {
      const r =
        auth.user?.role?.name ??
        cookieUser.value?.role?.name ??
        cookieUser.value?.role ??
        "";
      return String(r).toLowerCase();
    };

    const loggedUserId = () =>
      auth.user?.id ??
      cookieUser.value?.id ??
      cookieUser.value?.user?.id ??
      null;

    function isPrestatario() {
      const rn = roleNameFromStoreOrCookie();
      return rn === "prestatario";
    }

    function canConfirmAssignment(p: Proposal) {
      if (!p) return false;
      if (p.status !== "accepted") return false;
      const rn = roleNameFromStoreOrCookie();
      if (rn === "administrador" || rn === "admin") return true;
      const proposerId =
        p.proposer?.id ?? (p.proposer as any)?.user?.id ?? null;
      const me = loggedUserId();
      return me && proposerId && String(me) === String(proposerId);
    }

    async function confirmAssignmentFromList(p: Proposal) {
      try {
        const confirm = await Swal.fire({
          title: "Confirmar asignación",
          text: "¿Confirmas la asignación de la carga al prestatario?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Confirmar",
        });
        if (!confirm.isConfirmed) return;

        loading.value = true;
        await api.post(`/proposals/${p.id}/confirm`);
        await fetchProposals();

        closeDetailModalIfOpen(p.id);

        Swal.fire("Ok", "Asignación confirmada", "success");
      } catch (err: any) {
        console.error("Error confirming assignment", err);
        Swal.fire(
          "Error",
          err?.response?.data?.message || "No se pudo confirmar la asignación",
          "error",
        );
      } finally {
        loading.value = false;
      }
    }

    async function confirmAction(p: Proposal, action: "accepted" | "rejected") {
      if (action === "accepted") {
        // ya manejado por openAcceptModal -> no hacemos nada aquí
        return;
      }

      // si es rejected, mantenemos tu flujo original:
      const confirm = await Swal.fire({
        title: "Rechazar propuesta?",
        text: "Al rechazar, se notificará al cliente.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Rechazar",
      });
      if (!confirm.isConfirmed) return;

      let msg: string | undefined = undefined;
      const { value: reason } = await Swal.fire({
        title: "Motivo (opcional)",
        input: "textarea",
        showCancelButton: true,
      });
      if (reason) msg = reason;

      try {
        await performStatusUpdate(p.id, "rejected", msg);
        await Swal.fire({ icon: "success", text: "Propuesta rechazada." });
      } catch (err: any) {
        console.error("Error actualizando estado:", err);
        await Swal.fire({
          icon: "error",
          text: "No se pudo actualizar el estado. Intenta nuevamente.",
        });
      }
    }

    async function performStatusUpdate(
      id: string,
      status: "accepted" | "rejected",
      message?: string,
    ) {
      try {
        loading.value = true;
        const body: any = { status };
        if (message) body.message = message;
        await api.put(`/proposals/${id}/status`, body);
        await Swal.fire("Ok", `Propuesta ${status}`, "success");
        await fetchProposals();
        if (selectedProposal.value?.id === id) {
          const el = document.getElementById("proposalDetailModal");
          if (el) {
            const inst = Modal.getInstance(el);
            inst?.hide();
          }
          selectedProposal.value = null;
        }
      } catch (err: any) {
        console.error("Error updating proposal status", err);
        Swal.fire(
          "Error",
          err?.response?.data?.message ||
            err.message ||
            "No se pudo actualizar",
          "error",
        );
      } finally {
        loading.value = false;
      }
    }

    // ---------- Lógica de estados ----------
    const stateSequence = [
      "listo para recoger",
      "recogido",
      "en transito",
      "llegado al destino",
      "en reparto final",
      "entregado",
    ];

    function nextState(current?: string) {
      const idx = stateSequence.indexOf(String(current));
      if (idx === -1) return stateSequence[0];
      return stateSequence[Math.min(idx + 1, stateSequence.length - 1)];
    }
    function nextStateLabel(current?: string) {
      const n = nextState(current);
      if (n === "entregado") return "Marcar entregado";
      return humanStatus(n);
    }

    function humanStatus(s?: string) {
      const map: Record<string, string> = {
        borrador: "Borrador",
        propuestas_pendientes: "Propuestas pendientes",
        propuesto: "Propuesto",
        propuesta_aceptada: "Propuesta aceptada",
        asignado: "Asignado",
        listo_para_recoger: "Listo para recoger",
        recogido: "Recogido",
        en_transito: "En tránsito",
        llegado_al_destino: "Llegado al hub",
        en_reparto_final: "En reparto final",
        entregado: "Entregado",
        cancelado: "Cancelado",
        reprogramado: "Reprogramado",
      };
      return map[s ?? ""] ?? s ?? "-";
    }

    function isDelivered(carga: any) {
      return String(carga?.estado) === "entregado";
    }
    function isCanceled(carga: any) {
      return String(carga?.estado) === "cancelado";
    }

    async function handleNextState(p: Proposal) {
      if (!p?.carga?.id) return;

      const current = String(p.carga?.estado || "");
      const target = nextState(current);

      if (target === "entregado") {
        openDeliverModal(p);
        return;
      }

      const ok = await Swal.fire({
        title: `Avanzar a "${humanStatus(target)}"?`,
        text: "Esta acción cambiará el estado de la carga.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Confirmar",
      });
      if (!ok.isConfirmed) return;

      try {
        loading.value = true;

        await performCargaStatusUpdate(p.carga.id);

        await fetchProposals();

        Swal.fire("Ok", "Estado avanzado correctamente", "success");
      } catch (err: any) {
        console.error("Error avanzando estado:", err);
        Swal.fire(
          "Error",
          err?.response?.data?.message ||
            err?.message ||
            "No se pudo avanzar el estado",
          "error",
        );
      } finally {
        loading.value = false;
      }
    }

    function openReprogramModal(p: Proposal) {
      modal.value.currentProposalId = p.id;
      modal.value.reprogram.reason = "";
      modal.value.reprogram.date = "";
      const el = document.getElementById("reprogramModal");
      if (el) new Modal(el).show();
    }
    const canSubmitReprogram = computed(() => {
      return (
        modal.value.reprogram.reason &&
        modal.value.reprogram.reason.trim().length > 2 &&
        modal.value.reprogram.date
      );
    });

    async function confirmReprogram() {
      if (!canSubmitReprogram.value || !modal.value.currentProposalId) return;
      const p = proposals.value.find(
        (x) => x.id === modal.value.currentProposalId,
      );
      const cargaId = p?.carga?.id;
      if (!cargaId) return;
      try {
        loading.value = true;
        await performCargaStatusUpdate(cargaId, "reprogramado", {
          reason: modal.value.reprogram.reason,
          date: modal.value.reprogram.date,
        });
        const el = document.getElementById("reprogramModal");
        Modal.getInstance(el as Element)?.hide();
      } finally {
        loading.value = false;
      }
    }

    function openCancelModal(p: Proposal) {
      modal.value.currentProposalId = p.id;
      modal.value.cancel.reason = "";
      const el = document.getElementById("cancelModal");
      if (el) new Modal(el).show();
    }

    const canSubmitCancel = computed(() => {
      return (
        modal.value.cancel.reason && modal.value.cancel.reason.trim().length > 2
      );
    });

    async function confirmCancel() {
      if (!canSubmitCancel.value || !modal.value.currentProposalId) return;
      const p = proposals.value.find(
        (x) => x.id === modal.value.currentProposalId,
      );
      const cargaId = p?.carga?.id;
      if (!cargaId) return;
      try {
        loading.value = true;
        await performCargaStatusUpdate(cargaId, "cancelado", {
          reason: modal.value.cancel.reason,
        });
        const el = document.getElementById("cancelModal");
        Modal.getInstance(el as Element)?.hide();
      } finally {
        loading.value = false;
      }
    }

    function openDeliverModal(p: Proposal) {
      modal.value.currentProposalId = p.id;
      modal.value.deliver.signed = false;
      modal.value.deliver.dniFrontFile = null;
      modal.value.deliver.dniBackFile = null;
      const el = document.getElementById("deliverModal");
      if (el) new Modal(el).show();
    }
    function onFileChange(evt: any, which: "dniFront" | "dniBack") {
      const file = evt.target.files?.[0] ?? null;
      if (which === "dniFront") modal.value.deliver.dniFrontFile = file;
      else modal.value.deliver.dniBackFile = file;
    }
    const canSubmitDeliver = computed(() => {
      return (
        modal.value.deliver.signed === true &&
        modal.value.deliver.dniFrontBase64 &&
        modal.value.deliver.dniBackBase64
      );
    });

    async function confirmDeliver() {
      const p = proposals.value.find(
        (x) => x.id === modal.value.currentProposalId,
      );
      const cargaId = p?.carga?.id;
      if (!cargaId) return;

      if (!canSubmitDeliver.value) {
        Swal.fire(
          "Atención",
          "Debe completar todos los requisitos (fotos y firmar).",
          "warning",
        );
        return;
      }

      const body = {
        dni_front_base64: modal.value.deliver.dniFrontBase64,
        dni_back_base64: modal.value.deliver.dniBackBase64,
        pod_signed: modal.value.deliver.signed === true,
        signatureConfirmed: modal.value.deliver.signed === true,
      };

      try {
        loading.value = true;
        await api.post(`/carga/${cargaId}/deliver-base64`, body);
        const el = document.getElementById("deliverModal");
        Modal.getInstance(el as Element)?.hide();
        Swal.fire(
          "Éxito",
          "La carga ha sido marcada como entregada.",
          "success",
        );
        await fetchProposals();
      } catch (err: any) {
        console.error("Error delivering base64", err);
        Swal.fire(
          "Error",
          err?.response?.data?.message ||
            err?.message ||
            "No se pudo marcar como entregada",
          "error",
        );
      } finally {
        loading.value = false;
      }
    }

    async function performCargaStatusUpdate(
      cargaId: string,
      statusOrPayload?: string | FormData | Record<string, any>,
      payloadOrIsForm?: FormData | Record<string, any> | boolean,
      explicitIsForm = false,
    ) {
      try {
        loading.value = true;

        let status: string | undefined;
        let payload: FormData | Record<string, any> | undefined;
        let isForm = false;

        if (typeof statusOrPayload === "string") {
          status = statusOrPayload;
          if (payloadOrIsForm instanceof FormData) {
            payload = payloadOrIsForm;
            isForm = true;
          } else if (
            typeof payloadOrIsForm === "object" &&
            payloadOrIsForm !== null
          ) {
            payload = payloadOrIsForm as Record<string, any>;
            isForm = false;
          } else if (typeof payloadOrIsForm === "boolean") {
            isForm = payloadOrIsForm;
            payload = undefined;
          } else {
            payload = undefined;
          }
          if (typeof explicitIsForm === "boolean") isForm = explicitIsForm;
        } else {
          if (statusOrPayload instanceof FormData) {
            payload = statusOrPayload;
            isForm = true;
          } else if (
            typeof statusOrPayload === "object" &&
            statusOrPayload !== null
          ) {
            payload = statusOrPayload as Record<string, any>;
            isForm = false;
          } else {
            payload = undefined;
          }

          if (payloadOrIsForm instanceof FormData) {
            payload = payloadOrIsForm;
            isForm = true;
          } else if (typeof payloadOrIsForm === "boolean") {
            isForm = payloadOrIsForm;
          }
          if (typeof explicitIsForm === "boolean") isForm = explicitIsForm;
        }

        if (isForm) {
          const form = payload instanceof FormData ? payload : new FormData();

          if (status) {
            (form as any).set
              ? (form as any).set("status", status)
              : form.append("status", status);
          }

          await api.put(`/carga/${cargaId}/advance`, form as FormData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          const body: Record<string, any> = {};
          if (typeof payload === "object" && payload !== null)
            Object.assign(body, payload);
          if (status) body.status = status;

          await api.put(`/carga/${cargaId}/advance`, body);
        }

        await fetchProposals();
        Swal.fire("Ok", "Estado actualizado", "success");
      } catch (err: any) {
        console.error("Error updating carga status", err);
        Swal.fire(
          "Error",
          err?.response?.data?.message ||
            err?.message ||
            "No se pudo actualizar el estado de la carga",
          "error",
        );
        throw err;
      } finally {
        loading.value = false;
      }
    }

    function shouldShowNextBtn(p: Proposal) {
      const e = String(p?.carga?.estado || "");
      return (
        isPrestatario() &&
        p.status === "confirmed" &&
        e !== "entregado" &&
        e !== "cancelado" &&
        e !== "reprogramado"
      );
    }

    async function handleGenerateCarta(p: Proposal) {
      if (!p?.id || !p?.carga) return;

      generatingId.value = p.id;

      const rawVia =
        (p.carga.via as any) ??
        (p.carga.via_string as any) ??
        (p.carga.origen_via as any) ??
        "";
      const via = String(rawVia ?? "").toLowerCase();

      try {
        if (via.includes("terrest")) {
          const prefill = {
            emisor_nombre:
              (p.carga as any).emisor_nombre ??
              (p.carga as any).remitente_nombre ??
              "",
            emisor_dni:
              (p.carga as any).emisor_dni ??
              (p.carga as any).remitente_dni ??
              "",
            nombre_destinatario:
              (p.carga as any).nombre_destinatario ??
              (p.carga as any).destinatario_nombre ??
              "",
            cargaId: p.carga.id ?? p.carga.order_id ?? "",
          };

          router.push({
            path: "/administracion/cartaporte/cartaP",
            query: {
              emisor_nombre: String(prefill.emisor_nombre),
              emisor_dni: String(prefill.emisor_dni),
              nombre_destinatario: String(prefill.nombre_destinatario),
              cargaId: String(prefill.cargaId),
            },
          });
        } else if (via.includes("ferro") || via.includes("ferrov")) {
          await generateCartaFerroviarioForProposal(p);
        } else {
          router.push("/administracion/cartaporte/cartaP");
        }

        generatedMap[p.id] = true;

        await fetchProposals();
      } catch (err: any) {
        console.error("Error generando carta específica:", err);
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: err?.message || "No se pudo generar la Carta Porte",
        });
      } finally {
        generatingId.value = null;
      }
    }

    return {
      // datatable
      openDeliverModal,
      tableHeader,
      selectedIds,
      getRowClass,
      onItemSelect,
      onItemsPerPageChange,
      onKTSort,
      // core
      handleGenerateCarta,
      modal,
      proposals,
      total,
      loading,
      perPage,
      offset,
      search,
      filters,
      formatDate,
      formatMoney,
      badgeClass,
      getEstadoBadgeClass,
      fetchProposals,
      sortBy,
      prevPage,
      nextPage,
      openDetail,
      selectedProposal,
      confirmAction,
      canConfirmAssignment,
      isPrestatario,
      debouncedFetch,

      datatableRows,
      confirmAssignmentFromList,
      humanStatus,
      nextStateLabel,
      handleNextState,
      openReprogramModal,
      openCancelModal,
      confirmReprogram,
      confirmCancel,
      onFileChange,
      confirmDeliver,
      canSubmitReprogram,
      canSubmitCancel,
      canSubmitDeliver,
      isDelivered,
      isCanceled,
      detailModalRef,
      closeDetailModalIfOpen,
      shouldShowNextBtn,
      generatedMap,
      generatingId,
      generateCartaTerrestreForProposal,
      generateCartaFerroviarioForProposal,
      handleGenerateHojaRuta,
      onDropdownAction,
      closeBootstrapDropdown,
      openActions,
      nextState,

      // accept vehicle modal
      acceptVehicleModalRef,
      acceptVehicleForm,
      acceptLoading,
      openAcceptModal,
      hideAcceptModal,
      submitAcceptWithVehicle,
    };
  },
});
</script>

<style scoped>
.text-start.text-gray-500.fw-bold.fs-7.text-uppercase.gs-0 {
  border-bottom-width: 1px;
  border-bottom-style: dashed;
  border-bottom-color: var(--bs-border-color);
}
.table-hover tbody tr:hover {
  background: #f8f9fa;
}
.user-actions {
  text-align: center;
}
.badge {
  font-size: 0.8rem;
}
/* compact action button styles */
.btn-action-compact {
  padding: 0.25rem 0.5rem;
  font-size: 0.85rem;
}
.custom {
  color: #17c653 !important;
  background-color: #414d45;
}
.cancelado-row {
  color: #ff0000 !important;
  background-color: #4d4341;
}
.swal2-title-white {
  color: #ffffff !important;
}
::v-deep .swal2-title-white {
  color: #ffffff !important;
}

/* small adjustments for datatable dropdowns */
.dropdown-menu {
  min-width: 10rem;
}

/* Contenedor flexible que permite wrap */
.header-controls {
  flex-wrap: wrap;
}

/* Comportamiento por defecto (desktop / tablet grande)
   - input ocupa más espacio (flex-grow)
   - selects son más contenidos (no crecen) */
.header-controls .search-input {
  flex: 1 1 240px; /* crecer, encoger, base 240px */
  min-width: 200px;
  max-width: 100%;
}

.header-controls .select-control {
  flex: 0 0 160px; /* no crecer, base 160px */
  min-width: 120px;
}

/* Header controls - layout general */
.header-controls {
  gap: 0.75rem;
  align-items: center;
  /* permitimos que los controles ocupen la línea completa */
  width: 100%;
  box-sizing: border-box;
}

/* buscador: ocupa el espacio disponible */
.header-controls .ctrl-search {
  flex: 1 1 auto;
  min-width: 220px;
}

/* input: limita crecimiento en pantallas muy grandes para que no se vea raro */
.header-controls .search-input {
  width: 100%;
  max-width: 680px; /* ajustable: evita que el input se haga gigante */
  box-sizing: border-box;
}

/* contenedor de selects (derecha) */
.header-controls .small-controls {
  flex: 0 0 auto;
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

/* selects compactos */
.header-controls .select-control {
  min-width: 120px;
  max-width: 120px;
  flex: 0 0 auto;
}

/* === Responsive behavior === */

/* Pantallas medianas y menos: apilar */
@media (max-width: 991.98px) {
  .card-header {
    padding-bottom: 0.75rem;
  }

  /* hacemos que el grupo se envuelva y los controles ocupen 100% */
  .header-controls {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .header-controls .ctrl-search,
  .header-controls .small-controls,
  .header-controls .small-controls .select-control {
    flex: 1 1 100%;
    min-width: 0;
    max-width: 100%;
  }
  .header-controls .small-controls {
    justify-content: flex-start;
  }

  /* añade separación visual cuando apilan */
  .header-controls .ctrl-search {
    margin-bottom: 0;
  }
}

/* Pantallas extra grandes: evita que todo quede comprimido y respeta el espacio */
@media (min-width: 1400px) {
  .header-controls .search-input {
    max-width: 720px;
  }
}

/* utilidad para mantener el título en el DOM pero oculto a vista (accessible) */
.visually-hidden {
  position: absolute !important;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
  white-space: nowrap;
  border: 0;
  padding: 0;
  margin: -1px;
}

/* Estilo popup de acciones: apariencia de botones apilados con colores tipo "btn-*" */

/* acción individual — apariencia de 'botón' */
.action-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  border-radius: 6px;
  color: #fff;
  font-weight: 600;
  border: none;
  cursor: pointer;
}

/* versión primaria (Ver / Confirmar) */
.action-item.btn-primary {
  background: var(--bs-primary);
  color: #fff;
}

/* verde: aceptar / siguiente estado / deliver */
.action-item.btn-success {
  background: var(--bs-success);
  color: #fff;
}

/* rojo: rechazar / cancelar */
.action-item.btn-danger {
  background: var(--bs-danger);
  color: #fff;
}

/* warning: reprogramar */
.action-item.btn-warning {
  background: var(--bs-warning);
  color: #000;
}

/* secondary / dark: generadores */
.action-item.btn-secondary {
  background: var(--bs-secondary);
  color: #fff;
}

/* hover / focus */
.action-item:hover,
.action-item:focus {
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
}

/* actions-popup: oculto por defecto, aparece solo cuando .dropdown tiene .show */
.actions-popup {
  padding: 10px;
  display: none; /* <-- oculto por defecto */
  flex-direction: column;
  gap: 8px;
  min-width: 220px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.45);
  border-radius: 8px;
  background: #fff;
  max-height: calc(100vh - 120px); /* deja margen superior/inferior */
  overflow-y: auto;
  z-index: 1200;
  position: absolute; /* Popper/Bootstrap colocará la posición */
  right: 0; /* por defecto alineado a la derecha del toggle */
}

/* cuando el dropdown está abierto (Bootstrap añade .show al root) mostrarlo */
.dropdown.show .actions-popup,
.dropdown-menu.show.actions-popup {
  display: flex;
}

/* estilos de las acciones (mantener) */
.action-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  border-radius: 6px;
  color: #fff;
  font-weight: 600;
  border: none;
  cursor: pointer;
}

.action-item.btn-primary {
  background: var(--bs-primary);
  color: #fff;
}
.action-item.btn-success {
  background: var(--bs-success);
  color: #fff;
}
.action-item.btn-danger {
  background: var(--bs-danger);
  color: #fff;
}
.action-item.btn-warning {
  background: var(--bs-warning);
  color: #000;
}
.action-item.btn-secondary {
  background: var(--bs-secondary);
  color: #fff;
}

.action-item:hover,
.action-item:focus {
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
}

/* móviles: popup ocupa ancho completo */
@media (max-width: 576px) {
  .actions-popup {
    min-width: 100%;
    left: 0 !important;
    right: 0 !important;
    border-radius: 6px;
    position: fixed;
    bottom: 16px;
  }
}

.action-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  border-radius: 6px;
  color: #fff;
  font-weight: 600;
  border: none;
  cursor: pointer;
}

.action-item.btn-primary {
  background: var(--bs-primary);
  color: #fff;
}
.action-item.btn-success {
  background: var(--bs-success);
  color: #fff;
}
.action-item.btn-danger {
  background: var(--bs-danger);
  color: #fff;
}
.action-item.btn-warning {
  background: var(--bs-warning);
  color: #000;
}
.action-item.btn-secondary {
  background: var(--bs-secondary);
  color: #fff;
}

.action-item:hover,
.action-item:focus {
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
}

/* Asegura que el root .dropdown no ocupe todo el ancho */
.dropdown {
  display: inline-block; /* importante: no full-width */
  position: relative; /* referencia para posicionamiento absoluto */
  vertical-align: middle;
}

/* Evitar que Bootstrap (o otra regla) obligue al dropdown a 100% */
.dropdown .dropdown-menu {
  width: auto !important;
  min-width: 220px; /* mínimo razonable */
  max-width: 420px; /* evita que se estire demasiado */
  padding: 0; /* el padding lo controla .actions-popup */
  border: none;
  background: transparent;
  box-shadow: none;
}

/* actions-popup: anclado al toggle (absolute) y con límites de ancho */
.actions-popup {
  position: absolute !important;
  top: calc(100% + 8px) !important; /* justo debajo del botón */
  right: 0 !important; /* alineado a la derecha del toggle */
  left: auto !important;
  display: none; /* visible solo cuando .dropdown.show */
  min-width: 220px;
  max-width: 420px;
  width: auto;
  padding: 10px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.45);
  border-radius: 8px;
  background: #fff;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  z-index: 1200;
  box-sizing: border-box;
}

/* Mostrar solo cuando bootstrap añade .show */
.dropdown.show .actions-popup,
.dropdown-menu.show.actions-popup {
  display: flex;
}

/* Si en tu layout hay contenedores con transform/overflow, forzamos que Popper lo coloque correctamente
   (esto evita que el menú aparezca en la parte superior de la página) */
.actions-popup[data-popper-placement^="bottom"] {
  transform-origin: top right;
}
.actions-popup[data-popper-placement^="top"] {
  transform-origin: bottom right;
}

/* Móvil: popup ancho completo pero con margen */
@media (max-width: 576px) {
  .actions-popup {
    min-width: calc(100% - 32px);
    left: 16px !important;
    right: 16px !important;
    top: auto !important;
    bottom: 16px !important;
    position: fixed !important;
    border-radius: 10px;
  }
}
</style>
