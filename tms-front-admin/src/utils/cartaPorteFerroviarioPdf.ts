// src/utils/cartaPortePdf.ts
import { jsPDF } from "jspdf";
import templateUrlDefault from "@/assets/carta-porte-ferroviario.png";

/** Crea HTMLImageElement desde url */
function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Error cargando imagen desde ${url}`));
    img.src = url;
  });
}

/**
 * Dibuja la imagen en un canvas aplicando rotación opcional y usando
 * ESCALADO "contain" (encajar entero) para que no se recorte.
 * Devuelve dataURL PNG de alta resolución (300 DPI aprox).
 */
async function imageToDataUrlContain(
  url: string,
  forceRotate?: 0 | 90 | 180 | 270,
): Promise<string> {
  const img = await loadImageFromUrl(url);

  const sw = img.naturalWidth || img.width || 1;
  const sh = img.naturalHeight || img.height || 1;

  // Alta resolución canvas A4 (300 dpi)
  const canvasW = 2480;
  const canvasH = 3508;

  const canvas = document.createElement("canvas");
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo crear canvas");

  // fondo blanco (por si la imagen tiene transparencias)
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvasW, canvasH);

  const rotate = typeof forceRotate === "number" ? forceRotate : 0;

  ctx.save();

  // Para rotaciones 90/270, intercambiamos el área de dibujo lógica
  // Aplicamos transformaciones para rotar la coordenada en la que dibujaremos.
  if (rotate === 90) {
    ctx.translate(canvasW / 2, canvasH / 2);
    ctx.rotate((90 * Math.PI) / 180);
    ctx.translate(-canvasH / 2, -canvasW / 2);
  } else if (rotate === 270) {
    ctx.translate(canvasW / 2, canvasH / 2);
    ctx.rotate((270 * Math.PI) / 180);
    ctx.translate(-canvasH / 2, -canvasW / 2);
  } else if (rotate === 180) {
    ctx.translate(canvasW / 2, canvasH / 2);
    ctx.rotate((180 * Math.PI) / 180);
    ctx.translate(-canvasW / 2, -canvasH / 2);
  }

  // Dimensiones lógicas para dibujar (teniendo en cuenta rotación)
  const drawAreaW = rotate === 90 || rotate === 270 ? canvasH : canvasW;
  const drawAreaH = rotate === 90 || rotate === 270 ? canvasW : canvasH;

  // --- Cambio clave: uso de "contain" para que la imagen quepa entera ---
  const scale = Math.min(drawAreaW / sw, drawAreaH / sh);
  const dw = Math.round(sw * scale);
  const dh = Math.round(sh * scale);

  // Centrar la imagen dentro del área disponible
  const dx = Math.round((drawAreaW - dw) / 2);
  const dy = Math.round((drawAreaH - dh) / 2);

  // Dibujar imagen centrada y contenida (no recortada)
  ctx.drawImage(img, dx, dy, dw, dh);

  ctx.restore();

  return canvas.toDataURL("image/png", 1.0);
}

/**
 * generateCartaPortePdf - principal
 *
 * opts.forceRotate: opcional para forzar corrección [0|90|180|270]
 */
export async function generateCartaPorteFerroviarioPdf(
  opts: {
    filename?: string;
    overlayData?: Record<string, string | number | undefined>;
    openPreview?: boolean;
    forceRotate?: 0 | 90 | 180 | 270;
  } = {},
) {
  const filename =
    opts.filename || `CartaPorte_${new Date().toISOString().slice(0, 10)}.pdf`;
  const overlay = opts.overlayData || {};
  const openPreview = !!opts.openPreview;

  try {
    // Generar dataURL con contain (no crop)
    const dataUrl = await imageToDataUrlContain(
      String(templateUrlDefault),
      opts.forceRotate,
    );

    const doc = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    });

    const pageW = 210;
    const pageH = 297;

    // Insertar imagen A4 completa — jsPDF reescala desde dataURL alta resolución.
    doc.addImage(dataUrl, "PNG", 0, 0, pageW, pageH, undefined, "FAST");

    // --- overlay: coordenadas en mm (ajusta si lo necesitas) ---
    const xBase = 18;
    const yBase = 55;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    if (overlay.remitente_dni) {
      doc.setFontSize(10);
      doc.text(String(overlay.remitente_dni), xBase, yBase);
    }

    if (overlay.remitente_nombre) {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(String(overlay.remitente_nombre), xBase, yBase + 8);
    }

    if (overlay.autorizado_lugar) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const maxWidth = 174;
      const split = doc.splitTextToSize(
        String(overlay.autorizado_lugar),
        maxWidth,
      );
      doc.text(split as string[], xBase, yBase + 18);
    }

    if (openPreview) {
      const blob = doc.output("blob");
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } else {
      doc.save(filename);
    }

    return { ok: true, filename };
  } catch (err: any) {
    console.error("generateCartaPortePdf error:", err);
    throw err;
  }
}
