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
  ],
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
