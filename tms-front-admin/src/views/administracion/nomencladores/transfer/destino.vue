<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import AddDestinoModal from "@/components/modals/forms/transfer/AddDestinoModal.vue";
import EditDestinoModal from "@/components/modals/forms/transfer/EditDestinoModal.vue";
import api from "@/services/api";
import { useDestinoStore } from "@/stores/destino";
import arraySort from "array-sort";
import { MenuComponent } from "@/assets/ts/components";
import Swal from "sweetalert2/dist/sweetalert2.js";

export default defineComponent({
  name: "CustomersListing",
  components: {
    Datatable,
    AddDestinoModal,
    EditDestinoModal,
  },
  setup() {
    const tableHeader = ref([
      {
        columnName: "Nombre",
        columnLabel: "name",
        sortEnabled: true,
        columnWidth: 250,
      },
      {
        columnName: "Descripcion",
        columnLabel: "description",
        sortEnabled: true,
        columnWidth: 230,
      },
      {
        columnName: "Actions",
        columnLabel: "actions",
        sortEnabled: false,
        columnWidth: 135,
      },
    ]);
    const destinoStore = useDestinoStore();
    // Datos reactivos
    const destinos = computed(() => destinoStore.destinoes);

    const tableData = computed(() => destinos.value);
    const initCustomers = ref<any[]>([]);
    const selectedIds = ref<string[]>([]);
    const search = ref<string>("");
    const selectedDestino = ref<any>(null);

    type Sort = {
      label: string;
      order: "asc" | "desc";
    };

    // Refresca tableData e initCustomers a partir de las destinos
    const refreshTableData = () => {
      console.log(tableData.value);

      initCustomers.value = [...tableData.value];
      console.log(initCustomers.value);
    };

    onMounted(async () => {
      await destinoStore.fetchDestinos();
      refreshTableData();
    });

    const deleteDestino = async (id: string) => {
      const result = await Swal.fire({
        icon: "warning",
        text: "¿Quieres eliminar esta destino?",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (!result.isConfirmed) {
        return;
      } else {
        await destinoStore.deleteDestino(id);
        Swal.fire({
          text: "Destino eliminada correctamente",
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "Ok",
          heightAuto: false,
          customClass: {
            confirmButton: "btn btn-primary",
          },
        });
      }
      await destinoStore.fetchDestinos(); // Recargar las destinos
    };

    const deleteFewDestinos = () => {
      selectedIds.value.forEach((id) => deleteDestino(id));
      selectedIds.value = [];
    };

    // const searchItems = async () => {
    //   const query = search.value.trim();
    //   if (query) {
    //     console.log(query);
    //     try {
    //       const { data } = await api.get("/destinos/search-by-field", {
    //         params: {
    //           "name.es": query,
    //           "name.en": "",
    //           "description.es": "",
    //           "description.en": "",
    //         },
    //       });
    //       console.log(data.data);

    //       if (data.isSuccess) {
    //         tableData.value = data.data;
    //       } else {
    //         tableData.value = [];
    //       }
    //     } catch (error) {
    //       console.error("Error al realizar la búsqueda:", error);
    //       tableData.value = [];
    //     }
    //   } else {
    //     // Si no hay término de búsqueda, se restauran los datos iniciales
    //     tableData.value = [...initCustomers.value];
    //   }
    //   if (
    //     typeof MenuComponent !== "undefined" &&
    //     MenuComponent.reinitialization
    //   ) {
    //     MenuComponent.reinitialization();
    //   }
    // };

    // Ordena la tabla según el criterio recibido
    const sort = (sort: Sort) => {
      const reverse: boolean = sort.order === "asc";
      if (sort.label) {
        arraySort(tableData.value, sort.label, { reverse });
      }
    };

    // Actualiza la lista de IDs seleccionados
    const onItemSelect = (selectedItems: string[]) => {
      selectedIds.value = selectedItems;
    };

    // Asigna la destino seleccionada para edición
    const editDestino = (destino: any) => {
      selectedDestino.value = destino;
    };

    return {
      tableHeader,
      tableData,
      destinos,
      search,
      selectedIds,
      selectedDestino,
      deleteDestino,
      deleteFewDestinos,
      // searchItems,
      sort,
      onItemSelect,
      editDestino,
    };
  },
});
</script>

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
            class="form-control form-control-solid w-250px ps-15"
            placeholder="Buscar destino"
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
          data-kt-customer-table-toolbar="base"
        >
          <!--begin::Add Destino-->
          <button
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_add_destino"
          >
            <KTIcon icon-name="plus" icon-class="fs-2" />
            Añadir destino
          </button>
          <!--end::Add destino-->
        </div>
        <!--end::Toolbar-->
        <!--begin::Group actions-->
        <div
          v-else
          class="d-flex justify-content-end align-items-center"
          data-kt-destino-table-toolbar="selected"
        >
          <div class="fw-bold me-5">
            <span class="me-2">{{ selectedIds.length }}</span
            >Selected
          </div>
          <button
            type="button"
            class="btn btn-danger"
            @click="deleteFewDestinos()"
          >
            Delete Selected
          </button>
        </div>
        <!--end::Group actions-->
        <!--begin::Group actions-->
        <div
          class="d-flex justify-content-end align-items-center d-none"
          data-kt-destino-table-toolbar="selected"
        >
          <div class="fw-bold me-5">
            <span
              class="me-2"
              data-kt-destino-table-select="selected_count"
            ></span
            >Selected
          </div>
          <button
            type="button"
            class="btn btn-danger"
            data-kt-destino-table-select="delete_selected"
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
        <template v-slot:name="{ row: destino }">
          {{ destino.name }}
        </template>
        <template v-slot:description="{ row: destino }">
          <a href="#" class="text-gray-600 text-hover-primary mb-1">
            {{ destino.description }}
          </a>
        </template>
        <template v-slot:actions="{ row: destino }">
          <!-- Contenedor Dropdown -->
          <div class="dropdown">
            <!-- Botón que despliega el menú (se usa data-bs-toggle="dropdown") -->
            <button
              class="btn btn-sm btn-light btn-active-light-primary dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Actions
            </button>

            <!-- Menú desplegable -->
            <ul
              class="dropdown-menu dropdown-menu-end"
              aria-labelledby="dropdownMenuButton"
            >
              <li class="dropdown-item">
                <router-link
                  to="/apps/destinos/destino-details"
                  class="text-decoration-none"
                  @click="editDestino(destino)"
                  data-bs-toggle="modal"
                  data-bs-target="#kt_modal_edit_destino"
                >
                  Editar
                </router-link>
              </li>
              <li class="dropdown-item">
                <a
                  href="#"
                  class="text-decoration-none"
                  @click.prevent="deleteDestino(destino.id)"
                >
                  Delete
                </a>
              </li>
            </ul>
          </div>
          <!--end::Menu-->
        </template>
      </Datatable>
    </div>
  </div>

  <ExportCustomerModal></ExportCustomerModal>
  <EditDestinoModal :destino="selectedDestino"></EditDestinoModal>
  <AddDestinoModal></AddDestinoModal>
</template>

<style scoped></style>
