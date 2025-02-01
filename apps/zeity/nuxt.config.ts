// https://nuxt.com/docs/api/configuration/nuxt-config
import vue from '@vitejs/plugin-vue'

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
    'nuxt-auth-utils',
  ],
  i18n: {
    lazy: true,
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
    experimental: {
      generatedLocaleFilePathFormat: 'relative',
    },
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
  auth: {
    webAuthn: true,
  },
  routeRules: {
    '/user/verify': {
      security: {
        rateLimiter: {
          tokensPerInterval: 3,
          interval: 10000,
        },
      }
    },
  },
  runtimeConfig: {
    DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/zeity', 
    mailer: {
      from: 'Zeity <noreply@localhost>',
      smtp: {
        host: 'localhost',
        port: 1025,
      }
    },
    jwtSecret: 'supersecret',
    public: {
      version: packageJson.version || '0.0.0',
    },
  },
  nitro: {
    experimental: {
      tasks: true,
    },
    rollupConfig: {
      // @ts-expect-error: this is fine
      plugins: [vue()],
    },
  },
  devtools: { enabled: true },
});