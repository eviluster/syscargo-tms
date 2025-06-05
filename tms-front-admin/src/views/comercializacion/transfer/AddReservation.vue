<template>
  <Form
    @submit="handleSubmit"
    :validation-schema="schema"
    v-slot="{ resetForm }"
  >
    <div class="row my-6">
      <div class="col-md-5 my-4">
        <div class="card shadow-sm">
          <div class="card-body">
            <h3 class="card-title">Tipo de transporte</h3>
            <Field
              as="select"
              name="transporte"
              class="form-select form-select-solid"
            >
              <option disabled value="">Seleccione un transporte</option>
              <option value="Bus">Bus</option>
              <option value="Carro">Carro</option>
              <option value="Taxi">Taxi</option>
              <option value="Minibus">Minibus</option>
            </Field>
            <ErrorMessage name="transporte" class="text-danger" />
          </div>
        </div>
        <div class="card shadow-sm px-1 my-6">
          <div class="card-body">
            <h3 class="my-5">Tipo de mercado</h3>
            <Field
              as="select"
              name="mercado"
              class="form-select form-select-solid"
            >
              <option disabled value="">Seleccione un mercado</option>
              <option value="Nacional">Nacional</option>
              <option value="Internacional">Internacional</option>
            </Field>
            <ErrorMessage name="mercado" class="text-danger" />
          </div>
        </div>
        <div class="card shadow-sm">
          <div class="card-body">
            <h3 class="card-title">Tipo de viaje</h3>
            <Field
              as="select"
              name="viaje"
              class="form-select form-select-solid"
            >
              <option disabled value="">Seleccione un tipo de viaje</option>
              <option value="Ida">Ida</option>
              <option value="Vuelta">Vuelta</option>
              <option value="Ida y vuelta">Ida y vuelta</option>
            </Field>
            <ErrorMessage name="viaje" class="text-danger" />
          </div>
        </div>
        <div class="card shadow-sm px-1 my-6">
          <div class="card-body">
            <h3 class="my-5">Metodo de pago</h3>
            <Field
              as="select"
              name="pago"
              class="form-select form-select-solid"
            >
              <option disabled value="">Seleccione un metodo</option>
              <option value="Transfermovil">Transfermovil</option>
              <option value="Enzona">Enzona</option>
              <option value="Visa">Visa</option>
              <option value="Mastercard">Mastercard</option>
            </Field>
            <ErrorMessage name="pago" class="text-danger" />
          </div>
        </div>
      </div>
      <div class="col-md-7 py-4">
        <div class="card shadow-sm">
          <div class="mb-4 px-4 py-4 col-11 mx-6">
            <label class="required form-label">Origen</label>
            <Field
              name="origen"
              as="input"
              type="text"
              class="form-control"
              placeholder="Ponga el punto de partida"
            />
            <ErrorMessage name="origen" class="text-danger" />
          </div>
          <div class="mb-4 px-4 py-4 col-11 mx-6">
            <label class="required form-label">Destino</label>
            <Field
              name="destino"
              as="input"
              type="text"
              class="form-control"
              placeholder="Ponga el punto de llegada"
            />
            <ErrorMessage name="destino" class="text-danger" />
          </div>
          <div class="row">
            <div class="mb-4 px-4 py-4 col-5 mx-6">
              <label class="required form-label">Fecha</label>
              <Field
                name="fecha"
                as="input"
                type="date"
                class="form-control"
                placeholder="Ponga la fecha deseada"
              />
              <ErrorMessage name="destino" class="text-danger" />
            </div>
            <div class="mb-4 px-4 py-4 col-5 mx-6">
              <label class="required form-label">Hora</label>
              <Field
                name="hora"
                as="input"
                type="time"
                class="form-control"
                placeholder="Ponga la fecha deseada"
              />
              <ErrorMessage name="hora" class="text-danger" />
            </div>
          </div>
          <div class="mb-4 px-4 py-4 col-11 mx-6">
            <label class="required form-label">Nombre</label>
            <Field
              name="firstName"
              as="input"
              type="text"
              class="form-control"
              placeholder="Ponga su nombre"
            />
            <ErrorMessage name="firstName" class="text-danger" />
          </div>
          <div class="mb-4 px-4 py-4 col-11 mx-6">
            <label class="required form-label">Pasaporte</label>
            <Field
              name="pax"
              as="input"
              type="text"
              class="form-control"
              placeholder="Ponga su nombre"
            />
            <ErrorMessage name="pax" class="text-danger" />
          </div>
          <div class="mb-4 px-4 py-3 col-11 mx-6">
            <label class="required form-label">Telefono</label>
            <Field
              name="phone"
              as="input"
              type="tel"
              class="form-control"
              placeholder="Ponga su telefono"
            />
            <ErrorMessage name="phone" class="text-danger" />
          </div>
          <div class="mb-4 px-4 py-4 col-11 mx-6">
            <label class="form-label">Condiciones adicionales</label>
            <Field
              name="condiciones"
              as="textarea"
              class="form-control"
              placeholder="Ponga la descripcion"
            />
          </div>
        </div>
        <div class="card-footer my-8 d-flex justify-content-end">
          <a href="#" class="btn btn-bg-secondary">Cancelar</a>
          <button
            type="submit"
            class="btn btn-bg-primary mx-3"
            :disabled="loading"
          >
            <span v-if="!loading">Guardar</span>
            <span v-if="loading">
              Guardando...
              <span
                class="spinner-border spinner-border-sm align-middle ms-2"
              ></span>
            </span>
          </button>
        </div>
      </div>
    </div>
  </Form>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { type IReservaciones } from "@/core/data/reservaciones";
import { useReservasStore } from "@/stores/reservas";
import Swal from "sweetalert2/dist/sweetalert2.js";
export default defineComponent({
  name: "AddReservation",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  setup() {
    const reservasStore = useReservasStore();
    const loading = ref(false);
    const schema = yup.object({
      origen: yup.string().required("El origen es requerido"),
      destino: yup.string().required("El destino es requerido"),
      fecha: yup.string().required("La fecha es requerido"),
      hora: yup.string().required("La hora es requerido"),
      transporte: yup.string().required("Seleccione un transporte"),
      mercado: yup.string().required("Seleccione un mercado"),
      viaje: yup.string().required("Seleccione un tipo de viaje"),
      condiciones: yup.string(),
      pago: yup.string().required("Seleccione un metodo de pago"),
      firstName: yup.string().required("El nombre es requerido"),
      pax: yup.string().required("El pasaporte es requerido"),
      phone: yup
        .string()
        .required("El teléfono es requerido")
        .matches(/^\d+$/, "El teléfono solo debe contener números"),
    });

    const handleSubmit = (
      values: any,
      { resetForm }: { resetForm: () => void },
    ) => {
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
        const saveSuccess = true;

        if (saveSuccess) {
          const newReserva: IReservaciones = {
            id: reservasStore.reservas.length + 1,
            origen: values.origen,
            destino: values.destino,
            fecha: values.fecha,
            hora: values.hora,
            pasaporte: values.pax,
            tipodetrasnporte: values.transporte,
            tipodemercado: values.mercado,
            nombre: values.firstName,
            telefono: values.phone,
            tipodepago: values.pago,
            ...(values.condiciones && {
              condicionesadicionales: values.condiciones,
            }),
          };

          reservasStore.addReserva(newReserva);
          console.log("Reserva agregada:", newReserva);

          Swal.fire({
            text: "Reserva guardada exitosamente!",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            heightAuto: false,
            customClass: {
              confirmButton: "btn btn-primary",
            },
          }).then(() => {
            resetForm();
          });
        } else {
          Swal.fire({
            text: "Hubo un error al guardar la reserva. Por favor, inténtalo de nuevo.",
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            heightAuto: false,
            customClass: {
              confirmButton: "btn btn-primary",
            },
          });
        }
      }, 2000);
    };
    return {
      schema,
      handleSubmit,
      loading,
    };
  },
});
</script>
