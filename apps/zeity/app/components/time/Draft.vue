<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core'

import { nowWithoutMillis, timeDiff } from '@zeity/utils/date';
import { useTimerStore } from '~/stores/timerStore';

const {
    open: openDetails,
} = useTimeDetail();

const store = useTimerStore();
const { draft, isStarted } = storeToRefs(store);

const diff = computed(() => {
    const start = draft.value?.start;
    if (start) {
        return timeDiff(now.value, start);
    }
    return 0;
});

const now = ref(nowWithoutMillis());

const { pause, resume } = useIntervalFn(() => {
    now.value = nowWithoutMillis();
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
    <div class="relative mx-2">
        <div v-if="isStarted" class="rounded-md shadow bg-[var(--ui-bg-accented)]">
            <UButton type="button" variant="ghost" color="neutral" class="w-full h-12" size="xl"
                @mouseup="() => draft && openDetails(draft)">
                <TimeDurationFlowing v-model="diff" class="font-mono text-2xl tabular-nums lining-nums tracking-wide" />
            </UButton>
        </div>

        <div class="absolute bottom-1 right-1">
            <TimeToggleButton />
        </div>
    </div>
</template>
