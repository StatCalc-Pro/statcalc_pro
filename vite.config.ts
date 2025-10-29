import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Use absolute base so assets are referenced from the site root.
  // Relative base ("./") causes asset requests to be relative to the
  // current URL path which breaks client-side routed pages on Vercel
  // (they try to load e.g. /dashboard/assets/...).
  base: "/",
   build: {
    outDir: 'dist', // pasta de saída do build
  },
  server: {
    host: "::",
    port: 8080,
    // Proxy /api calls to a local backend during development
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
