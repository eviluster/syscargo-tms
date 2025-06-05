<template>
    <div>
      <div ref="mapContainer" class="map-container"></div>
    </div>
  </template>
  
  <script>
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  
  export default {
    name: 'MapWithPin',
    props: {
      address: {
        type: String,
        required: true
      },
      zoom: {
        type: Number,
        default: 13
      }
    },
    data() {
      return {
        map: null,
        marker: null
      };
    },
    mounted() {
      this.initMap();
    },
    methods: {
      async initMap() {
        // Crear el mapa
        this.map = L.map(this.$refs.mapContainer).setView([0, 0], this.zoom);
  
        // Añadir la capa de OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
  
        // Geocodificar la dirección para obtener las coordenadas
        const coordinates = await this.geocodeAddress(this.address);
        if (coordinates) {
          this.map.setView(coordinates, this.zoom);
  
          // Añadir un marcador en la dirección
          this.marker = L.marker(coordinates).addTo(this.map);
        }
      },
      async geocodeAddress(address) {
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
          const data = await response.json();
          if (data.length > 0) {
            return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
          }
        } catch (error) {
          console.error('Error geocoding address:', error);
        }
        return null;
      }
    }
  };
  </script>
  
  <style scoped>
  .map-container {
    height: 400px;
    width: 100%;
  }
  </style>