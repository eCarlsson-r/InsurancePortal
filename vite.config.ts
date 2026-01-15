import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        wayfinder({
            path: 'resources/js/wayfinder',
            formVariants: true,
        }),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    resolve: {
        alias: {
            '@/css': path.resolve(__dirname, './resources/css'),
            '@/components': path.resolve(__dirname, './resources/js/components'),
            '@/layouts': path.resolve(__dirname, './resources/js/layouts'),
            '@/schemas': path.resolve(__dirname, './resources/js/schemas')
        },
    }
});
