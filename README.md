# E-commerce React

Proyecto de tienda en línea con frontend en React + Vite y backend en Node.js + Express.

## Requisitos

- Node.js 18+ (o compatible)
- npm

## Instalación en local

1. Abre una terminal en la carpeta del proyecto.
2. Instala las dependencias:

```bash
npm install
```

3. Si ya existe un archivo `shop.db` en el proyecto, no necesitas crear nada más. El servidor inicializa la base de datos automáticamente.

## Ejecutar el proyecto

### Opción 1: Ejecutar backend solo

Este comando inicia el servidor Express:

```bash
npm run server
```

Luego abre el navegador en:

```text
http://localhost:4000
```

### Opción 2: Ejecutar frontend y backend en desarrollo

Este comando ejecuta ambos servicios en paralelo:

```bash
npm run dev
```

- El frontend corre en `http://localhost:5173`
- El backend corre en `http://localhost:4000`

### Opción 3: Compilar el frontend y servirlo desde el backend

1. Genera la versión de producción del frontend:

```bash
npm run build
```

2. Inicia el servidor Express que sirve la carpeta `frontend/dist`:

```bash
npm run server
```

Luego abre:

```text
http://localhost:4000
```

## Scripts disponibles

- `npm run server` - inicia el servidor backend
- `npm run client` - inicia Vite para el frontend
- `npm run dev` - ejecuta backend y frontend juntos
- `npm run build` - compila el frontend en producción
- `npm run preview` - vista previa de la build de Vite

## Nota

El backend usa SQLite (`shop.db`). En desarrollo, los datos se guardan en este archivo local.
