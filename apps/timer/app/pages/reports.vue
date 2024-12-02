<script setup lang="ts">
import { isAfter, isBefore } from 'date-fns';
import { calculateDiffSum, formatDuration, parseDate } from '@zeity/utils/date';

import type { DateRange } from '~/types/date-filter';

const dateFilter = ref<DateRange>();
const projectFilters = ref<string[]>([]);

const timeStore = useTimerStore();

const allTimes = timeStore.getAllTimes();
const filteredTimes = computed(() => {
    const dFilter = dateFilter.value;
    const pFilters = projectFilters.value;
    let times = [...allTimes.value];

    if (dFilter && dFilter.start && dFilter.end) {
        times = times.filter(
            (item) =>
                isAfter(parseDate(item.start), parseDate(dFilter.start)) &&
                isBefore(parseDate(item.end), parseDate(dFilter.end)),
        );
    }

    if (projectFilters.value.length) {
        times = times.filter((item) =>
            pFilters?.some((project) => item.projectId?.includes(project)),
        );
    }

    return times;
});

const timeSum = computed(() => formatDuration(calculateDiffSum(filteredTimes.value)));
</script>

<template>

    <UContainer class="my-3 space-y-6">
        <section>
            <DateFilter v-model="dateFilter" />
            <ProjectFilter v-model="projectFilters" />
        </section>

        <UCard as="section">
            <template #header>
                <h2>{{ $t('reports.summary') }}</h2>
            </template>

            <div class="text-center text-xl font-mono">{{ timeSum }}</div>
        </UCard>

        <UCard as="section">
            <template #header>
                <h2>{{ $t('reports.report') }}</h2>
            </template>

            <ReportDownload :times="filteredTimes" />
        </UCard>
    </UContainer>

</template>