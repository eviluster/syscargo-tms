import { onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useCookies } from "vue3-cookies";
import api from "@/services/api"; // tu instancia de axios/config

export function useIdleLogout(userId: any) {
  console.log(userId);

  const router = useRouter();
  const { cookies } = useCookies();

  // Tiempo de inactividad en ms (3h = 3 * 60 * 60 * 1000)
  const TIMEOUT = 10 * 60 * 1000;
  let timerId: number;

  const resetTimer = () => {
    clearTimeout(timerId);
    timerId = window.setTimeout(logout, TIMEOUT);
  };

  const logout = async () => {
    try {
      await api.post("/auth/log-out", { id: userId });
    } catch (e) {
      console.error("Error en logout automático", e);
    } finally {
      cookies.remove("refresh_token", "/", "");
      router.push({ name: "sign-in" });
    }
  };

  const activityEvents = [
    "click",
    "mousemove",
    "keydown",
    "scroll",
    "touchstart",
  ];

  onMounted(() => {
    console.log("useIdleLogout activado");

    // Arranca el temporizador
    resetTimer();
    // Escucha eventos de actividad
    activityEvents.forEach((evt) =>
      window.addEventListener(evt, resetTimer, { passive: true }),
    );
  });

  onBeforeUnmount(() => {
    // Limpia todo al desmontar (p. ej. logout manual o cambio de ruta)
    clearTimeout(timerId);
    activityEvents.forEach((evt) =>
      window.removeEventListener(evt, resetTimer),
    );
  });
}
