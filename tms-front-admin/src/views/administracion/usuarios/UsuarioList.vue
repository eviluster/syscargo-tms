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
            placeholder="Buscar Usuarios"
          />
        </div>
        <!--end::Search-->
      </div>
      <!--end::Card title-->
      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <div
          v-if="selectedIds.length === 0"
          class="d-flex justify-content-end"
          data-kt-usuario-table-toolbar="base"
        >
          <button
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_add_usuario"
          >
            <KTIcon icon-name="plus" icon-class="fs-2" />
            Añadir Usuario
          </button>
        </div>
        <div
          v-else
          class="d-flex justify-content-end align-items-center"
          data-kt-usuario-table-toolbar="selected"
        >
          <div class="fw-bold me-5">
            <span class="me-2">{{ selectedIds.length }}</span>
            Selected
          </div>
          <button
            type="button"
            class="btn btn-danger"
            @click="deleteFewUsuarios()"
          >
            Delete Selected
          </button>
        </div>
      </div>
      <!--end::Card toolbar-->
    </div>
    <div class="card-body pt-0">
      <Datatable
        @on-sort="sort"
        @on-items-select="onItemSelect"
        :data="filteredData"
        :header="tableHeader"
        :enable-items-per-page-dropdown="true"
        :checkbox-enabled="true"
        checkbox-label="id"
      >
        <template v-slot:name="{ row: usuario }">
          {{ usuario.name }} {{ usuario.lastname }}
        </template>
        <template v-slot:email="{ row: usuario }">
          <a href="#" class="text-gray-600 text-hover-primary mb-1">
            {{ usuario.email }}
          </a>
        </template>
        <template v-slot:phone="{ row: usuario }">
          <a href="#" class="text-gray-600 text-hover-primary mb-1">
            {{ usuario.phone }}
          </a>
        </template>
        <template v-slot:role="{ row: usuario }">
          {{ usuario.role?.name || usuario.role || "-" }}
        </template>
        <template v-slot:actions="{ row: usuario }">
          <!-- Contenedor Dropdown -->
          <div class="dropdown">
            <button
              class="btn btn-sm btn-light btn-active-light-primary dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Actions
            </button>

            <ul
              class="dropdown-menu dropdown-menu-end"
              aria-labelledby="dropdownMenuButton"
            >
              <li class="dropdown-item">
                <a
                  href="#"
                  class="text-decoration-none"
                  @click.prevent="editUsuario(usuario)"
                >
                  Editar
                </a>
              </li>
              <li class="dropdown-item">
                <a
                  href="#"
                  class="text-decoration-none"
                  @click.prevent="LoggerOut(usuario)"
                >
                  Cerrar sesión
                </a>
              </li>
              <li class="dropdown-item">
                <a
                  href="#"
                  class="text-decoration-none"
                  @click.prevent="deleteUsuario(usuario.id)"
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

    <ExportCustomerModal />
    <AddUserModal @created="fetchUsuarios" />
    <EditUserModal v-if="false" :user="selectedUser" @updated="fetchUsuarios" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import ExportCustomerModal from "@/components/modals/forms/otros/ExportCustomerModal.vue";
import AddUserModal from "@/components/modals/forms/AddUserModal.vue";
import EditUserModal from "@/components/modals/forms/EditUserModal.vue";
import arraySort from "array-sort";
import { MenuComponent } from "@/assets/ts/components";
import api from "@/services/api";
import Swal from "sweetalert2/dist/sweetalert2.js";

export default defineComponent({
  name: "usuarios-listing",
  components: {
    Datatable,
    ExportCustomerModal,
    AddUserModal,
    EditUserModal,
  },
  setup() {
    const tableHeader = ref([
      {
        columnName: "Nombre de usuario",
        columnLabel: "name",
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
        columnName: "Número de teléfono",
        columnLabel: "phone",
        sortEnabled: true,
        columnWidth: 230,
      },
      {
        columnName: "Role",
        columnLabel: "role",
        sortEnabled: true,
        columnWidth: 175,
      },
      {
        columnName: "Actions",
        columnLabel: "actions",
        sortEnabled: false,
        columnWidth: 135,
      },
    ]);

    const selectedIds = ref<string[]>([]);
    const tableData = ref<any[]>([]);
    const initUsuarios = ref<any[]>([]);
    const selectedUser = ref<any | null>(null);
    const search = ref<string>("");

    // roles para el select
    const roles = ref<Array<{ id: string; name: string }>>([]);

    const tryFetchRoles = async () => {
      const endpoints = ["/roles", "/roles/all", "/roles/list"];
      for (const ep of endpoints) {
        try {
          const r = await api.get(ep);
          const data = r.data?.data ?? r.data;
          if (Array.isArray(data) && data.length > 0) {
            roles.value = data.map((it: any) =>
              typeof it === "string"
                ? { id: it, name: it }
                : {
                    id: it.id ?? it._id ?? it.name,
                    name: it.name ?? it.role ?? it.id,
                  },
            );
            return;
          }
        } catch (e) {
          // seguir intentando otros endpoints
        }
      }
      // si no se pudo, dejar array vacío y avisar por consola
      console.warn("No se pudo obtener la lista de roles desde el backend");
    };

    const fetchUsuarios = async () => {
      try {
        const res = await api.get<any[]>("/users/all");
        tableData.value = res.data?.data ?? res.data;
        initUsuarios.value = [...tableData.value];
        console.log(tableData.value);
      } catch (e) {
        console.error("Error al cargar usuarios:", e);
      }
    };

    onMounted(async () => {
      Swal.fire({
        title: "Cargando datos...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        showConfirmButton: false,
        heightAuto: false,
      });
      try {
        await Promise.all([fetchUsuarios(), tryFetchRoles()]);
      } catch (error) {
        console.error("Error al obtener los usuarios/roles:", error);
        Swal.fire({
          text: "Error al cargar los datos",
          icon: "error",
          confirmButtonText: "Ok",
          customClass: { confirmButton: "btn btn-primary" },
          heightAuto: false,
        });
        return;
      }

      Swal.close();
    });

    const deleteUsuario = async (id: string) => {
      console.log(id);
      const result = await Swal.fire({
        icon: "warning",
        text: "¿Quieres eliminar este usuario?",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        heightAuto: false,
      });

      if (!result.isConfirmed) return;

      Swal.fire({
        title: "Eliminando usuario...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        showConfirmButton: false,
        heightAuto: false,
      });

      try {
        await api.delete("/users/delete/" + id);
        await fetchUsuarios();

        Swal.close();

        Swal.fire({
          text: "Usuario eliminado correctamente",
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "Ok",
          heightAuto: false,
          customClass: { confirmButton: "btn btn-primary" },
        });
      } catch (error) {
        Swal.close();

        Swal.fire({
          text: "Error al eliminar el usuario",
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "Ok",
          heightAuto: false,
          customClass: { confirmButton: "btn btn-primary" },
        });

        console.error("Error al eliminar el usuario:", error);
      }
    };

    const deleteFewUsuarios = () => {
      Promise.all(
        selectedIds.value.map((id) => api.delete("/users/delete/" + id)),
      )
        .then(fetchUsuarios)
        .catch((e) => console.error(e));
      selectedIds.value = [];
    };

    const LoggerOut = async (usuario: any) => {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esto cerrará la sesión de " + usuario.name,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí",
      });

      if (!result.isConfirmed) return;

      try {
        await api.post("/auth/logged-out", { id: usuario.id });
        await Swal.fire({
          title: "Sesión cerrada",
          text: "Has cerrado la sesión",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
      } catch (err) {
        console.error("Error cerrando sesión remota:", err);
        await Swal.fire({
          title: "Error",
          text: err?.response?.data?.message || "Error cerrando sesión",
          icon: "error",
        });
      }
    };

    const sort = (s: Sort) => {
      const reverse = s.order === "asc";
      if (s.label) arraySort(tableData.value, s.label, { reverse });
    };

    const onItemSelect = (items: string[]) => {
      selectedIds.value = items;
    };

    // ---------- NUEVO: edición in-place con SELECT de roles ----------
    const editUsuario = async (user: any) => {
      try {
        selectedUser.value = user;

        // Si no cargamos roles aún, forzamos fetch
        if (!roles.value.length) {
          await tryFetchRoles();
        }

        // construir options HTML para el select
        const currentRoleId = user.role?.id ?? user.role ?? "";
        const optionsHtml = (roles.value || [])
          .map(
            (r) =>
              `<option value="${r.id}" ${
                String(r.id) === String(currentRoleId) ? "selected" : ""
              }>${r.name}</option>`,
          )
          .join("");

        // build html form for swal (incluye select editable de role)
        const html = `
          <div class="row">
            <div class="col-12 mb-2">
              <label class="form-label">Role</label>
              <select id="swal-role-select" class="form-control">
                ${optionsHtml}
              </select>
            </div>
            <div class="col-md-6 mb-2">
              <label class="form-label">Nombre</label>
              <input id="swal-name" class="form-control" value="${(user.name ?? "").toString().replace(/"/g, "")}" />
            </div>
            <div class="col-md-6 mb-2">
              <label class="form-label">Apellido</label>
              <input id="swal-lastname" class="form-control" value="${(user.lastname ?? "").toString().replace(/"/g, "")}" />
            </div>
            <div class="col-md-6 mb-2">
              <label class="form-label">Email</label>
              <input id="swal-email" class="form-control" value="${(user.email ?? "").toString().replace(/"/g, "")}" />
            </div>
            <div class="col-md-6 mb-2">
              <label class="form-label">Teléfono</label>
              <input id="swal-phone" class="form-control" value="${(user.phone ?? "").toString().replace(/"/g, "")}" />
            </div>
            <div class="col-md-6 mb-2">
              <label class="form-label">Username</label>
              <input id="swal-username" class="form-control" value="${(user.username ?? "").toString().replace(/"/g, "")}" />
            </div>
            <div class="col-md-6 mb-2">
              <label class="form-label">Password (dejar vacío si no cambia)</label>
              <input id="swal-password" type="password" class="form-control" value="" />
            </div>
          </div>
        `;

        const result = await Swal.fire({
          title: `Editar usuario: ${user.name || ""}`,
          html,
          focusConfirm: false,
          showCancelButton: true,
          confirmButtonText: "Guardar",
          width: "700px",
          preConfirm: () => {
            const name = (
              document.getElementById("swal-name") as HTMLInputElement
            ).value;
            const lastname = (
              document.getElementById("swal-lastname") as HTMLInputElement
            ).value;
            const email = (
              document.getElementById("swal-email") as HTMLInputElement
            ).value;
            const phone = (
              document.getElementById("swal-phone") as HTMLInputElement
            ).value;
            const username = (
              document.getElementById("swal-username") as HTMLInputElement
            ).value;
            const password = (
              document.getElementById("swal-password") as HTMLInputElement
            ).value;
            const role = (
              document.getElementById("swal-role-select") as HTMLSelectElement
            ).value;

            if (!name || !email) {
              Swal.showValidationMessage("Nombre y email son requeridos");
              return;
            }

            return { name, lastname, email, phone, username, password, role };
          },
        });

        if (!result.isConfirmed || !result.value) return;

        const payload: any = {
          name: result.value.name,
          lastname: result.value.lastname,
          email: result.value.email,
          phone: result.value.phone,
          username: result.value.username,
          role: result.value.role, // enviamos el id del role
        };
        if (result.value.password && result.value.password.trim() !== "") {
          payload.password = result.value.password;
        }

        Swal.fire({
          title: "Guardando...",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
          showConfirmButton: false,
        });

        const id = user.id;
        await api.put(`/users/edit/${id}`, payload);

        await fetchUsuarios();
        Swal.close();
        await Swal.fire({
          title: "Usuario actualizado",
          text: "Los datos se han guardado correctamente",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
      } catch (err: any) {
        console.error("Error editando usuario:", err);
        Swal.close();
        await Swal.fire({
          title: "Error",
          text:
            err?.response?.data?.message ||
            err.message ||
            "Error al actualizar usuario",
          icon: "error",
        });
      }
    };

    return {
      tableData,
      tableHeader,
      selectedIds,
      selectedUser,
      search,
      LoggerOut,
      fetchUsuarios,
      deleteUsuario,
      deleteFewUsuarios,
      sort,
      onItemSelect,
      editUsuario,
      roles,
      filteredData: computed(() => {
        if (!search.value) return tableData.value;
        const q = search.value.toLowerCase();
        return tableData.value.filter((u) =>
          [
            u.name,
            u.lastname,
            u.email,
            u.username,
            (u.role && (u.role.name ?? u.role)) || "",
            u.phone,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(q),
        );
      }),
    };
  },
});
</script>
