# Engram Explorer

Web UI para explorar la memoria local de [Engram](https://github.com/Gentleman-Programming/engram). Muestra proyectos, observaciones filtradas por tipo y pendientes extraídos de los session summaries.

## Requisitos

- Node.js 18+
- [Engram](https://github.com/Gentleman-Programming/engram) instalado

## Cómo levantar

```bash
# 1. En una terminal: levantar Engram
engram serve

# 2. En otra terminal: levantar la app
npm install
npm run dev
```

Abrí `http://localhost:5173` en el browser.

## Stack

- React + Vite + TypeScript
- Tailwind CSS
- Conecta a Engram HTTP API en `localhost:7437` vía proxy de Vite
