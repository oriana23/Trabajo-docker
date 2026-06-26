# Práctica — Docker Compose Stack

## Objetivo

Configurar una aplicación multi-servicio usando Docker Compose.
El stack debe incluir un servidor web, una API, una base de datos y un gestor de base de datos, levantando todo con un solo comando.

Al terminar el juego, el puntaje del jugador tiene que guardarse en la base de datos y mostrarse en el leaderboard.

---

## Qué armar

### Servicio 1 — Web

- Completar el `Dockerfile` dentro de la carpeta `web/` para que sirva los archivos HTML usando **Nginx**
- La carpeta `web/` ya incluye un archivo `nginx.conf` que hay que copiar dentro de la imagen
- El juego tiene que ser accesible en **http://localhost:8080**

### Servicio 2 — API

- La carpeta `api/` ya tiene el código listo (`index.js`, `package.json`), pero el `Dockerfile` hay que completarlo
- Expone el puerto **3000** internamente
- Necesita conectarse a la base de datos usando variables de entorno:
  - `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- **No** debe exponer su puerto al host (Nginx actúa como proxy)

### Servicio 3 — Base de datos

- Usar la imagen **`postgres:16-alpine`**
- Configurarla con las siguientes variables de entorno:
  - `POSTGRES_DB`: nombre de la base de datos
  - `POSTGRES_USER`: usuario
  - `POSTGRES_PASSWORD`: contraseña
- Los datos tienen que guardarse usando la carpeta **`./data/pgdata`** del proyecto como volumen, montada en `/var/lib/postgresql/data` dentro del contenedor
- Al hacer `docker compose up`, la carpeta `data/pgdata/` se va a llenar con los archivos internos de PostgreSQL — eso confirma que el volumen está funcionando
- **No** debe exponer su puerto al host

### Servicio 4 — Gestor de base de datos

- Usar la imagen **`adminer`**
- El gestor tiene que ser accesible en **http://localhost:8081**
- Tiene que poder conectarse al servicio de base de datos

---

## Requisitos

- Todos los servicios deben comunicarse a través de una **red Docker compartida**
- Los servicios `web` y `api` deben declarar dependencia de `db` (`depends_on`)
- Hacer `docker compose down` tiene que preservar los datos de la base de datos
- Hacer `docker compose up -d` tiene que levantar los 4 servicios a la vez

---

## Entregables

- `web/Dockerfile` — completo (nginx + nginx.conf)
- `api/Dockerfile` — completo (Node.js)
- `docker-compose.yml` — completo con los 4 servicios, el volumen y la red
- Capturas de pantalla que muestren:
  - La salida de `docker compose up -d --build` sin errores
  - La salida de `docker compose ps` con los 4 servicios corriendo
  - El juego funcionando en el browser (`http://localhost:8080`)
  - El leaderboard con al menos un puntaje guardado
  - La tabla `scores` visible en Adminer (`http://localhost:8081`)
  - La salida de `docker compose ps` después de hacer `down` y `up -d` nuevamente, confirmando que los datos persisten

---

## Cómo probar la solución

```bash
# Levantar el stack
docker compose up -d --build

# Los 4 servicios deben aparecer como running
docker compose ps

# Abrir el juego, jugar hasta ganar y verificar que aparece el leaderboard
# → http://localhost:8080

# Abrir el gestor y verificar que existe la tabla "scores" con los datos
# → http://localhost:8081
#   System:   PostgreSQL
#   Server:   db
#   Username: intern
#   Password: docker123
#   Database: internrace

# Verificar que el volumen persiste después de reiniciar
docker compose down
docker compose up -d
# → los scores guardados deben seguir ahí
```
