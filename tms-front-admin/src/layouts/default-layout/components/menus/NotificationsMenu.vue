<template>
  <!--begin::Menu-->
  <div
    class="menu menu-sub menu-sub-dropdown menu-column w-350px w-lg-375px"
    data-kt-menu="true"
  >
    <!--begin::Heading-->
    <div
      class="d-flex flex-column bgi-no-repeat rounded-top"
      :style="`background-image: url('${getAssetPath(
        '/media/misc/menu-header-bg.jpg',
      )}')`"
    >
      <!--begin::Title-->
      <h3 class="text-white fw-semibold px-9 mt-10 mb-6">
        Notificaciones
        <span class="fs-8 opacity-75 ps-3"
          >{{ notificationsAll.length }} items</span
        >
      </h3>
      <!--end::Title-->

      <!--begin::Tabs-->
      <ul
        class="nav nav-line-tabs nav-line-tabs-2x nav-stretch fw-semibold px-9"
      >
        <li class="nav-item">
          <a
            class="nav-link text-white opacity-75 opacity-state-100 pb-4 active"
            data-bs-toggle="tab"
            href="#kt_topbar_notifications_1"
            >Todas</a
          >
        </li>

        <li class="nav-item">
          <a
            class="nav-link text-white opacity-75 opacity-state-100 pb-4"
            data-bs-toggle="tab"
            href="#kt_topbar_notifications_2"
            >Leídas</a
          >
        </li>
      </ul>
      <!--end::Tabs-->
    </div>
    <!--end::Heading-->

    <!--begin::Tab content-->
    <div class="tab-content">
      <!-- ALL -->
      <div
        class="tab-pane fade show active"
        id="kt_topbar_notifications_1"
        role="tabpanel"
      >
        <div class="scroll-y mh-360px my-4 px-3">
          <template
            v-for="(item, index) in notificationsAll"
            :key="item.id || index"
          >
            <div
              class="notification-item d-flex align-items-start gap-3 py-3 px-2"
              :class="{ 'notification-read': itemIsRead(item) }"
            >
              <!-- ICON -->
              <div class="notif-icon flex-shrink-0">
                <div class="symbol symbol-40px">
                  <span class="symbol-label bg-light">
                    <i :class="iconForItem(item)"></i>
                  </span>
                </div>
              </div>

              <!-- CONTENT -->
              <div class="notif-content flex-grow-1">
                <a
                  href="#"
                  @click.prevent="openNotificationLink(item)"
                  :class="[
                    'notif-message',
                    itemIsRead(item) ? 'text-muted' : 'text-dark fw-bold',
                  ]"
                >
                  {{ getMessage(item) }}
                </a>

                <div
                  class="notif-subtitle small text-muted mt-1"
                  v-if="getSubtitle(item)"
                >
                  {{ getSubtitle(item) }}
                </div>

                <!-- acciones compactas -->
                <div class="notif-actions d-flex align-items-center gap-1 mt-2">
                  <!-- Ver más: abre modal con texto completo -->
                  <button
                    class="btn btn-sm btn-outline-secondary btn-action"
                    @click.prevent="showFullMessage(item)"
                    title="Ver mensaje completo"
                  >
                    <i class="bi bi-file-text"></i>
                    <span class="d-none d-md-inline ms-1">Ver más</span>
                  </button>

                  <button
                    class="btn btn-sm btn-outline-secondary btn-action"
                    @click.prevent="toggleReadForCurrentUser(item)"
                    :title="
                      itemIsRead(item)
                        ? 'Marcar como no leído'
                        : 'Marcar como leído'
                    "
                  >
                    <i
                      :class="
                        itemIsRead(item)
                          ? 'bi bi-eye-slash-fill'
                          : 'bi bi-eye-fill'
                      "
                    ></i>
                  </button>

                  <button
                    v-if="canShowConfirmButton(item)"
                    class="btn btn-sm btn-success btn-action"
                    @click.prevent="confirmAssignmentFromNotification(item)"
                    title="Confirmar asignación"
                  >
                    <i class="bi bi-check-lg me-1"></i>
                    <span class="d-none d-md-inline">Confirmar</span>
                  </button>

                  <button
                    class="btn btn-sm btn-light btn-action"
                    @click.prevent="deleteNotification(item)"
                    title="Eliminar"
                  >
                    <i class="bi bi-x-lg text-danger"></i>
                  </button>
                </div>
              </div>

              <!-- TIME -->
              <div class="notif-meta text-end flex-shrink-0 ms-2">
                <div class="small text-muted">{{ formatTime(item) }}</div>
              </div>
            </div>
          </template>

          <div
            v-if="notificationsAll.length === 0"
            class="text-center py-4 text-muted"
          >
            No hay notificaciones.
          </div>
        </div>

        <div class="py-2 text-center border-top">
          <button
            class="btn btn-color-danger-600 btn-active-color-primary btn-sm"
            @click="markAllAsRead"
          >
            Marcar todas como leídas
          </button>
        </div>
      </div>

      <!-- READ -->
      <div class="tab-pane fade" id="kt_topbar_notifications_2" role="tabpanel">
        <div class="scroll-y mh-360px my-4 px-3">
          <template
            v-for="(item, index) in notificationsRead"
            :key="item.id || index"
          >
            <div
              class="notification-item d-flex align-items-center gap-3 py-3 px-2 notification-read"
            >
              <div class="notif-icon flex-shrink-0">
                <div class="symbol symbol-40px">
                  <span class="symbol-label bg-light">
                    <i class="bi bi-bell"></i>
                  </span>
                </div>
              </div>

              <div class="flex-grow-1">
                <a
                  href="#"
                  class="fs-6 text-muted"
                  @click.prevent="openNotificationLink(item)"
                >
                  {{ getMessage(item) }}
                </a>
              </div>

              <div class="flex-shrink-0 text-end">
                <div class="small text-muted">{{ formatTime(item) }}</div>
                <div class="mt-1">
                  <a
                    @click.prevent="deleteNotification(item)"
                    style="cursor: pointer"
                    title="Eliminar"
                  >
                    <i class="bi bi-x-circle-fill text-danger"></i>
                  </a>
                </div>
              </div>
            </div>
          </template>

          <div
            v-if="notificationsRead.length === 0"
            class="text-center py-4 text-muted"
          >
            No hay notificaciones leídas.
          </div>
        </div>

        <div class="py-2 text-center border-top">
          <button
            class="btn btn-color-danger-600 btn-active-color-primary btn-sm"
            @click="deleteAllRead"
          >
            Eliminar todas
          </button>
        </div>
      </div>
    </div>
    <!--end::Tab content-->
  </div>
  <!--end::Menu-->
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, nextTick } from "vue";
import { getAssetPath } from "@/core/helpers/assets";
import api from "@/services/api";
import { Tooltip } from "bootstrap";
import { useAuthStore } from "@/stores/auth";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "notifications-menu",
  setup() {
    const router = useRouter();
    const auth = useAuthStore();
    const currentUserId = computed(
      () => auth.user?.id ?? auth.user?.userId ?? null,
    );
    const notificationsAll = ref<any[]>([]);

    const getDestinyArray = (item: any) => {
      if (!item) return [];
      return (
        item.destinyUser ||
        item.destinations ||
        item.targets ||
        item.destiny ||
        []
      );
    };

    const findCurrentDestinationEntry = (item: any) => {
      const dests = getDestinyArray(item);
      if (!Array.isArray(dests) || dests.length === 0) return null;
      if (!currentUserId.value) return dests[0] || null;
      return (
        dests.find(
          (d: any) =>
            d.userId === currentUserId.value ||
            d.user_id === currentUserId.value ||
            d.id === currentUserId.value ||
            d.user?.id === currentUserId.value,
        ) || null
      );
    };

    async function getRejectionReasonFromItem(
      item: any,
    ): Promise<string | null> {
      // intenta leer proposalId desde varias ubicaciones
      const proposalId =
        item?.meta?.proposalId ||
        item?.proposalId ||
        item?.meta?.proposal ||
        null;
      if (!proposalId) return null;

      // helper para intentar GET en dos endpoints
      async function tryGetProposal(
        id: string,
        base: "proposals" | "proposals_alquiler",
      ) {
        try {
          const res = await api.get(`/${base}/${id}`);
          return res?.data?.data ?? res?.data ?? res;
        } catch (e: any) {
          // propaga la excepción para que el caller decida fallback
          throw e;
        }
      }

      // Primero prueba en /proposals/:id, si 404 -> /proposals_alquiler/:id
      try {
        const p = await tryGetProposal(proposalId, "proposals");
        // posibles candidatas de mensaje
        const reasonCandidates = [p?.message, p?.meta?.message, p?.reason];
        for (const rc of reasonCandidates) {
          if (rc !== undefined && rc !== null && String(rc).trim() !== "")
            return String(rc);
        }
      } catch (err: any) {
        // si el error indica not found, intentamos proposals_alquiler
        const status = err?.response?.status;
        const msg = err?.response?.data?.message || "";
        if (
          status === 404 ||
          /not found/i.test(msg) ||
          /no encontrada/i.test(msg)
        ) {
          try {
            const p2 = await tryGetProposal(proposalId, "proposals_alquiler");
            const reasonCandidates = [
              p2?.message,
              p2?.meta?.message,
              p2?.reason,
            ];
            for (const rc of reasonCandidates) {
              if (rc !== undefined && rc !== null && String(rc).trim() !== "")
                return String(rc);
            }
          } catch (e2) {
            // no crítico: si falla también aquí, devolvemos null
            console.warn(
              "No se pudo obtener proposal_alquiler para motivo:",
              e2,
            );
            return null;
          }
        } else {
          console.warn("Error obteniendo proposal (no fallback):", err);
          return null;
        }
      }

      return null;
    }
    async function showFullMessage(item: any) {
      try {
        // mensaje principal y subtítulo
        const msg = escapeHtml(getMessage(item) ?? "");
        const sub = escapeHtml(getSubtitle(item) ?? "");

        // intentar obtener motivo de rechazo (si aplica)
        let reasonText: string | null = null;
        try {
          reasonText = await getRejectionReasonFromItem(item);
          console.log(reasonText);
        } catch (e) {
          console.warn("Error obteniendo motivo de rechazo:", e);
          reasonText = null;
        }

        // construir HTML del modal (seguro)
        let combinedHtml = `<div style="text-align:left; white-space:pre-wrap;" class="text-white">${msg}${
          sub ? `<hr/><small class="text-muted">${sub}</small>` : ""
        }</div>`;

        if (reasonText && String(reasonText).trim() !== "...optional") {
          combinedHtml += `<hr/><div style="text-align:left;"><strong>Motivo del rechazo:</strong><div style="margin-top:6px; white-space:pre-wrap;">${escapeHtml(
            reasonText,
          )}</div></div>`;
        }

        await Swal.fire({
          title: `<strong style="color:white;">${item.title}</strong> `,
          html: combinedHtml,
          showCloseButton: true,
          showCancelButton: false,
          confirmButtonText: "Cerrar",
          width: 720,
          heightAuto: false,
        });
      } catch (err) {
        console.error("Error mostrando mensaje completo:", err);
        await Swal.fire(
          "Notificación",
          getMessage(item) || "Sin mensaje",
          "info",
        );
      }
    }

    // helper para evitar inyección si getMessage devuelve HTML
    function escapeHtml(unsafe: string) {
      if (!unsafe && unsafe !== "") return "";
      return String(unsafe)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    const itemIsRead = (item: any): boolean => {
      const entry = findCurrentDestinationEntry(item);
      if (entry)
        return !!(entry.isReaded || entry.isRead || entry.read || entry.readed);
      return !!(item.isRead || item.read || item.isReaded);
    };

    const getMessage = (item: any) =>
      item?.message || item?.title || item?.body || "Notificación";
    const getSubtitle = (item: any) => item?.subtitle || item?.context || "";
    const formatTime = (item: any) => {
      const dateStr =
        item?.time || item?.createdAt || item?.created_at || item?.created;
      if (!dateStr) return "";
      try {
        return new Date(dateStr).toLocaleString();
      } catch {
        return String(dateStr);
      }
    };
    const iconForItem = (item: any) => {
      const type = item?.type || item?.notificationType || "";
      if (type?.toString().toLowerCase().includes("proposal"))
        return "bi bi-bell-fill";
      return "bi bi-bell";
    };
    const notificationsRead = computed(() =>
      notificationsAll.value.filter((it) => itemIsRead(it)),
    );

    onMounted(async () => {
      await fetchNotifications();
      await nextTick();
      document
        .querySelectorAll('[data-bs-toggle="tooltip"]')
        .forEach((el) => new Tooltip(el));
    });

    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notification/all");
        const data = Array.isArray(res.data)
          ? res.data
          : (res.data?.data ?? res.data);
        notificationsAll.value = data || [];
        notificationsAll.value.sort(
          (a: any, b: any) =>
            new Date(b.createdAt || b.created_at || b.time || 0).getTime() -
            new Date(a.createdAt || a.created_at || a.time || 0).getTime(),
        );
      } catch (err) {
        console.error("Error fetching notifications", err);
      }
    };

    const toggleReadForCurrentUser = async (item: any) => {
      try {
        const entry = findCurrentDestinationEntry(item);
        const toggled = !itemIsRead(item);
        const payload: any = { notificationId: item.id, isReaded: toggled };
        if (entry)
          payload.destinationId =
            entry.id || entry.destinationId || entry.userId || entry.user_id;
        await api.post("/notification/read", payload);
        await fetchNotifications();
      } catch (err) {
        console.error("Error toggling read", err);
        Swal.fire("Error", "No se pudo marcar la notificación", "error");
      }
    };

    const markAllAsRead = async () => {
      try {
        const unread = notificationsAll.value.filter((it) => !itemIsRead(it));
        if (!unread.length) {
          Swal.fire("Información", "No hay notificaciones sin leer", "info");
          return;
        }
        await Promise.all(
          unread.map(async (n) => {
            const entry = findCurrentDestinationEntry(n);
            const payload: any = { notificationId: n.id, isReaded: true };
            if (entry)
              payload.destinationId =
                entry.id ||
                entry.destinationId ||
                entry.userId ||
                entry.user_id;
            try {
              await api.post("/notification/read", payload);
            } catch (err) {
              console.warn("Could not mark notification read", n.id, err);
            }
          }),
        );
        await fetchNotifications();
        Swal.fire(
          "Ok",
          "Todas las notificaciones marcadas como leídas",
          "success",
        );
      } catch (err) {
        console.error("Error marking all read", err);
        Swal.fire("Error", "No se pudo marcar todas como leídas", "error");
      }
    };

    const deleteNotification = async (item: any) => {
      try {
        const confirm = await Swal.fire({
          title: "Eliminar notificación",
          text: "¿Estás seguro de eliminar esta notificación?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, eliminar",
        });
        if (!confirm.isConfirmed) return;
        try {
          await api.delete(`/notification/${item.id}`);
        } catch (err) {
          await api.put("/notification/active", { id: item.id, active: false });
        }
        await fetchNotifications();
        Swal.fire("Ok", "Notificación eliminada", "success");
      } catch (err) {
        console.error("Error deleting notification", err);
        Swal.fire("Error", "No se pudo eliminar la notificación", "error");
      }
    };

    const deleteAllRead = async () => {
      try {
        const readList = notificationsAll.value.filter((it) => itemIsRead(it));
        if (!readList.length) {
          Swal.fire(
            "Información",
            "No hay notificaciones leídas para eliminar",
            "info",
          );
          return;
        }
        await Promise.all(
          readList.map(async (n) => {
            try {
              await api.delete(`/notification/${n.id}`);
            } catch {
              try {
                await api.put("/notification/active", {
                  id: n.id,
                  active: false,
                });
              } catch (e) {
                console.warn("Could not delete notification", n.id, e);
              }
            }
          }),
        );
        await fetchNotifications();
        Swal.fire("Ok", "Notificaciones eliminadas", "success");
      } catch (err) {
        console.error("Error deleting all read notifications", err);
        Swal.fire(
          "Error",
          "No se pudieron eliminar todas las notificaciones leídas",
          "error",
        );
      }
    };

    const openNotificationLink = async (item: any) => {
      try {
        const entry = findCurrentDestinationEntry(item);
        if (!itemIsRead(item)) {
          const payload: any = { notificationId: item.id, isReaded: true };
          if (entry)
            payload.destinationId =
              entry.id || entry.destinationId || entry.userId || entry.user_id;
          await api.post("/notification/read", payload);
        }
        const link = item?.link || (item?.meta && item.meta.link);
        if (link) {
          if (typeof link === "string" && link.startsWith("/"))
            router.push(link);
          else window.open(link, "_blank");
        } else {
          await fetchNotifications();
        }
      } catch (err) {
        console.error("Error opening link", err);
        await fetchNotifications();
      }
    };

    // Decide si mostrar el botón "Confirmar asignación"
    const canShowConfirmButton = (item: any): boolean => {
      const action = item?.meta?.action || item?.action || null;
      if (action !== "confirm_assignment") return false;

      // si la notificación ya fue confirmada localmente o por destino, no mostrar
      const alreadyConfirmed =
        !!item?.meta?.confirmed ||
        !!item?.confirmed ||
        !!findCurrentDestinationEntry(item)?.confirmed;
      if (alreadyConfirmed) return false;

      // Verificar que exista proposalId
      const hasProposalId = !!(
        item?.meta?.proposalId ||
        item?.meta?.proposal ||
        item?.proposalId
      );
      if (!hasProposalId) return false;

      // además, sólo el destinatario (cliente) o admin debería ver el botón -> comprobación mínima:
      const rn = auth.user?.role?.name?.toString?.().toLowerCase?.() ?? "";
      if (rn === "administrador" || rn === "admin") return true;

      const entry = findCurrentDestinationEntry(item);
      if (!entry) return true; // fallback: mostrar si no podemos comprobar
      const destUserId =
        entry?.userId ?? entry?.user_id ?? entry?.id ?? entry?.destinationId;
      if (
        currentUserId.value &&
        destUserId &&
        String(destUserId) !== String(currentUserId.value)
      )
        return false;

      return true;
    };

    const confirmAssignmentFromNotification = async (item: any) => {
      try {
        const proposalId =
          item?.meta?.proposalId || item?.meta?.proposal || item?.proposalId;
        if (!proposalId) {
          Swal.fire(
            "Error",
            "No se encontró proposalId en la notificación",
            "error",
          );
          return;
        }

        const ok = await Swal.fire({
          title: "Confirmar asignación",
          text: "¿Confirmas la asignación de la carga al prestatario?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Confirmar",
          customClass: { title: "swal2-dark-title" },
        });
        if (!ok.isConfirmed) return;

        // Intento primario -> /proposals/:id/confirm
        // Si devuelve 404 ("Proposal no encontrada") intentamos /proposals_alquiler/:id/confirm
        let res: any = null;
        try {
          res = await api.post(`/proposals/${proposalId}/confirm`);
        } catch (err: any) {
          const status = err?.response?.status;
          const message = err?.response?.data?.message || "";
          // Si no existe en 'proposals', hacemos fallback a 'proposals_alquiler'
          if (
            status === 404 ||
            /no encontrada/i.test(String(message)) ||
            /not found/i.test(String(message))
          ) {
            try {
              res = await api.post(`/proposals_alquiler/${proposalId}/confirm`);
            } catch (err2: any) {
              // falló también el fallback -> mostrar error
              console.error("Error confirmando en proposals_alquiler:", err2);
              Swal.fire(
                "Error",
                err2?.response?.data?.message ||
                  err2?.message ||
                  "No se pudo confirmar la asignación",
                "error",
              );
              return;
            }
          } else {
            // otro error distinto a 404 en la primera llamada
            console.error("Error confirmando proposal:", err);
            Swal.fire(
              "Error",
              err?.response?.data?.message ||
                err?.message ||
                "No se pudo confirmar la asignación",
              "error",
            );
            return;
          }
        }

        // ok: res contiene la respuesta del endpoint que funcionó
        const cargaId = res.data?.carga?.id ?? res.data?.cargaId ?? null;
        const proposalUsedId = proposalId;

        // disparar eventos globales para refrescar UI en otros componentes
        window.dispatchEvent(
          new CustomEvent("carga-confirmada", {
            detail: { proposalId: proposalUsedId, cargaId },
          }),
        );
        window.dispatchEvent(
          new CustomEvent("refresh-proposals", {
            detail: { proposalId: proposalUsedId, cargaId },
          }),
        );

        // marcar la notificación como leída (mismo comportamiento que antes)
        const entry = findCurrentDestinationEntry(item);
        const payload: any = { notificationId: item.id, isReaded: true };
        if (entry)
          payload.destinationId =
            entry.id || entry.destinationId || entry.userId || entry.user_id;
        try {
          await api.post("/notification/read", payload);
        } catch (e) {
          // no crítico
        }

        // marcar localmente para ocultar el botón inmediatamente
        if (!item.meta) item.meta = {};
        item.meta.confirmed = true;

        await fetchNotifications();
        Swal.fire("Ok", "Asignación confirmada", "success");
      } catch (err: any) {
        console.error("Error confirming assignment (generic):", err);
        Swal.fire(
          "Error",
          err?.response?.data?.message ||
            err?.message ||
            "No se pudo confirmar la asignación",
          "error",
        );
      }
    };

    return {
      getAssetPath,
      notificationsAll,
      notificationsRead,
      showFullMessage,
      getRejectionReasonFromItem,
      formatTime,
      getMessage,
      getSubtitle,
      itemIsRead,
      toggleReadForCurrentUser,
      markAllAsRead,
      deleteNotification,
      deleteAllRead,
      openNotificationLink,
      canShowConfirmButton,
      confirmAssignmentFromNotification,
      iconForItem,
    };
  },
});
</script>

<style scoped>
.notification-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  transition: background 0.12s ease;
}

.notification-item:hover {
  background: rgba(255, 255, 255, 0.02);
}

.notification-read .notif-message {
  opacity: 0.8;
}

/* icon */
.notif-icon .symbol {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

/* message truncation to 2 lines */
.notif-message {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.15;
  max-height: 2.5em; /* safe fallback */
  color: white !important;
}

/* subtitle smaller */
.notif-subtitle {
  font-size: 0.82rem;
}

/* compact action buttons */
.notif-actions .btn-action {
  min-width: 36px;
  height: 32px;
  padding: 0 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-size: 0.9rem;
}

/* small screens: hide text on confirm button */
@media (max-width: 575px) {
  .notif-actions .btn-success span {
    display: none;
  }
}

/* scroll area */
.mh-360px {
  max-height: 360px;
  overflow: auto;
}

/* adjust timestamp */
.notif-meta .small {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.65);
}
.symbol {
  width: 35px;
  height: 35px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
}

.swal2-popup.swal2-modal.swal2-show h2 {
  color: white !important;
}
</style>
