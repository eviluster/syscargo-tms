<template>
  <v-card class="mx-auto" max-width="600" style="margin-top: -3%">
    <v-card-item>
      <v-card-title class="d-flex justify-center my-4"> PEDIR COTIZACIÓN </v-card-title>
      <v-divider :thickness="3" class="my-4"></v-divider>
    </v-card-item>
    <v-card-text>
      <form @submit.prevent="submit">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="name.value.value"
              :counter="10"
              :error-messages="name.errorMessage.value"
              label="Nombre"
              ><template v-slot:prepend-inner>
                <v-icon>mdi-account</v-icon>
              </template></v-text-field
            >
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="email.value.value"
              :error-messages="email.errorMessage.value"
              label="Email"
              ><template v-slot:prepend-inner>
                <v-icon>mdi-email</v-icon>
              </template></v-text-field
            >
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="phone.value.value"
              :counter="7"
              :error-messages="phone.errorMessage.value"
              label="Teléfono"
              ><template v-slot:prepend-inner>
                <v-icon>mdi-phone</v-icon>
              </template></v-text-field
            >
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="select.value.value"
              :error-messages="select.errorMessage.value"
              :items="items"
              label="Asunto"
            >
              <template v-slot:prepend-inner>
                <v-icon>mdi-menu-down</v-icon>
              </template></v-select
            >
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="12">
            <v-textarea color="black" label="Escriba el mensaje"
              ><template v-slot:prepend-inner>
                <v-icon>mdi-pencil</v-icon>
              </template></v-textarea
            >
          </v-col>
        </v-row>
        <v-row align="center" justify="center">
          <v-col cols="auto">
            <v-btn
              rounded="0"
              @click="handleReset"
              color="orange-darken-3"
              class="mb-4 py-2"
              style="margin-top: -5%"
              >Enviar</v-btn
            >
          </v-col>
        </v-row>
      </form>
    </v-card-text>
  </v-card>
</template>
<script setup>
import { useField, useForm } from 'vee-validate'
import { ref } from 'vue'

const { handleSubmit, handleReset } = useForm({
  validationSchema: {
    name(value) {
      if (value?.length >= 2) return true
      return 'Name needs to be at least 2 characters.'
    },
    phone(value) {
      if (/^[0-9-]{7,}$/.test(value)) return true
      return 'Phone number needs to be at least 7 digits.'
    },
    email(value) {
      if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true
      return 'Must be a valid e-mail.'
    },
    select(value) {
      if (value) return true

      return 'Select an item.'
    },
  },
})

const name = useField('name')
const phone = useField('phone')
const email = useField('email')
const select = useField('select')
const items = ref(['Item 1', 'Item 2', 'Item 3', 'Item 4'])
const submit = handleSubmit((values) => {
  alert(JSON.stringify(values, null, 2))
})
</script>
