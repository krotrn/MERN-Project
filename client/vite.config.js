import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/api/": {
                target: "https://mern-project-k8u0.onrender.com",
                changeOrigin: true,
                secure: false,
            },
            "/uploads/": {
                target: "https://mern-project-k8u0.onrender.com",
                changeOrigin: true,
                secure: false,
            },
        },
    },
});


