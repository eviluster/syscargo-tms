<template>
  <v-card class="mx-auto" max-width="600" style="background-color: orange">
    <v-card-item>
      <v-card-title class="d-flex justify-center my-4 title"> CONTACT INFORMATION </v-card-title>
      <v-divider :thickness="3" class="my-4 divider"></v-divider>
    </v-card-item>
    <v-card-text>
      <v-row class="info my-6 mx-4">
        <v-col cols="12" md="12">
          <h3 class="my-4">Contact Number:</h3>
          <div style="display: flex; align-items: center">
            <div class="yellow mr-4">
              <i class="fas fa-mobile-alt" style="font-size: x-large"></i>
            </div>
            <div>
              <p class="number">+53 54711145</p>
              <p class="number">+53 54711145</p>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row class="info2 mx-4">
        <v-col cols="12" md="12">
          <h3 class="my-4">Mail Address:</h3>
          <div style="display: flex; align-items: center">
            <div class="black mr-4">
              <span class="mdi mdi-email-check-outline"></span>
            </div>
            <div>
              <p class="email">correo1@gmail.com</p>
              <p class="email">correo1@gmail.com</p>
            </div>
          </div>
        </v-col>
      </v-row>
      <br />
      <v-row class="info2 my-4 mx-4">
        <v-col cols="12" md="12">
          <h3 class="my-4">Office Location:</h3>
          <div style="display: flex; align-items: center">
            <div class="yellow mr-4">
              <span class="mdi mdi-map-marker"></span>
            </div>
            <div>
              <p class="address">29B entre 70 y 72 #7010</p>
              <p class="address">29B entre 70 y 72 #7010</p>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<style scoped>
.yellow {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  border-radius: 5px;
  background-color: #ea950e;
  height: 50px;
  width: 50px;
  color: white;
}
.black {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  border-radius: 5px;
  background-color: #060606;
  height: 50px;
  width: 50px;
  color: white;
}
.divider,
.title {
  color: white !important;
}
.info,
.info2 {
  font-size: 20px;
  background-color: white !important;
}
</style>
