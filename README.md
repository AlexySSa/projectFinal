# Bahn

Bahn es una plataforma web para publicar, explorar y reservar vehiculos en alquiler. El proyecto incluye autenticacion con roles, favoritos, gestion de vehiculos por parte del arrendador y flujo de reserva con PayPal o modo simulado.

> Nota: aunque este repositorio esta dentro de una carpeta de Laravel, la aplicacion actual no usa Laravel. El stack real es React + Vite en el frontend y Node.js + Express + MySQL en el backend.

## Estructura del repositorio

El codigo principal vive dentro de una carpeta anidada:

```text
projectFinal/
  README.md
  Proyecto final web/
    Proyecto final web/
      src/               # frontend React
      public/            # imagenes y assets
      server/            # API Express + MySQL
      vite.config.js
      package.json
```

Por eso, la mayoria de comandos de este README se ejecutan dentro de:

```powershell
cd "Proyecto final web/Proyecto final web"
```

## Tecnologias

- React 18
- Vite
- React Router DOM
- Node.js
- Express
- MySQL / MariaDB
- JWT
- bcryptjs
- PayPal Checkout

## Funcionalidades

- Registro e inicio de sesion
- Roles `cliente` y `arrendador`
- Catalogo de vehiculos con busqueda y filtro por categoria
- Vista de detalle por vehiculo
- Favoritos por usuario autenticado
- Publicacion de nuevos vehiculos
- Vista de "Mis vehiculos" para el arrendador
- Reserva con validacion de fechas ocupadas
- Pago con PayPal o flujo simulado cuando no hay credenciales configuradas

## Requisitos

- Node.js 18 o superior
- npm
- MySQL 8+ o MariaDB compatible

## Instalacion

Instala dependencias del frontend:

```powershell
cd "Proyecto final web/Proyecto final web"
npm install
```

Instala dependencias del backend:

```powershell
cd "Proyecto final web/Proyecto final web/server"
npm install
```

## Variables de entorno

### Backend

Crea el archivo `Proyecto final web/Proyecto final web/server/.env`:

```env
PORT=4000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=bahn
JWT_SECRET=bahn_secret
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=
PAYPAL_SECRET=
```

### Frontend

Si quieres usar el boton real de PayPal en el cliente, crea `Proyecto final web/Proyecto final web/.env`:

```env
VITE_PAYPAL_CLIENT_ID=tu_paypal_client_id
```

Si no configuras PayPal, el proyecto sigue funcionando con un flujo simulado para completar reservas.

## Base de datos

El backend incluye un script para crear la base de datos, las tablas y datos iniciales:

```powershell
cd "Proyecto final web/Proyecto final web/server"
npm run init-db
```

Ese comando:

- crea la base `bahn`
- ejecuta `server/schema.sql`
- crea un usuario demo
- inserta un vehiculo de ejemplo

### Usuario demo

- Correo: `demo@bahn.com`
- Contrasena: `demo1234`
- Rol: `arrendador`

## Ejecucion en desarrollo

Levanta el backend en una terminal:

```powershell
cd "Proyecto final web/Proyecto final web/server"
npm run dev
```

Levanta el frontend en otra terminal:

```powershell
cd "Proyecto final web/Proyecto final web"
npm run dev
```

URLs por defecto:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

Vite ya tiene configurado un proxy para redirigir `/api` al backend local.

## Scripts disponibles

### Frontend

- `npm run dev`: inicia Vite en desarrollo
- `npm run build`: genera la version de produccion
- `npm run preview`: sirve el build generado

### Backend

- `npm run dev`: inicia el servidor con `node --watch`
- `npm run start`: inicia el servidor con Node
- `npm run init-db`: crea base, tablas y datos demo

## API principal

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/vehiculos`
- `GET /api/vehiculos/:id`
- `GET /api/vehiculos/mios`
- `POST /api/vehiculos`
- `GET /api/favoritos`
- `GET /api/favoritos/ids`
- `POST /api/favoritos/:id`
- `GET /api/reservas`
- `GET /api/reservas/ocupadas/:vehiculoId`
- `GET /api/paypal/config`
- `POST /api/paypal/create-order`
- `POST /api/paypal/capture/:orderId`

## Rutas del frontend

- `/`
- `/auth`
- `/catalogo`
- `/vehiculo/:id`
- `/favoritos`
- `/reservar/:id`
- `/mis-vehiculos`
- `/nuevo-vehiculo`

## Notas utiles

- Las rutas `/mis-vehiculos` y `/nuevo-vehiculo` requieren sesion iniciada.
- El token se guarda en `localStorage` bajo la clave `bahn_token`.
- La informacion del usuario se guarda en `localStorage` bajo la clave `bahn_user`.
- Las fechas ocupadas se consultan antes de confirmar una reserva para evitar cruces.
- Si usas este proyecto en Windows o PowerShell, manten las comillas en los `cd` porque las carpetas tienen espacios.
