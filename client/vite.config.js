import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/api/": {
                target: String(import.meta.env.VITE_BASE_URL),
                changeOrigin: true, // for CORS
                secure: false, // for using HTTP instead of HTTPS
            },
            "/uploads/": {
                target: String(import.meta.env.VITE_BASE_URL),
                changeOrigin: true,
                secure: false,
            },
        },
    },
});

