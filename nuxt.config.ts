import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    css: ['~/assets/scss/main.scss'],
    modules: ['vuetify-nuxt-module', '@pinia/nuxt'],

    alias: {
        '@': resolve(__dirname, './'),
        '~': resolve(__dirname, './'),
        '@@': resolve(__dirname, './'),
        '~~': resolve(__dirname, './'),
    },
});
