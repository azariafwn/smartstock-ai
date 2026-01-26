import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // <-- Pastikan baris ini ADA

export default defineConfig({
    server: {
        watch: {
            usePolling: true, // Paksa Vite mengecek perubahan secara berkala
        },
    },
    plugins: [
        tailwindcss(), // Sekarang ini sudah terdefinisi
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
});