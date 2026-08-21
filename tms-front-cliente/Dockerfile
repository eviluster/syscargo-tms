# ============================================================================
# STAGE: Development
# ============================================================================
FROM node:22-alpine AS development

WORKDIR /app
COPY package*.json ./
RUN npm install && npm cache clean --force
COPY . .
EXPOSE 80
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "80"]

# ============================================================================
# STAGE 1: Builder (TU CÓDIGO EXISTENTE, SIN CAMBIOS)
# ============================================================================
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci && npm cache clean --force
COPY . .
RUN npm run build
RUN test -d dist || (echo "❌ dist/ no fue creado" && exit 1) && ls -lah dist/

# ============================================================================
# STAGE 2: Production (TU CÓDIGO EXISTENTE, SIN CAMBIOS)
# ============================================================================
FROM nginx:1.30-alpine
LABEL maintainer="DevOps Team"
LABEL version="1.0"
LABEL description="TMS Frontend Cliente (Vite + Vue3 + Vuetify) optimized"
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=10s \
  CMD wget -q -O - http://localhost/ > /dev/null || exit 1
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
