# Bahn Platform

Prototipo funcional de la plataforma `Bahn` inspirado en el mockup compartido: landing page, login/registro, catalogo, detalle de vehiculo, wishlist y dashboard CRUD para arrendadores.

## Ejecutar

```bash
npm start
```

Luego abre `http://localhost:3000`.

## Demo

- Arrendador: `owner@bahn.com` / `123456`
- Cliente: `client@bahn.com` / `123456`

## Estructura

- `server.js`: servidor HTTP sin dependencias externas y API mock.
- `public/`: vistas, estilos, scripts y assets SVG.
- `data/`: datos JSON para usuarios y vehiculos.
- `database/schema.sql`: base relacional sugerida para MySQL.

## Nota

La autenticacion y la persistencia estan montadas como demo local con archivos JSON para que el proyecto arranque sin instalar servicios extra.
