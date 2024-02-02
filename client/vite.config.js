import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), nodePolyfills()],
    build: {
        chunkSizeWarningLimit: 2600,
    },
    server: {
        host: true,
        strictPort: true,
        port: 8080,
    },
});
