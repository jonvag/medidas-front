# Usa una imagen de Node.js para construir la aplicación
FROM node:18.19.1-alpine AS build

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos del proyecto y instala las dependencias
COPY package.json package-lock.json ./
RUN npm install

# Copia el resto del código fuente
COPY . .

# Construye la aplicación en modo de producción
RUN npm run build -- --output-path=./dist/out --base-href=/

# Usa una imagen de Nginx para servir la aplicación
FROM nginx:alpine

# Copia los archivos de la aplicación desde la etapa de construcción a la carpeta de Nginx
COPY --from=build /app/dist/out /usr/share/nginx/html

# Copia la configuración de Nginx (necesaria para las rutas de Angular)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expone el puerto 80 (puerto por defecto de Nginx)
EXPOSE 80