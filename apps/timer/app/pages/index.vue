<script setup lang="ts">
import { sortDatesDescending } from '@zeity/utils/date';

import { useTimerStore } from '~/stores/timerStore';

const timeDetail = useTimeDetail();
const timerStore = useTimerStore();
const allTimes = timerStore.times.getAll();
const sortedTimes = computed(() => allTimes.value.toSorted((a, b) => sortDatesDescending(a.start, b.start)));
const isEmpty = computed(() => allTimes.value.length < 1);

function timeNew() {
    const now = new Date().toISOString();
    timeDetail.open({ id: 'new', start: now, end: now, notes: '' });
}
</script>

<template>
    <UContainer class="flex flex-col h-full">

        <TimeDrawer />

        <section class="grow p-3 my-3">
            <TimeList default-open class="mb-4" :times="sortedTimes" />

            <UAlert v-if="isEmpty" variant="subtle" title="Hey there!"
                description="It looks like you haven't tracked any time yet. Start tracking time by clicking the button below."
                icon="i-lucide-info" :ui="{ icon: 'size-20' }" :actions="[
                    { label: `${timerStore.isStarted ? 'Stop' : 'Start'} time tracker`, icon: 'i-lucide-play', onClick: timerStore.toggleDraft },
                    { label: 'Add time', icon: 'i-lucide-plus', onClick: timeNew }
                ]" />
        </section>

        <footer class="sticky bottom-3">
            <DraftTimer />
        </footer>

    </UContainer>
</template>
