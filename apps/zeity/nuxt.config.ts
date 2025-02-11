// https://nuxt.com/docs/api/configuration/nuxt-config

import packageJson from '../../package.json' with { type: 'json' }

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  future: {
    compatibilityVersion: 4,
  },
  modules: [
    '@nuxt/test-utils/module',
    '@nuxt/eslint',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@nuxt/ui',
    '@nuxt/image',
    'nuxt-time',
    'nuxt-security',
    '@vite-pwa/nuxt',
  ],
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
  i18n: {
    strategy: 'no_prefix',
    detectBrowserLanguage: false,
    locales: [
      {
        code: 'de',
        name: 'Deutsch'
      }, {
        code: 'en',
        name: 'English'
      }
    ],
    defaultLocale: 'en',
  },
  icon: {
    customCollections: [
      {
        prefix: 'zeity',
        dir: './public/icons'
      },
    ],
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
  runtimeConfig: {
    public: {
      version: packageJson.version || '0.0.0',
    }
  },
  devtools: { enabled: true },
});
