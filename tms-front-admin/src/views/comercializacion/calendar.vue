<template>
  <div>
    <button
      type="button"
      class="btn btn-primary mb-3"
      @click="openAddModal(new Date())"
    >
      <KTIcon icon-name="plus" icon-class="fs-2" />
      Añadir evento
    </button>

    <FullCalendar
      ref="calendarRef"
      class="demo-app-calendar"
      :options="calendarOptions"
    />

    <!-- Modals -->
    <NewEventModal :initial-date="selectedDate" @save="onAddEvent" />
    <EditEventModal
      v-if="selectedEvent"
      ref="editEventModal"
      :event="selectedEvent"
      @update-event="onUpdateEvent"
      @refresh-events="fetchEvents"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick, computed } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import apiback from "@/services/api";
import NewEventModal from "@/components/modals/forms/NewEventModal.vue";
import EditEventModal from "@/components/modals/forms/otros/EditEventModal.vue";
import { Modal } from "bootstrap";
import { CalendarStateEnum } from "@/core/enums/CalendarStateEnum";
import type { CalendarOptions, EventInput } from "@fullcalendar/core";
import Swal from "sweetalert2";

// Interfaz interna usada para modals
interface EventData {
  id: string;
  fecha: Date;
  inicio: number;
  fin?: number;
  fullDay: boolean;
  user?: string;
  state: CalendarStateEnum;
  isService?: boolean;
}

export default defineComponent({
  name: "CalendarApp",
  components: { FullCalendar, NewEventModal, EditEventModal },
  setup() {
    const editEventModal = ref<InstanceType<typeof EditEventModal> | null>(
      null,
    );
    const colorMap: Record<CalendarStateEnum, string> = {
      [CalendarStateEnum.green]: "green",
      [CalendarStateEnum.grey]: "grey",
      [CalendarStateEnum.red]: "red",
    };
    const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null);
    const events = ref<EventInput[]>([]);
    const selectedDate = ref<Date>(new Date());
    const selectedEvent = ref<EventData | null>(null);
    let addModalInstance: Modal | null = null;
    let editModalInstance: Modal | null = null;

    const toCalendarInput = (e: EventData): EventInput => {
      const start = new Date(e.fecha);
      start.setHours(e.inicio, 0, 0, 0);
      const end =
        e.fin != null
          ? new Date(new Date(e.fecha).setHours(e.fin, 0, 0, 0))
          : undefined;

      // e.state es uno de "Disponible" | "Ocupado" | "No Disponible"
      const color = colorMap[e.state] ?? "blue";

      return {
        id: e.id,
        title: e.state,
        start,
        end,
        allDay: e.fullDay,
        backgroundColor: color, // color de fondo
        borderColor: color, // color del borde
        extendedProps: { state: e.state, isService: e.isService },
      };
    };

    onMounted(async () => {
      fetchEvents();
      nextTick(() => calendarRef.value?.getApi().updateSize());
    });

    const calendarOptions = computed<CalendarOptions>(() => ({
      plugins: [timeGridPlugin, interactionPlugin],
      initialView: "timeGridWeek",
      validRange: {
        start: new Date(), // ← aquí se establece que el rango válido inicia hoy
      },
      weekends: false,
      headerToolbar: { left: "prev,next today", center: "title", right: "" },
      height: "auto",
      dateClick: handleDateClick,
      eventClick: handleEventClick,
      events: events.value,
      eventDidMount: (info) => {
        const color = colorMap[info.event.extendedProps.state];
        info.el.style.backgroundColor = color;
        info.el.style.borderColor = color;
      },
    }));

    const fetchEvents = async () => {
      try {
        const resp = await apiback.get<{
          data: (Omit<EventData, "fecha"> & { fecha: string })[];
        }>("calendar/all-active");
        const rawList = Array.isArray(resp.data) ? resp.data : resp.data.data;
        const evs: EventData[] = rawList
          .map((d) => ({
            ...d,
            fecha: new Date(d.fecha),
          }))
          .filter((e) => e.isService === false);
        events.value = evs.map(toCalendarInput);
      } catch (error) {
        console.error("Error al obtener los eventos:", error);
      }
    };
    function openAddModal(date: Date) {
      selectedDate.value = date;
      const el = document.getElementById("kt_modal_add_event")!;
      addModalInstance = new Modal(el);
      addModalInstance.show();
    }

    function openEditModal(ev: EventData) {
      selectedEvent.value = ev;
      editEventModal.value?.show();
    }

    async function onAddEvent(payload: Omit<EventData, "id">) {
      const resp = await apiback.post<EventData>("/calendar", payload);
      const nuevo = resp.data;
      events.value.push(toCalendarInput(nuevo));
      fetchEvents();
      addModalInstance?.hide();
    }

    async function onUpdateEvent(payload: EventData) {
      console.log(payload);
      await apiback.patch(`/calendar`, payload);
      const api = calendarRef.value!.getApi();
      const evt = api.getEventById(payload.id);
      if (evt) {
        evt.setStart(new Date(payload.fecha).setHours(payload.inicio, 0, 0, 0));
        if (payload.fin != null)
          evt.setEnd(new Date(payload.fecha).setHours(payload.fin, 0, 0, 0));
        evt.setAllDay(payload.fullDay);
        evt.setExtendedProp("state", payload.state);
        evt.setExtendedProp("isService", payload.isService);
        evt.setProp("title", payload.state.toString());
      }
      fetchEvents();
      editModalInstance?.hide();
    }

    function handleDateClick(info: any) {
      const clickDate = info.date;
      const found = calendarRef
        .value!.getApi()
        .getEvents()
        .find((e) => e.start!.toDateString() === clickDate.toDateString());

      if (found) {
        const ev: EventData = {
          id: found.id,
          fecha: new Date(found.start!),
          inicio: found.start!.getHours(),
          fin: found.end?.getHours(),
          fullDay: found.allDay,
          state: (found.extendedProps as any).state,
          isService: (found.extendedProps as any).isService ?? false,
        };

        // Solo si no está "Ocupado" (grey) abrimos el modal:
        if (ev.state !== CalendarStateEnum.grey) {
          openEditModal(ev);
        } else {
          Swal.fire({
            icon: "warning",
            title: "Edición no permitida",
            text: "Este día ya está ocupado y no se puede modificar.",
            confirmButtonText: "Entendido",
          });
        }
      } else {
        openAddModal(clickDate);
      }
    }

    function handleEventClick(clickInfo: any) {
      const e = clickInfo.event;
      const ev: EventData = {
        id: e.id,
        fecha: new Date(e.start!),
        inicio: e.start!.getHours(),
        fin: e.end?.getHours(),
        fullDay: e.allDay,
        state: (e.extendedProps as any).state,
        isService: (e.extendedProps as any).isService ?? false,
      };

      // Solo si no está "Ocupado" (grey) abrimos el modal:
      if (ev.state !== CalendarStateEnum.grey) {
        openEditModal(ev);
      } else {
        Swal.fire({
          icon: "warning",
          title: "Edición no permitida",
          text: "Este evento está marcado como ‘Ocupado’ y no puede editarse.",
          confirmButtonText: "Entendido",
        });
      }
    }

    return {
      calendarOptions,
      calendarRef,
      selectedDate,
      selectedEvent,
      onAddEvent,
      onUpdateEvent,
      openAddModal,
      fetchEvents,
      editEventModal,
      openEditModal,
    };
  },
});
</script>
