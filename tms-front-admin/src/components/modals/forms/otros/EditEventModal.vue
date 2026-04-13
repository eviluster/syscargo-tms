<template>
  <div
    ref="modalEl"
    class="modal fade"
    tabindex="-1"
    aria-modal="true"
    role="dialog"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <el-form
          :model="formData"
          :rules="rules"
          ref="formRef"
          @submit.prevent="submit"
        >
          <div class="modal-header">
            <h2 class="fw-bold">Editar Evento</h2>
            <button type="button" class="btn btn-icon btn-sm" @click="hide">
              <KTIcon icon-name="cross" icon-class="fs-1" />
            </button>
          </div>

          <div class="modal-body">
            <div class="row">
              <!-- Fecha -->
              <div class="col-md-6 mb-3">
                <el-form-item label="Fecha" prop="fecha">
                  <el-date-picker
                    v-model="formData.fecha"
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
                  <el-checkbox v-model="formData.fullDay">
                    Todo el día
                  </el-checkbox>
                </el-form-item>
              </div>

              <!-- Hora de Inicio -->
              <div class="col-md-6 mb-3" v-if="!formData.fullDay">
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
              <div class="col-md-6 mb-3" v-if="!formData.fullDay">
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

              <!-- Estado -->
              <div class="col-md-6 mb-3">
                <el-form-item label="Estado" prop="state">
                  <el-select
                    v-model="formData.state"
                    placeholder="Selecciona estado"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="s in states"
                      :key="s"
                      :label="s"
                      :value="s"
                    />
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-danger" @click="deleteEvent">
              Eliminar
            </button>
            <button type="button" class="btn btn-light" @click="hide">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? "Guardando..." : "Guardar cambios" }}
            </button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, computed } from "vue";
import { Modal } from "bootstrap";
import { CalendarStateEnum } from "@/core/enums/CalendarStateEnum";
import api from "@/services/api";

type EventData = {
  id: string;
  fecha: Date;
  inicio: number;
  fin?: number;
  fullDay: boolean;
  user?: string;
  state: CalendarStateEnum;
  isService?: boolean;
};

export default defineComponent({
  name: "EditEventModal",
  props: {
    event: { type: Object as () => EventData, required: true },
  },
  emits: ["update-event", "refresh-events"],
  setup(props, { emit, expose }) {
    const modalEl = ref<HTMLElement>();
    let modalInstance: Modal;

    function disabledDate(time) {
      return time.getDay() === 0 || time.getDay() === 6;
    }
    // Local form data
    const formData = ref<EventData>({ ...props.event });
    const loading = ref(false);
    const allStates = Object.values(CalendarStateEnum);
    const states = [allStates[0], allStates[2]];
    const formRef = ref();

    // Create modal once mounted
    onMounted(() => {
      modalInstance = new Modal(modalEl.value!);
    });
    expose({
      show: () => modalInstance.show(),
      hide: () => modalInstance.hide(),
    });
    // Whenever prop changes (new event), update formData
    watch(
      () => props.event,
      (newEv) => {
        formData.value = { ...newEv };
      },
    );

    // Computed for time pickers
    const startTime = computed<string>({
      get: () => String(formData.value.inicio).padStart(2, "0") + ":00",
      set: (val) => {
        const [h, m] = val.split(":").map(Number);
        formData.value.inicio = h + m / 60;
      },
    });
    const endTime = computed<string>({
      get: () =>
        formData.value.fin != null
          ? String(formData.value.fin).padStart(2, "0") + ":00"
          : "",
      set: (val) => {
        const [h, m] = val.split(":").map(Number);
        formData.value.fin = h + m / 60;
      },
    });

    const rules = {
      fecha: [{ required: true, message: "Requerido", trigger: "blur" }],
      inicio: [{ required: true, message: "Requerido", trigger: "change" }],
      state: [{ required: true, message: "Requerido", trigger: "change" }],
    };

    const show = () => modalInstance.show();
    const hide = () => modalInstance.hide();

    const deleteEvent = async () => {
      try {
        console.log(formData.value);
        await api.put("/calendar/active", { id: formData.value.id });
        emit("refresh-events");
        hide();
      } catch (error) {
        console.error("Error al eliminar el evento:", error);
      }
    };
    const submit = () => {
      formRef.value.validate((valid: boolean) => {
        if (!valid) return;
        loading.value = true;
        emit("update-event", { ...formData.value });
        loading.value = false;
        hide();
      });
    };

    expose({ show, hide });

    return {
      modalEl,
      formData,
      loading,
      states,
      formRef,
      startTime,
      endTime,
      rules,
      deleteEvent,
      disabledDate,
      submit,
      show,
      hide,
    };
  },
});
</script>

<style scoped lang="scss">
.el-select {
  width: 100%;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
</style>
