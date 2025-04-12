<script setup lang="ts">
import { isAfter, isBefore } from 'date-fns';
import { calculateDiffSum, parseDate } from '@zeity/utils/date';

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
            (item) => {
                const timeStart = parseDate(item.start);

                return isAfter(timeStart, parseDate(dFilter.start)) &&
                    isBefore(timeStart, parseDate(dFilter.end));
            }
        );
    }

    if (projectFilters.value.length) {
        times = times.filter((item) =>
            pFilters?.some((project) => item.projectId?.includes(project)),
        );
    }

    return times;
});

const timeSum = computed(() => calculateDiffSum(filteredTimes.value));
</script>

<template>
    <div class="my-3 space-y-6">
        <section>
            <DateFilter v-model="dateFilter" />
            <ProjectFilter v-model="projectFilters" />
        </section>

        <UCard as="section">
            <template #header>
                <h2>{{ $t('reports.summary') }}</h2>
            </template>

            <TimeDurationFlowing v-model="timeSum" class="flex justify-center text-xl font-mono" />
        </UCard>

        <UCard as="section">
            <template #header>
                <h2>{{ $t('reports.report') }}</h2>
            </template>

            <ReportDownload :times="filteredTimes" />
        </UCard>
    </div>
</template>