import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/api/": {
                target: import.meta.env.VITE_BASE_URL || "http://localhost:3000",
                changeOrigin: true,
                secure: false,
            },
            "/uploads/": {
                target: import.meta.env.VITE_BASE_URL || "http://localhost:3000",
                changeOrigin: true,
                secure: false,
            },
        },
    },
});


