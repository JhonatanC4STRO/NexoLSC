# 1) Compilar la página
FROM node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
# --ignore-scripts: onnxruntime-node (dependencia de transformers.js) no hace falta en el navegador
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

# 2) Servirla con nginx
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
