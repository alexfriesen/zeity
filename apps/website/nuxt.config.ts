const isProd = process.env.NODE_ENV === 'production';
const baseUrl = 'https://www.zeity.co';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  future: {
    compatibilityVersion: 4,
    typescriptBundlerResolution: true,
  },
  experimental: {
    viewTransition: true,
  },
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/seo',
    '@nuxtjs/i18n',
    'nuxt-og-image',
    'nuxt-schema-org',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/ui',
    'nuxt-security',
  ],
  css: ['~/assets/css/main.css'],
  content: {
    experimental: {
      nativeSqlite: true,
    },
  },
  i18n: {
    baseUrl: baseUrl,
    strategy: 'prefix',
    detectBrowserLanguage: {
      redirectOn: 'root',
      useCookie: false,
    },
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
    bundle: {
      optimizeTranslationDirective: false,
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
  robots: {
    enabled: true,
    // allow: ['*'],
    disallow: ['*'],
  },
  security: {
    enabled: isProd,
    headers: {
      contentSecurityPolicy: {
        'upgrade-insecure-requests': false,
      },
    },
  },
  site: {
		url: baseUrl,
		name: 'zeity',
	},
  nitro: {
    static: true,
    prerender: {
      routes: ['/', '/robots.txt'],
    },
  },
  devServer: {
    port: 4000,
  },
  devtools: {
    enabled: true,
  },
});
