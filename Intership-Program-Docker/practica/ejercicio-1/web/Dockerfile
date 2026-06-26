FROM nginx:alpine

# Copio el archivo de configuración personalizado al lugar donde Nginx
# busca su configuración por defecto (reemplaza el default.conf)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copio todos los archivos HTML al directorio que Nginx sirve como root
COPY *.html /usr/share/nginx/html/

# Nginx escucha en el puerto 80 dentro del contenedor
EXPOSE 80
