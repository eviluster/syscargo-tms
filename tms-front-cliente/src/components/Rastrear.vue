<template>
    <BannerDinamico :title="bannerTitle" :breadcrumbItems="breadcrumb" />
    <v-container style="margin-top: 10%">
        <v-row justify="start">
            <v-col cols="8" md="4" class="d-flex justify-start">
                <h2>Insertar codigo de envio</h2>
            </v-col>
        </v-row>
           <v-divider class="border-opacity-100 divider2" color="warning" style="max-width: 500px;margin-left:-1%;" inset></v-divider>
        <v-row style="max-width: 800px;margin-bottom:18%;">
            <v-col cols="10" md="8" class="d-flex justify-start" style="max-width: 700px;margin-left:-12%;">
                <v-responsive class="mx-auto" max-width="200">
                    <v-text-field hide-details="auto" label="Codigo" placeholder="12347ADF" type="email"></v-text-field>
                </v-responsive>
                <v-btn color="orange" size="large" class="my-2">
                    Rastrear
                </v-btn>
            </v-col>
        </v-row>
        <v-row class="d-flex justify-center my-6 py-6">
            <!-- Primer ícono -->
            <v-col cols="12" md="2" class="d-flex ">          
                <div class="icon-container">
                    <v-icon class="category-icon active"><span class="mdi mdi-warehouse"></span></v-icon>                                                    
                </div>           
                <v-divider thickness="4"  class="border-opacity-100 divider" style="max-width: 50px;" color="warning"></v-divider>
            </v-col>
            <!-- Segundo ícono -->
            
            <v-col cols="12" md="2" class="d-flex ">
                <div class="icon-container">
                    <v-icon class="category-icon desactive"><span class="mdi mdi-ferry"></span></v-icon>
                </div>
                <v-divider thickness="4" class="border-opacity-100 divider" color="warning"></v-divider>
            </v-col>
            <!-- Tercer ícono --> 
            <v-col cols="12" md="2" class="d-flex ">
                <div class="icon-container">
                    <v-icon class="category-icon desactive"><span class="mdi mdi-crane"></span></v-icon>
                </div>
                <v-divider thickness="4" class="border-opacity-100 divider" color="warning"></v-divider>
            </v-col>
            <!-- Cuarto ícono -->
           
            <v-col cols="12" md="2" class="d-flex ">
                <div class="icon-container">
                    <v-icon class="category-icon desactive"><span class="mdi mdi-truck-delivery"></span></v-icon>
                </div>
                <v-divider thickness="4" class="border-opacity-100 divider" color="warning"></v-divider>
            </v-col>
            <!-- Quinto ícono -->
            <v-col cols="12" md="2" class="d-flex">
                <div class="icon-container">
                    <v-icon class="category-icon desactive"><span class="mdi mdi-package-check"></span></v-icon>
                </div>
            </v-col>
        </v-row>
        <v-row justify="center">
            <h2 style="width: 100%;" class="d-flex justify-center">Detalles de la orden</h2>
            <v-col cols="12" md="8" class="d-flex justify-center">
                <v-data-table :items="items" hide-default-footer style="background-color:#E0E0E0;"></v-data-table>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
import BannerDinamico from '@/components/BannerDinamico.vue'
import { defineComponent } from 'vue';

export default defineComponent({
    components: { BannerDinamico },
    setup() {
        const bannerTitle = 'Rastrear orden';
        const breadcrumb = [
            { title: 'Home', disabled: false, href: '/' },
            { title: 'Rastrear orden', disabled: true },
        ];

        const items = [
            {
                datos1: '',
                datos2: '',
                datos3: '',
                datos4: '',
            },
        ];

        return { bannerTitle, breadcrumb, items };
    },
});
</script>
<style>
.icon-container {
    position: absolute;
    top: 900px;
    background: white;
    border-radius: 50%;
    padding: 10px;
    width: 70px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 5px solid orange;
    z-index: 2;
}

.category-icon {
    font-size: 30px;
}
.divider{
    margin-top: -50%;
    margin-left: 70%;
}
.divider2{
   margin: 30px 30px;
}
.icon-container .category-icon.active {
    transform: scale(1.2); /* Aumenta ligeramente el tamaño */
    transition: all 0.3s ease; /* Transición suave */
}


.icon-container .category-icon.desactive {
    color: #CCCCCC; /* Color gris para el estado desactivado */
    opacity: 0.7; /* Reduce la opacidad */
    transition: all 0.3s ease; /* Transición suave */
}
</style>
