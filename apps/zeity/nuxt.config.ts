// https://nuxt.com/docs/api/configuration/nuxt-config
import vuePlugin from '@vitejs/plugin-vue';

import packageJson from '../../package.json' with { type: 'json' };

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  future: {
    compatibilityVersion: 4,
    typescriptBundlerResolution: true,
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
    '@vite-pwa/nuxt',
  ],
  pwa: {
    strategies: 'generateSW',
    registerType: 'autoUpdate',
    manifest: {
      name: 'zeity Time Tracker',
      short_name: 'zeity',
      description: 'Time tracking app app with excellent user experience',
      theme_color: '#00bbff',
      display: 'standalone',
      lang: 'en',
      icons: [
        {
          src: 'favicon.svg',
          sizes: 'any',
          type: 'image/svg+xml',
        },
        {
          src: 'icons/logo-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'icons/logo-512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'icons/logo-maskable.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,jpg,png,svg,ico}"],
    },
    injectManifest: {
      globPatterns: ['**/*.{js,css,html,jpg,png,svg,ico}'],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallback: '/',
      navigateFallbackAllowlist: [/^\/$/],
    },
  },
  i18n: {
    lazy: true,
    strategy: 'no_prefix',
    detectBrowserLanguage: false,
    locales: [
      {
        code: 'de',
        name: 'Deutsch',
      },
      {
        code: 'en',
        name: 'English',
      },
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
        dir: './public/icons',
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
      },
    },
  },
  runtimeConfig: {
    DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/zeity',
    mailer: {
      from: 'Zeity <noreply@localhost>',
      smtp: {
        host: 'localhost',
        port: 1025,
      },
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
      plugins: [vuePlugin()],
    },
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
  },
  devtools: { enabled: true },
});