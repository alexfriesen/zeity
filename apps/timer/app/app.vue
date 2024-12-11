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
  }
})

</script>

<template>

  <Head>
    <Title>zeity</Title>
  </Head>

  <UApp :locale="uiLocale">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>

</template>

<style>
@import "tailwindcss";
@import "@nuxt/ui";

html,
body {
  height: 100%;
}

#__nuxt {
  display: contents;
}
</style>