import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./resources/js/test/setup.ts'],
        include: ['**/*.{test,spec}.{ts,tsx}'],
        exclude: ['node_modules', 'vendor', 'storage', 'bootstrap/cache'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'resources/js/test/',
                '**/*.d.ts',
                '**/*.config.*',
                '**/mockData/',
                'dist/',
            ],
        },
    },
    resolve: {
        alias: {
            '@/css': path.resolve(__dirname, './resources/css'),
            '@/components': path.resolve(__dirname, './resources/js/components'),
            '@/layouts': path.resolve(__dirname, './resources/js/layouts'),
            '@/schemas': path.resolve(__dirname, './resources/js/schemas'),
            '@': path.resolve(__dirname, './resources/js'),
        },
    },
});

// Made with Bob
