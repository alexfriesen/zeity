<script setup lang="ts">
import { de, en } from '@nuxt/ui/locale';

const locales = {
  en,
  de,
}

const settingsStore = useSettingsStore();
const { locale, themePrimary } = storeToRefs(settingsStore);

watch(themePrimary, (value) => {
  updateAppConfig({
    ui: {
      colors: {
        primary: value || 'sky',
      },
    },
  });
}, { immediate: true });

const isDev = import.meta.dev;
const uiLocale = computed(() => locales[locale.value] || en);
const lang = computed(() => uiLocale.value.code)
const dir = computed(() => uiLocale.value.dir)

useHead({
  htmlAttrs: {
    lang,
    dir
  },
  title: useRuntimeConfig().public.appName,
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon.png' },
  ],
})

</script>

<template>

  <Head>
    <NuxtPwaManifest v-if="!isDev" />
  </Head>

  <UApp :locale="uiLocale">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>

</template>
