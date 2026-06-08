<template>
  <div class="container py-3">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="mb-0">{{ title }}</h4>
      <div>
        <input
          v-model="q"
          type="search"
          class="form-control form-control-sm"
          placeholder="Buscar por nombre o usuario"
        />
      </div>
    </div>

    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border" role="status"></div>
    </div>

    <div v-else>
      <div v-if="filtered.length === 0" class="text-center text-muted py-5">
        - No se encontraron prestatarios con este servicio -
      </div>

      <div class="row g-3">
        <div
          v-for="p in paginated"
          :key="p.id"
          class="col-12 col-md-6 col-lg-4"
        >
          <div class="card h-100 section-card">
            <div class="card-body d-flex flex-column">
              <div class="d-flex justify-content-between">
                <div>
                  <div class="fw-semibold">
                    {{ p.user?.name || p.name || "-" }}
                  </div>
                  <div class="small text-muted">
                    {{ p.user?.username || p.user?.email || "-" }}
                  </div>
                </div>
                <div class="text-end">
                  <div class="fw-semibold">{{ p.rating ?? "-" }}</div>
                  <div class="small text-muted">Rating</div>
                </div>
              </div>

              <hr />

              <!-- preview depending on service -->
              <div v-if="serviceKey === 'alojamiento'">
                <div class="small mb-1">
                  <strong>Habitaciones:</strong>
                  {{ p.habitacionesDisponibles ?? "-" }}
                </div>
                <div class="small mb-1">
                  <strong>Capacidad:</strong> {{ p.capacidadPersonas ?? "-" }}
                </div>
                <div class="small">
                  <strong>Precio noche:</strong>
                  {{ p.precioNochePromedio ?? "-" }}
                </div>
              </div>

              <div v-else-if="serviceKey === 'gps'">
                <div class="small mb-1">
                  <strong>Proveedores:</strong>
                  {{ (p.gpsProviders || []).slice(0, 2).join(", ") || "-" }}
                </div>
                <div class="small mb-1">
                  <strong>Dispositivos:</strong>
                  {{ p.gpsDevicesAvailable ?? "-" }}
                </div>
              </div>

              <div v-else-if="serviceKey === 'talleres'">
                <div class="small mb-1">
                  <strong>Técnicos:</strong> {{ p.talleresNumTecnicos ?? "-" }}
                </div>
                <div class="small mb-1">
                  <strong>Servicios:</strong>
                  {{
                    (p.talleresServicios || []).slice(0, 2).join(", ") || "-"
                  }}
                </div>
              </div>

              <div
                class="mt-5 d-flex gap-2 justify-content-center align-items-center"
              >
                <button class="btn btn-sm btn-primary" @click="openDetails(p)">
                  Detalles
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- pagination simple -->
      <div v-if="pages > 1" class="d-flex justify-content-center mt-4">
        <nav>
          <ul class="pagination">
            <li
              :class="['page-item', { disabled: page === 1 }]"
              @click="page = Math.max(1, page - 1)"
            >
              <a class="page-link">«</a>
            </li>
            <li
              v-for="p in pagesArray"
              :key="p"
              :class="['page-item', { active: p === page }]"
              @click="page = p"
            >
              <a class="page-link">{{ p }}</a>
            </li>
            <li
              :class="['page-item', { disabled: page === pages }]"
              @click="page = Math.min(pages, page + 1)"
            >
              <a class="page-link">»</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <PrestatarioDetailsModal
      :visible="showModal"
      :prestatario="selected"
      :serviceKey="serviceKey"
      @close="closeModal"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  computed,
  watch,
  onBeforeUnmount,
} from "vue";
import { fetchPrestatariosByServiceFromServer } from "@/services/prestatarioService";
import PrestatarioDetailsModal from "@/components/PrestatarioDetailsModal.vue";

export default defineComponent({
  name: "ServiceListing",
  components: { PrestatarioDetailsModal },
  props: {
    serviceKey: {
      type: String as () => "alojamiento" | "gps" | "talleres",
      required: true,
    },
    title: { type: String, required: false, default: "" },
  },
  setup(props) {
    const items = ref<any[]>([]);
    const loading = ref(false);
    const q = ref("");
    const page = ref(1);
    const perPage = ref(9);
    const total = ref(0);

    const showModal = ref(false);
    const selected = ref<any>(null);

    // debounce simple para búsqueda
    let searchTimer: number | null = null;
    function scheduleReloadDebounced() {
      if (searchTimer) window.clearTimeout(searchTimer);
      searchTimer = window.setTimeout(() => {
        page.value = 1; // volver a la primera página al buscar
        load();
      }, 350);
    }

    async function load() {
      loading.value = true;
      try {
        const res = await fetchPrestatariosByServiceFromServer(
          props.serviceKey as any,
          {
            limit: perPage.value,
            page: page.value,
            q: q.value ? q.value.trim() : undefined,
          },
        );
        items.value = Array.isArray(res.data) ? res.data : [];
        total.value = Number(res.total ?? items.value.length ?? 0);
      } catch (err) {
        console.error("Error fetching prestatarios by service", err);
        items.value = [];
        total.value = 0;
      } finally {
        loading.value = false;
      }
    }

    onMounted(() => {
      load();
    });

    // reload cuando cambien page o perPage o serviceKey
    watch([page, perPage, () => props.serviceKey], () => {
      load();
    });

    watch(q, () => {
      scheduleReloadDebounced();
    });

    // --- NUEVO: computed filtered que el template espera ---
    const filtered = computed(() => {
      if (!q.value) return items.value;
      const term = q.value.toLowerCase();
      return items.value.filter((p: any) => {
        const name = String(p.user?.name || p.name || "").toLowerCase();
        const userIdent = String(
          p.user?.username || p.user?.email || "",
        ).toLowerCase();
        return name.includes(term) || userIdent.includes(term);
      });
    });

    // pages y paginación basados en total (si backend lo devuelve) o en filtered
    const pages = computed(() =>
      Math.max(
        1,
        Math.ceil((total.value || filtered.value.length) / perPage.value),
      ),
    );
    const pagesArray = computed(() =>
      Array.from({ length: pages.value }, (_, i) => i + 1),
    );

    // paginated en esta versión: items ya viene paginado por servidor (pero si no, fallback)
    const paginated = computed(() => {
      // si backend devuelve paginado, items === página actual; si no, calculamos slice
      if (total.value > 0) {
        return items.value;
      }
      const start = (page.value - 1) * perPage.value;
      return filtered.value.slice(start, start + perPage.value);
    });

    function openDetails(p: any) {
      selected.value = p;
      showModal.value = true;
    }
    function closeModal() {
      showModal.value = false;
      selected.value = null;
    }

    function profileLink(p: any) {
      const userId = p.user?.id || p.userId || p.id;
      return { name: "profile", params: { id: userId } };
    }

    function goPage(n: number) {
      const np = Math.max(1, Math.min(n, pages.value));
      if (np !== page.value) page.value = np;
    }

    onBeforeUnmount(() => {
      if (searchTimer) window.clearTimeout(searchTimer);
    });

    return {
      // datos y UI
      prestatarios: items,
      loading,
      q,
      page,
      perPage,
      total,
      // expongo tanto filtered como paginated porque el template usa `filtered` y `paginated`
      filtered,
      pages,
      pagesArray,
      paginated,
      // modal
      openDetails,
      closeModal,
      showModal,
      selected,
      profileLink,
      goPage,
    };
  },
});
</script>

<style scoped>
/* reaprovecha section-card si lo tienes ya; si no, copia de tu css anterior */
.section-card {
  background: rgba(0, 0, 0, 0.04);
  border-radius: 8px;
  padding: 0.5rem;
}
/* mobile-first spacing */
@media (min-width: 768px) {
  .section-card {
    padding: 0.75rem;
  }
}
</style>
