<template>
  <div class="social-icons d-flex justify-center">
    <!-- Ícono de Facebook con fondo naranja -->
    <v-btn class="social-btn social-btn--outline mr-2" elevation="0" small icon>
      <v-icon>fa:fab fa-facebook</v-icon>
    </v-btn>

    <v-btn class="social-btn social-btn--outline mr-2" elevation="0" small icon>
      <v-icon>fa:fab fa-twitter</v-icon>
    </v-btn>

    <v-btn class="social-btn social-btn--outline mr-2" elevation="0" small icon>
      <v-icon>fa:fab fa-whatsapp</v-icon>
    </v-btn>

    <v-btn class="social-btn social-btn--outline" elevation="0" small icon>
      <v-icon>fa:fab fa-linkedin</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'SocialIcons',
}
</script>

<style scoped>
/* Estilos base para los botones circulares */
.social-btn {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  min-width: 40px; /* Evita que el botón se expanda */
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Botón con fondo naranja */
.social-btn:hover {
  background-color: #ff4c13; /* Ajusta el color si lo deseas */
}

/* Botón con borde blanco y fondo transparente */
.social-btn--outline {
  background-color: transparent;
  border: 2px solid #fff;
}
</style>
