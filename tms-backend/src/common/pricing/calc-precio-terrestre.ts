/**
 * Cálculo de precio estimado terrestre a partir de la tarifa del prestatario
 * (perfil: precioTerrestre JSON y/o campos planos expuestos por el servicio).
 *
 * Fórmula: (distanciaKm × precioPorKm) + componente por tipo de carga
 * - "Carga general" (case-insensitive) → precio carga general
 * - resto (Seco, Refrigerado, etc.) → precio por contenedor / carga contenedorizada
 */
export type PrecioTerrestreInput = {
  peso: number;
  volumen?: number | null;
  tipoCarga: string;
  distanciaKm?: number | null;
};

export function extractPrecioTerrestreFromPrestatario(p: Record<string, any>) {
  if (!p) {
    return {
      porKm: 0,
      porContenedor: 0,
      porCargaGeneral: 0,
    };
  }
  const pt = p.precioTerrestre ?? p.precio_terrestre;
  const porCarga =
    pt?.precioPorCarga && typeof pt.precioPorCarga === 'object'
      ? pt.precioPorCarga
      : {};

  const porKm = Number(
    p.precioTerrestrePorKm ??
      p.precio_terrestre_por_km ??
      pt?.precioPorKm ??
      0,
  );
  const porContenedor = Number(
    p.precioTerrestrePorCargaContenedor ??
      p.precio_terrestre_por_carga_contenedor ??
      porCarga.contenedor ??
      0,
  );
  const porCargaGeneral = Number(
    p.precioTerrestrePorCargaGeneral ??
      p.precio_terrestre_por_carga_general ??
      porCarga.carga_general ??
      0,
  );

  return {
    porKm: Number.isFinite(porKm) ? porKm : 0,
    porContenedor: Number.isFinite(porContenedor) ? porContenedor : 0,
    porCargaGeneral: Number.isFinite(porCargaGeneral) ? porCargaGeneral : 0,
  };
}

export function calcularPrecioTerrestreEstimado(
  prestatario: Record<string, any>,
  input: PrecioTerrestreInput,
): number {
  const { porKm, porContenedor, porCargaGeneral } =
    extractPrecioTerrestreFromPrestatario(prestatario);

  const km = Number(input.distanciaKm ?? NaN);
  const tramoKm =
    Number.isFinite(km) && km > 0 ? km * porKm : 0;

  const tipo = String(input.tipoCarga || '').trim().toLowerCase();
  const esCargaGeneral =
    tipo === 'carga general' || tipo.includes('carga general');

  const tramoCarga = esCargaGeneral ? porCargaGeneral : porContenedor;

  const total = tramoKm + tramoCarga;
  return Math.round((Number.isFinite(total) ? total : 0) * 100) / 100;
}
