// src/services/prestatarioService.ts
import api from "@/services/api";

/**
 * Request al backend que filtra por servicio (backend: GET /prestatario/service/:key)
 * Retorna { data: Prestatario[], total?: number }.
 */
export async function fetchPrestatariosByServiceFromServer(
  serviceKey: "alojamiento" | "gps" | "talleres",
  opts?: { limit?: number; page?: number; q?: string },
) {
  try {
    const params: any = {
      limit: opts?.limit ?? 20,
      page: opts?.page ?? 1,
    };
    if (opts?.q) params.q = opts.q;

    const res = await api.get(`/prestatario/service/${serviceKey}`, {
      params,
    });

    const payload = res?.data ?? [];
    // Soportar dos posibles respuestas del backend:
    // 1) Lista simple: [ {..}, {...} ]
    // 2) Objeto con paginación: { data: [...], meta: { total: 123 } }
    if (Array.isArray(payload)) {
      return { data: payload, total: payload.length };
    }
    if (payload && Array.isArray(payload.data)) {
      const total =
        (payload.meta && (payload.meta.total ?? payload.meta.count)) ??
        payload.total ??
        payload.meta?.total ??
        payload.data.length;
      return {
        data: payload.data,
        total: Number(total ?? payload.data.length),
      };
    }
    // fallback
    return { data: [], total: 0 };
  } catch (err) {
    console.error("fetchPrestatariosByServiceFromServer error:", err);
    throw err;
  }
}
