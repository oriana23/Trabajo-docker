# Ejemplo 1 — docker pull + docker run + logs

## Concepto

Usar una imagen **oficial** de Docker Hub sin escribir nada de código.
Docker ya tiene miles de imágenes listas para usar.

---

## Demo

### 1. Descargar la imagen oficial de Nginx

```bash
docker pull nginx
```

Observar cómo Docker descarga las capas (layers) de la imagen.

### 2. Correr el contenedor

```bash
docker run -d -p 8080:80 --name mi-nginx nginx
```

- `-d` → corre en background (detached)
- `-p 8080:80` → puerto 8080 de tu máquina → puerto 80 del contenedor
- `--name mi-nginx` → le damos un nombre para referenciarlo fácil

### 3. Verificar que está corriendo

```bash
docker ps
```

### 4. Abrir en el browser

```
http://localhost:8080
```

Debería aparecer la página de bienvenida de Nginx.

### 5. Ver los logs en tiempo real

```bash
docker logs -f mi-nginx
```

Refrescar el browser y observar cómo aparecen los logs de cada request.
`Ctrl+C` para salir del modo follow.

### 6. Limpiar

```bash
docker stop mi-nginx
docker rm mi-nginx
```

---

## Puntos clave

- No escribimos ningún archivo, no instalamos nada — Docker se encarga de todo
- La imagen viene de **Docker Hub** (`hub.docker.com`)
- Un **contenedor** es una instancia corriendo de una **imagen**
- `docker ps` muestra los contenedores activos
- Los logs del contenedor se ven con `docker logs`
