import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
            },
        },
    },
    css: {
        postcss: './postcss.config.ts',
    },
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.json']
    }
});
