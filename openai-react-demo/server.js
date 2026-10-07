import "dotenv/config";
import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const MAX_PROMPT_LENGTH = 2000;

// The API key lives only here on the server (from .env), never in the React bundle.
let client;
function getClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing. Add it to your .env file and restart the server.");
  }
  client ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return client;
}

app.post("/api/chat", async (req, res) => {
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";

  if (!message) {
    return res.status(400).json({ error: "Please enter a message." });
  }
  if (message.length > MAX_PROMPT_LENGTH) {
    return res.status(400).json({ error: `Message is too long (max ${MAX_PROMPT_LENGTH} characters).` });
  }

  try {
    const completion = await getClient().chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: "You are a helpful assistant. Keep answers clear and concise." },
        { role: "user", content: message },
      ],
    });
    res.json({ reply: completion.choices[0]?.message?.content ?? "" });
  } catch (err) {
    console.error("OpenAI request failed:", err.message);
    const status = err.status && err.status >= 400 && err.status < 600 ? err.status : 500;
    res.status(status).json({ error: err.message || "Something went wrong calling OpenAI." });
  }
});

app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`));
