<!-- SignUp.vue (agrupado: secciones envueltas en tarjetas) -->
<<template>
  <div class="w-lg-700px p-10 mx-auto">
    <div class="text-center mb-8">
      <h1 class="title">Crear una cuenta</h1>
      <p class="subtitle">Regístrate como Cliente o Prestatario</p>
    </div>

    <form class="form w-100" @submit.prevent="onSubmit">
      <div class="row g-3">
        <!-- Basic info -->
        <div class="col-md-6">
          <label class="form-label">Nombre</label>
          <input
            v-model="formData.name"
            class="form-control form-control-solid"
          />
          <div class="text-danger fs-7 mt-1" v-if="errors.name">
            {{ errors.name }}
          </div>
        </div>

        <div class="col-md-6">
          <label class="form-label">Apellidos</label>
          <input
            v-model="formData.lastname"
            class="form-control form-control-solid"
          />
          <div class="text-danger fs-7 mt-1" v-if="errors.lastname">
            {{ errors.lastname }}
          </div>
        </div>

        <div class="col-md-6">
          <label class="form-label">Teléfono</label>
          <input
            v-model="formData.phone"
            class="form-control form-control-solid"
            placeholder="+56..."
          />
          <div class="text-danger fs-7 mt-1" v-if="errors.phone">
            {{ errors.phone }}
          </div>
        </div>

        <div class="col-md-6">
          <label class="form-label">Usuario</label>
          <input
            v-model="formData.username"
            class="form-control form-control-solid"
          />
          <div class="text-danger fs-7 mt-1" v-if="errors.username">
            {{ errors.username }}
          </div>
        </div>

        <div class="col-md-6">
          <label class="form-label">Email</label>
          <input
            v-model="formData.email"
            type="email"
            class="form-control form-control-solid"
          />
          <div class="text-danger fs-7 mt-1" v-if="errors.email">
            {{ errors.email }}
          </div>
        </div>

        <div class="col-md-6">
          <label class="form-label">Contraseña</label>
          <input
            v-model="formData.password"
            type="password"
            class="form-control form-control-solid"
          />
          <div class="text-danger fs-7 mt-1" v-if="errors.password">
            {{ errors.password }}
          </div>
        </div>

        <div class="col-12">
          <label class="form-label">Rol</label>
          <select v-model="formData.role" class="form-select form-select-solid">
            <option value="">Seleccione un rol</option>
            <option v-for="r in roles" :key="r.id" :value="r.id">
              {{ r.name }}
            </option>
          </select>
          <div class="text-danger fs-7 mt-1" v-if="errors.role">
            {{ errors.role }}
          </div>
        </div>

        <!-- Cliente block -->
        <div v-if="isCliente" class="col-12 section-card">
          <div class="section-header">Datos Cliente</div>

          <div class="mb-2">
            <label class="form-label">Empresa / Razón social</label>
            <input
              v-model="formData.company"
              class="form-control form-control-solid"
            />
            <div class="text-danger fs-7 mt-1" v-if="errors.company">
              {{ errors.company }}
            </div>
          </div>

          <div class="row g-2">
            <div class="col-6">
              <label class="form-label">Contacto</label>
              <input
                v-model="formData.contactName"
                class="form-control form-control-solid"
              />
            </div>
            <div class="col-6">
              <label class="form-label">Teléfono contacto</label>
              <input
                v-model="formData.contactPhone"
                class="form-control form-control-solid"
                placeholder="+56..."
              />
            </div>
          </div>

          <div class="mt-2">
            <label class="form-label">Documento (RUT / DNI)</label>
            <input
              v-model="formData.taxId"
              class="form-control form-control-solid"
            />
          </div>

          <div class="mt-2">
            <label class="form-label">Dirección</label>
            <input
              v-model="formData.address"
              class="form-control form-control-solid"
            />
          </div>

          <div class="mt-3">
            <label class="form-label">Modalidad</label>
            <select
              v-model="formData.modalidad"
              class="form-select form-select-solid"
            >
              <option value="">Seleccione modalidad</option>
              <option value="aerea">Aérea</option>
              <option value="terrestre">Terrestre</option>
            </select>
            <div class="text-danger fs-7 mt-1" v-if="errors.modalidad">
              {{ errors.modalidad }}
            </div>
          </div>
        </div>

        <!-- Prestatario block -->
        <div v-if="isPrestatario" class="col-12">
          <div class="section-header">Datos Prestatario</div>

          <!-- Licencia -->
          <div class="col-12 section-card">
            <div class="section-header small">Licencia operativa</div>
            <div class="mb-3">
              <label class="form-label">Número de licencia</label>
              <input
                v-model="formData.licencia.numero"
                class="form-control form-control-solid"
                placeholder="Ingrese el número de licencia operativa"
              />
              <div
                class="text-danger fs-7 mt-1"
                v-if="errors['licencia.numero']"
              >
                {{ errors["licencia.numero"] }}
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Breve descripción</label>
              <textarea
                v-model="formData.licencia.descripcion"
                class="form-control form-control-solid"
                rows="2"
                placeholder="Describa brevemente el tipo de licencia operativa..."
              ></textarea>
              <div class="text-muted fs-7 mt-1">Ej: Licencia para transporte de carga pesada nacional e internacional</div>
            </div>
            <div class="row g-2">
              <div class="col-4">
                <label class="form-label">Categoría</label>
                <input
                  v-model="formData.licencia.categoria"
                  class="form-control form-control-solid"
                  placeholder="Categoría"
                />
                <div
                  class="text-danger fs-7 mt-1"
                  v-if="errors['licencia.categoria']"
                >
                  {{ errors["licencia.categoria"] }}
                </div>
              </div>
              <div class="col-4">
                <label class="form-label">Fecha de vencimiento</label>
                <input
                  v-model="formData.licencia.vence"
                  type="date"
                  class="form-control form-control-solid"
                />
                <div
                  class="text-danger fs-7 mt-1"
                  v-if="errors['licencia.vence']"
                >
                  {{ errors["licencia.vence"] }}
                </div>
              </div>
            </div>
          </div>

          <!-- Tipo de carga card -->
          <div class="col-12 section-card">
            <label class="form-label">Tipo de carga</label>
            <select
              v-model="formData.tipoCarga"
              class="form-select form-select-solid"
            >
              <option value="">Seleccione</option>
              <option v-for="opt in cargaOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
            <div class="text-muted fs-7 mt-1" v-if="formData.tipoCarga">
              {{ cargaOptions.find(c => c.value === formData.tipoCarga)?.descripcion }}
            </div>
            <div class="text-danger fs-7 mt-1" v-if="errors.tipoCarga">
              {{ errors.tipoCarga }}
            </div>
          </div>

          <!-- Servicios (Vías) card -->
          <div class="col-12 section-card">
            <label class="form-label">Servicios (Vías)</label>
            <div class="d-flex flex-wrap gap-2 mt-2">
              <div
                v-for="opt in viaOptions"
                :key="opt.value"
                class="form-check via-check"
              >
                <input
                  class="form-check-input"
                  type="checkbox"
                  :id="'via-' + opt.value"
                  :value="opt.value"
                  v-model="formData.servicios"
                />
                <label class="form-check-label" :for="'via-' + opt.value">{{
                  opt.label
                }}</label>
              </div>
            </div>
            <div class="text-muted fs-7 mt-1">
              Seleccione una o varias. Ej: Aérea, Terrestre...
            </div>
            <div class="text-danger fs-7 mt-1" v-if="errors.servicios">
              {{ errors.servicios }}
            </div>
          </div>

          <!-- Transportes -->
          <div class="col-12 section-card">
            <label class="form-label">Transportes</label>
            <div
              v-if="formData.transportes.length === 0"
              class="text-muted mb-2"
            >
              - sin transportes -
            </div>
            <div
              v-for="(t, idx) in formData.transportes"
              :key="'t-' + idx"
              class="border rounded p-2 mb-2"
            >
              <div class="row g-2">
                <div class="col-5">
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
                <div class="col-2">
                  <select
                    v-model="t.tipoTransporte"
                    class="form-select form-select-solid"
                  >
                    <option value="">Tipo</option>
                    <option>Camión</option>
                    <option>Camioneta</option>
                    <option>Tráiler</option>
                    <option>Cama de camión</option>
                  </select>
                </div>
                <div class="col-1 d-flex">
                  <button
                    type="button"
                    class="btn btn-link text-danger"
                    @click="removeTransport(idx)"
                  >
                    X
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              class="btn btn-sm btn-success"
              @click="addTransport"
            >
              + Añadir transporte
            </button>
          </div>

          <!-- Precios Terrestre / Escatolina -->
          <div v-if="formData.servicios.includes('terrestre') || formData.servicios.includes('escatolina')" class="col-12 section-card">
            <div class="section-header small">Precios Servicio Terrestre/Escatolina</div>

            <div class="mb-3">
              <label class="form-label">Precio por contenedor (según origen-destino)</label>
              <div class="row g-2">
                <div class="col-md-4">
                  <input
                    type="text"
                    v-model="formData.precioOrigen"
                    class="form-control form-control-solid"
                    placeholder="Origen (ej: La Habana)"
                  />
                </div>
                <div class="col-md-4">
                  <input
                    type="text"
                    v-model="formData.precioDestino"
                    class="form-control form-control-solid"
                    placeholder="Destino (ej: Santiago)"
                  />
                </div>
                <div class="col-md-4">
                  <input
                    type="number"
                    v-model.number="formData.precioTerrestrePorCargaContenedor"
                    min="0"
                    step="0.01"
                    class="form-control form-control-solid"
                    placeholder="Precio (ej: 80000)"
                  />
                </div>
              </div>
              <div class="text-muted fs-7 mt-1">Especifique la ruta y el precio para contenedores</div>
            </div>

            <div class="row g-2">
              <div class="col-md-6">
                <label class="form-label">Precio por km</label>
                <input
                  type="number"
                  v-model.number="formData.precioTerrestrePorKm"
                  min="0"
                  step="0.01"
                  class="form-control form-control-solid"
                  placeholder="Ej: 1500"
                />
                <div class="text-muted fs-7 mt-1">Por kilómetro recorrido</div>
              </div>
              <div class="col-md-6">
                <label class="form-label">Precio carga general</label>
                <input
                  type="number"
                  v-model.number="formData.precioTerrestrePorCargaGeneral"
                  min="0"
                  step="0.01"
                  class="form-control form-control-solid"
                  placeholder="Ej: 50000"
                />
                <div class="text-muted fs-7 mt-1">Por carga general</div>
              </div>
            </div>
          </div>

          <!-- Contenedor / Max Weight / Max Volume card -->
          <div class="col-12 section-card">
            <div class="row g-2">
              <div class="col-4">
                <label class="form-label">Contenedor</label>
                <select
                  v-model="formData.contenedor"
                  class="form-select form-select-solid"
                >
                  <option value="">Seleccione</option>
                  <option value="20">20 pies</option>
                  <option value="40">40 pies</option>
                </select>
                <div class="text-danger fs-7 mt-1" v-if="errors.contenedor">
                  {{ errors.contenedor }}
                </div>
              </div>

              <div class="col-4">
                <label class="form-label">Peso máximo (kg)</label>
                <input
                  type="number"
                  v-model.number="formData.maxWeight"
                  class="form-control form-control-solid"
                  min="0"
                />
                <div class="text-muted fs-7 mt-1">Capacidad de peso del contenedor</div>
              </div>

              <div class="col-4">
                <label class="form-label">Volumen máximo (m³)</label>
                <input
                  type="number"
                  v-model.number="formData.maxVolume"
                  class="form-control form-control-solid"
                  min="0"
                  step="0.01"
                />
                <div class="text-danger fs-7 mt-1" v-if="errors.maxVolume">
                  {{ errors.maxVolume }}
                </div>
              </div>
            </div>
          </div>

          <!-- Opciones (Alquiler/Talleres/GPS/Alojamiento) card (checkboxes list) -->
          <div class="col-12 section-card">
            <div class="form-check mb-2">
              <input
                id="providesAlquiler"
                class="form-check-input"
                type="checkbox"
                v-model="formData.providesAlquiler"
              />
              <label class="form-check-label" for="providesAlquiler"
                >Prestas servicios de Alquiler de almacenes</label
              >
            </div>

            <div class="form-check mb-2">
              <input
                id="providesTalleres"
                class="form-check-input"
                type="checkbox"
                v-model="formData.providesTalleres"
              />
              <label class="form-check-label" for="providesTalleres"
                >Prestas servicios de Talleres</label
              >
            </div>

            <div class="form-check mb-2">
              <input
                id="providesGPS"
                class="form-check-input"
                type="checkbox"
                v-model="formData.providesGPS"
              />
              <label class="form-check-label" for="providesGPS"
                >Prestas servicios de GPS</label
              >
            </div>

            <div class="form-check mb-2">
              <input
                id="providesAlojamiento"
                class="form-check-input"
                type="checkbox"
                v-model="formData.providesAlojamiento"
              />
              <label class="form-check-label" for="providesAlojamiento"
                >Prestas servicios de Alojamiento</label
              >
            </div>
          </div>

          <!-- Alquiler details -->
          <div v-if="formData.providesAlquiler" class="col-12 section-card">
            <div class="section-header small">Alquiler de almacenes</div>

            <div class="row g-2">
              <div class="col-md-6">
                <label class="form-label">Metros disponibles (m²)</label>
                <input
                  type="number"
                  v-model.number="formData.metrosDisponiblesAlquiler"
                  min="0"
                  step="0.1"
                  class="form-control form-control-solid"
                />
                <div
                  class="text-danger fs-7 mt-1"
                  v-if="errors.metrosDisponiblesAlquiler"
                >
                  {{ errors.metrosDisponiblesAlquiler }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Altura máxima (m)</label>
                <input
                  type="number"
                  v-model.number="formData.alturaMAlquiler"
                  min="0"
                  step="0.01"
                  class="form-control form-control-solid"
                />
                <div
                  class="text-danger fs-7 mt-1"
                  v-if="errors.alturaMAlquiler"
                >
                  {{ errors.alturaMAlquiler }}
                </div>
              </div>
            </div>

            <div class="mt-3">
              <label class="form-label">Servicios de alquiler</label>
              <div class="d-flex flex-wrap gap-2 mt-2 checkbox-grid">
                <div
                  v-for="opt in alquilerOptions"
                  :key="'alq-chk-' + opt.value"
                  class="form-check"
                >
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :id="'alq-' + opt.value"
                    :value="opt.value"
                    v-model="formData.serviciosPrestAlquiler"
                  />
                  <label
                    class="form-check-label text-white"
                    :for="'alq-' + opt.value"
                  >
                    {{ opt.label }}
                  </label>
                </div>
              </div>
              <div class="text-muted fs-7 mt-1">
                Seleccione los servicios que ofrece para alquiler (opcional).
              </div>
              <div
                class="text-danger fs-7 mt-1"
                v-if="errors.serviciosPrestAlquiler"
              >
                {{ errors.serviciosPrestAlquiler }}
              </div>
            </div>
          </div>

          <!-- Talleres details -->
          <div v-if="formData.providesTalleres" class="col-12 section-card">
            <div class="section-header small">Talleres</div>

            <div class="row g-2">
              <div class="col-md-4">
                <label class="form-label">Técnicos disponibles</label>
                <input
                  type="number"
                  v-model.number="formData.talleresNumTecnicos"
                  min="0"
                  class="form-control form-control-solid"
                />
                <div
                  class="text-danger fs-7 mt-1"
                  v-if="errors.talleresNumTecnicos"
                >
                  {{ errors.talleresNumTecnicos }}
                </div>
              </div>

              <div class="col-md-8">
                <label class="form-label">Horario / Observaciones</label>
                <input
                  v-model="formData.talleresHorario"
                  class="form-control form-control-solid"
                  placeholder="Ej: Lun-Vie 08:00-18:00"
                />
              </div>
            </div>

            <div class="mt-2">
              <label class="form-label">Dirección del taller</label>
              <input
                v-model="formData.talleresDireccion"
                class="form-control form-control-solid"
                placeholder="Dirección completa del taller"
              />
            </div>

            <div class="mt-2">
              <label class="form-label">Servicios ofrecidos y precios</label>
              <div class="d-flex flex-wrap gap-2 mt-2 checkbox-grid">
                <div
                  v-for="opt in talleresOptions"
                  :key="'taller-chk-' + opt.value"
                  class="form-check align-items-center"
                >
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :id="'taller-' + opt.value"
                    :value="opt.value"
                    v-model="formData.talleresServicios"
                  />
                  <label
                    class="form-check-label text-white me-2"
                    :for="'taller-' + opt.value"
                  >
                    {{ opt.label }}
                  </label>
                  <input
                    v-if="formData.talleresServicios.includes(opt.value)"
                    type="number"
                    min="0"
                    step="0.01"
                    class="form-control form-control-solid form-control-sm"
                    style="width: 100px; display: inline-block;"
                    v-model.number="formData.talleresPrecios[opt.value]"
                    placeholder="Precio"
                  />
                </div>
              </div>
              <div
                class="text-danger fs-7 mt-1"
                v-if="errors.talleresServicios"
              >
                {{ errors.talleresServicios }}
              </div>
            </div>

            <div class="mt-2">
              <label class="form-label">Capacidad vehículos simultáneos</label>
              <input
                type="number"
                v-model.number="formData.talleresCapacidadVehiculos"
                min="0"
                class="form-control form-control-solid"
              />
            </div>

            <!-- Servicios Complementarios - Reserva -->
            <div class="mt-3 border rounded p-3">
              <label class="form-label fw-semibold">Servicios Complementarios</label>
              <div class="form-check mb-2">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="talleresReservaCitas"
                  v-model="formData.talleresReservaCitas"
                />
                <label class="form-check-label" for="talleresReservaCitas">
                  Permitir reserva de citas
                </label>
              </div>

              <div v-if="formData.talleresReservaCitas" class="mt-2">
                <div class="row g-2">
                  <div class="col-md-6">
                    <label class="form-label">Horario inicio</label>
                    <input
                      type="time"
                      v-model="formData.talleresHorarioInicio"
                      class="form-control form-control-solid"
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Horario fin</label>
                    <input
                      type="time"
                      v-model="formData.talleresHorarioFin"
                      class="form-control form-control-solid"
                    />
                  </div>
                </div>
                <div class="mt-2">
                  <label class="form-label">Días disponibles</label>
                  <div class="d-flex flex-wrap gap-2">
                    <label class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="lunes"
                        v-model="formData.talleresDiasDisponibles"
                      />
                      <span class="form-check-label">Lunes</span>
                    </label>
                    <label class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="martes"
                        v-model="formData.talleresDiasDisponibles"
                      />
                      <span class="form-check-label">Martes</span>
                    </label>
                    <label class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="miercoles"
                        v-model="formData.talleresDiasDisponibles"
                      />
                      <span class="form-check-label">Miércoles</span>
                    </label>
                    <label class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="jueves"
                        v-model="formData.talleresDiasDisponibles"
                      />
                      <span class="form-check-label">Jueves</span>
                    </label>
                    <label class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="viernes"
                        v-model="formData.talleresDiasDisponibles"
                      />
                      <span class="form-check-label">Viernes</span>
                    </label>
                    <label class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="sabado"
                        v-model="formData.talleresDiasDisponibles"
                      />
                      <span class="form-check-label">Sábado</span>
                    </label>
                    <label class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="domingo"
                        v-model="formData.talleresDiasDisponibles"
                      />
                      <span class="form-check-label">Domingo</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- GPS details -->
          <div v-if="formData.providesGPS" class="col-12 section-card">
            <div class="section-header small">GPS</div>

            <div class="row g-2">
              <div class="col-md-6">
                <label class="form-label">Proveedores</label>
                <div class="d-flex flex-wrap gap-2 mt-2 checkbox-grid">
                  <div
                    v-for="opt in gpsProvidersOptions"
                    :key="'gps-chk-' + opt.value"
                    class="form-check"
                  >
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :id="'gps-' + opt.value"
                      :value="opt.value"
                      v-model="formData.gpsProviders"
                    />
                    <label
                      class="form-check-label text-white"
                      :for="'gps-' + opt.value"
                    >
                      {{ opt.label }}
                    </label>
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Dispositivos disponibles</label>
                <input
                  type="number"
                  v-model.number="formData.gpsDevicesAvailable"
                  min="0"
                  class="form-control form-control-solid"
                />
                <div
                  class="text-danger fs-7 mt-1"
                  v-if="errors.gpsDevicesAvailable"
                >
                  {{ errors.gpsDevicesAvailable }}
                </div>
              </div>
            </div>

            <div class="mt-2">
              <label class="form-label">Planes / características</label>
              <input
                v-model="formData.gpsPlans"
                class="form-control form-control-solid"
                placeholder="Ej: rastreo en tiempo real, historial 90d"
              />
            </div>

            <div class="mt-2 form-check">
              <input
                id="gps_integration"
                type="checkbox"
                class="form-check-input"
                v-model="formData.gpsIntegrationApi"
              />
              <label class="form-check-label" for="gps_integration"
                >Ofrece integración API / Webhooks</label
              >
            </div>
          </div>

          <!-- Alojamiento details -->
          <div v-if="formData.providesAlojamiento" class="col-12 section-card">
            <div class="section-header small">Alojamiento</div>

            <div class="row g-2">
              <div class="col-md-4">
                <label class="form-label">Habitaciones disponibles</label>
                <input
                  type="number"
                  v-model.number="formData.habitacionesDisponibles"
                  min="0"
                  class="form-control form-control-solid"
                />
                <div
                  class="text-danger fs-7 mt-1"
                  v-if="errors.habitacionesDisponibles"
                >
                  {{ errors.habitacionesDisponibles }}
                </div>
              </div>

              <div class="col-md-4">
                <label class="form-label">Capacidad total (personas)</label>
                <input
                  type="number"
                  v-model.number="formData.capacidadPersonas"
                  min="0"
                  class="form-control form-control-solid"
                />
              </div>

              <div class="col-md-4">
                <label class="form-label">Precio noche promedio</label>
                <input
                  type="number"
                  v-model.number="formData.precioNochePromedio"
                  min="0"
                  step="0.01"
                  class="form-control form-control-solid"
                />
              </div>
            </div>

            <div class="mt-2">
              <label class="form-label">Tipos de habitaciones</label>
              <div class="d-flex flex-wrap gap-2 mt-2 checkbox-grid">
                <div
                  v-for="opt in tiposHabitacionOptions"
                  :key="'habit-chk-' + opt.value"
                  class="form-check"
                >
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :id="'habit-' + opt.value"
                    :value="opt.value"
                    v-model="formData.tipoHabitaciones"
                  />
                  <label
                    class="form-check-label text-white"
                    :for="'habit-' + opt.value"
                  >
                    {{ opt.label }}
                  </label>
                </div>
              </div>
            </div>

            <div class="mt-2">
              <label class="form-label">Servicios incluidos</label>
              <div class="d-flex flex-wrap gap-2 mt-2 checkbox-grid">
                <div
                  v-for="opt in serviciosAlojOptions"
                  :key="'serv-aloj-chk-' + opt.value"
                  class="form-check"
                >
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :id="'serv-aloj-' + opt.value"
                    :value="opt.value"
                    v-model="formData.serviciosIncluidosAlojamiento"
                  />
                  <label
                    class="form-check-label text-white"
                    :for="'serv-aloj-' + opt.value"
                  >
                    {{ opt.label }}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Cargas especiales card -->
          <div class="col-12 section-card">
            <label class="form-label">Cargas especiales</label>

            <div
              v-for="(c, i) in formData.cargasEspeciales"
              :key="'ce-' + i"
              class="input-group mb-2"
            >
              <input
                v-model="formData.cargasEspeciales[i]"
                class="form-control form-control-solid"
              />
              <button
                type="button"
                class="btn btn-outline-danger"
                @click="removeCargaEspecial(i)"
              >
                Eliminar
              </button>
            </div>

            <div class="d-flex gap-2 mb-2">
              <input
                v-model="newCargaEspecial"
                class="form-control form-control-solid"
                placeholder="Nueva carga especial"
              />
              <button
                type="button"
                class="btn btn-success"
                @click="addCargaEspecial"
              >
                Agregar
              </button>
            </div>
            <div class="text-danger fs-7" v-if="errors.cargasEspeciales">
              {{ errors.cargasEspeciales }}
            </div>
          </div>

          <!-- Rating card -->
          <div class="col-12 section-card">
            <label class="form-label">
              Rating de compañía
            </label>

            <div class="rating-card p-4 rounded border">

              <!-- Estrellas -->
              <div class="d-flex align-items-center mb-3">

                <i
                  v-for="star in 5"
                  :key="star"
                  class="bi fs-1 me-2 rating-star"
                  :class="
                    star <= Math.floor(formData.rating || 0)
                      ? 'bi-star-fill text-warning'
                      : star === Math.ceil(formData.rating || 0) &&
                        ((formData.rating || 0) % 1) >= 0.5
                      ? 'bi-star-half text-warning'
                      : 'bi-star text-muted'
                  "
                  @click="formData.rating = star"
                />

                <div class="ms-3">

                  <div class="fw-bold fs-3">
                    {{ Number(formData.rating || 0).toFixed(1) }}
                  </div>

                  <div class="text-muted fs-7">
                    {{
                      (formData.rating || 0) >= 4.5
                        ? "Excelente"
                        : (formData.rating || 0) >= 4
                        ? "Muy bueno"
                        : (formData.rating || 0) >= 3
                        ? "Bueno"
                        : (formData.rating || 0) >= 2
                        ? "Regular"
                        : (formData.rating || 0) >= 1
                        ? "Deficiente"
                        : "Sin valoración"
                    }}
                  </div>

                </div>

              </div>

              <!-- Campo oculto para mantener binding -->
              <input
                type="hidden"
                v-model="formData.rating"
              />

              <!-- Hint -->
              <transition name="fade-up">
                <div class="rating-hint">
                  <i class="bi bi-stars"></i>

                  Puede utilizar valoraciones exactas como
                  <strong>3.5</strong>,
                  <strong>4.2</strong> o
                  <strong>4.8</strong>.
                </div>
              </transition>

              <div
                class="text-danger fs-7 mt-3"
                v-if="errors.rating"
              >
                {{ errors.rating }}
              </div>

            </div>
          </div>

          <!-- Ayudantes -->
          <div class="col-12 section-card">
            <label class="form-label">Ayudantes</label>
            <div
              v-for="(h, i) in formData.ayudantes"
              :key="'h-' + i"
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
              <input
                v-model="h.direccion"
                class="form-control form-control-solid"
                placeholder="Dirección"
              />
              <button
                type="button"
                class="btn btn-outline-danger"
                @click="removeAyudante(i)"
              >
                Eliminar
              </button>
            </div>
            <button
              type="button"
              class="btn btn-sm btn-success"
              @click="addAyudante"
            >
              + Añadir ayudante
            </button>
            <div class="text-danger fs-7 mt-1" v-if="errors.ayudantes">
              {{ errors.ayudantes }}
            </div>
          </div>

          <!-- Transportes (duplicado para eliminar) -->
          <div class="col-12 section-card d-none">
            <label class="form-label">Transportes</label>
            <div
              v-if="formData.transportes.length === 0"
              class="text-muted mb-2"
            >
              - sin transportes -
            </div>
            <div
              v-for="(t, idx) in formData.transportes"
              :key="'t-' + idx"
              class="border rounded p-2 mb-2"
            >
              <div class="row g-2">
                <div class="col-5">
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
                <div class="col-2">
                  <select
                    v-model="t.tipoTransporte"
                    class="form-select form-select-solid"
                  >
                    <option value="">Tipo</option>
                    <option>Camión</option>
                    <option>Camioneta</option>
                    <option>Tráiler</option>
                  </select>
                </div>
                <div class="col-1 d-flex">
                  <button
                    type="button"
                    class="btn btn-link text-danger"
                    @click="removeTransport(idx)"
                  >
                    X
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              class="btn btn-sm btn-success"
              @click="addTransport"
            >
              + Añadir transporte
            </button>
          </div>
        </div>

        <!-- submit -->
        <div class="col-12 text-center mt-4">
          <button
            :data-kt-indicator="loading ? 'on' : null"
            class="btn btn-lg btn-primary w-100"
            type="submit"
          >
            <span v-if="!loading">Crear cuenta</span>
            <span v-else
              >Procesando...
              <span
                class="spinner-border spinner-border-sm align-middle ms-2"
              ></span
            ></span>
          </button>
        </div>
      </div>
    </form>

    <div class="col-12 text-center mt-5">
      <small class="text-muted">
        ¿Ya tienes una cuenta?
        <router-link :to="{ name: 'sign-in' }" class="ms-1 fw-bold text-primary"
          >Iniciar sesión</router-link
        >
      </small>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted, computed } from "vue";
import * as yup from "yup";
import type { ValidationError } from "yup";
import Swal from "sweetalert2/dist/sweetalert2.js";
import api from "@/services/api";
import { useRouter } from "vue-router";

type Transporte = {
  nombreChofer: string;
  chapa: string;
  tipoTransporte: string;
};
type Ayudante = { nombre: string; apellidos: string; ci: string; direccion?: string };

export default defineComponent({
  name: "sign-up",
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const roles = ref<any[]>([]);

    const cargaOptions = [
      { value: "seco", label: "Seco", descripcion: "Carga seca convencional sin requerimientos especiales" },
      { value: "refrigerado", label: "Refrigerado", descripcion: "Carga que requiere temperatura controlada" },
      { value: "carga_general", label: "Carga general", descripcion: "Carga estándar sin clasificación especial" },
      { value: "cama_camion", label: "Cama de camión", descripcion: "Carga transportada en plataforma abierta de camión" }
    ];
    const viaOptions = [
      { value: "aerea", label: "Aérea" },
      { value: "terrestre", label: "Terrestre" },
      { value: "escatolina", label: "Escatolina" },
    ];

    const alquilerOptions = [
      { value: "pick_and_pack", label: "Pick and Pack" },
      { value: "etiquetado", label: "Etiquetado" },
      { value: "inspeccion", label: "Inspección" },
      { value: "control_de_calidad", label: "Control de calidad" },
      { value: "preparacion_de_pedidos", label: "Preparación de pedidos" },
      { value: "transporte", label: "Transporte" },
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
      { value: "parking", label: "Parqueo" },
      { value: "lavanderia", label: "Lavandería" },
    ];

    const formData = reactive<any>({
      name: "",
      lastname: "",
      phone: "",
      username: "",
      email: "",
      password: "",
      role: "",
      transportes: [] as Transporte[],
      tipoCarga: "",
      contenedor: "",
      maxWeight: null,
      maxVolume: null,
      cargasEspeciales: [] as string[],
      rating: null,
      licencia: { numero: "", categoria: "", vence: "", descripcion: "" },
      ayudantes: [] as Ayudante[],
      servicios: [] as string[],
      precioTerrestrePorKm: null as number | null,
      precioTerrestrePorCargaContenedor: null as number | null,
      precioTerrestrePorCargaGeneral: null as number | null,
      precioOrigen: "",
      precioDestino: "",

      company: "",
      contactName: "",
      contactPhone: "",
      taxId: "",
      address: "",
      modalidad: "",

      providesAlquiler: false,
      metrosDisponiblesAlquiler: null,
      alturaMAlquiler: null,
      serviciosPrestAlquiler: [] as string[],

      providesTalleres: false,
      talleresNumTecnicos: null,
      talleresHorario: "",
      talleresServicios: [] as string[],
      talleresCapacidadVehiculos: null,
      talleresDireccion: "",
      talleresPrecios: {} as Record<string, number>,
      talleresReservaCitas: false,
      talleresHorarioInicio: "",
      talleresHorarioFin: "",
      talleresDiasDisponibles: [] as string[],

      providesGPS: false,
      gpsProviders: [] as string[],
      gpsDevicesAvailable: null,
      gpsPlans: "",
      gpsIntegrationApi: false,

      providesAlojamiento: false,
      habitacionesDisponibles: null,
      capacidadPersonas: null,
      precioNochePromedio: null,
      tipoHabitaciones: [] as string[],
      serviciosIncluidosAlojamiento: [] as string[],
    });

    const newCargaEspecial = ref("");
    const errors = reactive<Record<string, string>>({});

    function mapYupErrors(err: ValidationError) {
      if (err?.inner && err.inner.length) {
        err.inner.forEach((e) => {
          if (e.path) errors[e.path] = e.message;
        });
      } else if ((err as any).path) {
        errors[(err as any).path] = (err as any).message;
      }
    }

    const baseSchema = yup.object({
      name: yup.string().required("El nombre es obligatorio"),
      lastname: yup.string().required("El apellido es obligatorio"),
      phone: yup
        .string()
        .required("El teléfono es obligatorio")
        .matches(
          /^\+\d{7,15}$/,
          "Formato inválido, debe incluir + y código de país",
        ),
      username: yup.string().required("El usuario es obligatorio"),
      email: yup
        .string()
        .email("Email inválido")
        .required("El email es obligatorio"),
      password: yup
        .string()
        .required("La contraseña es obligatoria")
        .min(8, "Mínimo 8 caracteres")
        .matches(/[A-Z]/, "Debe incluir una mayúscula")
        .matches(/[a-z]/, "Debe incluir una minúscula")
        .matches(/\d/, "Debe incluir un número")
        .matches(/[\W_]/, "Debe incluir un símbolo"),
      role: yup.string().required("El rol es obligatorio"),
    });

    const prestatarioSchema = yup.object({
      transportes: yup.array().of(
        yup.object({
          nombreChofer: yup.string().required("Nombre del chófer obligatorio"),
          chapa: yup.string().required("Chapa obligatoria"),
          tipoTransporte: yup
            .string()
            .required("Tipo de transporte obligatorio"),
        }),
      ),
      tipoCarga: yup.string().required("Tipo de carga es obligatorio"),
      contenedor: yup
        .string()
        .oneOf(["20", "40"], "Contenedor inválido")
        .required("Contenedor es obligatorio"),
      maxWeight: yup.number().nullable().min(0, "Max weight debe ser >= 0"),
      maxVolume: yup.number().nullable().min(0, "Max volume debe ser >= 0"),
      cargasEspeciales: yup.array().of(yup.string()).nullable(),
      rating: yup
        .number()
        .nullable()
        .min(0, "Rating mínimo 0")
        .max(5, "Rating máximo 5"),
      licencia: yup.object({
        numero: yup.string().required("Número de licencia es obligatorio"),
        categoria: yup.string().required("Categoría es obligatoria"),
        vence: yup.string().required("Fecha de vencimiento es obligatoria"),
      }),
      ayudantes: yup.array().of(
        yup.object({
          nombre: yup.string().required("Nombre del ayudante obligatorio"),
          apellidos: yup.string().required("Apellidos obligatorios"),
          ci: yup.string().required("CI obligatorio"),
          direccion: yup.string().optional(),
        }),
      ),
      servicios: yup.array().min(1, "Seleccione al menos un servicio"),

      providesAlquiler: yup.boolean(),
      metrosDisponiblesAlquiler: yup
        .number()
        .nullable()
        .when("providesAlquiler", {
          is: true,
          then: (schema) =>
            schema
              .required("Indica metros disponibles")
              .min(0.1, "Debe ser mayor que 0"),
          otherwise: (schema) => schema.nullable(),
        }),
      alturaMAlquiler: yup
        .number()
        .nullable()
        .when("providesAlquiler", {
          is: true,
          then: (schema) =>
            schema.required("Indica altura mínima").min(0, "Altura >= 0"),
          otherwise: (schema) => schema.nullable(),
        }),
      serviciosPrestAlquiler: yup
        .array()
        .of(yup.string())
        .when("providesAlquiler", {
          is: true,
          then: (schema) =>
            schema.min(1, "Seleccione al menos un servicio de alquiler"),
          otherwise: (schema) => schema.nullable(),
        }),

      providesTalleres: yup.boolean(),
      talleresNumTecnicos: yup
        .number()
        .nullable()
        .when("providesTalleres", {
          is: true,
          then: (schema) => schema.required("Indica número de técnicos").min(0),
          otherwise: (schema) => schema.nullable(),
        }),
      talleresServicios: yup
        .array()
        .of(yup.string())
        .when("providesTalleres", {
          is: true,
          then: (schema) =>
            schema.min(1, "Seleccione al menos un servicio de taller"),
          otherwise: (schema) => schema.nullable(),
        }),
      talleresCapacidadVehiculos: yup
        .number()
        .nullable()
        .when("providesTalleres", {
          is: true,
          then: (schema) => schema.min(0),
          otherwise: (schema) => schema.nullable(),
        }),

      providesGPS: yup.boolean(),
      gpsDevicesAvailable: yup
        .number()
        .nullable()
        .when("providesGPS", {
          is: true,
          then: (schema) =>
            schema.required("Indica cantidad de dispositivos").min(0),
          otherwise: (schema) => schema.nullable(),
        }),

      providesAlojamiento: yup.boolean(),
      habitacionesDisponibles: yup
        .number()
        .nullable()
        .when("providesAlojamiento", {
          is: true,
          then: (schema) =>
            schema.required("Indica habitaciones disponibles").min(0),
          otherwise: (schema) => schema.nullable(),
        }),
      precioNochePromedio: yup
        .number()
        .nullable()
        .when("providesAlojamiento", {
          is: true,
          then: (schema) => schema.required("Indica precio promedio").min(0),
          otherwise: (schema) => schema.nullable(),
        }),
    });

    const clienteSchema = yup.object({
      company: yup.string().optional(),
      contactName: yup.string().optional(),
      contactPhone: yup
        .string()
        .optional()
        .matches(/^\+\d{7,15}$/, "Formato inválido")
        .nullable(),
      taxId: yup.string().optional(),
      address: yup.string().optional(),
      modalidad: yup.string().optional(),
    });

    const fetchRoles = async () => {
      try {
        const res = await api.get("/roles");
        roles.value = (res.data || []).filter((r: any) => {
          const n = String(r.name).toLowerCase();
          return n.includes("cliente") || n.includes("prestatario");
        });

        if (!roles.value.length) {
          roles.value = [
            { id: "cliente", name: "Cliente" },
            { id: "prestatario", name: "Prestatario" },
          ];
        }
      } catch (e) {
        console.error("No se pudieron cargar roles, usando fallback", e);
        roles.value = [
          { id: "cliente", name: "Cliente" },
          { id: "prestatario", name: "Prestatario" },
        ];
      }
    };

    onMounted(fetchRoles);

    const isPrestatario = computed(() => {
      const r = roles.value.find(
        (x: any) =>
          x.id === formData.role ||
          String(x.id) === String(formData.role) ||
          String(x.name).toLowerCase() === String(formData.role).toLowerCase(),
      );
      if (r && r.name) return String(r.name).toLowerCase() === "prestatario";
      return String(formData.role).toLowerCase() === "prestatario";
    });

    const isCliente = computed(() => {
      const r = roles.value.find(
        (x: any) =>
          x.id === formData.role ||
          String(x.id) === String(formData.role) ||
          String(x.name).toLowerCase() === String(formData.role).toLowerCase(),
      );
      if (r && r.name) return String(r.name).toLowerCase() === "cliente";
      return String(formData.role).toLowerCase() === "cliente";
    });

    function addTransport() {
      formData.transportes.push({
        nombreChofer: "",
        chapa: "",
        tipoTransporte: "",
      });
    }
    function removeTransport(i: number) {
      formData.transportes.splice(i, 1);
    }

    function addAyudante() {
      formData.ayudantes.push({ nombre: "", apellidos: "", ci: "", direccion: "" });
    }
    function removeAyudante(i: number) {
      formData.ayudantes.splice(i, 1);
    }

    function addCargaEspecial() {
      const v = newCargaEspecial.value && newCargaEspecial.value.trim();
      if (!v) return;
      formData.cargasEspeciales.push(v);
      newCargaEspecial.value = "";
    }
    function removeCargaEspecial(i: number) {
      formData.cargasEspeciales.splice(i, 1);
    }

    async function onSubmit() {
      Object.keys(errors).forEach((k) => delete errors[k]);

      try {
        await baseSchema.validate(formData, { abortEarly: false });
      } catch (err) {
        mapYupErrors(err as ValidationError);
        return;
      }

      if (isPrestatario.value) {
        try {
          await prestatarioSchema.validate(formData as any, {
            abortEarly: false,
          });
        } catch (err) {
          mapYupErrors(err as ValidationError);
          return;
        }
      }

      if (isCliente.value) {
        try {
          await clienteSchema.validate(formData as any, { abortEarly: false });
        } catch (err) {
          mapYupErrors(err as ValidationError);
          return;
        }
      }

      loading.value = true;
      Swal.fire({
        title: "Creando usuario...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        showConfirmButton: false,
      });

      try {
        const payload: any = {
          name: formData.name,
          lastname: formData.lastname,
          phone: formData.phone,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        };

        if (isPrestatario.value) {
          payload.transportes = formData.transportes;
          payload.tipoCarga = formData.tipoCarga;
          payload.contenedor = formData.contenedor;
          payload.maxWeight = formData.maxWeight;
          payload.maxVolume = formData.maxVolume;
          payload.cargasEspeciales = formData.cargasEspeciales;
          payload.rating = formData.rating;
          payload.licencia = formData.licencia;
          payload.ayudantes = formData.ayudantes;
          payload.servicios = formData.servicios;

          payload.providesAlquiler = !!formData.providesAlquiler;
          if (formData.providesAlquiler) {
            payload.metrosDisponiblesAlquiler =
              formData.metrosDisponiblesAlquiler ?? null;
            payload.alturaMAlquiler = formData.alturaMAlquiler ?? null;
            payload.serviciosPrestAlquiler = Array.isArray(
              formData.serviciosPrestAlquiler,
            )
              ? formData.serviciosPrestAlquiler
              : formData.serviciosPrestAlquiler
                ? [formData.serviciosPrestAlquiler]
                : [];
          } else {
            payload.metrosDisponiblesAlquiler = null;
            payload.alturaMAlquiler = null;
            payload.serviciosPrestAlquiler = [];
          }

          payload.providesTalleres = !!formData.providesTalleres;
          if (formData.providesTalleres) {
            payload.talleresNumTecnicos = formData.talleresNumTecnicos ?? null;
            payload.talleresHorario = formData.talleresHorario || "";
            payload.talleresServicios = Array.isArray(
              formData.talleresServicios,
            )
              ? formData.talleresServicios
              : formData.talleresServicios
                ? [formData.talleresServicios]
                : [];
            payload.talleresCapacidadVehiculos =
              formData.talleresCapacidadVehiculos ?? null;
          } else {
            payload.talleresNumTecnicos = null;
            payload.talleresHorario = "";
            payload.talleresServicios = [];
            payload.talleresCapacidadVehiculos = null;
          }

          payload.providesGPS = !!formData.providesGPS;
          if (formData.providesGPS) {
            payload.gpsProviders = Array.isArray(formData.gpsProviders)
              ? formData.gpsProviders
              : formData.gpsProviders
                ? [formData.gpsProviders]
                : [];
            payload.gpsDevicesAvailable = formData.gpsDevicesAvailable ?? null;
            payload.gpsPlans = formData.gpsPlans || "";
            payload.gpsIntegrationApi = !!formData.gpsIntegrationApi;
          } else {
            payload.gpsProviders = [];
            payload.gpsDevicesAvailable = null;
            payload.gpsPlans = "";
            payload.gpsIntegrationApi = false;
          }

          payload.providesAlojamiento = !!formData.providesAlojamiento;
          if (formData.providesAlojamiento) {
            payload.habitacionesDisponibles =
              formData.habitacionesDisponibles ?? null;
            payload.capacidadPersonas = formData.capacidadPersonas ?? null;
            payload.precioNochePromedio = formData.precioNochePromedio ?? null;
            payload.tipoHabitaciones = Array.isArray(formData.tipoHabitaciones)
              ? formData.tipoHabitaciones
              : formData.tipoHabitaciones
                ? [formData.tipoHabitaciones]
                : [];
            payload.serviciosIncluidosAlojamiento = Array.isArray(
              formData.serviciosIncluidosAlojamiento,
            )
              ? formData.serviciosIncluidosAlojamiento
              : formData.serviciosIncluidosAlojamiento
                ? [formData.serviciosIncluidosAlojamiento]
                : [];
          } else {
            payload.habitacionesDisponibles = null;
            payload.capacidadPersonas = null;
            payload.precioNochePromedio = null;
            payload.tipoHabitaciones = [];
            payload.serviciosIncluidosAlojamiento = [];
          }

          // precios terrestre
          if (formData.servicios.includes('terrestre')) {
            if (formData.precioTerrestrePorKm != null)
              payload.precioTerrestrePorKm = formData.precioTerrestrePorKm;
            if (formData.precioTerrestrePorCargaContenedor != null) {
              payload.precioTerrestrePorCargaContenedor = formData.precioTerrestrePorCargaContenedor;
              payload.precioOrigen = formData.precioOrigen;
              payload.precioDestino = formData.precioDestino;
            }
            if (formData.precioTerrestrePorCargaGeneral != null)
              payload.precioTerrestrePorCargaGeneral = formData.precioTerrestrePorCargaGeneral;
          }
        }

        if (isCliente.value) {
          payload.client = {
            company: formData.company,
            contactName: formData.contactName,
            contactPhone: formData.contactPhone,
            taxId: formData.taxId,
            address: formData.address,
            modalidad: formData.modalidad,
          };
        }

        await api.post("/users/adduser", payload);

        await Swal.fire({
          text: "Cuenta creada con éxito",
          icon: "success",
          confirmButtonText: "Ok",
        });
        router.push({ name: "sign-in" });
      } catch (e: any) {
        console.error("Error creating user", e);
        await Swal.fire({
          text: e?.response?.data?.message || "Error al crear la cuenta",
          icon: "error",
          confirmButtonText: "Ok",
        });
      } finally {
        loading.value = false;
      }
    }

    return {
      formData,
      roles,
      errors,
      loading,
      onSubmit,
      addTransport,
      removeTransport,
      addAyudante,
      removeAyudante,
      addCargaEspecial,
      removeCargaEspecial,
      newCargaEspecial,
      isPrestatario,
      isCliente,
      cargaOptions,
      viaOptions,
      alquilerOptions,
      talleresOptions,
      gpsProvidersOptions,
      tiposHabitacionOptions,
      serviciosAlojOptions,
    };
  },
});
</script>

<style lang="scss" scoped>
.rating-card {
  background: #fafafa;
  border: 1px solid #e4e6ef;
  border-radius: 0.75rem;
  transition: all 0.25s ease;
}

.rating-card:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.08);
}

/* ===========================
   Estrellas
=========================== */

.rating-star {
  cursor: pointer;
  transition: all 0.25s ease;
}

.rating-star:hover {
  transform: scale(1.2) rotate(-5deg);
}

.rating-star:active {
  transform: scale(1.05);
}

.rating-star.bi-star-fill,
.rating-star.bi-star-half {
  filter: drop-shadow(
    0 2px 4px rgba(255, 193, 7, 0.25)
  );
}

/* ===========================
   Hint informativo
=========================== */

.rating-hint {
  display: flex;
  align-items: center;
  gap: 0.35rem;

  margin-top: 1rem;
  padding: 0.85rem 1rem;

  background: linear-gradient(
    135deg,
    rgba(255, 193, 7, 0.08),
    rgba(255, 248, 220, 0.45)
  );

  border: 1px solid rgba(255, 193, 7, 0.2);
  border-radius: 0.75rem;

  color: #6c757d;
  font-size: 0.85rem;

  animation: fadeInUp 0.5s ease;
}

.rating-hint i {
  color: #f59e0b;
  font-size: 1rem;
  animation: pulseStars 2.5s infinite;
}

.rating-hint strong {
  color: #495057;
  font-weight: 700;
}

/* ===========================
   Animaciones
=========================== */

.fade-up-enter-active {
  transition: all 0.4s ease;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulseStars {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.8;
  }

  50% {
    transform: scale(1.15);
    opacity: 1;
  }
}
</style>