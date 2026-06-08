<template>
  <div class="p-4">
    <h3>Generar PDF — Plantilla Carta de Porte</h3>
    <!-- <p class="text-muted mb-3">
      Genera un PDF A4 con la plantilla en blanco. La imagen que se intentará
      usar es:
      <code>{{ resolvedPreviewPath }}</code>
    </p> -->

    <div class="mb-3">
      <!-- <small class="text-muted">
        (Primero intenta la importación explícita desde
        <code>src/assets/carta_template.png</code>, luego fallbacks).
      </small> -->
    </div>

    <div class="d-flex gap-2 mb-3">
      <button class="btn btn-primary" @click="generatePdf" :disabled="loading">
        <span v-if="!loading">Generar PDF plantilla</span>
        <span v-else
          >Generando...
          <span class="spinner-border spinner-border-sm ms-2"></span
        ></span>
      </button>

      <button
        class="btn btn-outline-secondary"
        @click="openPreview"
        :disabled="loadingPreview || (!templateLoaded && !uploadedPreview)"
      >
        <span v-if="!loadingPreview">Previsualizar plantilla</span>
        <span v-else>Generando preview...</span>
      </button>
    </div>

    <!-- <div v-if="infoMessage" class="mt-2 text-info">{{ infoMessage }}</div> -->
    <div v-if="error" class="mt-2 text-danger">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { jsPDF } from "jspdf";
import templateUrlDefault from "@/assets/carta_template.png"; // mantiene tu import

const loading = ref(false);
const loadingPreview = ref(false);
const error = ref<string | null>(null);
const infoMessage = ref<string | null>(null);
const templateLoaded = ref(false);
const lastTriedUrls = ref<string[]>([]);
const resolvedPreviewPath = ref<string>("");

function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Error cargando imagen desde ${url}`));
    img.src = url;
  });
}

function detectImageFormatFromUrl(url: string) {
  const u = (url || "").toLowerCase();
  if (u.includes(".png") || u.startsWith("data:image/png")) return "PNG";
  if (
    u.includes(".jpg") ||
    u.includes(".jpeg") ||
    u.startsWith("data:image/jpeg")
  )
    return "JPEG";
  return "PNG";
}

async function preloadTemplateRobust(
  filename = "carta_template.png",
): Promise<HTMLImageElement> {
  lastTriedUrls.value = [];
  infoMessage.value = null;
  error.value = null;

  if (templateUrlDefault) {
    lastTriedUrls.value.push(String(templateUrlDefault));
    resolvedPreviewPath.value = String(templateUrlDefault);
    try {
      const img = await loadImageFromUrl(String(templateUrlDefault));
      templateLoaded.value = true;
      infoMessage.value = `Plantilla cargada desde import: ${String(templateUrlDefault)}`;
      return img;
    } catch (err) {}
  }

  try {
    const publicUrl = `${window.location.origin}/${filename}`;
    lastTriedUrls.value.push(publicUrl);
    resolvedPreviewPath.value = publicUrl;
    const img = await loadImageFromUrl(publicUrl);
    templateLoaded.value = true;
    infoMessage.value = `Plantilla cargada desde public: ${publicUrl}`;
    return img;
  } catch {}

  templateLoaded.value = false;
  error.value =
    "No se pudo cargar la plantilla. Coloca el archivo en /public/carta_template.png o verifica src/assets.";
  throw new Error(error.value);
}

/**
 * 🔄 Corrige la orientación a vertical (al derecho)
 * Si la imagen es horizontal, la rota 90° a la IZQUIERDA (counter-clockwise)
 */
function normalizeImageToDataUrl(
  img: HTMLImageElement,
  preferType: "PNG" | "JPEG" = "PNG",
): string {
  const w = img.naturalWidth || img.width || 1000;
  const h = img.naturalHeight || img.height || 1000;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo crear canvas");

  if (w > h) {
    // landscape → rotar 90° a la izquierda
    canvas.width = h;
    canvas.height = w;
    ctx.translate(0, canvas.height);
    ctx.rotate(-Math.PI / 2);
    ctx.drawImage(img, 0, 0, w, h);
  } else {
    // portrait → sin rotar
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(img, 0, 0, w, h);
  }

  const mime = preferType === "PNG" ? "image/png" : "image/jpeg";
  return canvas.toDataURL(mime, 1.0);
}

async function generatePdf() {
  loading.value = true;
  error.value = null;
  infoMessage.value = null;
  lastTriedUrls.value = [];

  try {
    const img = await preloadTemplateRobust();
    const imgType = detectImageFormatFromUrl(img.src || "");
    let dataUrl = normalizeImageToDataUrl(
      img,
      imgType === "JPEG" ? "JPEG" : "PNG",
    );

    const doc = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    });
    doc.addImage(dataUrl, detectImageFormatFromUrl(dataUrl), 0, 0, 210, 297);

    const fileName = `CartaPorte_Plantilla_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
    infoMessage.value = "PDF generado correctamente ";
  } catch (err: any) {
    console.error("generatePdf error:", err);
    error.value = err?.message || "Error generando PDF";
  } finally {
    loading.value = false;
  }
}

async function openPreview() {
  loadingPreview.value = true;
  error.value = null;
  infoMessage.value = null;
  lastTriedUrls.value = [];

  try {
    const img = await preloadTemplateRobust();
    const imgType = detectImageFormatFromUrl(img.src || "");
    let dataUrl = normalizeImageToDataUrl(
      img,
      imgType === "JPEG" ? "JPEG" : "PNG",
    );

    const doc = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    });
    doc.addImage(dataUrl, detectImageFormatFromUrl(dataUrl), 0, 0, 210, 297);

    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  } catch (err: any) {
    console.error("openPreview error:", err);
    error.value = err?.message || "Error generando preview";
  } finally {
    loadingPreview.value = false;
  }
}
</script>

<style scoped>
.btn {
  min-width: 180px;
}
ul {
  margin: 4px 0 0 16px;
  padding: 0;
  font-size: 0.85em;
  color: #555;
}
</style>
