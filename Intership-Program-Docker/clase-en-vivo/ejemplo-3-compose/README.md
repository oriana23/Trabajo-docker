# Ejemplo 3 — Docker Compose: web + base de datos

## Concepto

Hasta ahora levantamos contenedores de a uno con `docker run`.
Docker Compose permite definir **múltiples servicios en un solo archivo**
y levantarlos todos juntos con un comando.

---

## Estructura

```
ejemplo-3-compose/
├── docker-compose.yml   ← define los 3 servicios
└── html/
    └── index.html       ← la web que sirve Nginx
```

---

## Demo

### 1. Leer el docker-compose.yml juntos

Recorrer el archivo y explicar cada bloque:
- `services` → los contenedores que vamos a levantar
- `image` → qué imagen usa cada uno
- `ports` → qué puertos exponemos al host
- `volumes` → qué montamos y qué persistimos
- `networks` → cómo se comunican entre sí
- `depends_on` → orden de arranque

### 2. Levantar todo el stack

```bash
docker compose up -d
```

Un solo comando levanta los 3 servicios.

### 3. Verificar

```bash
docker compose ps
```

Los 3 servicios deben aparecer como `running`.

### 4. Abrir la web

```
http://localhost:8080
```

### 5. Abrir el gestor de base de datos

```
http://localhost:8081
```

Conectarse con:
- **System**: PostgreSQL
- **Server**: `db`  ← nombre del servicio, no localhost
- **Username**: `admin`
- **Password**: `secret`
- **Database**: `demo`

> El server es `db` porque los contenedores se comunican
> por nombre de servicio dentro de la red de Docker.

### 6. Mostrar los logs de todos los servicios

```bash
docker compose logs -f
```

### 7. Bajar todo

```bash
docker compose down
```

Un solo comando detiene y elimina todos los contenedores y la red.

---

## Puntos clave

- `docker compose up -d` levanta todo el stack
- `docker compose down` baja todo limpio
- Los servicios se comunican entre sí por **nombre de servicio** (no por IP)
- El volumen `db-data` persiste los datos de PostgreSQL aunque se baje el stack
- `depends_on` garantiza que la DB arranque antes que la web y el gestor
