# Etapa 1: Build del proyecto Angular
FROM node:20-alpine as build-stage

WORKDIR /app

# Copiamos los archivos de definiciones e instalamos dependencias
COPY package*.json ./
RUN npm install

# Copiamos el resto de la app
COPY . .

# Construimos el proyecto en modo producción
RUN npm run build -- --configuration production

# Etapa 2: Producción con NGINX
FROM nginx:alpine as production-stage

# Copiamos configuración personalizada de nginx si la tienes
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos los archivos generados en la carpeta dist/project-name/browser
COPY --from=build-stage /app/dist/medidas/browser /usr/share/nginx/html

# Exponemos el puerto que usará NGINX
EXPOSE 3200

# Comando para iniciar NGINX
CMD ["nginx", "-g", "daemon off;"]
