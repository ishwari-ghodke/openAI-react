# Ask OpenAI – React + OpenAI API

A small React app: type a prompt, it calls the OpenAI Chat Completions API, and shows the response.

## How it works

```
React (Vite)  --POST /api/chat-->  Express server  --chat.completions-->  OpenAI
   browser                      (holds the API key)
```

- `src/components/AskOpenAI.jsx` – the React component (prompt box, loading state, error state, response).
- `server.js` – tiny Express server. It validates the input, calls OpenAI and returns `{ reply }`.
- The API key stays on the server (`.env`), so it is never shipped to the browser.

## Run it

Requires Node 18+.

```bash
npm install
cp .env.example .env      # then put your real OPENAI_API_KEY in .env
npm run dev
```

Open http://localhost:5173. The API server runs on port 3001 and Vite proxies `/api` to it.

## Configuration

| Variable | Default | Purpose |
|---|---|---|
| `OPENAI_API_KEY` | – (required) | Your OpenAI key |
| `OPENAI_MODEL` | `gpt-4o-mini` | Chat model to use |
| `PORT` | `3001` | API server port |

## Design decisions

- **Backend proxy instead of calling OpenAI from the browser** – a key in frontend code is visible to anyone.
- **Basic input validation** – empty and over-long prompts are rejected on both client and server.
- **Loading and error states** – the button is disabled while a request is running, and API errors (bad key, rate limit) are shown to the user.
- **Ctrl/Cmd + Enter** submits from the text box.

## What I would add with more time

- Streaming the response token by token
- Conversation history (multi-turn chat)
- Rate limiting on the API route and tests for the server
