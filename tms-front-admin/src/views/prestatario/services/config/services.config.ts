// src/views/prestatario/services/config/services.config.ts
export type ServiceKey = "alquiler" | "gps" | "taller" | "alojamiento" | "seguro" | "servicupet";

export interface ServiceField {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "date" | "textarea" | "boolean";
  required?: boolean;
  options?: string[] | Array<{ value: string; price?: number }>;
  placeholder?: string;
  multiple?: boolean;
  helpText?: string;
}

export interface ServiceConfig {
  key: ServiceKey;
  title: string;
  listColumns: Array<{
    columnLabel: string; // texto a mostrar en el header
    columnName: string; // nombre del campo en la entidad / objeto
    width?: number;
  }>;
  formFields: ServiceField[];
  // nombre lógico del servicio tal como espera el backend en la query (opcional;
  // si no se provee, se puede usar el serviceKey)
  serviceType?: string;
  endpoints: {
    listSolicitudes: string;
    createSolicitud: string;
    listProposals: string;
    createProposal?: string;
    // <-- nuevo (opcional): endpoint para buscar prestatarios (match) específico por servicio
    matchPrestatarios?: string;
  };
}

export const SERVICES: Record<ServiceKey, ServiceConfig> = {
  alquiler: {
    key: "alquiler",
    title: "Servicio Alquiler",
    serviceType: "alquiler",
    listColumns: [
      { columnLabel: "Solicitante", columnName: "solicitante" },
      { columnLabel: "Metros (m²)", columnName: "metros_requeridos" },
      { columnLabel: "Altura (m)", columnName: "altura_m" },
      { columnLabel: "Fecha inicio", columnName: "fecha_inicio" },
      { columnLabel: "Estado", columnName: "status" },
    ],
    formFields: [
      {
        name: "metros_requeridos",
        label: "Metros requeridos (m²)",
        type: "number",
        required: true,
        placeholder: "Ej: 25",
      },
      {
        name: "altura_m",
        label: "Altura (m)",
        type: "number",
        placeholder: "Ej: 3.5",
      },
      {
        name: "fecha_inicio",
        label: "Fecha inicio",
        type: "date",
        required: true,
      },
      { name: "duracion", label: "Duración", type: "text" },
      { name: "comentarios", label: "Comentarios", type: "textarea" },
    ],
    endpoints: {
      listSolicitudes: "/solicitudes",
      createSolicitud: "/solicitudes",
      // <-- actualizado para usar el endpoint de proposals_services del backend
      listProposals: "/proposals_services",
      createProposal: "/solicitudes/:id/proposals_services",
      matchPrestatarios: "/prestatario/match-space",
    },
  },

  gps: {
    key: "gps",
    title: "Servicio GPS",
    serviceType: "gps",
    listColumns: [
      { columnLabel: "Solicitante", columnName: "solicitante" },
      { columnLabel: "Número de dispositivos", columnName: "device_count" },
      { columnLabel: "Plan", columnName: "plan" },
      { columnLabel: "Estado", columnName: "status" },
    ],
    formFields: [
      {
        name: "device_count",
        label: "Número de dispositivos",
        type: "number",
        required: true,
        placeholder: "Ej: 5",
      },
      {
        name: "plan",
        label: "Plan GPS",
        type: "select",
        options: ["Básico", "Pro", "Enterprise"],
        required: true,
      },
      { name: "comentarios", label: "Comentarios", type: "textarea" },
    ],
    endpoints: {
      listSolicitudes: "/solicitudes",
      createSolicitud: "/solicitudes",
      listProposals: "/proposals_services",
      createProposal: "/solicitudes/:id/proposals_services",
      matchPrestatarios: "/prestatario/match-gps",
    },
  },

  taller: {
    key: "taller",
    title: "Servicio Taller",
    serviceType: "taller",
    listColumns: [
      { columnLabel: "Solicitante", columnName: "solicitante" },
      { columnLabel: "Tipo trabajo", columnName: "tipo_uso" },
      { columnLabel: "Precio", columnName: "precio_total" },
      { columnLabel: "Marca", columnName: "vehiculo_marca" },
      { columnLabel: "Placa", columnName: "vehiculo_placa" },
      { columnLabel: "Estado", columnName: "status" },
    ],
    formFields: [
      {
        name: "tipo_uso",
        label: "Tipo de trabajo",
        type: "select",
        required: true,
        options: [
          { value: "Mantenimiento", price: 0 },
          { value: "Diagnóstico", price: 0 },
          { value: "Soldadura", price: 0 },
          { value: "Electricidad", price: 0 },
          { value: "Neumáticos", price: 0 },
        ],
        multiple: true,
        helpText: "Seleccione el tipo de atención que requiere el cliente. El precio se define en la configuración del prestatario.",
      },
      {
        name: "es_servicio_escatolina",
        label: "Servicio Escatolina",
        type: "boolean",
        required: false,
        helpText: "Active este botón si el servicio incluye transporte de escatolina. Al activarse, se mostrarán los datos de transporte requeridos.",
      },
      {
        name: "fecha_hora_inicio",
        label: "Fecha y hora de la cita",
        type: "date",
        required: true,
        helpText: "Seleccione la fecha y hora para la reserva de la cita en el taller.",
      },
      {
        name: "direccion_taller_fija",
        label: "Dirección del taller",
        type: "text",
        required: false,
        placeholder: "Dirección fija del taller (solo lectura)",
        helpText: "Esta es la dirección registrada del taller. No editable desde esta vista.",
      },
      // Campos condicionales para Escatolina (se muestran solo si es_servicio_escatolina = true)
      {
        name: "origen_id",
        label: "Origen",
        type: "text",
        required: false,
        placeholder: "Dirección de origen",
        helpText: "Dirección donde se recogerá la carga",
      },
      {
        name: "destino_id",
        label: "Destino",
        type: "text",
        required: false,
        placeholder: "Dirección de destino",
        helpText: "Dirección donde se entregará la carga",
      },
      {
        name: "tipo_carga_id",
        label: "Tipo de carga",
        type: "select",
        required: false,
        options: ["Seco", "Refrigerado", "Carga general", "Peligrosa"],
        helpText: "Tipo de carga a transportar",
      },
      {
        name: "peso_kg",
        label: "Peso (kg)",
        type: "number",
        required: false,
        placeholder: "Ej: 5000",
        helpText: "Peso total de la carga en kilogramos",
      },
      {
        name: "volumen_m3",
        label: "Volumen (m³)",
        type: "number",
        required: false,
        placeholder: "Ej: 20",
        helpText: "Volumen total de la carga en metros cúbicos",
      },
      {
        name: "tipo_transporte_id",
        label: "Tipo de transporte",
        type: "select",
        required: false,
        options: ["Camión", "Tráiler", "Furgón", "Plataforma"],
        helpText: "Tipo de vehículo requerido para el transporte",
      },
      {
        name: "fecha_estimada_viaje",
        label: "Fecha estimada del viaje",
        type: "date",
        required: false,
        helpText: "Fecha estimada para realizar el viaje de transporte",
      },
      {
        name: "licencia_operativa",
        label: "Licencia operativa",
        type: "text",
        required: false,
        placeholder: "Número de licencia",
        helpText: "Licencia operativa del transportista",
      },
      { name: "vehiculo_marca", label: "Marca vehículo", type: "text" },
      { name: "vehiculo_placa", label: "Placa", type: "text" },
      { name: "comentarios", label: "Comentarios", type: "textarea" },
    ],
    endpoints: {
      listSolicitudes: "/solicitudes",
      createSolicitud: "/solicitudes",
      listProposals: "/proposals_services",
      createProposal: "/solicitudes/:id/proposals_services",
      matchPrestatarios: "/prestatario/match-taller",
    },
  },

  alojamiento: {
    key: "alojamiento",
    title: "Servicio Alojamiento",
    serviceType: "alojamiento",
    listColumns: [
      { columnLabel: "Solicitante", columnName: "solicitante" },
      { columnLabel: "Habitaciones", columnName: "habitaciones_requeridas" },
      { columnLabel: "Personas", columnName: "personas" },
      { columnLabel: "Fecha inicio", columnName: "fecha_inicio" },
      { columnLabel: "Fecha fin", columnName: "fecha_fin" },
      { columnLabel: "Estado", columnName: "status" },
    ],
    formFields: [
      {
        name: "habitaciones_requeridas",
        label: "Habitaciones requeridas",
        type: "number",
        required: true,
      },
      { name: "personas", label: "Personas", type: "number" },
      { name: "fecha_inicio", label: "Fecha inicio", type: "date" },
      { name: "fecha_fin", label: "Fecha fin", type: "date" },
      { name: "comentarios", label: "Comentarios", type: "textarea" },
    ],
    endpoints: {
      listSolicitudes: "/solicitudes",
      createSolicitud: "/solicitudes",
      listProposals: "/proposals_services",
      createProposal: "/solicitudes/:id/proposals_services",
      matchPrestatarios: "/prestatario/match-alojamiento",
    },
  },
  seguro: {
    key: "seguro",
    title: "Servicio Seguro",
    serviceType: "seguro",
    listColumns: [
      { columnLabel: "Solicitante", columnName: "solicitante" },
      { columnLabel: "Tipo de seguro", columnName: "tipo_seguro" },
      { columnLabel: "Monto asegurado", columnName: "monto_asegurado" },
      { columnLabel: "Estado", columnName: "status" },
    ],
    formFields: [
      {
        name: "tipo_seguro",
        label: "Tipo de seguro",
        type: "select",
        options: ["Carga", "Viaje", "Mercancía"],
        required: true,
      },
      {
        name: "monto_asegurado",
        label: "Monto asegurado",
        type: "number",
        required: true,
        placeholder: "Ej: 10000",
      },
      { name: "fecha_inicio", label: "Fecha inicio", type: "date" },
      { name: "comentarios", label: "Comentarios", type: "textarea" },
    ],
    endpoints: {
      listSolicitudes: "/solicitudes",
      createSolicitud: "/solicitudes",
      listProposals: "/proposals_services",
      createProposal: "/solicitudes/:id/proposals_services",
      matchPrestatarios: "/prestatario/match-seguro",
    },
  },

  servicupet: {
    key: "servicupet",
    title: "Servicio ServiCUPET",
    serviceType: "servicupet",
    listColumns: [
      { columnLabel: "Solicitante", columnName: "solicitante" },
      { columnLabel: "Tipo de servicio", columnName: "tipo_servicio" },
      { columnLabel: "Estado", columnName: "status" },
    ],
    formFields: [
      {
        name: "tipo_servicio",
        label: "Tipo de servicio",
        type: "select",
        options: ["Inspección", "Certificación", "Asesoría"],
        required: true,
      },
      { name: "comentarios", label: "Comentarios", type: "textarea" },
    ],
    endpoints: {
      listSolicitudes: "/solicitudes",
      createSolicitud: "/solicitudes",
      listProposals: "/proposals_services",
      createProposal: "/solicitudes/:id/proposals_services",
      matchPrestatarios: "/prestatario/match-servicupet",
    },
  },
};
