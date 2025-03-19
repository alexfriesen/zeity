<script setup lang="ts">
import { de, en } from '@nuxt/ui/locale';

const locales = {
  en,
  de,
}

const appConfig = useAppConfig()
const settingsStore = useSettingsStore();

const { locale, themePrimary } = storeToRefs(settingsStore);

watch(themePrimary, (value) => {
  appConfig.ui.colors.primary = value;
}, { immediate: true });

const uiLocale = computed(() => {
  return locales[locale.value || 'en'];
});

const lang = computed(() => locales[locale.value].code)
const dir = computed(() => locales[locale.value].dir)
useHead({
  htmlAttrs: {
    lang,
    dir
  },
  title: 'zeity',
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon.png' },
  ],
})

</script>

<template>

  <Head>
    <NuxtPwaManifest />
  </Head>

  <UApp :locale="uiLocale">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>

</template>
