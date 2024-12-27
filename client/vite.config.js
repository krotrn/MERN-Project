import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/api/": {
                target: "https://mern-project-k8u0.onrender.com",
                changeOrigin: true, // for CORS
                secure: false, // for using HTTP instead of HTTPS
            },
            "/uploads/": {
                target: "import.meta.env.BASE_URL",
                changeOrigin: true,
                secure: false,
            },
        },
    },
});

