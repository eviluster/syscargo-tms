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
        <!-- Formulario principal con validación -->
        <Form @submit="handleSubmit" :validation-schema="schema" v-slot="{ resetForm }">
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
                  <Field name="origen" v-slot="{ field, errorMessage }">
                    <v-select
                      label="Origen"
                      :items="origenes"
                      v-model="form.origen"
                      v-bind="field"
                      :error-messages="errorMessage"
                      required
                    >
                      <template v-slot:prepend-inner>
                        <img
                          src="/public/formReserva/Vector(2).svg"
                          alt=""
                          style="width: 16px; height: 16px"
                        />
                      </template>
                    </v-select>
                  </Field>
                </v-col>
                <v-col cols="12" sm="6">
                  <Field name="destino" v-slot="{ field, errorMessage }">
                    <v-select
                      label="Destino"
                      :items="destinos"
                      v-model="form.destino"
                      v-bind="field"
                      :error-messages="errorMessage"
                      required
                    >
                      <template v-slot:prepend-inner>
                        <img
                          src="/public/formReserva/Vector(2).svg"
                          alt=""
                          style="width: 16px; height: 16px"
                        />
                      </template>
                    </v-select>
                  </Field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6">
                  <Field name="tipoEnvio" v-slot="{ field, errorMessage }">
                    <v-select
                      label="Tipo de envío"
                      :items="shippingTypes"
                      v-model="form.tipoEnvio"
                      v-bind="field"
                      :error-messages="errorMessage"
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
                  </Field>
                </v-col>
                <v-col cols="12" sm="6">
                  <Field name="tipoCarga" v-slot="{ field, errorMessage }">
                    <v-select
                      label="Tipo de carga"
                      :items="cargoTypes"
                      v-model="form.tipoCarga"
                      v-bind="field"
                      :error-messages="errorMessage"
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
                  </Field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <span class="customEnum">Datos de la Carga :</span>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6">
                  <Field name="peso" v-slot="{ field, errorMessage }">
                    <v-text-field
                      label="Peso de la carga"
                      type="number"
                      variant="solo-filled"
                      v-model="form.peso"
                      v-bind="field"
                      :error-messages="errorMessage"
                    >
                      <template v-slot:prepend-inner>
                        <img
                          src="/public/formReserva/scale-unbalanced-flip.svg"
                          alt=""
                          style="width: 22px; height: 22px"
                        />
                      </template>
                    </v-text-field>
                  </Field>
                </v-col>
                <v-col cols="12" sm="6">
                  <Field name="volumenCarga" v-slot="{ field, errorMessage }">
                    <v-text-field
                      label="Volumen de la Carga"
                      type="number"
                      variant="solo-filled"
                      v-model="form.volumenCarga"
                      v-bind="field"
                      :error-messages="errorMessage"
                    >
                      <template v-slot:prepend-inner>
                        <img
                          src="/public/formReserva/layer-group(1).svg"
                          alt=""
                          style="width: 22px; height: 22px"
                        />
                      </template>
                    </v-text-field>
                  </Field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6">
                  <Field name="country" v-slot="{ field, errorMessage }">
                    <v-select
                      label="País"
                      :items="paises"
                      v-model="form.country"
                      v-bind="field"
                      :error-messages="errorMessage"
                      required
                    >
                      <template v-slot:prepend-inner>
                        <img
                          src="/public/formReserva/Vector(4).svg"
                          alt=""
                          style="width: 22px; height: 22px"
                        />
                      </template>
                    </v-select>
                  </Field>
                </v-col>
                <v-col cols="12" sm="6">
                  <Field name="address" v-slot="{ field, errorMessage }">
                    <v-text-field
                      label="Dirección"
                      v-model="form.address"
                      v-bind="field"
                      :error-messages="errorMessage"
                      required
                    >
                      <template v-slot:prepend-inner>
                        <img
                          src="/public/formReserva/Vector(2).svg"
                          alt=""
                          style="width: 16px; height: 16px"
                        />
                      </template>
                    </v-text-field>
                  </Field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6">
                  <Field name="emailCarga" v-slot="{ field, errorMessage }">
                    <v-text-field
                      label="Tu email"
                      v-model="form.emailCarga"
                      v-bind="field"
                      :error-messages="errorMessage"
                      required
                    >
                      <template v-slot:prepend-inner>
                        <v-icon icon="mdi-email-outline" />
                      </template>
                    </v-text-field>
                  </Field>
                </v-col>
                <v-col cols="12" sm="6">
                  <Field name="phone" v-slot="{ field, errorMessage }">
                    <v-text-field
                      label="Teléfono"
                      v-model="form.phone"
                      v-bind="field"
                      :error-messages="errorMessage"
                      required
                    >
                      <template v-slot:prepend-inner>
                        <v-icon icon="mdi-phone-outline" />
                      </template>
                    </v-text-field>
                  </Field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" class="text-end px-6">
                  <v-btn
                    class="colorcustom px-5"
                    size="x-large"
                    rounded="0"
                    type="submit"
                    :loading="loading"
                    :disabled="loading"
                    @click="handleSubmit"
                  >
                    Cotizar
                    <template v-slot:loader>
                      <span class="custom-loader">
                        <v-icon light>mdi-cached</v-icon>
                      </span>
                    </template>
                    <img
                      src="/public/circle-dollar-to-slot.svg"
                      alt=""
                      style="width: 20px; height: 20px; padding-left: 6px"
                    />
                  </v-btn>
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
                  <Field name="nombreRemitente" v-slot="{ field, errorMessage }">
                    <v-text-field
                      label="Tu nombre"
                      v-model="form.nombreRemitente"
                      v-bind="field"
                      :error-messages="errorMessage"
                      required
                    >
                      <template v-slot:prepend-inner>
                        <v-icon icon="mdi-account-outline" />
                      </template>
                    </v-text-field>
                  </Field>
                </v-col>
                <v-col cols="12" sm="6">
                  <Field name="dniRemitente" v-slot="{ field, errorMessage }">
                    <v-text-field
                      label="DNI"
                      v-model="form.dniRemitente"
                      v-bind="field"
                      :error-messages="errorMessage"
                      required
                    >
                      <template v-slot:prepend-inner>
                        <v-icon icon="mdi-card-account-details-outline" /> </template
                    ></v-text-field>
                  </Field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6">
                  <Field name="paisRemitente" v-slot="{ field, errorMessage }">
                    <v-select
                      label="País"
                      :items="paises"
                      v-model="form.paisRemitente"
                      v-bind="field"
                      :error-messages="errorMessage"
                      required
                    >
                      <template v-slot:prepend-inner>
                        <img
                          src="/public/formReserva/Vector(4).svg"
                          alt=""
                          style="width: 22px; height: 22px"
                        />
                      </template>
                    </v-select>
                  </Field>
                </v-col>
                <v-col cols="12" sm="6">
                  <Field name="direccionRemitente" v-slot="{ field, errorMessage }">
                    <v-text-field
                      label="Dirección"
                      v-model="form.direccionRemitente"
                      v-bind="field"
                      :error-messages="errorMessage"
                      required
                    >
                      <template v-slot:prepend-inner>
                        <img
                          src="/public/formReserva/Vector(2).svg"
                          alt=""
                          style="width: 16px; height: 16px"
                        />
                      </template>
                    </v-text-field>
                  </Field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6">
                  <Field name="emailRemitente" v-slot="{ field, errorMessage }">
                    <v-text-field
                      label="Tu email"
                      v-model="form.emailRemitente"
                      v-bind="field"
                      :error-messages="errorMessage"
                      required
                    >
                      <template v-slot:prepend-inner>
                        <v-icon icon="mdi-email-outline" />
                      </template>
                    </v-text-field>
                  </Field>
                </v-col>
                <v-col cols="12" sm="6">
                  <Field name="telefonoRemitente" v-slot="{ field, errorMessage }">
                    <v-text-field
                      label="Teléfono"
                      v-model="form.telefonoRemitente"
                      v-bind="field"
                      :error-messages="errorMessage"
                      required
                    >
                      <template v-slot:prepend-inner>
                        <v-icon icon="mdi-phone-outline" />
                      </template>
                    </v-text-field>
                  </Field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <span class="customEnum">Datos del Destinatario :</span>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6">
                  <Field name="nombreDestinatario" v-slot="{ field, errorMessage }">
                    <v-text-field
                      label="Tu nombre"
                      v-model="form.nombreDestinatario"
                      v-bind="field"
                      :error-messages="errorMessage"
                      required
                    >
                      <template v-slot:prepend-inner>
                        <v-icon icon="mdi-account-outline" />
                      </template>
                    </v-text-field>
                  </Field>
                </v-col>
                <v-col cols="12" sm="6">
                  <Field name="dniDestinatario" v-slot="{ field, errorMessage }">
                    <v-text-field
                      label="DNI"
                      v-model="form.dniDestinatario"
                      v-bind="field"
                      :error-messages="errorMessage"
                      required
                    >
                      <template v-slot:prepend-inner>
                        <v-icon icon="mdi-card-account-details-outline" /> </template
                    ></v-text-field>
                  </Field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6">
                  <Field name="paisDestinatario" v-slot="{ field, errorMessage }">
                    <v-select
                      label="País"
                      :items="paises"
                      v-model="form.paisDestinatario"
                      v-bind="field"
                      :error-messages="errorMessage"
                      required
                    >
                      <template v-slot:prepend-inner>
                        <img
                          src="/public/formReserva/Vector(4).svg"
                          alt=""
                          style="width: 22px; height: 22px"
                        />
                      </template>
                    </v-select>
                  </Field>
                </v-col>
                <v-col cols="12" sm="6">
                  <Field name="direccionDestinatario" v-slot="{ field, errorMessage }">
                    <v-text-field
                      label="Dirección"
                      v-model="form.direccionDestinatario"
                      v-bind="field"
                      :error-messages="errorMessage"
                      required
                    >
                      <template v-slot:prepend-inner>
                        <img
                          src="/public/formReserva/Vector(2).svg"
                          alt=""
                          style="width: 16px; height: 16px"
                        />
                      </template>
                    </v-text-field>
                  </Field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6">
                  <Field name="emailDestinatario" v-slot="{ field, errorMessage }">
                    <v-text-field
                      label="Tu email"
                      v-model="form.emailDestinatario"
                      v-bind="field"
                      :error-messages="errorMessage"
                      required
                    >
                      <template v-slot:prepend-inner>
                        <v-icon icon="mdi-email-outline" />
                      </template>
                    </v-text-field>
                  </Field>
                </v-col>
                <v-col cols="12" sm="6">
                  <Field name="telefonoDestinatario" v-slot="{ field, errorMessage }">
                    <v-text-field
                      label="Teléfono"
                      v-model="form.telefonoDestinatario"
                      v-bind="field"
                      :error-messages="errorMessage"
                      required
                    >
                      <template v-slot:prepend-inner>
                        <v-icon icon="mdi-phone-outline" />
                      </template>
                    </v-text-field>
                  </Field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" class="text-end px-6">
                  <v-btn
                    class="colorcustom px-5"
                    size="x-large"
                    rounded="0"
                    type="submit"
                    :loading="loading"
                    :disabled="loading"
                    @click="handleSubmit"
                  >
                    Aceptar
                  </v-btn>
                </v-col>
              </v-row>
            </v-tabs-window-item>

            <!-- Pestaña 3: Otros Documentos -->
            <v-tabs-window-item value="documentos">
              <v-row>
                <v-col cols="12" sm="6">
                  <Field name="emailDocumentos" v-slot="{ field, errorMessage }">
                    <v-text-field
                      label="Tu email"
                      v-model="form.emailDocumentos"
                      v-bind="field"
                      :error-messages="errorMessage"
                      required
                    />
                  </Field>
                </v-col>
                <v-col cols="12" sm="6">
                  <Field name="telefonoDocumentos" v-slot="{ field, errorMessage }">
                    <v-text-field
                      label="Teléfono"
                      v-model="form.telefonoDocumentos"
                      v-bind="field"
                      :error-messages="errorMessage"
                      required
                    />
                  </Field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" class="text-end px-6">
                  <v-btn
                    class="colorcustom px-5"
                    size="x-large"
                    rounded="0"
                    type="submit"
                    :loading="loading"
                    :disabled="loading"
                    @click="handleSubmit"
                  >
                    Aceptar
                  </v-btn>
                </v-col>
              </v-row>
            </v-tabs-window-item>
          </v-tabs-window>
        </Form>
      </v-card-text>
    </v-container>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import Swal from 'sweetalert2'

const loading = ref(false)
const activeTab = ref('cotizar')

const schema = yup.object({
  origen: yup.string().required('El origen es requerido'),
  destino: yup.string().required('El destino es requerido'),
  tipoEnvio: yup.string().required('El tipo de envío es requerido'),
  tipoCarga: yup.string().required('El tipo de carga es requerido'),
  peso: yup.number().required('El peso debe ser positivo y  es requerido').nullable().positive(),
  volumenCarga: yup
    .number()
    .required('El volumen debe ser positivo y es requerido')
    .nullable()
    .positive(),
  country: yup.string().required('El país es requerido'),
  address: yup.string().required('La dirección es requerida'),
  emailCarga: yup.string().email('Ingrese un email válido').required('El email es requerido'),
  phone: yup.string().required('El teléfono es requerido'),
  nombreRemitente: yup.string().required('El nombre del remitente es requerido'),
  dniRemitente: yup.string().required('El DNI del remitente es requerido'),
  paisRemitente: yup.string().required('El país del remitente es requerido'),
  direccionRemitente: yup.string().required('La dirección del remitente es requerida'),
  emailRemitente: yup
    .string()
    .email('Ingrese un email válido')
    .required('El email del remitente es requerido'),
  telefonoRemitente: yup.string().required('El teléfono del remitente es requerido'),
  nombreDestinatario: yup.string().required('El nombre del destinatario es requerido'),
  dniDestinatario: yup.string().required('El DNI del destinatario es requerido'),
  paisDestinatario: yup.string().required('El país del destinatario es requerido'),
  direccionDestinatario: yup.string().required('La dirección del destinatario es requerida'),
  emailDestinatario: yup
    .string()
    .email('Ingrese un email válido')
    .required('El email del destinatario es requerido'),
  telefonoDestinatario: yup.string().required('El teléfono del destinatario es requerido'),
  emailDocumentos: yup.string().email('Ingrese un email válido').required('El email es requerido'),
  telefonoDocumentos: yup.string().required('El teléfono es requerido'),
})

const form = ref({
  origen: null,
  destino: null,
  tipoEnvio: null,
  tipoCarga: null,
  country: null,
  address: '',
  volumenCarga: '',
  peso: '',
  email: '',
  phone: '',
  nombreRemitente: '',
  dniRemitente: '',
  paisRemitente: '',
  direccionRemitente: '',
  emailRemitente: '',
  telefonoRemitente: '',
  nombreDestinatario: '',
  dniDestinatario: '',
  paisDestinatario: '',
  direccionDestinatario: '',
  emailDestinatario: '',
  telefonoDestinatario: '',
  emailDocumentos: '',
  telefonoDocumentos: '',
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
const handleSubmit = async (values, { resetForm }) => {
  loading.value = true

  setTimeout(() => {
    loading.value = false

    try {
      console.log('Datos enviados:', values)

      Swal.fire({
        title: 'Éxito',
        text: 'Reserva creada exitosamente!',
        icon: 'success',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#EA950E',
      }).then(() => {
        // Resetear el formulario
        resetForm()
        // Resetear explícitamente los selects a null
        form.value = {
          origen: null,
          destino: null,
          tipoEnvio: null,
          tipoCarga: null,
          country: null,
          address: '',
          volumenCarga: '',
          peso: '',
          emailCarga: '',
          phone: '',
          nombreRemitente: '',
          dniRemitente: '',
          paisRemitente: null,
          direccionRemitente: '',
          emailRemitente: '',
          telefonoRemitente: '',
          nombreDestinatario: '',
          dniDestinatario: '',
          paisDestinatario: null,
          direccionDestinatario: '',
          emailDestinatario: '',
          telefonoDestinatario: '',
          emailDocumentos: '',
          telefonoDocumentos: '',
        }
        activeTab.value = 'cotizar'
      })
    } catch (error) {
      console.error('Error:', error)
      Swal.fire({
        title: 'Error',
        text: 'Hubo un error al procesar la reserva',
        icon: 'error',
        confirmButtonText: 'Entendido',
      })
    }
  }, 1500)
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
  line-height: 26px;
  /* 162.5% */
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
  line-height: 26px;
  /* 185.714% */
}
.custom-loader {
  animation: loader 1s infinite linear;
}
@keyframes loader {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
