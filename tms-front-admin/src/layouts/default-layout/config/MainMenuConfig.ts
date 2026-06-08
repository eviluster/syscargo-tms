// src/layouts/default-layout/config/MainMenuConfig.ts
import type { MenuItem } from "@/layouts/default-layout/config/types";
import { ref, computed, watch, onMounted } from "vue";
import { useAppStore } from "@/stores/store";
import { useCookies } from "vue3-cookies";
import api from "@/services/api";

export default function useDynamicMenu() {
  const { cookies } = useCookies();
  const store = useAppStore();
  const menuItems = ref<Array<MenuItem>>([]);

  const roleName = ref<string>("");
  const userData = ref<any | null>(null);
  const prestatario = ref<any | null>(null);

  function parseUserData(raw: any) {
    if (!raw) return null;
    try {
      return typeof raw === "string" ? JSON.parse(raw) : raw;
    } catch {
      return raw;
    }
  }

  async function loadPrestatarioByUserId(userId: string) {
    if (!userId) return null;
    try {
      // Endpoint esperado: GET /prestatario/user/:userId
      const res = await api.get(
        `/prestatario/user/${encodeURIComponent(userId)}`,
      );
      const payload = res?.data ?? res;
      return payload?.data ?? payload ?? null;
    } catch (e) {
      console.warn(
        "[MainMenuConfig] loadPrestatarioByUserId fallo:",
        e?.message ?? e,
      );
      return null;
    }
  }

  onMounted(async () => {
    const raw = cookies.get("userData");
    userData.value = parseUserData(raw) ?? {};
    roleName.value = (
      userData.value?.role ??
      userData.value?.roleName ??
      ""
    ).toString();

    if (String(roleName.value).toLowerCase() === "prestatario") {
      const userId =
        userData.value?.userID ??
        userData.value?.userId ??
        userData.value?.id ??
        (userData.value?.user &&
          (userData.value.user.id ?? userData.value.user.userID));

      if (userId) {
        const p = await loadPrestatarioByUserId(String(userId));
        prestatario.value = p;
        console.log("[MainMenuConfig] Prestatario cargado:", p);
      } else {
        prestatario.value = userData.value?.prestatario ?? null;
        console.log(
          "[MainMenuConfig] Prestatario desde cookie:",
          prestatario.value,
        );
      }
    }
  });

  const computedMenuItems = computed(() => {
    // ADMIN
    if (
      String(roleName.value).toLowerCase() === "administrador" ||
      roleName.value === "Administrador"
    ) {
      return [
        {
          pages: [
            {
              heading: "dashboard",
              route: "/dashboard",
              keenthemesIcon: "home",
              bootstrapIcon: "bi-house",
            },
          ],
        },
        {
          heading: "Adminintración",
          route: "/adminintracion",
          pages: [
            {
              sectionTitle: "nomencladores",
              route: "/nomencladores",
              keenthemesIcon: "abstract-26",
              bootstrapIcon: "bi-archive",
              sub: [
                {
                  heading: "origen",
                  route: "/administracion/nomencladores/transfer/origen",
                },
                {
                  heading: "destino",
                  route: "/administracion/nomencladores/transfer/destino",
                },
                {
                  heading: "tipo de viaje",
                  route: "/administracion/nomencladores/transfer/tipodeviaje",
                },
                {
                  heading: "tipo de trasnporte",
                  route:
                    "/administracion/nomencladores/transfer/tipodetrasnporte",
                },
                {
                  heading: "tipo de mercado",
                  route: "/administracion/nomencladores/transfer/tipodemercado",
                },
                {
                  heading: "tipo de pago",
                  route: "/administracion/nomencladores/transfer/tipodepago",
                },
              ],
            },
            {
              sectionTitle: "Usuario",
              route: "/admin/user",
              keenthemesIcon: "profile-user",
              bootstrapIcon: "bi-people",
              sub: [
                { heading: "Lista de usuarios", route: "/admin/user/users" },
              ],
            },
          ],
        },
        {
          heading: "Comercializacion",
          route: "/comercializacion",
          pages: [
            {
              sectionTitle: "órdenes de carga",
              route: "/órdenes",
              keenthemesIcon: "delivery-2",
              bootstrapIcon: "bi-truck",
              sub: [
                {
                  heading: "Lista de órdenes",
                  route: "/comercializacion/ordenes/listrordenesA",
                },
                {
                  heading: "Crear órden de carga",
                  route: "/comercializacion/ordenes/addordenA",
                },
              ],
            },
            {
              heading: "Propuestas",
              route: "/comercializacion/propuestas",
              keenthemesIcon: "safe-home",
              bootstrapIcon: "bi-journal-text",
            },
          ],
        },
        {
          heading: "Información Adicional",
          route: "/informacion-adicional",
          pages: [
            {
              heading: "Precio sobre destinos",
              route: "/comercializacion/precio-sobre-destinos",
              keenthemesIcon: "dollar",
              bootstrapIcon: "bi-geo-alt",
            },
            {
              heading: "Emergencias",
              route: "/comercializacion/emergencias",
              keenthemesIcon: "notification-on",
              bootstrapIcon: "bi-exclamation-triangle",
            },
            {
              heading: "Políticas de entregas",
              route: "/comercializacion/politicas-de-entregas",
              keenthemesIcon: "delivery",
              bootstrapIcon: "bi-file-text",
            },
            {
              heading: "Política de cancelaciones",
              route: "/comercializacion/politica-de-cancelaciones",
              keenthemesIcon: "abstract-11",
              bootstrapIcon: "bi-x-circle",
            },
          ],
        },
      ];
    }

    // PRESTATARIO: construimos dinámicamente basado en entidad `prestatario` cargada o cookie
    if (String(roleName.value).toLowerCase() === "prestatario") {
      const src =
        prestatario.value ??
        parseUserData(cookies.get("userData"))?.prestatario ??
        {};

      const hasAlquiler = Boolean(
        (src?.serviciosPrestAlquiler && src.serviciosPrestAlquiler.length) ||
          src?.metrosDisponiblesAlquiler,
      );
      const hasTaller = Boolean(
        (src?.talleresServicios && src.talleresServicios.length) ||
          src?.talleresCapacidadVehiculos,
      );
      const hasGPS = Boolean(
        (src?.gpsProviders && src.gpsProviders.length) ||
          src?.gpsDevicesAvailable ||
          src?.gpsIntegrationApi,
      );
      const hasAlojamiento = Boolean(
        src?.habitacionesDisponibles ||
          (src?.tipoHabitaciones && src.tipoHabitaciones.length) ||
          (src?.serviciosIncluidosAlojamiento &&
            src.serviciosIncluidosAlojamiento.length),
      );

      const serviceEntry = (title: string, key: string, provides: boolean) => {
        // always provide `sub` so the menu node is expandable
        if (provides) {
          return {
            sectionTitle: title,
            route: `/prestatario/services/${key}`,
            keenthemesIcon: "safe-home",
            bootstrapIcon: "bi-journal-text",
            sub: [
              {
                heading: "Lista de propuestas",
                route: `/prestatario/services/${key}/proposals`,
              },
            ],
          };
        } else {
          return {
            sectionTitle: title,
            route: `/prestatario/services/${key}`,
            keenthemesIcon: "safe-home",
            bootstrapIcon: "bi-journal-text",
            sub: [
              {
                heading: "Lista de solicitudes",
                route: `/prestatario/services/${key}/solicitudes`,
              },
              {
                heading: "Crear solicitud",
                route: `/prestatario/services/${key}/solicitudes/create`,
              },
            ],
          };
        }
      };

      const pagesArr: any[] = [];
      pagesArr.push(serviceEntry("Servicio GPS", "gps", hasGPS));
      pagesArr.push(serviceEntry("Servicio Taller", "taller", hasTaller));
      pagesArr.push(serviceEntry("Servicio Alquiler", "alquiler", hasAlquiler));
      pagesArr.push(
        serviceEntry("Servicio Alojamiento", "alojamiento", hasAlojamiento),
      );

      return [
        {
          heading: "Comercializacion",
          route: "/comercializacion",
          pages: [
            {
              heading: "Propuestas de carga",
              route: "/comercializacion/ordenes/listrordenesPrestatario",
              keenthemesIcon: "delivery-2",
              bootstrapIcon: "bi-truck",
            },
          ],
        },
        {
          heading: "Mis servicios",
          route: "/prestatario/services",
          pages: pagesArr,
        },
        {
          heading: "Información Adicional",
          route: "/informacion-adicional",
          pages: [
            {
              heading: "Precio sobre destinos",
              route: "/comercializacion/precio-sobre-destinos",
              keenthemesIcon: "dollar",
              bootstrapIcon: "bi-geo-alt",
            },
            {
              heading: "Emergencias",
              route: "/comercializacion/emergencias",
              keenthemesIcon: "notification-on",
              bootstrapIcon: "bi-exclamation-triangle",
            },
            {
              heading: "Políticas de entregas",
              route: "/comercializacion/politicas-de-entregas",
              keenthemesIcon: "delivery",
              bootstrapIcon: "bi-file-text",
            },
            {
              heading: "Política de cancelaciones",
              route: "/comercializacion/politica-de-cancelaciones",
              keenthemesIcon: "abstract-11",
              bootstrapIcon: "bi-x-circle",
            },
          ],
        },
      ];
    }

    // CLIENTE
    if (
      String(roleName.value).toLowerCase() === "cliente" ||
      roleName.value === "Cliente"
    ) {
      return [
        {
          pages: [
            {
              heading: "dashboard",
              route: "/dashboard",
              keenthemesIcon: "home",
              bootstrapIcon: "bi-house",
            },
          ],
        },
        {
          heading: "Comercializacion",
          route: "/comercializacion",
          pages: [
            {
              sectionTitle: "Órdenes de carga",
              route: "/órdenes",
              keenthemesIcon: "delivery-2",
              bootstrapIcon: "bi-truck",
              sub: [
                {
                  heading: "Crear petición",
                  route: "/comercializacion/peticion/addpeticion",
                },
                {
                  heading: "Lista de peticiones",
                  route: "/comercializacion/peticion/listpeticionesCliente",
                },

                {
                  heading: "Crear órden de carga",
                  route: "/comercializacion/ordenes/addordenA",
                },
                {
                  heading: "Lista de órdenes",
                  route: "/comercializacion/ordenes/listrordenesCliente",
                },
              ],
            },
          ],
        },
        {
          heading: "Información Adicional",
          route: "/informacion-adicional",
          pages: [
            {
              heading: "Precio sobre destinos",
              route: "/comercializacion/precio-sobre-destinos",
              keenthemesIcon: "dollar",
              bootstrapIcon: "bi-geo-alt",
            },
            {
              heading: "Emergencias",
              route: "/comercializacion/emergencias",
              keenthemesIcon: "notification-on",
              bootstrapIcon: "bi-exclamation-triangle",
            },
            {
              heading: "Políticas de entregas",
              route: "/comercializacion/politicas-de-entregas",
              keenthemesIcon: "delivery",
              bootstrapIcon: "bi-file-text",
            },
            {
              heading: "Política de cancelaciones",
              route: "/comercializacion/politica-de-cancelaciones",
              keenthemesIcon: "abstract-11",
              bootstrapIcon: "bi-x-circle",
            },
          ],
        },
      ];
    }

    return [];
  });

  watch(
    computedMenuItems,
    (newValue) => {
      menuItems.value = newValue;
    },
    { immediate: true },
  );

  return { menuItems };
}
