// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  future: {
    compatibilityVersion: 4,
  },
  modules: [
    '@nuxt/eslint',
    '@vite-pwa/nuxt',
    '@pinia/nuxt',
    '@nuxt/ui',
    '@nuxt/image',
    'nuxt-time',
  ],
  ssr: false,
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      id: 'zeity-pwa',
      start_url: '/',
      name: 'zeity Time Tracker',
      short_name: 'zeity',
      description: 'A simple timer app',
      theme_color: '#000000',
      display: 'standalone',
      lang: 'en',
    },
    devOptions: {
      enabled: true,
    },
  },
  icon: {
    clientBundle: {
      scan: true,
    },
    provider: 'iconify',
  },
  routeRules: {
    '/': {
      ssr: false,
      prerender: false,
    },
  },
  devtools: { enabled: true },
});
