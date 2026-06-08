import { defineStore } from 'pinia'
export const useTransportStore = defineStore('transport', {
  state: () => ({
    transportCategories: [
      {
        name: 'Marítima',
        description: 'Carga a través de rutas marítimas.',
        icon: 'mdi-anchor',
        picture: '/industrial-port-de-barcelona-evening 1.png',
      },
      {
        name: 'Aérea',
        description: 'Envío de mercancías en aviones de carga.',
        icon: 'mdi-airplane',
        picture:
          '/plane-trucks-are-flying-towards-destination-with-brightest-3d-rendering-illustration 1.png',
      },
      {
        name: 'Terrestre',
        description: 'Transporte de bienes en camiones.',
        icon: 'mdi-truck',
        picture: '/writing-address-box 1.png',
      },
      {
        name: 'Express',
        description: 'Envíos rápidos y urgentes.',
        icon: 'mdi-truck-fast',
        picture:'/rowan-freeman-clYlmCaQbzY-unsplash.png',
      },
      {
        name: 'Ferroviaria',
        description: 'Carga en trenes y ferrocarriles.',
        icon: 'mdi-train',
        picture: '/marissa-beletti-fcRVLXKikGY-unsplash.png',
      },
      {
        name: 'Rastreo de Contenedores',
        description: 'Monitoreo en tiempo real.',
        icon: 'mdi-package',
        picture: '/matt-richmond-AQhOfrdQOGQ-unsplash.png',
      },
      {
        name: 'Gestión de Almacén',
        description: 'Administración de inventarios.',
        icon: 'mdi-warehouse',
        picture: '/ruchindra-gunasekara-GK8x_XCcDZg-unsplash.jpg',
      },
      {
        name: 'Rastreo de GPS',
        description: 'Seguimiento en tiempo real.',
        icon: 'mdi-map-marker',
        picture: '/maxim-hopman--16na5rDDRk-unsplash.png',
      },
      {
        name: 'Gestión de Consulta',
        description: 'Asesoramiento logístico.',
        icon: 'mdi-help-circle',
        picture: '/van-tay-media-Dx6lpoMAG-Y-unsplash.png',
      },
    ],
  }),
})
