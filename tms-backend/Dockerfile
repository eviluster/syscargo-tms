# Etapa de construcción con todas las dependencias
FROM node:22.12-alpine AS builder
WORKDIR /app

#Arrelgar DNS

# Copia solo los archivos necesarios
COPY package*.json ./
RUN npm ci

# Copia todo el backend
COPY . .
RUN npm run build

# Etapa produccion
FROM node:22.12-alpine
WORKDIR /app

# Copia los archivos necesarios desde la etapa de construcción
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist

# Expone el puerto y ejecuta la aplicación
EXPOSE 5001
CMD ["node", "dist/src/main.js"]
