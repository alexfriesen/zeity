<script setup lang="ts">
import { isAfter, isBefore } from 'date-fns';
import { PROJECT_STATUS_ACTIVE } from '@zeity/types';
import { calculateDiffSum, parseDate, toISOString, type DateLike } from '@zeity/utils/date';

import type { DateRange } from '~/types/date-filter';

const dateFilter = ref<DateRange>();
const projectFilters = ref<string[]>([]);

const { loadTimes } = useTime();
const { loadProjects } = useProject();
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

async function loadAllTimes(range: DateRange, projectIds: string[], limit = 100) {
    let offset = 0;
    let endReached = false;
    while (!endReached) {
        const times = await loadTimes({
            limit,
            offset,
            projectId: projectIds,
            rangeStart: toISOString(range.start),
            rangeEnd: toISOString(range.end),
        });

        offset += limit;
        if ((times?.length ?? 0) < limit) {
            endReached = true;
        }
    }
}

async function loadAllActiveProjects(status = [PROJECT_STATUS_ACTIVE], limit = 100) {
    let offset = 0;
    let endReached = false;
    while (!endReached) {
        const projects = await loadProjects({
            limit,
            offset,
            status,
        });

        offset += limit;
        if ((projects?.length ?? 0) < limit) {
            endReached = true;
        }
    }
}

onMounted(async () => {
    await loadAllActiveProjects();
});

watch([dateFilter, projectFilters], async ([dateRange, projects]) => {
    if (dateRange && dateRange.start && dateRange.end) {
        await loadAllTimes(dateRange, projects);
    }
});
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