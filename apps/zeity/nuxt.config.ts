// https://nuxt.com/docs/api/configuration/nuxt-config
import vuePlugin from '@vitejs/plugin-vue';

import packageJson from '../../package.json' with { type: 'json' };

const isProd = process.env.NODE_ENV === 'production';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  future: {
    compatibilityVersion: 4,
    typescriptBundlerResolution: true,
  },
  experimental: {
    asyncContext: true,
    typescriptPlugin: true,
  },
  modules: [
    '@nuxt/test-utils/module',
    '@nuxt/eslint',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@nuxt/ui',
    '@nuxt/image',
    'nuxt-security',
    'nuxt-auth-utils',
    '@vite-pwa/nuxt',
  ],
  css: ['~/assets/css/main.css'],
  pwa: {
    mode: isProd ? 'production' : 'development',
    disable: !isProd,
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
      globPatterns: ['**/*.{js,css,html,jpg,png,svg,ico}'],
      navigateFallback: undefined,
    },
    includeAssets: ['**/*.{js,css,html,jpg,png,svg,ico}'],
    injectManifest: {
      globPatterns: ['**/*.{js,css,html,jpg,png,svg,ico}'],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: !isProd,
      suppressWarnings: true,
      navigateFallback: '/',
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
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
  security: {
    enabled: isProd,
    headers: {
      contentSecurityPolicy: {
        'upgrade-insecure-requests': false,
      },
    },
  },
  routeRules: {
    '/user/**': {
      appMiddleware: ['auth'],
    },
    '/organisations/**': {
      appMiddleware: ['auth'],
    },
  },
  runtimeConfig: {
    DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/zeity',
    s3: {
      accessKey: 'minio',
      secretKey: 'minio123',
      endPoint: 'http://localhost:9000',
      bucket: 'zeity',
      region: 'auto',
    },
    mailer: {
      from: { email: 'noreply@zeity.dev', name: 'Zeity' },
      smtp: {
        host: 'localhost',
        port: 1025,
      },
    },
    jwtSecret: 'supersecret',
    public: {
      appName: 'zeity',
      stage: process.env.NODE_ENV || 'production',
      version: packageJson.version || '0.0.0',
      allow: {
        organisation: {
          create: booleanEnv(process.env.ZEITY_ALLOW_ORGANISATION_CREATE, true),
        },
      },
    },
    nitro: {
      envPrefix: 'ZEITY_',
    },
  },
  nitro: {
    compressPublicAssets: true,
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
    externals: {
      // bundle the S3 client in the server bundle as nitro does not support jsr packages yet
      // see: https://github.com/nitrojs/nitro/issues/3034
      inline: ['@bradenmacdonald/s3-lite-client'],
    },
  },
  devtools: { enabled: true },
});

function booleanEnv(value: string | undefined, defaultValue = false) {
  if (value === undefined) {
    return defaultValue;
  }
  return value.toLowerCase() === 'true';
}
