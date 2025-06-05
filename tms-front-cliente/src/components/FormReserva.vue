<template>
  <v-card class="pa-7" elevation="3">
    <!-- Título y subtítulo del formulario -->
    <v-card-title class="text-h6 titleForm"> Formulario de Reserva </v-card-title>
    <v-card-subtitle class="captionForm">
      Tu dirección de correo no será publicada. Los campos requeridos están marcados.
    </v-card-subtitle>
    <v-container max-width="1000" class="px-12 pt-10">
      <!-- Barra de pestañas -->
      <v-tabs v-model="activeTab" color="#EA950E">
        <v-tab value="cotizar" class="link">Cotizar Envío</v-tab>
        <v-tab value="remdest" class="link">Remitente y Destinatario</v-tab>
        <v-tab value="documentos" class="link">Otros Documentos</v-tab>
      </v-tabs>

      <v-card-text style="padding-top: 4rem">
        <!-- Ventana de pestañas -->
        <v-tabs-window v-model="activeTab">
          <!-- Pestaña 1: Cotizar Envío -->
          <v-tabs-window-item value="cotizar">
            <v-row>
              <v-col cols="12">
                <span class="customEnum">Datos del Remitente :</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <v-select label="Origen" :items="origenes" v-model="form.origen" required>
                  <template v-slot:prepend-inner>
                    <img
                      src="/public/formReserva/Vector(2).svg"
                      alt=""
                      style="width: 16px; height: 16px"
                    />
                  </template>
                </v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select label="Destino" :items="destinos" v-model="form.destino" required>
                  <template v-slot:prepend-inner>
                    <img
                      src="/public/formReserva/Vector(2).svg"
                      alt=""
                      style="width: 16px; height: 16px"
                    />
                  </template>
                </v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <v-select
                  label="Tipo de envío"
                  :items="shippingTypes"
                  v-model="form.tipoEnvio"
                  required
                >
                  <template v-slot:prepend-inner>
                    <img
                      src="/public/formReserva/Primary(1).svg"
                      alt=""
                      style="width: 22px; height: 22px"
                    />
                  </template>
                </v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  label="Tipo de carga"
                  :items="cargoTypes"
                  v-model="form.tipoCarga"
                  required
                >
                  <template v-slot:prepend-inner>
                    <img
                      src="/public/formReserva/truck-ramp-box(1).svg"
                      alt=""
                      style="width: 22px; height: 22px"
                    />
                  </template>
                </v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <span class="customEnum">Datos de la Carga :</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Peso de la carga"
                  type="number"
                  variant="solo-filled"
                  v-model="form.peso"
                >
                  <template v-slot:prepend-inner>
                    <img
                      src="/public/formReserva/scale-unbalanced-flip.svg"
                      alt=""
                      style="width: 22px; height: 22px"
                    />
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Volumen de la Carga"
                  type="number"
                  variant="solo-filled"
                  v-model="form.volumenCarga"
                >
                  <template v-slot:prepend-inner>
                    <img
                      src="/public/formReserva/layer-group(1).svg"
                      alt=""
                      style="width: 22px; height: 22px"
                    />
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <v-select label="País" :items="paises" v-model="form.country" required>
                  <template v-slot:prepend-inner>
                    <img
                      src="/public/formReserva/Vector(4).svg"
                      alt=""
                      style="width: 22px; height: 22px"
                    />
                  </template>
                </v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field label="Dirección" v-model="form.address" required>
                  <template v-slot:prepend-inner>
                    <img
                      src="/public/formReserva/Vector(2).svg"
                      alt=""
                      style="width: 16px; height: 16px"
                    />
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field label="Tu email" v-model="form.email" required>
                  <template v-slot:prepend-inner> <v-icon icon="mdi-email-outline" /> </template
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field label="Teléfono" v-model="form.phone" required
                  ><template v-slot:prepend-inner> <v-icon icon="mdi-phone-outline" /> </template
                ></v-text-field>
              </v-col>
            </v-row>
          </v-tabs-window-item>

          <!-- Pestaña 2: Remitente y Destinatario -->
          <v-tabs-window-item value="remdest">
            <v-row>
              <v-col cols="12">
                <span class="customEnum">Datos del Remitente :</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field label="Tu nombre" v-model="form.email" required>
                  <template v-slot:prepend-inner> <v-icon icon="mdi-account-outline" /> </template
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field label="DNI" v-model="form.email" required>
                  <template v-slot:prepend-inner>
                    <v-icon icon="mdi-card-account-details-outline" /> </template
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <v-select label="País" :items="paises" v-model="form.country" required>
                  <template v-slot:prepend-inner>
                    <img
                      src="/public/formReserva/Vector(4).svg"
                      alt=""
                      style="width: 22px; height: 22px"
                    />
                  </template>
                </v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field label="Dirección" v-model="form.address" required>
                  <template v-slot:prepend-inner>
                    <img
                      src="/public/formReserva/Vector(2).svg"
                      alt=""
                      style="width: 16px; height: 16px"
                    />
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field label="Tu email" v-model="form.email" required>
                  <template v-slot:prepend-inner> <v-icon icon="mdi-email-outline" /> </template
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field label="Teléfono" v-model="form.phone" required
                  ><template v-slot:prepend-inner> <v-icon icon="mdi-phone-outline" /> </template
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <span class="customEnum">Datos del Destinatario :</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field label="Tu nombre" v-model="form.email" required>
                  <template v-slot:prepend-inner> <v-icon icon="mdi-account-outline" /> </template
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field label="DNI" v-model="form.email" required>
                  <template v-slot:prepend-inner>
                    <v-icon icon="mdi-card-account-details-outline" /> </template
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <v-select label="País" :items="paises" v-model="form.country" required>
                  <template v-slot:prepend-inner>
                    <img
                      src="/public/formReserva/Vector(4).svg"
                      alt=""
                      style="width: 22px; height: 22px"
                    />
                  </template>
                </v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field label="Dirección" v-model="form.address" required>
                  <template v-slot:prepend-inner>
                    <img
                      src="/public/formReserva/Vector(2).svg"
                      alt=""
                      style="width: 16px; height: 16px"
                    />
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field label="Tu email" v-model="form.email" required>
                  <template v-slot:prepend-inner> <v-icon icon="mdi-email-outline" /> </template
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field label="Teléfono" v-model="form.phone" required
                  ><template v-slot:prepend-inner> <v-icon icon="mdi-phone-outline" /> </template
                ></v-text-field>
              </v-col>
            </v-row>
          </v-tabs-window-item>

          <!-- Pestaña 3: Otros Documentos -->
          <v-tabs-window-item value="documentos">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field label="Tu email" v-model="form.email" required />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field label="Teléfono" v-model="form.phone" required />
              </v-col>
            </v-row>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
    </v-container>
    <div class="text-end px-6">
      <v-btn class="colorcustom px-5" size="x-large" rounded="0">
        Cotizar
        <img
          src="/public/circle-dollar-to-slot.svg"
          alt=""
          style="width: 20px; height: 20px; padding-left: 6px"
        />
      </v-btn>
    </div>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'

// Inicializamos la pestaña activa en "cotizar"
const activeTab = ref('cotizar')

// Datos del formulario
const form = ref({
  origen: null,
  destino: null,
  tipoEnvio: null,
  tipoCarga: null,
  country: null,
  address: '',
  volumenCarga: '',
  pesoCarga: '',
  email: '',
  phone: '',
})

// Opciones para los selects
const origenes = ['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']
const destinos = [
  'Florida',
  'Georgia',
  'Guam',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
]
const paises = ['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']

const shippingTypes = ['Marítimo', 'Aéreo', 'Terrestre', 'Otro']
const cargoTypes = ['Contenedor', 'Carga Suelta', 'Paletizada']

// Función para procesar el formulario
const submitForm = () => {
  console.log('Datos del formulario:', form.value)
  alert('Formulario enviado correctamente')
}
</script>

<style scoped>
.titleForm {
  color: var(--00235-a, #080c24);
  font-family: Yantramanav;
  font-size: 30px !important;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
.captionForm {
  color: var(--565969, #565969);
  font-family: 'Public Sans';
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 26px; /* 162.5% */
}
.link {
  color: #000;
  font-family: Yantramanav;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-transform: capitalize;
  margin-right: 15px;
}
.colorcustom {
  background-color: #ea950e;
  color: white;
  color: var(--Style, #fff);
  font-family: 'Public Sans';
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
.customEnum {
  color: #000;
  font-family: Yantramanav;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 26px; /* 185.714% */
}
</style>
