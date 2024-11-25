// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  future: {
    compatibilityVersion: 4,
  },
  modules: [
    '@nuxt/test-utils/module',
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@nuxt/ui',
    '@nuxt/image',
    'nuxt-time',
  ],
  icon: {
    clientBundle: {
      scan: true,
    },
    provider: 'iconify',
  },
  colorMode: {
    storageKey: 'zeity-color-mode',
  },
  routeRules: {
    '**': {
      prerender: true,
    },
  },
  devtools: { enabled: true },
});
