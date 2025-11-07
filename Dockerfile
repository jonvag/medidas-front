# Etapa 1: Build del proyecto Angular
# Usamos node:20-alpine para la compilación, es ligero y eficiente.
FROM node:20-alpine as build-stage

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos solo los archivos de dependencias para aprovechar el cache de Docker
COPY package*.json ./
# Instalamos las dependencias
RUN npm install

# Copiamos el resto de la app
COPY . .

# Construimos el proyecto en modo producción
# --output-path no es necesario aquí si ya está en angular.json
# Usamos --output-path=dist/medidas para ser explícitos
RUN npm run build -- --configuration production

# ------------------------------------------------------------------
# Etapa 2: Producción con NGINX
# Usamos una imagen de NGINX muy ligera
FROM nginx:alpine as production-stage

# Copiamos la configuración personalizada de nginx (asumimos que existe)
# Si no tienes un nginx.conf personalizado, omite esta línea.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# COPIA CRÍTICA: Copiamos los archivos compilados de Angular.
# La ruta correcta es /app/dist/medidas/browser debido al 'application' builder y tu 'outputPath'.
COPY --from=build-stage /app/dist/medidas/browser /usr/share/nginx/html

# Ajuste del Puerto (NGINX usa 80 por defecto, lo ajustamos para seguir la convención)
# Si no cambiaste el puerto 80 en tu nginx.conf, usa EXPOSE 80
EXPOSE 80

# Comando para iniciar NGINX
CMD ["nginx", "-g", "daemon off;"]
