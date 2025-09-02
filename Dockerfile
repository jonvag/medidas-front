# Dockerfile para Angular
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration=production

# Etapa de producción
FROM nginx:alpine

COPY --from=build /app/dist/medidas/browser /usr/share/nginx/html

# Copia configuración personalizada de nginx para Angular
COPY nginx-custom.conf /etc/nginx/conf.d/default.conf

EXPOSE 80