import { useState } from "react";

export default function AskOpenAI() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError("");
    setReply("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed.");
      setReply(data.reply);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Ctrl/Cmd + Enter submits, plain Enter adds a new line.
  function handleKeyDown(e) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmit(e);
  }

  return (
    <section className="card">
      <form onSubmit={handleSubmit}>
        <label htmlFor="prompt">Your prompt</label>
        <textarea
          id="prompt"
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Explain what a React hook is in two sentences."
          maxLength={2000}
        />
        <button type="submit" disabled={loading || !prompt.trim()}>
          {loading ? "Thinking..." : "Send"}
        </button>
      </form>

      {error && <p className="error" role="alert">{error}</p>}

      {reply && (
        <div className="response" aria-live="polite">
          <h2>Response</h2>
          <p>{reply}</p>
        </div>
      )}
    </section>
  );
}
