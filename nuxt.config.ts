export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
  ],

  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      title: '舞萌 2025 年度报告',
    },
  },

  ssr: false,

  css: ['~/app.css'],

  routeRules: {
    '/': { prerender: true },
  },

  compatibilityDate: '2026-05-30',

  typescript: {
    nodeTsConfig: {
      compilerOptions: {
        types: ['bun'],
      },
      include: ['../scripts/*.ts'],
    },
  },

  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        '@vueuse/components',
        '@vueuse/core',
        'mixpanel-browser',
      ],
    },
  },

  fonts: {
    provider: 'bunny',
    providers: {
      google: false,
      googleicons: false,
    },
  },

  icon: {
    clientBundle: {
      scan: true,
    },
  },
});
