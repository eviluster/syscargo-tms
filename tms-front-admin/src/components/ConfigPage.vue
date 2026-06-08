<template>
  <div class="container mx-auto p-6">
    <div v-if="loading">Cargando configuración...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else>
      <!-- Si es html, lo renderizo como HTML -->
      <div v-if="setting?.type === 'html'" v-html="setting.value"></div>

      <!-- MARKDOWN (usa el html ya generado en backend) -->
      <div
        v-else-if="setting?.type === 'markdown'"
        v-html="setting.value.html"
      ></div>

      <!-- Si es string o json -->
      <div v-else style="white-space: pre-line">
        {{ formatValue(setting) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "@/services/api";

const props = defineProps<{ keySetting: string; title: string }>();

const setting = ref<any>(null);
const loading = ref(true);
const error = ref<string | null>(null);

function formatValue(s: any) {
  if (!s) return "";
  if (s.type === "json") return JSON.stringify(s.value, null, 2);
  return s.value;
}

async function fetchSetting() {
  loading.value = true;
  try {
    const res = await api.get(`/settings/${props.keySetting}`);
    console.log(res.data.data);
    setting.value = res.data.data;
  } catch (e: any) {
    error.value = e?.response?.data?.message || "Error cargando configuración";
  } finally {
    loading.value = false;
  }
}

onMounted(fetchSetting);
</script>
