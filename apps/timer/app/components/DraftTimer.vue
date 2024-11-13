<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core'

import { formatDuration, timeDiff } from '@zeity/utils/date';
import { useTimerStore } from '~/stores/timerStore';

const {
    open: openDetails,
} = useTimeDetail();

const store = useTimerStore();
const { draft, isStarted } = storeToRefs(store);

const runningDuration = computed(() => {
    const start = draft.value?.start;
    if (start) {
        return formatDuration(timeDiff(now.value, start));
    }
    return '00:00:00';
});

const now = ref(new Date());

const { pause, resume } = useIntervalFn(() => {
    now.value = new Date();
}, 1000, { immediateCallback: true });

onMounted(() => {
    if (isStarted.value) {
        resume();
    }
});
onUnmounted(() => {
    pause();
});

watch(isStarted, (value) => {
    if (value === true) {
        resume();
    } else {
        pause();
    }
});
</script>

<template>
    <div class="relative mx-2 mb-2">
        <div v-if="isStarted" class="rounded-md bg-neutral-200 dark:bg-neutral-500 shadow">
            <UButton
                type="button" variant="ghost" color="neutral" class="w-full h-12" size="xl"
                @mouseup="() => draft && openDetails(draft)">
                <span class="font-mono text-2xl tabular-nums lining-nums tracking-wide">
                    {{ runningDuration }}
                </span>
            </UButton>
        </div>

        <div class="absolute bottom-1 right-1">
            <TimerToggleButton />
        </div>
    </div>
</template>
