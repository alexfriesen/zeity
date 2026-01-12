<script setup lang="ts">
import { TIME_TYPE_BREAK } from '@zeity/types';
import { useTimerStore } from '~/stores/timerStore';

const store = useTimerStore();
const { toggleDraft, startDraft, stopDraft } = useTime();
const { isStarted, loading, draft } = storeToRefs(store);

const icon = computed(() =>
    isStarted.value ? 'i-lucide-square' : 'i-lucide-play'
);
const tooltipText = computed(() =>
    isStarted.value ? 'Stop timer' : 'Start timer'
);

const isBreakDraft = computed(() =>
    draft.value?.type === TIME_TYPE_BREAK
);

async function onToggle() {
    store.setLoading(true);
    await toggleDraft();
    store.setLoading(false);
}

async function onStartBreak() {
    store.setLoading(true);
    await stopDraft();
    await startDraft({ type: TIME_TYPE_BREAK });
    store.setLoading(false);
}
async function onStopBreak() {
    store.setLoading(true);
    await stopDraft();
    await startDraft();
    store.setLoading(false);
}
</script>

<template>
    <div class="flex items-center gap-2">
        <template v-if="isStarted && isBreakDraft">
            <UTooltip :text="$t('times.break.stop')">
                <UButton square size="md" color="neutral" class="rounded-full shadow-md" icon="i-lucide-square"
                    :disabled="loading" :aria-label="$t('times.break.stop')" @click="onToggle" />
            </UTooltip>
            <UTooltip :text="$t('times.break.continue')">
                <UButton square size="xl" class="rounded-full shadow-lg" icon="i-lucide-play" :disabled="loading"
                    :aria-label="$t('times.break.continue')" @click="onStopBreak" />
            </UTooltip>
        </template>
        <template v-else>
            <UTooltip :text="$t('times.break.start')">
                <UButton v-if="isStarted && !isBreakDraft" square size="md" color="neutral" icon="i-lucide-coffee"
                    class="rounded-full shadow-md" :disabled="loading" :aria-label="$t('times.break.start')"
                    @click="onStartBreak" />
            </UTooltip>
            <UTooltip :text="tooltipText">
                <UButton square size="xl" class="rounded-full shadow-lg" :disabled="loading" :aria-label="tooltipText"
                    :icon="icon" @click="onToggle" />
            </UTooltip>
        </template>
    </div>
</template>