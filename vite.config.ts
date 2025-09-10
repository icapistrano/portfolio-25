import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), glsl()],
  server: {
    host: true, // or '0.0.0.0'
    port: 5173, // optional, default is 5173
  },
  base: "/",
});
