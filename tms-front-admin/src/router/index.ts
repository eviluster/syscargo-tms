import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useConfigStore } from "@/stores/config";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/dashboard",
    component: () => import("@/layouts/default-layout/DefaultLayout.vue"),
    meta: {
      middleware: "auth",
    },
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@/views/comercializacion/aereo/Listorden.vue"),
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

      /* Pagina de usuarios */
      {
        path: "/administracion/usuarios",
        name: "administracion-usuarios",
        component: () =>
          import("@/views/administracion/usuarios/usuarioList.vue"),
        meta: {
          pageTitle: "Usuarios",
          breadcrumbs: ["Administración", "Usuarios"],
        },
      },

      /* Pagina de reservar (Hoteles) */
      {
        path: "/comercializacion/reservar",
        name: "comercializacion-reservar",
        component: () =>
          import("@/views/comercializacion/hoteles/reservar.vue"),
        meta: {
          pageTitle: "Reservar",
          breadcrumbs: ["Comercialización", "Hoteles", "Reservar"],
        },
      },
      {
        path: "/configuracion/hoteles/planes",
        name: "configuracion-planes",
        component: () => import("@/views/comercializacion/hoteles/planesA.vue"),
        meta: {
          pageTitle: "Planes Alimenticios",
          breadcrumbs: ["Comercialización", "Hoteles", "Planes Alimenticios"],
        },
      },
      {
        path: "/configuracion/hoteles/edades",
        name: "configuracion-edades",
        component: () => import("@/views/comercializacion/hoteles/edades.vue"),
        meta: {
          pageTitle: "Edades",
          breadcrumbs: ["Comercialización", "Hoteles", "Edades"],
        },
      },
      {
        path: "/administracion/nomencladores/hoteles/tiposcama",
        name: "administracion-tiposcama",
        component: () =>
          import("@/views/administracion/nomencladores/hoteles/tiposcama.vue"),
        meta: {
          pageTitle: "Tipos de camas",
          breadcrumbs: ["administracion", "Hoteles", "Tipos de camas"],
        },
      },
      {
        path: "/administracion/nomencladores/hoteles/clasificacionhabitaciones",
        name: "administracion-clasificacionhabitaciones",
        component: () =>
          import(
            "@/views/administracion/nomencladores/hoteles/clasificacionhabitaciones.vue"
          ),
        meta: {
          pageTitle: "Planes Alimenticios",
          breadcrumbs: [
            "Administración",
            "Hoteles",
            "Clasificación de habitaciones",
          ],
        },
      },

      /*fin del codigo */
      /*Paginas de aereo*/
      {
        path: "/comercializacion/ordenes/listrordenesA",
        name: "comercializacion-ordenes-listrordenesA",
        component: () => import("@/views/comercializacion/aereo/Listorden.vue"),
        meta: {
          pageTitle: "Órdenes de Carga",
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
        meta: {
          pageTitle: "Órdenes de Carga",
          breadcrumbs: ["Comercialización", "Órdenes", "Añadir Órden de Carga"],
        },
      },
      /*Paginas de transfer*/
      {
        path: "/comercializacion/reservas/addreservation",
        name: "comercializacion-reservas-addreservation",
        component: () =>
          import("@/views/comercializacion/transfer/AddReservation.vue"),
        meta: {
          pageTitle: "Reservar",
          breadcrumbs: ["Comercialización", "Reservas", "Crear Reservacion"],
        },
      },
      {
        path: "/comercializacion/reservas/listreservations",
        name: "comercializacion-reservas-listreservations",
        component: () =>
          import("@/views/comercializacion/transfer/ListReservations.vue"),
        meta: {
          pageTitle: "Reservar",
          breadcrumbs: ["Comercialización", "Reservas", "Lista de Reservas"],
        },
      },
      {
        path: "/comercializacion/ofertas/listofertas",
        name: "comercializacion-reservas-listofertas",
        component: () =>
          import("@/views/comercializacion/transfer/ListOferta.vue"),
        meta: {
          pageTitle: "Ofertas",
          breadcrumbs: ["Comercialización", "Ofertas", "Lista de Ofertas"],
        },
      },
      {
        path: "/comercializacion/ofertas/addofertas",
        name: "comercializacion-reservas-addofertas",
        component: () =>
          import("@/views/comercializacion/transfer/AddOferta.vue"),
        meta: {
          pageTitle: "Ofertas",
          breadcrumbs: ["Comercialización", "Ofertas", "Añadir Oferta"],
        },
      },
      {
        path: "/administracion/nomencladores/transfer/origen",
        name: "administracion-origen",
        component: () =>
          import("@/views/administracion/nomencladores/transfer/origen.vue"),
        meta: {
          pageTitle: "Origen",
          breadcrumbs: ["administracion", "Transfer", "Origen"],
        },
      },
      {
        path: "/administracion/nomencladores/transfer/origen",
        name: "administracion-origen",
        component: () =>
          import("@/views/administracion/nomencladores/transfer/origen.vue"),
        meta: {
          pageTitle: "Origen",
          breadcrumbs: ["administracion", "Transfer", "Origen"],
        },
      },
      {
        path: "/administracion/nomencladores/transfer/destino",
        name: "administracion-destino",
        component: () =>
          import("@/views/administracion/nomencladores/transfer/destino.vue"),
        meta: {
          pageTitle: "Destino",
          breadcrumbs: ["administracion", "Transfer", "Destino"],
        },
      },
      {
        path: "/administracion/nomencladores/transfer/tipodeviaje",
        name: "administracion-tipodeviaje",
        component: () =>
          import("@/views/administracion/nomencladores/transfer/tviaje.vue"),
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
          import("@/views/administracion/nomencladores/transfer/tmercado.vue"),
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
        path: "/comercializacion/calendar",
        name: "comercializacion-calendar",
        component: () => import("@/views/comercializacion/Calendar.vue"),
        meta: {
          pageTitle: "Calendar",
          breadcrumbs: ["Apps"],
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
      {
        path: "/comercializacion/registroV/addV",
        name: "comercializacion-registroV-addV",
        component: () => import("@/views/terrestre/vehiculos/AddVehiculo.vue"),
        meta: {
          pageTitle: "Añadir vehiculo",
          breadcrumbs: ["Comercialización", "vehiculos", "Añadir vehiculo"],
        },
      },
      {
        path: "/comercializacion/registroV/listV",
        name: "comercializacion-registroV-listV",
        component: () => import("@/views/terrestre/vehiculos/ListVehiculo.vue"),
        meta: {
          pageTitle: "Listado de vehiculos",
          breadcrumbs: [
            "Comercialización",
            "vehiculos",
            "Listado de vehiculos",
          ],
        },
      },
      {
        path: "/administracion/cartaporte/cartaP",
        name: "administracion-cartaporte-cartaP",
        component: () => import("@/views/terrestre/carta porte/carta.vue"),
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
  const authStore = useAuthStore();
  const configStore = useConfigStore();

  // current page view title
  document.title = `${to.meta.pageTitle} - ${import.meta.env.VITE_APP_NAME}`;

  // reset config to initial state
  configStore.resetLayoutConfig();

  // verify auth token before each page change
  authStore.verifyAuth();

  // before page access check if page requires authentication
  if (to.meta.middleware == "auth") {
    if (authStore.isAuthenticated) {
      next();
    } else {
      next({ name: "sign-in" });
    }
  } else {
    next();
  }
});

export default router;
