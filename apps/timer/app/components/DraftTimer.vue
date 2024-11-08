<script setup lang="ts">
import { formatDuration, timeDiff } from '@timer/utils/date';
import { useTimerStore } from '~/stores/timerStore';

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
let interval: ReturnType<typeof setInterval> | undefined;

function startInterval() {
    now.value = new Date();
    interval = setInterval(() => {
        now.value = new Date();
    }, 1000);
}
onMounted(() => {
    if (isStarted.value) {
        startInterval();
    }
});
onUnmounted(() => {
    clearInterval(interval);
});
watch(isStarted, (value) => {
    if (value === true) {
        startInterval();
    } else {
        clearInterval(interval);
    }
});

function openDetails() {
    //TODO: open details
}
</script>

<template>
    <div class="relative mx-2 mb-2">
        <div v-if="isStarted" class="rounded-md bg-gray-200 dark:bg-gray-500 shadow">
            <UButton type="button" variant="ghost" color="gray" class="w-full" @mouseup="openDetails">
                <div class="flex items-center">
                    <p class="font-mono font-light text-4xl">
                        <span class="">{{ runningDuration }}</span>
                    </p>
                </div>
            </UButton>
        </div>

        <div class="absolute bottom-1 right-1">
            <TimerToggleButton />
        </div>
    </div>
</template>
