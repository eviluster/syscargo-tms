<template>
  <div
    class="modal fade"
    id="kt_modal_add_event"
    aria-modal="true"
    role="dialog"
    ref="newTargetModalRef"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <el-form
          :model="targetData"
          :rules="rules"
          ref="formRef"
          @submit.prevent="submit"
        >
          <div class="modal-header">
            <h2 class="fw-bold">Añadir Evento</h2>
            <button
              type="button"
              class="btn btn-icon btn-sm"
              data-bs-dismiss="modal"
            >
              <KTIcon icon-name="cross" icon-class="fs-1" />
            </button>
          </div>

          <div class="modal-body">
            <div class="row">
              <!-- Fecha -->
              <div class="col-md-6 mb-3">
                <el-form-item label="Fecha" prop="fecha">
                  <el-date-picker
                    v-model="targetData.fecha"
                    type="date"
                    placeholder="Selecciona fecha"
                    style="width: 100%"
                    :disabled-date="disabledDate"
                  />
                </el-form-item>
              </div>

              <!-- Día completo -->
              <div class="col-md-6 mb-3 d-flex align-items-center">
                <el-form-item>
                  <el-checkbox v-model="targetData.fullDay">
                    Todo el día
                  </el-checkbox>
                </el-form-item>
              </div>

              <!-- Hora de Inicio -->
              <div
                class="col-md-6 mb-3"
                v-if="!targetData.fullDay"
              >
                <el-form-item label="Hora de Inicio" prop="inicio">
                  <el-time-picker
                    v-model="startTime"
                    placeholder="Selecciona hora"
                    format="HH:mm"
                    value-format="HH:mm"
                    :picker-options="{ step: '00:05' }"
                    style="width: 100%"
                  />
                </el-form-item>
              </div>

              <!-- Hora de Fin -->
              <div
                class="col-md-6 mb-3"
                v-if="!targetData.fullDay"
              >
                <el-form-item label="Hora de Fin" prop="fin">
                  <el-time-picker
                    v-model="endTime"
                    placeholder="Selecciona hora"
                    format="HH:mm"
                    value-format="HH:mm"
                    :picker-options="{ step: '00:05' }"
                    style="width: 100%"
                  />
                </el-form-item>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-light"
              data-bs-dismiss="modal"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="loading"
            >
              {{ loading ? "Guardando..." : "Guardar" }}
            </button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref, watch, computed, onMounted } from "vue";
import { CalendarStateEnum } from "@/core/enums/CalendarStateEnum";
import { useCookies } from "vue3-cookies";

interface Payload {
  fecha: Date;
  inicio: number;
  fin?: number;
  fullDay: boolean;
  user?: string;
  state: CalendarStateEnum;
  isService: boolean;
}

export default defineComponent({
  name: "NewEventModal",
  props: {
    initialDate: { type: Date, required: true },
  },
  emits: ["save"],
  setup(props, { emit }) {
    const formRef = ref();
    const loading = ref(false);
    const states = Object.values(CalendarStateEnum);
    const { cookies } = useCookies();

    // Extraemos y parseamos la cookie userData (que debe ser un JSON con userID, name, lastname, etc.)
    let userId = "";
    const raw = cookies.get("userData");
    if (raw) {
      try {
        const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
        userId = parsed.userID || "";
      } catch (e) {
        console.warn("No se pudo parsear userData desde la cookie", e);
      }
    }
    function disabledDate(time) {
      return time.getDay() === 0 || time.getDay() === 6;
    }

    const targetData = ref<Payload>({
      fecha: props.initialDate,
      inicio: 9,
      fin: 10,
      fullDay: false,
      user: "", // se rellenará justo antes de emitir
      state: states[0],
      isService: false,
    });

    // Computeds para time-pickers
    const startTime = computed<string>({
      get: () => String(targetData.value.inicio).padStart(2, "0") + ":00",
      set: (val: string) => {
        const [h, m] = val.split(":").map(Number);
        targetData.value.inicio = h + m / 60;
      },
    });
    const endTime = computed<string>({
      get: () =>
        targetData.value.fin != null
          ? String(targetData.value.fin).padStart(2, "0") + ":00"
          : "",
      set: (val: string) => {
        const [h, m] = val.split(":").map(Number);
        targetData.value.fin = h + m / 60;
      },
    });

    watch(
      () => props.initialDate,
      (d) => {
        targetData.value.fecha = d;
      },
    );

    const rules = {
      fecha: [{ required: true, message: "Requerido", trigger: "blur" }],
      inicio: [{ required: true, message: "Requerido", trigger: "change" }],
      state: [{ required: true, message: "Requerido", trigger: "change" }],
    };

    const submit = () => {
      formRef.value.validate(async (valid: boolean) => {
        if (!valid) return;
        loading.value = true;

        // Asignamos aquí el userID extraído de la cookie
        console.log("userId", userId);

        targetData.value.user = userId;

        // Emitimos el payload ya con userID
        emit("save", { ...targetData.value });
        loading.value = false;
      });
    };

    return {
      formRef,
      loading,
      targetData,
      rules,
      states,
      startTime,
      endTime,
      disabledDate,
      submit,
    };
  },
});
</script>

<style lang="scss">
.el-select {
  width: 100%;
}

.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
</style>
