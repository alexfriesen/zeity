<script setup lang="ts">
import { calculateDiffSum, dayDiff, formatDate, formatDuration, formatRelativeDate, sortDatesDescending, timeDiff, toStartOfDay, type DateLike, } from '@timer/utils/date';

import type { Time } from '~/types/time';
import { useTimerStore } from '~/stores/timerStore';

const timerStore = useTimerStore();
const allTimes = timerStore.times.getAll();
const sortedTimes = computed(() => allTimes.value.toSorted((a, b) => sortDatesDescending(a.start, b.start)));

const { language } = storeToRefs(useSettingsStore());

const currentDetail = ref<Time | null>(null);

const groups = computed(() => {
    const all = sortedTimes.value || [];

    const groups: Record<string, { label: string, data: Time[] }> = {};
    for (let i = 0; i < all.length; i++) {
        const item = all[i];
        if (!item) continue;

        const key = getGroupKey(item.start);
        if (!groups[key]) {
            groups[key] = { label: key, data: [] };
        }
        groups[key].data.push(item);
    }

    return groups;
});

function getGroupKey(date: DateLike): string {
    const now = new Date()
    const diff = dayDiff(date, now);

    if (diff < 2) {
        return formatRelativeDate(now, toStartOfDay(date), language.value);
    }

    return formatDate(toStartOfDay(date), language.value);
}

const detailOpen = ref(false);
function openDetail(time: Time) {
    currentDetail.value = time;
    detailOpen.value = true;
}
</script>

<template>
    <div class="page">
        <UDrawer v-model:open="detailOpen">
            <UButton label="Open" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-up" />
            <template #content>
                {{ currentDetail?.id }}
            </template>
        </UDrawer>
        <section class="main">
            <Accordion v-for="group in groups" :key="group.label" class="mb-4">
                <AccordionItem class="m-1" :label="group.label"
                    :description="formatDuration(calculateDiffSum(group.data))">
                    <UButton v-for="time in group.data" :key="time.id" type="button" variant="ghost"
                        class="w-full flex items-center justify-between gap-2" @click="() =>
                            openDetail(time)">

                        <div>
                            <span class="text-xs text-neutral-400 dark:text-neutral-500">
                                {{ time.notes || 'Add Notes' }}
                            </span>
                        </div>

                        <div class="duration">
                            <span class="font-sans text-md text-neutral-700 dark:text-neutral-200">
                                {{ formatDuration(timeDiff(time.end, time.start)) }}
                            </span>
                        </div>
                    </UButton>
                </AccordionItem>
            </Accordion>
        </section>

        <footer class="footer">
            <DraftTimer />
        </footer>
    </div>
</template>

<style scoped>
.page {
    height: 100%;

    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
    grid-template-areas:
        'main'
        'footer';
}

.main {
    grid-area: main;
    overflow: auto;
    padding: 0.725rem;
}

.footer {
    grid-area: footer;
}
</style>
