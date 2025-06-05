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
            placeholder="Buscar Oferta"
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
          data-kt-usuario-table-toolbar="base"
        >
          <!--begin::Export-->
          <button
            type="button"
            class="btn btn-light-primary me-3"
            data-bs-toggle="modal"
            data-bs-target="#kt_Ofertas_export_modal"
          >
            <KTIcon icon-name="exit-up" icon-class="fs-2" />
            Export
          </button>
          <!--end::Export-->
          <!--begin::Add usuario-->
          <button
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_add_oferta"
          >
            <KTIcon icon-name="plus" icon-class="fs-2" />
            Añadir Oferta
          </button>
          <!--end::Add usuario-->
        </div>
        <!--end::Toolbar-->
        <!--begin::Group actions-->
        <div
          v-else
          class="d-flex justify-content-end align-items-center"
          data-kt-usuario-table-toolbar="selected"
        >
          <div class="fw-bold me-5">
            <span class="me-2">{{ selectedIds.length }}</span
            >Selected
          </div>
          <button
            type="button"
            class="btn btn-danger"
            @click="deleteFewOfertas()"
          >
            Delete Selected
          </button>
        </div>
        <!--end::Group actions-->
        <!--begin::Group actions-->
        <div
          class="d-flex justify-content-end align-items-center d-none"
          data-kt-usuario-table-toolbar="selected"
        >
          <div class="fw-bold me-5">
            <span
              class="me-2"
              data-kt-usuario-table-select="selected_count"
            ></span
            >Selected
          </div>
          <button
            type="button"
            class="btn btn-danger"
            data-kt-usuario-table-select="delete_selected"
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
        <template v-slot:codigo="{ row: usuario }">
          {{ usuario.codigo }}
        </template>
        <template v-slot:hotel="{ row: usuario }">
          <a href="#" class="text-gray-600 text-hover-primary mb-1">
            {{ usuario.hotel }}
          </a>
        </template>
        <template v-slot:tipooferta="{ row: usuario }">
          {{ usuario.tipooferta }}
        </template>
        <template v-slot:date="{ row: usuario }">
          {{ usuario.date }}
        </template>
        <template v-slot:actions="{ row: usuario }">
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
                to="/apps/usuarios/usuario-details"
                class="menu-link px-3"
                @click="editUsuario(usuario)"
                data-bs-toggle="modal"
                data-bs-target="#kt_modal_edit_oferta"
                >Editar</router-link
              >
            </div>
            <!--end::Menu item-->
            <!--begin::Menu item-->
            <div class="menu-item px-3">
              <a @click="deleteUsuario(usuario.id)" class="menu-link px-3"
                >Eliminar</a
              >
            </div>
            <!--end::Menu item-->
          </div>
          <!--end::Menu-->
        </template>
      </Datatable>
    </div>
  </div>

  <ExportCustomerModal></ExportCustomerModal>
  <AddUserModal></AddUserModal>
  <EditUserModal :user="selectedUser"></EditUserModal>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, onMounted, ref } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import type { Sort } from "@/components/kt-datatable//table-partials/models";
import ExportCustomerModal from "@/components/modals/forms/otros/ExportCustomerModal.vue";
import AddUserModal from "@/components/modals/forms/AddUserModal.vue";
import EditUserModal from "@/components/modals/forms/EditUserModal.vue";
import type { IOferta } from "@/core/data/ofertas";
import ofertas from "@/core/data/ofertas";
import arraySort from "array-sort";
import { MenuComponent } from "@/assets/ts/components";

export default defineComponent({
  name: "ofertas-listing",
  components: {
    Datatable,
    ExportCustomerModal,
    AddUserModal,
    EditUserModal,
  },
  setup() {
    const tableHeader = ref([
      {
        columnName: "Código",
        columnLabel: "codigo",
        sortEnabled: true,
        columnWidth: 175,
      },
      {
        columnName: "Hotel",
        columnLabel: "hotel",
        sortEnabled: true,
        columnWidth: 230,
      },
      {
        columnName: "Tipo de oferta",
        columnLabel: "tipooferta",
        sortEnabled: true,
        columnWidth: 175,
      },
      {
        columnName: "Fecha de creación",
        columnLabel: "date",
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

    const tableData = ref<Array<IOferta>>(ofertas);
    const initOfertas = ref<Array<IOferta>>([]);

    onMounted(() => {
      initOfertas.value.splice(0, tableData.value.length, ...tableData.value);
    });

    const selectedUser = ref();
    const deleteFewOfertas = () => {
      selectedIds.value.forEach((item) => {
        deleteUsuario(item);
      });
      selectedIds.value.length = 0;
    };

    const deleteUsuario = (id: number) => {
      for (let i = 0; i < tableData.value.length; i++) {
        if (tableData.value[i].id === id) {
          tableData.value.splice(i, 1);
        }
      }
    };

    const search = ref<string>("");
    const searchItems = () => {
      tableData.value.splice(0, tableData.value.length, ...initOfertas.value);
      if (search.value !== "") {
        let results: Array<IOferta> = [];
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
    const editUsuario = (user) => {
      selectedUser.value = user; // Set the use
    };

    return {
      tableData,
      tableHeader,
      deleteUsuario,
      search,
      searchItems,
      selectedIds,
      deleteFewOfertas,
      sort,
      onItemSelect,
      getAssetPath,
      editUsuario,
      selectedUser,
    };
  },
});
</script>
