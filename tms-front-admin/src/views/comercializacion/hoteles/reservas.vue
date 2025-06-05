<template>
  <div class="card">
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
            type="text"
            v-model="search"
            @input="searchItems()"
            class="form-control form-control-solid w-250px ps-15"
            placeholder="Search Reservas"
          />
        </div>
        <!--end::Search-->
      </div>
      <!--begin::Card title-->
      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <!--begin::Toolbar-->
        <div
          v-if="selectedIds.length === 0"
          class="d-flex justify-content-end"
          data-kt-reserva-table-toolbar="base"
        >
          <!--begin::Export-->
          <button
            type="button"
            class="btn btn-light-primary me-3"
            data-bs-toggle="modal"
            data-bs-target="#kt_reservas_export_modal"
          >
            <KTIcon icon-name="exit-up" icon-class="fs-2" />
            Export
          </button>
          <!--end::Export-->
          <!--begin::Add reserva-->
          <router-link to="/comercializacion/hoteles/reservar">
            <button type="button" class="btn btn-primary">
              <KTIcon icon-name="plus" icon-class="fs-2" />
              Añadir Reserva
            </button>
          </router-link>

          <!--end::Add reserva-->
        </div>
        <!--end::Toolbar-->
        <!--begin::Group actions-->
        <div
          v-else
          class="d-flex justify-content-end align-items-center"
          data-kt-reserva-table-toolbar="selected"
        >
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
        <!--end::Group actions-->
        <!--begin::Group actions-->
        <div
          class="d-flex justify-content-end align-items-center d-none"
          data-kt-reserva-table-toolbar="selected"
        >
          <div class="fw-bold me-5">
            <span
              class="me-2"
              data-kt-reserva-table-select="selected_count"
            ></span
            >Selected
          </div>
          <button
            type="button"
            class="btn btn-danger"
            data-kt-reserva-table-select="delete_selected"
          >
            Delete Selected
          </button>
        </div>
        <!--end::Group actions-->
      </div>
      <!--end::Card toolbar-->
    </div>
    <div class="card-body pt-0">
      <Datatable
        @on-sort="sort"
        @on-items-select="onItemSelect"
        :data="tableData"
        :header="tableHeader"
        :enable-items-per-page-dropdown="true"
        :checkbox-enabled="true"
        checkbox-label="id"
      >
        <template v-slot:nombrecliente="{ row: reserva }">
          {{ reserva.nombrecliente }}
        </template>
        <template v-slot:email="{ row: reserva }">
          <a href="#" class="text-gray-600 text-hover-primary mb-1">
            {{ reserva.email }}
          </a>
        </template>
        <template v-slot:numerofactura="{ row: reserva }">
          {{ reserva.numerofactura }}
        </template>
        <template v-slot:estado="{ row: reserva }">
          <span
            :class="`badge py-3 px-4 fs-7 badge-light-${reserva.estado.color}`"
            >{{ reserva.estado.label }}</span
          >
        </template>
        <template v-slot:datecreacion="{ row: reserva }">
          {{ reserva.datecreacion }}
        </template>
        <template v-slot:actions="{ row: reserva }">
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
              <router-link
                to="/apps/planes/plan-details"
                class="menu-link px-3"
                @click="editReserva(reserva)"
                data-bs-toggle="modal"
                data-bs-target="#kt_modal_edit_reserva"
                >Editar</router-link
              >
            </div>
            <!--end::Menu item-->
            <!--begin::Menu item-->
            <div class="menu-item px-3">
              <a @click="deleteReserva(reserva.id)" class="menu-link px-3"
                >Delete</a
              >
            </div>
            <!--end::Menu item-->
          </div>
          <!--end::Menu-->
        </template>
      </Datatable>
    </div>
  </div>

  <EditPlanModal :reserva="selectedReserva"></EditPlanModal>
  <ExportReservaModal></ExportReservaModal>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, onMounted, ref } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import type { Sort } from "@/components/kt-datatable//table-partials/models";
import ExportCustomerModal from "@/components/modals/forms/otros/ExportCustomerModal.vue";
import EditReservaModal from "@/components/modals/forms/EditReservaModal.vue";

import type { IReserva } from "@/core/data/reservas";
import reservas from "@/core/data/reservas";
import arraySort from "array-sort";
import { MenuComponent } from "@/assets/ts/components";

export default defineComponent({
  name: "reservas-listing",
  components: {
    Datatable,
    ExportCustomerModal,
    EditReservaModal,
  },
  setup() {
    const tableHeader = ref([
      {
        columnName: "Nombre del cliente",
        columnLabel: "nombrecliente",
        sortEnabled: true,
        columnWidth: 175,
      },
      {
        columnName: "Email",
        columnLabel: "email",
        sortEnabled: true,
        columnWidth: 230,
      },
      {
        columnName: "Numero de factura",
        columnLabel: "numerofactura",
        sortEnabled: true,
        columnWidth: 175,
      },
      {
        columnName: "Estado",
        columnLabel: "estado",
        sortEnabled: true,
        columnWidth: 175,
      },
      {
        columnName: "Fecha de creacion",
        columnLabel: "datecreacion",
        sortEnabled: true,
        columnWidth: 225,
      },
      {
        columnName: "Actions",
        columnLabel: "actions",
        sortEnabled: false,
        columnWidth: 135,
      },
    ]);
    const selectedIds = ref<Array<number>>([]);
    const selectedReserva = ref();
    const tableData = ref<Array<IReserva>>(reservas);
    const initReservas = ref<Array<IReserva>>([]);

    onMounted(() => {
      initReservas.value.splice(0, tableData.value.length, ...tableData.value);
    });

    const editReserva = (reserva: {
      id: number;
      nombrecliente: string;
      email: string;
      numerofactura: string;
      estado: {
        color: string;
        label: string;
      };
      datecreacion: string;
    }) => {
      selectedReserva.value = reserva;
    };

    const deleteFewReservas = () => {
      selectedIds.value.forEach((item) => {
        deleteReserva(item);
      });
      selectedIds.value.length = 0;
    };

    const deleteReserva = (id: number) => {
      for (let i = 0; i < tableData.value.length; i++) {
        if (tableData.value[i].id === id) {
          tableData.value.splice(i, 1);
        }
      }
    };

    const search = ref<string>("");
    const searchItems = () => {
      tableData.value.splice(0, tableData.value.length, ...initReservas.value);
      if (search.value !== "") {
        let results: Array<IReserva> = [];
        for (let j = 0; j < tableData.value.length; j++) {
          if (searchingFunc(tableData.value[j], search.value)) {
            results.push(tableData.value[j]);
          }
        }
        tableData.value.splice(0, tableData.value.length, ...results);
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

    const sort = (sort: Sort) => {
      const reverse: boolean = sort.order === "asc";
      if (sort.label) {
        arraySort(tableData.value, sort.label, { reverse });
      }
    };
    const onItemSelect = (selectedItems: Array<number>) => {
      selectedIds.value = selectedItems;
    };

    return {
      tableData,
      tableHeader,
      deleteReserva,
      search,
      searchItems,
      selectedIds,
      deleteFewReservas,
      sort,
      onItemSelect,
      getAssetPath,
      editReserva,
    };
  },
});
</script>
@/core/data/reservas@/core/data/reservas
