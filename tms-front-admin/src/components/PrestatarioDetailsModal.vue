<template>
  <div
    v-if="visible"
    class="pv-modal-backdrop"
    @click.self="close"
    role="dialog"
    aria-modal="true"
  >
    <div class="pv-modal card">
      <div
        class="card-header header-dark d-flex justify-content-between align-items-center"
      >
        <div class="d-flex align-items-center gap-3">
          <div class="avatar-ico">
            <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 12a4 4 0 1 0-.001-8.001A4 4 0 0 0 12 12zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"
              />
            </svg>
          </div>
          <div>
            <!-- Nombre completo: preferimos user.name + user.lastname si están -->
            <h5 class="mb-0 modal-title">
              {{ userFullName }}
            </h5>
            <div class="small text-muted-light mt-1">
              {{
                prestatario?.user?.username || prestatario?.user?.email || ""
              }}
              <span v-if="phoneDisplay"> · {{ phoneDisplay }}</span>
            </div>
          </div>
        </div>

        <div class="d-flex align-items-center gap-2">
          <button
            class="btn btn-sm btn-outline-light"
            @click="close"
            aria-label="Cerrar"
          >
            Cerrar
          </button>
        </div>
      </div>

      <div class="card-body body-dark">
        <div class="summary-grid mb-3">
          <div class="summary-item">
            <div class="label"><IconStar /> Rating</div>
            <div class="value">{{ prestatario?.rating ?? "-" }}</div>
          </div>

          <div class="summary-item">
            <div class="label"><IconVias /> Vías</div>
            <div class="value">
              <template
                v-if="prestatario?.servicios && prestatario.servicios.length"
              >
                <span
                  v-for="(s, i) in prestatario.servicios"
                  :key="i"
                  class="badge-light"
                  >{{ s }}</span
                >
              </template>
              <span v-else class="text-muted-light">—</span>
            </div>
          </div>

          <!-- NUEVO: teléfono -->
          <div class="summary-item">
            <div class="label"><IconPhone /> Contacto</div>
            <div class="value">{{ phoneDisplay ?? "-" }}</div>
          </div>

          <div class="summary-item">
            <div class="label"><IconClock /> Última actualización</div>
            <div class="value">{{ formattedUpdatedAt }}</div>
          </div>
        </div>

        <hr class="separator" />

        <div v-if="serviceKey === 'alojamiento'">
          <h6 class="section-title">Detalles — Alojamiento</h6>
          <div class="grid-2cols mb-3">
            <div class="field">
              <div class="field-label"><IconRooms /> Habitaciones</div>
              <div class="field-value">
                {{ prestatario?.habitacionesDisponibles ?? "-" }}
              </div>
            </div>

            <div class="field">
              <div class="field-label"><IconPeople /> Capacidad (personas)</div>
              <div class="field-value">
                {{ prestatario?.capacidadPersonas ?? "-" }}
              </div>
            </div>

            <div class="field">
              <div class="field-label"><IconMoney /> Precio noche</div>
              <div class="field-value">
                {{ prestatario?.precioNochePromedio ?? "-" }}
              </div>
            </div>

            <div class="field">
              <div class="field-label"><IconList /> Tipos de habitaciones</div>
              <div class="field-value">
                <template v-if="(prestatario?.tipoHabitaciones || []).length">
                  <span
                    v-for="(t, i) in prestatario.tipoHabitaciones"
                    :key="i"
                    class="badge-light"
                    >{{ t }}</span
                  >
                </template>
                <span v-else class="text-muted-light">— Ninguno —</span>
              </div>
            </div>

            <div class="field full">
              <div class="field-label"><IconCheck /> Servicios incluidos</div>
              <div class="field-value">
                <template
                  v-if="
                    (prestatario?.serviciosIncluidosAlojamiento || []).length
                  "
                >
                  <span
                    v-for="(s, i) in prestatario.serviciosIncluidosAlojamiento"
                    :key="i"
                    class="badge-light"
                    >{{ s }}</span
                  >
                </template>
                <span v-else class="text-muted-light">— Ninguno —</span>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="serviceKey === 'gps'">
          <h6 class="section-title">Detalles — GPS</h6>
          <div class="grid-2cols mb-3">
            <div class="field">
              <div class="field-label"><IconProvider /> Proveedores</div>
              <div class="field-value">
                <template v-if="(prestatario?.gpsProviders || []).length">
                  <span
                    v-for="(p, i) in prestatario.gpsProviders.slice(0, 5)"
                    :key="i"
                    class="badge-light"
                    >{{ p }}</span
                  >
                </template>
                <span v-else class="text-muted-light">— Ninguno —</span>
              </div>
            </div>

            <div class="field">
              <div class="field-label"><IconDevice /> Dispositivos</div>
              <div class="field-value">
                {{ prestatario?.gpsDevicesAvailable ?? "-" }}
              </div>
            </div>

            <div class="field full">
              <div class="field-label">
                <IconPlan /> Planes / Características
              </div>
              <div class="field-value">{{ prestatario?.gpsPlans || "-" }}</div>
            </div>

            <div class="field">
              <div class="field-label"><IconApi /> Integración API</div>
              <div class="field-value">
                {{ prestatario?.gpsIntegrationApi ? "Sí" : "No" }}
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="serviceKey === 'talleres'">
          <h6 class="section-title">Detalles — Talleres</h6>
          <div class="grid-2cols mb-3">
            <div class="field">
              <div class="field-label"><IconWrench /> Técnicos</div>
              <div class="field-value">
                {{ prestatario?.talleresNumTecnicos ?? "-" }}
              </div>
            </div>

            <div class="field">
              <div class="field-label"><IconTruck /> Capacidad vehículos</div>
              <div class="field-value">
                {{ prestatario?.talleresCapacidadVehiculos ?? "-" }}
              </div>
            </div>

            <div class="field full">
              <div class="field-label">
                <IconClock /> Horario / Observaciones
              </div>
              <div class="field-value">
                {{ prestatario?.talleresHorario || "-" }}
              </div>
            </div>

            <div class="field full">
              <div class="field-label"><IconList /> Servicios ofrecidos</div>
              <div class="field-value">
                <template v-if="(prestatario?.talleresServicios || []).length">
                  <span
                    v-for="(s, i) in prestatario.talleresServicios"
                    :key="i"
                    class="badge-light"
                    >{{ s }}</span
                  >
                </template>
                <span v-else class="text-muted-light">— Ninguno —</span>
              </div>
            </div>
          </div>
        </div>

        <div v-else>
          <div class="text-muted-light">
            Detalle no disponible para este servicio.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, h, computed } from "vue";

/* ICON COMPONENTS (funcionales, render con h) */
const IconStar = defineComponent({
  name: "IconStar",
  render() {
    return h("svg", { viewBox: "0 0 24 24", width: 16, height: 16 }, [
      h("path", {
        fill: "currentColor",
        d: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
      }),
    ]);
  },
});
const IconVias = defineComponent({
  name: "IconVias",
  render() {
    return h("svg", { viewBox: "0 0 24 24", width: 16, height: 16 }, [
      h("path", {
        fill: "currentColor",
        d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM7 17l5-10 5 10H7z",
      }),
    ]);
  },
});
const IconClock = defineComponent({
  name: "IconClock",
  render() {
    return h("svg", { viewBox: "0 0 24 24", width: 16, height: 16 }, [
      h("path", {
        fill: "currentColor",
        d: "M11 6h2v6l5 3-1 1-6-3V6zM12 2a10 10 0 1010 10A10 10 0 0012 2z",
      }),
    ]);
  },
});
const IconRooms = defineComponent({
  name: "IconRooms",
  render() {
    return h("svg", { viewBox: "0 0 24 24", width: 16, height: 16 }, [
      h("path", {
        fill: "currentColor",
        d: "M3 13h8V3H3v10zm0 8h8v-6H3v6zM13 21h8V11h-8v10zm0-18v6h8V3h-8z",
      }),
    ]);
  },
});
const IconPeople = defineComponent({
  name: "IconPeople",
  render() {
    return h("svg", { viewBox: "0 0 24 24", width: 16, height: 16 }, [
      h("path", {
        fill: "currentColor",
        d: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zM8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-8-3.5z",
      }),
    ]);
  },
});
const IconMoney = defineComponent({
  name: "IconMoney",
  render() {
    return h("svg", { viewBox: "0 0 24 24", width: 16, height: 16 }, [
      h("path", {
        fill: "currentColor",
        d: "M12 1L3 5v6c0 5 3.58 9.74 9 11 5.42-1.26 9-6 9-11V5l-9-4zM11 8h2v8h-2z",
      }),
    ]);
  },
});
const IconList = defineComponent({
  name: "IconList",
  render() {
    return h("svg", { viewBox: "0 0 24 24", width: 16, height: 16 }, [
      h("path", {
        fill: "currentColor",
        d: "M7 7h14v2H7V7zm0 4h14v2H7v-2zM3 7h2v2H3V7zm0 4h2v2H3v-2z",
      }),
    ]);
  },
});
const IconCheck = defineComponent({
  name: "IconCheck",
  render() {
    return h("svg", { viewBox: "0 0 24 24", width: 16, height: 16 }, [
      h("path", {
        fill: "currentColor",
        d: "M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z",
      }),
    ]);
  },
});
const IconProvider = defineComponent({
  name: "IconProvider",
  render() {
    return h("svg", { viewBox: "0 0 24 24", width: 16, height: 16 }, [
      h("path", {
        fill: "currentColor",
        d: "M12 2L2 7l10 5 10-5-10-5zm0 7.2L6.2 7 12 4.8 17.8 7 12 9.2zM2 17l10 5 10-5v-2L12 20 2 15v2z",
      }),
    ]);
  },
});
const IconDevice = defineComponent({
  name: "IconDevice",
  render() {
    return h("svg", { viewBox: "0 0 24 24", width: 16, height: 16 }, [
      h("path", {
        fill: "currentColor",
        d: "M7 2h10v2H7V2zm-4 4h18v14H3V6zm2 2v10h14V8H5z",
      }),
    ]);
  },
});
const IconPlan = defineComponent({
  name: "IconPlan",
  render() {
    return h("svg", { viewBox: "0 0 24 24", width: 16, height: 16 }, [
      h("path", {
        fill: "currentColor",
        d: "M3 13h18v-2H3v2zm0 4h18v-2H3v2zM3 7h18V5H3v2z",
      }),
    ]);
  },
});
const IconApi = defineComponent({
  name: "IconApi",
  render() {
    return h("svg", { viewBox: "0 0 24 24", width: 16, height: 16 }, [
      h("path", {
        fill: "currentColor",
        d: "M12 2L9 7h6l-3-5zm0 20l3-5H9l3 5zM2 12l5-3v6L2 12zm18 0l-5 3V9l5 3z",
      }),
    ]);
  },
});
const IconWrench = defineComponent({
  name: "IconWrench",
  render() {
    return h("svg", { viewBox: "0 0 24 24", width: 16, height: 16 }, [
      h("path", {
        fill: "currentColor",
        d: "M22 6l-3-3-4 4-6 1 1 6 4 4 4-4 1-6 4-2z",
      }),
    ]);
  },
});
const IconTruck = defineComponent({
  name: "IconTruck",
  render() {
    return h("svg", { viewBox: "0 0 24 24", width: 16, height: 16 }, [
      h("path", {
        fill: "currentColor",
        d: "M3 13h13v-6H3v6zm16-3h2l1 3h-3v-3zM5 18a2 2 0 104 0 2 2 0 00-4 0zm10 0a2 2 0 104 0 2 2 0 00-4 0z",
      }),
    ]);
  },
});
const IconPhone = defineComponent({
  name: "IconPhone",
  render() {
    return h("svg", { viewBox: "0 0 24 24", width: 16, height: 16 }, [
      h("path", {
        fill: "currentColor",
        d: "M6.6 10.8c1.7 3.1 4.2 5.6 7.3 7.3l1.9-1.9c.3-.3.8-.4 1.2-.3 1.3.4 2.8.6 4.3.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.7 21 3 13.3 3 3c0-.6.4-1 1-1h2.3c.6 0 1 .4 1 1 0 1.6.2 3 0 4.3-.1.4 0 .9.3 1.2l1.4 1.5z",
      }),
    ]);
  },
});

export default defineComponent({
  name: "PrestatarioDetailsModal",
  components: {
    IconStar,
    IconVias,
    IconClock,
    IconRooms,
    IconPeople,
    IconMoney,
    IconList,
    IconCheck,
    IconProvider,
    IconDevice,
    IconPlan,
    IconApi,
    IconWrench,
    IconTruck,
    IconPhone,
  },
  props: {
    visible: { type: Boolean, required: true },
    prestatario: { type: Object as () => any, required: false },
    serviceKey: {
      type: String as () => "alojamiento" | "gps" | "talleres",
      required: true,
    },
  },
  emits: ["close"],
  setup(props, { emit }) {
    function close() {
      emit("close");
    }

    const formattedUpdatedAt = computed(() => {
      const d = props.prestatario?.updatedAt || props.prestatario?.updated_at;
      if (!d) return "-";
      try {
        return new Date(d).toLocaleString();
      } catch {
        return String(d);
      }
    });

    const phoneDisplay = computed(() => {
      return props.prestatario?.user?.phone ?? props.prestatario?.phone ?? null;
    });

    const userFullName = computed(() => {
      const u = props.prestatario?.user;
      const first = u?.name ?? props.prestatario?.name ?? "";
      const last = u?.lastname ?? props.prestatario?.lastname ?? "";
      const full = (first || "") + (last ? ` ${last}` : "");
      return full.trim() || (props.prestatario?.name ?? "Prestatario");
    });

    return {
      close,
      formattedUpdatedAt,
      phoneDisplay,
      userFullName,
    };
  },
});
</script>

<style scoped>
/* Backdrop */
.pv-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2100;
  padding: 1rem;
}

/* Modal */
.pv-modal {
  width: 100%;
  max-width: 960px;
  max-height: 90vh;
  overflow: auto;
  border-radius: 10px;
  background: #0b0b0b;
  color: #ffffff;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
}

/* header */
.header-dark {
  background: linear-gradient(
    180deg,
    rgba(20, 20, 20, 0.9),
    rgba(10, 10, 10, 0.9)
  );
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  padding: 1rem 1.25rem;
}
.modal-title {
  font-size: 1.05rem;
  font-weight: 700;
}

/* body */
.body-dark {
  padding: 1.25rem;
  color: #ffffff;
}

/* summary grid */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}
.summary-item {
  background: rgba(255, 255, 255, 0.02);
  padding: 0.6rem;
  border-radius: 8px;
}
.summary-item .label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #c7cbd0;
  font-size: 0.85rem;
}
.summary-item .value {
  font-weight: 600;
  font-size: 1rem;
  margin-top: 0.25rem;
  color: #fff;
}

/* section title */
.section-title {
  margin: 0 0 0.5rem 0;
  color: #ffffff;
  font-size: 0.98rem;
  font-weight: 700;
}

/* two-column grid for fields */
.grid-2cols {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}
.field {
  background: rgba(255, 255, 255, 0.01);
  padding: 0.65rem;
  border-radius: 8px;
}
.field.full {
  grid-column: 1 / -1;
}
.field-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #c7cbd0;
  font-size: 0.82rem;
}
.field-value {
  margin-top: 0.35rem;
  font-weight: 600;
  color: #fff;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* badges */
.badge-light {
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  font-size: 0.78rem;
  margin-right: 0.25rem;
}

/* muted light small text */
.text-muted-light {
  color: rgba(255, 255, 255, 0.5);
}

/* separator */
.separator {
  border: none;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.03),
    rgba(255, 255, 255, 0.02)
  );
  margin: 0.75rem 0;
}

/* avatar icon container */
.avatar-ico svg {
  color: #fff;
  opacity: 0.95;
}

/* responsive */
@media (max-width: 992px) {
  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .pv-modal {
    max-width: 720px;
  }
}
@media (max-width: 576px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }
  .grid-2cols {
    grid-template-columns: 1fr;
  }
  .pv-modal {
    padding: 0.5rem;
    max-width: 100%;
  }
}
</style>
