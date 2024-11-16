<script setup lang="ts">
const appConfig = useAppConfig()
const settingsStore = useSettingsStore();

const { themePrimary } = storeToRefs(settingsStore);

watch(themePrimary, (value) => {
  appConfig.ui.colors.primary = value;
}, { immediate: true });
</script>

<template>

  <Head>
    <Title>zeity</Title>
  </Head>

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

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