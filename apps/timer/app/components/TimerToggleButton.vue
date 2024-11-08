<script setup lang="ts">
import { useTimerStore } from '~/stores/timerStore';

const store = useTimerStore();
const { isStarted, loading } = storeToRefs(store);

const icon = computed(() =>
    isStarted.value ? 'i-heroicons-stop-20-solid' : 'i-heroicons-play-20-solid'
);
const tooltipText = computed(() =>
    isStarted.value ? 'Stop timer' : 'Start timer'
);

function onToggle() {
    store.setLoading(true);
    store.toggleDraft();
    store.setLoading(false);
}
</script>

<template>
    <UButton square size="xl" class="rounded-full" :disabled="loading" :aria-label="tooltipText" :icon="icon"
        @click="onToggle" />
</template>