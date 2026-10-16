# Mini Sistema de Inventario

Aplicación web para gestionar el inventario de productos, con operaciones CRUD completas (crear, listar, editar y eliminar).

**Stack:** Java 17 + Spring Boot 3.5 · React (Vite) · PostgreSQL 16 · Docker Compose

## Requisitos previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop) instalado y **en ejecución** (incluye Docker Compose).
- Git.
- Puertos libres en la máquina host: **3000**, **8080** y **5434**.

No hace falta instalar Java, Node ni PostgreSQL: todo se construye dentro de los contenedores.

## Cómo ejecutar el proyecto

**1. Clonar el repositorio**

```bash
git clone https://github.com/H821-code/inventory-system.git
cd inventory-system
```

**2. Construir y levantar los tres servicios con un único comando**

```bash
docker compose up --build
```

La primera vez tarda varios minutos (descarga imágenes y compila backend y frontend).

**3. Abrir la aplicación**

Esperar a que en los logs aparezca `Started InventoryApplication` y abrir http://localhost:3000 en el navegador.

**4. Detener todo**

```bash
docker compose down
```

Los datos se conservan en el volumen `postgres_data`. Para borrarlos también:

```bash
docker compose down -v
```

## URLs y puertos

| Servicio                                         | URL / Puerto                                                                               |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| Frontend (React)                                 | http://localhost:3000                                                                      |
| Frontend, módulo de productos                    | http://localhost:3000/productos                                                            |
| Backend (API REST)                               | http://localhost:8080                                                                      |
| Documentación Swagger                            | http://localhost:8080/swagger-ui.html                                                      |
| PostgreSQL (opcional, para inspeccionar la base) | `localhost:5434` · BD `inventory` · usuario `inventory_user` · contraseña `inventory_pass` |

## Pantallas

- **Inicio** (`/inicio`, ruta por defecto): resumen del inventario con la cantidad de productos, categorías, unidades en stock, valor total y la lista de productos con stock bajo.
- **Productos** (`/productos`): tabla con los productos, formulario para crear y editar con validaciones visuales, y confirmación antes de eliminar.

## API REST

| Método | Endpoint             | Descripción                | Respuestas    |
| ------ | -------------------- | -------------------------- | ------------- |
| GET    | `/api/products`      | Listar todos los productos | 200           |
| GET    | `/api/products/{id}` | Consultar un producto      | 200, 404      |
| POST   | `/api/products`      | Registrar un producto      | 201, 400      |
| PUT    | `/api/products/{id}` | Modificar un producto      | 200, 400, 404 |
| DELETE | `/api/products/{id}` | Eliminar un producto       | 204, 404      |

Modelo de producto:

| Campo         | Regla                                 |
| ------------- | ------------------------------------- |
| `id`          | Autoincremental                       |
| `name`        | Obligatorio, máximo 150 caracteres    |
| `description` | Opcional, máximo 500 caracteres       |
| `price`       | Obligatorio, mayor a 0                |
| `stock`       | Obligatorio, entero mayor o igual a 0 |
| `category`    | Opcional, máximo 100 caracteres       |

## Estructura del proyecto

```
inventory-system/
├── docker-compose.yml
├── db/init.sql                 # Script de creación de la tabla products
├── backend/                    # Spring Boot
│   └── src/main/java/com/techfactory/inventory/
│       ├── controller/         # Endpoints REST
│       ├── service/            # Lógica de negocio
│       ├── repository/         # Acceso a datos (Spring Data JPA)
│       ├── model/              # Entidad JPA
│       ├── dto/                # Objetos de entrada/salida con validaciones
│       ├── exception/          # Manejo global de errores
│       └── config/             # Configuración de CORS
└── frontend/                   # React + Vite
    ├── nginx.conf              # Soporte de rutas de React Router en Docker
    └── src/
        ├── api/                # Llamadas a la API
        ├── components/         # Menú lateral, tabla, formulario y diálogo de confirmación
        └── pages/              # Inicio (resumen) y Productos (CRUD)
```

## Decisiones técnicas

- **Spring Boot 3.5.16:** última versión de la línea 3.x, que es la que pide el enunciado.
- **Arquitectura por capas** (controlador, servicio, repositorio, entidad) con **DTOs**, para no exponer la entidad directamente y validar la entrada.
- **Bean Validation (`@Valid`)** y un **`@RestControllerAdvice`** global que devuelve respuestas de error uniformes (400 con el detalle por campo y 404).
- **`BigDecimal`** para el precio, para evitar errores de redondeo con dinero.
- **Base de datos:** la tabla se crea con el script `db/init.sql`, que PostgreSQL ejecuta al inicializar el contenedor; `ddl-auto: update` queda como respaldo. El script incluye restricciones `CHECK` (precio mayor a 0 y stock mayor o igual a 0) a nivel de base de datos.
- **Configuración por variables de entorno** (`DB_URL`, `DB_USER`, `DB_PASSWORD`, `CORS_ALLOWED_ORIGINS`) con valores por defecto, para que el mismo código funcione en local y en Docker.
- **Docker Compose:** `healthcheck` en PostgreSQL y `depends_on` con `service_healthy`, para que el backend espere a que la base esté lista. El volumen `postgres_data` hace persistentes los datos.
- **Frontend:** React con Vite, `fetch` para consumir la API, validaciones visuales en el formulario y confirmación previa antes de eliminar. Se sirve con nginx en el contenedor.
- **React Router** para la navegación (`/inicio` por defecto y `/productos`), con un `nginx.conf` que redirige a `index.html` para que recargar la página en cualquier ruta funcione dentro de Docker.
- **Swagger/OpenAPI** con `springdoc-openapi` para documentar la API.
