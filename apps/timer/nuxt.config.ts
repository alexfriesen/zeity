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
    '@pinia/nuxt',
    '@nuxt/ui',
    '@nuxt/image',
    'nuxt-time',
    'nuxt-security',
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
  runtimeConfig: {
    public: {
      version: packageJson.version || '0.0.0',
    }
  },
  devtools: { enabled: true },
});
