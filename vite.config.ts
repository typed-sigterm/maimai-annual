import { fileURLToPath, URL } from 'node:url';
import pluginTailwindcss from '@tailwindcss/vite';
import pluginLegacy from '@vitejs/plugin-legacy';
import pluginVue from '@vitejs/plugin-vue';
import postcssEnv from 'postcss-preset-env';
import pluginIcons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    pluginLegacy(),
    pluginVue(),
    pluginTailwindcss(),
    pluginIcons(),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~': fileURLToPath(new URL('.', import.meta.url)),
    },
  },

  css: {
    postcss: {
      plugins: [
        postcssEnv({
          features: {
            'oklab-function': true,
          },
        }),
      ],
    },
  },

  envPrefix: ['VITE_', 'MAI_'],

  server: {
    port: 8308,
  },
});
