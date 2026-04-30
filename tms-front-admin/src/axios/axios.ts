import axios from "axios";
import api from "@/services/api";

// Función para validar y normalizar la respuesta
const handleResponse = (response: any, isArrayExpected = false) => {
  if (!response.data) {
    console.error("La respuesta no contiene datos:", response);
    throw new Error("La respuesta de la API no contiene datos");
  }

  if (isArrayExpected && !Array.isArray(response.data)) {
    console.warn("Se esperaba un array pero se recibió:", response.data);
    return [response.data];
  }
  return response.data;
};

// API para gestionar órdenes de carga
const CargaApi = {
  async getAllOrdenes(params?: any) {
    try {
      const response = await api.get("/carga/all-active", {
        withCredentials: false,
      });
      const dataArray = handleResponse(response.data, true);

      console.log("Datos crudos de API:", response.data.data);
      console.log("Datos después de handleResponse:", dataArray);
      console.log(
        "Datos mapeados:",
        dataArray.map((data: any) => data.id),
      );
      return dataArray.map((data: any) => ({
        id: data.id ?? "",
        order_id: data.order_id ?? "",
        carga_serie: data.carga_serie ?? "",
        remitente_dni: data.remitente_dni ?? "",
        remitente_nombre: data.remitente_nombre ?? "",
        direccion: data.direccion ?? "",
        emisor_dni: data.emisor_dni ?? "",
        emisor_nombre: data.emisor_nombre ?? "",
        emisor_direccion: data.emisor_direccion ?? "",
        estado: data.estado ?? "",
        cant_bultos: data.cant_bultos ?? 0,
        vol_bulto: data.vol_bulto ?? 0,
        peso_total: data.peso_total ?? 0,
        precio: data.precio ?? 0,
        tipo_carga: data.tipo_carga ?? "Misceláneas",
        autorizado_recoger: data.autorizado_recoger ?? "",
        origen_string: data.origen_string ?? "",
        destino_string: data.destino_string ?? "",
        fechaRegistro: data.createdAt ?? "",
        tarifabase: data.tarifabase ?? 0,
        volumen: data.volumen ?? 0,
        impuesto: data.impuesto ?? 0,
        comision: data.comision ?? 0,
      }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error de Axios al obtener las órdenes:", {
          message: error.message,
          code: error.code,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: error.config,
        });
        throw new Error(
          `Error al obtener las órdenes: ${error.response?.status} - ${error.response?.statusText || error.message}`,
        );
      }
      console.error("Error desconocido al obtener las órdenes:", error);
      throw new Error("Error desconocido al obtener las órdenes");
    }
  },

  async createOrden(ordenData: any) {
    try {
      // Validación básica del objeto
      if (
        !ordenData ||
        typeof ordenData !== "object" ||
        Array.isArray(ordenData)
      ) {
        throw new Error("Los datos de la orden deben ser un objeto válido");
      }

      // Campos requeridos (según CreateCargaDto + via)
      const requiredFields = [
        "order_id",
        "origen_string",
        "destino_string",
        "remitente_dni",
        "remitente_nombre",
        "emisor_dni",
        "emisor_nombre",
        //  "emisor_direccion",
        "cant_bultos",
        "peso_total",
        "vol_bulto",
        "autorizado_recoger",
        "tipo_carga",
        // y los que son numéricos calculados
        "precio",
        "tarifabase",
        "volumen",
        "impuesto",
        "comision",
        // vía (el formulario la hace required)
        "via",
      ];

      const missingFields = requiredFields.filter(
        (field) => ordenData[field] === undefined || ordenData[field] === "",
      );
      if (missingFields.length > 0) {
        throw new Error(
          `Faltan los siguientes campos: ${missingFields.join(", ")}`,
        );
      }

      // --- Validar y normalizar "via" ---
      const allowedVias = [
        "aerea",
        "maritima",
        "terrestre",
        "ferroviaria",
        "multimodal",
      ];
      if (typeof ordenData.via !== "string") {
        throw new Error("El campo 'via' debe ser una cadena");
      }
      const viaNorm = ordenData.via.toString().trim().toLowerCase();
      if (!allowedVias.includes(viaNorm)) {
        throw new Error(
          `Valor inválido para 'via'. Valores permitidos: ${allowedVias.join(", ")}`,
        );
      }
      // Normalizar en el payload (mantener en lowercase por consistencia)
      ordenData.via = viaNorm;

      // Convertir/normalizar números (defensivo)
      const numericFields = [
        "cant_bultos",
        "peso_total",
        "vol_bulto",
        "precio",
        "tarifabase",
        "volumen",
        "impuesto",
        "comision",
      ];
      for (const f of numericFields) {
        const val = ordenData[f];
        // si viene como string, intentar parsear
        if (typeof val === "string") {
          const n = Number(val);
          if (Number.isNaN(n)) {
            throw new Error(`El campo ${f} debe ser numérico`);
          }
          ordenData[f] = n;
        } else if (typeof val !== "number") {
          throw new Error(`El campo ${f} debe ser numérico`);
        }
      }

      // clientId es opcional — si viene, opcionalmente validar formato UUID simple (no estricto)
      if (ordenData.clientId) {
        const uuidSimple = /^[0-9a-fA-F-]{2,}$/; // validación ligera; si quieres valida con regex UUID completo
        if (
          typeof ordenData.clientId !== "string" ||
          !uuidSimple.test(ordenData.clientId)
        ) {
          console.warn(
            "clientId presente pero con formato sospechoso:",
            ordenData.clientId,
          );
        }
      }

      // Configuración de la petición (se pasa a api.post)
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 20000,
      };

      console.log("Enviando orden:", JSON.stringify(ordenData, null, 2));

      // Envío de la petición (usar config)
      const response = await api.post("/carga", ordenData, config);

      if (!response || !response.data) {
        throw new Error("No se recibió respuesta válida del servidor");
      }

      console.log("Respuesta del servidor:", response.status, response.data);
      return response.data;
    } catch (error: any) {
      // Manejo específico de errores Axios
      if (error.isAxiosError || (error.config && error.request)) {
        // axios error
        const axiosErr = error;
        if (axiosErr.response) {
          const status = axiosErr.response.status;
          const serverMsg =
            axiosErr.response.data?.message || axiosErr.response.statusText;
          console.error("Error del servidor:", status, axiosErr.response.data);

          if (status === 401) {
            throw new Error("No autorizado. Inicia sesión de nuevo.");
          }
          if (status === 403) {
            throw new Error("Acceso denegado.");
          }
          throw new Error(serverMsg || `Error del servidor (${status})`);
        } else if (axiosErr.request) {
          console.error(
            "No se recibió respuesta del servidor (request):",
            axiosErr.request,
          );
          throw new Error("Sin respuesta del servidor. Verifica tu conexión.");
        }
      }

      // error de validación / otros
      console.error("Error en createOrden:", error?.message ?? error);
      throw new Error(error?.message || "Error al crear la orden");
    }
  },

  async createOrdenTerrestre(ordenData: any) {
    try {
      // Validación básica del objeto
      if (
        !ordenData ||
        typeof ordenData !== "object" ||
        Array.isArray(ordenData)
      ) {
        throw new Error("Los datos de la orden deben ser un objeto válido");
      }

      // Campos requeridos para formato terrestre (según lo que enviaste)
      const requiredFields = [
        "order_id",
        "fecha_emision",
        "remitente_dni",
        "remitente_nombre",
        "direccion",
        "cant_bultos",
        "peso_total",
        "vol_bulto",
        "autorizado_recoger",
        "tipo_carga",
        "origen_string",
        "destino_string",
        // campos calculados / numéricos requeridos
        "precio",
        "tarifabase",
        "volumen",
        "impuesto",
        "comision",
      ];

      const missingFields = requiredFields.filter(
        (field) => ordenData[field] === undefined || ordenData[field] === "",
      );
      if (missingFields.length > 0) {
        throw new Error(
          `Faltan los siguientes campos: ${missingFields.join(", ")}`,
        );
      }

      // --- Validar y normalizar "via" si viene ---
      const allowedVias = [
        "aerea",
        "maritima",
        "terrestre",
        "ferroviaria",
        "multimodal",
      ];
      if (
        ordenData.via !== undefined &&
        ordenData.via !== null &&
        ordenData.via !== ""
      ) {
        if (typeof ordenData.via !== "string") {
          throw new Error(
            "El campo 'via' debe ser una cadena si se proporciona",
          );
        }
        const viaNorm = ordenData.via.toString().trim().toLowerCase();
        if (!allowedVias.includes(viaNorm)) {
          throw new Error(
            `Valor inválido para 'via'. Valores permitidos: ${allowedVias.join(", ")}`,
          );
        }
        ordenData.via = viaNorm;
      }

      // Convertir/normalizar números (defensivo)
      const numericFields = [
        "cant_bultos",
        "peso_total",
        "vol_bulto",
        "precio",
        "tarifabase",
        "volumen",
        "impuesto",
        "comision",
      ];
      for (const f of numericFields) {
        const val = ordenData[f];
        // permitir que vengan como número ya parseado
        if (typeof val === "string") {
          const n = Number(val);
          if (Number.isNaN(n)) {
            throw new Error(`El campo ${f} debe ser numérico`);
          }
          ordenData[f] = n;
        } else if (typeof val !== "number") {
          throw new Error(`El campo ${f} debe ser numérico`);
        }
      }

      // Validación ligera de clientId (opcional)
      if (ordenData.clientId) {
        const uuidSimple = /^[0-9a-fA-F-]{2,}$/;
        if (
          typeof ordenData.clientId !== "string" ||
          !uuidSimple.test(ordenData.clientId)
        ) {
          console.warn(
            "clientId presente pero con formato sospechoso:",
            ordenData.clientId,
          );
        }
      }

      // Normalizar campos opcionales de texto (trim)
      const optionalTextFields = [
        "no_orden",
        "comprador_interno",
        "autorizado_lugar",
        "representante_nombre",
        "representante_carnet",
        "representante_cargo",
        "firma",
        "tipo_producto",
        "contenedor_siglas",
        "origen_direccion",
        "destino_direccion",
        "transportista_id",
        "transportista_nombre",
        "nombre_destinatario",
        "nombre_buque",
        "mfto_no",
        "bl_no",
        "dm_no",
        "vehiculo_pertenece_a",
        "conducido_por",
        "chapa_no",
        "lot_no",
        "hoja_ruta_no",
        "carta_porte_no",
        "chapa_tractivo_no",
        "remolque_no",
        "conductor_carnet_no",
        "licencia_conduccion_no",
        "basificado_en",
      ];
      for (const key of optionalTextFields) {
        if (
          ordenData[key] !== undefined &&
          ordenData[key] !== null &&
          typeof ordenData[key] === "string"
        ) {
          ordenData[key] = ordenData[key].trim();
        }
      }

      // Configuración de la petición (igual que createOrden)
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 20000,
      };

      console.log(
        "Enviando orden terrestre:",
        JSON.stringify(ordenData, null, 2),
      );

      // Envío: endpoint para terrestres (ajusta si tu backend usa otro)
      const response = await api.post("/carga", ordenData, config);

      if (!response || !response.data) {
        throw new Error("No se recibió respuesta válida del servidor");
      }

      console.log(
        "Respuesta del servidor (terrestre):",
        response.status,
        response.data,
      );
      return response.data;
    } catch (error: any) {
      // Manejo específico de errores Axios (copiado de createOrden)
      if (error.isAxiosError || (error.config && error.request)) {
        const axiosErr = error;
        if (axiosErr.response) {
          const status = axiosErr.response.status;
          const serverMsg =
            axiosErr.response.data?.message || axiosErr.response.statusText;
          console.error(
            "Error del servidor (terrestre):",
            status,
            axiosErr.response.data,
          );

          if (status === 401) {
            throw new Error("No autorizado. Inicia sesión de nuevo.");
          }
          if (status === 403) {
            throw new Error("Acceso denegado.");
          }
          throw new Error(serverMsg || `Error del servidor (${status})`);
        } else if (axiosErr.request) {
          console.error(
            "No se recibió respuesta del servidor (request) - terrestre:",
            axiosErr.request,
          );
          throw new Error("Sin respuesta del servidor. Verifica tu conexión.");
        }
      }

      // otros errores de validación / lógicos
      console.error("Error en createOrdenTerrestre:", error?.message ?? error);
      throw new Error(error?.message || "Error al crear la orden terrestre");
    }
  },

  async updateOrden(updateData: any) {
    try {
      // Verifica que los datos tengan ID
      if (!updateData.id) {
        throw new Error("Se requiere ID para actualizar");
      }

      const response = await api.patch("/carga", updateData, {
        headers: {
          "Content-Type": "application/merge-pacth+json", // Especial para PATCH
        },
      });
      console.log("Datos enviados:", JSON.stringify(updateData, null, 2));
      console.log("Respuesta del servidor:", response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Detalles del error 400:", {
          request: {
            url: error.config?.url,
            data: error.config?.data,
          },
          response: {
            status: error.response?.status,
            data: error.response?.data,
          },
        });

        // Mensaje personalizado para errores 400
        if (error.response?.status === 400) {
          const serverMessage =
            error.response.data?.message || "Datos inválidos";
          throw new Error(`Error de validación: ${serverMessage}`);
        }
      }
      throw error;
    }
  },

  async deleteOrden(id: string) {
    try {
      // 1. Validación exhaustiva del ID
      if (!id || typeof id !== "string" || !/^[A-Za-z0-9-]+$/.test(id)) {
        throw new Error(
          `ID de orden inválido: ${id}. Debe ser un string alfanumérico`,
        );
      }

      // 2. Configuración optimizada de la petición
      const config = {
        withCredentials: false,
        headers: {
          "Content-Type": "application/json",
          // "X-Request-ID": `del-${id}`,
          // "X-Request-Confirm": "true",
          // "X-Order-Type": "alfanumerico",
        },
        timeout: 15000, // 15 segundos timeout
        validateStatus: (status: number) => status === 200 || status === 204, // Solo éxito
      };

      console.log(`[API] Enviando DELETE para orden ID: ${id}`);

      // 3. Usar DELETE correctamente con el ID en la URL
      const response = await api.put("/carga/active", config);

      // 4. Manejo de respuestas sin contenido (204 No Content)
      if (response.status === 204) {
        console.log("[API] Orden eliminada exitosamente (204 No Content)");
        return {
          success: true,
          id,
          serverData: null,
          timestamp: new Date().toISOString(),
        };
      }

      // 5. Validar estructura de la respuesta (para códigos 200)
      if (!response.data) {
        console.error("[API] Respuesta vacía del servidor:", response);
        throw new Error("El servidor no devolvió datos de confirmación");
      }

      console.log("[API] Orden eliminada exitosamente:", {
        id,
        response: response.data,
      });

      return {
        success: true,
        id,
        serverData: response.data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      // 6. Manejo detallado de errores
      if (axios.isAxiosError(error)) {
        const errorDetails = {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          request: {
            method: error.config?.method,
            url: error.config?.url,
            data: error.config?.data,
          },
        };

        console.error("[API] Error en deleteOrden:", errorDetails);

        // Mensajes de error específicos según el código de estado
        let errorMessage = "Error al eliminar la orden";
        if (error.response) {
          if (error.response.status === 404) {
            errorMessage = `La orden con ID ${id} no fue encontrada`;
          } else if (error.response.status === 403) {
            errorMessage = "No tiene permisos para eliminar esta orden";
          } else if (error.response.status === 409) {
            errorMessage =
              "La orden no puede ser eliminada en su estado actual";
          } else if (error.response.status === 500) {
            errorMessage =
              "Error interno del servidor al procesar la eliminación";
          }

          // Agregar detalles del servidor si están disponibles
          if (error.response.data?.message) {
            errorMessage += `: ${error.response.data.message}`;
          }
        } else if (error.code === "ECONNABORTED") {
          errorMessage = "Timeout: La solicitud tardó demasiado en completarse";
        } else {
          errorMessage = "Error de conexión al intentar eliminar la orden";
        }

        throw new Error(errorMessage);
      }

      console.error("[API] Error no relacionado con Axios:", error);
      throw error instanceof Error
        ? error
        : new Error("Error desconocido al eliminar la orden");
    }
  },

  async getAllDestinos() {
    try {
      const response = await api.get("/destino/all", {
        withCredentials: false,
      });

      console.log("Destinos", response);

      const dataArray = handleResponse(response, true); // Maneja la respuesta de acuerdo con tu implementación

      return dataArray;
      // return dataArray.map((destino: any, index: number) => ({
      //   id: destino.id || index + 1,
      //   nombre: destino.nombre || `Destino ${index + 1}`, // Mapea el campo 'nombre'
      //   descripcion:
      //     destino.descripcion || `Descripción de Destino ${index + 1}`, // Mapea el campo 'descripcion'
      // }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error de Axios al obtener los destinos:", {
          message: error.message,
          code: error.code,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: error.config,
        });
        throw new Error(
          `Error al obtener los destinos: ${error.response?.status} - ${error.response?.statusText || error.message}`,
        );
      }
      console.error("Error desconocido al obtener los destinos:", error);
      throw new Error("Error desconocido al obtener los destinos");
    }
  },
  async getAllOrigens() {
    try {
      const response = await api.get("/origen/all", {
        withCredentials: false,
      });

      console.log("Origenes:", response.data);

      const dataArray = handleResponse(response, true); // Maneja la respuesta de acuerdo con tu implementación
      console.log(dataArray);
      return dataArray;
      // return dataArray.map((origen: any, index: number) => ({
      //   id: origen.id,
      //   nombre: origen.nombre,
      //   descripcion: origen.descripcion,
      // }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error de Axios al obtener los orígenes:", {
          message: error.message,
          code: error.code,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: error.config,
        });
        throw new Error(
          `Error al obtener los orígenes: ${error.response?.status} - ${error.response?.statusText || error.message}`,
        );
      }
      console.error("Error desconocido al obtener los orígenes:", error);
      throw new Error("Error desconocido al obtener los orígenes");
    }
  },
};

export default CargaApi;
