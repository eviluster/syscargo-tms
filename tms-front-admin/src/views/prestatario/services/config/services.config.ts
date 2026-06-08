// src/views/prestatario/services/config/services.config.ts
export type ServiceKey = "alquiler" | "gps" | "taller" | "alojamiento";

export interface ServiceField {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "date" | "textarea" | "boolean";
  required?: boolean;
  options?: string[];
  placeholder?: string;
  multiple?: boolean;
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
          "Mantenimiento",
          "Diagnóstico",
          "Soldadura",
          "Electricidad",
          "Neumáticos",
        ],
        multiple: true,
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
};
