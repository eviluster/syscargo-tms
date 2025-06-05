import { defineStore } from 'pinia'

export const useTransportStore = defineStore('transport', {
  state: () => ({
    transportCategories: [
      {
        name: 'Marítima',
        description: 'Carga a través de rutas marítimas.',
        icon: 'mdi-anchor',
        picture: '/public/industrial-port-de-barcelona-evening 1.png',
      },
      {
        name: 'Aérea',
        description: 'Envío de mercancías en aviones de carga.',
        icon: 'mdi-airplane',
        picture:
          '/public/plane-trucks-are-flying-towards-destination-with-brightest-3d-rendering-illustration 1.png',
      },
      {
        name: 'Terrestre',
        description: 'Transporte de bienes en camiones.',
        icon: 'mdi-truck',
        picture: '/public/writing-address-box 1.png',
      },
      {
        name: 'Express',
        description: 'Envíos rápidos y urgentes.',
        icon: 'mdi-truck-fast',
        picture: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
      },
      {
        name: 'Ferroviaria',
        description: 'Carga en trenes y ferrocarriles.',
        icon: 'mdi-train',
        picture: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
      },
      {
        name: 'Rastreo de Contenedores',
        description: 'Monitoreo en tiempo real.',
        icon: 'mdi-package',
        picture: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
      },
      {
        name: 'Gestión de Almacén',
        description: 'Administración de inventarios.',
        icon: 'mdi-warehouse',
        picture: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
      },
      {
        name: 'Rastreo de GPS',
        description: 'Seguimiento en tiempo real.',
        icon: 'mdi-map-marker',
        picture: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
      },
      {
        name: 'Gestión de Consulta',
        description: 'Asesoramiento logístico.',
        icon: 'mdi-help-circle',
        picture: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
      },
    ],
  }),
})
