# Ejemplo 2 — Dockerfile + Volumen + edición en tiempo real

## Concepto

Primero construimos una imagen con el HTML **adentro** usando un Dockerfile.
Después mostramos cómo un volumen **pisa** ese contenido en tiempo de ejecución,
permitiendo editar sin hacer `docker build` ni `docker restart`.

---

## Estructura

```
ejemplo-2-volumen/
├── Dockerfile        ← construye la imagen con el HTML adentro
└── html/
    └── index.html    ← el archivo que vamos a servir (y luego editar en vivo)
```

---

## Parte 1 — Imagen con el contenido adentro

### 1. Ver el Dockerfile

```dockerfile
FROM nginx:alpine

COPY html/index.html /usr/share/nginx/html/index.html

CMD ["nginx", "-g", "daemon off;"]
```

- `FROM` → partimos de la imagen oficial de Nginx
- `COPY` → el archivo HTML queda **dentro de la imagen** al hacer build
- `CMD` → el comando que corre cuando arranca el contenedor

### 2. Construir la imagen

```bash
docker build -t nginx-demo .
```

### 3. Correr sin volumen

```bash
docker run -d -p 8080:80 --name nginx-static nginx-demo
```

Abrir `http://localhost:8080` — se ve la página del `html/index.html`.

### 4. Intentar editar en vivo

Modificar `html/index.html` localmente y refrescar el browser.

**No cambia nada.** El archivo está copiado dentro de la imagen — el host ya no tiene efecto.

### 5. Limpiar

```bash
docker stop nginx-static
docker rm nginx-static
```

---

## Parte 2 — Volumen: el host pisa la imagen

### 1. Correr con volumen montado

Desde la carpeta `ejemplo-2-volumen/`:

```bash
docker run -d \
  -p 8080:80 \
  -v "$(pwd)/html:/usr/share/nginx/html" \
  --name nginx-live \
  nginx-demo
```

`-v "$(pwd)/html:/usr/share/nginx/html"` monta la carpeta del host **sobre** la del contenedor, tapando el archivo que estaba adentro de la imagen.

### 2. Abrir en el browser

```
http://localhost:8080
```

### 3. Editar el archivo en vivo

Abrir `html/index.html` con cualquier editor y cambiar el `<h1>`:

```html
<h1>🚀 Cambié esto sin rebuild!</h1>
```

### 4. Refrescar el browser

Sin tocar Docker, sin rebuild, sin restart — el cambio aparece instantáneamente.

### 5. Limpiar

```bash
docker stop nginx-live
docker rm nginx-live
```

---

## Por qué funciona

El volumen no copia archivos — crea un **puntero** directo a la carpeta del host.
Cuando Nginx sirve el archivo, lo lee desde ahí en tiempo real.

```
Tu máquina                    Contenedor
/tmp/nginx-demo/   ────────►  /usr/share/nginx/html/
index.html                    index.html  ← lo que había en la imagen queda tapado
      ↑
   Lo editás acá,
   Nginx lo lee acá mismo
```

## Puntos clave

- `CMD` en el Dockerfile define el proceso que arranca con el contenedor
- Sin volumen: el contenido viene de la imagen (estático, requiere rebuild para cambiar)
- Con volumen: el host pisa la imagen (dinámico, ideal para desarrollo)
- En producción se prefieren imágenes con los archivos adentro — sin dependencias del host
