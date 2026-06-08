# ============================================================================
# STAGE 1: Builder (Node 22 Alpine)
# ============================================================================
FROM node:22-alpine AS builder

WORKDIR /app

# ARG para variables de build (Vite)
ARG VITE_API_BASE_URL=https://api.syscargo.cu
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Instalar dependencias PRIMERO
COPY package*.json ./

# npm ci en vez de npm install
# --legacy-peer-deps solo si es absolutamente necesario
# Si puedes, quitalo después de resolver conflictos
RUN npm ci && npm cache clean --force

# Copiar CÓDIGO fuente (después de deps, para cache)
COPY . .

# Build con Vite
# Vite compila a /dist por defecto
RUN npm run build-only

# Verificar que dist se creó
RUN test -d dist || (echo "❌ dist/ no fue creado" && exit 1) && ls -lah dist/

# ============================================================================
# STAGE 2: Production (nginx Alpine)
# ============================================================================
FROM nginx:1.30-alpine

# Etiqueta
LABEL maintainer="DevOps Team"
LABEL version="1.0"
LABEL description="TMS Frontend Admin (Vite + Vue3) optimized"

# Copiar archivos compilados desde builder
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Copiar configuración nginx
# IMPORTANTE: Este archivo debe existir en tú repo como nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=10s \
  CMD wget -q -O - http://localhost/ > /dev/null || exit 1

# Usuario nginx ya existe en nginx:alpine y corre como no-root

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]