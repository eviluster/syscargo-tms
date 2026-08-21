--- context.md


+++ context.md
# TMS (Transport Management System) - Memoria Técnica

## Contexto del Proyecto

**TMS** es un sistema integral de gestión de transporte desarrollado como aplicación web con arquitectura cliente-servidor. El sistema gestiona operaciones logísticas incluyendo reservas, cargas, pagos, clientes, proveedores y propuestas de servicio. Permite a administradores gestionar operaciones completas, a clientes realizar reservas y seguimiento de cargas, y a prestatarios ofrecer servicios de transporte, alquiler, talleres, GPS y alojamiento.

**Stack Tecnológico:**
- **Backend**: NestJS 10 + TypeScript 5.1+ + Node.js
- **Base de Datos**: PostgreSQL 17 con TypeORM 0.3.20
- **Autenticación**: JWT + Passport + Argon2 (hash de contraseñas)
- **Frontend Admin**: Vue 3.5+ + Vite 7 + Bootstrap 5.3 + Element Plus + Pinia 3
- **Frontend Cliente**: Vue 3.5+ + Vite 6 + Vuetify 3.7 + Pinia 3
- **Infraestructura**: Docker + Docker Compose + Traefik (SSL con Let's Encrypt)
- **Testing**: Jest (unit tests), Pactum (e2e tests)

**Versiones mínimas**: Node.js 20+, PostgreSQL 17

---

## Arquitectura General

**Patrón Arquitectónico**: MVC modular basado en NestJS con módulos por dominio de negocio.

```
┌─────────────────────────────────────────────────────────────┐
│                    TRAEFIK (Proxy Reverso)                   │
│              SSL Termination + Routing por Host              │
└─────────────────────────────────────────────────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Front Admin    │    │  Front Cliente  │    │   Backend       │
│  (Element Plus) │    │   (Vuetify)     │    │   (NestJS)      │
│  :80            │    │   :80           │    │   :5000         │
└─────────────────┘    └─────────────────┘    └────────┬────────┘
                                                       │
                                                       ▼
                                            ┌─────────────────┐
                                            │  PostgreSQL 17  │
                                            │  :5432          │
                                            └─────────────────┘
```

**Flujo típico de request**:
1. Cliente envía petición HTTPS → Traefik valida certificado y ruta
2. Traefik enruta al contenedor correspondiente (front o backend)
3. Frontend: Vue Router maneja navegación, Axios intercepta y añade Bearer token
4. Backend: NestJS procesa vía Controller → Guard (JWT) → Service → Repository → TypeORM → PostgreSQL
5. Respuesta retorna en cadena inversa con transformaciones aplicadas

---

## Estructura de Directorios

```
/workspace
├── tms-backend/                 # Backend NestJS
│   ├── src/
│   │   ├── auth/               # Autenticación (login, signup, JWT, password reset)
│   │   ├── user/               # Gestión de usuarios y entidad User
│   │   ├── user-roles/         # Relación Usuario-Rol (UserRole entity)
│   │   ├── roles/              # Sistema de roles (Role entity)
│   │   ├── customer/           # Clientes externos
│   │   ├── cliente/            # Módulo cliente interno (empresa)
│   │   ├── prestatario/        # Proveedores de servicio (transporte, talleres, etc.)
│   │   ├── prestatarioserv/    # Servicios por prestatario (precios, descripción)
│   │   ├── proveedor/          # Proveedores generales
│   │   ├── reserva/            # Reservas de servicio
│   │   ├── carga/              # Gestión completa de cargas (core del negocio)
│   │   ├── pago/               # Módulo de pagos
│   │   ├── servicio/           # Catálogo de servicios
│   │   ├── proposal/           # Propuestas de servicio
│   │   ├── proposals_alquiler/ # Propuestas específicas de alquiler
│   │   ├── proposals_services/ # Propuestas específicas de servicios
│   │   ├── calendar/           # Calendario operativo
│   │   ├── comercial/          # Área comercial
│   │   ├── planes/             # Planes de servicio
│   │   ├── plan-servicio-cliente/     # Planes para clientes
│   │   ├── plan-servicio-prestatario/ # Planes para prestatarios
│   │   ├── origen/destino/     # Puntos geográficos de operación
│   │   ├── modalidad/tipoviaje/tipotransporte/ # Catálogos de transporte
│   │   ├── tipocarga/tipopago/tipomercado/   # Catálogos de negocio
│   │   ├── um/tipo-um/         # Unidades de medida
│   │   ├── cuenta-bancaria/    # Cuentas bancarias
│   │   ├── customer-cuenta/    # Cuentas de clientes
│   │   ├── notifications/      # Sistema de notificaciones internas
│   │   ├── trazas/             # Auditoría y logs de operaciones
│   │   ├── configuracion/      # Configuración del sistema
│   │   ├── settings/           # Ajustes generales
│   │   ├── solicitudes/        # Solicitudes de servicio
│   │   ├── peticion/           # Peticiones varias
│   │   ├── doccarga/           # Documentación asociada a cargas
│   │   ├── country/province/municipality/locality/ # Geolocalización
│   │   ├── address-details/    # Detalles de direcciones
│   │   ├── common/             # Utilidades compartidas (base entities, interceptors)
│   │   ├── app.module.ts       # Módulo raíz que importa todos los módulos
│   │   ├── main.ts             # Punto de entrada, configuración global
│   │   └── ../ormconfig.ts     # Configuración de TypeORM y entidades (en raíz del backend)
│   └── test/                   # Tests E2E con Pactum
│
├── tms-front-admin/            # Panel administrativo (interno)
│   ├── src/
│   │   ├── views/              # Vistas principales organizadas por área
│   │   │   ├── administracion/ # Gestión de usuarios, roles, configuración
│   │   │   ├── apps/           # Aplicaciones específicas
│   │   │   ├── crafted/        # Componentes UI avanzados
│   │   │   ├── comercializacion/# Gestión de órdenes y cargas
│   │   │   ├── terrestre/      # Operaciones de transporte terrestre
│   │   │   ├── prestatario/    # Gestión de prestatarios
│   │   │   └── cliente/        # Gestión de clientes
│   │   ├── components/         # Componentes reutilizables
│   │   ├── stores/             # Stores de Pinia (auth, config, destinos, etc.)
│   │   ├── router/             # Configuración de rutas con guards
│   │   ├── services/           # Servicios HTTP (api.ts)
│   │   ├── axios/              # Configuración de Axios con interceptores
│   │   ├── core/               # Servicios base (ApiService, JwtService)
│   │   ├── layouts/            # Layouts de la aplicación
│   │   └── assets/             # Recursos estáticos (SASS, imágenes)
│
└── tms-front-cliente/          # Portal de clientes (público)
    ├── src/
    │   ├── views/              # Vistas públicas (Home, Services, Plans, Reservar)
    │   ├── components/         # Componentes específicos
    │   ├── stores/             # Stores de Pinia (servicesStore)
    │   ├── router/             # Rutas públicas
    │   └── assets/             # Recursos estáticos
```

**Convenciones de nomenclatura**:
- **Backend**: kebab-case para nombres de directorio, PascalCase para clases/entities, camelCase para propiedades
- **Frontend**: PascalCase para componentes/views, camelCase para variables/funciones
- **Entidades**: 
  - `BasicEntity`: id UUID, createdAt, updatedAt, deletedAt (_deleted_at), isActive
  - `BasicInformationEntity`: Extiende BasicEntity + name, description (opcionales)

---

## Módulos/Componentes Principales

### Backend

#### AuthModule (`src/auth/`)
- **Responsabilidad**: Autenticación y autorización de usuarios
- **Dependencias**: UserModule, RolesModule, JwtModule, ConfigModule
- **Endpoints expuestos**:
  - `POST /v1/auth/signup` - Registro público de usuario
  - `POST /v1/auth/signup-admin` - Registro administrativo
  - `POST /v1/auth/signin` - Login (retorna refresh_token)
  - `POST /v1/auth/logout` - Cierre de sesión
  - `POST /v1/auth/is-token-expired` - Validación de token
  - `POST /v1/auth/forgot_password` - Solicitud de reseteo
  - `POST /v1/auth/reset_password` - Reseteo de contraseña
- **Lógica clave**:
  - Hash de contraseñas con Argon2
  - Generación de JWT con expiración configurable (1 día para refresh)
  - Control de sesiones concurrentes (flag `isLogged` en User)
  - Tokens de reseteo con expiración almacenados en BD

#### CargaModule (`src/carga/`)
- **Responsabilidad**: Gestión completa del ciclo de vida de cargas
- **Dependencias**: ClientModule, NotificationsModule, TypeORM
- **Eventos/acciones**:
  - Creación de carga con validación de cliente
  - Actualización de estado (enum `CargaStatus`: borrador → entregado/cancelado)
  - Reprogramación y cancelación con justificación
  - Subida de POD (Proof of Delivery) en base64
- **Estado interno**: Estados definidos en enum `CargaStatus` (13 estados posibles)
- **Lógica clave**:
  - Validación de permisos por rol (admin vs cliente vs prestatario)
  - Generación automática de order_id único
  - Notificaciones automáticas en cambios de estado
  - Almacenamiento de documentos POD como base64 en DB

#### ReservaModule (`src/reserva/`)
- **Responsabilidad**: Gestión de reservas de servicio
- **Dependencias**: ComercialModule, ServicioModule, UserModule
- **Entidad Reserva**: Campos para datos de solicitante, fecha/hora, dirección, estado
- **Lógica clave**: Vinculación con servicios comerciales y seguimiento de estado

#### PrestatarioModule (`src/prestatario/`)
- **Responsabilidad**: Gestión de proveedores de servicio
- **Dependencias**: UserModule, TypeORM
- **Entidad Prestatario**:
  - Relación 1:1 con User
  - Campos JSONB para transportes, ayudantes, servicios
  - Enums para tipoCarga (Seco, Refrigerado, Carga general) y contenedor (20, 40 pies)
  - Capacidad (peso/volumen máximos)
  - Precios personalizados por km y tipo de carga
  - Servicios adicionales: alquiler, talleres, GPS, alojamiento
- **Lógica clave**: Validación de capacidades según tipo de servicio ofrecido

#### NotificationsModule (`src/notifications/`)
- **Responsabilidad**: Sistema de notificaciones internas
- **Dependencias**: UserModule
- **Entidad Notification**:
  - userTarget (destinatario), userOrigin (emisor opcional)
  - type (enum NotificationType), link, meta (JSON)
  - flag read/unread, active
- **Lógica clave**: Notificaciones contextuales con metadata extensible

#### UserModule (`src/user/`)
- **Responsabilidad**: CRUD de usuarios y relaciones
- **Dependencias**: RolesModule, UserRolesModule
- **Entidad User**:
  - Extiende BasicEntity
  - Campos: name, lastname, username, email, phone, hash, photo
  - Relación ManyToOne con Role
  - Flag isLogged para control de sesión
  - comercial_code para usuarios comerciales
- **Lógica clave**: Integración con sistema de roles para permisos

#### UserRolesModule (`src/user-roles/`)
- **Responsabilidad**: Gestión de relación muchos-a-muchos entre usuarios y roles
- **Dependencias**: UserModule, RolesModule
- **Endpoints expuestos**:
  - `POST /user-roles` - Crear nueva asignación usuario-rol
  - `GET /user-roles` - Listar todas las asignaciones
  - `GET /user-roles/:id` - Obtener asignación específica
  - `PATCH /user-roles/:id` - Actualizar asignación
  - `DELETE /user-roles/:id` - Eliminar asignación
- **Entidad UserRole**:
  - Extiende BasicEntity
  - Relación ManyToOne con User
  - Relación ManyToOne con Role
- **Lógica clave**: Permite asignar múltiples roles a un usuario (extensible)

#### RolesModule (`src/roles/`)
- **Responsabilidad**: Gestión de roles de usuario
- **Entidad Role**: Nombre del rol (Administrador, Cliente, Prestatario, etc.)
- **Lógica clave**: Los roles determinan permisos en guards y lógica de negocio

#### PrestatarioservModule (`src/prestatarioserv/`)
- **Responsabilidad**: Gestión de servicios ofrecidos por prestatarios con precios personalizados
- **Dependencias**: PrestatarioModule, ServicioModule
- **Endpoints expuestos**:
  - `GET /api/prestatarioserv/all` - Listar todos los registros activos
  - `POST /api/prestatarioserv` - Crear nuevo servicio para prestatario
  - `GET /api/prestatarioserv/prestatario/:prestatarioId` - Servicios de un prestatario específico
  - `PATCH /api/prestatarioserv/:id` - Actualizar precio/descripción
  - `DELETE /api/prestatarioserv/:id` - Soft delete (marca como inactivo)
  - `PUT /api/prestatarioserv/:id/restore` - Restaurar registro eliminado
  - `POST /api/prestatarioserv/calculate-price` - Calcular total con comisión 5%
- **Entidad Prestatarioserv**:
  - Extiende BasicInformationEntity
  - Relación ManyToOne con Prestatario (CASCADE delete)
  - Relación ManyToOne con Servicio (CASCADE delete)
  - Campo precio (decimal 10,2)
  - Campo descripcion (text, nullable)
  - Índice único en (prestatario, servicio, isActive) donde isActive=true
- **Lógica clave**: 
  - Validación de precio > 0
  - Un prestatario solo puede tener un registro activo por servicio
  - Soft delete mediante isActive flag
  - Cálculo de precio total: subtotal + 5% comisión plataforma

#### Módulos de Catálogo
- **Origen/Destino**: Puntos geográficos de operación
- **Modalidad/TipoViaje/TipoTransporte**: Clasificación de servicios
- **TipoCarga/TipoPago/TipoMercado**: Catálogos de negocio
- **Country/Province/Municipality/Locality**: Geolocalización jerárquica
- **UM/TipoUM**: Unidades de medida para facturación

### Frontend Admin

#### ApiService (`src/services/api.ts`)
- **Responsabilidad**: Configuración centralizada de Axios
- **Configuración**:
  - baseURL desde `VITE_API_BASE_URL` (https://api.syscargo.cu/v1)
  - Timeout: 120000ms
  - Interceptor request: inyecta Authorization header con Bearer token desde store
- **Dependencias**: useAuthStore (Pinia)

#### AuthStore (`src/stores/auth.ts`)
- **Responsabilidad**: Estado de autenticación
- **Estado**:
  - `isAuthenticated`: boolean derivado de token en cookies
  - `accessToken`: refresh_token desde cookies
  - `user`: datos de usuario (name, username, email, role, etc.)
  - `errors`: objeto de errores de validación
- **Acciones**:
  - `login(credentials)`: POST /auth/signin, guarda token y userData en cookies
  - `signOut()`: POST /auth/logout, limpia estado
  - `register(credentials)`: POST /auth/signup-admin
  - `forgotPassword(email)`, `resetPassword(token, email, password)`
  - `isTokenExpired()`: Verifica expiración y refresca si necesario
- **Cookies utilizadas**: `refresh_token`, `userData` (JSON serializado)

#### Router (`src/router/index.ts`)
- **Responsabilidad**: Navegación y protección de rutas
- **Lógica clave**:
  - Redirect inicial verifica token y role del usuario
  - Rutas protegidas con meta `requiresAuth: true`
  - Redirección dinámica según rol:
    - Prestatario → `/comercializacion/ordenes/listrordenesPrestatario`
    - Cliente → `/comercializacion/ordenes/listrordenesCliente`
    - Admin → `/comercializacion/ordenes/listrordenesA`

#### CargaApi (`src/axios/axios.ts`)
- **Responsabilidad**: Operaciones CRUD sobre cargas desde frontend
- **Métodos**:
  - `getAllOrdenes()`: GET /carga/all-active, mapea respuesta a estructura UI
  - `createOrden(ordenData)`: POST con validación básica
- **Lógica clave**: Transformación de datos crudos de API a formato esperado por componentes

### Frontend Cliente

#### ServicesStore (`src/stores/servicesStore.ts`)
- **Responsabilidad**: Estado de servicios disponibles
- **Estado**: Lista de servicios, filtros, selección actual

#### Router (`src/router/index.ts`)
- **Rutas públicas**:
  - `/` → HomeView
  - `/services` → Services (listado)
  - `/services/:serviceId` → ServiceDetail
  - `/plans` → Planes
  - `/reservar` → Reservar
  - `/contact` → Contactenos
  - `/rastrear` → Rastrear (seguimiento de carga)

---

## Modelos de Datos / Esquemas

### Entidades Principales

#### User (`users`)
```
id: UUID (PK)
name, lastname, username, email, phone, photo: string
hash: string (contraseña hasheada con Argon2)
description: string
role: UUID (FK → roles.id)
isLogged: boolean
comercial_code: number
isActive: boolean
createdAt, updatedAt: timestamp
deletedAt: timestamp (soft delete)
```

#### Role (`roles`)
```
id: UUID (PK)
name: string (ej: "Administrador", "Cliente", "Prestatario")
```

#### Carga (`carga`) - ENTIDAD CORE
```
id: UUID (PK)
order_id: string (único)
carga_serie: string (único, nullable)
estado: enum CargaStatus (default: PENDING_PROPOSALS)
fechaRegistro: timestamptz

// Remitente / Emisor
remitente_dni, remitente_nombre: string
emisor_dni, emisor_nombre, emisor_direccion: string
autorizado_recoger: string

// Características de carga
cant_bultos: number
peso_total: number
vol_bulto: number
tipo_carga: enum TipoCargaEnum

// Ubicación
origen: UUID (FK → origen.id)
destino: UUID (FK → destino.id)
origen_string, destino_string: string

// Cliente
cliente_id: UUID (FK → client.id)

// Precios
precio, tarifabase, volumen, impuesto, comision: number

// Prestatario asignado
assigned_prestatario_id: UUID (FK → prestatario.id, nullable)

// Vía de transporte
via: enum ViaMode (nullable)

// POD (Proof of Delivery)
pod_dni_front_base64, pod_dni_back_base64: text
pod_signed: boolean (default: false)
pod_signature_confirmed: boolean (default: false)

// Metadatos de estado
status_reason: text (nullable)
status_date: timestamp (nullable)

// Campos adicionales del formulario
fecha_emision, fecha_autorizada: timestamptz
no_orden, comprador_interno, autorizado_lugar: string
representante_nombre, representante_carnet, representante_cargo: string
firma: string
tipo_producto, contenedor_siglas, nombre_destinatario: string
nombre_buque, mfto_no, bl_no, dm_no: string
vehiculo_pertenece_a, conducido_por, chapa_no, lot_no: string
hoja_ruta_no, carta_porte_no, chapa_tractivo_no, remolque_no: string
conductor_carnet_no, licencia_conduccion_no: string
basificado_en: string

Relaciones:
- cliente: ManyToOne → Client
- assignedPrestatario: ManyToOne → Prestatario
- origen: ManyToOne → Origen
- destino: ManyToOne → Destino
- proposals: OneToMany → Proposal
- doccargas: OneToMany → Doccarga
```

#### Prestatario (`prestatario`)
```
id: UUID (PK)
name: string
user: UUID (FK → users.id, unique)
tipoCarga: enum TipoCarga (Seco, Refrigerado, Carga general)
contenedor: enum Contenedor (20, 40)
transportes: jsonb [{nombreChofer, chapa, tipoTransporte}]
ayudantes: jsonb [{nombre, apellidos, ci}]
cargasEspeciales: jsonb string[]
rating: float
licencia: jsonb {numero, categoria, vence}
maxWeight, maxVolume: numeric
servicios: enum ViaMode[] (array)
conditions: text

// Servicios adicionales
metrosDisponiblesAlquiler, alturaMAlquiler: numeric
serviciosPrestAlquiler: jsonb string[]
talleresNumTecnicos, talleresCapacidadVehiculos: numeric
talleresHorario: text
talleresServicios: jsonb string[]
gpsProviders: jsonb string[]
gpsDevicesAvailable: numeric
gpsPlans: text
gpsIntegrationApi: boolean
habitacionesDisponibles, capacidadPersonas: numeric
precioNochePromedio: numeric
tipoHabitaciones, serviciosIncluidosAlojamiento: jsonb string[]

// Precios personalizados
precioTerrestre: jsonb {precioPorKm, precioPorCarga: Record<string, number>}

Relaciones:
- user: OneToOne → User
- solicitudes: OneToMany → Solicitud
```

#### Client (`client`)
```
id: UUID (PK)
user: UUID (FK → users.id)
Relaciones:
- cargas: OneToMany → Carga
```

#### Reserva (`reserva`)
```
id: UUID (PK)
apellido, correo, fecha, hora, direccion: string
state: enum StateEnum (default: Ordenado)
vin, motor: string (para producido)
bl, contenedor: string (para embarcado)
nombreSolicitante, correoSolicitante, telefonoSolicitante: string
fechaSolicitud, comentarios: string
comercial_id: UUID (FK → comercial.id, nullable)
servicio_id: UUID (FK → servicio.id, nullable)
user_id: UUID (FK → users.id)
Relaciones:
- comercial: ManyToOne → Comercial
- servicio: ManyToOne → Servicio
- user: ManyToOne → User
```

#### Notification (`notifications`)
```
id: UUID (PK)
title, message: string
type: enum NotificationType
link: string (nullable)
meta: jsonb (nullable)
read: boolean (default: false)
active: boolean (default: true)
userTarget_id: UUID (FK → users.id)
userOrigin_id: UUID (FK → users.id, nullable)
Relaciones:
- userTarget: ManyToOne → User
- userOrigin: ManyToOne → User
```

#### Proposal (`proposal`)
```
id: UUID (PK)
carga_id: UUID (FK → carga.id)
Relaciones:
- carga: ManyToOne → Carga
```

### Reglas de Negocio Asociadas

1. **Carga**:
   - order_id debe ser único generado automáticamente
   - Solo admin o cliente propietario puede ver/editar su carga
   - Prestatario asignado solo puede operar cargas asignadas a él
   - Estados siguen flujo: borrador → propuestas_pendientes → propuesto → propuesta_aceptada → asignado → listo_para_recoger → recogido → en_transito → llegado_al_destino → en_reparto_final → entregado
   - Cancelación/reprogramación requiere motivo obligatorio

2. **Usuario**:
   - Username único
   - Contraseña hasheada con Argon2 antes de guardar
   - Rol determina permisos de acceso

3. **Prestatario**:
   - Un usuario puede tener máximo un perfil de prestatario
   - Servicios definidos como array de enums (multiselección)
   - Precios terrestres estructurados como JSON para flexibilidad

4. **Notificaciones**:
   - Siempre asociadas a un userTarget
   - userOrigin es opcional (notificaciones del sistema)
   - Soft delete mediante flag active

### Fuente de Verdad
- **PostgreSQL**: Fuente primaria para todas las entidades
- **TypeORM**: ORM con synchronize=true (desarrollo) y migraciones (producción)
- **Soft Delete**: Implementado vía columna `_deleted_at` en BasicEntity

---

## Configuración y Entorno

### Variables de Entorno Requeridas

**Backend (.env)**:
```
DB_HOST='tms-db'              # Host de PostgreSQL (Docker service name)
DB_PORT='5432'                # Puerto de PostgreSQL
DB_USER='tmsdb'               # Usuario de BD
DB_PASS='Sysc4rg0'            # Contraseña de BD
DB_NAME='tms_db'              # Nombre de BD
JWT_SECRET_KEY='Denied111111111'  # Secreto para firmar JWT
NODE_ENV='development'|'production'  # Entorno de ejecución
```

**Frontend Admin (.env)**:
```
VITE_API_BASE_URL='https://api.syscargo.cu/v1'  # URL base de API
```

### Archivos de Configuración Relevantes

**Backend**:
- `ormconfig.ts`: Configuración de TypeORM
  - entities: lista explícita de todas las entidades
  - migrations: `src/database/migrations/*.ts`
  - synchronize: true (solo desarrollo, cambiar en prod)
- `app.module.ts`: Importa ConfigModule con `envFilePath: .env.${NODE_ENV}`
- `main.ts`:
  - Global prefix: `v1`
  - CORS habilitado para orígenes específicos
  - Body parser limit: 20MB (para uploads de documentos/base64)
  - Swagger en `/api`

**Frontend**:
- `vite.config.ts`: Build configuration con variables de entorno
- `src/services/api.ts`: Axios instance con baseURL desde env

### Diferencias entre Entornos

| Configuración | Development | Production |
|--------------|-------------|------------|
| DB synchronize | true | false (usar migraciones) |
| CORS origins | localhost | dominios específicos |
| SSL | No | Sí (Traefik + Let's Encrypt) |
| Logs | Debug habilitado | Producción |
| Resource limits | Sin límites | Docker: 2GB RAM backend, 512MB front |

---

## API / Interfaces Públicas

### Endpoints Backend (prefijo `/v1`)

#### Autenticación
```
POST /auth/signup
  Body: CreateUserDto {name, username, email, password, ...}
  Response: User created

POST /auth/signup-admin
  Body: CreateUserDto
  Response: User created (rol admin)

POST /auth/signin
  Body: {username, password}
  Response: {userID, name, username, email, lastname, phone, refresh_token, role}

POST /auth/logout
  Headers: Authorization: Bearer <token>
  Body: {username, password}
  Response: Logout confirmed

POST /auth/is-token-expired
  Body: {token}
  Response: boolean | new_token

POST /auth/forgot_password
  Body: {email}
  Response: {message}

POST /auth/reset_password
  Body: {token, email, password, password_confirmation}
  Response: {message}
```

#### Cargas
```
GET /carga/all-active
  Headers: Authorization opcional
  Response: Carga[] (todas las cargas activas)

GET /carga/:id
  Headers: Authorization requerido
  Response: Carga (solo si es admin, owner o assignedPrestatario)

GET /carga/client/:clientId
  Headers: Authorization requerido
  Response: Carga[] (filtradas por cliente)

POST /carga
  Headers: Authorization requerido
  Body: CreateCargaDto + clientId (si es admin)
  Response: Carga creada

PATCH /carga/:id
  Headers: Authorization requerido
  Body: UpdateCargaDto
  Response: Carga actualizada

POST /carga/:id/reprogram
  Body: ReprogramDto {status_reason, status_date}
  Response: Carga con estado REPROGRAMMED

POST /carga/:id/cancel
  Body: CancelDto {status_reason}
  Response: Carga con estado CANCELLED

POST /carga/:id/pod
  Body: {pod_dni_front_base64, pod_dni_back_base64, pod_signed, pod_signature_confirmed}
  Response: Carga con POD actualizado
```

#### Reservas
```
GET /reserva/all
  Response: Reserva[]

POST /reserva
  Body: CreateReservaDto
  Response: Reserva creada
```

#### Prestatarios
```
GET /prestatario/all
  Response: Prestatario[]

GET /prestatario/by-user/:userId
  Response: Prestatario | null

POST /prestatario
  Body: CreatePrestatarioDto
  Response: Prestatario creado

PATCH /prestatario/:id
  Body: UpdatePrestatarioDto
  Response: Prestatario actualizado
```

#### Notificaciones
```
GET /notifications/:userId
  Query: onlyUnread (boolean)
  Response: Notification[]

POST /notifications
  Body: {title, message, type, link, meta, userTargetId, userOriginId}
  Response: Notification creada

PATCH /notifications/:id/read
  Response: Notification marcada como leída
```

### Manejo de Errores

**Códigos de estado HTTP**:
- `200 OK`: Operación exitosa
- `201 Created`: Recurso creado
- `400 Bad Request`: Validación fallida o datos incorrectos
- `403 Forbidden`: Usuario no autorizado (credenciales inválidas o permisos insuficientes)
- `404 Not Found`: Recurso no encontrado
- `500 Internal Server Error`: Error del servidor

**Estructura de error**:
```json
{
  "statusCode": 400,
  "message": ["campo es requerido"],
  "error": "Bad Request"
}
```

---

## Dependencias Externas

### Librerías/Frameworks de Terceros

**Backend**:
- `@nestjs/*`: Framework NestJS (módulos core, TypeORM, Swagger, JWT, Passport)
- `typeorm` + `typeorm-extension`: ORM para PostgreSQL con utilidades adicionales
- `argon2`: Hash de contraseñas (más seguro que bcrypt)
- `class-validator` + `class-transformer`: Validación y transformación de DTOs
- `passport-jwt`: Estrategia JWT para Passport
- `pactum`: Testing E2E
- `sanitize-html`: Sanitización de contenido HTML
- `slugify`: Generación de slugs
- `markdown-it`: Parsing de Markdown
- `ejs`: Templates para emails

**Frontend Admin**:
- `vue` + `vue-router` + `pinia`: Ecosistema Vue 3
- `element-plus`: Componentes UI
- `bootstrap` + `bootstrap-icons`: Estilos e iconos
- `apexcharts` + `vue3-apexcharts`: Gráficos
- `fullcalendar/vue3`: Calendario interactivo
- `vee-validate` + `yup`: Validación de formularios
- `jsPDF` + `html2pdf.js` + `docx`: Generación de documentos
- `dropzone`: Upload de archivos
- `sweetalert2`: Alertas y modales
- `vue-i18n`: Internacionalización
- `axios` + `vue-axios`: Cliente HTTP

**Frontend Cliente**:
- `vuetify`: Framework UI Material Design
- `leaflet`: Mapas interactivos
- `@mdi/font` + `@fortawesome/fontawesome-free`: Iconos

### Servicios Externos Consumidos

- **Traefik**: Proxy reverso para routing y SSL (Let's Encrypt)
- **PostgreSQL**: Base de datos relacional
- **SMTP**: Envío de emails para password reset ([INCOMPLETO: configuración SMTP no implementada, solo console.log en auth.service.ts])

### Credenciales/Autenticación

- **JWT**: Tokens firmados con `JWT_SECRET_KEY` desde env
- **Argon2**: Hash de contraseñas con salt automático
- **Cookies**: Refresh tokens y userData almacenados en cookies HttpOnly Secure SameSite=Strict
- **CORS**: Configurado para permitir solo orígenes específicos con credenciales

---

## Flujos de Negocio Críticos

### 1. Registro y Login de Usuario

```
Usuario → Front Admin → POST /auth/signup-admin → Backend
  ↓
AuthService.signupAdmin()
  ↓
Valida unicidad de username/email
  ↓
Hashea contraseña con Argon2
  ↓
Crea User con rol especificado
  ↓
Retorna User creado

Login:
Usuario → Front Admin → POST /auth/signin → Backend
  ↓
AuthService.login()
  ↓
Busca User por username
  ↓
Verifica contraseña con Argon2.verify()
  ↓
Controla sesión concurrente (isLogged)
  ↓
Genera refresh_token (JWT, expira en 1d)
  ↓
Actualiza isLogged = true
  ↓
Retorna {userData, refresh_token, role}
  ↓
Front guarda token en cookie y userData en cookie
  ↓
Redirige según rol
```

**Decisión técnica**: Se usa Argon2 en lugar de bcrypt por mayor resistencia a ataques GPU. El refresh_token se almacena en cookie (no localStorage) para mayor seguridad contra XSS.

### 2. Creación de Carga

```
Cliente/Admin → Front Admin → POST /carga → Backend
  ↓
CargaService.create(dto, actor)
  ↓
Verifica si actor es admin o cliente
  ↓
Si admin: requiere clientId explícito
Si cliente: busca cliente asociado al user
  ↓
Crea instancia Carga con datos del DTO
  ↓
Asigna cliente automáticamente
  ↓
Estado inicial: PENDING_PROPOSALS
  ↓
Guarda en BD
  ↓
Opcional: crea notificación a administradores
  ↓
Retorna Carga creada
```

**Trade-off**: Se permite que admin cree cargas para cualquier cliente, pero cliente solo puede crear para sí mismo. Esto requiere validación adicional en el service.

### 3. Asignación de Prestatario a Carga

```
Admin → Front Admin → PATCH /carga/:id → Backend
  ↓
CargaService.update(id, dto, actor)
  ↓
Verifica actor es admin
  ↓
Actualiza assignedPrestatario_id
  ↓
Cambia estado a ASSIGNED
  ↓
Crea notificación al prestatario asignado
  ↓
Retorna Carga actualizada
```

### 4. Seguimiento de Estado de Carga

```
Estados posibles (CargaStatus enum):
borrador → propuest as_pendientes → propuesto → propuesta_aceptada →
asignado → listo_para_recoger → recogido → en_transito →
llegado_al_destino → en_reparto_final → entregado

Transiciones:
- Cualquier estado → cancelado (con motivo)
- Cualquier estado → reprogramado (con motivo + nueva fecha)
- entregado es estado terminal

POD (Proof of Delivery):
En estado "entregado", se requiere:
- pod_dni_front_base64, pod_dni_back_base64 (fotos del DNI)
- pod_signed: true (firma física)
- pod_signature_confirmed: true (confirmación digital)
```

### 5. Proceso de Propuestas

```
Cliente crea carga (estado: PENDING_PROPOSALS)
  ↓
Prestatarios pueden enviar propuestas (Proposal entity)
  ↓
Carga pasa a estado PROPOSED
  ↓
Cliente revisa propuestas
  ↓
Cliente acepta una propuesta
  ↓
Carga pasa a PROPOSAL_ACCEPTED → ASSIGNED
  ↓
Prestatario asignado comienza operación
```

**Decisión técnica**: Las propuestas se almacenan como entidad separada (no JSON en carga) para permitir histórico y comparación.

### 6. Notificaciones

```
Evento (ej: carga asignada) → Service llama a NotificationsService.createNotification()
  ↓
Crea Notification con:
  - userTarget: destinatario
  - userOrigin: emisor (opcional, puede ser sistema)
  - type, title, message, link, meta
  ↓
Guarda en BD
  ↓
Frontend consulta periódicamente o via polling:
  GET /notifications/:userId?onlyUnread=true
  ↓
Muestra badge con count de no leídas
```

---

## Estado Global / Side Effects

### Estado Global Frontend

#### Pinia Stores (Admin)
- **auth**:
  - `isAuthenticated`, `accessToken`, `user`, `errors`
  - Modificado por: login, signOut, register, verifyAuth
- **config**: Configuración de la aplicación
- **origen**, **destino**: Listas de ubicaciones
- **tipoviaje**: Tipos de viaje disponibles
- **transportistas**: Lista de transportistas
- **reservas**, **ordenesCarga**, **cartasPorte**: Estado de entidades específicas

#### Cookies
- `refresh_token`: JWT token (expira 1d)
- `userData`: JSON serializado {userID, name, username, email, lastname, phone, role}

### Side Effects Backend

#### Escrituras en Disco
- **NO HAY**: Todos los archivos/documentos se almacenan como base64 en PostgreSQL (campos text)

#### Llamadas Externas
- **Email**: Envío de correos para password reset ([INCOMPLETO: proveedor SMTP no configurado, implementación actual usa console.log en auth.service.ts líneas 307-311])

#### Jobs Programados
- **NO IDENTIFICADOS**: No hay evidencia de cron jobs o colas en el código analizado

#### Interceptores Globales
- **ClearWhiteSpaceInterceptor**: Trim automático de strings en todos los requests POST/PUT/PATCH
- **ValidationPipe**: Whitelist=false, transform=true (convierte tipos automáticamente)

---

## Testing

### Estrategia de Tests

**Backend**:
- **Unitarios**: Jest con `*.spec.ts` junto a archivos fuente
  - Ejemplo: `carga.controller.spec.ts`, `carga.service.spec.ts`
  - Mocks: Repositorios TypeORM, servicios dependientes
- **E2E**: Pactum framework
  - Configuración en `test/jest-e2e.json` (archivo no existe aún)
  - Scripts: `npm run test:e2e` (comando configurado pero sin implementación)

**Frontend**: [INCOMPLETO: no existen tests implementados en tms-front-admin ni tms-front-cliente]

### Cómo Ejecutar Test Suite

```bash
# Backend
cd tms-backend
npm run test          # Unit tests
npm run test:cov      # Con coverage
npm run test:e2e      # E2E tests

# Frontend Admin
cd tms-front-admin
npm run lint          # ESLint
npm run type-check    # TypeScript check

# Frontend Cliente
cd tms-front-cliente
npm run lint
npm run type-check
```

### Mocks/Fixtures Relevantes
- **Backend**: Tests unitarios Jest (*.spec.ts) existen en múltiples módulos (carga, proposal, calendar, etc.)
  - Los mocks se crean inline en cada spec file usando las utilidades de Jest
  - No hay un directorio centralizado de fixtures/mocks
- **Frontend**: Sin tests implementados actualmente

---

## Notas y Advertencias para el Desarrollador

### Trampas Conocidas

1. **synchronize=true en producción**:
   - `ormconfig.ts` tiene `synchronize: true`
   - **PELIGRO**: En producción esto puede borrar/modificar tablas automáticamente
   - **SOLUCIÓN**: Usar migraciones (`migration:generate`, `migration:run-dev`)

2. **Hardcoded credentials en .env**:
   - El archivo `.env` en root contiene credenciales reales
   - **RIESGO**: Si se commitea, exponer secretos
   - **RECOMENDACIÓN**: Usar .env.example y variables de entorno reales en prod

3. **Race condition en login concurrente**:
   - El campo `isLogged` se actualiza sin transacción ni lock
   - Dos logins simultáneos podrían causar inconsistencia
   - **MITIGACIÓN**: Considerar transacción o optimistic locking

4. **Acoplamiento oculto Auth-User**:
   - AuthService inyecta UserRepository y RoleRepository directamente
   - Cambios en User entity afectan auth
   - **RECOMENDACIÓN**: Mantener esta relación documentada

5. **Base64 en DB para POD**:
   - Imágenes de DNI se guardan como texto en PostgreSQL
   - **PROBLEMA**: Puede inflar tamaño de BD y afectar performance
   - **ALTERNATIVA**: Considerar almacenamiento en S3/object storage

6. **CORS hardcodeado**:
   - `main.ts` tiene orígenes fijos: `['https://admin.syscargo.cu', 'https://tms.syscargo.cu']`
   - **ADVERTENCIA**: Cambiar sin actualizar ambos fronts causará errores CORS

7. **Body limit 20MB**:
   - Configurado en `main.ts` para soportar base64
   - **IMPACTO**: Requests >20MB serán rechazados

### Qué NUNCA Modificar Sin Revisar Dependencias

1. **BasicEntity**: Todas las entidades heredan de ella. Cambios afectan TODO el modelo de datos.

2. **User entity y Role**: Auth, notificaciones, cargas, clientes, prestatarios dependen de ellas.

3. **CargaStatus enum**: Define el flujo de negocio completo. Agregar estado requiere actualizar lógica en múltiples services.

4. **JwtModule configuration**: Secret y expiración impactan toda la autenticación.

5. **Global interceptors/pipes**: ClearWhiteSpaceInterceptor y ValidationPipe son globales. Cambios afectan todos los endpoints.

6. **Router guards (frontend)**: La lógica de redirect por rol está duplicada en path "/" y "/dashboard". Modificar en un lugar requiere actualizar el otro.

### Áreas Frágiles o Altamente Acopladas

1. **AuthService**: Conoce estructura de User, Role, PasswordResetToken. Muy acoplado.

2. **CargaService**: Depende de Client, Notification, y conoce lógica de permisos. Podría beneficiarse de patrón Strategy para diferentes tipos de carga.

3. **AuthStore (frontend)**: Conoce estructura exacta de response de /signin. Cambio en backend rompe frontend.

4. **Router index.ts (admin)**: Lógica de redirección por rol está hardcodeada. Agregar nuevo rol requiere modificar aquí.

5. **ormconfig.ts**: Lista explícita de entidades. Nueva entidad debe añadirse manualmente aquí.

6. **docker-compose.yml**: Límites de recursos (RAM, CPU) hardcodeados. Escalar requiere modificar aquí.

### Deuda Técnica Identificada

1. **DTOs incompletos**: Algunos endpoints usan `any` en lugar de DTOs tipados.

2. **Logging inconsistente**: Algunos services usan Logger, otros console.log.

3. **Manejo de errores**: Algunos catch retornan undefined en lugar de lanzar excepciones.

4. **Tests insuficientes**: Solo algunos modules tienen specs. Coverage bajo.

5. **Documentación Swagger**: Configurada pero títulos genéricos ("FIN AUTO").

6. **Magic strings**: IDs de roles hardcodeados en auth.service.ts (`792e024b-f781-4f39-ba6a-2445fc1db712`).

7. En el perfil crea otra modalidad otros servicios logistica para ahí agregar todo lo que tenemos perdido para el marketplace

8. En el perfil del cliente Cuando esta haciendo la demanda al prestatario Hay que hacer un reglón Adquirir seguro (Si o No) Si  dice si un cuadro de número valor factura Adjuntar pdf con la factura Distinguir de ese seguro **Transporte Terrestre (20%)** o **Aéreo-Marítimo (15%)**

**Actualización realizada**: Los tipos de carga para seguro se cambiaron de "Carga general" y "Contenedor" a "**Transporte Terrestre (20%)**" y "**Aéreo-Marítimo (15%)**". Este cambio se implementó en:
- Frontend: `tms-front-admin/src/views/cliente/FormularioPeticion.vue` (líneas 169-170)
- Backend Entity: `tms-backend/src/solicitudes/solicitudes.entity.ts` (línea 175)
- Backend Service: `tms-backend/src/solicitudes/solicitudes.service.ts` (línea 29)

---

## Checklist de Contexto

- [x] Un nuevo desarrollador puede entender el proyecto leyendo solo este archivo.
- [x] Se pueden identificar qué archivos tocar para una feature típica.
- [x] Las dependencias entre módulos están claras.

**Secciones con información incompleta detectada**:

1. **[INCOMPLETO] Configuración SMTP para envío de emails**: 
   - El reseteo de contraseña está implementado pero el envío de emails está simulado con `console.log` en `auth.service.ts` (línea 307-311)
   - No hay proveedor SMTP configurado en `.env.development`
   - Para implementar: instalar `@nestjs-modules/mailer` + `nodemailer`, configurar servicio de email en `auth.service.ts`

2. **[INCOMPLETO] Tests en frontend**: 
   - No existen tests en `tms-front-admin` ni `tms-front-cliente`
   - Recomendado: agregar Vitest o Cypress para testing de componentes y E2E

3. **[INCOMPLETO] Fixtures/mocks específicos**: 
   - Backend tiene tests unitarios Jest (*.spec.ts) pero sin fixtures centralizados
   - Los mocks se crean inline en cada spec file

4. **[INCOMPLETO] Migraciones de base de datos**:
   - Scripts disponibles en package.json (`migration:generate`, `migration:run-dev`) pero no hay migraciones generadas
   - Directorio `src/database/migrations/` no existe
   - Actualmente se usa `synchronize: true` en ormconfig.ts (riesgoso en producción)
   - Recomendado: generar migraciones con `npm run migration:generate -- --name=InitialSetup`

5. **[INCOMPLETO] Tests E2E con Pactum**:
   - Librería pactum instalada (package.json línea 50) pero directorio `test/` no existe
   - Script `test:e2e` configurado en package.json pero sin tests implementados

6. **[INCOMPLETO] Endpoints de Gestión de Direcciones por Cliente/Prestatario**:
   - Existe entidad `AddressDetail` en `src/address-details/` pero es genérica
   - NO existen endpoints específicos para guardar/listar direcciones frecuentes de clientes (`POST /cliente/:id/direcciones`, `GET /cliente/:id/direcciones`)
   - NO existen endpoints específicos para "callejón" de prestatarios (`POST /prestatario/:id/direcciones`, `GET /prestatario/:id/direcciones`)
   - El formulario de peticiones usa campos de texto libre para origen/destino sin reutilizar historial
   - Para implementar: crear módulos `cliente-direcciones` y `prestatario-direcciones` con relaciones y endpoints CRUD

7. **[INCOMPLETO] Módulo de Ofertas con Integración de Seguros**:
   - NO existe módulo `ofertas` en el backend
   - El cálculo de seguro está implementado en `solicitudes` pero no hay endpoint separado `POST /ofertas/calcular-seguro`
   - No hay tabla `ofertas` que consolide flete + seguro
   - El flujo actual: cliente crea solicitud → prestatario asignado gestiona directamente
   - Para implementar completo: crear módulo `ofertas` con entity, controller, service; endpoint de cálculo; integración con seguros

8. **[INCOMPLETO] RLS (Row Level Security) / Guards de Acceso por Rol**:
   - NO hay implementación de RLS en PostgreSQL
   - Los controllers no usan Guards para restringir acceso por rol (ej: cliente solo ve sus solicitudes)
   - No hay validación de propiedad de recursos antes de operaciones CRUD
   - Para implementar: crear Guards personalizados (`OwnsResourceGuard`), policies de RLS en DB, o filtros que validen `user.id === resource.owner_id`

---

*Última actualización: Mayo 2025*
*Versión del Documento: 2.0*
*Generado por análisis estático de código fuente*