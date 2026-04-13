<template>
  <!--begin::details View-->
  <div class="card mb-5 mb-xl-10" id="kt_profile_details_view">
    <!--begin::Card header-->
    <div class="card-header d-flex justify-content-between align-items-center">
      <!--begin::Card title-->
      <div class="card-title m-0">
        <h3 class="fw-bold m-0">Detalles del perfil</h3>
      </div>
      <!--end::Card title-->

      <div>
        <button class="btn btn-sm btn-primary me-2" @click="toggleEdit">
          {{ editing ? "Cancelar" : "Editar" }}
        </button>
        <button
          v-if="editing"
          class="btn btn-sm btn-success"
          @click="saveProfile"
          :disabled="saving"
        >
          {{ saving ? "Guardando..." : "Guardar" }}
        </button>
      </div>
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="card-body p-9">
      <!-- Nombre completo -->
      <div class="row mb-7">
        <label class="col-lg-4 fw-semibold text-muted">Nombre completo</label>
        <div class="col-lg-8">
          <span v-if="!editing" class="fw-bold fs-6 text-gray-900">
            {{ userData?.name || "-" }} {{ userData?.lastname || "" }}
          </span>

          <div v-else>
            <input
              v-model="draft.name"
              class="form-control form-control-solid"
            />
            <input
              v-model="draft.lastname"
              class="form-control form-control-solid mt-2"
            />
          </div>
        </div>
      </div>

      <!-- Teléfono -->
      <div class="row mb-7">
        <label class="col-lg-4 fw-semibold text-muted"
          >Teléfono de contacto</label
        >
        <div class="col-lg-8 d-flex align-items-center">
          <span v-if="!editing" class="fw-bold fs-6 me-2">{{
            userData?.phone || "-"
          }}</span>
          <input
            v-else
            v-model="draft.phone"
            class="form-control form-control-solid"
          />
        </div>
      </div>

      <!-- Email -->
      <div class="row mb-7">
        <label class="col-lg-4 fw-semibold text-muted"
          >Correo electrónico</label
        >
        <div class="col-lg-8 d-flex align-items-center">
          <span v-if="!editing" class="fw-bold fs-6 me-2">{{
            userData?.email || "-"
          }}</span>
          <input
            v-else
            v-model="draft.email"
            class="form-control form-control-solid"
          />
        </div>
      </div>

      <!-- Username -->
      <div class="row mb-7">
        <label class="col-lg-4 fw-semibold text-muted">Username</label>
        <div class="col-lg-8 d-flex align-items-center">
          <span v-if="!editing" class="fw-bold fs-6 me-2">{{
            userData?.username || "-"
          }}</span>
          <input
            v-else
            v-model="draft.username"
            class="form-control form-control-solid"
            placeholder="Editar username"
          />
        </div>
      </div>

      <!-- Password (opcional) -->
      <div class="row mb-7" v-if="editing">
        <label class="col-lg-4 fw-semibold text-muted">Password</label>
        <div class="col-lg-8 d-flex align-items-center">
          <input
            v-model="draft.password"
            type="password"
            class="form-control form-control-solid"
            placeholder="Dejar vacío para no cambiar"
          />
        </div>
      </div>

      <!-- Role (NO editable) -->
      <div class="row mb-7">
        <label class="col-lg-4 fw-semibold text-muted">Role</label>
        <div class="col-lg-8 d-flex align-items-center">
          <span v-if="!editing" class="fw-bold fs-6 me-2">{{ roleLabel }}</span>

          <input
            v-else
            v-model="draft.role"
            class="form-control form-control-solid"
            disabled
          />
        </div>
      </div>

      <hr />

      <!-- CLIENT SECTION (visible si es cliente) -->
      <div v-if="isClient" class="mb-8">
        <h5 class="mb-4">Datos de la Compañía (Cliente)</h5>

        <div class="row mb-4">
          <label class="col-lg-4 fw-semibold text-muted">Empresa</label>
          <div class="col-lg-8">
            <span v-if="!editing" class="fw-bold fs-6">{{
              clientData?.company || "-"
            }}</span>
            <input
              v-else
              v-model="draft.company"
              class="form-control form-control-solid"
            />
          </div>
        </div>

        <div class="row mb-4">
          <label class="col-lg-4 fw-semibold text-muted">Contacto</label>
          <div class="col-lg-8">
            <span v-if="!editing" class="fw-bold fs-6">{{
              clientData?.contact_name || "-"
            }}</span>
            <input
              v-else
              v-model="draft.contact_name"
              class="form-control form-control-solid"
            />
          </div>
        </div>

        <div class="row mb-4">
          <label class="col-lg-4 fw-semibold text-muted"
            >Teléfono contacto</label
          >
          <div class="col-lg-8">
            <span v-if="!editing" class="fw-bold fs-6">{{
              clientData?.contact_phone || "-"
            }}</span>
            <input
              v-else
              v-model="draft.contact_phone"
              class="form-control form-control-solid"
            />
          </div>
        </div>

        <div class="row mb-4">
          <label class="col-lg-4 fw-semibold text-muted">Tax ID / DNI</label>
          <div class="col-lg-8">
            <span v-if="!editing" class="fw-bold fs-6">{{
              clientData?.tax_id || "-"
            }}</span>
            <input
              v-else
              v-model="draft.tax_id"
              class="form-control form-control-solid"
            />
          </div>
        </div>

        <div class="row mb-4">
          <label class="col-lg-4 fw-semibold text-muted">Dirección</label>
          <div class="col-lg-8">
            <span v-if="!editing" class="fw-bold fs-6">{{
              clientData?.address || "-"
            }}</span>
            <input
              v-else
              v-model="draft.address"
              class="form-control form-control-solid"
            />
          </div>
        </div>
      </div>

      <!-- PRESTATARIO SECTION -->
      <div v-if="isPrestatario" class="mb-4">
        <h5 class="mb-4">Datos Prestatario</h5>

        <!-- Transportes -->
        <div class="row mb-4">
          <label class="col-lg-4 fw-semibold text-muted"
            >Transportes registrados</label
          >
          <div class="col-lg-8">
            <div v-if="!editing">
              <div
                v-if="(prestatario?.transportes || []).length === 0"
                class="text-muted"
              >
                - Sin transportes registrados -
              </div>

              <div
                v-for="(t, idx) in prestatario?.transportes || []"
                :key="idx"
                class="border rounded p-2 mb-2"
              >
                <div class="fw-bold">{{ t.nombreChofer || "-" }}</div>
                <div class="small text-muted">
                  Chapa: {{ t.chapa || "-" }} · Tipo:
                  {{ t.tipoTransporte || "-" }}
                </div>
              </div>
            </div>

            <div v-else>
              <div
                v-for="(t, idx) in draft.transportes"
                :key="'edit-t-' + idx"
                class="border rounded p-2 mb-2 position-relative"
              >
                <div class="row">
                  <div class="col-4">
                    <input
                      v-model="t.nombreChofer"
                      class="form-control form-control-solid"
                      placeholder="Nombre chófer"
                    />
                  </div>
                  <div class="col-4">
                    <input
                      v-model="t.chapa"
                      class="form-control form-control-solid"
                      placeholder="Chapa"
                    />
                  </div>
                  <div class="col-4">
                    <select
                      v-model="t.tipoTransporte"
                      class="form-control form-control-solid"
                    >
                      <option value="">Seleccione tipo</option>
                      <option>Camión</option>
                      <option>Camioneta</option>
                      <option>Tráiler</option>
                      <option>Otro</option>
                    </select>
                  </div>
                </div>

                <button
                  class="btn btn-sm btn-link text-danger position-absolute"
                  style="top: 8px; right: 8px"
                  @click="removeTransport(idx)"
                >
                  Eliminar
                </button>
              </div>

              <button class="btn btn-sm btn-success" @click="addTransport">
                + Añadir transporte
              </button>
            </div>
          </div>
        </div>

        <!-- Tipo de carga -->
        <div class="row mb-4">
          <label class="col-lg-4 fw-semibold text-muted">Tipo de carga</label>
          <div class="col-lg-8 d-flex align-items-center">
            <span v-if="!editing" class="fw-bold fs-6">{{
              prestatario?.tipoCarga || "-"
            }}</span>

            <div v-else class="d-flex gap-2">
              <label
                class="form-check form-check-inline"
                v-for="opt in cargaOptions"
                :key="opt"
              >
                <input
                  class="form-check-input"
                  type="radio"
                  :value="opt"
                  v-model="draft.tipoCarga"
                />
                <span class="form-check-label">{{ opt }}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Contenedor / capacidad -->
        <div class="row mb-4">
          <label class="col-lg-4 fw-semibold text-muted">Contenedor</label>
          <div class="col-lg-8 d-flex align-items-center">
            <span v-if="!editing" class="fw-bold fs-6">{{
              prestatario?.contenedor || "-"
            }}</span>

            <div v-else style="width: 100%">
              <div class="row g-2">
                <div class="col-md-4">
                  <select
                    v-model="draft.contenedor"
                    class="form-control form-control-solid"
                  >
                    <option value="">Seleccione</option>
                    <option>20</option>
                    <option>40</option>
                  </select>
                </div>

                <div class="col-md-4">
                  <input
                    v-model.number="draft.maxWeight"
                    type="number"
                    class="form-control form-control-solid"
                    placeholder="Max weight (kg)"
                    min="0"
                  />
                </div>

                <div class="col-md-4">
                  <input
                    v-model.number="draft.maxVolume"
                    type="number"
                    class="form-control form-control-solid"
                    placeholder="Max volume (m³)"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Servicios (Vías) -->
        <div class="row mb-4">
          <label class="col-lg-4 fw-semibold text-muted"
            >Servicios (Vías)</label
          >
          <div class="col-lg-8">
            <div v-if="!editing">
              <div
                v-if="!(prestatario?.servicios || []).length"
                class="text-muted"
              >
                - Ninguno -
              </div>
              <div v-else>
                <span
                  v-for="(s, i) in prestatario.servicios"
                  :key="i"
                  class="badge bg-light text-dark me-1 mb-1"
                >
                  {{ capitalizeServiceLabel(s) }}
                </span>
              </div>
            </div>

            <div v-else>
              <div class="d-flex flex-wrap gap-2">
                <label
                  v-for="opt in viaOptions"
                  :key="opt.value"
                  class="form-check form-check-inline mb-1"
                >
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :value="opt.value"
                    v-model="draft.servicios"
                  />
                  <span class="form-check-label">{{ opt.label }}</span>
                </label>
              </div>
              <small class="text-muted d-block mt-1">
                Selecciona una o varias vías que ofrezca el prestatario.
              </small>
            </div>
          </div>
        </div>

        <!-- ALQUILER: vista + edición -->
        <div class="row mb-4">
          <label class="col-lg-4 fw-semibold text-muted"
            >Alquiler de almacenes</label
          >
          <div class="col-lg-8">
            <div v-if="!editing">
              <div v-if="!hasAlquiler(prestatario)" class="text-muted">
                - No aplica -
              </div>
              <div v-else>
                <div class="mb-2">
                  <span
                    v-for="(s, i) in prestatario.serviciosPrestAlquiler || []"
                    :key="i"
                    class="badge bg-light text-dark me-1 mb-1"
                  >
                    {{ s }}
                  </span>
                </div>
                <div class="small text-muted">
                  Metros: {{ prestatario?.metrosDisponiblesAlquiler ?? "-" }} m²
                  · Altura: {{ prestatario?.alturaMAlquiler ?? "-" }} m
                </div>
              </div>
            </div>

            <div v-else>
              <div class="form-check form-switch mb-3">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="offersAlquilerSwitch"
                  v-model="draft.offersAlquiler"
                />
                <label class="form-check-label" for="offersAlquilerSwitch">
                  Presto servicios de Alquiler de almacenes
                </label>
              </div>

              <div v-if="draft.offersAlquiler" class="border rounded p-3">
                <div class="mb-3">
                  <label class="form-label fs-7">Servicios de alquiler</label>
                  <div class="d-flex flex-wrap gap-2">
                    <label
                      v-for="opt in alquilerServicesOptions"
                      :key="opt"
                      class="form-check form-check-inline"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        :value="opt"
                        v-model="draft.serviciosPrestAlquiler"
                      />
                      <span class="form-check-label">{{ opt }}</span>
                    </label>
                  </div>
                </div>

                <div class="row g-2">
                  <div class="col-md-6">
                    <label class="form-label fs-7"
                      >Metros disponibles (m²)</label
                    >
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      v-model.number="draft.metrosDisponiblesAlquiler"
                      class="form-control form-control-solid"
                      placeholder="Ej: 120.5"
                    />
                  </div>

                  <div class="col-md-6">
                    <label class="form-label fs-7">Altura disponible (m)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      v-model.number="draft.alturaMAlquiler"
                      class="form-control form-control-solid"
                      placeholder="Ej: 4.2"
                    />
                  </div>
                </div>
              </div>
              <div v-else class="text-muted">
                No se han activado los servicios de alquiler.
              </div>
            </div>
          </div>
        </div>

        <!-- TALLERES -->
        <div class="row mb-4">
          <label class="col-lg-4 fw-semibold text-muted">Talleres</label>
          <div class="col-lg-8">
            <div v-if="!editing">
              <div v-if="!hasTalleres(prestatario)" class="text-muted">
                - No aplica -
              </div>
              <div v-else>
                <div class="small fw-semibold">
                  Técnicos: {{ prestatario?.talleresNumTecnicos ?? "-" }}
                </div>
                <div class="small text-muted">
                  Horario: {{ prestatario?.talleresHorario || "-" }}
                </div>
                <div class="mt-2">
                  <span
                    v-for="(s, i) in prestatario?.talleresServicios || []"
                    :key="i"
                    class="badge bg-light text-dark me-1"
                    >{{ s }}</span
                  >
                </div>
                <div class="small text-muted mt-1">
                  Capacidad vehículos:
                  {{ prestatario?.talleresCapacidadVehiculos ?? "-" }}
                </div>
              </div>
            </div>

            <div v-else>
              <div class="row g-2">
                <div class="col-md-4">
                  <label class="form-label fs-7">Técnicos disponibles</label>
                  <input
                    type="number"
                    min="0"
                    class="form-control form-control-solid"
                    v-model.number="draft.talleresNumTecnicos"
                  />
                </div>
                <div class="col-md-8">
                  <label class="form-label fs-7">Horario / Observaciones</label>
                  <input
                    v-model="draft.talleresHorario"
                    class="form-control form-control-solid"
                  />
                </div>
              </div>

              <div class="mt-2">
                <label class="form-label fs-7">Servicios ofrecidos</label>
                <div class="d-flex flex-wrap gap-2 mt-2">
                  <div
                    v-for="opt in talleresOptions"
                    :key="opt.value"
                    class="form-check"
                  >
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :id="'taller-' + opt.value"
                      :value="opt.value"
                      v-model="draft.talleresServicios"
                    />
                    <label
                      class="form-check-label"
                      :for="'taller-' + opt.value"
                      >{{ opt.label }}</label
                    >
                  </div>
                </div>
              </div>

              <div class="mt-2">
                <label class="form-label fs-7"
                  >Capacidad vehículos simultáneos</label
                >
                <input
                  type="number"
                  min="0"
                  class="form-control form-control-solid"
                  v-model.number="draft.talleresCapacidadVehiculos"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- GPS -->
        <div class="row mb-4">
          <label class="col-lg-4 fw-semibold text-muted">GPS</label>
          <div class="col-lg-8">
            <div v-if="!editing">
              <div v-if="!hasGPS(prestatario)" class="text-muted">
                - No aplica -
              </div>
              <div v-else>
                <div class="small fw-semibold">Proveedores:</div>
                <div class="mb-2">
                  <span
                    v-for="(p, i) in prestatario?.gpsProviders || []"
                    :key="i"
                    class="badge bg-light text-dark me-1"
                    >{{ p }}</span
                  >
                </div>
                <div class="small text-muted">
                  Dispositivos: {{ prestatario?.gpsDevicesAvailable ?? "-" }}
                </div>
                <div class="small text-muted">
                  Planes: {{ prestatario?.gpsPlans || "-" }}
                </div>
                <div class="small text-muted">
                  Integración API:
                  {{ prestatario?.gpsIntegrationApi ? "Sí" : "No" }}
                </div>
              </div>
            </div>

            <div v-else>
              <div class="mb-2">
                <label class="form-label fs-7">Proveedores</label>
                <div class="d-flex flex-wrap gap-2 mt-2">
                  <div
                    v-for="opt in gpsProvidersOptions"
                    :key="opt.value"
                    class="form-check"
                  >
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :id="'gps-' + opt.value"
                      :value="opt.value"
                      v-model="draft.gpsProviders"
                    />
                    <label class="form-check-label" :for="'gps-' + opt.value">{{
                      opt.label
                    }}</label>
                  </div>
                </div>
              </div>

              <div class="row g-2">
                <div class="col-md-6">
                  <label class="form-label fs-7"
                    >Dispositivos disponibles</label
                  >
                  <input
                    type="number"
                    min="0"
                    class="form-control form-control-solid"
                    v-model.number="draft.gpsDevicesAvailable"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label fs-7"
                    >Planes / características</label
                  >
                  <input
                    v-model="draft.gpsPlans"
                    class="form-control form-control-solid"
                    placeholder="Ej: rastreo en tiempo real"
                  />
                </div>
              </div>

              <div class="form-check mt-2">
                <input
                  id="gps_integration"
                  type="checkbox"
                  class="form-check-input"
                  v-model="draft.gpsIntegrationApi"
                />
                <label class="form-check-label" for="gps_integration"
                  >Ofrece integración API / Webhooks</label
                >
              </div>
            </div>
          </div>
        </div>

        <!-- ALOJAMIENTO -->
        <div class="row mb-4">
          <label class="col-lg-4 fw-semibold text-muted">Alojamiento</label>
          <div class="col-lg-8">
            <div v-if="!editing">
              <div v-if="!hasAlojamiento(prestatario)" class="text-muted">
                - No aplica -
              </div>
              <div v-else>
                <div class="small fw-semibold">
                  Habitaciones:
                  {{ prestatario?.habitacionesDisponibles ?? "-" }}
                </div>
                <div class="small text-muted">
                  Capacidad total: {{ prestatario?.capacidadPersonas ?? "-" }}
                </div>
                <div class="small text-muted">
                  Precio noche promedio:
                  {{ prestatario?.precioNochePromedio ?? "-" }}
                </div>
                <div class="mt-2">
                  <span
                    v-for="(t, i) in prestatario?.tipoHabitaciones || []"
                    :key="i"
                    class="badge bg-light text-dark me-1"
                    >{{ t }}</span
                  >
                </div>
                <div class="mt-2">
                  <span
                    v-for="(
                      s, i
                    ) in prestatario?.serviciosIncluidosAlojamiento || []"
                    :key="i"
                    class="badge bg-light text-dark me-1"
                    >{{ s }}</span
                  >
                </div>
              </div>
            </div>

            <div v-else>
              <div class="row g-2">
                <div class="col-md-4">
                  <label class="form-label fs-7"
                    >Habitaciones disponibles</label
                  >
                  <input
                    type="number"
                    min="0"
                    class="form-control form-control-solid"
                    v-model.number="draft.habitacionesDisponibles"
                  />
                </div>
                <div class="col-md-4">
                  <label class="form-label fs-7"
                    >Capacidad total (personas)</label
                  >
                  <input
                    type="number"
                    min="0"
                    class="form-control form-control-solid"
                    v-model.number="draft.capacidadPersonas"
                  />
                </div>
                <div class="col-md-4">
                  <label class="form-label fs-7">Precio noche promedio</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    class="form-control form-control-solid"
                    v-model.number="draft.precioNochePromedio"
                  />
                </div>
              </div>

              <div class="mt-2">
                <label class="form-label fs-7">Tipos de habitaciones</label>
                <div class="d-flex flex-wrap gap-2 mt-2">
                  <div
                    v-for="opt in tiposHabitacionOptions"
                    :key="opt.value"
                    class="form-check"
                  >
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :id="'habit-' + opt.value"
                      :value="opt.value"
                      v-model="draft.tipoHabitaciones"
                    />
                    <label
                      class="form-check-label"
                      :for="'habit-' + opt.value"
                      >{{ opt.label }}</label
                    >
                  </div>
                </div>
              </div>

              <div class="mt-2">
                <label class="form-label fs-7">Servicios incluidos</label>
                <div class="d-flex flex-wrap gap-2 mt-2">
                  <div
                    v-for="opt in serviciosAlojOptions"
                    :key="opt.value"
                    class="form-check"
                  >
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :id="'serv-aloj-' + opt.value"
                      :value="opt.value"
                      v-model="draft.serviciosIncluidosAlojamiento"
                    />
                    <label
                      class="form-check-label"
                      :for="'serv-aloj-' + opt.value"
                      >{{ opt.label }}</label
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cargas especiales -->
        <div class="row mb-4">
          <label class="col-lg-4 fw-semibold text-muted"
            >Cargas especiales</label
          >
          <div class="col-lg-8">
            <div v-if="!editing">
              <div
                v-if="!(prestatario?.cargasEspeciales || []).length"
                class="text-muted"
              >
                - Ninguna -
              </div>
              <ul v-else class="mb-0">
                <li v-for="(c, i) in prestatario.cargasEspeciales" :key="i">
                  {{ c }}
                </li>
              </ul>
            </div>

            <div v-else>
              <div
                v-for="(c, i) in draft.cargasEspeciales"
                :key="'ce-' + i"
                class="input-group mb-2"
              >
                <input
                  v-model="draft.cargasEspeciales[i]"
                  class="form-control form-control-solid"
                />
                <button
                  class="btn btn-danger"
                  @click="removeCargaEspecial(i)"
                  type="button"
                >
                  Eliminar
                </button>
              </div>
              <div class="d-flex gap-2">
                <input
                  v-model="newCargaEspecial"
                  class="form-control form-control-solid"
                  placeholder="Nueva carga especial"
                />
                <button
                  class="btn btn-success"
                  @click="addCargaEspecial"
                  type="button"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Rating -->
        <div class="row mb-4">
          <label class="col-lg-4 fw-semibold text-muted"
            >Rating de compañía</label
          >
          <div class="col-lg-8 d-flex align-items-center">
            <span v-if="!editing" class="fw-bold fs-6">{{
              prestatario?.rating ?? "-"
            }}</span>
            <div v-else>
              <input
                type="number"
                v-model.number="draft.rating"
                min="0"
                max="5"
                step="0.1"
                class="form-control form-control-solid"
              />
              <small class="text-muted">0 - 5</small>
            </div>
          </div>
        </div>

        <!-- Licencia -->
        <div class="row mb-4">
          <label class="col-lg-4 fw-semibold text-muted"
            >Licencia de conducción</label
          >
          <div class="col-lg-8">
            <div v-if="!editing">
              <div class="fw-bold">
                {{ prestatario?.licencia?.numero || "-" }}
              </div>
              <div class="small text-muted">
                Categoría: {{ prestatario?.licencia?.categoria || "-" }} ·
                Vence:
                {{ prestatario?.licencia?.vence || "-" }}
              </div>
            </div>

            <div v-else class="row g-2">
              <div class="col-4">
                <input
                  v-model="draft.licencia.numero"
                  placeholder="Número"
                  class="form-control form-control-solid"
                />
              </div>
              <div class="col-4">
                <input
                  v-model="draft.licencia.categoria"
                  placeholder="Categoría"
                  class="form-control form-control-solid"
                />
              </div>
              <div class="col-4">
                <input
                  v-model="draft.licencia.vence"
                  type="date"
                  class="form-control form-control-solid"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Conditions -->
        <div class="row mb-4">
          <label class="col-lg-4 fw-semibold text-muted"
            >Condiciones / Reglas</label
          >
          <div class="col-lg-8">
            <div v-if="!editing">
              <div v-if="!prestatario?.conditions" class="text-muted">
                - No especificado -
              </div>
              <div v-else class="fw-normal">
                <div v-html="renderConditions(prestatario.conditions)"></div>
              </div>
            </div>

            <div v-else>
              <textarea
                v-model="draft.conditions"
                class="form-control form-control-solid"
                rows="5"
                placeholder="Condiciones o reglas"
              ></textarea>
              <small class="text-muted d-block mt-1"
                >Recomendado: Markdown simple o texto plano.</small
              >
            </div>
          </div>
        </div>

        <!-- Ayudantes -->
        <div class="row mb-4">
          <label class="col-lg-4 fw-semibold text-muted">Ayudantes</label>
          <div class="col-lg-8">
            <div v-if="!editing">
              <div
                v-if="!(prestatario?.ayudantes || []).length"
                class="text-muted"
              >
                - Sin ayudantes -
              </div>
              <div v-else>
                <div
                  v-for="(h, i) in prestatario?.ayudantes || []"
                  :key="i"
                  class="mb-2"
                >
                  <div class="fw-bold">{{ h.nombre }} {{ h.apellidos }}</div>
                  <div class="small text-muted">CI: {{ h.ci }}</div>
                </div>
              </div>
            </div>

            <div v-else>
              <div
                v-for="(h, i) in draft.ayudantes"
                :key="'help-' + i"
                class="input-group mb-2"
              >
                <input
                  v-model="h.nombre"
                  class="form-control form-control-solid"
                  placeholder="Nombre"
                />
                <input
                  v-model="h.apellidos"
                  class="form-control form-control-solid"
                  placeholder="Apellidos"
                />
                <input
                  v-model="h.ci"
                  class="form-control form-control-solid"
                  placeholder="CI"
                />
                <button
                  class="btn btn-danger"
                  @click="removeAyudante(i)"
                  type="button"
                >
                  Eliminar
                </button>
              </div>
              <button
                class="btn btn-sm btn-success"
                @click="addAyudante"
                type="button"
              >
                + Añadir ayudante
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- end prestatario section -->
    </div>
    <!--end::Card body-->
  </div>
  <!--end::details View-->
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive, computed } from "vue";
import { useCookies } from "vue3-cookies";
import api from "@/services/api";
import Swal from "sweetalert2";

type Transporte = {
  nombreChofer?: string;
  chapa?: string;
  tipoTransporte?: string;
};

type Ayudante = {
  nombre?: string;
  apellidos?: string;
  ci?: string;
};

export default defineComponent({
  name: "ProfileView",
  setup() {
    const { cookies } = useCookies();
    const userData = ref<any>(null);
    const prestatario = ref<any>(null);
    const clientData = ref<any>(null);

    // Draft para edición local (camelCase)
    const draft = reactive<any>({
      name: "",
      lastname: "",
      phone: "",
      email: "",
      username: "",
      password: "",
      role: "",
      transportes: [] as Transporte[],
      tipoCarga: "",
      contenedor: "",
      maxWeight: null as number | null,
      maxVolume: null as number | null,
      cargasEspeciales: [] as string[],
      rating: null as number | null,
      licencia: { numero: "", categoria: "", vence: "" },
      ayudantes: [] as Ayudante[],

      // servicios (vías)
      servicios: [] as string[],

      // alquiler (camelCase)
      offersAlquiler: false,
      serviciosPrestAlquiler: [] as string[],
      metrosDisponiblesAlquiler: null as number | null,
      alturaMAlquiler: null as number | null,

      // talleres
      providesTalleres: false,
      talleresNumTecnicos: null as number | null,
      talleresHorario: "" as string,
      talleresServicios: [] as string[],
      talleresCapacidadVehiculos: null as number | null,

      // gps
      providesGPS: false,
      gpsProviders: [] as string[],
      gpsDevicesAvailable: null as number | null,
      gpsPlans: "" as string,
      gpsIntegrationApi: false,

      // alojamiento
      providesAlojamiento: false,
      habitacionesDisponibles: null as number | null,
      capacidadPersonas: null as number | null,
      precioNochePromedio: null as number | null,
      tipoHabitaciones: [] as string[],
      serviciosIncluidosAlojamiento: [] as string[],

      // client fields
      company: "",
      contact_name: "",
      contact_phone: "",
      tax_id: "",
      address: "",

      // NUEVO: condiciones / reglas del prestatario
      conditions: "",
    });

    const editing = ref(false);
    const saving = ref(false);

    const cargaOptions = ["Seco", "Refrigerado", "Carga general"];
    const newCargaEspecial = ref("");

    const viaOptions = [
      { value: "maritima", label: "Marítima" },
      { value: "aerea", label: "Aérea" },
      { value: "terrestre", label: "Terrestre" },
      { value: "ferroviaria", label: "Ferroviaria" },
      { value: "multimodal", label: "Multimodal" },
    ];

    const alquilerServicesOptions = [
      "Pick & Pack",
      "Etiquetado",
      "Inspección",
      "Control de calidad",
      "Preparación de pedidos",
      "Transporte",
    ];

    const talleresOptions = [
      { value: "mantenimiento", label: "Mantenimiento" },
      { value: "diagnostico", label: "Diagnóstico" },
      { value: "soldadura", label: "Soldadura" },
      { value: "electricidad", label: "Electricidad" },
      { value: "neumaticos", label: "Neumáticos" },
    ];

    const gpsProvidersOptions = [
      { value: "provider_a", label: "Provider A" },
      { value: "provider_b", label: "Provider B" },
      { value: "provider_c", label: "Provider C" },
    ];

    const tiposHabitacionOptions = [
      { value: "individual", label: "Individual" },
      { value: "doble", label: "Doble" },
      { value: "suite", label: "Suite" },
    ];

    const serviciosAlojOptions = [
      { value: "desayuno", label: "Desayuno" },
      { value: "wifi", label: "Wi-Fi" },
      { value: "parking", label: "Parking" },
      { value: "lavanderia", label: "Lavandería" },
    ];

    // helpers para rol
    const roleLabel = computed(() => {
      return userData.value?.role?.name
        ? userData.value.role.name
        : userData.value?.role || "-";
    });

    const roleNameLower = computed(() => {
      return (
        String(
          userData.value?.role?.name || userData.value?.role || "",
        ).toLowerCase?.() || ""
      );
    });

    const isPrestatario = computed(() =>
      ["prestatario", "provider", "provider_role"].includes(
        roleNameLower.value,
      ),
    );
    const isClient = computed(() =>
      ["cliente", "client", "customer"].includes(roleNameLower.value),
    );

    // ---------------------------
    // Helpers fetch (varias rutas)
    // ---------------------------
    async function fetchPrestatarioByUserId(userId: string) {
      try {
        const attempts = [
          `/prestatario/user/${userId}`,
          `/prestatario/${userId}`,
          `/users/${userId}/prestatario`,
        ];
        for (const path of attempts) {
          try {
            const res = await api.get(path);
            if (res && (res.data || res.status === 200)) {
              return res.data;
            }
          } catch (e) {
            // seguir a la siguiente ruta
          }
        }
      } catch (err) {
        console.error("fetchPrestatario error:", err);
      }
      return null;
    }

    async function fetchClientByUserId(userId: string) {
      try {
        const attempts = [
          `/client/user/${userId}`,
          `/client/${userId}`,
          `/users/${userId}/client`,
          `/cliente/user/${userId}`,
          `/cliente/${userId}`,
        ];
        for (const path of attempts) {
          try {
            const res = await api.get(path);
            if (res && (res.data || res.status === 200)) {
              return res.data;
            }
          } catch (e) {
            // seguir
          }
        }
      } catch (err) {
        console.error("fetchClient error:", err);
      }
      return null;
    }

    onMounted(async () => {
      const cookieUser = cookies.get("userData") || null;
      userData.value = cookieUser;

      if (userData.value) {
        populateDraftFromUser(userData.value);

        const id =
          userData.value?.userID ??
          userData.value?.id ??
          userData.value?.user?.id;
        if (id) {
          const [p, c] = await Promise.all([
            fetchPrestatarioByUserId(String(id)),
            fetchClientByUserId(String(id)),
          ]);

          if (p) {
            prestatario.value = p;
            mergePrestatarioIntoDraft(p);
            userData.value = { ...(userData.value || {}), prestatario: p };
          }
          if (c) {
            clientData.value = c;
            mergeClientIntoDraft(c);
            userData.value = { ...(userData.value || {}), client: c };
          }

          cookies.set("userData", userData.value);
        }
      }
    });

    // ---------------------------
    // Poblado de draft (acepta camelCase y snake_case desde backend)
    // ---------------------------
    function populateDraftFromUser(src: any) {
      draft.name = src.name || "";
      draft.lastname = src.lastname || "";
      draft.phone = src.phone || "";
      draft.email = src.email || "";
      draft.username = src.username || src.username || "";
      draft.role = src.role?.name ? src.role.name : src.role || "";

      // cliente
      draft.company = src.company || src.client?.company || "";
      draft.contact_name = src.contact_name || src.client?.contact_name || "";
      draft.contact_phone =
        src.contact_phone || src.client?.contact_phone || "";
      draft.tax_id = src.tax_id || src.client?.tax_id || "";
      draft.address = src.address || src.client?.address || "";

      // prestatario lightweight (intenta tomar de src.prestatario o src directamente)
      const s = src.prestatario || src;

      draft.transportes = (s.transportes || []).map((t: any) => ({
        nombreChofer: t.nombreChofer || t.nombre_chofer || "",
        chapa: t.chapa || "",
        tipoTransporte: t.tipoTransporte || t.tipo_transporte || "",
      }));

      draft.tipoCarga = s.tipoCarga ?? s.tipo_carga ?? "";
      draft.contenedor = s.contenedor ?? "";
      draft.cargasEspeciales = Array.isArray(s.cargasEspeciales)
        ? [...s.cargasEspeciales]
        : (s.cargasEspeciales ?? []);

      draft.rating = s.rating ?? null;
      draft.licencia = {
        numero: s.licencia?.numero || s.licencia?.numero || "",
        categoria: s.licencia?.categoria || s.licencia?.categoria || "",
        vence: s.licencia?.vence || s.licencia?.vence || "",
      };

      draft.ayudantes = (s.ayudantes || []).map((h: any) => ({
        nombre: h.nombre || "",
        apellidos: h.apellidos || "",
        ci: h.ci || "",
      }));

      const mw = s.maxWeight ?? s.max_weight ?? null;
      const mv = s.maxVolume ?? s.max_volume ?? null;
      draft.maxWeight = mw != null ? Number(mw) : null;
      draft.maxVolume = mv != null ? Number(mv) : null;

      draft.servicios = Array.isArray(s.servicios)
        ? [...s.servicios]
        : s.servicios
          ? [s.servicios]
          : [];

      // ALQUILER (acepta camelCase y snake_case)
      draft.serviciosPrestAlquiler = Array.isArray(s.serviciosPrestAlquiler)
        ? [...s.serviciosPrestAlquiler]
        : Array.isArray(s.servicios_prest_alquiler)
          ? [...s.servicios_prest_alquiler]
          : s.serviciosPrestAlquiler
            ? [s.serviciosPrestAlquiler]
            : s.servicios_prest_alquiler
              ? [s.servicios_prest_alquiler]
              : [];

      draft.metrosDisponiblesAlquiler =
        s.metrosDisponiblesAlquiler ??
        s.metros_disponibles_alquiler ??
        s.metros_disponibles ??
        null;
      draft.alturaMAlquiler =
        s.alturaMAlquiler ?? s.altura_m_alquiler ?? s.altura_m ?? null;
      draft.offersAlquiler =
        draft.serviciosPrestAlquiler.length > 0 ||
        draft.metrosDisponiblesAlquiler != null ||
        draft.alturaMAlquiler != null;

      // TALLERES
      draft.talleresNumTecnicos =
        s.talleresNumTecnicos ?? s.talleres_num_tecnicos ?? null;
      draft.talleresHorario = s.talleresHorario ?? s.talleres_horario ?? "";
      draft.talleresServicios = Array.isArray(s.talleresServicios)
        ? [...s.talleresServicios]
        : Array.isArray(s.talleres_servicios)
          ? [...s.talleres_servicios]
          : [];
      draft.talleresCapacidadVehiculos =
        s.talleresCapacidadVehiculos ?? s.talleres_capacidad_vehiculos ?? null;

      // GPS
      draft.gpsProviders = Array.isArray(s.gpsProviders)
        ? [...s.gpsProviders]
        : Array.isArray(s.gps_providers)
          ? [...s.gps_providers]
          : [];
      draft.gpsDevicesAvailable =
        s.gpsDevicesAvailable ?? s.gps_devices_available ?? null;
      draft.gpsPlans = s.gpsPlans ?? s.gps_plans ?? "";
      draft.gpsIntegrationApi =
        s.gpsIntegrationApi ?? s.gps_integration_api ?? false;

      // ALOJAMIENTO
      draft.habitacionesDisponibles =
        s.habitacionesDisponibles ?? s.habitaciones_disponibles ?? null;
      draft.capacidadPersonas =
        s.capacidadPersonas ?? s.capacidad_personas ?? null;
      draft.precioNochePromedio =
        s.precioNochePromedio ?? s.precio_noche_promedio ?? null;
      draft.tipoHabitaciones = Array.isArray(s.tipoHabitaciones)
        ? [...s.tipoHabitaciones]
        : Array.isArray(s.tipo_habitaciones)
          ? [...s.tipo_habitaciones]
          : [];
      draft.serviciosIncluidosAlojamiento = Array.isArray(
        s.serviciosIncluidosAlojamiento,
      )
        ? [...s.serviciosIncluidosAlojamiento]
        : Array.isArray(s.servicios_incluidos_alojamiento)
          ? [...s.servicios_incluidos_alojamiento]
          : [];

      draft.conditions = s.conditions ?? "";
      draft.password = "";
    }

    function mergePrestatarioIntoDraft(p: any) {
      if (!p) return;
      draft.transportes = (p.transportes || []).map((t: any) => ({
        nombreChofer: t.nombreChofer || "",
        chapa: t.chapa || "",
        tipoTransporte: t.tipoTransporte || "",
      }));
      draft.tipoCarga = p.tipoCarga ?? p.tipo_carga ?? "";
      draft.contenedor = p.contenedor ?? "";
      draft.cargasEspeciales = Array.isArray(p.cargasEspeciales)
        ? [...p.cargasEspeciales]
        : [];
      draft.rating = p.rating ?? null;
      draft.licencia = {
        numero: p.licencia?.numero || "",
        categoria: p.licencia?.categoria || "",
        vence: p.licencia?.vence || "",
      };
      draft.ayudantes = (p.ayudantes || []).map((h: any) => ({
        nombre: h.nombre || "",
        apellidos: h.apellidos || "",
        ci: h.ci || "",
      }));
      draft.maxWeight = p.maxWeight ?? p.max_weight ?? null;
      draft.maxVolume = p.maxVolume ?? p.max_volume ?? null;
      draft.servicios = Array.isArray(p.servicios) ? [...p.servicios] : [];

      // alquiler
      draft.serviciosPrestAlquiler = Array.isArray(p.serviciosPrestAlquiler)
        ? [...p.serviciosPrestAlquiler]
        : Array.isArray(p.servicios_prest_alquiler)
          ? [...p.servicios_prest_alquiler]
          : [];
      draft.metrosDisponiblesAlquiler =
        p.metrosDisponiblesAlquiler ??
        p.metros_disponibles_alquiler ??
        p.metros_disponibles ??
        null;
      draft.alturaMAlquiler =
        p.alturaMAlquiler ?? p.altura_m_alquiler ?? p.altura_m ?? null;
      draft.offersAlquiler =
        draft.serviciosPrestAlquiler.length > 0 ||
        draft.metrosDisponiblesAlquiler != null ||
        draft.alturaMAlquiler != null;

      // talleres
      draft.talleresNumTecnicos =
        p.talleresNumTecnicos ?? p.talleres_num_tecnicos ?? null;
      draft.talleresHorario = p.talleresHorario ?? p.talleres_horario ?? "";
      draft.talleresServicios = Array.isArray(p.talleresServicios)
        ? [...p.talleresServicios]
        : Array.isArray(p.talleres_servicios)
          ? [...p.talleres_servicios]
          : [];
      draft.talleresCapacidadVehiculos =
        p.talleresCapacidadVehiculos ?? p.talleres_capacidad_vehiculos ?? null;

      // gps
      draft.gpsProviders = Array.isArray(p.gpsProviders)
        ? [...p.gpsProviders]
        : Array.isArray(p.gps_providers)
          ? [...p.gps_providers]
          : [];
      draft.gpsDevicesAvailable =
        p.gpsDevicesAvailable ?? p.gps_devices_available ?? null;
      draft.gpsPlans = p.gpsPlans ?? p.gps_plans ?? "";
      draft.gpsIntegrationApi =
        p.gpsIntegrationApi ?? p.gps_integration_api ?? false;

      // alojamiento
      draft.habitacionesDisponibles =
        p.habitacionesDisponibles ?? p.habitaciones_disponibles ?? null;
      draft.capacidadPersonas =
        p.capacidadPersonas ?? p.capacidad_personas ?? null;
      draft.precioNochePromedio =
        p.precioNochePromedio ?? p.precio_noche_promedio ?? null;
      draft.tipoHabitaciones = Array.isArray(p.tipoHabitaciones)
        ? [...p.tipoHabitaciones]
        : Array.isArray(p.tipo_habitaciones)
          ? [...p.tipo_habitaciones]
          : [];
      draft.serviciosIncluidosAlojamiento = Array.isArray(
        p.serviciosIncluidosAlojamiento,
      )
        ? [...p.serviciosIncluidosAlojamiento]
        : Array.isArray(p.servicios_incluidos_alojamiento)
          ? [...p.servicios_incluidos_alojamiento]
          : [];

      draft.conditions = p.conditions ?? "";
    }

    function mergeClientIntoDraft(c: any) {
      if (!c) return;
      draft.company = c.company || "";
      draft.contact_name = c.contact_name || "";
      draft.contact_phone = c.contact_phone || "";
      draft.tax_id = c.tax_id || "";
      draft.address = c.address || "";
    }

    function toggleEdit() {
      if (!editing.value) {
        populateDraftFromUser(userData.value || {});
        if (prestatario.value) mergePrestatarioIntoDraft(prestatario.value);
        if (clientData.value) mergeClientIntoDraft(clientData.value);
      } else {
        populateDraftFromUser(userData.value || {});
        if (prestatario.value) mergePrestatarioIntoDraft(prestatario.value);
        if (clientData.value) mergeClientIntoDraft(clientData.value);
      }
      editing.value = !editing.value;
    }

    function addTransport() {
      draft.transportes.push({
        nombreChofer: "",
        chapa: "",
        tipoTransporte: "",
      });
    }
    function removeTransport(i: number) {
      draft.transportes.splice(i, 1);
    }

    function addAyudante() {
      draft.ayudantes.push({ nombre: "", apellidos: "", ci: "" });
    }
    function removeAyudante(i: number) {
      draft.ayudantes.splice(i, 1);
    }

    function addCargaEspecial() {
      const v = newCargaEspecial.value && newCargaEspecial.value.trim();
      if (!v) return;
      draft.cargasEspeciales.push(v);
      newCargaEspecial.value = "";
    }
    function removeCargaEspecial(i: number) {
      draft.cargasEspeciales.splice(i, 1);
    }

    const displayMaxWeight = computed(() => {
      const v =
        prestatario.value?.maxWeight ??
        prestatario.value?.max_weight ??
        userData.value?.maxWeight ??
        userData.value?.max_weight;
      return v != null && v !== "" ? `${v} kg` : "-";
    });

    const displayMaxVolume = computed(() => {
      const v =
        prestatario.value?.maxVolume ??
        prestatario.value?.max_volume ??
        userData.value?.maxVolume ??
        userData.value?.max_volume;
      return v != null && v !== "" ? `${v} m³` : "-";
    });

    function capitalizeServiceLabel(val: string) {
      return String(val || "");
    }

    function hasAlquiler(p: any) {
      if (!p) return false;
      return (
        (p.serviciosPrestAlquiler && p.serviciosPrestAlquiler.length > 0) ||
        (p.servicios_prest_alquiler && p.servicios_prest_alquiler.length > 0) ||
        p.metrosDisponiblesAlquiler != null ||
        p.metros_disponibles_alquiler != null ||
        p.alturaMAlquiler != null ||
        p.altura_m_alquiler != null
      );
    }
    function hasTalleres(p: any) {
      if (!p) return false;
      return (
        p.talleresNumTecnicos != null ||
        (p.talleresServicios && p.talleresServicios.length > 0) ||
        (p.talleres_servicios && p.talleres_servicios.length > 0)
      );
    }
    function hasGPS(p: any) {
      if (!p) return false;
      return (
        (p.gpsProviders && p.gpsProviders.length > 0) ||
        (p.gps_providers && p.gps_providers.length > 0) ||
        p.gpsDevicesAvailable != null
      );
    }
    function hasAlojamiento(p: any) {
      if (!p) return false;
      return (
        p.habitacionesDisponibles != null ||
        p.habitaciones_disponibles != null ||
        (p.tipoHabitaciones && p.tipoHabitaciones.length > 0) ||
        (p.tipo_habitaciones && p.tipo_habitaciones.length > 0)
      );
    }

    // ---------------------------
    // Guardado: actualiza user y prestatario/client (si corresponde)
    // ---------------------------
    async function saveProfile() {
      try {
        saving.value = true;

        const userPayload: any = {
          name: draft.name,
          lastname: draft.lastname,
          phone: draft.phone,
          email: draft.email,
          username: draft.username,
          ...(draft.password ? { password: draft.password } : {}),
        };

        const id =
          userData.value?.userID ??
          userData.value?.id ??
          userData.value?.user?.id;
        if (!id)
          throw new Error("No se encontró el id de usuario para actualizar");

        const userRes = await api.put(`/users/edit/${id}`, userPayload);
        const updatedUser = userRes?.data || userPayload;
        userData.value = { ...(userData.value || {}), ...updatedUser };

        let updatedEntity: any = null;

        if (isPrestatario.value) {
          // preparar payload prestatario con camelCase
          const prestatarioPayload: any = {
            tipoCarga: draft.tipoCarga,
            contenedor: draft.contenedor,
            transportes: draft.transportes.map((t: any) => ({ ...t })),
            cargasEspeciales: [...draft.cargasEspeciales],
            rating: draft.rating,
            licencia: { ...draft.licencia },
            ayudantes: draft.ayudantes.map((h: any) => ({ ...h })),
            maxWeight: draft.maxWeight,
            maxVolume: draft.maxVolume,
            servicios: Array.isArray(draft.servicios)
              ? [...draft.servicios]
              : [],

            // ALQUILER camelCase
            serviciosPrestAlquiler: Array.isArray(draft.serviciosPrestAlquiler)
              ? [...draft.serviciosPrestAlquiler]
              : [],
            metrosDisponiblesAlquiler: draft.metrosDisponiblesAlquiler ?? null,
            alturaMAlquiler: draft.alturaMAlquiler ?? null,

            // TALLERES
            talleresNumTecnicos: draft.talleresNumTecnicos ?? null,
            talleresHorario: draft.talleresHorario || "",
            talleresServicios: Array.isArray(draft.talleresServicios)
              ? [...draft.talleresServicios]
              : [],
            talleresCapacidadVehiculos:
              draft.talleresCapacidadVehiculos ?? null,

            // GPS
            gpsProviders: Array.isArray(draft.gpsProviders)
              ? [...draft.gpsProviders]
              : [],
            gpsDevicesAvailable: draft.gpsDevicesAvailable ?? null,
            gpsPlans: draft.gpsPlans || "",
            gpsIntegrationApi: !!draft.gpsIntegrationApi,

            // ALOJAMIENTO
            habitacionesDisponibles: draft.habitacionesDisponibles ?? null,
            capacidadPersonas: draft.capacidadPersonas ?? null,
            precioNochePromedio: draft.precioNochePromedio ?? null,
            tipoHabitaciones: Array.isArray(draft.tipoHabitaciones)
              ? [...draft.tipoHabitaciones]
              : [],
            serviciosIncluidosAlojamiento: Array.isArray(
              draft.serviciosIncluidosAlojamiento,
            )
              ? [...draft.serviciosIncluidosAlojamiento]
              : [],

            // conditions
            conditions: draft.conditions,

            // user refs
            userId: id,
            user_id: id,
          };

          try {
            if (prestatario.value?.id) {
              const r = await api.put(
                `/prestatario/${prestatario.value.id}`,
                prestatarioPayload,
              );
              updatedEntity = r?.data || prestatarioPayload;
            }
          } catch (err) {
            console.error("Error al actualizar/crear prestatario:", err);
            throw err;
          }

          if (updatedEntity) {
            prestatario.value = updatedEntity;
            userData.value = {
              ...(userData.value || {}),
              prestatario: updatedEntity,
            };
          }
        } else if (isClient.value) {
          const clientPayload: any = {
            company: draft.company,
            contact_name: draft.contact_name,
            contact_phone: draft.contact_phone,
            tax_id: draft.tax_id,
            address: draft.address,
            userId: id,
            user_id: id,
          };

          try {
            if (clientData.value?.id) {
              const r = await api.put(
                `/cliente/${clientData.value.id}`,
                clientPayload,
              );
              updatedEntity = r?.data || clientPayload;
            }
          } catch (err) {
            console.error("Error al actualizar/crear client:", err);
            throw err;
          }

          if (updatedEntity) {
            clientData.value = updatedEntity;
            userData.value = {
              ...(userData.value || {}),
              client: updatedEntity,
            };
          }
        }

        cookies.set("userData", userData.value);

        await Swal.fire({
          text: "Perfil actualizado correctamente",
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "Ok",
          customClass: { confirmButton: "btn btn-primary" },
          heightAuto: false,
        });

        editing.value = false;
      } catch (err) {
        console.error("Error guardando perfil:", err);
        await Swal.fire({
          text:
            err?.response?.data?.message ||
            (err as Error).message ||
            "Error al guardar perfil",
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "Entendido",
          customClass: { confirmButton: "btn btn-primary" },
          heightAuto: false,
        });
      } finally {
        saving.value = false;
      }
    }

    function escapeHtml(unsafe: string) {
      return String(unsafe)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
    function renderConditions(raw?: string) {
      if (!raw) return "";
      const escaped = escapeHtml(raw || "");
      return escaped.replace(/\r\n|\r|\n/g, "<br/>");
    }

    return {
      userData,
      prestatario,
      clientData,
      draft,
      editing,
      saving,
      toggleEdit,
      addTransport,
      removeTransport,
      addAyudante,
      removeAyudante,
      cargaOptions,
      addCargaEspecial,
      removeCargaEspecial,
      newCargaEspecial,
      saveProfile,
      displayMaxWeight,
      displayMaxVolume,
      isPrestatario,
      isClient,
      roleLabel,
      viaOptions,
      alquilerServicesOptions,
      talleresOptions,
      gpsProvidersOptions,
      tiposHabitacionOptions,
      serviciosAlojOptions,
      capitalizeServiceLabel,
      renderConditions,
      hasAlquiler,
      hasTalleres,
      hasGPS,
      hasAlojamiento,
    };
  },
});
</script>

<style scoped>
/* pequeños ajustes si quieres */
/* ------------------------------------------------------------------
   Estilos nuevos para separar grupos y forzar texto blanco
   ------------------------------------------------------------------*/
.section-card {
  background: rgba(0, 0, 0, 0.2); /* sutil fondo para separar */
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 1rem;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.02) inset;
}

/* Forzar etiquetas/leyendas en blanco dentro del componente */
.card-body .form-label,
.card-body label,
.card-body .fw-semibold,
.card-body .small,
.card-body .text-muted,
.card-body .badge {
  color: #ffffff !important;
}

/* Badges: mantener fondo claro pero texto en blanco para visibilidad */
.card-body .badge.bg-light {
  background-color: rgba(255, 255, 255, 0.08) !important;
  color: #ffffff !important;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

/* Ajuste opcional: hacer placeholder/inputs legibles si usas fondo oscuro */
.card-body .form-control::placeholder {
  color: rgba(255, 255, 255, 0.55) !important;
}

/* Si quieres los títulos de secciones más destacados */
.section-card .section-header,
.section-card > h6,
.section-card > h5 {
  color: #ffffff;
  font-weight: 600;
}

/* Reducir opacidad de textos secundarios (sutil) */
.card-body .text-muted {
  opacity: 0.9;
}

.badge {
  font-size: 0.8rem;
  padding: 0.35rem 0.5rem;
}
</style>
