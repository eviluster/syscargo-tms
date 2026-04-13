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
          placeholder="Buscar Contrato"
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
            @click="deleteFewcontratos()"
          >
            Delete Selected
          </button>
        </div>
      </div>
    </div>
    <div class="card-body">
      <KTDatatable
        :header="tableHeader"
        :data="contratos"
        @on-sort="sort"
        :checkbox-enabled="true"
        @on-items-select="onItemSelect"
        @on-items-per-page-change="onItemsPerPageChange"
      >
        <template v-slot:id="{ row: data }">
          {{ data.id }}
        </template>
        <template v-slot:prestatario="{ row: data }">
          {{ data.prestatario }}
        </template>
        <template v-slot:fechaI="{ row: data }">
          {{ formatDate(data.fechaI) }}
        </template>
        <template v-slot:fechaF="{ row: data }">
          {{ formatDate(data.fechaF) }}
        </template>
        <template v-slot:correo="{ row: data }">
          {{ data.correo }}
        </template>
        <template v-slot:serviciosOfrecidos="{ row: data }">
          {{ data.serviciosOfrecidos }}
        </template>
        <template v-slot:tarifasAcordadas="{ row: data }">
          {{ data.tarifasAcordadas }}
        </template>
        <template v-slot:condicionesContractuales="{ row: data }">
          {{ data.condicionesContractuales }}
        </template>
        <template v-slot:notificacionesVencimiento="{ row: data }">
          {{ data.notificacionesVencimiento ? "Sí" : "No" }}
        </template>
        <template v-slot:contrato="{ row: data }">
          <a
            v-if="data.contrato"
            :href="data.contrato"
            target="_blank"
            class="btn btn-sm btn-light btn-active-light-primary"
          >
            Descargar contrato
          </a>
          <span v-else>No hay contrato</span>
        </template>
        <template v-slot:actions="{ row: data }">
          <div>
            <a
              @click="deleteContrato(data.id)"
              class="btn btn-sm btn-light btn-active-light-danger"
              >Delete
            </a>
          </div>
        </template>
      </KTDatatable>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from "vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import arraySort from "array-sort";
import { useContratosStore } from "@/stores/contratos";
import { type IContratos } from "@/core/data/contratos";
import { MenuComponent } from "@/assets/ts/components";

export default defineComponent({
  name: "ListContratos",
  components: {
    KTDatatable,
  },
  setup() {
    const contratosStore = useContratosStore();
    const contratos = computed(() => contratosStore.getProducts);
    const loading = ref<boolean>(false);
    const initCustomers = ref<Array<IContratos>>([]);

    onMounted(() => {
      initCustomers.value.splice(0, contratos.value.length, ...contratos.value);
    });

    const tableHeader = ref([
      {
        columnName: "Prestatario",
        columnLabel: "prestatario",
        sortEnabled: true,
        columnWidth: 100,
      },
      {
        columnName: "Fecha inicio",
        columnLabel: "fechaI",
        sortEnabled: true,
        columnWidth: 50,
      },
      {
        columnName: "Fecha final",
        columnLabel: "fechaF",
        sortEnabled: true,
        columnWidth: 50,
      },
      {
        columnName: "Correo",
        columnLabel: "correo",
        sortEnabled: true,
        columnWidth: 100,
      },
      {
        columnName: "Servicios Ofrecidos",
        columnLabel: "serviciosOfrecidos",
        sortEnabled: true,
        columnWidth: 150,
      },
      {
        columnName: "Tarifas",
        columnLabel: "tarifasAcordadas",
        sortEnabled: true,
        columnWidth: 100,
      },
      {
        columnName: "Condiciones Contractuales",
        columnLabel: "condicionesContractuales",
        sortEnabled: true,
        columnWidth: 150,
      },
      {
        columnName: "Notificaciones",
        columnLabel: "notificacionesVencimiento",
        sortEnabled: true,
        columnWidth: 100,
      },
      {
        columnName: "Contrato",
        columnLabel: "contrato",
        sortEnabled: false,
        columnWidth: 100,
      },
      {
        columnName: "",
        columnLabel: "actions",
        columnWidth: 60,
      },
    ]);

    const sort = (sort: Sort) => {
      const reverse: boolean = sort.order === "asc";
      if (sort.label) {
        arraySort(contratos.value, sort.label, { reverse });
      }
    };

    const deleteContrato = (id: number) => {
      for (let i = 0; i < contratos.value.length; i++) {
        if (contratos.value[i].id === id) {
          contratos.value.splice(i, 1);
        }
      }
    };

    const selectedIds = ref<Array<number>>([]);
    const deleteFewcontratos = () => {
      selectedIds.value.forEach((item) => {
        deleteContrato(item);
      });
      selectedIds.value.length = 0;
    };

    const onItemSelect = (selectedItems: Array<number>) => {
      selectedIds.value = selectedItems;
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

    const search = ref<string>("");
    const searchItems = () => {
      contratos.value.splice(0, contratos.value.length, ...initCustomers.value);
      if (search.value !== "") {
        let results: Array<IContratos> = [];
        for (let j = 0; j < contratos.value.length; j++) {
          if (searchingFunc(contratos.value[j], search.value)) {
            results.push(contratos.value[j]);
          }
        }
        contratos.value.splice(0, contratos.value.length, ...results);
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
    const onItemsPerPageChange = () => {
      setTimeout(() => {
        MenuComponent.reinitialization();
      }, 0);
    };
    return {
      onItemsPerPageChange,
      tableHeader,
      contratos,
      sort,
      deleteContrato,
      deleteFewcontratos,
      selectedIds,
      onItemSelect,
      formatDate,
      loading,
      search,
      searchItems,
    };
  },
});
</script>
