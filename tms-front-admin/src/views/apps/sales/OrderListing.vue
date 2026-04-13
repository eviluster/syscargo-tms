<template>
  <!--begin::Card-->
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-6">
      <!--begin::Card title-->
      <div class="card-title">
        <!--begin::Search-->
        <div class="d-flex align-items-center position-relative my-1">
          <KTIcon
            icon-name="magnifier"
            icon-class="fs-1 position-absolute ms-6"
          />
          <input
            v-model="search"
            @input="searchItems()"
            type="text"
            data-kt-subscription-table-filter="search"
            class="form-control form-control-solid w-250px ps-14"
            placeholder="Search Orders"
          />
        </div>
        <!--end::Search-->
        <!--begin::Status Search-->
        <div class="d-flex align-items-center position-relative my-1 px-4">
          <select
            v-model="selectedState"
            @change="searchStatus()"
            class="form-select"
          >
            <option value="" disabled selected hidden>Status</option>
            <option value="">All</option>
            <option v-for="estado in estados" :key="estado" :value="estado">
              {{ estado }}
            </option>
          </select>
        </div>
        <!--end::Status Search-->
      </div>
      <!--begin::Card title-->
      <div class="filters d-flex position-relative my-1 px-1">
        <div class="date-filter">
          <label>
            Fecha inicial:
            <input
              class="form-control form-control-solid w-250px"
              type="date"
              v-model="startDate"
            />
          </label>
          <label class="px-4">
            Fecha final:
            <input
              class="form-control form-control-solid w-250px"
              type="date"
              v-model="endDate"
            />
          </label>
        </div>
      </div>
      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <!--begin::Toolbar-->
        <div
          v-if="selectedIds.length === 0"
          class="d-flex justify-content-end"
          data-kt-subscription-table-toolbar="base"
        ></div>
        <!--end::Toolbar-->
        <!--begin::Group actions-->
        <div v-else class="d-flex justify-content-end align-items-center">
          <div class="fw-bold me-5">
            <span class="me-2">{{ selectedIds.length }}</span
            >Selected
          </div>
          <button
            type="button"
            class="btn btn-danger"
            @click="deleteFewSales()"
          >
            Delete Selected
          </button>
        </div>
        <!--end::Group actions-->
      </div>
      <!--end::Card toolbar-->
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="card-body pt-0">
      <KTDatatable
        @on-sort="sort"
        @on-items-select="onItemSelect"
        @on-items-per-page-change="onItemsPerPageChange"
        :data="data"
        :header="headerConfig"
        :checkbox-enabled="true"
        :items-per-page="10"
      >
        <template v-slot:id="{ row: customer }">
          {{ customer.id }}
        </template>

        <template v-slot:customer="{ row: customer }">
          <router-link
            to="/apps/subscriptions/view-subscription"
            href=""
            class="text-gray-800 text-hover-primary mb-1"
          >
            {{ customer.customer }}
          </router-link>
        </template>
        <template v-slot:status="{ row: customer }">
          <a href="#" class="text-gray-600 text-hover-primary mb-1">
            <div :class="`badge badge-light-${customer.color}`">
              {{ customer.status }}
            </div>
          </a>
        </template>
        <template v-slot:total="{ row: customer }">
          <div class="badge-ligth">{{ formatCurrency(customer.total) }}</div>
        </template>
        <template v-slot:dateadded="{ row: customer }">
          {{ formatDate(customer.dateadded) }}
        </template>
        <template v-slot:createdDate="{ row: customer }">
          {{ formatDate(customer.createdDate) }}
        </template>
        <template v-slot:actions="{ row: customer }">
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
            <div class="menu-item px-3">
              <a href="#" class="menu-link px-3" @click="openModal(customer)">
                Ver
              </a>
            </div>
            <div class="menu-item px-3">
              <a @click="deleteSale(customer.id)" class="menu-link px-3"
                >Delete</a
              >
            </div>
            <!--end::Menu item-->
          </div>
          <!--end::Menu-->
        </template>
      </KTDatatable>
      <!--Modal-->
      <div class="modal fade" tabindex="-1" id="kt_modal_1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title">Detalles del Pedido</h3>
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
                  <p>ID: {{ selectedOrder?.id }}</p>
                  <p>
                    Nombre:
                    <input
                      type="text"
                      v-model="selectedOrder!.customer"
                      @blur="updateOrder(selectedOrder)"
                      class="form-control form-control-solid w-250px"
                      aria-label="Edit customer name"
                    />
                  </p>
                  <p>
                    Estado:
                    <select
                      v-model="selectedOrder!.status"
                      @change="
                        updateOrder(selectedOrder),
                          assignColorByStatus(selectedOrder!)
                      "
                      class="form-control form-control-solid w-250px"
                      aria-label="Edit status"
                    >
                      <option value="">All</option>
                      <option
                        v-for="estado in estados"
                        :key="estado"
                        :value="estado"
                      >
                        {{ estado }}
                      </option>
                    </select>
                  </p>
                  <p>
                    Total:
                    <span>$</span>
                    <input
                      type="number"
                      v-model="selectedOrder!.total"
                      @blur="updateOrder(selectedOrder)"
                      class="form-control form-control-solid w-250px"
                      aria-label="Edit total"
                      step="0.01"
                    />
                  </p>
                  <p>
                    Date Added:
                    <input
                      type="date"
                      v-model="selectedOrder!.dateadded"
                      @blur="updateOrder(selectedOrder)"
                      aria-label="Edit dateadded"
                      class="form-control form-control-solid w-250px"
                      @focus="isEditingDateAdded = true"
                    />
                  </p>
                  <p>
                    Created Date:
                    <input
                      type="date"
                      v-model="selectedOrder!.createdDate"
                      @blur="updateOrder(selectedOrder)"
                      aria-label="Edit createdDate"
                      class="form-control form-control-solid w-250px"
                      @focus="isEditingCreatedDate = true"
                    />
                  </p>
                </div>
                <div v-else>
                  <p>ID: {{ selectedOrder?.id }}</p>
                  <p>Nombre: {{ selectedOrder?.customer }}</p>
                  <p>Estado: {{ selectedOrder?.status }}</p>
                  <p>Total: {{ formatCurrency(selectedOrder?.total ?? 0) }}</p>
                  <p>Date Added: {{ formatDate(selectedOrder?.dateadded) }}</p>
                  <p>
                    Created Date: {{ formatDate(selectedOrder?.createdDate) }}
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
                @click="closeModal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <!--End Modal-->
    </div>
    <!--end::Card body-->
  </div>
  <!--end::Card-->
</template>
<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, onMounted, ref, watch, reactive } from "vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import arraySort from "array-sort";
import { MenuComponent } from "@/assets/ts/components";
import { Modal } from "bootstrap";
import Swal from "sweetalert2/dist/sweetalert2.js";
interface ISales {
  id: number;
  customer: string;
  status: string;
  color: string;
  total: number;
  dateadded: string;
  createdDate: string;
}
function assignColorByStatus(sale: ISales): ISales {
  if (sale.status === "Completed" || sale.status === "Delivered") {
    sale.color = "success";
  } else if (sale.status === "Pending" || sale.status === "Expired") {
    sale.color = "warning";
  } else if (
    sale.status === "Cancelled" ||
    sale.status === "Denied" ||
    sale.status === "Failed"
  ) {
    sale.color = "danger";
  } else if (sale.status === "Processing" || sale.status === "Delivering") {
    sale.color = "primary";
  } else if (sale.status === "Refunded") {
    sale.color = "info";
  } else {
    sale.color = "";
  }
  return sale;
}
export default defineComponent({
  name: "OrderListing",
  components: {
    KTDatatable,
  },
  setup() {
    const data = ref<Array<ISales>>([
      {
        id: 1,
        customer: "Emma Smith",
        status: "Completed",
        color: "",
        total: 141.0,
        dateadded: "2024/10/14",
        createdDate: "2024/10/15",
      },
      {
        id: 2,
        customer: "Melody Macy",
        status: "Completed",
        color: "",
        total: 470.0,
        dateadded: "2024/10/10",
        createdDate: "2024/10/14",
      },
      {
        id: 3,
        customer: "Max Smith",
        status: "Completed",
        color: "",
        total: 383.0,
        dateadded: "2024/10/09",
        createdDate: "2024/10/13",
      },
      {
        id: 4,
        customer: "Sean Bean",
        status: "Pending",
        color: "",
        total: 109.0,
        dateadded: "2024/10/06",
        createdDate: "12/10/2024",
      },
      {
        id: 5,
        customer: "Brian Cox",
        status: "Processing",
        color: "",
        total: 141.0,
        dateadded: "2024/10/07",
        createdDate: "2024/10/11",
      },
      {
        id: 6,
        customer: "Mikaela Collins",
        status: "Denied",
        color: "",
        total: 141.0,
        dateadded: "2024/10/04",
        createdDate: "2024/10/10",
      },
      {
        id: 7,
        customer: "Francis Mitcham",
        status: "Failed",
        color: "",
        total: 141.0,
        dateadded: "2024/10/06",
        createdDate: "2024/10/09",
      },
      {
        id: 8,
        customer: "Olivia Wild",
        status: "Delivered",
        color: "",
        total: 256.0,
        dateadded: "2024/10/01",
        createdDate: "2024/10/08",
      },
      {
        id: 9,
        customer: "Neil Owen",
        status: "Delivered",
        color: "",
        total: 141.0,
        dateadded: "2024/10/01",
        createdDate: "2024/10/07",
      },
      {
        id: 10,
        customer: "Dan Wilson",
        status: "Delivering",
        color: "",
        total: 141.0,
        dateadded: "2024/09/29",
        createdDate: "2024/10/06",
      },
      {
        id: 11,
        customer: "Emma Bold",
        status: "Pending",
        color: "",
        total: 470.0,
        dateadded: "2024/09/29",
        createdDate: "2024/10/05",
      },
      {
        id: 12,
        customer: "Ana Crown",
        status: "Completed",
        color: "",
        total: 470.0,
        dateadded: "2024/10/03",
        createdDate: "2024/10/04",
      },
      {
        id: 13,
        customer: "Robert Doe",
        status: "Completed",
        color: "",
        total: 256.0,
        dateadded: "2024/09/28",
        createdDate: "2024/10/03",
      },
      {
        id: 14,
        customer: "John Miller",
        status: "Cancelled",
        color: "",
        total: 109.0,
        dateadded: "2024/10/01",
        createdDate: "2024/10/02",
      },
      {
        id: 15,
        customer: "Lucy Kunic",
        status: "Refunded",
        color: "",
        total: 470.0,
        dateadded: "2024/09/27",
        createdDate: "2024/10/01",
      },
      {
        id: 16,
        customer: "Neil Owen",
        status: "Refunded",
        color: "",
        total: 256.0,
        dateadded: "2024/09/27",
        createdDate: "2024/09/30",
      },
      {
        id: 17,
        customer: "Dan Wilson",
        status: "Pending",
        color: "",
        total: 109.0,
        dateadded: "2024/09/22",
        createdDate: "2024/09/29",
      },
      {
        id: 18,
        customer: "Emma Smith",
        status: "Pending",
        color: "",
        total: 141.0,
        dateadded: "2024/09/27",
        createdDate: "2024/09/28",
      },
      {
        id: 19,
        customer: "Melody Macy",
        status: "Completed",
        color: "",
        total: 470.0,
        dateadded: "2024/09/21",
        createdDate: "2024/09/27",
      },
      {
        id: 20,
        customer: "Max Smith",
        status: "Completed",
        color: "",
        total: 256.0,
        dateadded: "2024/09/20",
        createdDate: "2024/09/26",
      },
    ]);

    const headerConfig = ref([
      {
        columnName: "Order ID",
        columnLabel: "id",
        sortEnabled: true,
      },
      {
        columnName: "Customer",
        columnLabel: "customer",
        sortEnabled: true,
      },
      {
        columnName: "Status",
        columnLabel: "status",
        sortEnabled: true,
      },
      {
        columnName: "Total",
        columnLabel: "total",
        sortEnabled: true,
      },
      {
        columnName: "Date Added",
        columnLabel: "dateadded",
        sortEnabled: true,
      },
      {
        columnName: "Created Date",
        columnLabel: "createdDate",
        sortEnabled: true,
      },
      {
        columnName: "Actions",
        columnLabel: "actions",
      },
    ]);
    const initData = ref<Array<ISales>>([]);
    onMounted(() => {
      data.value = data.value.map(assignColorByStatus);
      initData.value.splice(0, data.value.length, ...data.value);
      filteredDataByDate();
    });

    const selectedIds = ref<Array<number>>([]);
    const deleteFewSales = () => {
      selectedIds.value.forEach((item) => {
        deleteSale(item);
      });
      selectedIds.value.length = 0;
    };
    const deleteSale = (id: number) => {
      for (let i = 0; i < data.value.length; i++) {
        if (data.value[i].id === id) {
          data.value.splice(i, 1);
        }
      }
    };
    const sort = (sort: Sort) => {
      const reverse: boolean = sort.order === "asc";
      if (sort.label) {
        arraySort(data.value, sort.label, { reverse });
      }
    };
    const onItemSelect = (selectedItems: Array<number>) => {
      selectedIds.value = selectedItems;
    };

    const search = ref<string>("");
    const searchItems = () => {
      data.value.splice(0, data.value.length, ...initData.value);
      if (search.value !== "") {
        let results: Array<ISales> = [];
        for (let j = 0; j < initData.value.length; j++) {
          if (searchingFunc(initData.value[j], search.value)) {
            results.push(initData.value[j]);
          }
        }
        data.value.splice(0, data.value.length, ...results);
      }
      MenuComponent.reinitialization();
    };
    const searchingFunc = (obj: any, value: string): boolean => {
      for (let key in obj) {
        if (!Number.isInteger(obj[key]) && !(typeof obj[key] === "object")) {
          if (obj[key].toLowerCase().indexOf(value.toLowerCase()) != -1) {
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
    const formatCurrency = (value: number): string => {
      return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const selectedState = ref("");
    const estados = ref([
      "Completed",
      "Pending",
      "Cancelled",
      "Processing",
      "Denied",
      "Expired",
      "Failed",
      "Refunded",
      "Delivered",
      "Delivering",
    ]);
    const searchStatus = () => {
      data.value.splice(0, data.value.length, ...initData.value);
      if (selectedState.value !== "") {
        let results: Array<ISales> = [];
        for (let j = 0; j < initData.value.length; j++) {
          if (searchingFunc(initData.value[j], selectedState.value)) {
            results.push(initData.value[j]);
          }
        }
        data.value.splice(0, data.value.length, ...results);
      }
      MenuComponent.reinitialization();
    };

    const startDate = ref("");
    const endDate = ref("");
    const filteredDataByDate = () => {
      data.value.splice(0, data.value.length, ...initData.value);
      if (startDate.value || endDate.value) {
        let results: ISales[] = [];
        for (let j = 0; j < initData.value.length; j++) {
          const itemDate = new Date(initData.value[j].dateadded);
          const start = startDate.value ? new Date(startDate.value) : null;
          const end = endDate.value ? new Date(endDate.value) : null;
          const isInRange =
            (!start || itemDate >= start) && (!end || itemDate <= end);
          if (isInRange) {
            results.push(initData.value[j]);
          }
        }
        data.value.splice(0, data.value.length, ...results);
      } else {
        data.value.splice(0, data.value.length, ...initData.value);
      }
      watch([startDate, endDate], () => {
        filteredDataByDate();
      });
    };

    const selectedOrder = ref<ISales | null>(null);

    const openModal = (order: ISales) => {
      selectedOrder.value = order;
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
    const editCell = <K extends keyof ISales>(
      row: ISales,
      key: K,
      value: ISales[K],
    ) => {
      row[key] = value;
    };
    const loading = ref<boolean>(false);
    const toggleEditMode = () => {
      if (isEditable.value) {
        loading.value = true;
        setTimeout(() => {
          loading.value = false;
          const updateSuccess = true;
          if (updateSuccess) {
            Swal.fire({
              text: "Orden actualizada exitosamente!",
              icon: "success",
              buttonsStyling: false,
              confirmButtonText: "Ok, got it!",
              heightAuto: false,
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
          } else {
            Swal.fire({
              text: "Hubo un error al actualizar la orden. Por favor, inténtalo de nuevo.",
              icon: "error",
              buttonsStyling: false,
              confirmButtonText: "Ok, got it!",
              heightAuto: false,
              customClass: {
                confirmButton: "btn btn-primary",
              },
            });
          }
        });
      }
      isEditable.value = !isEditable.value;
    };

    const updateOrder = (order) => {
      console.log("Order updated:", order);
    };
    const isEditingDateAdded = ref(false);
    const isEditingCreatedDate = ref(false);
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
    return {
      search,
      searchItems,
      data,
      headerConfig,
      sort,
      onItemSelect,
      selectedIds,
      deleteFewSales,
      deleteSale,
      getAssetPath,
      onItemsPerPageChange,
      formatCurrency,
      estados,
      selectedState,
      searchStatus,
      startDate,
      endDate,
      filteredDataByDate,
      selectedOrder,
      openModal,
      closeModal,
      editCell,
      toggleEditMode,
      isEditable,
      updateOrder,
      assignColorByStatus,
      isEditingDateAdded,
      isEditingCreatedDate,
      formatDate,
      loading,
    };
  },
});
</script>
