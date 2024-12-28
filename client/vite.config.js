import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import process from 'node:process';

export default defineConfig(({ mode }) => {
  // Load environment variables from the client/.env file
  const env = loadEnv(mode, process.cwd() + "/client");

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api/": {
          target: env.VITE_API_URL || "http://localhost:3000", // Use loaded env variable or fallback
          changeOrigin: true,
          secure: false,
        },
        "/uploads/": {
          target: env.VITE_API_URL || "http://localhost:3000", // Use loaded env variable or fallback
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
