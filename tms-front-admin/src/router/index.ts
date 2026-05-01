import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

import { useCookies } from "vue3-cookies";
import { ref } from "vue";
import api from "@/services/api";
import Swal from "sweetalert2";
const { cookies } = useCookies();
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: () => {
      // ejemplo leyendo token/usuario desde localStorage
      const token = ref<any>(cookies.get("refresh_token"));
      const userJson = cookies.get("userData");
      console.log("userData", userJson);
      //const user = userJson ? JSON.parse(userJson) : null;

      if (!token) return "/login"; // no autenticado -> login
      if (userJson?.role === "Prestatario") {
        console.log("ES Prestatario");
        return "/comercializacion/ordenes/listrordenesPrestatario";
      }
      if (userJson?.role === "Cliente") {
        console.log("ES CLIENTE");
        return "/comercializacion/ordenes/listrordenesCliente";
      } else {
        // por defecto
        return "/comercializacion/ordenes/listrordenesA";
      }
    },

    component: () => import("@/layouts/default-layout/DefaultLayout.vue"),
    meta: { requiresAuth: true }, // Proteger todas las rutas hijas
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        redirect: () => {
          // ejemplo leyendo token/usuario desde localStorage
          const token = ref<any>(cookies.get("refresh_token"));
          const userJson = cookies.get("userData");
          console.log("userData", userJson);

          //const user = userJson ? JSON.parse(userJson) : null;

          if (!token) return "/login"; // no autenticado -> login
          if (userJson?.role === "Prestatario") {
            console.log("ES Prestatario");
            return "/comercializacion/ordenes/listrordenesPrestatario";
          }
          if (userJson?.role === "Cliente") {
            console.log("ES CLIENTE");
            return "/comercializacion/ordenes/listrordenesCliente";
          } else {
            // por defecto
            return "/comercializacion/ordenes/listrordenesA";
          }
        },
        meta: {
          pageTitle: "Dashboard",
          breadcrumbs: ["Dashboards"],
        },
      },

      {
        path: "/administracion/profile",
        name: "profile",
        component: () => import("@/components/page-layouts/Profile.vue"),
        meta: {
          breadcrumbs: ["Pages", "Profile"],
        },
        children: [
          {
            path: "overview",
            name: "profile-overview",
            component: () =>
              import("@/views/administracion/perfil/Overview.vue"),
            meta: {
              pageTitle: "Overview",
            },
          },
          {
            path: "projects",
            name: "profile-projects",
            component: () =>
              import("@/views/administracion/perfil/Projects.vue"),
            meta: {
              pageTitle: "Projects",
            },
          },
          {
            path: "campaigns",
            name: "profile-campaigns",
            component: () =>
              import("@/views/administracion/perfil/Campaigns.vue"),
            meta: {
              pageTitle: "Campaigns",
            },
          },
          {
            path: "documents",
            name: "profile-documents",
            component: () =>
              import("@/views/administracion/perfil/Documents.vue"),
            meta: {
              pageTitle: "Documents",
            },
          },
          {
            path: "connections",
            name: "profile-connections",
            component: () =>
              import("@/views/administracion/perfil/Connections.vue"),
            meta: {
              pageTitle: "Connections",
            },
          },
          {
            path: "activity",
            name: "profile-activity",
            component: () =>
              import("@/views/administracion/perfil/Activity.vue"),
            meta: {
              pageTitle: "Activity",
            },
          },
        ],
      },
      {
        path: "/crafted/pages/wizards/horizontal",
        name: "horizontal-wizard",
        component: () =>
          import("@/views/crafted/pages/wizards/HorizontalWizardPage.vue"),
        meta: {
          pageTitle: "Horizontal",
          breadcrumbs: ["Pages", "Wizard"],
        },
      },
      {
        path: "/crafted/pages/wizards/vertical",
        name: "vertical-wizard",
        component: () =>
          import("@/views/crafted/pages/wizards/VerticalWizardPage.vue"),
        meta: {
          pageTitle: "Vertical",
          breadcrumbs: ["Pages", "Wizard"],
        },
      },
      {
        path: "/crafted/account",
        name: "account",
        component: () => import("@/views/crafted/account/Account.vue"),
        meta: {
          breadcrumbs: ["Crafted", "Account"],
        },
        children: [
          {
            path: "overview",
            name: "account-overview",
            component: () => import("@/views/crafted/account/Overview.vue"),
            meta: {
              pageTitle: "Overview",
            },
          },
          {
            path: "settings",
            name: "account-settings",
            component: () => import("@/views/crafted/account/Settings.vue"),
            meta: {
              pageTitle: "Settings",
            },
          },
        ],
      },

      /* Ultimo codigo añadido */

      {
        path: "/administracion/nomencladores",
        name: "nomencladores",
        meta: {
          breadcrumbs: ["Administración", "Nomencladores"],
        },
        children: [
          {
            path: "/administracion/nomencladores/transfer/origen",
            name: "administracion-origen",
            component: () =>
              import(
                "@/views/administracion/nomencladores/transfer/origen.vue"
              ),
            meta: {
              pageTitle: "Origen",
              breadcrumbs: ["administracion", "Transfer", "Origen"],
            },
          },
          {
            path: "/administracion/nomencladores/transfer/destino",
            name: "administracion-destino",
            component: () =>
              import(
                "@/views/administracion/nomencladores/transfer/destino.vue"
              ),
            meta: {
              pageTitle: "Destino",
              breadcrumbs: ["administracion", "Transfer", "Destino"],
            },
          },
          {
            path: "/administracion/nomencladores/transfer/tipodeviaje",
            name: "administracion-tipodeviaje",
            component: () =>
              import(
                "@/views/administracion/nomencladores/transfer/tipoviaje.vue"
              ),
            meta: {
              pageTitle: "Tipo de viaje",
              breadcrumbs: ["administracion", "Transfer", "Tipo de viaje"],
            },
          },
          {
            path: "/administracion/nomencladores/transfer/tipodetrasnporte",
            name: "administracion-tipodetrasnporte",
            component: () =>
              import(
                "@/views/administracion/nomencladores/transfer/ttrasnporte.vue"
              ),
            meta: {
              pageTitle: "Tipo de trasnporte",
              breadcrumbs: ["administracion", "Transfer", "Tipo de trasnporte"],
            },
          },
          {
            path: "/administracion/nomencladores/transfer/tipodemercado",
            name: "administracion-tipodemercado",
            component: () =>
              import(
                "@/views/administracion/nomencladores/transfer/tmercado.vue"
              ),
            meta: {
              pageTitle: "Tipo de mercado",
              breadcrumbs: ["administracion", "Transfer", "Tipo de mercado"],
            },
          },
          {
            path: "/administracion/nomencladores/transfer/tipodepago",
            name: "administracion-tipodepago",
            component: () =>
              import("@/views/administracion/nomencladores/transfer/tpago.vue"),
            meta: {
              pageTitle: "Tipo de pago",
              breadcrumbs: ["administracion", "Transfer", "Tipo de pago"],
            },
          },
          {
            path: "marca",
            name: "nomencladores-marca",
            component: () =>
              import("@/views/administracion/nomencladores/marcaList.vue"),
            meta: {
              pageTitle: "Marca",
            },
          },
          {
            path: "categoria",
            name: "nomencladores-categoria",
            component: () =>
              import("@/views/administracion/nomencladores/categoriaList.vue"),
            meta: {
              pageTitle: "Categoría",
            },
          },
          {
            path: "provincia",
            name: "nomencladores-provincia",
            component: () =>
              import("@/views/administracion/nomencladores/provinciaList.vue"),
            meta: {
              pageTitle: "Provincia",
            },
          },
          {
            path: "municipio",
            name: "nomencladores-municipio",
            component: () =>
              import("@/views/administracion/nomencladores/municipioList.vue"),
            meta: {
              pageTitle: "Municipio",
            },
          },
          {
            path: "modelo",
            name: "nomencladores-modelo",
            component: () =>
              import("@/views/administracion/nomencladores/modeloList.vue"),
            meta: {
              pageTitle: "Modelo",
            },
          },
          {
            path: "localidad",
            name: "nomencladores-localidad",
            component: () =>
              import("@/views/administracion/nomencladores/localidadList.vue"),
            meta: {
              pageTitle: "Localidad",
            },
          },
          {
            path: "tipoTransporte",
            name: "nomencladores-tipoTransporte",
            component: () =>
              import(
                "@/views/administracion/nomencladores/tipoTransporteList.vue"
              ),
            meta: {
              pageTitle: "Tipo de transporte",
            },
          },
        ],
      },

      {
        path: "/comercializacion/calendar",
        name: "comercializacion-calendar",
        component: () => import("@/views/comercializacion/calendar.vue"),
        meta: {
          pageTitle: "Calendario",
          breadcrumbs: ["Comercializacion"],
        },
      },

      /*fin del codigo */
      /*Paginas de aereo*/
      {
        path: "/comercializacion/ordenes/listrordenesA",
        name: "comercializacion-ordenes-listrordenesA",
        component: () => import("@/views/comercializacion/aereo/Listorden.vue"),
        meta: {
          pageTitle: "Órdenes de Carga Todas",
          breadcrumbs: [
            "Comercialización",
            "Órdenes",
            "Lista de Órdenes de Carga",
          ],
        },
      },
      {
        path: "/comercializacion/ordenes/listrordenesPrestatario",
        name: "comercializacion-ordenes-listrordenesPrestatario",
        component: () => import("@/views/prestatario/Listorden.vue"),
        meta: {
          pageTitle: "Propuestas de cargas",
          breadcrumbs: ["Comercialización", "Lista de Propuestas de cargas"],
        },
      },
      {
        path: "/comercializacion/propuestas",
        name: "comercializacion/propuestas",
        component: () =>
          import("@/views/comercializacion/aereo/ListaPropuestasAdmin.vue"),
        meta: {
          pageTitle: "Lista de Propuestas de cargas Admin",
          breadcrumbs: [
            "Comercialización",
            "Lista de Propuestas de cargas Admin",
          ],
        },
      },

      //--------------------Peticiones ----------------------
      {
        path: "/comercializacion/peticion/listpeticionesCliente",
        name: "comercializacion-peticion-listpeticionesCliente",
        component: () => import("@/views/cliente/ListaPeticiones.vue"),
        meta: {
          pageTitle: "Peticiones Cliente",
          breadcrumbs: [
            "Comercialización",
            "Peticiones",
            "Lista de Peticiones",
          ],
        },
      },
      {
        path: "/comercializacion/peticion/addpeticion",
        name: "comercializacion-peticion-addpeticion",
        component: () => import("@/views/cliente/FormularioPeticion.vue"),
        meta: {
          pageTitle: "Peticiones",
          breadcrumbs: ["Comercialización", "Peticiones", "Añadir Petición"],
        },
      },

      //--------------------End Peticiones ----------------------
      {
        path: "/comercializacion/ordenes/listrordenesCliente",
        name: "comercializacion-ordenes-listrordenesCliente",
        component: () => import("@/views/cliente/Listorden.vue"),
        meta: {
          pageTitle: "Órdenes de Carga Cliente",
          breadcrumbs: [
            "Comercialización",
            "Órdenes",
            "Lista de Órdenes de Carga",
          ],
        },
      },

      {
        path: "/comercializacion/ordenes/addordenA",
        name: "comercializacion-ordenes-addordenA",
        component: () => import("@/views/comercializacion/aereo/AddOrden.vue"),
        beforeEnter: async (to, from, next) => {
          try {
            // Abre modal con select para elegir modalidad
            const inputOptions: Record<string, string> = {
              aerea: "Aérea",
              // maritima: "Marítima",
              terrestre: "Terrestre",
              // ferroviaria: "Ferroviaria",
            };

            const result = await Swal.fire({
              title: "Elige una modalidad para la orden de carga",
              input: "select" as const, // 'as const' ayuda a TS a inferir correctamente
              inputOptions,
              inputPlaceholder: "Selecciona una modalidad",
              showCancelButton: true,
              cancelButtonText: "Cancelar",
              confirmButtonText: "Continuar",
              allowOutsideClick: false,
              customClass: {
                popup: "swal2-dark-popup",
                title: "swal2-dark-title",
                input: "swal2-dark-input", // aquí va la clase para el input/select
                confirmButton: "swal2-dark-confirm",
                cancelButton: "swal2-dark-cancel",
              },
              didOpen: () => {
                // 1) Forzar color del título
                try {
                  const titleEl = Swal.getTitle?.() as HTMLElement | null;
                  if (titleEl) {
                    titleEl.style.color = "#ffffff";
                    titleEl.style.setProperty("color", "#ffffff", "important");
                  } else {
                    // fallback: querySelector dentro del popup
                    const popup = Swal.getPopup?.();
                    const t = popup?.querySelector(
                      ".swal2-title",
                    ) as HTMLElement | null;
                    if (t) t.style.setProperty("color", "#ffffff", "important");
                  }
                } catch (e) {
                  console.warn("No se pudo forzar color título Swal:", e);
                }

                // 2) Estilizar select
                const el =
                  Swal.getInput() as unknown as HTMLSelectElement | null;
                if (!el) return;

                // estilos en línea para asegurar compatibilidad cross-browser
                Object.assign(el.style, {
                  background: "#26272F",
                  color: "#ffffff",
                  border: "1px solid #2b3746",
                  padding: "8px 10px",
                  borderRadius: "6px",
                });

                // Aplicar estilos a cada <option> (mejor compatibilidad que solo CSS en algunos navegadores)
                for (let i = 0; i < el.options.length; i++) {
                  const opt = el.options[i] as HTMLOptionElement;
                  opt.style.background = "#26272F";
                  opt.style.color = "#ffffff";
                }
              },
            });

            // Si el usuario canceló el modal
            if (!result.value) {
              // cancela navegación y permanece en la ruta anterior
              return next(false);
            }

            const modalidadSeleccionada = String(result.value).toLowerCase();

            // Mapear modalidad a ruta destino (ajusta los nombres si ya los tienes)
            const mapToRouteName: Record<string, string> = {
              terrestre: "comercializacion-ordenes-addorden-terrestre",
              aerea: "comercializacion-ordenes-addorden-aereo",
              ferroviaria: "comercializacion-ordenes-addorden-ferroviaria",
              maritima: "comercializacion-ordenes-addorden-maritima",
            };

            const targetName = mapToRouteName[modalidadSeleccionada];

            if (targetName) {
              // redirigir a la ruta correspondiente
              return next({ name: targetName });
            } else {
              // por seguridad: si no está mapeada, cancelar
              return next(false);
            }
          } catch (err) {
            console.error("[guard] error mostrando modal modalidad:", err);
            // Si falla algo, no bloqueamos la navegación: dejamos cargar la ruta por defecto
            return next();
          }
        },
        meta: {
          pageTitle: "Órdenes de Carga",
          breadcrumbs: ["Comercialización", "Órdenes", "Añadir Órden de Carga"],
        },
      },
      // ---- Ruta destino terrestre (asegúrate de agregarla) ----
      {
        path: "/comercializacion/ordenes/addorden-terrestre",
        name: "comercializacion-ordenes-addorden-terrestre",
        component: () =>
          import("@/views/comercializacion/aereo/AddOrdenTerrestre.vue"),
        meta: {
          pageTitle: "Órdenes de Carga - Terrestre",
          breadcrumbs: [
            "Comercialización",
            "Órdenes",
            "Añadir Órden Terrestre",
          ],
        },
      },

      {
        path: "/comercializacion/ordenes/addorden-aereo",
        name: "comercializacion-ordenes-addorden-aereo",
        component: () =>
          import("@/views/comercializacion/aereo/AddOrdenAereo.vue"),
        meta: {
          pageTitle: "Órdenes de Carga - Aéreo",
          breadcrumbs: ["Comercialización", "Órdenes", "Añadir Órden Aéreo"],
        },
      },

      {
        path: "/comercializacion/ordenes/addorden-ferroviaria",
        name: "comercializacion-ordenes-addorden-ferroviaria",
        component: () =>
          import("@/views/comercializacion/aereo/AddOrdenFerroviaria.vue"),
        meta: {
          pageTitle: "Órdenes de Carga - Ferroviaria",
          breadcrumbs: [
            "Comercialización",
            "Órdenes",
            "Añadir Órden Ferroviaria",
          ],
        },
      },

      {
        path: "/comercializacion/ordenes/addorden-maritima",
        name: "comercializacion-ordenes-addorden-maritima",
        component: () =>
          import("@/views/comercializacion/aereo/AddOrdenMaritima.vue"),
        meta: {
          pageTitle: "Órdenes de Carga - Marítima",
          breadcrumbs: ["Comercialización", "Órdenes", "Añadir Órden Marítima"],
        },
      },

      {
        path: "/comercializacion/perzonalizacion",
        name: "comercializacion/perzonalizacion",
        component: () =>
          import("@/views/comercializacion/aereo/Perzonalizacion.vue"),
        meta: {
          pageTitle: "Perzonalización",
          breadcrumbs: ["Comercialización", "Perzonalización"],
        },
      },

      {
        path: "/comercializacion/carta-porte",
        name: "comercializacion/carta-porte",
        component: () => import("@/views/terrestre/carta porte/carta.vue"),
        meta: {
          pageTitle: "Carta Porte",
          breadcrumbs: ["Comercialización", "Carta Porte"],
        },
      },

      {
        path: "/comercializacion/hoja-de-ruta-terrestre",
        name: "comercializacion/hoja-de-ruta-terrestre",
        component: () =>
          import("@/views/terrestre/hoja-de-ruta/hojaTerrestre.vue"),
        meta: {
          pageTitle: "Hoja de ruta terrestre",
          breadcrumbs: ["Comercialización", "Hoja de ruta terrestre"],
        },
      },

      {
        path: "/comercializacion/precio-sobre-destinos",
        name: "comercializacion/precio-sobre-destinos",
        component: () =>
          import("@/views/comercializacion/aereo/PrecioSobreDestinos.vue"),
        meta: {
          pageTitle: "Precio sobre destinos",
          breadcrumbs: ["Comercialización", "Precio sobre destinos"],
        },
      },

      {
        path: "/comercializacion/emergencias",
        name: "comercializacion/emergencias",
        component: () =>
          import("@/views/comercializacion/aereo/Emergencias.vue"),
        meta: {
          pageTitle: "Emergencias",
          breadcrumbs: ["Comercialización", "Emergencias"],
        },
      },

      {
        path: "/comercializacion/politicas-de-entregas",
        name: "comercializacion/politicas-de-entregas",
        component: () =>
          import("@/views/comercializacion/aereo/PoliticasDeEntregas.vue"),
        meta: {
          pageTitle: "Políticas de entregas",
          breadcrumbs: ["Comercialización", "Políticas de entregas"],
        },
      },

      {
        path: "/comercializacion/politica-de-cancelaciones",
        name: "comercializacion/politica-de-cancelaciones",
        component: () =>
          import("@/views/comercializacion/aereo/PoliticaDeCancelaciones.vue"),
        meta: {
          pageTitle: "Política de cancelaciones",
          breadcrumbs: ["Comercialización", "Política de cancelaciones"],
        },
      },

      /*Fin*/
      {
        path: "/apps/sales/orderlisting",
        name: "apps-sales-order-listing",
        component: () => import("@/views/apps/sales/OrderListing.vue"),
        meta: {
          pageTitle: "Listado de ordenes",
          breadcrumbs: ["Apps", "Sales"],
        },
      },
      {
        path: "/apps/productos/addproduct",
        name: "apps-productos-addproduct",
        component: () => import("@/views/apps/productos/AddProduct.vue"),
        meta: {
          pageTitle: "Añadir Producto",
          breadcrumbs: ["Apps", "Productos"],
        },
      },
      {
        path: "/apps/productos/productlisting",
        name: "apps-productos-productlisting",
        component: () => import("@/views/apps/productos/ProductList.vue"),
        meta: {
          pageTitle: "Lista de Productos",
          breadcrumbs: ["Apps", "Productos"],
        },
      },
      {
        path: "/apps/customers/getting-started",
        name: "apps-customers-getting-started",
        component: () => import("@/views/apps/customers/GettingStarted.vue"),
        meta: {
          pageTitle: "Getting Started",
          breadcrumbs: ["Apps", "Customers"],
        },
      },
      /*{
        path: "/apps/customers/customers-listing",
        name: "apps-customers-listing",
        component: () => import("@/views/apps/customers/CustomersListing.vue"),
        meta: {
          pageTitle: "Customers Listing",
          breadcrumbs: ["Apps", "Customers"],
        },
      },*/
      {
        path: "/apps/customers/customer-details",
        name: "apps-customers-details",
        component: () => import("@/views/apps/customers/CustomerDetails.vue"),
        meta: {
          pageTitle: "Customers Details",
          breadcrumbs: ["Apps", "Customers"],
        },
      },
      {
        path: "/apps/subscriptions/getting-started",
        name: "apps-subscriptions-getting-started",
        component: () =>
          import("@/views/apps/subscriptions/GettingStarted.vue"),
        meta: {
          pageTitle: "Getting Started",
          breadcrumbs: ["Apps", "Subscriptions"],
        },
      },
      {
        path: "/apps/subscriptions/subscription-list",
        name: "apps-subscriptions-subscription-list",
        component: () =>
          import("@/views/apps/subscriptions/SubscriptionList.vue"),
        meta: {
          pageTitle: "Getting Started",
          breadcrumbs: ["Apps", "Subscriptions"],
        },
      },
      {
        path: "/apps/subscriptions/add-subscription",
        name: "apps-subscriptions-add-subscription",
        component: () =>
          import("@/views/apps/subscriptions/AddSubscription.vue"),
        meta: {
          pageTitle: "Add Subscription",
          breadcrumbs: ["Apps", "Subscriptions"],
        },
      },
      {
        path: "/apps/subscriptions/view-subscription",
        name: "apps-subscriptions-view-subscription",
        component: () =>
          import("@/views/apps/subscriptions/ViewSubscription.vue"),
        meta: {
          pageTitle: "View Subscription",
          breadcrumbs: ["Apps", "Subscriptions"],
        },
      },

      {
        path: "/apps/chat/private-chat",
        name: "apps-private-chat",
        component: () => import("@/views/apps/chat/Chat.vue"),
        meta: {
          pageTitle: "Private Chat",
          breadcrumbs: ["Apps", "Chat"],
        },
      },
      {
        path: "/apps/chat/group-chat",
        name: "apps-group-chat",
        component: () => import("@/views/apps/chat/Chat.vue"),
        meta: {
          pageTitle: "Group Chat",
          breadcrumbs: ["Apps", "Chat"],
        },
      },
      {
        path: "/apps/chat/drawer-chat",
        name: "apps-drawer-chat",
        component: () => import("@/views/apps/chat/DrawerChat.vue"),
        meta: {
          pageTitle: "Drawer Chat",
          breadcrumbs: ["Apps", "Chat"],
        },
      },
      {
        path: "/apps/custom/editar-banner",
        name: "apps-editar-banner",
        component: () => import("@/views/apps/custom/EditarBanner.vue"),
        meta: {
          pageTitle: "Editar Banner",
          breadcrumbs: ["Apps", "Custom"],
        },
      },
      {
        path: "/crafted/modals/general/invite-friends",
        name: "modals-general-invite-friends",
        component: () =>
          import("@/views/crafted/modals/general/InviteFriends.vue"),
        meta: {
          pageTitle: "Invite Friends",
          breadcrumbs: ["Crafted", "Modals", "General"],
        },
      },
      {
        path: "/crafted/modals/general/view-user",
        name: "modals-general-view-user",
        component: () => import("@/views/crafted/modals/general/ViewUsers.vue"),
        meta: {
          pageTitle: "View User",
          breadcrumbs: ["Crafted", "Modals", "General"],
        },
      },
      {
        path: "/admin/user/users",
        name: "administration-user",
        component: () =>
          import("@/views/administracion/usuarios/UsuarioList.vue"),
        meta: {
          pageTitle: "Usuarios",
          breadcrumbs: ["Administration", "Users"],
        },
      },
      {
        path: "/crafted/modals/general/upgrade-plan",
        name: "modals-general-upgrade-plan",
        component: () =>
          import("@/views/crafted/modals/general/UpgradePlan.vue"),
        meta: {
          pageTitle: "Upgrade Plan",
          breadcrumbs: ["Crafted", "Modals", "General"],
        },
      },
      {
        path: "/crafted/modals/general/share-and-earn",
        name: "modals-general-share-and-earn",
        component: () =>
          import("@/views/crafted/modals/general/ShareAndEarn.vue"),
        meta: {
          pageTitle: "Share And Earn",
          breadcrumbs: ["Crafted", "Modals", "General"],
        },
      },
      {
        path: "/crafted/modals/forms/new-target",
        name: "modals-forms-new-target",
        component: () => import("@/views/crafted/modals/forms/NewTarget.vue"),
        meta: {
          pageTitle: "New Target",
          breadcrumbs: ["Crafted", "Modals", "Forms"],
        },
      },
      {
        path: "/crafted/modals/forms/new-card",
        name: "modals-forms-new-card",
        component: () => import("@/views/crafted/modals/forms/NewCard.vue"),
        meta: {
          pageTitle: "New Card",
          breadcrumbs: ["Crafted", "Modals", "Forms"],
        },
      },
      {
        path: "/crafted/modals/forms/new-address",
        name: "modals-forms-new-address",
        component: () => import("@/views/crafted/modals/forms/NewAddress.vue"),
        meta: {
          pageTitle: "New Address",
          breadcrumbs: ["Crafted", "Modals", "Forms"],
        },
      },
      {
        path: "/crafted/modals/forms/create-api-key",
        name: "modals-forms-create-api-key",
        component: () =>
          import("@/views/crafted/modals/forms/CreateApiKey.vue"),
        meta: {
          pageTitle: "Create Api Key",
          breadcrumbs: ["Crafted", "Modals", "Forms"],
        },
      },
      {
        path: "/crafted/modals/wizards/two-factor-auth",
        name: "modals-wizards-two-factor-auth",
        component: () =>
          import("@/views/crafted/modals/wizards/TwoFactorAuth.vue"),
        meta: {
          pageTitle: "Two Factory Auth",
          breadcrumbs: ["Crafted", "Modals", "Wizards"],
        },
      },
      {
        path: "/crafted/modals/wizards/create-app",
        name: "modals-wizards-create-app",
        component: () => import("@/views/crafted/modals/wizards/CreateApp.vue"),
        meta: {
          pageTitle: "Create App",
          breadcrumbs: ["Crafted", "Modals", "Wizards"],
        },
      },
      {
        path: "/crafted/modals/wizards/create-account",
        name: "modals-wizards-create-account",
        component: () =>
          import("@/views/crafted/modals/wizards/CreateAccount.vue"),
        meta: {
          pageTitle: "Create Account",
          breadcrumbs: ["Crafted", "Modals", "Wizards"],
        },
      },
      {
        path: "/crafted/widgets/lists",
        name: "widgets-list",
        component: () => import("@/views/crafted/widgets/Lists.vue"),
        meta: {
          pageTitle: "Lists",
          breadcrumbs: ["Crafted", "Widgets"],
        },
      },
      {
        path: "/crafted/widgets/statistics",
        name: "widgets-statistics",
        component: () => import("@/views/crafted/widgets/Statistics.vue"),
        meta: {
          pageTitle: "Statistics",
          breadcrumbs: ["Crafted", "Widgets"],
        },
      },
      {
        path: "/crafted/widgets/charts",
        name: "widgets-charts",
        component: () => import("@/views/crafted/widgets/Charts.vue"),
        meta: {
          pageTitle: "Charts",
          breadcrumbs: ["Crafted", "Widgets"],
        },
      },
      {
        path: "/crafted/widgets/mixed",
        name: "widgets-mixed",
        component: () => import("@/views/crafted/widgets/Mixed.vue"),
        meta: {
          pageTitle: "Mixed",
          breadcrumbs: ["Crafted", "Widgets"],
        },
      },
      {
        path: "/crafted/widgets/tables",
        name: "widgets-tables",
        component: () => import("@/views/crafted/widgets/Tables.vue"),
        meta: {
          pageTitle: "Tables",
          breadcrumbs: ["Crafted", "Widgets"],
        },
      },
      {
        path: "/crafted/widgets/feeds",
        name: "widgets-feeds",
        component: () => import("@/views/crafted/widgets/Feeds.vue"),
        meta: {
          pageTitle: "Feeds",
          breadcrumbs: ["Crafted", "Widgets"],
        },
      },
      /*TODO LO DE TERRESTRE*/
      {
        path: "/comercializacion/pedidos/listorderT",
        name: "comercializacion-pedidos-listorderT",
        component: () => import("@/views/terrestre/pedidos/ListPedido.vue"),
        meta: {
          pageTitle: "Pedidos",
          breadcrumbs: ["Comercialización", "Pedidos", "Lista de Pedidos"],
        },
      },
      {
        path: "/comercializacion/pedidos/addorderT",
        name: "comercializacion-pedidos-addorderT",
        component: () => import("@/views/terrestre/pedidos/AddPedido.vue"),
        meta: {
          pageTitle: "Crear pedido",
          breadcrumbs: ["Comercialización", "Pedidos", "Crear Pedido"],
        },
      },
      {
        path: "/comercializacion/transportistas/contratos/addcontratos",
        name: "comercializacion-contratos-transportistas-addcontratos",
        component: () => import("@/views/terrestre/contratos/AddContrato.vue"),
        meta: {
          pageTitle: "Crear contratos",
          breadcrumbs: [
            "Comercialización",
            "transportistas",
            "contratos",
            "Crear Contrato",
          ],
        },
      },
      {
        path: "/comercializacion/transportistas/contratos/listcontratos",
        name: "comercializacion-contratos-transportistas-listcontratos",
        component: () =>
          import("@/views/terrestre/contratos/ListContratos.vue"),
        meta: {
          pageTitle: "Lista de contratos",
          breadcrumbs: [
            "Comercialización",
            "transportistas",
            "contratos",
            "Lista de Contrato",
          ],
        },
      },
      {
        path: "/comercializacion/transportistas/registroC/addC",
        name: "comercializacion-transportistas-registroC-addC",
        component: () => import("@/views/terrestre/choferes/AddChofer.vue"),
        meta: {
          pageTitle: "Añadir chofer",
          breadcrumbs: [
            "Comercialización",
            "transportistas",
            "contratos",
            "Añadir chofer",
          ],
        },
      },
      {
        path: "/comercializacion/transportistas/registroC/listC",
        name: "comercializacion-transportistas-registroC-listC",
        component: () => import("@/views/terrestre/choferes/ListChofer.vue"),
        meta: {
          pageTitle: "Lista de choferes",
          breadcrumbs: [
            "Comercialización",
            "transportistas",
            "choferes",
            "Lista de choferes",
          ],
        },
      },
      // ---------Servicios de prestatarios nuevos ------------------
      // router/index.ts (fragmento — añade al array `routes`)
      {
        path: "/prestatario/services/:serviceKey",
        props: (route) => ({ serviceKey: route.params.serviceKey }),
        children: [
          {
            path: "solicitudes",
            name: "PrestatarioServiceSolicitudes",
            component: () =>
              import("@/views/prestatario/services/ServiceSolicitudesList.vue"),
            props: (route) => ({ serviceKey: route.params.serviceKey }),
          },
          {
            path: "solicitudes/create",
            name: "PrestatarioServiceCrearSolicitud",
            component: () =>
              import("@/views/prestatario/services/ServiceSolicitudForm.vue"),
            props: (route) => ({
              serviceKey: route.params.serviceKey,
              mode: "create",
            }),
          },
          {
            path: "proposals",
            name: "PrestatarioServiceProposals",
            component: () =>
              import("@/views/prestatario/services/ServiceProposalsList.vue"),
            props: (route) => ({ serviceKey: route.params.serviceKey }),
          },
          {
            path: "",
            redirect: (to) => {
              // Por defecto redirigimos a proposals si existe, o a solicitudes
              // Nota: el componente index.vue puede manejar una lógica más fina
              return {
                name: "PrestatarioServiceProposals",
                params: { serviceKey: to.params.serviceKey },
              };
            },
          },
        ],
      },

      // --------- Fin Servicios de prestatarios nuevos ------------------

      {
        path: "/administracion/cartaporte/cartaP",
        name: "administracion-cartaporte-cartaP",
        component: () =>
          import("@/views/terrestre/carta porte/cartaPorteTerrestre.vue"),
        meta: {
          pageTitle: "Crear carta porte",
          breadcrumbs: ["Administracion", "Carta porte", "Crear carta porte"],
        },
      },
      {
        path: "/administracion/cartaporte/cartaPF",
        name: "administracion-cartaporte-cartaPF",
        component: () =>
          import("@/views/terrestre/carta porte/cartaPorteFerroviario.vue"),
        meta: {
          pageTitle: "Crear carta porte",
          breadcrumbs: ["Administracion", "Carta porte", "Crear carta porte"],
        },
      },
      {
        path: "/administracion/cartaporte/listacartaP",
        name: "administracion-cartaporte-listacartaP",
        component: () => import("@/views/terrestre/carta porte/ListCarta.vue"),
        meta: {
          pageTitle: "Listado de cartas porte",
          breadcrumbs: [
            "Administracion",
            "Carta porte",
            "Listado de cartas porte",
          ],
        },
      },
      {
        path: "/comercializacion/transportistas/registroT/addtrans",
        name: "comercializacion-transportistas-registroT-addtrans",
        component: () =>
          import("@/views/terrestre/transportistas/AddTransportista.vue"),
        meta: {
          pageTitle: "Añadir Transportista",
          breadcrumbs: [
            "Comercialización",
            "transportistas",
            "Añadir Transportista",
          ],
        },
      },
      {
        path: "/comercializacion/transportistas/registroT/listtrans",
        name: "comercializacion-transportistas-registroT-listtrans",
        component: () =>
          import("@/views/terrestre/transportistas/ListTransportistas.vue"),
        meta: {
          pageTitle: "Listado de Transportistas",
          breadcrumbs: [
            "Comercialización",
            "transportistas",
            "Listado de Transportistas",
          ],
        },
      },
      {
        path: "/solicitudes/lista-propuestas-solicitudes",
        name: "propuestas-recibidas",
        component: () =>
          import("@/views/prestatario/ListaPropuestasSolicitudes.vue"),
        meta: {
          pageTitle: "Solicitudes de alquiler de almacén",
          breadcrumbs: ["Solicitudes", "Lista de solicitudes"],
        },
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/layouts/AuthLayout.vue"),
    children: [
      {
        path: "/sign-in",
        name: "sign-in",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/SignIn.vue"),
        meta: {
          pageTitle: "Sign In",
        },
      },
      {
        path: "/sign-up",
        name: "sign-up",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/SignUp.vue"),
        meta: {
          pageTitle: "Sign Up",
        },
      },
      {
        path: "/password-reset",
        name: "password-reset",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/PasswordReset.vue"),
        meta: {
          pageTitle: "Password reset",
        },
      },
      {
        path: "/password-reset-complete",
        name: "password-reset-complete",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/PasswordResetComplete.vue"),
        meta: {
          pageTitle: "Complete Password Reset",
        },
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/layouts/SystemLayout.vue"),
    children: [
      {
        // the 404 route, when none of the above matches
        path: "/404",
        name: "404",
        component: () => import("@/views/crafted/authentication/Error404.vue"),
        meta: {
          pageTitle: "Error 404",
        },
      },
      {
        path: "/500",
        name: "500",
        component: () => import("@/views/crafted/authentication/Error500.vue"),
        meta: {
          pageTitle: "Error 500",
        },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to) {
    // If the route has a hash, scroll to the section with the specified ID; otherwise, scroll toc the top of the page.
    if (to.hash) {
      return {
        el: to.hash,
        top: 80,
        behavior: "smooth",
      };
    } else {
      return {
        top: 0,
        left: 0,
        behavior: "smooth",
      };
    }
  },
});

router.beforeEach((to, from, next) => {
  const { cookies } = useCookies();
  const isAuthenticated = !!cookies.get("refresh_token"); // O tu método de verificación
  const publicPages = ["sign-in", "sign-up", "password-reset", "password-reset-complete"];
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: "sign-in" });
  } else if (publicPages.includes(String(to.name)) && isAuthenticated) {
    next({ name: "dashboard" });
  } else {
    next();
  }
});

export default router;
