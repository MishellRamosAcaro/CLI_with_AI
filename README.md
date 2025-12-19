# Search Web

Proyecto CLI en Node.js que permite hacer preguntas y recibir respuestas apoyadas en búsquedas web en tiempo real. Desarrollado en el Máster de Desarrollo con IA gracias a The Big School.

CLI Node.js that answers questions using real-time web search. Built in the Master in AI Development thanks to The Big School.

## Requisitos / Requirements
- Node.js 20+ y pnpm / Node.js 20+ and pnpm.
- Claves de API / API keys:
  - `GOOGLE_API_KEY` (Gemini)
  - `TAVILY_API_KEY` (Tavily Search)

## Configuración / Setup
1. Instala dependencias / Install dependencies:
   ```bash
   pnpm install
   ```
2. Crea un archivo `.env` en la raíz / Create a `.env` file at the project root:
   ```bash
   GOOGLE_API_KEY=tu_clave_de_gemini
   TAVILY_API_KEY=tu_clave_de_tavily
   ```
   Replace with your Gemini and Tavily API keys.

## Ejecución / Run
CLI interactivo / Interactive CLI:
```bash
pnpm start
```
Iniciará un prompt para tus preguntas; usa `exit` o `quit` para salir. Starts a prompt for your questions; use `exit` or `quit` to exit.

## Componentes principales / Main components
- **Tool `searchWeb`** (`src/agent.js`, `src/search.js`): herramienta Genkit que envuelve la API de Tavily para obtener resultados web formateados. Genkit tool wrapping Tavily search to return formatted web results.
- **Prompt Genkit `searchPrompt`** (`src/agent.js`): prompt estructurado que puede invocar `searchWeb`, sintetiza resultados y cita fuentes. Structured prompt that can call `searchWeb`, synthesizes results, and cites sources.
- **Agente de chat** (`index.js`, `src/agent.js`): inicializa Genkit con Gemini y Tavily, ejecuta el prompt y gestiona el flujo interactivo en consola. Initializes Genkit with Gemini and Tavily, runs the prompt, and handles the interactive console flow.

## Scripts disponibles / Scripts
- `pnpm start`: ejecuta el CLI. / run the CLI.
- `pnpm dev`: modo desarrollo con `genkit start` y recarga de `index.js`. / dev mode with `genkit start` and reload of `index.js`.

## Notas / Notes
- Asegúrate de que las claves de API están activas y con cuota suficiente. Ensure API keys are active and have quota.
- El modelo usado por defecto es `gemini-2.5-flash`; ajústalo en `index.js` si lo necesitas. Default model is `gemini-2.5-flash`; adjust in `index.js` if needed.
