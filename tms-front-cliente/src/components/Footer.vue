<template>
  <!-- Footer con color oscuro y texto claro -->
  <v-footer dark height="auto" class="footer-custom pb-0 mt-12">
    <v-container>
      <v-row justify="center" align-content="center" align="center">
        <v-col cols="12" sm="6" md="3">
          <div class="d-flex align-center">
            <div class="yellow mr-4">
              <i class="fas fa-map-marker-alt" style="font-size: x-large"></i>
            </div>
            <!-- Dirección -->
            <div class="mb-2 d-flex flex-column">
              <strong class="custom">DIRECCIÓN:</strong>
              <p class="caption">Calle 76, #2707, entre 29 y 27, Playa</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" sm="6" md="1">
          <v-img src="/arrow.png" max-width="50" height="120"></v-img>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <div class="d-flex align-center">
            <div class="yellow mr-4">
              <i class="fas fa-mobile-alt" style="font-size: x-large"></i>
            </div>
            <!-- Contacto -->
            <div class="mb-2 d-flex flex-column">
              <strong class="custom">CONTÁCTENOS:</strong>
              <p class="caption">ventas@syscargo.cu +5363402860</p>
              <!-- <p class="caption">+1 800-226-4054</p> -->
            </div>
          </div>
        </v-col>
        <v-col cols="12" sm="6" md="1">
          <v-img src="/arrow.png" max-width="50" height="120"></v-img>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <div class="d-flex align-center">
            <div class="yellow mr-4">
              <i class="far fa-clock" style="font-size: x-large"></i>
            </div>
            <!-- Horario -->
            <div class="d-flex flex-column">
              <strong class="custom">HORARIO DE ATENCIÓN:</strong>
              <p class="caption">Lunes a viernes: 8:00 a. m. - 9:00 p. m.</p>
              <p class="caption">Fines de semana y domingos: Cerrado</p>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-divider class="border-opacity-50 py-4"></v-divider>
    <v-container class="px-0">
      <v-row class="" style="background-color: #080c24">
        <!-- Columna: Información de la oficina -->
        <v-col cols="12" md="4" class="mb-5">
          <!-- Nombre o Logo -->
          <div class="mb-4">
            <div class="mb-3">
              <a href="/">
                <img src="../../public/logo-footer.png" alt="Logo" />
              </a>
            </div>
            <p class="subtitle-2 textsublogo pb-5">
              Despliegue ágil de áreas temáticas estratégicas alternativas frente a participación de
              mercado B2C. Reconfigure objetivamente sinergias independientes mediante arquitecturas
              centradas en el usuario.
            </p>
            <SocialIcons />
          </div>
        </v-col>

        <!-- Columna: Enlaces útiles -->
        <v-col cols="12" sm="6" md="2" class="mb-5">
          <h5 class="text-uppercase font-weight-bold mb-2 usefullLinks">Enlaces útiles</h5>
          <v-img src="/rectangle.png" width="100px" class="mb-4"></v-img>
          <ul class="footer-list">
            <li><a href="/about">Quienes Somos</a></li>
            <li><a href="/services">Servicios</a></li>
            <li><a href="/portfolio">Portfolio</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/contact">Contáctenos</a></li>
            <li><a href="/rastrear">Rastrear Orden</a></li>
          </ul>
        </v-col>

        <!-- Columna: Nuestros servicios -->
        <v-col cols="12" sm="6" md="2" class="mb-5">
          <h5 class="text-uppercase font-weight-bold mb-2 usefullLinks">Nuestros Servicios</h5>
          <v-img src="/rectangle.png" width="100px" class="mb-4"></v-img>
          <ul class="footer-list">
            <li><a href="#air-freight">Carga Aérea</a></li>
            <li>
              <a href="#ocean-freight">Carga Marítima<Main></Main></a>
            </li>
            <li><a href="#road-freight">Carga Terrestre</a></li>
            <li><a href="#warehousing">Almacenamiento</a></li>
            <li><a href="#distribution">Distribución</a></li>
          </ul>
        </v-col>

        <!-- Columna: Suscripción al newsletter -->
        <v-col cols="12" md="4" class="mb-5">
          <h5 class="text-uppercase font-weight-bold mb-2 usefullLinks">Suscribirse Ahora</h5>
          <v-img src="/rectangle.png" width="100px" class="mb-4"></v-img>
          <p class="mb-4">
            Revolucionamos constantemente plataformas digitales globales, superando los modelos
            tradicionales de gestión humana. Manténgase actualizado: suscríbase a nuestro boletín.
            Contáctenos hoy.
          </p>
          <div class="d-flex flex-row">
            <v-text-field label="Email Address" variant="solo-filled" class="mb-2"></v-text-field>
            <v-btn class="mr-2" elevation="0" small color="#ea950e" height="56">
              <v-icon>fa:fas fa-paper-plane</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
  <v-container fluid class="py-0">
    <!-- Fila inferior con copyright -->
    <v-row style="background-color: #161922; height: 70px">
      <v-col cols="12" sm="6" md="6" align-self="center" class="text-center">
        <div class="copyright2025ByContainer">
          <span class="copyright2025">© Copyright 2025 By </span>
          <span class="acubamos">Acubamos,</span>
          <span> All right reserved.</span>
        </div>
      </v-col>
      <v-col cols="12" sm="6" md="6" align-self="center" class="text-center text-white">
        <div class="termsCondition">Términos & Condiciones | Política de privacidad</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import SocialIcons from './SocialIcons.vue'
</script>

<style scoped>
/* last block  */
.termsCondition {
  width: 378px;
  position: relative;
  font-size: 16px;
  line-height: 26px;
  font-family: 'Public Sans';
  color: #fff;
  white-space: pre-wrap;
  text-align: left;
  display: inline-block;
}

.copyright2025 {
  white-space: pre-wrap;
}

.acubamos {
  color: #ff4c13;
}

.copyright2025ByContainer {
  width: 383px;
  position: relative;
  font-size: 16px;
  line-height: 26px;
  font-family: 'Public Sans';
  text-align: left;
  display: inline-block;
  color: #fff;
}

.usefullLinks {
  position: relative;
  font-size: 24px;
  display: inline-block;
  font-family: Yantramanav;
  color: #f8f8f8;
  text-align: left;
}

.textsublogo {
  font-size: 16px;
  line-height: 26px;
  font-family: 'Public Sans';
  color: #fff;
  text-align: left;
  display: inline-block;
}

.footer-custom {
  background-color: #080c24;
  color: #fff;
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
}

.custom {
  font-size: 20px;
  line-height: 28px;
  display: inline-block;
  font-family: Yantramanav;
  color: #fff;
  text-align: left;
}

.caption {
  font-size: 16px;
  line-height: 28px;
  font-family: 'Public Sans';
  color: #d6d6d6;
  text-align: left;
  display: inline-block;
}

.yellow {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  border-radius: 5px;
  background-color: #ea950e;
  height: 80px;
  width: 80px;
}

.footer-list {
  list-style-type: none;
  padding-left: 10px;
  margin: 0;
}

.footer-list li {
  margin-bottom: 0.5rem;
}

.footer-list li a {
  color: #fff;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-list li a:hover {
  color: #ff4c13;
}
</style>
