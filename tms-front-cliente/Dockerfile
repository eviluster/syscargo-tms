# ============================================================================
# STAGE 1: Builder (Node 22 Alpine)
# ============================================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Instalar dependencias PRIMERO
COPY package*.json ./

# npm ci sin legacy-peer-deps si es posible
# Si tienes errores, agrega --legacy-peer-deps aquí
RUN npm ci && npm cache clean --force

# Copiar CÓDIGO fuente (después de deps para cache)
COPY . .

# Build con Vite
RUN npm run build

# Verificar que dist se creó
RUN test -d dist || (echo "❌ dist/ no fue creado" && exit 1) && ls -lah dist/

# ============================================================================
# STAGE 2: Production (nginx Alpine)
# ============================================================================
FROM nginx:1.30-alpine

# Etiqueta
LABEL maintainer="DevOps Team"
LABEL version="1.0"
LABEL description="TMS Frontend Cliente (Vite + Vue3 + Vuetify) optimized"

# Copiar archivos compilados desde builder
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Copiar configuración nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=10s \
  CMD wget -q -O - http://localhost/ > /dev/null || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]