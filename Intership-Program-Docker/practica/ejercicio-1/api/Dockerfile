FROM node:20-alpine

# Establezco el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copio primero solo el package.json para aprovechar el cache de capas:
# si las dependencias no cambian, Docker no las reinstala en cada build
COPY package.json .

# Instalo solo las dependencias de producción
RUN npm install --omit=dev

# Copio el resto del código fuente
COPY index.js .

# La app escucha en el puerto 3000
EXPOSE 3000

# Comando que arranca la API cuando el contenedor inicia
CMD ["node", "index.js"]
