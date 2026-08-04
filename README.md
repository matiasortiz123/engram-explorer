# Engram Explorer

Web UI para explorar la memoria local de [Engram](https://github.com/Gentleman-Programming/engram). Muestra proyectos, observaciones filtradas por tipo y pendientes extraídos de los session summaries.

## Requisitos

- Node.js 18+
- [Engram](https://github.com/Gentleman-Programming/engram) instalado

## Pasos para levantar

**1. Clonar el repo**
```bash
git clone https://github.com/matiasortiz123/engram-explorer.git
cd engram-explorer
```

**2. Instalar dependencias**
```bash
npm install
```

**3. Abrir dos terminales**

Terminal 1 — levantar Engram (desde cualquier carpeta):
```bash
engram serve
```

Terminal 2 — levantar la app (desde la carpeta `engram-explorer`):
```bash
npm run dev
```

**4. Abrir el browser**

Entrá a `http://localhost:5173`

> Ambas terminales tienen que estar corriendo al mismo tiempo para que la app funcione.

## Stack

- React + Vite + TypeScript
- Tailwind CSS
- Conecta a Engram HTTP API en `localhost:7437` vía proxy de Vite
