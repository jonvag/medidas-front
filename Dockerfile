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

EXPOSE 4700