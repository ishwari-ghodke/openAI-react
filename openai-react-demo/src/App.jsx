import AskOpenAI from "./components/AskOpenAI.jsx";

export default function App() {
  return (
    <main className="page">
      <h1>Ask OpenAI</h1>
      <p className="subtitle">Type a prompt, send it to the OpenAI API, and see the response.</p>
      <AskOpenAI />
    </main>
  );
}
