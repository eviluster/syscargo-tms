<template>
  <div>
    <div ref="editorEl"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from "vue";
import Editor from "@toast-ui/editor";
import "@toast-ui/editor/dist/toastui-editor.css";

const props = defineProps({
  modelValue: { type: String, default: "" },
  // tipos específicos para evitar 'string' genérico que causa error TS
  initialEditType: {
    type: String as () => "markdown" | "wysiwyg",
    default: "markdown",
  },
  height: { type: String, default: "360px" },
  // previewStyle debe ser 'vertical' | 'tab' (coincide con PreviewStyle)
  previewStyle: {
    type: String as () => "vertical" | "tab",
    default: "vertical",
  },
});

const emit = defineEmits(["update:modelValue"]);

const editorEl = ref<HTMLElement | null>(null);
// usar any para evitar problemas con tipos específicos del paquete
let editor: any = null;

onMounted(async () => {
  await nextTick();
  editor = new Editor({
    el: editorEl.value!,
    initialEditType: props.initialEditType, // 'markdown' | 'wysiwyg'
    previewStyle: props.previewStyle, // 'vertical' | 'tab'
    height: props.height,
    initialValue: props.modelValue || "",
    usageStatistics: false,
  });

  // suscribir cambio con el API runtime (evita hooks en options y problemas de typings)
  try {
    editor.on("change", () => {
      try {
        if (props.initialEditType === "markdown") {
          emit("update:modelValue", editor.getMarkdown());
        } else {
          emit("update:modelValue", editor.getHTML());
        }
      } catch (e) {
        // swallow
      }
    });
  } catch (e) {
    // si la versión del editor no soporta `.on` por alguna razón, fallback con polling (raro)
    console.warn("No se pudo attach change listener via editor.on:", e);
  }
});

// cuando el modelValue externo cambie, actualizar editor si es distinto
watch(
  () => props.modelValue,
  (v) => {
    if (!editor) return;
    try {
      if (props.initialEditType === "markdown") {
        const cur = editor.getMarkdown();
        if ((v || "") !== cur) editor.setMarkdown(v || "");
      } else {
        const cur = editor.getHTML();
        if ((v || "") !== cur) editor.setHTML(v || "");
      }
    } catch (e) {
      // ignore
    }
  },
);

onBeforeUnmount(() => {
  if (editor) {
    try {
      editor.remove?.();
    } catch {}
    editor = null;
  }
});
</script>

<style scoped>
/* puedes ajustar estilos si lo deseas */
</style>
