// utils/HojaRutaTerrestrePdf.ts
import { PDFDocument, rgb, StandardFonts, PDFFont } from "pdf-lib";

/**
 * Opciones aceptadas
 */
export type GenerateOpts = {
  filename?: string;
  // <-- aquí permitimos cualquier tipo de valor (string, number, arrays, objetos...)
  overlayData?: Record<string, any>;
  openPreview?: boolean;
  forceRotate?: 0 | 90 | 180 | 270;
  templatePath?: string; // opcional: ruta a la plantilla (por defecto /templates/hoja_ruta_template.pdf)
  // formData?: any; // opcional si deseas también soportarlo
};

/**
 * NOTE: ahora POSITION_MAP puede usar coordenadas 'top' (más intuitivas),
 * o 'y' (bottom-left) como antes. Si ambas están, 'top' tiene prioridad.
 *
 * { top: number } -> top pixels desde la parte superior de la página (más intuitivo)
 * { y: number }   -> coordenada bottom-left (como pdf-lib)
 * Añade también maxWidth, size y align (left|center|right).
 */
const POSITION_MAP: Record<
  string,
  {
    pageIndex?: number;
    top?: number;
    y?: number;
    x: number;
    size?: number;
    maxWidth?: number;
    align?: "left" | "center" | "right";
  }
> = {
  // Encabezado (valores top aproximados; ajusta)
  hojaRutaNo: { x: 30, top: 40, size: 11 }, // top = 40 pts desde arriba
  tipo: { x: 300, top: 40, size: 11, align: "center" },
  marca: { x: 420, top: 40, size: 11, align: "right" },

  // Vehículo
  vehiculo_tractivo: { x: 80, top: 80, size: 10 },
  vehiculo_arrastre1: { x: 80, top: 104, size: 10 },
  vehiculo_arrastre2: { x: 80, top: 128, size: 10 },

  // Fecha (ajusta)
  fecha_d: { x: 50, top: 60, size: 10 },
  fecha_m: { x: 80, top: 60, size: 10 },
  fecha_a: { x: 110, top: 60, size: 10 },

  habilitada_por: { x: 30, top: 170, size: 10 },
  entidad: { x: 210, top: 170, size: 10 },
  organismo: { x: 370, top: 170, size: 10 },
  parqueo: { x: 480, top: 170, size: 10 },

  firma: { x: 40, top: 210, size: 10 },
  cuno: { x: 160, top: 210, size: 10 },

  totales_cantidadViajes: { x: 40, top: 720, size: 10 },

  observaciones: { x: 30, top: 740, size: 9, maxWidth: 520 },

  // etc...
};

/**
 * Usamos top-based coordinates por defecto para el table también.
 * startTop = distancia desde la parte superior (pts), stepTop = salto entre filas (pts).
 */
const SERVICIOS_TABLE = {
  pageIndex: 0,
  topStartY: 230, // top coordinate (ajusta según tu plantilla)
  stepTop: 22, // espacio entre filas (top-based)
  cols: {
    fecha: { x: 30, width: 60 },
    origen: { x: 100, width: 120 },
    destino: { x: 230, width: 120 },
    rutaAutorizada: { x: 360, width: 120 },
    horaSalida: { x: 490, width: 60 },
    horaLlegada: { x: 555, width: 60 },
  },
};

/* ---------- helpers ---------- */

/**
 * Carga la plantilla y valida que sea un PDF. Devuelve ArrayBuffer.
 * Lanza errores con mensajes útiles si algo sale mal.
 */
async function fetchTemplateBytes(templateUrl: string): Promise<ArrayBuffer> {
  const resp = await fetch(templateUrl);

  if (!resp.ok) {
    const txt = await resp.text().catch(() => "");
    throw new Error(
      `Error al cargar plantilla PDF (${resp.status} ${resp.statusText}) desde "${templateUrl}".\nRespuesta (slice):\n${txt.slice(0, 1000)}`,
    );
  }

  const ct = resp.headers.get("content-type") ?? "";
  if (!ct.includes("pdf") && !ct.includes("application/octet-stream")) {
    const sample = await resp.text().catch(() => "");
    throw new Error(
      `El recurso cargado no parece un PDF (content-type: "${ct}"). URL: "${templateUrl}".\nPrimeros bytes/texto:\n${sample.slice(0, 800)}`,
    );
  }

  const ab = await resp.arrayBuffer();

  // Validar header PDF "%PDF-"
  const headerSlice = new Uint8Array(ab.slice(0, 5));
  const header = String.fromCharCode(...Array.from(headerSlice));
  if (header !== "%PDF-") {
    const maybeText = new TextDecoder().decode(
      new Uint8Array(ab).slice(0, 300),
    );
    throw new Error(
      `El archivo obtenido no contiene cabecera PDF. Primeros 5 bytes: "${header}". Fragmento:\n${maybeText.slice(0, 600)}`,
    );
  }

  return ab;
}

/**
 * Convierte coordenada 'top' (pixels desde arriba) a la coordenada y usada por pdf-lib (desde abajo).
 */
function topToPdfY(page: { getHeight: () => number }, top: number) {
  const pageHeight = page.getHeight();
  return pageHeight - top;
}

/**
 * Envía texto dividido en líneas para que encaje en maxWidth.
 * - font: PDFFont
 * - size: font size
 * - maxWidth: ancho máximo en pts
 * - lineHeight: espaciado entre líneas (en pts). Si no se pasa usamos size * 1.15
 * - align: 'left'|'center'|'right'
 *
 * Dibuja desde la coordenada (x, top) hacia abajo (top-based).
 */
function wrapTextLines(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number,
): string[] {
  if (!text) return [""];
  // separar por saltos de linea explícitos primero
  const paragraphs = text.split(/\r?\n/);
  const lines: string[] = [];
  for (const p of paragraphs) {
    const words = p.split(/\s+/);
    let current = "";
    for (const w of words) {
      const test = current ? current + " " + w : w;
      const width = font.widthOfTextAtSize(test, size);
      if (width <= maxWidth) {
        current = test;
      } else {
        if (current) lines.push(current);
        // if single word longer than maxWidth, split the word
        if (font.widthOfTextAtSize(w, size) > maxWidth) {
          // break word by characters
          let chunk = "";
          for (const ch of w) {
            const tst = chunk + ch;
            if (font.widthOfTextAtSize(tst, size) <= maxWidth) {
              chunk = tst;
            } else {
              if (chunk) lines.push(chunk);
              chunk = ch;
            }
          }
          if (chunk) current = chunk;
          else current = "";
        } else {
          current = w;
        }
      }
    }
    if (current) {
      lines.push(current);
      current = "";
    }
    // mantener párrafo como salto de línea extra (opcional)
  }
  return lines.length ? lines : [""];
}

/**
 * Dibuja texto envuelto (wrap) en la página usando top-based Y.
 */
function drawWrappedText(
  page: any,
  font: PDFFont,
  text: string,
  x: number,
  top: number,
  options: {
    size?: number;
    maxWidth?: number;
    lineHeight?: number;
    align?: "left" | "center" | "right";
  } = {},
) {
  const size = options.size ?? 10;
  const maxWidth = options.maxWidth ?? 200;
  const lineHeight = options.lineHeight ?? Math.round(size * 1.15);
  const align = options.align ?? "left";

  const lines = wrapTextLines(String(text ?? ""), font, size, maxWidth);

  // convert top to pdf y (bottom-left)
  const startY = topToPdfY(page, top);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // y position for this line (va hacia abajo)
    const y = startY - i * lineHeight;

    // compute xOffset for alignment
    let drawX = x;
    if (align !== "left") {
      const lineWidth = font.widthOfTextAtSize(line, size);
      if (align === "center") {
        drawX = x + (maxWidth - lineWidth) / 2;
      } else if (align === "right") {
        drawX = x + (maxWidth - lineWidth);
      }
    }

    page.drawText(line, {
      x: drawX,
      y,
      size,
      font,
      color: rgb(0, 0, 0),
      maxWidth,
    });
  }
}

/**
 * (Opcional) Genera un PDF de calibración: dibuja una rejilla numerada sobre la plantilla
 * para que abras el PDF y visualices coordenadas. Útil para ajustar posiciones.
 *
 * Uso: llama a generateCalibrationPdf('/templates/hoja_ruta_template.pdf') y abre el PDF.
 */
export async function generateCalibrationPdf(templatePath?: string) {
  const template = templatePath ?? "/templates/hoja_ruta_template.pdf";
  const buf = await fetchTemplateBytes(template);
  const pdfDoc = await PDFDocument.load(buf);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  const page = pages[0];
  const pageW = page.getWidth();
  const pageH = page.getHeight();

  // dibujar rejilla cada 50 pts
  for (let tx = 0; tx < pageW; tx += 50) {
    for (let ty = 0; ty < pageH; ty += 50) {
      const yPdf = pageH - ty;
      page.drawText(`(${tx},${ty})`, {
        x: tx + 2,
        y: yPdf - 10,
        size: 6,
        font: helvetica,
        color: rgb(0.6, 0.2, 0.2),
      });
      // pequeño punto
      (page as any).drawCircle({
        x: tx + 2,
        y: yPdf - 2,
        size: 1.2,
        color: rgb(0.6, 0.2, 0.2),
      } as any);
    }
  }

  const bytes = await pdfDoc.save();
  const u8 = new Uint8Array(bytes);
  const blob = new Blob([u8], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
}

/* ---------- main export ---------- */

export async function generateHojaRutaTerrestrePdfFromForm(
  opts: GenerateOpts = {},
) {
  const {
    filename = `hoja_ruta_${Date.now()}.pdf`,
    overlayData = {},
    openPreview = false,
    templatePath = "/templates/hoja_ruta_template.pdf",
  } = opts;

  // 1) cargar plantilla PDF (robusto)
  const templateArrayBuffer = await fetchTemplateBytes(templatePath);

  // 2) create PDF doc
  const pdfDoc = await PDFDocument.load(templateArrayBuffer);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();

  // 3) pintar overlayData según POSITION_MAP (soportamos 'top' y 'y')
  for (const key of Object.keys(overlayData)) {
    const value = overlayData[key];
    if (value === null || value === undefined) continue;
    const pos = POSITION_MAP[key];
    if (!pos) continue;

    const pageIndex = pos.pageIndex ?? 0;
    const page = pages[pageIndex];

    // preferimos 'top' si está disponible; si el mapa está usando 'y' (bottom) lo soportamos también
    const topCoord =
      pos.top !== undefined
        ? pos.top
        : pos.y !== undefined
          ? page.getHeight() - pos.y
          : undefined;

    const x = pos.x;
    const size = pos.size ?? 10;
    const maxWidth = pos.maxWidth ?? 180;
    const align = (pos.align as "left" | "center" | "right") ?? "left";

    if (topCoord !== undefined) {
      // usar drawWrappedText para que ajuste multilinea
      drawWrappedText(page, helvetica, String(value), x, topCoord, {
        size,
        maxWidth,
        align,
      });
    } else {
      // caemos a drawText usando bottom-left y
      page.drawText(String(value), {
        x,
        y: pos.y ?? 0,
        size,
        font: helvetica,
        color: rgb(0, 0, 0),
        maxWidth,
      } as any);
    }
  }

  // 4) servicios_array handling (aceptamos array o JSON string o claves numeradas)
  let serviciosArray: any[] = [];
  if (Array.isArray((overlayData as any).servicios_array)) {
    serviciosArray = (overlayData as any).servicios_array;
  } else if (typeof (overlayData as any).servicios_array === "string") {
    try {
      serviciosArray = JSON.parse((overlayData as any).servicios_array);
    } catch {
      serviciosArray = [];
    }
  } else {
    const rows: Record<number, any> = {};
    for (const k of Object.keys(overlayData)) {
      const m = k.match(
        /^(fecha|origen|destino|rutaAutorizada|horaSalida|horaLlegada)_(\d+)$/,
      );
      if (m) {
        const field = m[1];
        const idx = parseInt(m[2], 10) - 1;
        rows[idx] = rows[idx] || {};
        rows[idx][field] = overlayData[k];
      }
    }
    serviciosArray = Object.keys(rows)
      .sort((a, b) => Number(a) - Number(b))
      .map((i) => rows[Number(i)]);
  }

  // 5) dibujar filas de la tabla usando topStartY y stepTop (top-based)
  const maxRows = Math.min(20, serviciosArray.length);
  const page = pages[SERVICIOS_TABLE.pageIndex];
  for (let i = 0; i < maxRows; i++) {
    const row = serviciosArray[i] || {};
    const top = SERVICIOS_TABLE.topStartY + i * SERVICIOS_TABLE.stepTop;
    drawWrappedText(
      page,
      helvetica,
      String(row.fecha ?? ""),
      SERVICIOS_TABLE.cols.fecha.x,
      top,
      {
        size: 9,
        maxWidth: SERVICIOS_TABLE.cols.fecha.width,
        lineHeight: 12,
        align: "left",
      },
    );
    drawWrappedText(
      page,
      helvetica,
      String(row.origen ?? ""),
      SERVICIOS_TABLE.cols.origen.x,
      top,
      {
        size: 9,
        maxWidth: SERVICIOS_TABLE.cols.origen.width,
        lineHeight: 12,
        align: "left",
      },
    );
    drawWrappedText(
      page,
      helvetica,
      String(row.destino ?? ""),
      SERVICIOS_TABLE.cols.destino.x,
      top,
      {
        size: 9,
        maxWidth: SERVICIOS_TABLE.cols.destino.width,
        lineHeight: 12,
        align: "left",
      },
    );
    drawWrappedText(
      page,
      helvetica,
      String(row.rutaAutorizada ?? ""),
      SERVICIOS_TABLE.cols.rutaAutorizada.x,
      top,
      {
        size: 9,
        maxWidth: SERVICIOS_TABLE.cols.rutaAutorizada.width,
        lineHeight: 12,
        align: "left",
      },
    );
    drawWrappedText(
      page,
      helvetica,
      String(row.horaSalida ?? ""),
      SERVICIOS_TABLE.cols.horaSalida.x,
      top,
      {
        size: 9,
        maxWidth: SERVICIOS_TABLE.cols.horaSalida.width,
        lineHeight: 12,
        align: "center",
      },
    );
    drawWrappedText(
      page,
      helvetica,
      String(row.horaLlegada ?? ""),
      SERVICIOS_TABLE.cols.horaLlegada.x,
      top,
      {
        size: 9,
        maxWidth: SERVICIOS_TABLE.cols.horaLlegada.width,
        lineHeight: 12,
        align: "center",
      },
    );
  }

  // 6) serializar y descargar/abrir (creamos Uint8Array copia para evitar issues SharedArrayBuffer)
  const pdfBytes = await pdfDoc.save();
  const uint8 = new Uint8Array(pdfBytes);
  const blob = new Blob([uint8], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  if (openPreview) {
    window.open(url, "_blank");
  } else {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  setTimeout(() => URL.revokeObjectURL(url), 30000);

  return { filename };
}
