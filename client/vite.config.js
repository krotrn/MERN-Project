import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import {API_URL} from './src/redux/constants.js'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/api/": {
                target: API_URL,
                changeOrigin: true,
                secure: false,
            },
            "/uploads/": {
                target:API_URL,
                changeOrigin: true,
                secure: false,
            },
        },
    },
});


