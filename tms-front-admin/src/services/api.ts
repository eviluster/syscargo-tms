import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // esta variable tiene "https://api.syscargo.cu/v1"
  timeout: 120000,
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true, // Importante para CORS con credenciales
});

api.interceptors.request.use(
  (config) => {
    const auth = useAuthStore();
    if (auth.accessToken) {
      console.log("Token:", auth.accessToken);
      config.headers!["Authorization"] = `Bearer ${auth.accessToken}`;
    }
    console.log("Request headers:", config.headers);
    console.log(config);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor para debugging de respuestas
// api.interceptors.response.use(
//   (response) => {
//     console.log("Response Headers:", response.headers);
//     return response;
//   },
//   (error) => {
//     if (error.response) {
//       console.error("CORS/API Error:", {
//         status: error.response.status,
//         headers: error.response.headers,
//         data: error.response.data,
//       });
//     }
//     return Promise.reject(error);
//   },
// );

export default api;
