# ============================================================================
# STAGE 1: Builder (Node 22 Alpine)
# ============================================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Instalar dependencias PRIMERO (se cachea mientras package.json no cambie)
COPY package*.json ./

# npm ci es mejor que npm install en Docker (determinístico, más seguro)
# --omit=dev evita instalar dev-dependencies en build
RUN npm ci && npm cache clean --force

# Copiar CÓDIGO fuente (aquí, después de deps)
# Cambios en código no invalidan cache de npm
COPY . .

# Build de la app
RUN npm run build

# ============================================================================
# STAGE 2: Production (Node 22 Alpine)
# ============================================================================
FROM node:22-alpine AS production

WORKDIR /app

# Etiqueta para debugging
LABEL maintainer="DevOps Team"
LABEL version="1.0"
LABEL description="TMS Backend NestJS optimized"

# Copiar package.json para instalar SOLO dependencias de producción
COPY package*.json ./

# Instalar SOLO dependencias de producción
# --omit=dev excluye devDependencies
RUN npm ci --omit=dev && npm cache clean --force

# Copiar código compilado desde builder
COPY --from=builder /app/dist ./dist

# Crear directorio para uploads y otros directorios necesarios
RUN mkdir -p /app/uploads /app/logs && \
    chmod 755 /app/dist

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

# Cambiar propiedad de directorios al usuario nestjs
RUN chown -R nestjs:nodejs /app/uploads /app/logs /app/dist

USER nestjs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=10s \
  CMD node -e "require('http').get('http://127.0.0.1:5000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

EXPOSE 5000

CMD ["node", "dist/src/main.js"]