import { ref, inject, computed } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import JwtService from "@/core/services/JwtService";
import { useCookies } from "vue3-cookies";
import { useRouter } from "vue-router";
import api from "@/services/api";

export interface User {
  name: string;
  lastname: string;
  email: string;
  username: string;
  userID: string;
  password: string;
  phone: string;
  password_confirmation?: string;
}

export const useAuthStore = defineStore("auth", () => {
  const errors = ref({});
  const user = ref();
  const isAuthenticated = ref(!!JwtService.getToken());
  const router = useRouter();
  const { cookies } = useCookies();

  const listaVentas = ref([]);

  const setListaVentas = (lista: any) => {
    listaVentas.value = lista;
  };

  const accessToken = ref<any>(cookies.get("refresh_token"));

  function setAuth(authUser) {
    isAuthenticated.value = true;
    // user.value = authUser;
    errors.value = {};
    // JwtService.saveToken(user.value.api_token);
  }

  function setError(error: any) {
    errors.value = { ...error };
  }

  function purgeAuth() {
    isAuthenticated.value = false;
    // user.value = {} as User;
    errors.value = [];
    JwtService.destroyToken();
  }

  const isTokenExpired = async () => {
    const response = await api.post("/auth/is-token-expired", {
      token: cookies.get("refresh_token"),
    });

    if (response.data == false) {
      return false;
    } else {
      cookies.set(
        "refresh_token",
        response.data, // el nuevo token
        "1d", // expira en 1 día
        "/", // path
        "", // domain
        true, // secure
        "Strict", // sameSite
      );
      return true;
    }
  };

  const login = async (credentials: any) => {
    try {
      console.log("run login");
      console.log(credentials);
      //  await isTokenExpired();
      const response = await api.post("/auth/signin", credentials);
      if (response.status === 200) {
        cookies.set(
          "refresh_token",
          response.data.refresh_token,
          "1d", // o bien 60*60*24
          "/", // path
          "", // domain (vacío = el actual)
          true, // secure
          "Strict", // sameSite
        );
        accessToken.value = response.data.refresh_token;

        console.log(response);
        console.log("Inicio de sesión correcto:", response.data);
        console.log(cookies.get("refresh_token"));
        const userData = {
          userID: response.data.userID,
          name: response.data.name,
          username: response.data.username,
          email: response.data.email,
          lastname: response.data.lastname,
          phone: response.data.phone,
          role: response.data.role.name,
        };
        user.value = userData;
        cookies.set(
          "userData",
          JSON.stringify(userData),
          "1d", // o bien 60*60*24
          "/", // path
          "", // domain (vacío = el actual)
          true, // secure
          "Strict", // sameSite
        );
        console.log(cookies.get("userData"));
        isAuthenticated.value = true;
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Falló el Inicio de sesión:", error);
    } finally {
      await router.push({ path: "/" });
    }
  };

  const register = async (credentials) => {
    try {
      console.log("run");
      console.log(credentials);

      //  await isTokenExpired();
      const response = await api.post("/auth/signup-admin", credentials);
      console.log(response);

      console.log("Usuario registrado:", response.data);
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
    }
  };

  const signOut = async () => {
    if (user.value) {
      const response = await api.post("/auth/logout", {
        username: user.value.username,
        password: user.value.password,
      });
      console.log(response);
      router.push({ name: "sign-in" });
    }
  };

  function forgotPassword(email: string) {
    return ApiService.post("forgot_password", email)
      .then(() => {
        setError({});
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function resetPassword(token: string, email: string, password: string, password_confirmation: string) {
    return ApiService.post("reset_password", { token, email, password, password_confirmation })
      .then(() => {
        setError({});
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function verifyAuth() {
    if (JwtService.getToken()) {
      ApiService.setHeader();
      ApiService.post("verify_token", { api_token: JwtService.getToken() })
        .then(({ data }) => {
          setAuth(data);
        })
        .catch(({ response }) => {
          setError(response.data.errors);
          purgeAuth();
        });
    } else {
      purgeAuth();
    }
  }

  return {
    errors,
    user,
    isAuthenticated,
    accessToken,
    listaVentas,
    setListaVentas,
    login,
    signOut,
    register,
    forgotPassword,
    resetPassword,
    verifyAuth,
    isTokenExpired,
  };
});
