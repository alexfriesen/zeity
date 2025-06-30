<script setup>
const props = defineProps({
  error: Object,
})

const isDev = import.meta.dev
const is404 = computed(() => props.error?.statusCode === 404 || message.value?.includes('404'))
const title = computed(() => is404.value ? '404.title' : 'error.title')
const description = computed(() => is404.value ? '404.description' : 'error.description')
const message = computed(() => String(props.error?.message || ''))

const { t } = useI18n()
useSeoMeta({
  title: () => t(title.value),
  description: () => t(description.value),
  robots: 'noindex',
})

function handleError() {
  return clearError({ redirect: '/' })
}
</script>

<template>
  <NuxtLayout>
    <AppContent>
      <div class="grid place-content-center h-full p-4 gap-4">
        <div class="flex items-center gap-2 text-3xl">
          <UIcon name="i-lucide-octagon-alert" />
          {{ $t(title) }}
        </div>

        <div class="text-xl text-[var(--ui-text-dimmed)]">
          {{ $t(description) }}
        </div>

        <pre v-if="isDev" class="overflow-auto">{{ error }}</pre>

        <UButton block size="xl" @click="handleError">
          {{ $t('actions.back') }}
        </UButton>
      </div>
    </AppContent>
  </NuxtLayout>
</template>