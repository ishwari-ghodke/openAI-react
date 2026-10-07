import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Forward /api calls to the Express server so the browser never sees the API key.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { "/api": "http://localhost:3001" },
  },
});
